import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { supprimerCompte } from '../_shared/suppressionCompte.ts'

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
   SUPPRESSION DE SON PROPRE COMPTE
   Le nettoyage complet (Stripe, clinique, données, photo,
   invitations) est dans _shared/suppressionCompte.ts, partagé
   avec la page d'administration.

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

  const resultat = await supprimerCompte(supabase, stripe, user.id, user.email ?? null, { verification })
  if (!resultat.ok) return json({ error: resultat.error }, resultat.statut)
  return json(resultat)
})
