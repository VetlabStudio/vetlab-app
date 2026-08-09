import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Profil() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [equipeProprietaire, setEquipeProprietaire] = useState(null)

  // Modals
  const [modalNom, setModalNom] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [modalMdp, setModalMdp] = useState(false)
  const [modalSupprimer, setModalSupprimer] = useState(false)
  const [modalSupprimerProprietaire, setModalSupprimerProprietaire] = useState(false)
  const [confirmerSuppressionEquipe, setConfirmerSuppressionEquipe] = useState(false)

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
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data?.equipe_id) {
      const { data: eq } = await supabase
        .from('equipes')
        .select('id, nom, proprietaire_id')
        .eq('id', data.equipe_id)
        .single()
      if (eq?.proprietaire_id === user.id) {
        setEquipeProprietaire({ id: eq.id, nom: eq.nom })
      }
    }
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
    const path = `${profil.id}.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (uploadError) return
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', profil.id)
    setAvatarUrl(url)
  }

  // ─── SUPPRIMER COMPTE SIMPLE ──────────────────
  async function supprimerCompte() {
    setSaving(true)
    const { error } = await supabase.rpc('delete_user')
    setSaving(false)
    if (error) return setErreur('Erreur : ' + error.message)
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  // ─── SUPPRIMER ÉQUIPE + COMPTE PROPRIÉTAIRE ───
  async function supprimerEquipeEtCompte() {
    setSaving(true)
    setErreur('')
    try {
      // Retirer l'equipe_id de tous les membres
      await supabase
        .from('profiles')
        .update({ equipe_id: null, plan: 'free' })
        .eq('equipe_id', equipeProprietaire.id)
        .neq('id', profil.id)
      // Supprimer les entrées membres_equipe
      await supabase.from('membres_equipe').delete().eq('equipe_id', equipeProprietaire.id)
      // Supprimer l'équipe
      await supabase.from('equipes').delete().eq('id', equipeProprietaire.id)
      // Supprimer le compte
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await supabase.auth.signOut()
      navigate('/connexion')
    } catch (err) {
      setSaving(false)
      setErreur('Erreur lors de la suppression : ' + err.message)
    }
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
    if (modal === 'supprimer') {
      if (equipeProprietaire) {
        setConfirmerSuppressionEquipe(false)
        setModalSupprimerProprietaire(true)
      } else {
        setModalSupprimer(true)
      }
    }
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
      {profil?.email === 'info@vetlabstudio.ca' && (
        <div className="profil-section">
          <button className="profil-admin-btn" onClick={() => navigate('/admin')}>
            <i className="ti ti-shield"></i>
            Panneau admin
          </button>
        </div>
      )}

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

      {/* ─── MODAL SUPPRIMER (compte simple) ───── */}
      {modalSupprimer && (
        <div className="popup-overlay" onClick={() => setModalSupprimer(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Supprimer le compte</span>
              <button className="popup-close" onClick={() => setModalSupprimer(false)}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </p>
            {erreur && <div className="form-erreur">{erreur}</div>}
            <button className="btn-supprimer-medicament" onClick={supprimerCompte} disabled={saving}>
              {saving ? 'Suppression...' : 'Confirmer la suppression'}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL SUPPRIMER — PROPRIÉTAIRE ÉQUIPE */}
      {modalSupprimerProprietaire && (
        <div className="popup-overlay" onClick={() => { setModalSupprimerProprietaire(false); setConfirmerSuppressionEquipe(false) }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Supprimer le compte</span>
              <button className="popup-close" onClick={() => { setModalSupprimerProprietaire(false); setConfirmerSuppressionEquipe(false) }}>✕</button>
            </div>

            {!confirmerSuppressionEquipe ? (
              <>
                <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
                  <i className="ti ti-users" style={{ fontSize: 36, color: 'var(--accent-red)', display: 'block', marginBottom: 12 }}></i>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Votre compte est propriétaire de l'équipe <strong>{equipeProprietaire?.nom}</strong>.
                    Que souhaitez-vous faire ?
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    className="profil-portal-btn"
                    onClick={() => { setModalSupprimerProprietaire(false); navigate('/equipe') }}
                  >
                    <i className="ti ti-arrow-right-circle"></i>
                    Transférer la propriété d'abord
                  </button>
                  <button
                    className="btn-supprimer-medicament"
                    onClick={() => setConfirmerSuppressionEquipe(true)}
                  >
                    Supprimer le compte et toutes les données d'équipe
                  </button>
                  <button
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setModalSupprimerProprietaire(false)}
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
                  <i className="ti ti-alert-triangle" style={{ fontSize: 36, color: 'var(--accent-red)', display: 'block', marginBottom: 12 }}></i>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Cette action est <strong>irréversible</strong>. Le compte propriétaire sera supprimé ainsi que toutes les données partagées de la clinique (médicaments personnalisés, protocoles, charte radiographique). Les membres perdront immédiatement leur accès à l'équipe.
                  </p>
                </div>
                {erreur && <div className="form-erreur" style={{ marginBottom: 12 }}>{erreur}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    className="btn-supprimer-medicament"
                    onClick={supprimerEquipeEtCompte}
                    disabled={saving}
                  >
                    {saving ? 'Suppression en cours...' : 'Confirmer la suppression définitive'}
                  </button>
                  <button
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setConfirmerSuppressionEquipe(false)}
                  >
                    Retour
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
