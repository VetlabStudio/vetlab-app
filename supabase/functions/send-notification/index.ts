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

  let recipients: string[], type: string, message: string,
    reference_type: string | null, reference_id: string | null

  try {
    const body = await req.json()
    recipients = body?.recipients
    type = body?.type
    message = body?.message
    reference_type = body?.reference_type ?? null
    reference_id = body?.reference_id ?? null
  } catch {
    return json({ error: 'Corps de requête invalide' }, 400)
  }

  if (!Array.isArray(recipients) || recipients.length === 0 || !type || !message) {
    return json({ error: 'Paramètres manquants' }, 400)
  }

  // Limiter la taille du message
  if (message.length > 500) return json({ error: 'Message trop long' }, 400)

  // Vérifier que l'expéditeur est membre d'une équipe
  const { data: profil } = await supabase
    .from('profiles')
    .select('equipe_id')
    .eq('id', user.id)
    .single()

  if (!profil?.equipe_id) return json({ error: 'Accès refusé — pas membre d\'une équipe' }, 403)

  // Vérifier que tous les destinataires sont membres de la même équipe
  const { data: membresEquipe } = await supabase
    .from('membres_equipe')
    .select('user_id')
    .eq('equipe_id', profil.equipe_id)

  const membresIds = new Set((membresEquipe || []).map(m => m.user_id))
  const destinatairesValides = recipients.filter(id => membresIds.has(id))

  if (destinatairesValides.length === 0) {
    return json({ error: 'Aucun destinataire valide' }, 400)
  }

  // Insérer les notifications via service role (bypass RLS)
  const { error: insertErr } = await supabase.from('notifications').insert(
    destinatairesValides.map(uid => ({
      user_id: uid,
      type,
      message,
      reference_type,
      reference_id,
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
