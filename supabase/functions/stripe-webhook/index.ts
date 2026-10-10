import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const PRIX_PRO = [
  Deno.env.get('STRIPE_PRICE_PRO_MENSUEL'),
  Deno.env.get('STRIPE_PRICE_PRO_ANNUEL'),
].filter(Boolean) as string[]
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM = 'Adjuvet <noreply@adjuvet.app>'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

/* Toute erreur de base de données remonte jusqu'au handler, qui
   répond 500 : Stripe réessaie alors l'événement. Avant, les erreurs
   étaient ignorées et Stripe recevait toujours « OK » ; si l'écriture
   du forfait échouait, la personne payait et restait gratuite. */
function verifier<T>(res: { data: T; error: { message: string } | null }, contexte: string): T {
  if (res.error) throw new Error(`${contexte}: ${res.error.message}`)
  return res.data
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const lignes = verifier(
    await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).limit(2),
    'lecture du profil par client Stripe',
  )
  if (lignes && lignes.length > 1) {
    console.error(`INCOHÉRENCE: plusieurs profils partagent le client Stripe ${customerId}, aucun n'est modifié.`)
    return null
  }
  return lignes?.[0]?.id || null
}

/* ════════════════════════════════════════════════════════════
   LA GARDE

   Le forfait d'une personne vient de l'une de deux sources :
   son propre abonnement, ou l'équipe de quelqu'un d'autre.
   Tant qu'elle tire son accès de l'équipe d'un autre, son
   abonnement personnel ne gouverne rien.

   On ne compte que les équipes dont le propriétaire a encore un
   forfait Équipe. Quand l'abonnement d'une clinique se termine,
   les lignes de membres_equipe restent (pour pouvoir réactiver
   l'équipe plus tard). Avant, un ancien membre qui achetait Pro
   ensuite était donc vu comme « membre d'une équipe » : son
   abonnement était ignoré, il payait et restait gratuit.

   Le propriétaire est membre de sa propre équipe : on l'exclut,
   son abonnement gouverne son forfait.
   ════════════════════════════════════════════════════════════ */
async function appartientAEquipeActiveDunAutre(userId: string): Promise<boolean> {
  const lignes = verifier(
    await supabase.from('membres_equipe').select('equipe_id').eq('user_id', userId),
    'lecture des appartenances',
  )
  if (!lignes?.length) return false

  const equipes = verifier(
    await supabase.from('equipes').select('proprietaire_id').in('id', lignes.map(l => l.equipe_id)),
    'lecture des équipes',
  )
  const proprios = (equipes || []).map(e => e.proprietaire_id).filter(id => id && id !== userId)
  if (!proprios.length) return false

  const actifs = verifier(
    await supabase.from('profiles').select('id').in('id', proprios).eq('plan', 'equipe'),
    'lecture des propriétaires',
  )
  return Boolean(actifs?.length)
}

async function mettreAJourEquipe(userId: string, maxMembres: number) {
  const equipe = verifier(
    await supabase.from('equipes').select('id').eq('proprietaire_id', userId).maybeSingle(),
    "lecture de l'équipe du propriétaire",
  )

  if (equipe) {
    verifier(await supabase.from('equipes').update({ max_membres: maxMembres }).eq('id', equipe.id), 'mise à jour des sièges')
    verifier(await supabase.from('profiles').update({ equipe_id: equipe.id, role: 'proprietaire' }).eq('id', userId), 'profil du propriétaire')
    verifier(await supabase.from('membres_equipe').upsert(
      { equipe_id: equipe.id, user_id: userId, role: 'proprietaire' },
      { onConflict: 'equipe_id,user_id' }
    ), 'appartenance du propriétaire')
  } else {
    const nouvelleEquipe = verifier(
      await supabase.from('equipes')
        .insert({ nom: 'Ma clinique', proprietaire_id: userId, max_membres: maxMembres })
        .select('id')
        .single(),
      "création de l'équipe",
    )
    if (!nouvelleEquipe) throw new Error("création de l'équipe: aucune ligne retournée")
    verifier(await supabase.from('membres_equipe').insert({
      equipe_id: nouvelleEquipe.id, user_id: userId, role: 'proprietaire',
    }), 'appartenance du propriétaire')
    verifier(await supabase.from('profiles').update({ equipe_id: nouvelleEquipe.id, role: 'proprietaire' }).eq('id', userId), 'profil du propriétaire')
  }
}

