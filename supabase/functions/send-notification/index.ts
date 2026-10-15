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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Vérifier l'identité de l'expéditeur
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) return json({ error: 'Non autorisé' }, 401)

  let recipients: unknown, type: unknown, referenceId: unknown
  try {
    const body = await req.json()
    recipients = body?.recipients
    type = body?.type
    referenceId = body?.reference_id
  } catch {
    return json({ error: 'Corps de requête invalide' }, 400)
  }

  if (!Array.isArray(recipients) || recipients.length === 0 || typeof referenceId !== 'string') {
    return json({ error: 'Paramètres manquants' }, 400)
  }

  // Vérifier que l'expéditeur est membre d'une équipe
  const { data: profil } = await supabase
    .from('profiles')
    .select('equipe_id, nom')
    .eq('id', user.id)
    .single()

  if (!profil?.equipe_id) return json({ error: 'Accès refusé, pas membre d\'une équipe' }, 403)

  const auteur = (profil.nom || '').trim() || user.email || 'Un membre'

  /* ════════════════════════════════════════════════════════════
     Le texte de la notification est composé ici, à partir de
     l'élément de la clinique qu'elle signale. Avant, l'app
     envoyait le texte : un membre pouvait faire afficher
     n'importe quel message chez ses collègues, comme s'il venait
     d'Adjuvet.
     ════════════════════════════════════════════════════════════ */
  let message: string
  let referenceType: string
  let destinatairesPermis: Set<string> | null = null

  if (type === 'tag_babillard') {
    const { data: publication } = await supabase
      .from('babillard_messages')
      .select('id, contenu')
      .eq('id', referenceId)
      .eq('team_id', profil.equipe_id)
      .maybeSingle()
    if (!publication) return json({ error: 'Publication introuvable' }, 404)
    const toute = /(^|[^\p{L}\p{N}])@equipe(?![\p{L}\p{N}_-])/iu.test(publication.contenu || '')
    message = toute
      ? `${auteur} a tagué toute l'équipe dans le babillard`
      : `${auteur} vous a tagué dans le babillard`
    referenceType = 'babillard'
  } else if (type === 'tache_assignee') {
    const { data: tache } = await supabase
      .from('taches')
      .select('id, titre, assignee_id')
      .eq('id', referenceId)
      .eq('team_id', profil.equipe_id)
      .maybeSingle()
    if (!tache) return json({ error: 'Tâche introuvable' }, 404)
    message = `${auteur} vous a assigné une tâche : ${(tache.titre || '').slice(0, 200)}`
    referenceType = 'tache'
    // Seule la personne assignée est prévenue.
    destinatairesPermis = new Set(tache.assignee_id ? [tache.assignee_id] : [])
  } else {
    return json({ error: 'Type de notification inconnu' }, 400)
  }

  // Vérifier que tous les destinataires sont membres de la même équipe
  const { data: membresEquipe } = await supabase
    .from('membres_equipe')
    .select('user_id')
    .eq('equipe_id', profil.equipe_id)

  const membresIds = new Set((membresEquipe || []).map(m => m.user_id))
  const destinatairesValides = [...new Set(recipients as string[])].filter(id =>
    typeof id === 'string' && id !== user.id && membresIds.has(id) && (!destinatairesPermis || destinatairesPermis.has(id))
  )

  if (destinatairesValides.length === 0) {
    return json({ error: 'Aucun destinataire valide' }, 400)
  }

  // Insérer les notifications via service role (bypass RLS)
  const { error: insertErr } = await supabase.from('notifications').insert(
    destinatairesValides.map(uid => ({
      user_id: uid,
      type,
      message,
      reference_type: referenceType,
      reference_id: referenceId,
      lu: false,
    }))
  )

  if (insertErr) {
    console.error('Erreur insertion notifications:', insertErr)
    return json({ error: 'Erreur lors de l\'envoi' }, 500)
  }

  console.log(`send-notification: ${destinatairesValides.length} notif(s) envoyée(s) par ${user.id}`)

  return json({ ok: true, sent: destinatairesValides.length })
})
