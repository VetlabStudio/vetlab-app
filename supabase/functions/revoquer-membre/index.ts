import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { courrielsActifs, echapper, envoyerCourriel, gabaritCourriel } from '../_shared/courriel.ts'

const APP_URL = (Deno.env.get('APP_URL') || 'https://adjuvet.app').replace(/\/+$/, '')

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
   RÉVOCATION D'UN MEMBRE

   La révocation elle-même reste faite par la fonction de la base
   `revoquer_membre`, appelée au nom de la personne connectée : ce
   sont ses vérifications (gestionnaire de la clinique, rôles) qui
   décident. Une fois l'accès retiré, la personne visée reçoit un
   courriel. Avant, elle ne l'apprenait qu'en ouvrant l'app.
   ════════════════════════════════════════════════════════════ */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)

  let membreUserId: unknown
  let equipeId: unknown
  try {
    const corps = await req.json()
    membreUserId = corps?.membre_user_id
    equipeId = corps?.equipe_id
  } catch {
    return json({ error: 'Requête invalide.' }, 400)
  }
  if (typeof membreUserId !== 'string' || typeof equipeId !== 'string') {
    return json({ error: 'Requête invalide.' }, 400)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const estMembre = async () => {
    const { data } = await supabase
      .from('membres_equipe')
      .select('user_id')
      .eq('equipe_id', equipeId)
      .eq('user_id', membreUserId)
      .maybeSingle()
    return Boolean(data)
  }

  /* Déjà retirée (ex. deuxième appel pour la même révocation) : rien à
     faire, et surtout pas un deuxième courriel. */
  if (!(await estMembre())) return json({ ok: true, dejaRetire: true })

  // Au nom de la personne connectée : la base applique ses propres règles.
  const cleClient = Deno.env.get('SUPABASE_ANON_KEY') || req.headers.get('apikey') || ''
  const commeAppelant = createClient(Deno.env.get('SUPABASE_URL')!, cleClient, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  })

  const { error: erreurRevocation } = await commeAppelant.rpc('revoquer_membre', {
    membre_user_id: membreUserId,
    equipe_id_param: equipeId,
  })
  if (erreurRevocation) {
    console.error('revoquer-membre: révocation refusée', erreurRevocation)
    return json({ error: "L'accès n'a pas pu être révoqué." }, 400)
  }

  // Aucun courriel si la personne fait toujours partie de la clinique.
  if (await estMembre()) {
    console.error(`revoquer-membre: ${membreUserId} fait toujours partie de l'équipe ${equipeId}`)
    return json({ error: "L'accès n'a pas pu être révoqué." }, 403)
  }

  if (courrielsActifs()) {
    const [{ data: membre }, { data: equipe }] = await Promise.all([
      supabase.from('profiles').select('email, nom').eq('id', membreUserId).maybeSingle(),
      supabase.from('equipes').select('nom').eq('id', equipeId).maybeSingle(),
    ])
    // Profil sans courriel : on prend celui du compte de connexion.
    const email = membre?.email || (await supabase.auth.admin.getUserById(membreUserId)).data?.user?.email

    if (email) {
      const nomEquipe = equipe?.nom || 'la clinique'
      const prenom = membre?.nom ? echapper(membre.nom.split(' ')[0]) : ''
      const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
      const html = gabaritCourriel({
        titre: `Accès retiré : ${nomEquipe}`,
        apercu: `Votre accès à ${nomEquipe} sur Adjuvet a été retiré.`,
        titreHtml: 'Acc&egrave;s retir&eacute;',
        corpsHtml: `${salutation}<br /><br />Votre acc&egrave;s &agrave; <strong>${echapper(nomEquipe)}</strong> sur Adjuvet a &eacute;t&eacute; retir&eacute; par la personne qui g&egrave;re la clinique. Les m&eacute;dicaments, protocoles, notes et t&acirc;ches de la clinique ne vous sont plus accessibles.<br /><br />Votre compte reste actif avec le forfait Gratuit. Vous pouvez passer &agrave; Pro en tout temps depuis l&rsquo;application.`,
        boutonTexte: 'Ouvrir Adjuvet',
        boutonUrl: APP_URL,
        noteHtml: 'Vous pensez qu&rsquo;il s&rsquo;agit d&rsquo;une erreur&nbsp;? Communiquez avec la personne qui g&egrave;re la clinique.',
      })
      await envoyerCourriel(email, `Votre accès à ${nomEquipe} a été retiré`, html)
    } else {
      console.warn(`Courriel de révocation non envoyé : aucune adresse pour le compte ${membreUserId}`)
    }
  }

  return json({ ok: true })
})
