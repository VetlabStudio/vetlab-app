import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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

export default function Abonnement() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [succes, setSucces] = useState('')
  const [erreur, setErreur] = useState('')

  const [modalCheckout, setModalCheckout] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)

  const [modalUpgrade, setModalUpgrade] = useState(false)
  const [modalSieges, setModalSieges] = useState(false)
  const [nombreMembres, setNombreMembres] = useState(2)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  const [onglet, setOnglet] = useState('personnel')
  const [periode, setPeriode] = useState('annuel')

  useEffect(() => {
    if (searchParams.get('paiement') === 'succes') {
      const plan = sessionStorage.getItem('checkout_plan') || 'pro'
      sessionStorage.removeItem('checkout_plan')
      navigate('/abonnement', { replace: true })
      attendrePlanActif(plan)
    } else {
      chargerProfil()
    }
  }, [])

  useEffect(() => {
    if (profil?.plan === 'equipe') setOnglet('equipe')
  }, [profil])

  async function chargerProfil() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    let maxMembres = null
    if (data?.equipe_id) {
      const { data: eq } = await supabase.from('equipes').select('max_membres').eq('id', data.equipe_id).single()
      maxMembres = eq?.max_membres || null
    }
    setProfil({ ...data, max_membres: maxMembres })
    setLoading(false)
  }

  function afficherSucces(msg) {
    setSucces(msg)
    setErreur('')
    setTimeout(() => setSucces(''), 5000)
  }

  async function attendrePlanActif(planAttendu) {
    const maxTentatives = 10
    const delai = 2000
    for (let i = 0; i < maxTentatives; i++) {
      await new Promise(r => setTimeout(r, delai))
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) break
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      const planAtteint = planAttendu === 'equipe' ? data?.plan === 'equipe' : (data?.plan && data.plan !== 'free')
      if (planAtteint) {
        await chargerProfil()
        afficherSucces(planAttendu === 'equipe'
          ? 'Abonnement Équipe activé ! Bienvenue dans le forfait Équipe.'
          : 'Abonnement Pro activé ! Bienvenue dans la famille Pro.')
        return
      }
    }
    await chargerProfil()
    afficherSucces(planAttendu === 'equipe'
      ? 'Abonnement Équipe activé ! Bienvenue dans le forfait Équipe.'
      : 'Abonnement Pro activé ! Bienvenue dans la famille Pro.')
  }

  async function ouvrirPortail() {
    setCheckoutLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-portal-session`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` } }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')
      window.location.href = data.url
    } catch {
      setErreur('Impossible d\'ouvrir le portail. Réessaie.')
    }
    setCheckoutLoading(false)
  }

  async function ouvrirCheckout(priceId, quantity = 1) {
    setCheckoutLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-checkout`,
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
      setErreur('Impossible d\'ouvrir le formulaire de paiement. Réessaie.')
    }
    setCheckoutLoading(false)
  }

  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret])

  async function upgraderAbonnement(ajusterSieges = false) {
    setUpgradeLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/upgrade-subscription`,
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
        await chargerProfil()
        afficherSucces(`Forfait mis à jour — ${nombreMembres} sièges actifs.`)
      } else {
        await attendrePlanActif('equipe')
      }
    } catch (err) {
      setErreur(err.message || 'Erreur lors de la mise à niveau.')
    }
    setUpgradeLoading(false)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  const estEquipe = profil?.plan === 'equipe'
  const estPro = profil?.plan === 'pro' || estEquipe

  const planLabel = estEquipe ? 'Équipe' : estPro ? 'Pro' : 'Gratuit'
  const planDesc = estEquipe
    ? 'Accès complet pour toute la clinique'
    : estPro
      ? 'Accès complet à toutes les fonctionnalités'
      : 'Accès aux fonctionnalités de base'
  const planColor = estEquipe ? 'var(--primary)' : estPro ? 'var(--accent-gold)' : 'var(--text-hint)'
  const planBg = estEquipe ? 'rgba(37,77,86,0.08)' : estPro ? 'rgba(215,163,92,0.08)' : 'var(--bg-secondary)'
  const planBorder = estEquipe ? 'rgba(37,77,86,0.25)' : estPro ? 'rgba(215,163,92,0.35)' : 'var(--border)'

  return (
    <div className="profil-page">

      {succes && <div className="profil-succes">{succes}</div>}
      {erreur && <div className="form-erreur">{erreur}</div>}

      {/* ─── FORFAIT ACTUEL ─────────────────────── */}
      <div style={{
        background: planBg,
        border: `1.5px solid ${planBorder}`,
        borderRadius: 16, padding: '14px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: estPro ? planColor : 'var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className={`ti ${estEquipe ? 'ti-building' : estPro ? 'ti-crown' : 'ti-user'}`}
              style={{ fontSize: 20, color: estPro ? '#fff' : 'var(--text-hint)' }}></i>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
              Forfait {planLabel}
              {estPro && (
                <span style={{
                  marginLeft: 8, fontSize: 11, fontWeight: 700,
                  color: planColor, background: planBg,
                  border: `1px solid ${planBorder}`, padding: '2px 8px', borderRadius: 999,
                }}>Actif</span>
              )}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {planDesc}
            </p>
          </div>
        </div>
        {estPro && (
          <button
            onClick={ouvrirPortail}
            disabled={checkoutLoading}
            style={{
              flexShrink: 0, background: planColor, color: '#fff', border: 'none',
              borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              opacity: checkoutLoading ? 0.6 : 1,
            }}
          >
            {checkoutLoading ? '...' : 'Gérer'}
          </button>
        )}
      </div>

      {/* ─── TOGGLE PERSONNEL / ÉQUIPE ──────────── */}
      <div style={{
        display: 'flex', background: 'var(--bg-secondary)',
        borderRadius: 14, padding: 4, gap: 4, marginBottom: 20,
      }}>
        {['personnel', 'equipe'].map(tab => (
          <button
            key={tab}
            onClick={() => setOnglet(tab)}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
              background: onglet === tab
                ? (tab === 'equipe' ? 'var(--primary)' : 'var(--accent-gold)')
                : 'transparent',
              color: onglet === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {tab === 'personnel' ? 'Personnel' : 'Équipe'}
          </button>
        ))}
      </div>

      {/* ─── ONGLET PERSONNEL ───────────────────── */}
      {onglet === 'personnel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Gratuit */}
          <div style={{
            background: 'var(--bg-card)',
            border: `2px solid ${!estPro ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 16, padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              border: `2.5px solid ${!estPro ? 'var(--primary)' : 'var(--border)'}`,
              background: !estPro ? 'var(--primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {!estPro && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Gratuit</p>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '2px 0 0' }}>Fiches médicaments et calculateurs de base</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', margin: 0 }}>0 $</p>
            </div>
          </div>

          {/* Pro */}
          <div style={{
            background: 'var(--bg-card)',
            border: `2px solid ${estPro && !estEquipe ? 'var(--accent-gold)' : 'var(--border)'}`,
            borderRadius: 16, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2.5px solid ${estPro && !estEquipe ? 'var(--accent-gold)' : estEquipe ? 'var(--accent-gold)' : 'var(--border)'}`,
                background: estPro ? 'var(--accent-gold)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {estPro && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Pro</p>
                  {estEquipe && (
                    <span style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 600 }}>Inclus</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '2px 0 0' }}>
                  Labo, monitoring, personnalisation et plus
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', margin: 0 }}>
                  {periode === 'mensuel' ? '7,99 $' : '59 $'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: 0 }}>
                  {periode === 'mensuel' ? '/mois' : '/année'}
                </p>
              </div>
            </div>

            {/* Non-abonné : sélecteur de période + bouton */}
            {!estPro && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <button
                    onClick={() => setPeriode('mensuel')}
                    style={{
                      flex: 1, padding: '13px 8px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${periode === 'mensuel' ? 'var(--accent-gold)' : 'var(--border)'}`,
                      background: periode === 'mensuel' ? 'rgba(215,163,92,0.07)' : 'var(--bg-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>7,99 $</p>
                    <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '3px 0 0' }}>par mois</p>
                  </button>
                  <button
                    onClick={() => setPeriode('annuel')}
                    style={{
                      flex: 1, padding: '13px 8px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${periode === 'annuel' ? 'var(--accent-gold)' : 'var(--border)'}`,
                      background: periode === 'annuel' ? 'rgba(215,163,92,0.07)' : 'var(--bg-secondary)',
                      textAlign: 'center', position: 'relative',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--accent-gold)', color: '#fff', fontSize: 10, fontWeight: 700,
                      padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap',
                    }}>
                      ÉCONOMISE 37 %
                    </span>
                    <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>59 $</p>
                    <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '3px 0 0' }}>par année</p>
                  </button>
                </div>
                <button
                  className="labo-btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => { sessionStorage.setItem('checkout_plan', 'pro'); ouvrirCheckout(periode === 'mensuel' ? PRICE_MONTHLY : PRICE_ANNUAL) }}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Chargement...' : 'S\'abonner au forfait Pro'}
                </button>
              </div>
            )}

            {/* Abonné Pro (non Équipe) : bouton gérer */}
            {estPro && !estEquipe && (
              <div style={{ marginTop: 14 }}>
                <button
                  className="profil-portal-btn"
                  onClick={ouvrirPortail}
                  disabled={checkoutLoading}
                  style={{ width: '100%' }}
                >
                  <i className="ti ti-settings"></i>
                  {checkoutLoading ? 'Chargement...' : 'Gérer mon abonnement'}
                </button>
              </div>
            )}

            {/* Abonné Équipe : Pro est inclus */}
            {estEquipe && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(215,163,92,0.07)', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--accent-gold)', fontWeight: 600, margin: 0 }}>
                  <i className="ti ti-circle-check" style={{ marginRight: 6 }}></i>
                  Inclus dans votre forfait Équipe
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ONGLET ÉQUIPE ──────────────────────── */}
      {onglet === 'equipe' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: 'var(--bg-card)',
            border: `2px solid ${estEquipe ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 16, padding: '18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', margin: 0 }}>Équipe</p>
                  {estEquipe && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                      background: 'rgba(37,77,86,0.1)', padding: '2px 10px', borderRadius: 999,
                    }}>Actif</span>
                  )}
                  {estPro && !estEquipe && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                      background: 'rgba(37,77,86,0.08)', padding: '2px 10px', borderRadius: 999,
                    }}>Upgrade</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '4px 0 0' }}>
                  Fonctionnalités Pro pour toute la clinique
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', margin: 0 }}>
                  {calculerPrixEquipe(nombreMembres)} $
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: 0 }}>/ année</p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Babillard d'équipe, tâches partagées, gestion des membres — et toutes les fonctionnalités Pro pour chaque membre.
            </p>

            {/* Sièges actuels (si Équipe actif) */}
            {estEquipe && profil?.max_membres && (
              <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '0 0 2px' }}>Sièges inclus</p>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
                  {profil.max_membres} membres · {calculerPrixEquipe(profil.max_membres)} $ / année
                </p>
              </div>
            )}

            {/* Sélecteur de membres */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {estEquipe ? 'Modifier le nombre de membres' : 'Nombre de membres'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <button
                  className="radio-btn"
                  onClick={() => setNombreMembres(n => Math.max(2, n - 1))}
                  style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20 }}
                >−</button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontWeight: 800, fontSize: 28, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>
                    {nombreMembres}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: '3px 0 0' }}>membres</p>
                </div>
                <button
                  className="radio-btn"
                  onClick={() => setNombreMembres(n => n + 1)}
                  style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20 }}
                >+</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {prixParSiege(nombreMembres)} $ / siège / année
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                  = {calculerPrixEquipe(nombreMembres)} $ / an
                </span>
              </div>
            </div>

            {/* Bouton d'action */}
            {erreur && <div className="form-erreur" style={{ marginBottom: 12 }}>{erreur}</div>}

            {estEquipe ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="profil-portal-btn"
                  style={{ flex: 1 }}
                  onClick={() => upgraderAbonnement(true)}
                  disabled={upgradeLoading}
                >
                  <i className="ti ti-users-plus"></i>
                  {upgradeLoading ? 'Mise à jour...' : 'Modifier les sièges'}
                </button>
                <button
                  className="profil-portal-btn"
                  style={{ flex: 1 }}
                  onClick={ouvrirPortail}
                  disabled={checkoutLoading}
                >
                  <i className="ti ti-settings"></i>
                  {checkoutLoading ? 'Chargement...' : 'Gérer'}
                </button>
              </div>
            ) : estPro ? (
              <button
                className="labo-btn-primary"
                style={{ width: '100%' }}
                onClick={() => setModalUpgrade(true)}
                disabled={upgradeLoading}
              >
                <i className="ti ti-arrow-up-circle" style={{ marginRight: 6 }}></i>
                Mettre à niveau vers Équipe
              </button>
            ) : (
              <button
                className="labo-btn-primary"
                style={{ width: '100%' }}
                onClick={() => { sessionStorage.setItem('checkout_plan', 'equipe'); ouvrirCheckout(PRICE_EQUIPE, nombreMembres) }}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Chargement...' : `S'abonner — ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL UPGRADE PRO → ÉQUIPE ───────── */}
      {modalUpgrade && (
        <div className="popup-overlay" onClick={() => setModalUpgrade(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Mettre à niveau vers Équipe</span>
              <button className="popup-close" onClick={() => setModalUpgrade(false)}>✕</button>
            </div>
            <div style={{ padding: '12px 0 4px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Ton crédit Pro non utilisé sera automatiquement déduit. Tu ne perds rien.
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nombre de membres</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <button className="radio-btn" onClick={() => setNombreMembres(n => Math.max(2, n - 1))} style={{ width: 32, height: 32, borderRadius: 8 }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{nombreMembres}</span>
                <button className="radio-btn" onClick={() => setNombreMembres(n => n + 1)} style={{ width: 32, height: 32, borderRadius: 8 }}>+</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 16 }}>
                {calculerPrixEquipe(nombreMembres)} $ / année · {prixParSiege(nombreMembres)} $/siège
              </p>
              {erreur && <div className="form-erreur" style={{ marginBottom: 12 }}>{erreur}</div>}
              <button className="btn-sauvegarder" onClick={upgraderAbonnement} disabled={upgradeLoading}>
                {upgradeLoading ? 'Mise à niveau en cours...' : `Confirmer — ${calculerPrixEquipe(nombreMembres)} $ / année`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL CHECKOUT STRIPE ─────────────── */}
      {modalCheckout && clientSecret && (
        <div className="popup-overlay" onClick={() => setModalCheckout(false)}>
          <div className="profil-checkout-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Abonnement</span>
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
