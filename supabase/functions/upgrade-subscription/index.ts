import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')!
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return new Response('Non autorisé', { status: 401 })

  const { newPriceId, quantity = 1 } = await req.json()

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id, plan')
    .eq('id', user.id)
    .single()

  if (!profil?.stripe_customer_id) {
    return new Response(
      JSON.stringify({ error: 'Aucun abonnement actif trouvé.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (!['pro', 'equipe'].includes(profil.plan)) {
    return new Response(
      JSON.stringify({ error: 'Un abonnement actif est requis pour modifier le forfait.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: profil.stripe_customer_id,
    status: 'active',
    limit: 1,
  })

  if (!subscriptions.data.length) {
    return new Response(
      JSON.stringify({ error: 'Aucun abonnement actif trouvé dans Stripe.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const subscription = subscriptions.data[0]
  const currentItem = subscription.items.data[0]

  await stripe.subscriptions.update(subscription.id, {
    items: [{ id: currentItem.id, price: newPriceId, quantity }],
    proration_behavior: 'always_invoice',
  })

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
