import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { supprimerCompte } from '../_shared/suppressionCompte.ts'
import { essaiDejaUtilise, estClientAdjuvet } from '../_shared/essai.ts'

const CLE_STRIPE = Deno.env.get('STRIPE_SECRET_KEY')!
const stripe = new Stripe(CLE_STRIPE, { apiVersion: '2023-10-16' })
// Effacer l'historique Stripe n'est permis qu'avec les clés de test.
const STRIPE_TEST = CLE_STRIPE.startsWith('sk_test_') || CLE_STRIPE.startsWith('rk_test_')

const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const PRIX_PRO = [
  Deno.env.get('STRIPE_PRICE_PRO_MENSUEL'),
  Deno.env.get('STRIPE_PRICE_PRO_ANNUEL'),
].filter(Boolean) as string[]
// Même délai que stripe-webhook : accès gardé pendant les nouvelles tentatives de paiement.
const GRACE_PAIEMENT_JOURS = 21

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Un code pour l'app, un texte prêt à afficher.
function refus(error: string, message: string, status: number) {
  return json({ error, message }, status)
}

/* ════════════════════════════════════════════════════════════
   COMPTES, CÔTÉ ADMINISTRATION (Admin - Comptes)

   Réservée aux comptes de la table admins_app. Quatre actions :
   - « chercher » : la fiche du compte et ce que la suppression
     entraînerait, sans rien toucher. Avec detail: true, aussi
     l'état Stripe, la connexion, la clinique et les invitations,
     pour comprendre pourquoi quelqu'un n'a plus accès ;
   - « supprimer » : le même nettoyage complet que le bouton du
     profil (_shared/suppressionCompte.ts) ;
   - « effacer-stripe » : pour une adresse sans compte (déjà
     supprimé), retirer seulement ses clients Stripe ;
   - « renouveler-invitation » : remplacer une invitation en
     attente par une neuve (nouveau lien, 7 jours de plus), comme
     « Renvoyer » dans la gestion de l'équipe. L'app envoie ensuite
     le courriel avec send-invitation.

   Effacer les clients Stripe d'une adresse, avec « supprimer » ou
   « effacer-stripe », n'est permis qu'en mode test : la personne
   peut alors recommencer de zéro, essai gratuit compris. En mode
   réel, ces clients et leurs factures restent, pour la comptabilité,
   et l'essai gratuit reste consommé.
   ════════════════════════════════════════════════════════════ */

async function effacerClientsStripe(adresse: string) {
  const clients = await stripe.customers.list({ email: adresse, limit: 100 })
  let nb = 0
  // Les clients de la boutique vetlabstudio.ca (même compte Stripe) ne sont pas touchés.
  for (const client of clients.data.filter(estClientAdjuvet)) {
    await stripe.customers.del(client.id)
    nb++
  }
  return nb
}

function forfaitDuPrix(prix: string | undefined): 'equipe' | 'pro' | null {
  if (prix && PRICE_EQUIPE && prix === PRICE_EQUIPE) return 'equipe'
  if (prix && PRIX_PRO.includes(prix)) return 'pro'
  return null
}

/* L'abonnement qui décide de l'accès : un abonnement en cours d'abord,
   sinon le plus récent (Stripe les liste du plus récent au plus ancien). */
const ORDRE_STATUTS = ['active', 'trialing', 'past_due', 'unpaid', 'paused', 'incomplete']

