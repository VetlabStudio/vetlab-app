import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const PRIX_PRO = [
  Deno.env.get('STRIPE_PRICE_PRO_MENSUEL'),
  Deno.env.get('STRIPE_PRICE_PRO_ANNUEL'),
].filter(Boolean) as string[]

const SIEGES_MIN = 2
const SIEGES_MAX = 200

// Statuts où un abonnement existe encore et peut être facturé.
const STATUTS_EN_COURS = ['active', 'trialing', 'past_due', 'unpaid', 'paused']

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  /* Le forfait d'un membre vient de l'équipe d'un autre. S'il
     payait Pro en plus, le webhook ignorerait cet abonnement :
     il paierait pour rien. On ne compte que les équipes dont le
     propriétaire a encore un forfait Équipe actif. */
  async function membreDuneEquipeActive(userId: string): Promise<boolean> {
    const { data: lignes } = await supabase.from('membres_equipe').select('equipe_id').eq('user_id', userId)
    if (!lignes?.length) return false
    const { data: equipes } = await supabase
      .from('equipes').select('proprietaire_id').in('id', lignes.map(l => l.equipe_id))
    const proprios = (equipes || []).map(e => e.proprietaire_id).filter(id => id && id !== userId)
    if (!proprios.length) return false
    const { data: actifs } = await supabase.from('profiles').select('id').in('id', proprios).eq('plan', 'equipe')
    return Boolean(actifs?.length)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return json({ error: 'Non autorisé' }, 401)

  let priceId: unknown
  let quantiteDemandee: unknown
  try {
    const corps = await req.json()
    priceId = corps?.priceId
    quantiteDemandee = corps?.quantity
  } catch {
    return json({ error: 'Requête invalide.' }, 400)
  }

  // ─── Le prix et la quantité viennent du navigateur : on les valide ici.
  if (!PRIX_PRO.length) {
    console.error('create-checkout: STRIPE_PRICE_PRO_MENSUEL et STRIPE_PRICE_PRO_ANNUEL ne sont pas configurés.')
  }
  const estEquipe = Boolean(PRICE_EQUIPE) && priceId === PRICE_EQUIPE
  const estPro = typeof priceId === 'string' && PRIX_PRO.includes(priceId)
  if (!estEquipe && !estPro) return json({ error: 'Forfait invalide.' }, 400)

  let quantity = 1
  if (estEquipe) {
    const q = Number(quantiteDemandee)
    if (!Number.isInteger(q) || q < SIEGES_MIN || q > SIEGES_MAX) {
      return json({ error: `Le nombre de sièges doit être entre ${SIEGES_MIN} et ${SIEGES_MAX}.` }, 400)
    }
    quantity = q
  }

  if (await membreDuneEquipeActive(user.id)) {
    return json({ error: 'Vous faites déjà partie d\'une clinique : votre accès est inclus dans son forfait.' }, 409)
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, nom')
    .eq('id', user.id)
    .single()

  let customerId = profil?.stripe_customer_id

  if (customerId) {
    try {
      const existing = await stripe.customers.retrieve(customerId)
      if ((existing as Stripe.DeletedCustomer).deleted) customerId = null
    } catch {
      customerId = null
    }
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profil?.email || user.email,
      name: profil?.nom || '',
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  } else {
    /* Avant, on annulait ici l'abonnement en cours, avant même que
       le nouveau paiement soit fait. Un double clic juste après un
       paiement, pendant que le webhook n'avait pas encore mis le
       profil à jour, annulait l'abonnement qui venait d'être payé.
       Maintenant on refuse simplement d'en créer un deuxième. */
    const existants = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 })
    if (existants.data.some(s => STATUTS_EN_COURS.includes(s.status))) {
      return json({
        error: 'Vous avez déjà un abonnement en cours. Gérez-le depuis le portail de facturation.',
      }, 409)
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId as string, quantity }],
    allow_promotion_codes: true,
    payment_method_collection: 'if_required',
    locale: 'fr',
    ui_mode: 'embedded',
    return_url: `${req.headers.get('origin')}/abonnement?paiement=succes`,
  })

  return json({ clientSecret: session.client_secret })
})
