import Stripe from 'npm:stripe@14'
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

/* ════════════════════════════════════════════════════════════
   SUPPRESSION D'UN COMPTE, PARTAGÉE
   Importée par delete-account (la personne supprime son propre
   compte) et admin-supprimer-compte (l'administration le fait
   à sa place) : les deux nettoient exactement pareil.

   Deux corrections par rapport à la toute première version.

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

   Avec `verification`, rien n'est supprimé : le résultat dit
   ce qui se passerait, pour avertir avec les bons chiffres
   avant de confirmer.
   ════════════════════════════════════════════════════════════ */

export interface Apercu {
  possedeEquipe: boolean
  nomEquipe: string | null
  nbMembres: number
  nbAbonnements: number
  nbInvitations: number
}

export type ResultatSuppression =
  | { ok: true, apercu: Apercu }
  | { ok: true, abonnementsAnnules: number, membresRetrogrades: number }
  | { ok: false, error: string, statut: number }

export async function supprimerCompte(
  supabase: SupabaseClient,
  stripe: Stripe,
  userId: string,
  email: string | null,
  { verification = false, journal = 'delete-account' }: { verification?: boolean, journal?: string } = {},
): Promise<ResultatSuppression> {
  const echec = (error: string, statut: number) => ({ ok: false as const, error, statut })

  // ─── ÉTAT DES LIEUX ───────────────────────────────────────

  const { data: profil } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  const { data: equipePossedee } = await supabase
    .from('equipes')
    .select('id, nom')
    .eq('proprietaire_id', userId)
    .maybeSingle()

  let autresMembres: { user_id: string }[] = []
  if (equipePossedee) {
    const { data } = await supabase
      .from('membres_equipe')
      .select('user_id')
      .eq('equipe_id', equipePossedee.id)
      .neq('user_id', userId)
    autresMembres = data || []
  }

  /* Les invitations sont liées à une adresse, pas à un compte :
     sans ce nettoyage, une invitation en attente survivait à la
     suppression et retenait un siège dans la clinique. */
  let invitations: { id: string }[] = []
  if (email) {
    const { data } = await supabase
      .from('team_invitations')
      .select('id, email')
      .eq('status', 'pending')
      .ilike('email', email.replace(/[\\%_]/g, (c) => '\\' + c))
    invitations = (data || []).filter((i: { email: string }) => i.email.toLowerCase() === email.toLowerCase())
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
      console.error(`${journal}: lecture des abonnements impossible`, err)
      if (!verification) return echec('stripe_indisponible', 502)
    }
  }

  // ─── APERÇU, SANS RIEN SUPPRIMER ──────────────────────────

  if (verification) {
    return {
      ok: true,
      apercu: {
        possedeEquipe: Boolean(equipePossedee),
        nomEquipe: equipePossedee?.nom || null,
        nbMembres: autresMembres.length,
        nbAbonnements: abonnements.length,
        nbInvitations: invitations.length,
      },
    }
  }

  // ─── ANNULATION STRIPE, AVANT TOUTE SUPPRESSION ───────────
  /* Tant que la ligne `profiles` existe, le lien vers le client
     Stripe est lisible. Après, il est perdu pour de bon. */
  for (const sub of abonnements) {
    try {
      // Le webhook reconnaît ce marqueur et n'envoie pas le courriel « abonnement terminé ».
      await stripe.subscriptions.cancel(sub.id, { cancellation_details: { comment: 'suppression_compte' } })
    } catch (err) {
      console.error(`${journal}: annulation de ${sub.id} impossible, suppression interrompue`, err)
      return echec('annulation_impossible', 502)
    }
  }
  if (abonnements.length) {
    console.log(`${journal}: ${abonnements.length} abonnement(s) annulé(s) pour ${userId}`)
  }

  /* Retirer les cartes enregistrées chez Stripe. Le client et ses
     factures restent (obligations comptables), mais plus aucun moyen
     de paiement n'y est attaché. Un échec ne bloque pas : les
     abonnements sont déjà annulés, plus rien ne peut être prélevé. */
  if (profil?.stripe_customer_id) {
    try {
      const moyens = await stripe.paymentMethods.list({ customer: profil.stripe_customer_id, limit: 100 })
      for (const pm of moyens.data) await stripe.paymentMethods.detach(pm.id)
      if (moyens.data.length) console.log(`${journal}: ${moyens.data.length} moyen(s) de paiement retiré(s)`)
    } catch (err) {
      console.error(`${journal}: retrait des moyens de paiement impossible, à faire à la main dans Stripe`, err)
    }
  }

  // ─── RÉTROGRADER LES MEMBRES AVANT DE DISSOUDRE ───────────

  if (autresMembres.length) {
    const { error: retroErr } = await supabase
      .from('profiles')
      .update({ plan: 'free', equipe_id: null, role: null })
      .in('id', autresMembres.map(m => m.user_id))

    if (retroErr) {
      console.error(`${journal}: rétrogradation des membres impossible, suppression interrompue`, retroErr)
      return echec('retrogradation_impossible', 500)
    }
    console.log(`${journal}: ${autresMembres.length} membre(s) rétrogradé(s) au forfait gratuit`)
  }

  // ─── SUPPRESSION ──────────────────────────────────────────

  /* Examens et chartes personnels : supprimés. Ceux d'une clinique
     restent à la clinique, leur user_id passe à null (SET NULL). */
  for (const table of ['examens_physiques', 'chartes_radio']) {
    const { error: persoErr } = await supabase.from(table).delete().eq('user_id', userId).is('equipe_id', null)
    if (persoErr) {
      console.error(`${journal}: suppression de ${table} impossible, suppression interrompue`, persoErr)
      return echec('donnees_personnelles_impossible', 500)
    }
  }

  if (equipePossedee) {
    const { error: equipeErr } = await supabase.from('equipes').delete().eq('id', equipePossedee.id)
    if (equipeErr) {
      console.error(`${journal}: suppression de l'équipe impossible, suppression interrompue`, equipeErr)
      return echec('equipe_impossible', 500)
    }
  }

  if (invitations.length) {
    const { error: invitErr } = await supabase.from('team_invitations').delete().in('id', invitations.map(i => i.id))
    // Non bloquant : une invitation oubliée s'annule aussi depuis la gestion de l'équipe.
    if (invitErr) console.error(`${journal}: retrait des invitations en attente impossible`, invitErr)
    else console.log(`${journal}: ${invitations.length} invitation(s) en attente retirée(s)`)
  }

  /* La photo de profil est publique (bucket avatars, nommée
     <id>.<extension>) : sans ce nettoyage, elle restait en ligne
     après la suppression du compte. */
  const { data: fichiers, error: listeErr } = await supabase.storage.from('avatars').list('', { search: userId })
  if (listeErr) {
    console.error(`${journal}: lecture des avatars impossible`, listeErr)
  } else {
    const aSupprimer = (fichiers || []).map(f => f.name).filter(n => n.startsWith(`${userId}.`))
    if (aSupprimer.length) {
      const { error: avatarErr } = await supabase.storage.from('avatars').remove(aSupprimer)
      if (avatarErr) console.error(`${journal}: suppression de la photo de profil impossible`, avatarErr)
    }
  }

  /* Le profil, les appartenances, favoris, notes, etc. partent en
     cascade avec l'utilisateur. Si cette étape échoue, le compte
     reste entier au lieu d'être à moitié supprimé. */
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) {
    console.error(`${journal}: suppression de l'utilisateur impossible`, error)
    return echec(error.message, 500)
  }

  console.log(`${journal}: compte ${userId} supprimé`)
  return { ok: true, abonnementsAnnules: abonnements.length, membresRetrogrades: autresMembres.length }
}
