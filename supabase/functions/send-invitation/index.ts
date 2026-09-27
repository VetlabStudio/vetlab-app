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

  /* ══════════════════════════════════════════════════════════
     COULEURS ET CONTRASTES

     Fond crème   #EDECE9
     Carte        #BCAADC
     Encadré      #AD9ECF  (l'ancien rgba(33,48,88,0.10) aplati :
                            Outlook pour Windows ignore rgba)
     Texte        #2E3A5C  sur lavande  5,29:1
     Pied         #5A6070  sur crème    5,32:1
     Bouton       blanc sur #213058    12,90:1

     Le titre blanc sur la lavande donne 2,12:1. Le seuil du
     grand texte est 3:1, donc il n'y est pas. Choix assumé :
     aucune lavande ne porte à la fois un titre blanc et du
     texte marine aux seuils AA, les deux se croisent vers
     3,3:1 sans qu'aucun n'atteigne le sien. Pour tout avoir
     il faudrait un bandeau marine derrière le titre.

     MODE SOMBRE
     Trois défenses, parce qu'aucune ne couvre tous les clients :
     1. color-scheme light, respecté par Apple Mail et iOS Mail.
     2. linear-gradient doublant chaque background-color : Gmail
        Android traite un dégradé comme une image et ne l'inverse
        pas, alors qu'il recalcule les couleurs unies.
     3. Sélecteurs [data-ogsc] et [data-ogsb], que Outlook sur le
        web ajoute aux éléments dont il a changé la couleur.
     ══════════════════════════════════════════════════════════ */

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Invitation &agrave; rejoindre ${nomAffiche}</title>
<!--[if mso]><style type="text/css">body,table,td,a{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style type="text/css">
:root{color-scheme:light;supported-color-schemes:light;}
body{margin:0;padding:0;width:100%!important;background-color:#EDECE9;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
@media only screen and (max-width:620px){.conteneur{width:100%!important;}.bloc{padding:28px 22px!important;}.titre{font-size:22px!important;}}

/* Outlook sur le web : on réimpose les couleurs qu'il a réécrites. */
[data-ogsc] .fond,  [data-ogsb] .fond  {background-color:#EDECE9!important;}
[data-ogsc] .carte, [data-ogsb] .carte {background-color:#BCAADC!important;}
[data-ogsc] .encadre,[data-ogsb] .encadre{background-color:#AD9ECF!important;}
[data-ogsc] .bouton,[data-ogsb] .bouton{background-color:#213058!important;}
[data-ogsc] .titre  {color:#FFFFFF!important;}
[data-ogsc] .texte  {color:#2E3A5C!important;}
[data-ogsc] .lien   {color:#213058!important;}
[data-ogsc] .pied   {color:#5A6070!important;}
[data-ogsc] .btn-texte{color:#FFFFFF!important;}

/* Clients qui appliquent un thème sombre en respectant la requête. */
@media (prefers-color-scheme:dark){
  .fond   {background-color:#EDECE9!important;}
  .carte  {background-color:#BCAADC!important;}
  .encadre{background-color:#AD9ECF!important;}
  .bouton {background-color:#213058!important;}
  .titre  {color:#FFFFFF!important;}
  .texte  {color:#2E3A5C!important;}
  .lien   {color:#213058!important;}
  .pied   {color:#5A6070!important;}
  .btn-texte{color:#FFFFFF!important;}
}
</style>
</head>
<body class="fond" style="margin:0;padding:0;background-color:#EDECE9;background-image:linear-gradient(#EDECE9,#EDECE9);">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDECE9;">Vous avez re&ccedil;u une invitation &agrave; rejoindre ${nomAffiche} sur Adjuvet.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="fond" style="background-color:#EDECE9;background-image:linear-gradient(#EDECE9,#EDECE9);">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="conteneur" style="width:600px;max-width:600px;">
      <tr>
        <td class="carte" style="background-color:#BCAADC;background-image:linear-gradient(#BCAADC,#BCAADC);border-radius:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td class="bloc" align="center" style="padding:32px;">
              <img src="https://adjuvet.app/logo-adjuvet.png" width="132" alt="Adjuvet" style="display:block;width:132px;max-width:132px;height:auto;margin:0 auto 26px;" />
              <h1 class="titre" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:25px;line-height:1.25;font-weight:bold;color:#FFFFFF;text-align:center;">Invitation &agrave; rejoindre ${nomAffiche}</h1>
              <p class="texte" style="margin:0 0 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#2E3A5C;text-align:center;">Bonjour,<br /><br />Vous avez re&ccedil;u une invitation &agrave; rejoindre <strong>${nomAffiche}</strong> sur Adjuvet.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td class="bouton" align="center" style="border-radius:999px;background-color:#213058;background-image:linear-gradient(#213058,#213058);">
                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${lien}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="#213058"><w:anchorlock/><center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">Rejoindre l'&eacute;quipe &rarr;</center></v:roundrect><![endif]-->
                    <!--[if !mso]><!-->
                    <a class="btn-texte" href="${lien}" style="display:inline-block;padding:15px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px;background-color:#213058;">Rejoindre l'&eacute;quipe &rarr;</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:26px;">
                <tr><td class="encadre" style="background-color:#AD9ECF;background-image:linear-gradient(#AD9ECF,#AD9ECF);border-radius:14px;padding:16px 20px;text-align:center;">
                  <p class="texte" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#2E3A5C;">Pas encore de compte&nbsp;? Vous pourrez le cr&eacute;er &agrave; partir de ce lien, avec l'adresse <strong>${adresseInvite}</strong>.</p>
                </td></tr>
              </table>

              <p class="texte" style="margin:22px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#2E3A5C;text-align:center;">Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur&nbsp;:<br /><a class="lien" href="${lien}" style="color:#213058;word-break:break-all;">${lien}</a></p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;">
                <tr><td style="border-top:1px solid #8E7FB4;height:1px;line-height:1px;font-size:1px;">&nbsp;</td></tr>
              </table>
              <p class="texte" style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#2E3A5C;text-align:center;">&Agrave; bient&ocirc;t sur Adjuvet&nbsp;!</p>

            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px 16px 0;">
          <p class="pied" style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#5A6070;">Adjuvet, par Vetlab Studio</p>
          <p class="pied" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#5A6070;"><a class="pied" href="https://adjuvet.app" style="color:#5A6070;text-decoration:underline;">adjuvet.app</a></p>
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