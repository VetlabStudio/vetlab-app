import { useState, useEffect, useEffectEvent, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'
import { useProfil } from '../context/ProfilContext'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY
const PRICE_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ANNUAL
const PRICE_EQUIPE = import.meta.env.VITE_STRIPE_PRICE_EQUIPE

const TIERS_EQUIPE = [
  { min: 1,  max: 5,    prix: 49 },
  { min: 6,  max: 10,   prix: 44 },
  { min: 11, max: null, prix: 39 },
]

function calculerPrixEquipe(n) {
  const tier = TIERS_EQUIPE.find(t => n >= t.min && (t.max === null || n <= t.max))
  return tier ? n * tier.prix : n * 39
}

function prixParSiege(n) {
  return TIERS_EQUIPE.find(t => n >= t.min && (t.max === null || n <= t.max))?.prix || 39
}

/* Infos du serveur : l'abonnement (prochain paiement, sièges) et le
   droit à l'essai gratuit. Facultatives : en cas d'erreur, la page
   s'affiche sans elles, et sans annoncer d'essai. */
async function lireInfosAbonnement() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch(
      'https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/get-subscription',
      { headers: { 'Authorization': `Bearer ${session.access_token}` } }
    )
    return await response.json()
  } catch {
    return null
  }
}

async function lireAbonnement() {
  const infos = await lireInfosAbonnement()
  return infos?.subscription || null
}

function formaterDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('fr-CA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/* Fenêtre d'activation, après un paiement ou un passage à Équipe.
   Une fenêtre plutôt qu'un bandeau en haut de page : on paie souvent
   après avoir défilé jusqu'au bas, où le bandeau ne se voyait pas.
   activation : { etat: 'attente' | 'active' | 'delai', plan, finEssai } */
function FenetreActivation({ activation, onFermer }) {
  const nom = activation.plan === 'equipe' ? 'Équipe' : 'Pro'
  const enAttente = activation.etat === 'attente'

  let icone, couleur, titre, texte
  if (enAttente) {
    icone = 'ti-loader-2 abo-activation-attente'
    couleur = 'var(--primary)'
    titre = 'Paiement reçu'
    texte = 'Activation de votre abonnement… Quelques secondes suffisent habituellement.'
  } else if (activation.etat === 'active') {
    icone = 'ti-circle-check'
    couleur = '#2E7D62'
    titre = `Abonnement ${nom} activé !`
    texte = activation.finEssai
      ? `Votre essai gratuit commence maintenant. Aucun prélèvement avant le ${formaterDate(activation.finEssai)}, et vous pouvez annuler sans frais d'ici là.`
      : activation.plan === 'equipe'
        ? "Votre clinique est prête : invitez vos collègues depuis la gestion de l'équipe."
        : 'Bienvenue dans la famille Pro ! Toutes les fonctionnalités Pro sont maintenant ouvertes.'
  } else {
    icone = 'ti-clock'
    couleur = 'var(--accent-gold)'
    titre = 'Paiement reçu'
    texte = `Votre abonnement est en cours d'activation. Si les fonctionnalités ${nom} ne sont pas encore ouvertes, fermez l'app et rouvrez-la dans une minute.`
  }

  return (
    <div className="popup-overlay" onClick={enAttente ? undefined : onFermer}>
      <div className="popup-card" role="dialog" aria-modal="true" aria-labelledby="activation-titre" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }} role="status">
          <i className={`ti ${icone}`} aria-hidden="true" style={{ fontSize: 44, color: couleur, display: 'inline-block', marginBottom: 12 }}></i>
          <h2 id="activation-titre" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>{titre}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{texte}</p>
        </div>
        {!enAttente && (
          <button className="labo-btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14 }} onClick={onFermer}>
            Fermer
          </button>
        )}
      </div>
    </div>
  )
}

const PRIX_PRO_ANNUEL = 59
const PRIX_PRO_ANNUEL_PAR_MOIS = `${(PRIX_PRO_ANNUEL / 12).toFixed(2).replace('.', ',')} $`
const SIEGES_MIN = 2
const SIEGES_MAX = 200

function economieEquipe(n) {
  return Math.round(((PRIX_PRO_ANNUEL - prixParSiege(n)) / PRIX_PRO_ANNUEL) * 100)
}