async function lireAbonnement(clientId: string) {
  const abonnements = (await stripe.subscriptions.list({ customer: clientId, status: 'all', limit: 100 })).data
  const s = ORDRE_STATUTS.map(statut => abonnements.find(a => a.status === statut)).find(Boolean) || abonnements[0]
  const lienStripe = `https://dashboard.stripe.com/${STRIPE_TEST ? 'test/' : ''}customers/${clientId}`
  if (!s) return { lienStripe, statut: null }

  const item = s.items.data.find(i => forfaitDuPrix(i.price?.id)) || s.items.data[0]
  /* Paiement refusé : le délai ne vaut que pour un client qui a déjà
     payé un montant réel (même règle que stripe-webhook). */
  let finGrace: number | null = null
  if (s.status === 'past_due') {
    const factures = await stripe.invoices.list({ subscription: s.id, status: 'paid', limit: 100 })
    if (factures.data.some(f => f.amount_paid > 0)) finGrace = s.current_period_start + GRACE_PAIEMENT_JOURS * 86400
  }

  return {
    lienStripe,
    statut: s.status,
    forfait: forfaitDuPrix(item?.price?.id),
    sieges: item?.quantity ?? null,
    debut: s.start_date,
    echeance: s.current_period_start,
    finPeriode: s.current_period_end,
    finProgrammee: s.cancel_at || (s.cancel_at_period_end ? s.current_period_end : null),
    finEssai: s.status === 'trialing' ? s.trial_end : null,
    finGrace,
    termineLe: s.ended_at,
  }
}

