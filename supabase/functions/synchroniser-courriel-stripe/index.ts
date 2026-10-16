import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { synchroniserCourrielStripe } from '../_shared/stripeCourriel.ts'

/* Appelée par la base de données quand le courriel d'un profil change
   (déclencheur sur_changement_courriel_stripe) : le client Stripe
   reçoit la nouvelle adresse.

   Pas de connexion ici (verify_jwt = false) : l'appel porte une clé
   gardée dans le coffre de la base (Vault), lue avec le service role.
   Sans la bonne clé, refus. La fonction ne fait que recopier chez
   Stripe le courriel déjà enregistré dans le profil. */

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

// Comparaison en temps constant : la durée ne révèle rien de la clé.
function egales(a: string, b: string) {
  if (a.length !== b.length) return false
  let difference = 0
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return difference === 0
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non permise' }, 405)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: cle } = await supabase.rpc('cle_synchro_courriel_stripe')
  if (typeof cle !== 'string' || !cle || !egales(req.headers.get('x-cle-synchro') || '', cle)) {
    return json({ error: 'Non autorisé' }, 401)
  }

  const { user_id } = await req.json().catch(() => ({}))
  if (typeof user_id !== 'string') return json({ error: 'user_id manquant' }, 400)

  const { data: profil } = await supabase
    .from('profiles')
    .select('email, stripe_customer_id')
    .eq('id', user_id)
    .maybeSingle()
  if (!profil?.stripe_customer_id || !profil.email) return json({ synchronise: false })

  try {
    const synchronise = await synchroniserCourrielStripe(stripe, profil.stripe_customer_id, profil.email)
    return json({ synchronise })
  } catch (erreur) {
    console.error('Synchronisation du courriel Stripe :', erreur)
    return json({ error: 'Stripe indisponible' }, 502)
  }
})
