import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

/* ════════════════════════════════════════════════════════════
   SUPPRESSION DE COMPTE

   Deux corrections par rapport à la version précédente.

   1. L'abonnement Stripe n'était jamais annulé. La carte
      continuait d'être débitée après le départ, et comme la
      ligne `profiles` disparaissait, plus rien ne reliait le
      `stripe_customer_id` à quelqu'un : le webhook ne pouvait
      même plus retrouver le compte. C'était irrattrapable.

   2. L'équipe était supprimée sans que ses membres soient
      rétrogradés. Ils gardaient `plan: 'equipe'` avec un
      `equipe_id` pointant vers une équipe disparue.

   Un échec de Stripe interrompt tout et ne supprime rien. Ça
   peut sembler dur, mais l'inverse laisserait un abonnement
   facturé à vie sans aucun moyen de le retrouver. La
   suppression, elle, se réessaie.

   Un appel avec { verification: true } ne supprime rien et
   retourne ce qui se passerait, pour que la page puisse
   avertir avec les bons chiffres avant de confirmer.
   ════════════════════════════════════════════════════════════ */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) return json({ error: 'Non autorisé' }, 401)

  let verification = false
  try {
    const corps = await req.json()
    verification = corps?.verification === true
  } catch {
    /* pas de corps : suppression réelle */
  }

  // ─── ÉTAT DES LIEUX ───────────────────────────────────────

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const { data: equipePossedee } = await supabase
    .from('equipes')
    .select('id, nom')
    .eq('proprietaire_id', user.id)
    .maybeSingle()

  let autresMembres: { user_id: string }[] = []
  if (equipePossedee) {
    const { data } = await supabase
      .from('membres_equipe')
      .select('user_id')
      .eq('equipe_id', equipePossedee.id)
      .neq('user_id', user.id)
    autresMembres = data || []
  }

  let abonnements: Stripe.Subscription[] = []
  if (profil?.stripe_customer_id) {
    try {
      /* Tout ce qui n'est pas terminé, pas seulement active/trialing :
         un abonnement past_due ou unpaid continue de tenter des
         prélèvements sur la carte. */
      const tous = await stripe.subscriptions.list({
        customer: profil.stripe_customer_id,
        status: 'all',
        limit: 100,
      })
      abonnements = tous.data.filter(s => s.status !== 'canceled' && s.status !== 'incomplete_expired')
    } catch (err) {
      console.error('delete-account: lecture des abonnements impossible', err)
      if (!verification) return json({ error: 'stripe_indisponible' }, 502)
    }
  }

  // ─── APERÇU, SANS RIEN SUPPRIMER ──────────────────────────

  if (verification) {
    return json({
      ok: true,
      apercu: {
        possedeEquipe: Boolean(equipePossedee),
        nomEquipe: equipePossedee?.nom || null,
        nbMembres: autresMembres.length,
        nbAbonnements: abonnements.length,
      },
    })
  }

  // ─── ANNULATION STRIPE, AVANT TOUTE SUPPRESSION ───────────
  /* Tant que la ligne `profiles` existe, le lien vers le client
     Stripe est lisible. Après, il est perdu pour de bon. */
  for (const sub of abonnements) {
    try {
      // Le webhook reconnaît ce marqueur et n'envoie pas le courriel « abonnement terminé ».
      await stripe.subscriptions.cancel(sub.id, { cancellation_details: { comment: 'suppression_compte' } })
    } catch (err) {
      console.error(`delete-account: annulation de ${sub.id} impossible, suppression interrompue`, err)
      return json({ error: 'annulation_impossible' }, 502)
    }
  }
  if (abonnements.length) {
    console.log(`delete-account: ${abonnements.length} abonnement(s) annulé(s) pour ${user.id}`)
  }

  // ─── RÉTROGRADER LES MEMBRES AVANT DE DISSOUDRE ───────────

  if (autresMembres.length) {
    const { error: retroErr } = await supabase
      .from('profiles')
      .update({ plan: 'free', equipe_id: null, role: null })
      .in('id', autresMembres.map(m => m.user_id))

    if (retroErr) {
      console.error('delete-account: rétrogradation des membres impossible, suppression interrompue', retroErr)
      return json({ error: 'retrogradation_impossible' }, 500)
    }
    console.log(`delete-account: ${autresMembres.length} membre(s) rétrogradé(s) au forfait gratuit`)
  }

  // ─── SUPPRESSION ──────────────────────────────────────────

  /* Examens et chartes personnels : supprimés. Ceux d'une clinique
     restent à la clinique, leur user_id passe à null (SET NULL). */
  for (const table of ['examens_physiques', 'chartes_radio']) {
    const { error: persoErr } = await supabase.from(table).delete().eq('user_id', user.id).is('equipe_id', null)
    if (persoErr) {
      console.error(`delete-account: suppression de ${table} impossible, suppression interrompue`, persoErr)
      return json({ error: 'donnees_personnelles_impossible' }, 500)
    }
  }

  if (equipePossedee) {
    const { error: equipeErr } = await supabase.from('equipes').delete().eq('id', equipePossedee.id)
    if (equipeErr) {
      console.error("delete-account: suppression de l'équipe impossible, suppression interrompue", equipeErr)
      return json({ error: 'equipe_impossible' }, 500)
    }
  }

  /* Le profil, les appartenances, favoris, notes, etc. partent en
     cascade avec l'utilisateur. Si cette étape échoue, le compte
     reste entier au lieu d'être à moitié supprimé. */
  const { error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('delete-account: suppression de l\'utilisateur impossible', error)
    return json({ error: error.message }, 500)
  }

  console.log(`delete-account: compte ${user.id} supprimé`)

  return json({ ok: true, abonnementsAnnules: abonnements.length, membresRetrogrades: autresMembres.length })
})
