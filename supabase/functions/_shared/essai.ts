/* Essai gratuit du forfait Pro, offert une seule fois par personne.
   Importé par create-checkout (qui l'applique) et get-subscription
   (qui dit à l'app s'il faut l'annoncer) : les deux décident pareil. */

export const JOURS_ESSAI = 14

/* A déjà eu un abonnement qui a démarré, même annulé : l'essai a servi.
   Un abonnement jamais démarré (premier paiement refusé) ne compte pas. */
export function aDejaEuAbonnement(abonnements: { status: string }[]): boolean {
  return abonnements.some(s => !['incomplete', 'incomplete_expired'].includes(s.status))
}
