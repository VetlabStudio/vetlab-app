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

const norm = (e?: string | null) => (e || '').trim().toLowerCase()

const JOURS_VALIDITE = 7

function invitationExpiree(creeLe: string | null): boolean {
  if (!creeLe) return false
  return Date.now() - new Date(creeLe).getTime() > JOURS_VALIDITE * 86400000
}

/* ════════════════════════════════════════════════════════════
   Ce chemin crée un compte neuf : il n'y a donc aucun abonnement
   Stripe à annuler. Si l'adresse existe déjà, la fonction répond
   `deja_inscrit` et la personne passe par accept-invitation, qui
   s'occupe de l'annulation.
   ════════════════════════════════════════════════════════════ */

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
    .select('id, team_id, email, role, status, created_at')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invitation) return json({ error: 'invalide' })
  if (invitationExpiree(invitation.created_at)) return json({ error: 'expiree' })
  if (norm(invitation.email) !== norm(email)) return json({ error: 'email_mismatch' })

  /* La colonne s'appelle `max_membres`, pas `seats_total`.
     Avec l'ancien nom, la requête échouait, `equipe` revenait à
     null, et la condition ci-dessous ne se déclenchait jamais :
     ce chemin n'avait aucune vérification de capacité. */
  const { data: equipe, error: equipeErr } = await supabase
    .from('equipes')
    .select('max_membres')
    .eq('id', invitation.team_id)
    .single()

  if (equipeErr) {
    console.error("Erreur de lecture de l'équipe:", equipeErr)
    return json({ error: 'erreur_equipe' }, 500)
  }

  const { count } = await supabase
    .from('membres_equipe')
    .select('*', { count: 'exact', head: true })
    .eq('equipe_id', invitation.team_id)

  if (equipe?.max_membres && count !== null && count >= equipe.max_membres) {
    return json({ error: 'plein' })
  }

  // Créer le compte avec email déjà confirmé : l'invitation a été
  // envoyée à cette adresse, la possession est donc démontrée.
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
  const { error: profilErr } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    nom: nom?.trim() || '',
    plan: 'equipe',
    equipe_id: invitation.team_id,
    role: invitation.role,
  }, { onConflict: 'id' })

  if (profilErr) {
    console.error('Erreur de création du profil:', profilErr)
    return json({ error: 'erreur_profil' }, 500)
  }

  // Ajouter dans membres_equipe
  const { error: membreErr } = await supabase.from('membres_equipe').insert({
    equipe_id: invitation.team_id,
    user_id: userId,
    role: invitation.role,
  })

  if (membreErr) {
    /* Le compte existe et le profil dit `equipe`, mais la personne
       n'est pas dans la table des membres. Il faut le savoir. */
    console.error(`INCOHÉRENCE: compte ${userId} créé sans ligne dans membres_equipe.`, membreErr)
    return json({ error: 'erreur_insertion' }, 500)
  }

  // Marquer l'invitation comme acceptée
  const { error: invitErr } = await supabase
    .from('team_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitation.id)
  if (invitErr) console.error("Erreur de mise à jour de l'invitation:", invitErr)

  console.log(`signup-and-accept-invitation: compte ${userId} créé et ajouté à l'équipe ${invitation.team_id}`)

  return json({ ok: true })
})
