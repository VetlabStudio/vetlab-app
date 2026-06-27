import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function mettreAJourPlan(customerId: string, plan: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('stripe_customer_id', customerId)
  console.log('Mise a jour plan:', customerId, plan, error ? 'ERREUR: ' + error.message : 'OK')
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Signature manquante', { status: 400 })

  // Corps brut requis pour verifier la signature, ne pas parser en JSON avant
  const body = await req.text()

  let event: Stripe.Event
  try {
    // Version async obligatoire dans Deno, constructEvent classique echoue
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Signature invalide:', err.message)
    return new Response(`Signature invalide: ${err.message}`, { status: 400 })
  }

  console.log('Type:', event.type)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription') {
        await mettreAJourPlan(session.customer as string, 'pro')
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const actif = ['active', 'trialing'].includes(sub.status)
      await mettreAJourPlan(sub.customer as string, actif ? 'pro' : 'free')
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await mettreAJourPlan(sub.customer as string, 'free')
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