// Rétrograde ou réactive tous les membres d'une équipe (excl. propriétaire)
async function mettreAJourMembresEquipe(proprietaireId: string, plan: 'equipe' | 'free') {
  const equipe = verifier(
    await supabase.from('equipes').select('id').eq('proprietaire_id', proprietaireId).maybeSingle(),
    "lecture de l'équipe du propriétaire",
  )
  if (!equipe) return

  const membres = verifier(
    await supabase.from('membres_equipe').select('user_id, role').eq('equipe_id', equipe.id).neq('user_id', proprietaireId),
    "lecture des membres de l'équipe",
  )
  if (!membres?.length) return

  if (plan === 'free') {
    // Seulement ceux qui tirent encore leur accès de cette équipe.
    verifier(
      await supabase.from('profiles')
        .update({ plan: 'free', equipe_id: null, role: null })
        .in('id', membres.map(m => m.user_id))
        .eq('equipe_id', equipe.id),
      'rétrogradation des membres',
    )
  } else {
    // Réactivation : restaurer equipe_id et role depuis membres_equipe
    for (const membre of membres) {
      verifier(
        await supabase.from('profiles')
          .update({ plan: 'equipe', equipe_id: equipe.id, role: membre.role })
          .eq('id', membre.user_id),
        'réactivation des membres',
      )
    }
  }
  console.log(`mettreAJourMembresEquipe: ${membres.length} membre(s) → plan ${plan}`)
}

const echapper = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface ContenuCourriel {
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
function gabaritCourriel(p: ContenuCourriel): string {
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

async function lireDestinataire(customerId: string): Promise<{ email: string; salutation: string } | null> {
  const { data: profil } = await supabase
    .from('profiles')
    .select('email, nom')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  if (!profil?.email) return null
  const prenom = profil.nom ? echapper(profil.nom.split(' ')[0]) : ''
  return { email: profil.email, salutation: prenom ? `Bonjour ${prenom},` : 'Bonjour,' }
}

async function envoyerCourriel(email: string, sujet: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [email], subject: sujet, html }),
  }).catch(e => console.error(`Resend: échec de l'envoi « ${sujet} »`, e))
}

async function envoyerConfirmationAbonnement(customerId: string, plan: string, quantity: number) {
  if (!RESEND_API_KEY) return
  const dest = await lireDestinataire(customerId)
  if (!dest) return

  const nomPlan = plan === 'equipe' ? `Équipe (${quantity} sièges)` : 'Pro'
  const html = gabaritCourriel({
    titre: `Bienvenue sur Adjuvet ${nomPlan}`,
    apercu: `Votre abonnement Adjuvet ${nomPlan} est maintenant actif.`,
    titreHtml: `Bienvenue sur Adjuvet ${nomPlan}&nbsp;!`,
    corpsHtml: `${dest.salutation}<br /><br />Votre abonnement <strong>Adjuvet ${nomPlan}</strong> est maintenant actif. Vous avez acc&egrave;s &agrave; toutes les fonctionnalit&eacute;s incluses dans votre forfait.`,
    boutonTexte: 'Ouvrir Adjuvet',
    boutonUrl: 'https://adjuvet.app',
    noteHtml: "Vous pouvez g&eacute;rer votre abonnement depuis votre profil dans l'application.",
  })
  await envoyerCourriel(dest.email, `Bienvenue sur Adjuvet ${nomPlan} !`, html)
}

function decrirePlan(sub: Stripe.Subscription): { nom: string; equipe: boolean } {
  const equipe = sub.items.data.some(i => Boolean(PRICE_EQUIPE) && i.price?.id === PRICE_EQUIPE)
  return { nom: equipe ? 'Équipe' : 'Pro', equipe }
}

