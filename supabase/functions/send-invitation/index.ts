const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const { email, nomClinique, lien, emailInvite } = await req.json()

  if (!email || !lien) {
    return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const nomAffiche = nomClinique || 'votre équipe'
  const adresseInvite = emailInvite || email

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Invitation &agrave; rejoindre ${nomAffiche}</title>
<!--[if mso]><style type="text/css">body,table,td,a{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style type="text/css">
body{margin:0;padding:0;width:100%!important;background-color:#EDECE9;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
@media only screen and (max-width:620px){.conteneur{width:100%!important;}.bloc{padding:28px 22px!important;}.titre{font-size:22px!important;}}
</style>
</head>
<body style="margin:0;padding:0;background-color:#EDECE9;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDECE9;">Vous avez &eacute;t&eacute; invit&eacute;(e) &agrave; rejoindre ${nomAffiche} sur Adjuvet.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#EDECE9;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="conteneur" style="width:600px;max-width:600px;">
      <tr>
        <td style="background-color:#BCAADC;border-radius:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td class="bloc" align="center" style="padding:32px;">
              <img src="https://adjuvet.app/logo-adjuvet.png" width="132" alt="Adjuvet" style="display:block;width:132px;max-width:132px;height:auto;margin:0 auto 26px;" />
              <h1 class="titre" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:25px;line-height:1.25;font-weight:bold;color:#FFFFFF;text-align:center;">Invitation &agrave; rejoindre ${nomAffiche}</h1>
              <p style="margin:0 0 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#2E3A5C;text-align:center;">Bonjour,<br /><br />Vous avez &eacute;t&eacute; invit&eacute;(e) &agrave; rejoindre <strong>${nomAffiche}</strong> sur Adjuvet.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
                <tr><td style="background-color:rgba(33,48,88,0.10);border-radius:10px;padding:16px 20px;text-align:left;">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;color:#213058;">&#201;tape 1 - Cr&eacute;er votre compte (ou vous connecter)</p>
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#2E3A5C;">Rendez-vous sur <a href="https://adjuvet.app" style="color:#213058;font-weight:bold;">adjuvet.app</a> et cr&eacute;ez un compte avec l'adresse <strong>${adresseInvite}</strong>, ou connectez-vous si vous en avez d&eacute;j&agrave; un.</p>
                </td></tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:26px;">
                <tr><td style="background-color:rgba(33,48,88,0.10);border-radius:10px;padding:16px 20px;text-align:left;">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;color:#213058;">&#201;tape 2 - Activer votre acc&egrave;s &eacute;quipe</p>
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#2E3A5C;">Une fois connect&eacute;(e), cliquez sur le bouton ci-dessous&nbsp;:</p>
                </td></tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="border-radius:999px;background-color:#213058;">
                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${lien}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="#213058"><w:anchorlock/><center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">Rejoindre l'&eacute;quipe &rarr;</center></v:roundrect><![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${lien}" style="display:inline-block;padding:15px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px;background-color:#213058;">Rejoindre l'&eacute;quipe &rarr;</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#3D4666;text-align:center;">Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur&nbsp;:<br /><a href="${lien}" style="color:#213058;word-break:break-all;">${lien}</a></p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;">
                <tr><td style="border-top:1px solid rgba(33,48,88,0.22);height:1px;line-height:1px;font-size:1px;">&nbsp;</td></tr>
              </table>
              <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#3D4666;text-align:center;">&Agrave; bient&ocirc;t sur Adjuvet&nbsp;!</p>

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

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY manquant - courriel non envoyé')
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: `Invitation à rejoindre ${nomAffiche} sur Adjuvet`,
      html,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error('Resend send-invitation error:', errBody)
    return new Response(JSON.stringify({ error: 'Erreur envoi courriel' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
