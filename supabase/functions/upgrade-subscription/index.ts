import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

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
    .select('stripe_customer_id, plan, email, nom')
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

  const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
  const isEquipe = PRICE_EQUIPE && newPriceId === PRICE_EQUIPE
  const nomPlan = isEquipe ? `Équipe (${quantity} sièges)` : 'Pro'

  await stripe.subscriptions.update(subscription.id, {
    items: [{ id: currentItem.id, price: newPriceId, quantity }],
    proration_behavior: 'always_invoice',
  })

  if (RESEND_API_KEY && profil.email) {
    const prenom = profil.nom ? profil.nom.split(' ')[0] : ''
    const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9f9f9;">
        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
          <h2 style="color: #254D56; margin: 0 0 8px;">Forfait Adjuvet ${nomPlan} activé</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            ${salutation}<br /><br />
            Votre forfait a été mis à jour vers <strong>Adjuvet ${nomPlan}</strong>.
            Le changement est effectif immédiatement.
          </p>
          <a href="https://adjuvet.app" style="display: inline-block; background: #254D56; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            Ouvrir Adjuvet
          </a>
          <p style="color: #999; font-size: 12px; margin: 24px 0 0; line-height: 1.5;">
            Vous pouvez gérer votre abonnement depuis votre profil dans l'application.
          </p>
        </div>
      </div>
    `
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [profil.email],
        subject: `Votre forfait Adjuvet ${nomPlan} est activé`,
        html,
      }),
    }).catch(e => console.error('Resend upgrade error:', e))
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