function formaterDate(secondes: number): string {
  return new Date(secondes * 1000).toLocaleDateString('fr-CA', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Toronto',
  })
}

async function envoyerAnnulationProgrammee(sub: Stripe.Subscription) {
  if (!RESEND_API_KEY) return
  const dest = await lireDestinataire(sub.customer as string)
  if (!dest) return

  const { nom, equipe } = decrirePlan(sub)
  const fin = formaterDate(sub.cancel_at || sub.current_period_end)
  const membres = equipe
    ? '<br /><br />Les membres de votre clinique gardent aussi l&rsquo;acc&egrave;s jusqu&rsquo;&agrave; cette date, puis le perdront.'
    : ''

  const html = gabaritCourriel({
    titre: `Votre abonnement Adjuvet ${nom} prendra fin le ${fin}`,
    apercu: `Vous gardez l'accès jusqu'au ${fin}.`,
    titreHtml: 'Annulation confirm&eacute;e',
    corpsHtml: `${dest.salutation}<br /><br />Nous confirmons l&rsquo;annulation de votre abonnement <strong>Adjuvet ${nom}</strong>. Vous gardez l&rsquo;acc&egrave;s &agrave; toutes vos fonctionnalit&eacute;s jusqu&rsquo;au <strong>${fin}</strong>, et aucun autre paiement ne sera pr&eacute;lev&eacute;.${membres}`,
    boutonTexte: 'G&eacute;rer mon abonnement',
    boutonUrl: 'https://adjuvet.app/abonnement',
    noteHtml: 'Vous avez chang&eacute; d&rsquo;avis&nbsp;? Vous pouvez r&eacute;activer votre abonnement depuis la page Abonnement de l&rsquo;application, avant cette date.',
  })
  await envoyerCourriel(dest.email, `Votre abonnement Adjuvet ${nom} prendra fin le ${fin}`, html)
}

async function envoyerFinAbonnement(sub: Stripe.Subscription) {
  if (!RESEND_API_KEY) return
  const dest = await lireDestinataire(sub.customer as string)
  if (!dest) return

  const { nom, equipe } = decrirePlan(sub)
  const raison = sub.cancellation_details?.reason === 'payment_failed'
    ? 'a pris fin parce que le paiement n&rsquo;a pas pu &ecirc;tre effectu&eacute;'
    : 'est maintenant termin&eacute;'
  const membres = equipe
    ? '<br /><br />Les membres de votre clinique ont aussi perdu l&rsquo;acc&egrave;s au forfait &Eacute;quipe.'
    : ''

  const html = gabaritCourriel({
    titre: `Votre abonnement Adjuvet ${nom} est terminé`,
    apercu: 'Votre compte est passé au forfait gratuit.',
    titreHtml: 'Abonnement termin&eacute;',
    corpsHtml: `${dest.salutation}<br /><br />Votre abonnement <strong>Adjuvet ${nom}</strong> ${raison}. Votre compte est pass&eacute; au forfait gratuit.${membres}<br /><br />Vos donn&eacute;es sont conserv&eacute;es&nbsp;: vous les retrouverez si vous vous r&eacute;abonnez.`,
    boutonTexte: 'Me r&eacute;abonner',
    boutonUrl: 'https://adjuvet.app/abonnement',
    noteHtml: 'Merci d&rsquo;avoir utilis&eacute; Adjuvet.',
  })
  await envoyerCourriel(dest.email, `Votre abonnement Adjuvet ${nom} est terminé`, html)
}

function estPrixPro(priceId?: string): boolean {
  if (!priceId || priceId === PRICE_EQUIPE) return false
  if (!PRIX_PRO.length) {
    console.error('STRIPE_PRICE_PRO_MENSUEL / STRIPE_PRICE_PRO_ANNUEL non configurés : tout prix autre que Équipe est traité comme Pro.')
    return true
  }
  return PRIX_PRO.includes(priceId)
}

/* On ne se fie pas au contenu de l'événement : Stripe ne garantit
   pas l'ordre d'arrivée. Un vieil « updated: active » reçu après
   « deleted » redonnait Pro gratuitement. On relit plutôt l'état
   réel de tous les abonnements du client à chaque événement. */
