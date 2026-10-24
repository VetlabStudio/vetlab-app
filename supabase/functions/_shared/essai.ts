import Stripe from 'npm:stripe@14'

/* Essai gratuit du forfait Pro, offert une seule fois par personne.
   Importé par create-checkout (qui l'applique) et get-subscription
   (qui dit à l'app s'il faut l'annoncer) : les deux décident pareil. */

export const JOURS_ESSAI = 14

/* A déjà eu un abonnement qui a démarré, même annulé : l'essai a servi.
   Un abonnement jamais démarré (premier paiement refusé) ne compte pas. */
export function aDejaEuAbonnement(abonnements: { status: string }[]): boolean {
  return abonnements.some(s => !['incomplete', 'incomplete_expired'].includes(s.status))
}

/* Le compte Stripe sert aussi à la boutique vetlabstudio.ca. Les
   clients créés par Adjuvet (create-checkout, transferer-propriete)
   portent tous l'identifiant du compte : les autres ne nous
   regardent pas. */
export function estClientAdjuvet(client: { metadata?: Record<string, string> | null }): boolean {
  return Boolean(client.metadata?.supabase_user_id)
}

/* Une fois par personne, pas une fois par compte : un compte supprimé
   puis recréé avec la même adresse avait droit à un nouvel essai. Les
   clients Stripe d'un compte supprimé restent (comptabilité) : on
   regarde donc tous ceux qui portent cette adresse. */
export async function essaiDejaUtilise(stripe: Stripe, email: string | null | undefined): Promise<boolean> {
  const adresse = (email || '').trim().toLowerCase()
  if (!adresse) return false
  const clients = await stripe.customers.list({ email: adresse, limit: 100 })
  for (const client of clients.data) {
    if (!estClientAdjuvet(client)) continue
    const abonnements = await stripe.subscriptions.list({ customer: client.id, status: 'all', limit: 100 })
    if (aDejaEuAbonnement(abonnements.data)) return true
  }
  return false
}
