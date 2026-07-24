import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

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
    await supabase.from('profiles').update({ equipe_id: equipe.id, role: 'proprietaire' }).eq('id', userId)
    await supabase.from('membres_equipe').upsert(
      { equipe_id: equipe.id, user_id: userId, role: 'proprietaire' },
      { onConflict: 'equipe_id,user_id' }
    )
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

async function envoyerConfirmationAbonnement(customerId: string, plan: string, quantity: number) {
  if (!RESEND_API_KEY) return
  const { data: profil } = await supabase
    .from('profiles')
    .select('email, nom')
    .eq('stripe_customer_id', customerId)
    .single()
  if (!profil?.email) return

  const nomPlan = plan === 'equipe' ? `Équipe (${quantity} sièges)` : 'Pro'
  const prenom = profil.nom ? profil.nom.split(' ')[0] : ''
  const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9f9f9;">
      <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
        <h2 style="color: #254D56; margin: 0 0 8px;">Abonnement Adjuvet ${nomPlan} activé</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          ${salutation}<br /><br />
          Votre abonnement <strong>Adjuvet ${nomPlan}</strong> est maintenant actif.
          Vous avez accès à toutes les fonctionnalités incluses dans votre forfait.
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
      subject: `Bienvenue sur Adjuvet ${nomPlan} !`,
      html,
    }),
  }).catch(e => console.error('Resend confirmation error:', e))
}

async function traiterAbonnement(customerId: string, priceId: string | undefined, actif: boolean, quantity = 1): Promise<string | null> {
  if (!actif) {
    await supabase.from('profiles').update({ plan: 'free' }).eq('stripe_customer_id', customerId)
    console.log('Plan résilié:', customerId)
    return null
  }

  const isEquipe = PRICE_EQUIPE && priceId === PRICE_EQUIPE
  const plan = isEquipe ? 'equipe' : 'pro'

  await supabase.from('profiles').update({ plan }).eq('stripe_customer_id', customerId)
  console.log('Plan mis à jour:', customerId, plan, isEquipe ? `(${quantity} sièges)` : '')

  if (isEquipe) {
    const userId = await getUserIdFromCustomer(customerId)
    if (userId) await mettreAJourEquipe(userId, quantity)
  }

  return plan
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
        const quantity = items.data[0]?.quantity || 1
        const plan = await traiterAbonnement(session.customer as string, priceId, true, quantity)
        if (plan) await envoyerConfirmationAbonnement(session.customer as string, plan, quantity)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const actif = ['active', 'trialing'].includes(sub.status)
      const priceId = sub.items.data[0]?.price?.id
      const quantity = sub.items.data[0]?.quantity || 1
      await traiterAbonnement(sub.customer as string, priceId, actif, quantity)
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
