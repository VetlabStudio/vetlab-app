/* Garde le courriel du client Stripe identique à celui du compte, pour
   que reçus et factures partent à la bonne adresse. Importé par
   synchroniser-courriel-stripe, create-portal-session et create-checkout. */

import type Stripe from 'npm:stripe@14'

// Vrai si le courriel a été changé chez Stripe.
export async function synchroniserCourrielStripe(stripe: Stripe, clientId: string, courriel: string) {
  const client = await stripe.customers.retrieve(clientId)
  if ((client as Stripe.DeletedCustomer).deleted) return false
  if ((client as Stripe.Customer).email === courriel) return false
  await stripe.customers.update(clientId, { email: courriel })
  return true
}
