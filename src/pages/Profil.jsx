import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Profil() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)

  // Modals
  const [modalNom, setModalNom] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [modalMdp, setModalMdp] = useState(false)
  const [modalSupprimer, setModalSupprimer] = useState(false)

  // Champs édition
  const [nouveauNom, setNouveauNom] = useState('')
  const [nouveauEmail, setNouveauEmail] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmMdp, setConfirmMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    chargerProfil()
  }, [])

  async function chargerProfil() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfil({ ...data, email: user.email })
    setAvatarUrl(data?.avatar_url || null)
    setLoading(false)
  }

  function afficherSucces(msg) {
    setSucces(msg)
    setErreur('')
    setTimeout(() => setSucces(''), 3000)
  }

  // ─── MODIFIER NOM ─────────────────────────────
  async function sauvegarderNom() {
    if (!nouveauNom.trim()) return setErreur('Le nom ne peut pas être vide.')
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ nom: nouveauNom.trim() })
      .eq('id', profil.id)
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

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

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

  function ouvrirModal(modal) {
    setErreur('')
    setSucces('')
    if (modal === 'nom') { setNouveauNom(profil?.nom || ''); setModalNom(true) }
    if (modal === 'email') { setNouveauEmail(profil?.email || ''); setModalEmail(true) }
    if (modal === 'mdp') { setNouveauMdp(''); setConfirmMdp(''); setModalMdp(true) }
    if (modal === 'supprimer') setModalSupprimer(true)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={changerAvatar}
        />
        <p className="profil-nom">{profil?.nom || 'Nom complet'}</p>
        <p className="profil-email">{profil?.email}</p>
      </div>

      {/* MESSAGE SUCCÈS */}
      {succes && <div className="profil-succes">{succes}</div>}

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
          <button className="profil-admin-btn" onClick={() => navigate('/admin/medicaments')}>
            <i className="ti ti-shield"></i>
            Panneau admin
          </button>
        </div>
      )}

      {/* FORFAIT */}
      <div className="profil-section">
        <div className="profil-item">
          <div>
            <p className="profil-item-label">Forfait</p>
            <p className="profil-item-valeur" style={{ textTransform: 'capitalize' }}>
              {{
  'free': 'Gratuit',
  'pro': 'Pro',
  'equipe': 'Équipe',
}[profil?.plan] || 'Gratuit'}
            </p>
          </div>
        </div>
      </div>
      {/* FORFAITS DISPONIBLES */}
<div className="profil-section">
  <div className="profil-forfaits-titre">Forfaits disponibles</div>
  
  <div className="profil-forfait-item">
    <div className="profil-forfait-header">
      <span className="profil-forfait-nom">Gratuit</span>
      <span className="profil-forfait-prix">0 $</span>
    </div>
    <p className="profil-forfait-desc">Accès aux fiches médicaments et calculateurs de base.</p>
  </div>

  <div className="profil-forfait-item">
    <div className="profil-forfait-header">
      <span className="profil-forfait-nom">Pro</span>
      <span className="profil-forfait-badge">À venir</span>
    </div>
    <p className="profil-forfait-desc">Personnalise ta base de données : ajoute, modifie et supprime des médicaments, crée tes propres espèces animales et configure tes protocoles de laboratoire.</p>
  </div>

  <div className="profil-forfait-item" style={{ borderBottom: 'none' }}>
    <div className="profil-forfait-header">
      <span className="profil-forfait-nom">Équipe</span>
      <span className="profil-forfait-badge">À venir</span>
    </div>
    <p className="profil-forfait-desc">Base de données personnalisée partagée entre les membres de votre clinique.</p>
  </div>
</div>

      {/* ACTIONS */}
      <div className="profil-actions">
        <button className="btn-deconnexion" onClick={deconnecter}>DÉCONNEXION</button>
        <button className="btn-supprimer-compte" onClick={() => ouvrirModal('supprimer')}>
          Supprimer le compte
        </button>
      </div>

      {/* ─── MODAL NOM ─────────────────────────── */}
      {modalNom && (
        <div className="popup-overlay" onClick={() => setModalNom(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Modifier le nom</span>
              <button className="popup-close" onClick={() => setModalNom(false)}>✕</button>
            </div>
            <div className="form-groupe">
              <input
                className="form-input"
                placeholder="Nom complet"
                value={nouveauNom}
                onChange={e => setNouveauNom(e.target.value)}
                autoFocus
              />
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
              <input
                className="form-input"
                placeholder="Nouveau courriel"
                type="email"
                value={nouveauEmail}
                onChange={e => setNouveauEmail(e.target.value)}
                autoFocus
              />
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
              <input
                className="form-input"
                placeholder="Nouveau mot de passe"
                type="password"
                value={nouveauMdp}
                onChange={e => setNouveauMdp(e.target.value)}
                autoFocus
              />
              <input
                className="form-input"
                placeholder="Confirmer le mot de passe"
                type="password"
                value={confirmMdp}
                onChange={e => setConfirmMdp(e.target.value)}
              />
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
