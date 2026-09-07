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

  const { token, email, password, nom } = await req.json()
  if (!token || !email || !password) return json({ error: 'invalide' }, 400)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Vérifier l'invitation
  const { data: invitation } = await supabase
    .from('team_invitations')
    .select('id, team_id, email, role, status')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invitation) return json({ error: 'invalide' })
  if (invitation.email.toLowerCase() !== email.toLowerCase()) return json({ error: 'email_mismatch' })

  // Vérifier la capacité de l'équipe
  const { data: equipe } = await supabase
    .from('equipes')
    .select('seats_total')
    .eq('id', invitation.team_id)
    .single()

  const { count } = await supabase
    .from('membres_equipe')
    .select('*', { count: 'exact', head: true })
    .eq('equipe_id', invitation.team_id)

  if (equipe && count !== null && count >= equipe.seats_total) return json({ error: 'plein' })

  // Créer le compte avec email déjà confirmé
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nom: nom?.trim() || '' },
  })

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) return json({ error: 'deja_inscrit' })
    return json({ error: createError.message }, 500)
  }

  const userId = newUser.user.id

  // Créer le profil
  await supabase.from('profiles').upsert({
    id: userId,
    email,
    nom: nom?.trim() || '',
    plan: 'equipe',
    equipe_id: invitation.team_id,
    role: invitation.role,
  }, { onConflict: 'id' })

  // Ajouter dans membres_equipe
  await supabase.from('membres_equipe').insert({
    equipe_id: invitation.team_id,
    user_id: userId,
    role: invitation.role,
  })

  // Marquer l'invitation comme acceptée
  await supabase.from('team_invitations').update({ status: 'accepted' }).eq('id', invitation.id)

  return json({ ok: true })
})
