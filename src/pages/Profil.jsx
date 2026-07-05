import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY
const PRICE_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ANNUAL

const FORFAITS_EQUIPE = [
  { id: 'price_1TpY3sGqH2jbhVzIxpxGTHPD', sieges: 10, prix: '99', periode: 'par mois' },
]

export default function Profil() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef(null)

  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)

  // Modals
  const [modalNom, setModalNom] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [modalMdp, setModalMdp] = useState(false)
  const [modalSupprimer, setModalSupprimer] = useState(false)
  const [modalCheckout, setModalCheckout] = useState(false)

  // Champs édition
  const [nouveauNom, setNouveauNom] = useState('')
  const [nouveauEmail, setNouveauEmail] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmMdp, setConfirmMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [saving, setSaving] = useState(false)

  // Stripe
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)

  // Forfait clinique
  const [interetEnvoye, setInteretEnvoye] = useState(false)

  useEffect(() => {
    chargerProfil()
    if (searchParams.get('paiement') === 'succes') {
      afficherSucces('Abonnement Pro activé ! Bienvenue dans la famille Pro.')
      navigate('/profil', { replace: true })
    }
  }, [])

  async function chargerProfil() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfil({ ...data, email: user.email })
    setAvatarUrl(data?.avatar_url || null)
    setLoading(false)
  }

  function afficherSucces(msg) {
    setSucces(msg)
    setErreur('')
    setTimeout(() => setSucces(''), 4000)
  }

  // ─── MODIFIER NOM ─────────────────────────────
  async function sauvegarderNom() {
    if (!nouveauNom.trim()) return setErreur('Le nom ne peut pas être vide.')
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ nom: nouveauNom.trim() }).eq('id', profil.id)
    setSaving(false)
    if (error) return setErreur('Erreur : ' + error.message)
    setProfil(prev => ({ ...prev, nom: nouveauNom.trim() }))
    setModalNom(false)
    afficherSucces('Nom mis à jour !')
  }

  // ─── MODIFIER EMAIL ───────────────────────────
  async function sauvegarderEmail() {
    if (!nouveauEmail.trim()) return setErreur('Le courriel ne peut pas être vide.')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ email: nouveauEmail.trim() })
    setSaving(false)
    if (error) return setErreur('Erreur : ' + error.message)
    setProfil(prev => ({ ...prev, email: nouveauEmail.trim() }))
    setModalEmail(false)
    afficherSucces('Un courriel de confirmation a été envoyé.')
  }

  // ─── MODIFIER MOT DE PASSE ────────────────────
  async function sauvegarderMdp() {
    if (!nouveauMdp) return setErreur('Le mot de passe ne peut pas être vide.')
    if (nouveauMdp.length < 6) return setErreur('Minimum 6 caractères.')
    if (nouveauMdp !== confirmMdp) return setErreur('Les mots de passe ne correspondent pas.')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
    setSaving(false)
    if (error) return setErreur('Erreur : ' + error.message)
    setModalMdp(false)
    setNouveauMdp('')
    setConfirmMdp('')
    afficherSucces('Mot de passe mis à jour !')
  }

  // ─── PHOTO DE PROFIL ──────────────────────────
  async function changerAvatar(e) {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `avatars/${profil.id}.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (uploadError) return
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', profil.id)
    setAvatarUrl(url)
  }

  // ─── SUPPRIMER LE COMPTE ──────────────────────
  async function supprimerCompte() {
    const { error } = await supabase.rpc('delete_user')
    if (error) return setErreur('Erreur : ' + error.message)
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  // ─── DÉCONNEXION ──────────────────────────────
  async function deconnecter() {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  // ─── STRIPE PORTAL ────────────────────────────
async function ouvrirPortail() {
  setCheckoutLoading(true)
  setErreur('')
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch(
      `https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-portal-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Erreur')
    window.location.href = data.url
  } catch (err) {
    setErreur('Impossible d\'ouvrir le portail. Réessaie.')
  }
  setCheckoutLoading(false)
}

  // ─── STRIPE CHECKOUT ──────────────────────────
  async function ouvrirCheckout(priceId) {
    setCheckoutLoading(true)
    setErreur('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `https://jbvjruunwdrbrzipgezs.supabase.co/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ priceId }),
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur de connexion')
      setClientSecret(data.clientSecret)
      setModalCheckout(true)
    } catch (err) {
      setErreur('Impossible d\'ouvrir le formulaire de paiement. Réessaie.')
    }
    setCheckoutLoading(false)
  }

  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret])

  function ouvrirModal(modal) {
    setErreur('')
    setSucces('')
    if (modal === 'nom') { setNouveauNom(profil?.nom || ''); setModalNom(true) }
    if (modal === 'email') { setNouveauEmail(profil?.email || ''); setModalEmail(true) }
    if (modal === 'mdp') { setNouveauMdp(''); setConfirmMdp(''); setModalMdp(true) }
    if (modal === 'supprimer') setModalSupprimer(true)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  const estEquipe = profil?.plan === 'equipe'
  const estPro = profil?.plan === 'pro' || estEquipe

  return (
    <div className="profil-page">

      {/* AVATAR + NOM */}
      <div className="profil-top">
        <div className="profil-avatar" onClick={() => fileInputRef.current?.click()}>
          {avatarUrl
            ? <img src={avatarUrl} alt="Avatar" className="profil-avatar-img" />
            : <i className="ti ti-user" style={{ fontSize: 40, color: 'var(--text-hint)' }}></i>
          }
          <div className="profil-avatar-overlay">
            <i className="ti ti-camera" style={{ fontSize: 16, color: 'white' }}></i>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={changerAvatar} />
        <p className="profil-nom">{profil?.nom || 'Nom complet'}</p>
        <p className="profil-email">{profil?.email}</p>
      </div>

      {/* MESSAGE SUCCÈS */}
      {succes && <div className="profil-succes">{succes}</div>}
      {erreur && <div className="form-erreur">{erreur}</div>}

      {/* INFOS */}
      <div className="profil-section">
        <div className="profil-item">
          <div>
            <p className="profil-item-label">Nom</p>
            <p className="profil-item-valeur">{profil?.nom || '—'}</p>
          </div>
          <button className="profil-modifier" onClick={() => ouvrirModal('nom')}>Modifier</button>
        </div>
        <div className="profil-item">
          <div>
            <p className="profil-item-label">Courriel</p>
            <p className="profil-item-valeur">{profil?.email}</p>
          </div>
          <button className="profil-modifier" onClick={() => ouvrirModal('email')}>Modifier</button>
        </div>
        <div className="profil-item">
          <div>
            <p className="profil-item-label">Mot de passe</p>
            <p className="profil-item-valeur">••••••••</p>
          </div>
          <button className="profil-modifier" onClick={() => ouvrirModal('mdp')}>Modifier</button>
        </div>
      </div>

      {/* PANNEAU ADMIN */}
      {profil?.role === 'admin' && (
        <div className="profil-section">
          <button className="profil-admin-btn" onClick={() => navigate('/admin')}>
            <i className="ti ti-shield"></i>
            Panneau admin
          </button>
        </div>
      )}

      {/* FORFAIT ACTUEL */}
      <div className="profil-section">
        <div className="profil-item">
          <div>
            <p className="profil-item-label">Forfait actuel</p>
            <p className="profil-item-valeur">
              {estEquipe
                ? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Équipe</span>
                : estPro
                  ? <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>Pro</span>
                  : 'Gratuit'
              }
            </p>
          </div>
          {estPro && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: estEquipe ? 'var(--primary)' : 'var(--accent-gold)',
              background: estEquipe ? 'rgba(37,77,86,0.1)' : 'rgba(215,163,92,0.15)',
              padding: '3px 10px', borderRadius: 999
            }}>Actif</span>
          )}
        </div>
      </div>

      {/* FORFAITS */}
      <div className="profil-section">
        <div className="profil-forfaits-titre">Forfaits disponibles</div>

        {/* GRATUIT */}
        <div className="profil-forfait-item">
          <div className="profil-forfait-header">
            <span className="profil-forfait-nom">Gratuit</span>
            <span className="profil-forfait-prix">0 $</span>
          </div>
          <p className="profil-forfait-desc">Accès aux fiches médicaments et calculateurs de base.</p>
        </div>

        {/* PRO */}
        {estPro && !estEquipe ? (
          <div className="profil-forfait-item">
            <div className="profil-forfait-header">
              <span className="profil-forfait-nom">Pro</span>
              <span className="profil-forfait-badge" style={{ color: 'var(--accent-gold)', background: 'rgba(215,163,92,0.15)' }}>Actif</span>
            </div>
            <p className="profil-forfait-desc" style={{ marginBottom: 14 }}>Tu bénéficies de toutes les fonctionnalités Pro.</p>
            <button className="profil-portal-btn" onClick={ouvrirPortail} disabled={checkoutLoading}>
              <i className="ti ti-settings"></i>
              {checkoutLoading ? 'Chargement...' : 'Gérer mon abonnement'}
            </button>
          </div>
        ) : !estEquipe ? (
          <div className="profil-forfait-item">
            <div className="profil-forfait-header">
              <span className="profil-forfait-nom">Pro</span>
            </div>
            <p className="profil-forfait-desc" style={{ marginBottom: 14 }}>
              Accès complet : personnalisation des médicaments et protocoles de labo, outil d'examen, monitoring anesthésique, toxicologie et plus.
            </p>
            <div className="profil-stripe-choix">
              <button className="profil-stripe-btn" onClick={() => ouvrirCheckout(PRICE_MONTHLY)} disabled={checkoutLoading}>
                <span className="profil-stripe-prix">7,99 $</span>
                <span className="profil-stripe-periode">par mois</span>
              </button>
              <button className="profil-stripe-btn profil-stripe-btn--annuel" onClick={() => ouvrirCheckout(PRICE_ANNUAL)} disabled={checkoutLoading}>
                <span className="profil-stripe-economie">Économise 37 %</span>
                <span className="profil-stripe-prix">59 $</span>
                <span className="profil-stripe-periode">par année</span>
              </button>
            </div>
            {checkoutLoading && (
              <p style={{ fontSize: 12, color: 'var(--text-hint)', textAlign: 'center', marginTop: 8 }}>
                Chargement du formulaire...
              </p>
            )}
          </div>
        ) : null}

        {/* ÉQUIPE */}
        {estEquipe ? (
          <div className="profil-forfait-item" style={{ borderBottom: 'none' }}>
            <div className="profil-forfait-header">
              <span className="profil-forfait-nom">Équipe</span>
              <span className="profil-forfait-badge" style={{ color: 'var(--primary)', background: 'rgba(37,77,86,0.1)' }}>Actif</span>
            </div>
            <p className="profil-forfait-desc" style={{ marginBottom: 14 }}>
              Accès complet pour toute la clinique — fonctionnalités Pro incluses, base de données de médicaments et protocoles partagés, babillard d'équipe et panneau de tâches.
            </p>
            <button className="profil-portal-btn" onClick={ouvrirPortail} disabled={checkoutLoading}>
              <i className="ti ti-settings"></i>
              {checkoutLoading ? 'Chargement...' : 'Gérer mon abonnement'}
            </button>
          </div>
        ) : (
          <div className="profil-forfait-item" style={{ borderBottom: 'none' }}>
            <div className="profil-forfait-header">
              <span className="profil-forfait-nom">Équipe</span>
            </div>
            <p className="profil-forfait-desc" style={{ marginBottom: 14 }}>
              Accès partagé pour toute la clinique — fonctionnalités Pro incluses pour tous les membres, babillard d'équipe, tâches partagées et gestion des membres.
            </p>
            <div className="profil-stripe-choix">
              {FORFAITS_EQUIPE.map(f => (
                <button
                  key={f.id}
                  className="profil-stripe-btn"
                  onClick={() => ouvrirCheckout(f.id)}
                  disabled={checkoutLoading}
                  style={{ flex: 1 }}
                >
                  <span className="profil-stripe-prix">{f.prix} $</span>
                  <span className="profil-stripe-periode">{f.periode}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 2 }}>jusqu'à {f.sieges} membres</span>
                </button>
              ))}
            </div>
            {checkoutLoading && (
              <p style={{ fontSize: 12, color: 'var(--text-hint)', textAlign: 'center', marginTop: 8 }}>
                Chargement du formulaire...
              </p>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="profil-actions">
        <button className="btn-deconnexion" onClick={deconnecter}>DÉCONNEXION</button>
        <button className="btn-supprimer-compte" onClick={() => ouvrirModal('supprimer')}>
          Supprimer le compte
        </button>
      </div>

      {/* ─── MODAL CHECKOUT STRIPE ─────────────── */}
      {modalCheckout && clientSecret && (
        <div className="popup-overlay" onClick={() => setModalCheckout(false)}>
          <div className="profil-checkout-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Passer au forfait Pro</span>
              <button className="popup-close" onClick={() => setModalCheckout(false)}>✕</button>
            </div>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}

      {/* ─── MODAL NOM ─────────────────────────── */}
      {modalNom && (
        <div className="popup-overlay" onClick={() => setModalNom(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Modifier le nom</span>
              <button className="popup-close" onClick={() => setModalNom(false)}>✕</button>
            </div>
            <div className="form-groupe">
              <input className="form-input" placeholder="Nom complet" value={nouveauNom} onChange={e => setNouveauNom(e.target.value)} autoFocus />
            </div>
            {erreur && <div className="form-erreur">{erreur}</div>}
            <button className="btn-sauvegarder" onClick={sauvegarderNom} disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL EMAIL ───────────────────────── */}
      {modalEmail && (
        <div className="popup-overlay" onClick={() => setModalEmail(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Modifier le courriel</span>
              <button className="popup-close" onClick={() => setModalEmail(false)}>✕</button>
            </div>
            <div className="form-groupe">
              <input className="form-input" placeholder="Nouveau courriel" type="email" value={nouveauEmail} onChange={e => setNouveauEmail(e.target.value)} autoFocus />
            </div>
            {erreur && <div className="form-erreur">{erreur}</div>}
            <button className="btn-sauvegarder" onClick={sauvegarderEmail} disabled={saving}>
              {saving ? 'Envoi...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL MOT DE PASSE ────────────────── */}
      {modalMdp && (
        <div className="popup-overlay" onClick={() => setModalMdp(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Modifier le mot de passe</span>
              <button className="popup-close" onClick={() => setModalMdp(false)}>✕</button>
            </div>
            <div className="form-groupe" style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
              <input className="form-input" placeholder="Nouveau mot de passe" type="password" value={nouveauMdp} onChange={e => setNouveauMdp(e.target.value)} autoFocus />
              <input className="form-input" placeholder="Confirmer le mot de passe" type="password" value={confirmMdp} onChange={e => setConfirmMdp(e.target.value)} />
            </div>
            {erreur && <div className="form-erreur">{erreur}</div>}
            <button className="btn-sauvegarder" onClick={sauvegarderMdp} disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL SUPPRIMER ───────────────────── */}
      {modalSupprimer && (
        <div className="popup-overlay" onClick={() => setModalSupprimer(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Supprimer le compte</span>
              <button className="popup-close" onClick={() => setModalSupprimer(false)}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Cette action est irréversible. Toutes tes données seront supprimées définitivement.
            </p>
            {erreur && <div className="form-erreur">{erreur}</div>}
            <button className="btn-supprimer-medicament" onClick={supprimerCompte}>
              Confirmer la suppression
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
