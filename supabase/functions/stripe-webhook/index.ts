import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!)
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  async function mettreAJourPlan(customerId: string, plan: 'free' | 'pro') {
    await supabase.from('profiles').update({ plan }).eq('stripe_customer_id', customerId)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
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