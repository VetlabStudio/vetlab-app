import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
   SIGNALEMENTS D'ERREURS DANS LE CONTENU

   La table signalements n'a aucune règle d'accès : tout passe par
   cette fonction (clé service).
   - « envoyer » : tout compte connecté, depuis le lien « Signaler
     une erreur » au bas d'une fiche. Au plus 20 par jour ;
   - « compter », « lister », « traiter » : réservées aux comptes de
     la table admins_app (Admin - Signalements). Traiter un
     signalement peut aviser la personne par une notification.

   Le courriel de la personne n'est pas copié dans le signalement :
   il est relu dans son profil. Si le compte est supprimé, le
   signalement reste, sans auteur.
   ════════════════════════════════════════════════════════════ */

const TYPES = ['dose', 'info', 'coquille', 'autre']
const MAX_PAR_JOUR = 20

function texte(valeur: unknown, max: number): string | null {
  if (typeof valeur !== 'string') return null
  const t = valeur.trim()
  return t && t.length <= max ? t : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return refus('non_autorise', 'Session expirée. Reconnectez-vous.', 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return refus('non_autorise', 'Session expirée. Reconnectez-vous.', 401)

  let corps: Record<string, unknown>
  try {
    corps = await req.json() ?? {}
  } catch {
    return refus('requete_invalide', 'Requête invalide.', 400)
  }

  // ─── ENVOYER ─────────────────────────────────────────────
  if (corps.action === 'envoyer') {
    const page = (corps.page ?? {}) as Record<string, unknown>
    const categorie = texte(page.categorie, 60)
    const pageNom = texte(page.nom, 200)
    const route = texte(page.route, 300)
    const message = texte(corps.message, 2000)
    const type = TYPES.includes(corps.type as string) ? corps.type as string : 'autre'
    const source = typeof corps.source === 'string' && corps.source.trim() ? texte(corps.source, 300) : ''
    if (!categorie || !pageNom || !route?.startsWith('/') || source === null) return refus('requete_invalide', 'Requête invalide.', 400)
    if (!message) return refus('message_invalide', 'Décrivez la correction en 2000 caractères au plus.', 400)

    const depuis = new Date(Date.now() - 86400000).toISOString()
    const { count } = await supabase
      .from('signalements')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', depuis)
    if ((count ?? 0) >= MAX_PAR_JOUR) {
      return refus('trop_de_signalements', "Vous avez envoyé beaucoup de signalements aujourd'hui. Réessayez demain.", 429)
    }

    const { error } = await supabase.from('signalements').insert({
      user_id: user.id, categorie, page_nom: pageNom, route, type, message, source: source || null,
    })
    if (error) {
      console.error('signalements: enregistrement impossible', error)
      return refus('enregistrement_impossible', "Le signalement n'a pas pu être envoyé. Réessayez.", 500)
    }
    return json({ ok: true })
  }

  // ─── ADMINISTRATION ──────────────────────────────────────
  const { data: adminApp } = await supabase.from('admins_app').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!adminApp) return refus('reserve_admin', "Réservé à l'administration.", 403)

  const compterATraiter = async () => {
    const { count } = await supabase.from('signalements').select('id', { count: 'exact', head: true }).eq('statut', 'a_traiter')
    return count ?? 0
  }

  if (corps.action === 'compter') return json({ ok: true, aTraiter: await compterATraiter() })

  if (corps.action === 'lister') {
    const traites = corps.statut === 'traites'
    const requete = supabase.from('signalements').select('*')
    const { data, error } = traites
      ? await requete.in('statut', ['corrige', 'rejete']).order('traite_le', { ascending: false }).limit(100)
      : await requete.eq('statut', 'a_traiter').order('created_at', { ascending: false }).limit(100)
    if (error) {
      console.error('signalements: lecture impossible', error)
      return refus('lecture_impossible', "Les signalements n'ont pas pu être chargés. Réessayez.", 500)
    }
    const ids = [...new Set((data || []).map(s => s.user_id).filter(Boolean))]
    const { data: profils } = ids.length
      ? await supabase.from('profiles').select('id, nom, email').in('id', ids)
      : { data: [] }
    const signalements = (data || []).map(s => {
      const p = (profils || []).find(x => x.id === s.user_id)
      return { ...s, auteur: p ? { nom: p.nom || null, email: p.email || null } : null }
    })
    return json({ ok: true, signalements, aTraiter: await compterATraiter() })
  }

  if (corps.action === 'traiter') {
    const decision = corps.decision === 'corrige' || corps.decision === 'rejete' ? corps.decision : null
    const reponse = typeof corps.reponse === 'string' && corps.reponse.trim() ? texte(corps.reponse, 1000) : ''
    if (typeof corps.id !== 'string' || !decision || reponse === null) return refus('requete_invalide', 'Requête invalide.', 400)

    // Seulement s'il est encore à traiter : deux clics ne l'avisent pas deux fois.
    const { data: s, error } = await supabase
      .from('signalements')
      .update({ statut: decision, reponse: reponse || null, traite_le: new Date().toISOString() })
      .eq('id', corps.id)
      .eq('statut', 'a_traiter')
      .select('user_id, page_nom')
      .maybeSingle()
    if (error) {
      console.error('signalements: mise à jour impossible', error)
      return refus('mise_a_jour_impossible', "Le signalement n'a pas pu être mis à jour. Réessayez.", 500)
    }
    if (!s) return refus('deja_traite', 'Ce signalement a déjà été traité.', 409)

    let notifie = false
    if (corps.avertir === true && s.user_id) {
      const message = (decision === 'corrige'
        ? `Votre signalement sur « ${s.page_nom} » a été corrigé. Merci !`
        : `Votre signalement sur « ${s.page_nom} » a été examiné : aucune correction n'a été nécessaire.`)
        + (reponse ? ` Message de l'équipe Adjuvet : ${reponse}` : '')
      const { error: erreurNotif } = await supabase.from('notifications').insert({
        user_id: s.user_id, type: 'signalement', message, reference_type: null, reference_id: null, lu: false,
      })
      // Non bloquant : le signalement est traité, l'app dit seulement que l'avis n'est pas parti.
      if (erreurNotif) console.error('signalements: notification impossible', erreurNotif)
      notifie = !erreurNotif
    }
    console.log(`signalements: ${user.email} a marqué ${corps.id} ${decision}`)
    return json({ ok: true, notifie })
  }

  return refus('action_inconnue', 'Action inconnue.', 400)
})
