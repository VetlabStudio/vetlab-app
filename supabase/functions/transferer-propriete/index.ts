import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')!
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return new Response('Non autorisé', { status: 401, headers: corsHeaders })

  const { equipe_id, nouveau_proprio_user_id } = await req.json()

  // Vérifier que l'appelant est bien le propriétaire actuel
  const { data: membre } = await supabase
    .from('membres_equipe')
    .select('role')
    .eq('equipe_id', equipe_id)
    .eq('user_id', user.id)
    .single()

  if (membre?.role !== 'proprietaire') {
    return new Response(
      JSON.stringify({ error: 'Non autorisé — vous devez être propriétaire pour transférer la propriété.' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Récupérer le stripe_customer_id de l'ancien propriétaire
  const { data: oldProfile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  // Transférer le stripe_customer_id vers le nouveau propriétaire
  if (oldProfile?.stripe_customer_id) {
    const [updateNew, updateOld] = await Promise.all([
      supabase.from('profiles')
        .update({ stripe_customer_id: oldProfile.stripe_customer_id })
        .eq('id', nouveau_proprio_user_id),
      supabase.from('profiles')
        .update({ stripe_customer_id: null })
        .eq('id', user.id),
    ])

    if (updateNew.error || updateOld.error) {
      return new Response(
        JSON.stringify({ error: 'Erreur lors du transfert de facturation.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  // Échanger les rôles dans membres_equipe
  const { error: rpcError } = await supabase.rpc('transferer_propriete', {
    equipe_id_param: equipe_id,
    nouveau_proprio_user_id,
  })

  if (rpcError) {
    // Rollback du stripe_customer_id si le swap de rôle a échoué
    if (oldProfile?.stripe_customer_id) {
      await Promise.all([
        supabase.from('profiles').update({ stripe_customer_id: oldProfile.stripe_customer_id }).eq('id', user.id),
        supabase.from('profiles').update({ stripe_customer_id: null }).eq('id', nouveau_proprio_user_id),
      ])
    }
    return new Response(
      JSON.stringify({ error: rpcError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