const AVANTAGES_PRO = [
  { icone: 'ti-pill', titre: 'Vos médicaments et protocoles', texte: 'Créez vos propres fiches et protocoles, prêts à utiliser en clinique.' },
  { icone: 'ti-flask', titre: 'Références labo complètes', texte: 'Valeurs de référence, tubes, cytologie, microbiologie et plus.' },
  { icone: 'ti-heart-rate-monitor', titre: 'Monitoring anesthésique et ECG', texte: 'Suivez vos anesthésies et interprétez les tracés ECG.' },
  { icone: 'ti-stethoscope', titre: 'Examen physique et toxicologie', texte: 'Examens guidés et calculs de toxicité en quelques secondes.' },
  { icone: 'ti-check', titre: 'Tout le forfait Gratuit inclus', texte: 'Fiches médicaments et calculateurs de dosage.' },
]

const AVANTAGES_EQUIPE = [
  { icone: 'ti-crown', titre: 'Tout Pro pour chaque membre', texte: 'Chaque personne a accès à tous les outils de l\'application.' },
  { icone: 'ti-messages', titre: 'Babillard et tâches partagées', texte: 'Communiquez et répartissez le travail au sein de la clinique.' },
  { icone: 'ti-share', titre: 'Protocoles et médicaments partagés', texte: 'Les mêmes références pour toute l\'équipe, au même endroit.' },
  { icone: 'ti-user-cog', titre: 'Gestion des membres', texte: 'Invitez, attribuez les rôles et ajoutez le logo de la clinique.' },
  { icone: 'ti-receipt', titre: 'Une seule facture', texte: 'Seul le propriétaire paie : les membres n\'ont aucuns frais.' },
]

