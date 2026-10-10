import Stripe from 'npm:stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { courrielsActifs, echapper, envoyerCourriel, gabaritCourriel } from '../_shared/courriel.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const PRICE_EQUIPE = Deno.env.get('STRIPE_PRICE_EQUIPE') || ''
const JOURS_VALIDITE = 7

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const expireLe = (creeLe: string) => new Date(new Date(creeLe).getTime() + JOURS_VALIDITE * 86400000)

function formaterDate(d: Date): string {
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Toronto' })
}

/* ════════════════════════════════════════════════════════════
   TRANSFERT DE PROPRIÉTÉ

   Avant, le transfert donnait au nouveau propriétaire le client
   Stripe de l'ancien, avec sa carte : l'ancien continuait de payer
   la clinique et le nouveau voyait sa carte et ses factures.

   Maintenant c'est une demande. Le membre visé l'accepte en entrant
   SA carte : son propre abonnement Équipe démarre, et son premier
   prélèvement n'arrive qu'à la fin de la période déjà payée par
   l'ancien propriétaire. Le webhook Stripe finalise l'échange quand
   la carte est acceptée, puis arrête l'abonnement de l'ancien en
   fin de période.

   Actions : demander, annuler (propriétaire), consulter, refuser,
   accepter (membre visé). La demande expire après 7 jours.
   ════════════════════════════════════════════════════════════ */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorisé' }, 401)
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return json({ error: 'Non autorisé' }, 401)

  let corps: Record<string, unknown> = {}
  try {
    corps = await req.json()
  } catch {
    return json({ error: 'Requête invalide.' }, 400)
  }
  const action = corps.action

  async function nomDe(userId: string): Promise<string> {
    const { data } = await supabase.from('profiles').select('nom, email').eq('id', userId).maybeSingle()
    return data?.nom || data?.email || 'Un membre'
  }

  // Une demande en attente pour cette personne (visée), expirée au besoin.
  async function demandeEnAttentePour(cibleId: string) {
    const { data: t } = await supabase
      .from('transferts_propriete')
      .select('id, equipe_id, demandeur_id, cible_id, cree_le')
      .eq('cible_id', cibleId)
      .eq('statut', 'en_attente')
      .order('cree_le', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!t) return null
    if (expireLe(t.cree_le).getTime() < Date.now()) {
      await supabase.from('transferts_propriete')
        .update({ statut: 'expire', termine_le: new Date().toISOString() }).eq('id', t.id)
      return null
    }
    return t
  }

  // L'abonnement Équipe en cours de l'ancien propriétaire, s'il en a un.
  async function abonnementEquipeDe(proprietaireId: string): Promise<Stripe.Subscription | null> {
    const { data: p } = await supabase.from('profiles').select('stripe_customer_id').eq('id', proprietaireId).maybeSingle()
    if (!p?.stripe_customer_id || !PRICE_EQUIPE) return null
    const subs = await stripe.subscriptions.list({ customer: p.stripe_customer_id, status: 'all', limit: 100 })
    return subs.data.find(s =>
      ['active', 'trialing', 'past_due'].includes(s.status) &&
      s.items.data.some(i => i.price?.id === PRICE_EQUIPE)
    ) || null
  }

  // ─── DEMANDER (propriétaire) ──────────────────────────────────
  if (action === 'demander') {
    const equipeId = corps.equipe_id as string
    const cibleId = corps.cible_id as string
    if (!equipeId || !cibleId) return json({ error: 'Requête invalide.' }, 400)
    if (cibleId === user.id) return json({ error: 'Vous êtes déjà propriétaire.' }, 400)

    const { data: equipe } = await supabase
      .from('equipes').select('id, nom, proprietaire_id').eq('id', equipeId).maybeSingle()
    if (!equipe || equipe.proprietaire_id !== user.id) {
      return json({ error: 'Seul le propriétaire peut transférer la clinique.' }, 403)
    }

    const { data: membre } = await supabase
      .from('membres_equipe').select('user_id').eq('equipe_id', equipeId).eq('user_id', cibleId).maybeSingle()
    if (!membre) return json({ error: "Cette personne ne fait pas partie de l'équipe." }, 400)

    // Une nouvelle demande remplace la précédente.
    await supabase.from('transferts_propriete')
      .update({ statut: 'annule', termine_le: new Date().toISOString() })
      .eq('equipe_id', equipeId).eq('statut', 'en_attente')

    const { data: transfert, error: insertErr } = await supabase
      .from('transferts_propriete')
      .insert({ equipe_id: equipeId, demandeur_id: user.id, cible_id: cibleId })
      .select('id, cree_le')
      .single()
    if (insertErr || !transfert) {
      console.error('transferer-propriete: création de la demande impossible', insertErr)
      return json({ error: 'La demande n\'a pas pu être créée. Réessayez.' }, 500)
    }

    const nomDemandeur = await nomDe(user.id)
    const nomEquipe = equipe.nom || 'votre clinique'
    const finValidite = formaterDate(expireLe(transfert.cree_le))

    await supabase.from('notifications').insert({
      user_id: cibleId,
      type: 'transfert',
      message: `${nomDemandeur} veut vous transférer la propriété de ${nomEquipe}.`,
      reference_type: 'transfert',
      reference_id: transfert.id,
      lu: false,
    })

    if (courrielsActifs()) {
      const { data: cible } = await supabase.from('profiles').select('email, nom').eq('id', cibleId).maybeSingle()
      if (cible?.email) {
        const prenom = cible.nom ? echapper(cible.nom.split(' ')[0]) : ''
        const salutation = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
        const html = gabaritCourriel({
          titre: `Transfert de ${nomEquipe}`,
          apercu: `${nomDemandeur} veut vous transférer la propriété de la clinique.`,
          titreHtml: 'Transfert de propri&eacute;t&eacute;',
          corpsHtml: `${salutation}<br /><br /><strong>${echapper(nomDemandeur)}</strong> souhaite vous transf&eacute;rer la propri&eacute;t&eacute; de <strong>${echapper(nomEquipe)}</strong> sur Adjuvet.<br /><br />Pour accepter, vous entrerez votre carte de cr&eacute;dit&nbsp;: l&rsquo;abonnement &Eacute;quipe sera alors &agrave; votre nom. Aucun pr&eacute;l&egrave;vement avant la fin de la p&eacute;riode d&eacute;j&agrave; pay&eacute;e.`,
          boutonTexte: 'Voir la demande',
          boutonUrl: 'https://adjuvet.app/equipe/transfert',
          noteHtml: `Cette demande expire le ${finValidite}.`,
        })
        await envoyerCourriel(cible.email, `${nomDemandeur} veut vous transférer ${nomEquipe}`, html)
      }
    }

    return json({ ok: true, transfert: { id: transfert.id, cible_id: cibleId, cree_le: transfert.cree_le } })
  }

  // ─── ANNULER (propriétaire) ───────────────────────────────────
  if (action === 'annuler') {
    const equipeId = corps.equipe_id as string
    const { data: equipe } = await supabase
      .from('equipes').select('proprietaire_id').eq('id', equipeId).maybeSingle()
    if (!equipe || equipe.proprietaire_id !== user.id) return json({ error: 'Non autorisé' }, 403)

    await supabase.from('transferts_propriete')
      .update({ statut: 'annule', termine_le: new Date().toISOString() })
      .eq('equipe_id', equipeId).eq('statut', 'en_attente')
    return json({ ok: true })
  }

  // ─── CONSULTER (membre visé) ──────────────────────────────────
  if (action === 'consulter') {
    const t = await demandeEnAttentePour(user.id)
    if (!t) return json({ transfert: null })

    const { data: equipe } = await supabase.from('equipes').select('nom, max_membres').eq('id', t.equipe_id).maybeSingle()
    const sub = await abonnementEquipeDe(t.demandeur_id).catch(() => null)
    const sieges = sub?.items.data[0]?.quantity || equipe?.max_membres || null
    const premierPrelevement = sub && (sub.status === 'active' || sub.status === 'trialing')
      ? formaterDate(new Date(sub.current_period_end * 1000))
      : null

    return json({
      transfert: {
        id: t.id,
        nomDemandeur: await nomDe(t.demandeur_id),
        nomEquipe: equipe?.nom || 'la clinique',
        expireLe: formaterDate(expireLe(t.cree_le)),
        sieges,
        premierPrelevement,
      },
    })
  }

  // ─── REFUSER (membre visé) ────────────────────────────────────
  if (action === 'refuser') {
    const t = await demandeEnAttentePour(user.id)
    if (!t) return json({ error: "Cette demande n'est plus valide." }, 400)

    await supabase.from('transferts_propriete')
      .update({ statut: 'refuse', termine_le: new Date().toISOString() }).eq('id', t.id)
    await supabase.from('notifications').insert({
      user_id: t.demandeur_id,
      type: 'transfert',
      message: `${await nomDe(user.id)} a refusé le transfert de propriété.`,
      reference_type: null,
      reference_id: null,
      lu: false,
    })
    return json({ ok: true })
  }

  // ─── ACCEPTER (membre visé) : ouvre le paiement ──────────────
  if (action === 'accepter') {
    if (!PRICE_EQUIPE) {
      console.error('transferer-propriete: STRIPE_PRICE_EQUIPE non configuré')
      return json({ error: 'Le transfert est indisponible pour le moment.' }, 500)
    }

    const t = await demandeEnAttentePour(user.id)
    if (!t) return json({ error: "Cette demande n'est plus valide." }, 400)

    const { data: equipe } = await supabase
      .from('equipes').select('proprietaire_id, max_membres').eq('id', t.equipe_id).maybeSingle()
    if (!equipe || equipe.proprietaire_id !== t.demandeur_id) {
      return json({ error: "Cette demande n'est plus valide." }, 400)
    }
    const { data: membre } = await supabase
      .from('membres_equipe').select('user_id').eq('equipe_id', t.equipe_id).eq('user_id', user.id).maybeSingle()
    if (!membre) return json({ error: "Vous ne faites plus partie de cette équipe." }, 400)

    const { count: nbMembres } = await supabase
      .from('membres_equipe').select('*', { count: 'exact', head: true }).eq('equipe_id', t.equipe_id)

    const ancien = await abonnementEquipeDe(t.demandeur_id)
    const quantity = Math.max(
      ancien?.items.data[0]?.quantity || equipe.max_membres || 2,
      nbMembres || 0,
      2,
    )

    /* Premier prélèvement à la fin de la période déjà payée par
       l'ancien propriétaire : billing_cycle_anchor + pas de prorata,
       la période d'ici là ne coûte rien. Sans abonnement payé en
       cours, la facturation commence tout de suite. */
    const finPayee = ancien && (ancien.status === 'active' || ancien.status === 'trialing')
      ? ancien.current_period_end
      : null
    const ancrage = finPayee && finPayee > Math.floor(Date.now() / 1000) + 3600 ? finPayee : null

    // Le client Stripe du nouveau propriétaire : le sien, jamais celui de l'ancien.
    const { data: profil } = await supabase
      .from('profiles').select('stripe_customer_id, email, nom').eq('id', user.id).single()
    let customerId = profil?.stripe_customer_id || null
    if (customerId) {
      try {
        const existant = await stripe.customers.retrieve(customerId)
        if ((existant as Stripe.DeletedCustomer).deleted) customerId = null
      } catch {
        customerId = null
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profil?.email || user.email,
        name: profil?.nom || '',
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_EQUIPE, quantity }],
      payment_method_collection: 'always',
      locale: 'fr',
      ui_mode: 'embedded',
      metadata: { transfert_id: t.id },
      subscription_data: {
        metadata: { transfert_id: t.id },
        ...(ancrage ? { billing_cycle_anchor: ancrage, proration_behavior: 'none' as const } : {}),
      },
      return_url: `${req.headers.get('origin')}/equipe/transfert?paiement=succes`,
    })

    return json({ clientSecret: session.client_secret })
  }

  return json({ error: 'Action inconnue.' }, 400)
})
