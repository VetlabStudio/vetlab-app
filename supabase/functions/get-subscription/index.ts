import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JOURS_ESSAI, aDejaEuAbonnement } from '../_shared/essai.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Non autorisé')

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) throw new Error('Non autorisé')

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    // Jamais passé par le paiement : l'essai gratuit est disponible.
    if (!profile?.stripe_customer_id) {
      return new Response(JSON.stringify({ subscription: null, essai_disponible: true, jours_essai: JOURS_ESSAI }), {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'all',
      limit: 100,
    })
    // Même règle que create-checkout : un seul essai par personne.
    const essai = { essai_disponible: !aDejaEuAbonnement(subscriptions.data), jours_essai: JOURS_ESSAI }

    const sub = subscriptions.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status))
    if (!sub) {
      return new Response(JSON.stringify({ subscription: null, ...essai }), {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      subscription: {
        current_period_end: sub.current_period_end,
        quantity: sub.items.data[0]?.quantity || 1,
        statut: sub.status,
        // Date de fin si l'abonnement a été annulé et court jusqu'à la fin de la période.
        fin_programmee: sub.cancel_at || (sub.cancel_at_period_end ? sub.current_period_end : null),
        fin_essai: sub.status === 'trialing' ? sub.trial_end : null,
      },
      ...essai,
    }), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    })
  }
})
