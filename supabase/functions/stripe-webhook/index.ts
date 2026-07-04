import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Format dans Supabase env vars: "price_abc:5,price_def:10,price_ghi:20"
const PRIX_EQUIPE: Record<string, number> = {}
const envPrix = Deno.env.get('STRIPE_PRIX_EQUIPE') || ''
envPrix.split(',').filter(Boolean).forEach(p => {
  const [id, seats] = p.split(':')
  if (id && seats) PRIX_EQUIPE[id.trim()] = parseInt(seats.trim())
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  return data?.id || null
}

async function mettreAJourEquipe(userId: string, maxMembres: number) {
  const { data: equipe } = await supabase
    .from('equipes')
    .select('id')
    .eq('proprietaire_id', userId)
    .single()

  if (equipe) {
    await supabase.from('equipes').update({ max_membres: maxMembres }).eq('id', equipe.id)
    await supabase.from('profiles').update({ equipe_id: equipe.id }).eq('id', userId)
  } else {
    const { data: nouvelleEquipe } = await supabase
      .from('equipes')
      .insert({ nom: 'Ma clinique', proprietaire_id: userId, max_membres: maxMembres })
      .select('id')
      .single()
    if (nouvelleEquipe) {
      await supabase.from('membres_equipe').insert({
        equipe_id: nouvelleEquipe.id, user_id: userId, role: 'proprietaire',
      })
      await supabase.from('profiles').update({ equipe_id: nouvelleEquipe.id, role: 'proprietaire' }).eq('id', userId)
    }
  }
}

async function traiterAbonnement(customerId: string, priceId: string | undefined, actif: boolean) {
  if (!actif) {
    await supabase.from('profiles').update({ plan: 'free' }).eq('stripe_customer_id', customerId)
    console.log('Plan résilié:', customerId)
    return
  }

  const maxMembres = priceId ? PRIX_EQUIPE[priceId] : undefined
  const plan = maxMembres ? 'equipe' : 'pro'

  await supabase.from('profiles').update({ plan }).eq('stripe_customer_id', customerId)
  console.log('Plan mis à jour:', customerId, plan, maxMembres ? `(${maxMembres} sièges)` : '')

  if (plan === 'equipe' && maxMembres) {
    const userId = await getUserIdFromCustomer(customerId)
    if (userId) await mettreAJourEquipe(userId, maxMembres)
  }
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Signature manquante', { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Signature invalide:', err.message)
    return new Response(`Signature invalide: ${err.message}`, { status: 400 })
  }

  console.log('Webhook reçu:', event.type)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription') {
        const items = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = items.data[0]?.price?.id
        await traiterAbonnement(session.customer as string, priceId, true)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const actif = ['active', 'trialing'].includes(sub.status)
      const priceId = sub.items.data[0]?.price?.id
      await traiterAbonnement(sub.customer as string, priceId, actif)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await traiterAbonnement(sub.customer as string, undefined, false)
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
