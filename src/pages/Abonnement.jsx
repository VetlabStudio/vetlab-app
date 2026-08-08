import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY
const PRICE_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ANNUAL
const PRICE_EQUIPE = 'price_1TqBCwGqH2jbhVzIiUeTmlSW'

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

function formaterDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('fr-CA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const FONCTIONNALITES = [
  { label: 'Fiches médicaments (toutes catégories)', gratuit: true },
  { label: 'Calculateurs de dosage',                 gratuit: true },
  { label: 'Médicaments & protocoles personnalisés', gratuit: false },
  { label: 'Références labo complètes',              gratuit: false },
  { label: 'Monitoring anesthésique & ECG',          gratuit: false },
  { label: 'Toxicologie & examen physique',          gratuit: false },
]

function ListeFonctionnalites({ tout }) {
  return (
    <div style={{ marginTop: 4 }}>
      {FONCTIONNALITES.map(f => {
        const inclus = tout || f.gratuit
        return (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: inclus ? 'rgba(46,158,91,0.12)' : 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i
                className={`ti ${inclus ? 'ti-check' : 'ti-x'}`}
                style={{ fontSize: 11, color: inclus ? '#2e9e5b' : 'var(--text-hint)' }}
              ></i>
            </div>
            <span style={{ fontSize: 13.5, color: inclus ? 'var(--text)' : 'var(--text-hint)' }}>{f.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function DividerFeatures() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-hint)', textTransform: 'uppercase' }}>Fonctionnalités</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
    </div>
  )
}

export default function Abonnement() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profil, estPro, estEquipe, chargerProfil } = useProfil()

  const [onglet, setOnglet] = useState('personnel')
  const [periode, setPeriode] = useState('annuel')
  const [nombreMembres, setNombreMembres] = useState(3)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [modalUpgrade, setModalUpgrade] = useState(false)
  const [modalSieges, setModalSieges] = useState(false)
  const [modalCheckout, setModalCheckout] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [subDetails, setSubDetails] = useState(null)

  useEffect(() => {
    if (searchParams.get('paiement') === 'succes') {
      const plan = sessionStorage.getItem('checkout_plan') || 'pro'
      sessionStorage.removeItem('checkout_plan')
      navigate('/abonnement', { replace: true })
      attendrePlanActif(plan)
    }
  }, [])

  useEffect(() => {
    if (profil?.plan === 'equipe') setOnglet('equipe')
  }, [profil?.plan])

  useEffect(() => {
    if (estPro || estEquipe) chargerSubDetails()
  }, [estPro, estEquipe])

  useEffect(() => {
    if (subDetails?.quantity) setNombreMembres(subDetails.quantity)
  }, [subDetails])

  function afficherSucces(msg) {
    setSucces(msg)
    setErreur('')
    setTimeout(() => setSucces(''), 5000)
  }

  async function chargerSubDetails() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        'https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/get-subscription',
        { headers: { 'Authorization': `Bearer ${session.access_token}` } }
      )
      const data = await response.json()
      if (data.subscription) setSubDetails(data.subscription)
    } catch {}
  }

  async function attendrePlanActif(planAttendu) {
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
        await chargerSubDetails()
        afficherSucces(planAttendu === 'equipe'
          ? 'Abonnement Équipe activé !'
          : 'Abonnement Pro activé ! Bienvenue dans la famille Pro.')
        return
      }
    }
    if (chargerProfil) await chargerProfil()
    afficherSucces(planAttendu === 'equipe' ? 'Abonnement Équipe activé !' : 'Abonnement Pro activé !')
  }

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
      setErreur("Impossible d'ouvrir le portail. Réessaie.")
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
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur de connexion')
      setClientSecret(data.clientSecret)
      setModalCheckout(true)
    } catch {
      setErreur("Impossible d'ouvrir le formulaire de paiement. Réessaie.")
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
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')
      setModalUpgrade(false)
      setModalSieges(false)
      if (ajusterSieges) {
        if (chargerProfil) await chargerProfil()
        await chargerSubDetails()
        afficherSucces(`Forfait mis à jour — ${nombreMembres} sièges actifs.`)
      } else {
        await attendrePlanActif('equipe')
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors de la mise à niveau.')
    }
    setUpgradeLoading(false)
  }

  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret])

  const nomForfait = estEquipe ? 'Équipe' : estPro ? 'Pro' : 'Gratuit'
  const couleurForfait = estEquipe ? 'var(--primary)' : estPro ? 'var(--accent-gold)' : 'var(--text-hint)'
  const bgForfait = estEquipe ? 'rgba(37,77,86,0.1)' : estPro ? 'rgba(215,163,92,0.15)' : 'var(--bg-secondary)'

  return (
    <div className="abonnement-page">

      {succes && (
        <div style={{
          background: 'rgba(46,158,91,0.1)', border: '1px solid rgba(46,158,91,0.3)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 0,
          color: '#2e9e5b', fontSize: 14, fontWeight: 500,
        }}>
          {succes}
        </div>
      )}
      {erreur && <div className="form-erreur" style={{ marginBottom: 0 }}>{erreur}</div>}

      {/* FORFAIT ACTUEL */}
      <div className="abonnement-plan-actuel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: bgForfait,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className={`ti ${estEquipe ? 'ti-users' : estPro ? 'ti-crown' : 'ti-user'}`}
              style={{ fontSize: 18, color: couleurForfait }}></i>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 2 }}>Forfait actuel</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: couleurForfait, marginBottom: subDetails ? 3 : 0 }}>{nomForfait}</p>
            {subDetails && (
              <p style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.4 }}>
                {estEquipe && subDetails.quantity > 1 && (
                  <span>{subDetails.quantity} sièges · </span>
                )}
                Renouvellement le {formaterDate(subDetails.current_period_end)}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
            color: couleurForfait, background: bgForfait,
          }}>Actif</span>
          {estPro && (
            <button className="profil-portal-btn" onClick={ouvrirPortail} disabled={checkoutLoading}
              style={{ fontSize: 12, padding: '6px 14px' }}>
              {checkoutLoading ? '...' : 'Gérer'}
            </button>
          )}
        </div>
      </div>

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
          Équipe
        </button>
      </div>

      {/* ─── ONGLET PERSONNEL ─── */}
      {onglet === 'personnel' && (
        <div className="abonnement-cartes">

          {/* CARTE GRATUIT */}
          <div className="abonnement-carte">
            <div className="abonnement-carte-entete">
              <div>
                <p className="abonnement-carte-titre">Gratuit</p>
                <p className="abonnement-carte-sous-titre">Fonctionnalités de base</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="abonnement-carte-prix">0 $</p>
                <p style={{ fontSize: 11, color: 'var(--text-hint)' }}>/mois</p>
              </div>
            </div>
            {profil?.plan === 'free' && (
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700, marginBottom: 4,
                color: 'var(--text-hint)', background: 'var(--bg-secondary)',
                padding: '3px 10px', borderRadius: 999,
              }}>Plan actuel</span>
            )}
            <DividerFeatures />
            <ListeFonctionnalites tout={false} />
          </div>

          {/* CARTE PRO */}
          <div className="abonnement-carte abonnement-carte--pro"
            style={estPro && !estEquipe ? { borderColor: 'var(--accent-gold)' } : {}}>
            <div className="abonnement-carte-entete">
              <div>
                <p className="abonnement-carte-titre" style={{ color: 'var(--accent-gold)' }}>Pro</p>
                <p className="abonnement-carte-sous-titre">Accès complet</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="abonnement-carte-prix" style={{ color: 'var(--accent-gold)' }}>
                  {periode === 'annuel' ? '59 $' : '7,99 $'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-hint)' }}>
                  {periode === 'annuel' ? '/année' : '/mois'}
                </p>
              </div>
            </div>

            {estPro && !estEquipe ? (
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700, marginBottom: 4,
                color: 'var(--accent-gold)', background: 'rgba(215,163,92,0.15)',
                padding: '3px 10px', borderRadius: 999,
              }}>Plan actuel</span>
            ) : !estEquipe ? (
              <div className="profil-stripe-choix" style={{ marginBottom: 12 }}>
                <button
                  className="profil-stripe-btn"
                  onClick={() => setPeriode('mensuel')}
                  style={periode === 'mensuel' ? { borderColor: 'var(--primary)', background: 'rgba(37,77,86,0.05)' } : {}}
                >
                  <span className="profil-stripe-prix">7,99 $</span>
                  <span className="profil-stripe-periode">par mois</span>
                </button>
                <button
                  className="profil-stripe-btn profil-stripe-btn--annuel"
                  onClick={() => setPeriode('annuel')}
                >
                  <span className="profil-stripe-economie">ÉCONOMISE 37 %</span>
                  <span className="profil-stripe-prix">59 $</span>
                  <span className="profil-stripe-periode">par année</span>
                </button>
              </div>
            ) : null}

            <DividerFeatures />
            <ListeFonctionnalites tout={true} />

            {!estPro && !estEquipe && (
              <button
                className="abonnement-btn-abonner"
                onClick={() => {
                  sessionStorage.setItem('checkout_plan', 'pro')
                  ouvrirCheckout(periode === 'annuel' ? PRICE_ANNUAL : PRICE_MONTHLY)
                }}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Chargement...' : "S'abonner au forfait Pro"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── ONGLET ÉQUIPE ─── */}
      {onglet === 'equipe' && (
        <div className="abonnement-carte" style={estEquipe ? { borderColor: 'var(--primary)' } : {}}>
          <div className="abonnement-carte-entete">
            <div>
              <p className="abonnement-carte-titre" style={{ color: 'var(--primary)' }}>Équipe</p>
              <p className="abonnement-carte-sous-titre">Accès partagé pour toute la clinique</p>
            </div>
            {estEquipe && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                color: 'var(--primary)', background: 'rgba(37,77,86,0.1)',
              }}>Actif</span>
            )}
          </div>

          {estEquipe ? (
            <>
              {subDetails?.quantity && (
                <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 16 }}>
                  <i className="ti ti-users" style={{ marginRight: 5 }}></i>
                  {subDetails.quantity} siège{subDetails.quantity > 1 ? 's' : ''} inclus — {calculerPrixEquipe(subDetails.quantity)} $ / année
                </p>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="profil-portal-btn" style={{ flex: 1 }}
                  onClick={() => setModalSieges(true)}>
                  <i className="ti ti-users-plus"></i>
                  Modifier les sièges
                </button>
              </div>
            </>
          ) : estPro ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Passe au forfait Équipe — ton crédit Pro non utilisé est automatiquement déduit. Tu ne perds pas ce que tu as déjà payé.
              </p>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nombre de membres</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <button className="radio-btn" onClick={() => setNombreMembres(n => Math.max(2, n - 1))}
                    style={{ width: 32, height: 32, borderRadius: 8 }}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{nombreMembres}</span>
                  <button className="radio-btn" onClick={() => setNombreMembres(n => n + 1)}
                    style={{ width: 32, height: 32, borderRadius: 8 }}>+</button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-hint)' }}>
                  {calculerPrixEquipe(nombreMembres)} $ / année · {prixParSiege(nombreMembres)} $/siège
                </p>
              </div>
              <button className="abonnement-btn-abonner" style={{ background: 'var(--primary)' }}
                onClick={() => setModalUpgrade(true)}>
                <i className="ti ti-arrow-up-circle"></i>
                Mettre à niveau vers Équipe
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Accès complet Pro pour tous les membres de ta clinique — babillard d'équipe, tâches partagées et gestion des membres inclus.
              </p>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nombre de membres</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <button className="radio-btn" onClick={() => setNombreMembres(n => Math.max(2, n - 1))}
                    style={{ width: 32, height: 32, borderRadius: 8 }}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{nombreMembres}</span>
                  <button className="radio-btn" onClick={() => setNombreMembres(n => n + 1)}
                    style={{ width: 32, height: 32, borderRadius: 8 }}>+</button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-hint)' }}>
                  {calculerPrixEquipe(nombreMembres)} $ / année · {prixParSiege(nombreMembres)} $/siège
                </p>
              </div>
              <button
                className="abonnement-btn-abonner"
                style={{ background: 'var(--primary)' }}
                onClick={() => {
                  sessionStorage.setItem('checkout_plan', 'equipe')
                  ouvrirCheckout(PRICE_EQUIPE, nombreMembres)
                }}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Chargement...' : `S'abonner — ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
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
                Ton crédit Pro non utilisé sera automatiquement déduit du montant à payer. Tu ne perds rien.
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
                {upgradeLoading ? 'Mise à niveau en cours...' : `Confirmer — ${calculerPrixEquipe(nombreMembres)} $ / année`}
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
                La différence de prix sera calculée au prorata — tu ne paies que ce qu'il reste de ta période en cours.
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
              <button className="btn-sauvegarder" onClick={() => upgraderAbonnement(true)} disabled={upgradeLoading}>
                {upgradeLoading ? 'Mise à jour en cours...' : `Confirmer — ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL CHECKOUT STRIPE ─── */}
      {modalCheckout && clientSecret && (
        <div className="popup-overlay" onClick={() => setModalCheckout(false)}>
          <div className="profil-checkout-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Passer au forfait {onglet === 'equipe' ? 'Équipe' : 'Pro'}</span>
              <button className="popup-close" onClick={() => setModalCheckout(false)}>✕</button>
            </div>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}

    </div>
  )
}
