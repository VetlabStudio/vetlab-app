import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/* ════════════════════════════════════════════════════════════
   Deux paramètres facultatifs, tous deux à false par défaut :
   un appel sans corps de requête se comporte exactement comme
   avant, donc le bouton d'annulation de la page Abonnement
   n'a pas à changer.

   aFinDePeriode : au lieu de couper tout de suite, l'abonnement
     court jusqu'à la fin de la période déjà payée. Personne
     n'est refacturé, personne ne perd de jours, et il n'y a
     aucun remboursement au prorata à traiter.

   exclureEquipe : ne touche pas à l'abonnement Équipe. Sans ce
     garde-fou, annuler « le Pro » de quelqu'un qui possède une
     clinique couperait l'abonnement de toute son équipe, et le
     webhook rétrograderait chacun de ses membres.

   rembourserProrata : annule tout de suite et rembourse la portion
     non utilisée de la période payée, sur le moyen de paiement
     d'origine. Sert quand une personne Pro rejoint une clinique :
     elle ne doit pas payer pour des mois qu'elle n'utilisera pas.
   ════════════════════════════════════════════════════════════ */

/* Annule tout de suite, puis rembourse la part non utilisée de la
   facture payée pour la période en cours. L'annulation passe en
   premier : un remboursement suivi d'un échec d'annulation laisserait
   la carte se faire prélever au renouvellement. Retourne le montant
   remboursé, en cents. */
async function annulerEtRembourser(sub: Stripe.Subscription): Promise<number> {
  const periodePayee = sub.status === 'active' || sub.status === 'trialing'
  await stripe.subscriptions.cancel(sub.id, {
    prorate: false,
    cancellation_details: { comment: 'rejoint_equipe' },
  })
  if (!periodePayee) return 0

  const debut = sub.current_period_start
  const fin = sub.current_period_end
  const maintenant = Math.floor(Date.now() / 1000)
  if (fin <= maintenant || fin <= debut) return 0

  /* La facture payée de la période en cours seulement (une de ses
     lignes se termine à la fin de la période). Un essai gratuit ou
     un code promo à 100 % donne amount_paid à 0 : rien à rembourser. */
  const factures = await stripe.invoices.list({ subscription: sub.id, status: 'paid', limit: 5 })
  const facture = factures.data.find(f =>
    f.amount_paid > 0 && f.payment_intent && f.lines.data.some(l => l.period?.end === fin)
  )
  if (!facture) return 0

  const portion = (fin - maintenant) / (fin - debut)
  const montant = Math.min(Math.floor(facture.amount_paid * portion), facture.amount_paid)
  if (montant < 1) return 0

  try {
    await stripe.refunds.create({
      payment_intent: facture.payment_intent as string,
      amount: montant,
      reason: 'requested_by_customer',
      metadata: { motif: 'rejoint_equipe', abonnement: sub.id },
    }, { idempotencyKey: `prorata-rejoint-equipe-${sub.id}` })
  } catch (err) {
    console.error(`FACTURATION À VÉRIFIER: ${sub.id} annulé, mais remboursement de ${montant / 100} $ impossible.`, err)
    return 0
  }
  return montant
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Non autorisé', { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authError || !user) return new Response('Non autorisé', { status: 401 })

  // Un appel sans corps garde le comportement historique.
  let aFinDePeriode = false
  let exclureEquipe = false
  let rembourserProrata = false
  try {
    const corps = await req.json()
    aFinDePeriode = corps?.aFinDePeriode === true
    exclureEquipe = corps?.exclureEquipe === true
    rembourserProrata = corps?.rembourserProrata === true
  } catch {
    /* pas de corps de requête, on reste sur les valeurs par défaut */
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profil?.stripe_customer_id) {
    return new Response(JSON.stringify({ ok: true, annules: 0, message: 'Aucun abonnement Stripe trouvé' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  /* Tout abonnement qui n'est pas terminé, pas seulement active et
     trialing : un abonnement past_due ou unpaid continue de tenter
     des prélèvements sur la carte. */
  const liste = await stripe.subscriptions.list({
    customer: profil.stripe_customer_id,
    status: 'all',
    limit: 100,
  })
  const tous = liste.data.filter(s => s.status !== 'canceled' && s.status !== 'incomplete_expired')

  const estEquipe = (sub: Stripe.Subscription) =>
    Boolean(PRICE_EQUIPE) && sub.items.data.some(i => i.price?.id === PRICE_EQUIPE)

  const aAnnuler = exclureEquipe ? tous.filter(s => !estEquipe(s)) : tous
  const ignores = tous.length - aAnnuler.length

  const echecs: string[] = []
  let rembourse = 0
  for (const sub of aAnnuler) {
    try {
      if (rembourserProrata) {
        rembourse += await annulerEtRembourser(sub)
        continue
      }
      /* La fin de période n'a de sens que pour une période payée.
         Un abonnement impayé est annulé tout de suite, sinon Stripe
         continuerait de réessayer le prélèvement jusqu'à la fin. */
      const periodePayee = sub.status === 'active' || sub.status === 'trialing'
      if (aFinDePeriode && periodePayee) {
        await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true })
      } else {
        await stripe.subscriptions.cancel(sub.id)
      }
    } catch (err) {
      console.error(`cancel-pro-subscription: échec sur ${sub.id}`, err)
      echecs.push(sub.id)
    }
  }

  const annules = aAnnuler.length - echecs.length
  console.log(
    `cancel-pro-subscription: ${annules} abonnement(s) ${aFinDePeriode ? 'programmés en fin de période' : 'annulés'} ` +
    `pour user ${user.id}${ignores ? `, ${ignores} ignoré(s) (équipe)` : ''}${echecs.length ? `, ${echecs.length} en échec` : ''}` +
    (rembourserProrata ? `, ${rembourse / 100} $ remboursés au prorata` : '')
  )

  return new Response(JSON.stringify({
    ok: echecs.length === 0,
    annules,
    ignores,
    echecs,
    rembourse,
    // Conservé pour les appels existants qui lisent `cancelled`.
    cancelled: annules,
  }), {
    status: echecs.length === 0 ? 200 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
