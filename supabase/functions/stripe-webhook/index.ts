import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { courrielsActifs, echapper, envoyerCourriel, gabaritCourriel } from '../_shared/courriel.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const PRIX_PRO = [
  Deno.env.get('STRIPE_PRICE_PRO_MENSUEL'),
  Deno.env.get('STRIPE_PRICE_PRO_ANNUEL'),
].filter(Boolean) as string[]

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

/* Adresse du compte : celle du profil, sinon celle du compte de
   connexion (un profil n'a pas toujours son courriel, par exemple
   s'il a été créé avant le correctif de la base). */
async function adresseDuCompte(userId: string, emailProfil: string | null | undefined): Promise<string | null> {
  if (emailProfil) return emailProfil
  const { data } = await supabase.auth.admin.getUserById(userId)
  return data?.user?.email || null
}

async function lireDestinataire(customerId: string): Promise<{ email: string; salutation: string } | null> {
  const { data: profil } = await supabase
    .from('profiles')
    .select('id, email, nom')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  const email = profil ? await adresseDuCompte(profil.id, profil.email) : null
  if (!profil || !email) {
    console.warn(`Courriel non envoyé : aucune adresse pour le client Stripe ${customerId}`)
    return null
  }
  const prenom = profil.nom ? echapper(profil.nom.split(' ')[0]) : ''
  return { email, salutation: prenom ? `Bonjour ${prenom},` : 'Bonjour,' }
}

