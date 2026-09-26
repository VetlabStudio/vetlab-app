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
