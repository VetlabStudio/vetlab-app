import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const SIEGES_MIN = 2
const SIEGES_MAX = 200

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const MSG_PAIEMENT_REFUSE =
  "Le paiement n'a pas pu être effectué. Aucun changement n'a été appliqué. Vérifiez votre carte dans le portail de facturation."

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return json({ error: 'Non autorisé' }, 401)

  let newPriceId: unknown
  let quantiteDemandee: unknown
  try {
    const corps = await req.json()
    newPriceId = corps?.newPriceId
    quantiteDemandee = corps?.quantity
  } catch {
    return json({ error: 'Requête invalide.' }, 400)
  }

  // ─── Le prix et la quantité viennent du navigateur : on les valide ici.
  // Le seul changement offert par l'app est le passage à Équipe ou l'ajustement des sièges.
  if (!PRICE_EQUIPE || newPriceId !== PRICE_EQUIPE) {
    return json({ error: "Ce changement de forfait n'est pas disponible." }, 400)
  }
  const quantity = Number(quantiteDemandee)
  if (!Number.isInteger(quantity) || quantity < SIEGES_MIN || quantity > SIEGES_MAX) {
    return json({ error: `Le nombre de sièges doit être entre ${SIEGES_MIN} et ${SIEGES_MAX}.` }, 400)
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id, plan, email, nom')
    .eq('id', user.id)
    .single()

  if (!profil?.stripe_customer_id) return json({ error: 'Aucun abonnement actif trouvé.' }, 400)

  if (!['pro', 'equipe'].includes(profil.plan)) {
    return json({ error: 'Un abonnement actif est requis pour modifier le forfait.' }, 400)
  }

  /* Un membre a aussi plan = 'equipe'. Sans cette vérification, un
     membre qui avait encore son ancien abonnement Pro pouvait le
     transformer en abonnement Équipe facturé qui ne lui donne rien. */
  const { data: equipe } = await supabase
    .from('equipes').select('id').eq('proprietaire_id', user.id).maybeSingle()

  if (profil.plan === 'equipe' && !equipe) {
    return json({ error: 'Seul le propriétaire de la clinique peut modifier les sièges.' }, 403)
  }

  if (equipe) {
    const { count } = await supabase
      .from('membres_equipe')
      .select('*', { count: 'exact', head: true })
      .eq('equipe_id', equipe.id)
    if (count !== null && quantity < count) {
      return json({
        error: `Votre équipe compte ${count} membres. Retirez des membres avant de réduire à ${quantity} sièges.`,
      }, 400)
    }
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: profil.stripe_customer_id,
    status: 'active',
    limit: 10,
  })

  const subscription = profil.plan === 'equipe'
    ? subscriptions.data.find(s => s.items.data.some(i => i.price?.id === PRICE_EQUIPE))
    : subscriptions.data[0]

  if (!subscription) return json({ error: 'Aucun abonnement actif trouvé dans Stripe.' }, 400)

  const currentItem = subscription.items.data[0]
  const nomPlan = `Équipe (${quantity} sièges)`

  /* pending_if_incomplete : le changement n'est appliqué que si le
     paiement passe. Avant, une carte refusée faisait passer
     l'abonnement en défaut de paiement, le webhook remettait le
     propriétaire ET toute son équipe au gratuit, et le courriel
     annonçait quand même « Forfait activé ». */
  let miseAJour: Stripe.Subscription
  try {
    miseAJour = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: currentItem.id, price: PRICE_EQUIPE, quantity }],
      proration_behavior: 'always_invoice',
      payment_behavior: 'pending_if_incomplete',
    })
  } catch (err) {
    console.error('upgrade-subscription: mise à jour refusée par Stripe', err)
    return json({ error: MSG_PAIEMENT_REFUSE }, 402)
  }

  if (miseAJour.pending_update) {
    console.warn(`upgrade-subscription: paiement non confirmé pour ${user.id}, changement en attente non appliqué`)
    return json({ error: MSG_PAIEMENT_REFUSE }, 402)
  }

  if (RESEND_API_KEY && profil.email) {
    const prenom = profil.nom ? profil.nom.split(' ')[0] : ''
    const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Forfait Adjuvet ${nomPlan}</title>
<!--[if mso]><style type="text/css">body,table,td,a{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style type="text/css">
body{margin:0;padding:0;width:100%!important;background-color:#EDECE9;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
@media only screen and (max-width:620px){.conteneur{width:100%!important;}.bloc{padding:28px 22px!important;}.titre{font-size:22px!important;}}
</style>
</head>
<body style="margin:0;padding:0;background-color:#EDECE9;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDECE9;">Votre forfait Adjuvet ${nomPlan} est maintenant actif.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#EDECE9;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="conteneur" style="width:600px;max-width:600px;">
      <tr>
        <td style="background-color:#BCAADC;border-radius:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td class="bloc" align="center" style="padding:32px;">
              <img src="https://adjuvet.app/logo-adjuvet.png" width="132" alt="Adjuvet" style="display:block;width:132px;max-width:132px;height:auto;margin:0 auto 26px;" />
              <h1 class="titre" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:25px;line-height:1.25;font-weight:bold;color:#FFFFFF;text-align:center;">Forfait ${nomPlan} activ&eacute;</h1>
              <p style="margin:0 0 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#2E3A5C;text-align:center;">${salutation}<br /><br />Votre forfait a &eacute;t&eacute; mis &agrave; jour vers <strong>Adjuvet ${nomPlan}</strong>. Le changement est effectif imm&eacute;diatement.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="border-radius:999px;background-color:#213058;">
                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://adjuvet.app" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="50%" stroke="f" fillcolor="#213058"><w:anchorlock/><center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">Ouvrir Adjuvet</center></v:roundrect><![endif]-->
                    <!--[if !mso]><!-->
                    <a href="https://adjuvet.app" style="display:inline-block;padding:15px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px;background-color:#213058;">Ouvrir Adjuvet</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#3D4666;text-align:center;">Vous pouvez g&eacute;rer votre abonnement depuis votre profil dans l'application.</p>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 16px 0;">
          <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8A90A0;">Adjuvet, par Vetlab Studio</p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8A90A0;"><a href="https://adjuvet.app" style="color:#8A90A0;text-decoration:underline;">adjuvet.app</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`
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
