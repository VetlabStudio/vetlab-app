/* Gabarit commun des courriels Adjuvet (Resend).
   Importé par stripe-webhook et transferer-propriete. */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

export const courrielsActifs = () => Boolean(RESEND_API_KEY)

export const echapper = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export interface ContenuCourriel {
  titre: string
  apercu: string
  titreHtml: string
  corpsHtml: string
  boutonTexte: string
  boutonUrl: string
  noteHtml: string
}

/* Même gabarit que les quatre autres courriels : titre blanc,
   texte marine verrouillé contre le mode sombre par le dégradé,
   les sélecteurs data-ogsc et la requête prefers-color-scheme,
   coins à 24 px, pied de page à 5,32:1. */
export function gabaritCourriel(p: ContenuCourriel): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${p.titre}</title>
<!--[if mso]><style type="text/css">body,table,td,a{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
<style type="text/css">
:root{color-scheme:light;supported-color-schemes:light;}
body{margin:0;padding:0;width:100%!important;background-color:#EDECE9;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
@media only screen and (max-width:620px){.conteneur{width:100%!important;}.bloc{padding:28px 22px!important;}.titre{font-size:22px!important;}}

[data-ogsc] .fond,  [data-ogsb] .fond  {background-color:#EDECE9!important;}
[data-ogsc] .carte, [data-ogsb] .carte {background-color:#BCAADC!important;}
[data-ogsc] .bouton,[data-ogsb] .bouton{background-color:#213058!important;}
[data-ogsc] .titre  {color:#FFFFFF!important;}
[data-ogsc] .texte  {color:#2E3A5C!important;}
[data-ogsc] .lien   {color:#213058!important;}
[data-ogsc] .pied   {color:#5A6070!important;}
[data-ogsc] .btn-texte{color:#FFFFFF!important;}

@media (prefers-color-scheme:dark){
  .fond   {background-color:#EDECE9!important;}
  .carte  {background-color:#BCAADC!important;}
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
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDECE9;">${p.apercu}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="fond" style="background-color:#EDECE9;background-image:linear-gradient(#EDECE9,#EDECE9);">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="conteneur" style="width:600px;max-width:600px;">
      <tr>
        <td class="carte" style="background-color:#BCAADC;background-image:linear-gradient(#BCAADC,#BCAADC);border-radius:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td class="bloc" align="center" style="padding:32px;">
              <img src="https://adjuvet.app/logo-adjuvet.png" width="132" alt="Adjuvet" style="display:block;width:132px;max-width:132px;height:auto;margin:0 auto 26px;" />
              <h1 class="titre" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:25px;line-height:1.25;font-weight:bold;color:#FFFFFF;text-align:center;">${p.titreHtml}</h1>
              <p class="texte" style="margin:0 0 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#2E3A5C;text-align:center;">${p.corpsHtml}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td class="bouton" align="center" style="border-radius:999px;background-color:#213058;background-image:linear-gradient(#213058,#213058);">
                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${p.boutonUrl}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="50%" stroke="f" fillcolor="#213058"><w:anchorlock/><center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${p.boutonTexte}</center></v:roundrect><![endif]-->
                    <!--[if !mso]><!-->
                    <a class="btn-texte" href="${p.boutonUrl}" style="display:inline-block;padding:15px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px;background-color:#213058;">${p.boutonTexte}</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              <p class="texte" style="margin:24px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#2E3A5C;text-align:center;">${p.noteHtml}</p>
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
}

export async function envoyerCourriel(email: string, sujet: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [email], subject: sujet, html }),
  }).catch(e => console.error(`Resend: échec de l'envoi « ${sujet} »`, e))
}
