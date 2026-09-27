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

const JOURS_VALIDITE = 7

function invitationExpiree(creeLe: string | null): boolean {
  if (!creeLe) return false
  return Date.now() - new Date(creeLe).getTime() > JOURS_VALIDITE * 86400000
}

// Les adresses ne se comparent jamais brutes : une majuscule
// saisie dans le formulaire d'invitation suffirait à bloquer
// quelqu'un sans qu'il comprenne pourquoi.
const norm = (e?: string | null) => (e || '').trim().toLowerCase()

/* Annule l'abonnement Pro de la personne qui rejoint l'équipe.

   En fin de période : aucune refacturation, aucun jour perdu,
   aucun remboursement au prorata à traiter.

   En excluant le prix Équipe : sans ce garde-fou, quelqu'un qui
   possède déjà une clinique verrait l'abonnement de toute son
   équipe coupé.

   Un échec ne fait jamais échouer l'adhésion. Bloquer quelqu'un
   à la porte de son équipe parce qu'une API n'a pas répondu
   serait pire que le problème. Mais l'échec est journalisé de
   façon voyante, parce qu'il veut dire que quelqu'un paie deux
   fois en silence. */
async function annulerAbonnementPro(authHeader: string, userId: string) {
  const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/cancel-pro-subscription`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ aFinDePeriode: true, exclureEquipe: true }),
    })
    const corps = await res.json().catch(() => ({}))
    if (!res.ok || corps?.ok === false) {
      console.error(`FACTURATION À VÉRIFIER: l'abonnement de ${userId} n'a pas pu être annulé.`, corps)
      return
    }
    console.log(`accept-invitation: ${corps?.annules ?? 0} abonnement(s) programmés en fin de période pour ${userId}`)
  } catch (err) {
    console.error(`FACTURATION À VÉRIFIER: l'abonnement de ${userId} n'a pas pu être annulé.`, err)
  }
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

  let token: string | undefined
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
    .select('id, team_id, email, role, created_at')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invitation) return json({ ok: false, error: 'invalide' })
  if (invitationExpiree(invitation.created_at)) return json({ ok: false, error: 'expiree' })

  // Le courriel de l'utilisateur connecté doit correspondre à celui de l'invitation
  if (norm(user.email) !== norm(invitation.email)) return json({ ok: false, error: 'email_mismatch' })

  /* Une personne n'appartient qu'à une seule équipe. Mais un
     propriétaire ne peut pas simplement partir : sa clinique,
     son abonnement et ses membres dépendent de lui. Il doit
     d'abord transférer la propriété ou résilier. */
  const { data: equipePossedee } = await supabase
    .from('equipes')
    .select('id, nom')
    .eq('proprietaire_id', user.id)
    .maybeSingle()

  if (equipePossedee && equipePossedee.id !== invitation.team_id) {
    return json({
      ok: false,
      error: 'proprietaire_ailleurs',
      nomEquipe: equipePossedee.nom,
    })
  }

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

  /* Retrait de l'ancienne équipe, une fois la nouvelle ligne
     écrite. Dans cet ordre, un échec laisse la personne dans
     deux équipes le temps qu'on corrige, ce qui se rattrape.
     L'ordre inverse la laisserait dans aucune. */
  const { error: retraitErr } = await supabase
    .from('membres_equipe')
    .delete()
    .eq('user_id', user.id)
    .neq('equipe_id', invitation.team_id)

  if (retraitErr) {
    console.error(`INCOHÉRENCE: ${user.id} n'a pas pu être retiré de son ancienne équipe.`, retraitErr)
  }

  // Marquer l'invitation comme acceptée
  const { error: invitErr } = await supabase
    .from('team_invitations')
    .update({ status: 'accepted' })
    .eq('token', token)
  if (invitErr) {
    // Non bloquant : l'adhésion a réussi, l'invitation restera visible
    // comme en attente dans la page de gestion.
    console.error("Erreur de mise à jour de l'invitation:", invitErr)
  }

  /* Le profil est mis à jour AVANT l'annulation Stripe. La garde
     du webhook s'appuie sur la ligne de `membres_equipe`, qui est
     déjà écrite, mais autant que le plan soit cohérent avant que
     le moindre événement Stripe parte. */
  const { error: profilErr } = await supabase
    .from('profiles')
    .update({ plan: 'equipe', equipe_id: invitation.team_id, role: invitation.role })
    .eq('id', user.id)

  if (profilErr) {
    // Celle-là est bloquante : sans elle, la personne est membre
    // dans la table mais l'application la traite comme gratuite.
    console.error('Erreur de mise à jour du profil:', profilErr)
    return json({ ok: false, error: 'erreur_profil' })
  }

  await annulerAbonnementPro(authHeader, user.id)

  console.log(`accept-invitation: user ${user.id} a rejoint l'équipe ${invitation.team_id}`)

  return json({ ok: true })
})
