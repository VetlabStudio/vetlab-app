import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { supprimerCompte } from '../_shared/suppressionCompte.ts'
import { essaiDejaUtilise, estClientAdjuvet } from '../_shared/essai.ts'

const CLE_STRIPE = Deno.env.get('STRIPE_SECRET_KEY')!
const stripe = new Stripe(CLE_STRIPE, { apiVersion: '2023-10-16' })
// Effacer l'historique Stripe n'est permis qu'avec les clés de test.
const STRIPE_TEST = CLE_STRIPE.startsWith('sk_test_') || CLE_STRIPE.startsWith('rk_test_')

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
   SUPPRESSION D'UN COMPTE PAR L'ADMINISTRATION

   Réservée aux comptes de la table admins_app. Trois actions :
   - « chercher » : la fiche du compte et ce que la suppression
     entraînerait, sans rien toucher ;
   - « supprimer » : le même nettoyage complet que le bouton du
     profil (_shared/suppressionCompte.ts) ;
   - « effacer-stripe » : pour une adresse sans compte (déjà
     supprimé), retirer seulement ses clients Stripe.

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

  let action: unknown, email: unknown, effacerStripe = false
  try {
    const corps = await req.json()
    action = corps?.action
    email = corps?.email
    effacerStripe = corps?.effacerStripe === true
  } catch {
    return refus('requete_invalide', 'Requête invalide.', 400)
  }
  const adresse = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) {
    return refus('courriel_invalide', "Cette adresse courriel n'est pas valide.", 400)
  }

  // ─── TROUVER LE COMPTE ───────────────────────────────────
  /* Par le profil d'abord ; sinon parmi les comptes de connexion
     (profil sans courriel). Les _ et % d'une adresse sont des jokers
     pour ilike : on les neutralise, puis on compare exactement. */
  let cible: { id: string, cree_le: string | null } | null = null
  const { data: profils } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', adresse.replace(/[\\%_]/g, (c) => '\\' + c))
  const profilTrouve = (profils || []).find(p => (p.email || '').toLowerCase() === adresse)
  if (profilTrouve) {
    const { data } = await supabase.auth.admin.getUserById(profilTrouve.id)
    if (data?.user) cible = { id: data.user.id, cree_le: data.user.created_at ?? null }
  }
  if (!cible) {
    for (let page = 1; page <= 20 && !cible; page++) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
      if (error || !data?.users?.length) break
      const u = data.users.find(x => (x.email || '').toLowerCase() === adresse)
      if (u) cible = { id: u.id, cree_le: u.created_at ?? null }
      if (data.users.length < 1000) break
    }
  }

  // ─── CHERCHER ────────────────────────────────────────────
  if (action === 'chercher') {
    // null : Stripe injoignable, l'app l'indique sans bloquer la recherche.
    let essaiUtilise: boolean | null = null
    try { essaiUtilise = await essaiDejaUtilise(stripe, adresse) } catch { essaiUtilise = null }

    if (!cible) return json({ ok: true, trouve: false, email: adresse, essaiUtilise, modeTestStripe: STRIPE_TEST })

    const [{ data: profil }, { data: appartenance }] = await Promise.all([
      supabase.from('profiles').select('nom, plan').eq('id', cible.id).maybeSingle(),
      supabase.from('membres_equipe').select('role, equipe_id').eq('user_id', cible.id).limit(1).maybeSingle(),
    ])
    const { data: clinique } = appartenance
      ? await supabase.from('equipes').select('nom').eq('id', appartenance.equipe_id).maybeSingle()
      : { data: null }
    const apercu = await supprimerCompte(supabase, stripe, cible.id, adresse, { verification: true, journal: 'admin-supprimer-compte' })

    return json({
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
