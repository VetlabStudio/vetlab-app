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

  const { priceId } = await req.json()

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, nom')
    .eq('id', user.id)
    .single()

  let customerId = profil?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profil?.email || user.email,
      name: profil?.nom || '',
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    locale: 'fr',
    ui_mode: 'embedded',
    return_url: `${req.headers.get('origin')}/profil?paiement=succes`,
  })

  return new Response(
    JSON.stringify({ clientSecret: session.client_secret }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})