async function lireEtatStripe(customerId: string): Promise<{ plan: 'equipe' | 'pro' | 'free'; quantity: number }> {
  const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 })
  const actifs = subs.data.filter(s => s.status === 'active' || s.status === 'trialing')

  for (const s of actifs) {
    const item = s.items.data.find(i => PRICE_EQUIPE && i.price?.id === PRICE_EQUIPE)
    if (item) return { plan: 'equipe', quantity: item.quantity || 1 }
  }
  for (const s of actifs) {
    if (s.items.data.some(i => estPrixPro(i.price?.id))) return { plan: 'pro', quantity: 1 }
  }
  if (actifs.length) {
    console.error(`Abonnement actif avec un prix inconnu pour ${customerId}, aucun forfait accordé.`)
  }
  return { plan: 'free', quantity: 0 }
}

async function synchroniserClient(customerId: string): Promise<{ plan: string; quantity: number } | null> {
  const userId = await getUserIdFromCustomer(customerId)
  if (!userId) {
    console.log('Aucun profil pour le client Stripe', customerId)
    return null
  }

  if (await appartientAEquipeActiveDunAutre(userId)) {
    console.log(`Abonnement ignoré, ${userId} est membre de l'équipe active d'un autre:`, customerId)
    return null
  }

  const etat = await lireEtatStripe(customerId)

  if (etat.plan === 'equipe') {
    verifier(await supabase.from('profiles').update({ plan: 'equipe' }).eq('id', userId), 'mise à jour du forfait')
    await mettreAJourEquipe(userId, etat.quantity)
    await mettreAJourMembresEquipe(userId, 'equipe')
  } else {
    /* Gratuit, ou Pro sans Équipe (par exemple après un passage
       d'Équipe à Pro dans le portail) : le compte n'a plus de
       clinique active, ses membres perdent l'accès. */
    verifier(
      await supabase.from('profiles').update({ plan: etat.plan, equipe_id: null, role: null }).eq('id', userId),
      'mise à jour du forfait',
    )
    await mettreAJourMembresEquipe(userId, 'free')
  }

  console.log('Forfait synchronisé:', customerId, etat.plan, etat.plan === 'equipe' ? `(${etat.quantity} sièges)` : '')
  return etat
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.customer) {
          const etat = await synchroniserClient(session.customer as string)
          if (etat && etat.plan !== 'free') {
            await envoyerConfirmationAbonnement(session.customer as string, etat.plan, etat.quantity)
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const etat = await synchroniserClient(sub.customer as string)

        /* Courriel seulement quand l'annulation vient d'être activée
           (le champ a changé dans CET événement), pas à chaque mise à
           jour d'un abonnement déjà annulé. etat est null pour un
           membre d'une clinique : son accès continue par l'équipe,
           le courriel le tromperait. */
        const avant = (event.data.previous_attributes || {}) as Partial<Stripe.Subscription>
        const annulationActivee =
          ('cancel_at_period_end' in avant && !avant.cancel_at_period_end && sub.cancel_at_period_end) ||
          ('cancel_at' in avant && !avant.cancel_at && Boolean(sub.cancel_at))
        if (etat && annulationActivee && (sub.status === 'active' || sub.status === 'trialing')) {
          await envoyerAnnulationProgrammee(sub)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const etat = await synchroniserClient(sub.customer as string)

        /* Pas de courriel si la personne a encore un autre forfait
           actif, si l'abonnement n'a jamais démarré, ou si c'est la
           suppression du compte qui l'a annulé. */
        const suppressionCompte = sub.cancellation_details?.comment === 'suppression_compte'
        if (etat && etat.plan === 'free' && sub.status === 'canceled' && !suppressionCompte) {
          await envoyerFinAbonnement(sub)
        }
        break
      }
    }
  } catch (err) {
    console.error(`Webhook: traitement de ${event.type} échoué, Stripe va réessayer.`, err)
    return new Response(JSON.stringify({ error: 'traitement_echoue' }), { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
