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
   DÉPART D'UN MEMBRE (bouton « Quitter l'équipe »)

   Le départ lui-même reste fait par la fonction de la base
   `quitter_equipe`, appelée au nom de la personne connectée : elle
   refuse le propriétaire et prévient celui-ci dans l'app. Une fois
   le départ fait, la personne reçoit une confirmation par courriel.
   ════════════════════════════════════════════════════════════ */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return json({ error: 'Non autorisé' }, 401)

  const cliniqueActuelle = async () => {
    const { data } = await supabase
      .from('membres_equipe')
      .select('equipe_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
    return data?.equipe_id as string | undefined
  }

  /* Déjà partie (ex. deuxième appel pour le même départ) : rien à
     faire, et surtout pas un deuxième courriel. */
  const equipeId = await cliniqueActuelle()
  if (!equipeId) return json({ ok: true, dejaParti: true })

  // Lu avant le départ, pour le courriel.
  const { data: equipe } = await supabase.from('equipes').select('nom').eq('id', equipeId).maybeSingle()

  // Au nom de la personne connectée : la base applique ses propres règles.
  const cleClient = Deno.env.get('SUPABASE_ANON_KEY') || req.headers.get('apikey') || ''
  const commeAppelant = createClient(Deno.env.get('SUPABASE_URL')!, cleClient, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  })

  const { error: erreurDepart } = await commeAppelant.rpc('quitter_equipe')
  if (erreurDepart) {
    console.error('quitter-equipe: départ refusé', erreurDepart)
    return json({ error: "Vous n'avez pas pu quitter l'équipe." }, 400)
  }

  // Aucun courriel si la personne fait toujours partie de la clinique.
  if ((await cliniqueActuelle()) === equipeId) {
    console.error(`quitter-equipe: ${user.id} fait toujours partie de l'équipe ${equipeId}`)
    return json({ error: "Vous n'avez pas pu quitter l'équipe." }, 500)
  }

  if (courrielsActifs()) {
    const { data: profil } = await supabase.from('profiles').select('email, nom').eq('id', user.id).maybeSingle()
    const email = profil?.email || user.email

    if (email) {
      const nomEquipe = equipe?.nom || 'la clinique'
      const prenom = profil?.nom ? echapper(profil.nom.split(' ')[0]) : ''
      const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
      const html = gabaritCourriel({
        titre: `Vous avez quitté ${nomEquipe}`,
        apercu: `Votre départ de ${nomEquipe} sur Adjuvet est confirmé.`,
        titreHtml: 'D&eacute;part confirm&eacute;',
        corpsHtml: `${salutation}<br /><br />Vous avez quitt&eacute; <strong>${echapper(nomEquipe)}</strong> sur Adjuvet. Les m&eacute;dicaments, protocoles, notes et t&acirc;ches de la clinique ne vous sont plus accessibles.<br /><br />Votre compte reste actif avec le forfait Gratuit. Pour revenir dans la clinique, il faudra une nouvelle invitation.`,
        boutonTexte: 'Ouvrir Adjuvet',
        boutonUrl: APP_URL,
        noteHtml: 'Vous n&rsquo;&ecirc;tes pas &agrave; l&rsquo;origine de ce d&eacute;part&nbsp;? &Eacute;crivez-nous &agrave; <a class="lien" href="mailto:info@vetlabstudio.ca" style="color:#213058;">info@vetlabstudio.ca</a>.',
      })
      await envoyerCourriel(email, `Vous avez quitté ${nomEquipe}`, html)
    } else {
      console.warn(`Courriel de départ non envoyé : aucune adresse pour le compte ${user.id}`)
    }
  }

  return json({ ok: true })
})
