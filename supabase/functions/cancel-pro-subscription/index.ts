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

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Non autorisé', { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authError || !user) return new Response('Non autorisé', { status: 401 })

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profil?.stripe_customer_id) {
    return new Response(JSON.stringify({ ok: true, message: 'Aucun abonnement Stripe trouvé' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Récupérer les abonnements actifs ET en période d'essai
  const [activeList, trialingList] = await Promise.all([
    stripe.subscriptions.list({ customer: profil.stripe_customer_id, status: 'active' }),
    stripe.subscriptions.list({ customer: profil.stripe_customer_id, status: 'trialing' }),
  ])
  const allSubs = [...activeList.data, ...trialingList.data]

  for (const sub of allSubs) {
    await stripe.subscriptions.cancel(sub.id)
  }

  console.log(`cancel-pro-subscription: ${allSubs.length} abonnement(s) annulé(s) pour user ${user.id}`)

  return new Response(JSON.stringify({ ok: true, cancelled: allSubs.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