// Invitations en attente à cette adresse, avec le nom de la clinique qui invite.
async function invitationsRecues(supabase: SupabaseClient, adresse: string) {
  const { data } = await supabase
    .from('team_invitations')
    .select('id, team_id, email, created_at')
    .eq('status', 'pending')
    .ilike('email', adresse.replace(/[\\%_]/g, (c) => '\\' + c))
  const invitations = (data || []).filter((i: { email: string }) => i.email.toLowerCase() === adresse)
  if (!invitations.length) return []
  const { data: equipes } = await supabase.from('equipes').select('id, nom').in('id', invitations.map((i: { team_id: string }) => i.team_id))
  return invitations.map((i: { id: string, team_id: string, created_at: string }) => ({
    id: i.id,
    clinique: (equipes as { id: string, nom: string | null }[] | null || []).find(e => e.id === i.team_id)?.nom || null,
    envoyee_le: i.created_at,
  }))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return refus('non_autorise', 'Session expirée. Reconnectez-vous.', 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user: admin } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!admin) return refus('non_autorise', 'Session expirée. Reconnectez-vous.', 401)

  const estAdmin = async (id: string) => {
    const { data } = await supabase.from('admins_app').select('user_id').eq('user_id', id).maybeSingle()
    return Boolean(data)
  }
  if (!(await estAdmin(admin.id))) return refus('reserve_admin', "Réservé à l'administration.", 403)

  let action: unknown, email: unknown, effacerStripe = false, detail = false, invitationId: unknown
  try {
    const corps = await req.json()
    action = corps?.action
    email = corps?.email
    effacerStripe = corps?.effacerStripe === true
    detail = corps?.detail === true
    invitationId = corps?.invitationId
  } catch {
    return refus('requete_invalide', 'Requête invalide.', 400)
  }

  // ─── RENOUVELER UNE INVITATION ───────────────────────────
  if (action === 'renouveler-invitation') {
    if (typeof invitationId !== 'string' || !invitationId) return refus('requete_invalide', 'Requête invalide.', 400)
    const { data: ancienne } = await supabase
      .from('team_invitations')
      .select('id, team_id, email, role, invited_by, status')
      .eq('id', invitationId)
      .maybeSingle()
    if (!ancienne || ancienne.status !== 'pending') {
      return refus('invitation_introuvable', "Cette invitation n'est plus en attente. Cherchez l'adresse de nouveau.", 404)
    }
    await supabase.from('team_invitations').delete().eq('id', ancienne.id)
    const { data: neuve, error } = await supabase.from('team_invitations').insert({
      team_id: ancienne.team_id,
      email: ancienne.email,
      role: ancienne.role,
      invited_by: ancienne.invited_by,
      token: crypto.randomUUID(),
      status: 'pending',
    }).select('id').single()
    // La base refuse d'inviter un membre actuel.
    if (error?.hint === 'deja_membre') return refus('deja_membre', 'Cette personne fait déjà partie de la clinique.', 400)
    if (error || !neuve) {
      console.error('admin-supprimer-compte: invitation non renouvelée', error)
      return refus('invitation_impossible', "L'invitation n'a pas pu être renouvelée. Réessayez.", 500)
    }
    console.log(`admin-supprimer-compte: ${admin.email} a renouvelé l'invitation de ${ancienne.email}`)
    return json({ ok: true, invitationId: neuve.id })
  }
  const adresse = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) {
    return refus('courriel_invalide', "Cette adresse courriel n'est pas valide.", 400)
  }

  // ─── TROUVER LE COMPTE ───────────────────────────────────
  /* Par le profil d'abord ; sinon parmi les comptes de connexion
     (profil sans courriel). Les _ et % d'une adresse sont des jokers
     pour ilike : on les neutralise, puis on compare exactement. */
  type Cible = { id: string, cree_le: string | null, derniere_connexion: string | null, confirme: boolean }
  const versCible = (u: { id: string, created_at?: string, last_sign_in_at?: string, email_confirmed_at?: string }): Cible => ({
    id: u.id,
    cree_le: u.created_at ?? null,
    derniere_connexion: u.last_sign_in_at ?? null,
    confirme: Boolean(u.email_confirmed_at),
  })
  let cible: Cible | null = null
  const { data: profils } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', adresse.replace(/[\\%_]/g, (c) => '\\' + c))
  const profilTrouve = (profils || []).find(p => (p.email || '').toLowerCase() === adresse)
  if (profilTrouve) {
    const { data } = await supabase.auth.admin.getUserById(profilTrouve.id)
    if (data?.user) cible = versCible(data.user)
  }
  if (!cible) {
    for (let page = 1; page <= 20 && !cible; page++) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      if (error || !data?.users?.length) break
      const u = data.users.find(x => (x.email || '').toLowerCase() === adresse)
      if (u) cible = versCible(u)
      if (data.users.length < 1000) break
    }
  }

  // ─── CHERCHER ────────────────────────────────────────────
  if (action === 'chercher') {
    // null : Stripe injoignable, l'app l'indique sans bloquer la recherche.
    let essaiUtilise: boolean | null = null
    try { essaiUtilise = await essaiDejaUtilise(stripe, adresse) } catch { essaiUtilise = null }

    // Les invitations reçues aident aussi pour une adresse sans compte (« je n'ai pas reçu le courriel »).
    const recues = detail ? await invitationsRecues(supabase, adresse) : undefined

    if (!cible) return json({ ok: true, trouve: false, email: adresse, essaiUtilise, modeTestStripe: STRIPE_TEST, invitationsRecues: recues })

    const [{ data: profil }, { data: appartenance }] = await Promise.all([
      supabase.from('profiles').select('nom, plan, stripe_customer_id').eq('id', cible.id).maybeSingle(),
      supabase.from('membres_equipe').select('role, equipe_id').eq('user_id', cible.id).limit(1).maybeSingle(),
    ])
    const { data: clinique } = appartenance
      ? await supabase.from('equipes').select('nom, proprietaire_id, max_membres').eq('id', appartenance.equipe_id).maybeSingle()
      : { data: null }
    const apercu = await supprimerCompte(supabase, stripe, cible.id, adresse, { verification: true, journal: 'admin-supprimer-compte' })

    const fiche = {
      ok: true,
      trouve: true,
      email: adresse,
      modeTestStripe: STRIPE_TEST,
      essaiUtilise,
      estAdmin: await estAdmin(cible.id),
      estVous: cible.id === admin.id,
      compte: {
        nom: profil?.nom || null,
        plan: profil?.plan || 'free',
        cree_le: cible.cree_le,
        clinique: appartenance ? { nom: clinique?.nom || null, role: appartenance.role } : null,
      },
      apercu: apercu.ok && 'apercu' in apercu ? apercu.apercu : null,
    }
    if (!detail) return json(fiche)

    // ─── DÉTAIL : POURQUOI A-T-IL ACCÈS, OU PAS ──────────────
    let abonnement = null, stripeInjoignable = false
    if (profil?.stripe_customer_id) {
      try { abonnement = await lireAbonnement(profil.stripe_customer_id) } catch (err) {
        console.error('admin-supprimer-compte: lecture Stripe impossible', err)
        stripeInjoignable = true
      }
    }

    let detailClinique = null
    if (appartenance) {
      const [{ count: membres }, { data: envoyees }, { data: proprietaire }] = await Promise.all([
        supabase.from('membres_equipe').select('user_id', { count: 'exact', head: true }).eq('equipe_id', appartenance.equipe_id),
        supabase.from('team_invitations').select('id, email, created_at').eq('team_id', appartenance.equipe_id).eq('status', 'pending')
          .order('created_at', { ascending: false }).limit(10),
        appartenance.role !== 'proprietaire' && clinique?.proprietaire_id
          ? supabase.from('profiles').select('nom, email, plan').eq('id', clinique.proprietaire_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ])
      detailClinique = {
        membres: membres ?? null,
        sieges: clinique?.max_membres ?? null,
        proprietaire,
        invitationsEnvoyees: (envoyees || []).map((i: { id: string, email: string, created_at: string }) => ({ id: i.id, email: i.email, envoyee_le: i.created_at })),
      }
    }

    return json({
      ...fiche,
      connexion: { derniere: cible.derniere_connexion, confirme: cible.confirme },
      abonnement,
      stripeInjoignable,
      clinique: detailClinique,
      invitationsRecues: recues,
    })
  }

  if (action !== 'supprimer' && action !== 'effacer-stripe') {
    return refus('action_inconnue', 'Action inconnue.', 400)
  }
  if ((effacerStripe || action === 'effacer-stripe') && !STRIPE_TEST) {
    return refus('stripe_reel', "L'historique Stripe ne s'efface qu'en mode test.", 400)
  }

  // ─── EFFACER STRIPE SEULEMENT (COMPTE DÉJÀ SUPPRIMÉ) ──────
  if (action === 'effacer-stripe') {
    /* Un compte existant garde son lien vers son client Stripe :
       l'effacer seul briserait son abonnement. */
    if (cible) return refus('compte_existant', "Ce compte existe encore : supprimez-le, avec l'option Stripe cochée.", 400)
    try {
      const clientsStripeEffaces = await effacerClientsStripe(adresse)
      console.log(`admin-supprimer-compte: ${admin.email} a effacé ${clientsStripeEffaces} client(s) Stripe de ${adresse}`)
      return json({ ok: true, clientsStripeEffaces })
    } catch (err) {
      console.error('admin-supprimer-compte: effacement Stripe impossible', err)
      return refus('stripe_indisponible', "Impossible de joindre Stripe en ce moment. Réessayez dans quelques minutes.", 502)
    }
  }

  // ─── SUPPRIMER ───────────────────────────────────────────
  if (!cible) return refus('compte_introuvable', 'Aucun compte avec cette adresse.', 404)
  if (cible.id === admin.id) return refus('propre_compte', 'Supprimez votre propre compte depuis votre profil.', 400)
  if (await estAdmin(cible.id)) {
    return refus('compte_admin', "Ce compte fait partie de l'administration : il ne peut pas être supprimé ici.", 400)
  }

  const resultat = await supprimerCompte(supabase, stripe, cible.id, adresse, { journal: 'admin-supprimer-compte' })
  if (!resultat.ok) return json({ error: resultat.error }, resultat.statut)
  console.log(`admin-supprimer-compte: ${admin.email} a supprimé le compte ${adresse}`)

  let clientsStripeEffaces = 0
  if (effacerStripe) {
    try {
      clientsStripeEffaces = await effacerClientsStripe(adresse)
    } catch (err) {
      // Le compte est déjà supprimé : on le signale, sans revenir en arrière.
      console.error('admin-supprimer-compte: effacement Stripe incomplet', err)
      return json({ ...resultat, clientsStripeEffaces, avertissement: 'stripe_incomplet' })
    }
  }

  return json({ ...resultat, clientsStripeEffaces })
})