async function envoyerConfirmationAbonnement(customerId: string, plan: string, quantity: number) {
  if (!courrielsActifs()) return
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
  if (!courrielsActifs()) return
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

async function envoyerPaiementRefuse(sub: Stripe.Subscription, accesMaintenu: boolean) {
  if (!courrielsActifs()) return
  const dest = await lireDestinataire(sub.customer as string)
  if (!dest) return

  const { nom, equipe } = decrirePlan(sub)
  const membres = !equipe
    ? ''
    : accesMaintenu
      ? '<br /><br />Si le paiement n&rsquo;aboutit pas, les membres de votre clinique perdront aussi l&rsquo;acc&egrave;s.'
      : '<br /><br />Les membres de votre clinique n&rsquo;ont plus acc&egrave;s non plus en attendant le paiement.'
  const situation = accesMaintenu
    ? `Vous gardez l&rsquo;acc&egrave;s pour l&rsquo;instant&nbsp;: une nouvelle tentative sera faite automatiquement au cours des prochains jours.<br /><br />Si le paiement n&rsquo;aboutit pas, votre abonnement sera annul&eacute; et votre compte passera au forfait gratuit.`
    : `Votre acc&egrave;s ${nom} est suspendu jusqu&rsquo;&agrave; ce que le paiement passe. Une nouvelle tentative sera faite automatiquement au cours des prochains jours, et votre acc&egrave;s reviendra d&egrave;s que le paiement aboutira.`

  const html = gabaritCourriel({
    titre: `Paiement refusé pour votre abonnement Adjuvet ${nom}`,
    apercu: accesMaintenu ? 'Mettez à jour votre carte pour garder votre accès.' : 'Mettez à jour votre carte pour retrouver votre accès.',
    titreHtml: 'Paiement refus&eacute;',
    corpsHtml: `${dest.salutation}<br /><br />Le paiement de votre abonnement <strong>Adjuvet ${nom}</strong> n&rsquo;a pas pu &ecirc;tre effectu&eacute;. ${situation}${membres}`,
    boutonTexte: 'Mettre &agrave; jour ma carte',
    boutonUrl: 'https://adjuvet.app/abonnement',
    noteHtml: 'Votre carte a peut-&ecirc;tre expir&eacute; ou a &eacute;t&eacute; refus&eacute;e par votre banque.',
  })
  await envoyerCourriel(dest.email, `Paiement refusé pour votre abonnement Adjuvet ${nom}`, html)
}

async function envoyerFinAbonnement(sub: Stripe.Subscription) {
  if (!courrielsActifs()) return
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
/* Paiement refusé : Stripe réessaie pendant quelques jours et
   l'abonnement passe en past_due. On garde l'accès pendant ces
   tentatives. C'est le réglage Stripe « Manage failed payments »
   (annuler l'abonnement après la dernière tentative) qui y met fin.
   Cette limite n'est qu'un filet : elle s'applique au prochain
   événement Stripe reçu, si l'abonnement traîne en past_due.

   Le délai n'est accordé qu'à un client qui a déjà payé un montant
   réel pour cet abonnement. Une fin d'essai gratuit ou une période
   offerte par un code promo à 100 % ne compte pas : si le premier
   vrai paiement échoue, l'accès est suspendu tout de suite. */
const GRACE_PAIEMENT_JOURS = 21

async function aDejaPayeMontantReel(subId: string): Promise<boolean> {
  const factures = await stripe.invoices.list({ subscription: subId, status: 'paid', limit: 100 })
  return factures.data.some(f => f.amount_paid > 0)
}

async function enPeriodeDeGrace(s: Stripe.Subscription): Promise<boolean> {
  if (s.status !== 'past_due') return false
  if (Date.now() >= (s.current_period_start + GRACE_PAIEMENT_JOURS * 86400) * 1000) return false
  return await aDejaPayeMontantReel(s.id)
}

async function lireEtatStripe(customerId: string): Promise<{ plan: 'equipe' | 'pro' | 'free'; quantity: number }> {
  const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 })
  const actifs: Stripe.Subscription[] = []
  for (const s of subs.data) {
    if (s.status === 'active' || s.status === 'trialing' || await enPeriodeDeGrace(s)) actifs.push(s)
  }

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

/* ════════════════════════════════════════════════════════════
   TRANSFERT DE PROPRIÉTÉ

   Le membre visé a entré sa carte (Checkout avec metadata
   transfert_id). L'échange se fait en une transaction SQL, qui ne
   fait rien si elle a déjà été faite : Stripe peut renvoyer
   l'événement. Ensuite on arrête l'abonnement Équipe de l'ancien
   propriétaire en fin de période, ce qui est sans effet s'il l'est
   déjà.

   Ordre important : l'échange d'abord. Une fois fait, l'ancien
   propriétaire est membre de l'équipe active du nouveau, et la
   garde ignore les événements de son abonnement (pas de courriel
   « annulation » trompeur).
   ════════════════════════════════════════════════════════════ */

const ERREURS_TRANSFERT_INVALIDE = /transfert_|ancien_proprietaire_invalide|cible_pas_membre/

async function destinataireParId(userId: string): Promise<{ email: string; salutation: string; nom: string } | null> {
  const profil = verifier(
    await supabase.from('profiles').select('email, nom').eq('id', userId).maybeSingle(),
    'lecture du profil',
  )
  const email = await adresseDuCompte(userId, profil?.email)
  if (!email) {
    console.warn(`Courriel non envoyé : aucune adresse pour le compte ${userId}`)
    return null
  }
  const prenom = profil?.nom ? echapper(profil.nom.split(' ')[0]) : ''
  return { email, salutation: prenom ? `Bonjour ${prenom},` : 'Bonjour,', nom: profil?.nom || email }
}

async function annulerAbonnementInvalide(subId: string) {
  const sub = await stripe.subscriptions.retrieve(subId, { expand: ['latest_invoice'] })
  if (sub.status !== 'canceled') {
    await stripe.subscriptions.cancel(subId, { cancellation_details: { comment: 'transfert_invalide' } })
  }
  const facture = sub.latest_invoice as Stripe.Invoice | null
  if (facture && facture.amount_paid > 0 && facture.payment_intent) {
    try {
      await stripe.refunds.create({ payment_intent: facture.payment_intent as string })
      console.log(`Transfert invalide: ${facture.amount_paid / 100} $ remboursés sur ${subId}`)
    } catch (err) {
      console.error(`REMBOURSEMENT À FAIRE À LA MAIN: facture ${facture.id} (${subId})`, err)
    }
  }
}

async function arreterAbonnementAncien(ancienId: string): Promise<number | null> {
  const profil = verifier(
    await supabase.from('profiles').select('stripe_customer_id').eq('id', ancienId).maybeSingle(),
    "lecture du profil de l'ancien propriétaire",
  )
  if (!profil?.stripe_customer_id || !PRICE_EQUIPE) return null

  const subs = await stripe.subscriptions.list({ customer: profil.stripe_customer_id, status: 'all', limit: 100 })
  let fin: number | null = null
  for (const s of subs.data) {
    if (!s.items.data.some(i => i.price?.id === PRICE_EQUIPE)) continue
    if (s.status === 'active' || s.status === 'trialing') {
      if (!s.cancel_at_period_end) {
        await stripe.subscriptions.update(s.id, {
          cancel_at_period_end: true,
          cancellation_details: { comment: 'transfert_propriete' },
        })
      }
      fin = s.current_period_end
    } else if (s.status === 'past_due' || s.status === 'unpaid' || s.status === 'paused') {
      // Période non payée : rien à honorer, on arrête tout de suite.
      await stripe.subscriptions.cancel(s.id, { cancellation_details: { comment: 'transfert_propriete' } })
    }
  }
  return fin
}

async function envoyerCourrielsTransfert(
  t: { equipe_id: string; demandeur_id: string; cible_id: string },
  finAncien: number | null,
  nouvelAbonnementId: string | null,
) {
  if (!courrielsActifs()) return
  const equipe = verifier(
    await supabase.from('equipes').select('nom').eq('id', t.equipe_id).maybeSingle(),
    "lecture de l'équipe",
  )
  const nomEquipe = echapper(equipe?.nom || 'votre clinique')
  const ancien = await destinataireParId(t.demandeur_id)
  const nouveau = await destinataireParId(t.cible_id)

  if (ancien) {
    const arret = finAncien
      ? `Votre abonnement &Eacute;quipe s&rsquo;arr&ecirc;tera le <strong>${formaterDate(finAncien)}</strong>, &agrave; la fin de la p&eacute;riode d&eacute;j&agrave; pay&eacute;e, et ne sera plus pr&eacute;lev&eacute;.`
      : 'Votre abonnement &Eacute;quipe a &eacute;t&eacute; arr&ecirc;t&eacute; et ne sera plus pr&eacute;lev&eacute;.'
    const html = gabaritCourriel({
      titre: 'Transfert de propriété effectué',
      apercu: `${nouveau?.nom || 'Le nouveau propriétaire'} est maintenant propriétaire de la clinique.`,
      titreHtml: 'Transfert effectu&eacute;',
      corpsHtml: `${ancien.salutation}<br /><br /><strong>${echapper(nouveau?.nom || 'Le nouveau propriétaire')}</strong> est maintenant propri&eacute;taire de <strong>${nomEquipe}</strong>. ${arret}<br /><br />Vous restez dans l&rsquo;&eacute;quipe comme admin.`,
      boutonTexte: 'Ouvrir Adjuvet',
      boutonUrl: 'https://adjuvet.app/equipe',
      noteHtml: 'La facturation de la clinique est maintenant au nom du nouveau propri&eacute;taire.',
    })
    await envoyerCourriel(ancien.email, 'Transfert de propriété effectué', html)
  }

  if (nouveau && nouvelAbonnementId) {
    const sub = await stripe.subscriptions.retrieve(nouvelAbonnementId)
    const sieges = sub.items.data[0]?.quantity || 1
    const factures = await stripe.invoices.list({ subscription: sub.id, status: 'paid', limit: 1 })
    const dejaPaye = factures.data.some(f => f.amount_paid > 0)
    const facturation = dejaPaye
      ? 'Votre premier paiement a &eacute;t&eacute; effectu&eacute;.'
      : `Votre premier pr&eacute;l&egrave;vement aura lieu le <strong>${formaterDate(sub.current_period_end)}</strong>, &agrave; la fin de la p&eacute;riode d&eacute;j&agrave; pay&eacute;e.`
    const html = gabaritCourriel({
      titre: `Vous êtes propriétaire de ${equipe?.nom || 'la clinique'}`,
      apercu: "L'abonnement Équipe est maintenant à votre nom.",
      titreHtml: 'Bienvenue, propri&eacute;taire&nbsp;!',
      corpsHtml: `${nouveau.salutation}<br /><br />Le transfert est termin&eacute;&nbsp;: vous &ecirc;tes maintenant propri&eacute;taire de <strong>${nomEquipe}</strong>, et l&rsquo;abonnement &Eacute;quipe (${sieges} si&egrave;ges) est &agrave; votre nom. ${facturation}`,
      boutonTexte: 'G&eacute;rer la clinique',
      boutonUrl: 'https://adjuvet.app/equipe/gestion',
      noteHtml: "Vous pouvez g&eacute;rer les membres et la facturation depuis la gestion d'&eacute;quipe.",
    })
    await envoyerCourriel(nouveau.email, `Vous êtes propriétaire de ${equipe?.nom || 'la clinique'}`, html)
  }
}

async function finaliserTransfert(session: Stripe.Checkout.Session, transfertId: string) {
  const nouvelAbonnementId = (session.subscription as string) || null

  const res = await supabase.rpc('finaliser_transfert_propriete', { p_transfert_id: transfertId })
  if (res.error) {
    if (!ERREURS_TRANSFERT_INVALIDE.test(res.error.message)) {
      throw new Error(`finalisation du transfert: ${res.error.message}`)
    }
    /* La demande n'est plus valable (annulée, refusée, expirée, membre
       retiré, propriétaire changé) : on défait l'abonnement créé. */
    console.error(`Transfert ${transfertId} invalide à la finalisation (${res.error.message}), nouvel abonnement annulé.`)
    if (nouvelAbonnementId) await annulerAbonnementInvalide(nouvelAbonnementId)
    verifier(
      await supabase.from('transferts_propriete')
        .update({ statut: 'annule', termine_le: new Date().toISOString() })
        .eq('id', transfertId).eq('statut', 'en_attente'),
      'annulation du transfert',
    )
    return
  }

  const t = verifier(
    await supabase.from('transferts_propriete').select('equipe_id, demandeur_id, cible_id').eq('id', transfertId).single(),
    'lecture du transfert',
  )
  if (!t) throw new Error(`transfert ${transfertId} introuvable après finalisation`)

  const finAncien = await arreterAbonnementAncien(t.demandeur_id)
  await synchroniserClient(session.customer as string)

  if (res.data === 'ok') {
    verifier(await supabase.from('notifications').insert({
      user_id: t.demandeur_id,
      type: 'transfert',
      message: 'Le transfert de propriété est terminé. Vous êtes maintenant admin de la clinique.',
      reference_type: null,
      reference_id: null,
      lu: false,
    }), 'notification du transfert')
    await envoyerCourrielsTransfert(t, finAncien, nouvelAbonnementId)
    console.log(`Transfert ${transfertId} finalisé: ${t.demandeur_id} → ${t.cible_id}`)
  }
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Signature manquante', { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Signature invalide:', (err as Error).message)
    return new Response(`Signature invalide: ${(err as Error).message}`, { status: 400 })
  }

  console.log('Webhook reçu:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const transfertId = session.metadata?.transfert_id
        if (session.mode === 'subscription' && session.customer && transfertId) {
          await finaliserTransfert(session, transfertId)
        } else if (session.mode === 'subscription' && session.customer) {
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

        // Premier refus de paiement : l'abonnement vient de passer en past_due.
        if (etat && 'status' in avant && avant.status !== 'past_due' && sub.status === 'past_due') {
          await envoyerPaiementRefuse(sub, await enPeriodeDeGrace(sub))
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
