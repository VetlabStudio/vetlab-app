import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { synchroniserCourrielStripe } from '../_shared/stripeCourriel.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const RETURN_URL = Deno.env.get('APP_URL') + '/profil'

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

    if (!profile?.stripe_customer_id) throw new Error('Aucun abonnement actif trouvé.')

    // Le portail affiche le courriel du client Stripe : il doit suivre celui du compte.
    if (user.email) {
      await synchroniserCourrielStripe(stripe, profile.stripe_customer_id, user.email)
        .catch((erreur) => console.error('Synchronisation du courriel Stripe :', erreur))
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: RETURN_URL,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    })
  }
})