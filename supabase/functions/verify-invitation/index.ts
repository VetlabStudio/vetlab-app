import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  let token: string
  try {
    const body = await req.json()
    token = body?.token
  } catch {
    return new Response(JSON.stringify({ error: 'Corps de requête invalide' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!token || typeof token !== 'string') {
    return new Response(JSON.stringify({ error: 'Token requis' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Service role — bypasse RLS, aucune politique anon nécessaire
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data } = await supabase
    .from('team_invitations')
    .select('id, team_id, email, role, equipes(nom)')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!data) {
    return new Response(JSON.stringify({ error: 'Invitation invalide ou déjà utilisée' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // On retourne uniquement le strict minimum nécessaire à l'affichage
  return new Response(JSON.stringify({
    invitation: {
      id: data.id,
      team_id: data.team_id,
      email: data.email,
      role: data.role,
      equipes: { nom: (data.equipes as any)?.nom },
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
