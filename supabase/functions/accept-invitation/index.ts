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

  // Vérifier l'identité de l'utilisateur via son JWT
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) return json({ error: 'Non autorisé' }, 401)

  let token: string
  try {
    const body = await req.json()
    token = body?.token
  } catch {
    return json({ error: 'Corps de requête invalide' }, 400)
  }

  if (!token) return json({ error: 'Token requis' }, 400)

  // Vérifier l'invitation (service role, bypass RLS)
  const { data: invitation } = await supabase
    .from('team_invitations')
    .select('id, team_id, email, role')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invitation) return json({ ok: false, error: 'invalide' })

  // Le courriel de l'utilisateur connecté doit correspondre à celui de l'invitation
  if (user.email !== invitation.email) return json({ ok: false, error: 'email_mismatch' })

  // Vérifier la capacité de l'équipe
  const { data: equipe } = await supabase
    .from('equipes')
    .select('max_membres')
    .eq('id', invitation.team_id)
    .single()

  const { count: membresCount } = await supabase
    .from('membres_equipe')
    .select('*', { count: 'exact', head: true })
    .eq('equipe_id', invitation.team_id)

  if (equipe?.max_membres && membresCount !== null && membresCount >= equipe.max_membres) {
    return json({ ok: false, error: 'plein' })
  }

  // Insérer le membre
  const { error: membreErr } = await supabase
    .from('membres_equipe')
    .upsert(
      { equipe_id: invitation.team_id, user_id: user.id, role: invitation.role },
      { onConflict: 'equipe_id,user_id' }
    )

  if (membreErr) {
    console.error('Erreur insertion membre:', membreErr)
    return json({ ok: false, error: 'erreur_insertion' })
  }

  // Marquer l'invitation comme acceptée
  await supabase
    .from('team_invitations')
    .update({ status: 'accepted' })
    .eq('token', token)

  // Mettre à jour le profil
  await supabase
    .from('profiles')
    .update({ plan: 'equipe', equipe_id: invitation.team_id, role: invitation.role })
    .eq('id', user.id)

  console.log(`accept-invitation: user ${user.id} a rejoint l'équipe ${invitation.team_id}`)

  return json({ ok: true })
})