function ListeAvantages({ items }) {
  return (
    <ul className="abo-avantages">
      {items.map(a => (
        <li key={a.titre}>
          <span className="abo-avantage-icone"><i className={`ti ${a.icone}`}></i></span>
          <span>
            <span className="abo-avantage-titre">{a.titre}</span>
            <span className="abo-avantage-texte">{a.texte}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function Rassurance() {
  return (
    <p className="abo-rassurance">
      <span><i className="ti ti-lock"></i> Paiement sécurisé par Stripe</span>
      <span><i className="ti ti-circle-x"></i> Annulable en tout temps</span>
      <span><i className="ti ti-bolt"></i> Accès immédiat</span>
    </p>
  )
}

export default function Abonnement() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profil, estPro, estEquipe, roleEquipe, teamId, chargerProfil } = useProfil()

  const [onglet, setOnglet] = useState(profil?.plan === 'equipe' ? 'equipe' : 'personnel')
  const [periode, setPeriode] = useState('annuel')
  const [nombreMembres, setNombreMembres] = useState(2)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [modalUpgrade, setModalUpgrade] = useState(false)
  const [modalSieges, setModalSieges] = useState(false)
  const [modalCheckout, setModalCheckout] = useState(false)
  const [modalQuitter, setModalQuitter] = useState(false)
  const [quitterEnCours, setQuitterEnCours] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [subDetails, setSubDetails] = useState(null)
  const [nombreMembresActifs, setNombreMembresActifs] = useState(0)
  // Essai gratuit offert à ce compte : { jours, fin } ou null (déjà abonné, ou pas encore su).
  const [essai, setEssai] = useState(null)
  /* Paiement terminé : dans la fenêtre de paiement (sans recharger
     l'app) ou au retour de Stripe (adresse ?paiement=succes). */
  const [paiementTermine, setPaiementTermine] = useState(() => searchParams.get('paiement') === 'succes')
  // Fenêtre d'activation (voir FenetreActivation) : le webhook Stripe met le forfait à jour.
  const [activation, setActivation] = useState(null)

  // L'onglet Équipe s'ouvre quand le forfait devient Équipe.
  const [planAffiche, setPlanAffiche] = useState(profil?.plan)
  if (profil?.plan !== planAffiche) {
    setPlanAffiche(profil?.plan)
    if (profil?.plan === 'equipe') setOnglet('equipe')
  }

  /* Un membre d'une clinique n'a pas d'abonnement à lui : sans cette
     condition, on affichait son ancien abonnement Pro comme si c'était
     celui de la clinique. */
  const aSonAbonnement = (estPro && !estEquipe) || roleEquipe === 'proprietaire'

  useEffect(() => {
    if (!aSonAbonnement) return
    let actif = true
    lireAbonnement().then((abonnement) => {
      if (actif && abonnement) setSubDetails(abonnement)
    })
    return () => { actif = false }
  }, [aSonAbonnement])

  /* Droit à l'essai gratuit, demandé au serveur : seulement pour qui
     n'a jamais été abonné. Le bouton et le texte en dépendent. */
  useEffect(() => {
    if (estPro || estEquipe) return
    let actif = true
    lireInfosAbonnement().then((infos) => {
      if (!actif) return
      const jours = infos?.essai_disponible ? infos.jours_essai : 0
      setEssai(jours ? { jours, fin: Math.floor(Date.now() / 1000) + jours * 86400 } : null)
    })
    return () => { actif = false }
  }, [estPro, estEquipe])

  // Le nombre de sièges choisi part de celui de l'abonnement chargé.
  const [subAffiche, setSubAffiche] = useState(null)
  if (subDetails !== subAffiche) {
    setSubAffiche(subDetails)
    if (subDetails?.quantity) setNombreMembres(subDetails.quantity)
  }

  useEffect(() => {
    if (!estEquipe || !teamId) return
    let actif = true
    supabase
      .from('membres_equipe')
      .select('*', { count: 'exact', head: true })
      .eq('equipe_id', teamId)
      .then(({ count }) => {
        if (actif) setNombreMembresActifs(count || 0)
      })
    return () => { actif = false }
  }, [estEquipe, teamId])

  function afficherSucces(msg) {
    setSucces(msg)
    setErreur('')
    setTimeout(() => setSucces(''), 5000)
  }

  async function chargerSubDetails() {
    const abonnement = await lireAbonnement()
    if (abonnement) setSubDetails(abonnement)
  }

  async function attendrePlanActif(planAttendu) {
    setActivation({ etat: 'attente', plan: planAttendu })
    let resultat = { etat: 'delai' }
    try {
      resultat = await attendrePlan(planAttendu)
    } catch (err) {
      // Le paiement est fait : on dit seulement que l'activation se poursuit.
      console.error("Suivi de l'activation impossible :", err)
    }
    setActivation({ ...resultat, plan: planAttendu })
  }

  /* { etat: 'active', finEssai } dès que le webhook a mis le forfait à
     jour ; { etat: 'delai' } s'il n'y est pas après 20 secondes. */
  async function attendrePlan(planAttendu) {
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000))
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) break
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      const planAtteint = planAttendu === 'equipe'
        ? data?.plan === 'equipe'
        : (data?.plan && data.plan !== 'free')
      if (planAtteint) {
        if (chargerProfil) await chargerProfil()
        const abonnement = await lireAbonnement()
        if (abonnement) setSubDetails(abonnement)
        return { etat: 'active', finEssai: abonnement?.fin_essai || null }
      }
    }
    if (chargerProfil) await chargerProfil()
    return { etat: 'delai' }
  }

  // Paiement terminé : traité une seule fois, puis attente du forfait.
  const finaliserPaiement = useEffectEvent(() => {
    setPaiementTermine(false)
    const plan = sessionStorage.getItem('checkout_plan') || 'pro'
    sessionStorage.removeItem('checkout_plan')
    if (searchParams.get('paiement')) navigate('/abonnement', { replace: true })
    attendrePlanActif(plan)
  })
  useEffect(() => {
    if (!paiementTermine) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    finaliserPaiement()
  }, [paiementTermine])

  /* Appelé par Stripe quand le paiement réussit dans la fenêtre intégrée.
     Stable : Stripe garde la première version de ce rappel. */
  const paiementReussi = useCallback(() => {
    setModalCheckout(false)
    setClientSecret(null)
    setPaiementTermine(true)
  }, [])

  async function ouvrirPortail() {
    setCheckoutLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        'https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-portal-session',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')
      window.location.href = data.url
    } catch {
      setErreur("Impossible d'ouvrir le portail. Réessayez.")
    }
    setCheckoutLoading(false)
  }

  async function ouvrirCheckout(priceId, quantity = 1) {
    setCheckoutLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        'https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ priceId, quantity }),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setErreur(data.error || "Impossible d'ouvrir le formulaire de paiement. Réessayez.")
      } else {
        setClientSecret(data.clientSecret)
        setModalCheckout(true)
      }
    } catch {
      setErreur("Impossible d'ouvrir le formulaire de paiement. Réessayez.")
    }
    setCheckoutLoading(false)
  }

  async function upgraderAbonnement(ajusterSieges = false) {
    setUpgradeLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        'https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/upgrade-subscription',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ newPriceId: PRICE_EQUIPE, quantity: nombreMembres }),
        }
      )
      const data = await response.json().catch(() => ({}))
      // Les messages du serveur sont déjà en français.
      if (!response.ok) {
        setErreur(data.error || 'La mise à niveau a échoué. Réessayez.')
        setUpgradeLoading(false)
        return
      }
      setModalUpgrade(false)
      setModalSieges(false)
      if (ajusterSieges) {
        if (chargerProfil) await chargerProfil()
        await chargerSubDetails()
        afficherSucces(`Forfait mis à jour : ${nombreMembres} sièges actifs.`)
      } else {
        await attendrePlanActif('equipe')
      }
    } catch (err) {
      setErreur(traduireErreur(err, 'La mise à niveau a échoué. Réessayez.'))
    }
    setUpgradeLoading(false)
  }

  async function quitterEquipe() {
    setQuitterEnCours(true)
    setErreur('')
    // La fonction serveur fait le départ, puis envoie une confirmation par courriel.
    const { error } = await supabase.functions.invoke('quitter-equipe')
    setQuitterEnCours(false)
    setModalQuitter(false)
    if (error) {
      setErreur("Vous n'avez pas pu quitter l'équipe. Réessayez.")
      return
    }
    if (chargerProfil) await chargerProfil()
    setOnglet('personnel')
    afficherSucces("Vous avez quitté l'équipe. Votre compte est passé au forfait gratuit.")
  }

  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret])

  const estGratuit = !estPro && !estEquipe
  const nomForfait = estEquipe ? 'Équipe' : estPro ? 'Pro' : 'Gratuit'
  const couleurForfait = estEquipe ? 'var(--primary)' : estPro ? 'var(--accent-gold)' : 'var(--text-hint)'
  const bgForfait = estEquipe ? 'rgba(37,77,86,0.1)' : estPro ? 'rgba(215,163,92,0.15)' : 'var(--bg-secondary)'

  return (
    <div className="abonnement-page">

      {succes && (
        <div style={{
          background: 'rgba(46,158,91,0.1)', border: '1px solid rgba(46,158,91,0.3)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 0,
          color: '#1f7a45', fontSize: 14, fontWeight: 500,
        }}>
          {succes}
        </div>
      )}
      {erreur && <div className="form-erreur" style={{ marginBottom: 0 }}>{erreur}</div>}

      {/* FORFAIT ACTUEL (seulement pour un forfait payant) */}
      {!estGratuit && (
        <div className="abonnement-plan-actuel">
          <div className="abo-plan-ligne">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: bgForfait,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <i className={`ti ${estEquipe ? 'ti-users' : 'ti-crown'}`} style={{ fontSize: 18, color: couleurForfait }}></i>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 2 }}>Forfait actuel</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: couleurForfait, marginBottom: subDetails ? 3 : 0 }}>{nomForfait}</p>
                {subDetails && (
                  <p style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.4 }}>
                    {estEquipe && subDetails.quantity > 1 && (
                      <span>{subDetails.quantity} sièges · </span>
                    )}
                    {subDetails.statut === 'past_due'
                      ? 'Paiement en retard : mettez à jour votre carte'
                      : subDetails.fin_programmee
                        ? `Se termine le ${formaterDate(subDetails.fin_programmee)}`
                        : subDetails.fin_essai
                          ? `Essai gratuit jusqu'au ${formaterDate(subDetails.fin_essai)}, puis premier paiement`
                          : `Renouvellement le ${formaterDate(subDetails.current_period_end)}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Le désabonnement doit se trouver sans chercher : même
             bouton pour le Pro et pour le propriétaire de la clinique. */}
          {aSonAbonnement && (
            <button className="profil-portal-btn" onClick={ouvrirPortail} disabled={checkoutLoading}
              style={{ justifyContent: 'center' }}>
              <i className="ti ti-receipt" aria-hidden="true"></i>
              {checkoutLoading ? 'Ouverture...' : 'Gérer la facturation / Se désabonner'}
            </button>
          )}
        </div>
      )}

      {/* TOGGLE PERSONNEL / ÉQUIPE */}
      <div className="abonnement-toggle">
        <button
          className={`abonnement-toggle-btn${onglet === 'personnel' ? ' actif-gold' : ''}`}
          onClick={() => setOnglet('personnel')}
        >
          Personnel
        </button>
        <button
          className={`abonnement-toggle-btn${onglet === 'equipe' ? ' actif-equipe' : ''}`}
          onClick={() => setOnglet('equipe')}
        >
          Clinique
        </button>
      </div>

      {/* ─── ONGLET PERSONNEL ─── */}
      {onglet === 'personnel' && (
        <div className="abonnement-cartes">
          <div className="abo-hero">
            <span className="abo-ruban">{estPro && !estEquipe ? 'Votre forfait' : 'Recommandé'}</span>
            <span className="abo-hero-icone"><i className="ti ti-crown"></i></span>
            <h2 className="abo-hero-titre">Tout Adjuvet, sans limite</h2>
            <p className="abo-hero-sous">Le forfait Pro débloque tous les outils cliniques de l'application.</p>

            {estGratuit && (
              <>
                <div className="abo-periode" role="group" aria-label="Période de facturation">
                  <button className={periode === 'mensuel' ? 'actif' : ''} onClick={() => setPeriode('mensuel')}>
                    Mensuel
                  </button>
                  <button className={periode === 'annuel' ? 'actif' : ''} onClick={() => setPeriode('annuel')}>
                    Annuel <span className="abo-periode-eco">-37 %</span>
                  </button>
                </div>

                <div className="abo-prix">
                  <span className="abo-prix-montant">{periode === 'annuel' ? PRIX_PRO_ANNUEL_PAR_MOIS : '7,99 $'}</span>
                  <span className="abo-prix-unite">/mois</span>
                </div>
                <p className="abo-prix-detail">
                  {periode === 'annuel'
                    ? <>Facturé 59 $ par année · <strong>économisez 37 %</strong></>
                    : 'Facturé chaque mois, sans engagement'}
                </p>
              </>
            )}

            {estEquipe && <span className="abo-badge-actuel">Inclus dans votre forfait Équipe</span>}

            <ListeAvantages items={AVANTAGES_PRO} />

            {estGratuit && (
              <>
                <button
                  className="abonnement-btn-abonner abo-cta"
                  onClick={() => {
                    sessionStorage.setItem('checkout_plan', 'pro')
                    ouvrirCheckout(periode === 'annuel' ? PRICE_ANNUAL : PRICE_MONTHLY)
                  }}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading
                    ? 'Chargement...'
                    : essai ? `Essayer ${essai.jours} jours gratuitement` : 'Passer à Pro'}
                </button>
                {/* Essai appliqué par create-checkout : le prix et la date du premier paiement sont dits clairement. */}
                {essai && (
                  <p className="abo-prix-detail" style={{ margin: 0 }}>
                    Puis {periode === 'annuel' ? `${PRIX_PRO_ANNUEL} $ par année` : '7,99 $ par mois'}. Aucun prélèvement avant le <strong style={{ whiteSpace: 'nowrap' }}>{formaterDate(essai.fin)}</strong>.
                  </p>
                )}
                <Rassurance />
              </>
            )}
          </div>

          {estGratuit && (
            <div className="abo-gratuit">
              <p className="abo-gratuit-titre">
                Forfait Gratuit
                <span className="abo-badge-actuel">Votre forfait</span>
              </p>
              <p className="abo-gratuit-texte">Fiches médicaments de toutes les catégories et calculateurs de dosage.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── ONGLET CLINIQUE ─── */}
      {onglet === 'equipe' && estEquipe && (
        <div className="abonnement-carte" style={{ borderColor: 'var(--primary)' }}>
          <div className="abonnement-carte-entete">
            <div>
              <p className="abonnement-carte-titre" style={{ color: 'var(--primary)' }}>Équipe</p>
              <p className="abonnement-carte-sous-titre">Accès partagé pour toute la clinique</p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              color: 'var(--primary)', background: 'var(--primary-light)',
            }}>Actif</span>
          </div>

          {subDetails?.quantity && (
            <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 16 }}>
              <i className="ti ti-users" style={{ marginRight: 5 }}></i>
              {subDetails.quantity} siège{subDetails.quantity > 1 ? 's' : ''} inclus · {calculerPrixEquipe(subDetails.quantity)} $ / année
            </p>
          )}
          {roleEquipe === 'proprietaire' ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="profil-portal-btn" style={{ flex: 1 }}
                onClick={() => setModalSieges(true)}>
                <i className="ti ti-users-plus"></i>
                Modifier les sièges
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-hint)' }}>
                Les sièges sont gérés par le propriétaire de la clinique.
              </p>
              <button
                onClick={() => setModalQuitter(true)}
                style={{ background: 'none', border: 'none', padding: 0, marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--accent-red)', cursor: 'pointer' }}
              >
                Quitter l'équipe
              </button>
            </>
          )}
        </div>
      )}

      {onglet === 'equipe' && !estEquipe && (
        <div className="abo-hero abo-hero--equipe">
          <span className="abo-ruban">Pour les cliniques</span>
          <span className="abo-hero-icone"><i className="ti ti-users"></i></span>
          <h2 className="abo-hero-titre">Toute la clinique sur Adjuvet</h2>
          <p className="abo-hero-sous">Chaque membre profite de Pro, avec des outils pour travailler ensemble.</p>

          <div className="abo-sieges">
            <span className="abo-sieges-label">Nombre de personnes</span>
            <div className="abo-sieges-controle">
              <button onClick={() => setNombreMembres(n => Math.max(SIEGES_MIN, n - 1))} disabled={nombreMembres <= SIEGES_MIN} aria-label="Retirer une personne">−</button>
              <span className="abo-sieges-nombre">{nombreMembres}</span>
              <button onClick={() => setNombreMembres(n => Math.min(SIEGES_MAX, n + 1))} disabled={nombreMembres >= SIEGES_MAX} aria-label="Ajouter une personne">+</button>
            </div>
          </div>

          <div className="abo-prix">
            <span className="abo-prix-montant">{prixParSiege(nombreMembres)} $</span>
            <span className="abo-prix-unite">/personne/année</span>
          </div>
          <p className="abo-prix-detail">
            Total {calculerPrixEquipe(nombreMembres)} $ par année · <strong>économisez {economieEquipe(nombreMembres)} %</strong> par rapport à Pro
          </p>

          <div className="abo-paliers">
            {TIERS_EQUIPE.map(t => {
              const actif = nombreMembres >= t.min && (t.max === null || nombreMembres <= t.max)
              return (
                <span key={t.min} className={`abo-palier${actif ? ' actif' : ''}`}>
                  {t.max === null ? `${t.min} et +` : `${t.min} à ${t.max}`}
                  <strong>{t.prix} $</strong>
                </span>
              )
            })}
          </div>

          <ListeAvantages items={AVANTAGES_EQUIPE} />

          {estPro ? (
            <>
              <button className="abonnement-btn-abonner abo-cta" onClick={() => setModalUpgrade(true)}>
                <i className="ti ti-arrow-up-circle"></i>
                Passer à Équipe
              </button>
              <p className="abo-rassurance">Votre crédit Pro non utilisé est déduit automatiquement.</p>
            </>
          ) : (
            <>
              <button
                className="abonnement-btn-abonner abo-cta"
                onClick={() => {
                  sessionStorage.setItem('checkout_plan', 'equipe')
                  ouvrirCheckout(PRICE_EQUIPE, nombreMembres)
                }}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Chargement...' : `S'abonner pour ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
              <Rassurance />
            </>
          )}
        </div>
      )}

      {/* ─── MODAL UPGRADE PRO → ÉQUIPE ─── */}
      {modalUpgrade && (
        <div className="popup-overlay" onClick={() => setModalUpgrade(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Mettre à niveau vers Équipe</span>
              <button className="popup-close" onClick={() => setModalUpgrade(false)}>✕</button>
            </div>
            <div style={{ padding: '12px 0 4px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Votre crédit Pro non utilisé sera automatiquement déduit du montant à payer. Vous ne perdez rien.
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nombre de membres</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <button className="radio-btn" onClick={() => setNombreMembres(n => Math.max(2, n - 1))}
                  style={{ width: 32, height: 32, borderRadius: 8 }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{nombreMembres}</span>
                <button className="radio-btn" onClick={() => setNombreMembres(n => n + 1)}
                  style={{ width: 32, height: 32, borderRadius: 8 }}>+</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 16 }}>
                {calculerPrixEquipe(nombreMembres)} $ / année · {prixParSiege(nombreMembres)} $/siège
              </p>
              {erreur && <div className="form-erreur" style={{ marginBottom: 12 }}>{erreur}</div>}
              <button className="btn-sauvegarder" onClick={() => upgraderAbonnement(false)} disabled={upgradeLoading}>
                {upgradeLoading ? 'Mise à niveau en cours...' : `Confirmer pour ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL MODIFIER SIÈGES ─── */}
      {modalSieges && (
        <div className="popup-overlay" onClick={() => setModalSieges(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Modifier les sièges</span>
              <button className="popup-close" onClick={() => setModalSieges(false)}>✕</button>
            </div>
            <div style={{ padding: '12px 0 4px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                La différence de prix sera calculée au prorata : vous ne payez que ce qu'il reste de votre période en cours.
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nombre de membres</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <button className="radio-btn" onClick={() => setNombreMembres(n => Math.max(2, n - 1))}
                  disabled={nombreMembres <= 2}
                  style={{ width: 32, height: 32, borderRadius: 8 }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{nombreMembres}</span>
                <button className="radio-btn" onClick={() => setNombreMembres(n => n + 1)}
                  style={{ width: 32, height: 32, borderRadius: 8 }}>+</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: nombreMembres < nombreMembresActifs ? 12 : 16 }}>
                {calculerPrixEquipe(nombreMembres)} $ / année · {prixParSiege(nombreMembres)} $/siège
              </p>
              {nombreMembres < nombreMembresActifs && (
                <div style={{
                  background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.35)',
                  borderRadius: 10, padding: '12px 14px', marginBottom: 16,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#92700a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-alert-triangle"></i>
                    Trop de membres actifs
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Votre équipe compte actuellement <strong>{nombreMembresActifs} membres</strong>. Vous devez retirer <strong>{nombreMembresActifs - nombreMembres} membre{nombreMembresActifs - nombreMembres > 1 ? 's' : ''}</strong> dans la gestion d'équipe avant de réduire à {nombreMembres} sièges.
                  </p>
                </div>
              )}
              {erreur && <div className="form-erreur" style={{ marginBottom: 12 }}>{erreur}</div>}
              <button
                className="btn-sauvegarder"
                onClick={() => upgraderAbonnement(true)}
                disabled={upgradeLoading || nombreMembres < nombreMembresActifs}
              >
                {upgradeLoading ? 'Mise à jour en cours...' : `Confirmer pour ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL QUITTER L'ÉQUIPE ─── */}
      {modalQuitter && (
        <div className="popup-overlay" onClick={() => { if (!quitterEnCours) setModalQuitter(false) }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Quitter l'équipe</span>
              <button className="popup-close" onClick={() => setModalQuitter(false)} disabled={quitterEnCours}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
              <i className="ti ti-logout" style={{ fontSize: 36, color: 'var(--accent-red)', display: 'block', marginBottom: 12 }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Vous perdrez l'accès au forfait Équipe et aux données partagées de la clinique
                (protocoles, médicaments, babillard, tâches). Votre compte repassera au forfait gratuit.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.6, marginTop: 10 }}>
                Pour revenir, il faudra une nouvelle invitation.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-supprimer-medicament" onClick={quitterEquipe} disabled={quitterEnCours}>
                {quitterEnCours ? 'En cours...' : "Quitter l'équipe"}
              </button>
              <button
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setModalQuitter(false)}
                disabled={quitterEnCours}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FENÊTRE D'ACTIVATION ─── */}
      {activation && <FenetreActivation activation={activation} onFermer={() => setActivation(null)} />}

      {/* ─── MODAL CHECKOUT STRIPE ─── */}
      {modalCheckout && clientSecret && (
        <div className="popup-overlay" onClick={() => setModalCheckout(false)}>
          <div className="profil-checkout-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Passer au forfait {onglet === 'equipe' ? 'Équipe' : 'Pro'}</span>
              <button className="popup-close" onClick={() => setModalCheckout(false)}>✕</button>
            </div>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret, onComplete: paiementReussi }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}

    </div>
  )
}
