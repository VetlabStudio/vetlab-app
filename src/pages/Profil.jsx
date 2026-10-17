import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'
import IndicateurMotDePasse from '../components/IndicateurMotDePasse'
import { verifierMotDePasse } from '../lib/motDePasse'
import SuggestionCourriel from '../components/SuggestionCourriel'
import { useSuggestionCourriel } from '../hooks/useSuggestionCourriel'
import { useProfil } from '../context/ProfilContext'

const TAILLE_AVATAR = 512

/* Réduit la photo avant l'envoi : une photo de téléphone pèse souvent
   plusieurs Mo et dépasse la limite du stockage. Le résultat est un
   JPEG d'au plus 512 px de côté, quelques dizaines de ko. */
async function preparerAvatar(fichier) {
  const url = URL.createObjectURL(fichier)
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })
    const echelle = Math.min(1, TAILLE_AVATAR / Math.max(img.width || 1, img.height || 1))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * echelle))
    canvas.height = Math.max(1, Math.round(img.height * echelle))
    const contexte = canvas.getContext('2d')
    // Fond blanc : sinon les zones transparentes d'un PNG deviennent noires en JPEG.
    contexte.fillStyle = '#FFFFFF'
    contexte.fillRect(0, 0, canvas.width, canvas.height)
    contexte.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise((resolve, reject) =>
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('conversion'))), 'image/jpeg', 0.85)
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function Profil() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  // Rafraîchit l'avatar affiché ailleurs (menu Plus).
  const { chargerProfil: rafraichirContexte } = useProfil()
  const [envoiAvatar, setEnvoiAvatar] = useState(false)

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
  const [apercuSuppression, setApercuSuppression] = useState(null)
  const [chargementApercu, setChargementApercu] = useState(false)

  // Champs édition
  const [nouveauNom, setNouveauNom] = useState('')
  const [nouveauEmail, setNouveauEmail] = useState('')
  const suggestionEmail = useSuggestionCourriel(nouveauEmail)
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmMdp, setConfirmMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
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
    chargerProfil()
  }, [])

  /* supabase-js met le corps d'une réponse non 2xx dans
     error.context, pas dans data. Sans ça on n'a que
     « Edge Function returned a non-2xx status code ». */
  async function lireCodeErreur(error) {
    try {
      const corps = await error.context.json()
      return corps?.error || null
    } catch {
      return null
    }
  }

  const MESSAGES_SUPPRESSION = {
    stripe_indisponible: "Impossible de joindre Stripe en ce moment. Rien n'a été supprimé, réessayez dans quelques minutes.",
    annulation_impossible: "Votre abonnement n'a pas pu être annulé. Rien n'a été supprimé pour éviter que la facturation continue sans compte. Réessayez, ou écrivez-nous.",
    retrogradation_impossible: "Les membres de votre clinique n'ont pas pu être rétrogradés. Rien n'a été supprimé.",
    donnees_personnelles_impossible: "Vos examens et chartes personnels n'ont pas pu être supprimés. Votre compte est intact, réessayez.",
    equipe_impossible: "Votre clinique n'a pas pu être supprimée. Votre compte est intact, réessayez.",
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
    if (error) return setErreur(traduireErreur(error, "Le nom n'a pas pu être enregistré."))
    setProfil(prev => ({ ...prev, nom: nouveauNom.trim() }))
    setModalNom(false)
    afficherSucces('Nom mis à jour !')
  }

  // ─── MODIFIER EMAIL ───────────────────────────
  async function sauvegarderEmail() {
    if (!nouveauEmail.trim()) return setErreur('Le courriel ne peut pas être vide.')
    // Faute de frappe probable pas encore vue : on la montre d'abord.
    if (suggestionEmail.doitConfirmer()) return
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ email: nouveauEmail.trim() })
    setSaving(false)
    if (error) return setErreur(traduireErreur(error, "Le courriel n'a pas pu être modifié."))
    /* L'adresse affichée ne change pas encore : elle ne change dans
       le compte qu'une fois le lien de confirmation ouvert. */
    setModalEmail(false)
    afficherSucces(`Ouvrez le lien de confirmation envoyé à ${nouveauEmail.trim()} : votre adresse changera ensuite.`)
  }

  // ─── MODIFIER MOT DE PASSE ────────────────────
  async function sauvegarderMdp() {
    if (!nouveauMdp) return setErreur('Le mot de passe ne peut pas être vide.')
    const evaluation = await verifierMotDePasse(nouveauMdp, { email: profil?.email, nom: profil?.nom })
    if (!evaluation.valide) return setErreur(evaluation.message)
    if (nouveauMdp !== confirmMdp) return setErreur('Les mots de passe ne correspondent pas.')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
    setSaving(false)
    if (error) return setErreur(traduireErreur(error, "Le mot de passe n'a pas pu être modifié."))
    setModalMdp(false)
    setNouveauMdp('')
    setConfirmMdp('')
    afficherSucces('Mot de passe mis à jour !')
  }

  // ─── PHOTO DE PROFIL ──────────────────────────
  async function changerAvatar(e) {
    const file = e.target.files[0]
    // Vider le champ permet de choisir de nouveau la même photo.
    e.target.value = ''
    if (!file) return
    /* Un SVG est un dessin, pas une photo : il se charge mal et la photo
       resterait vide. On le refuse avant l'envoi. */
    if (file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)) {
      setErreur("Le format SVG n'est pas accepté pour la photo de profil. Choisissez une photo JPG ou PNG.")
      return
    }
    setEnvoiAvatar(true)
    setErreur('')
    try {
      let image
      try {
        image = await preparerAvatar(file)
      } catch {
        throw new Error("Ce format d'image n'est pas pris en charge. Essayez une photo JPG ou PNG.")
      }
      const path = `${profil.id}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, image, { upsert: true, contentType: 'image/jpeg' })
      if (uploadError) {
        console.error('Envoi de la photo impossible:', uploadError)
        throw new Error(traduireErreur(uploadError, "La photo n'a pas pu être envoyée."))
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + '?t=' + Date.now()
      const { error: majErr } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', profil.id)
      if (majErr) {
        console.error('Enregistrement de la photo impossible:', majErr)
        throw new Error("La photo a été envoyée, mais n'a pas pu être enregistrée dans votre profil.")
      }
      setAvatarUrl(url)
      // Les anciennes versions (autre extension) ne servent plus.
      supabase.storage.from('avatars')
        .remove(['png', 'jpeg', 'heic', 'webp', 'gif'].map(ext => `${profil.id}.${ext}`))
        .catch(() => {})
      if (rafraichirContexte) rafraichirContexte()
      afficherSucces('Photo de profil mise à jour.')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoiAvatar(false)
    }
  }

  // ─── SUPPRIMER COMPTE ─────────────────────────
  /* Un seul chemin maintenant. La fonction edge annule les
     abonnements Stripe, rétrograde les membres de la clinique
     puis dissout l'équipe, dans cet ordre. Le faire depuis le
     navigateur, comme avant, supprimait l'équipe avant que la
     fonction puisse la voir. */
  async function supprimerCompte() {
    setSaving(true)
    setErreur('')
    const { data, error } = await supabase.functions.invoke('delete-account')
    if (error) {
      const code = await lireCodeErreur(error)
      setSaving(false)
      return setErreur(MESSAGES_SUPPRESSION[code]
        || traduireErreur(error, "La suppression du compte n'a pas pu se terminer. Réessayez dans quelques minutes, ou écrivez-nous."))
    }
    // Naviguer avant signOut : sinon la route protégée /profil redirige vers /connexion.
    navigate('/compte-supprime', { replace: true, state: { abonnementsAnnules: data?.abonnementsAnnules || 0 } })
    await supabase.auth.signOut({ scope: 'local' })
  }

  // Le cas du propriétaire passe par la même fonction : c'est
  // elle qui sait dans quel ordre défaire les choses.
  const supprimerEquipeEtCompte = supprimerCompte

  // ─── DÉCONNEXION ──────────────────────────────
  async function deconnecter() {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  /* L'aperçu ne supprime rien : il retourne ce qui se passerait,
     pour que la confirmation annonce les vrais chiffres au lieu
     d'un avertissement vague. */
  async function chargerApercuSuppression() {
    setChargementApercu(true)
    setApercuSuppression(null)
    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: { verification: true },
    })
    setChargementApercu(false)
    if (!error && data?.apercu) setApercuSuppression(data.apercu)
  }

  function ouvrirModal(modal) {
    setErreur('')
    setSucces('')
    if (modal === 'nom') { setNouveauNom(profil?.nom || ''); setModalNom(true) }
    if (modal === 'email') { setNouveauEmail(profil?.email || ''); suggestionEmail.reinitialiser(); setModalEmail(true) }
    if (modal === 'mdp') { setNouveauMdp(''); setConfirmMdp(''); setModalMdp(true) }
    if (modal === 'supprimer') {
      chargerApercuSuppression()
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
        <div
          className="profil-avatar"
          onClick={() => { if (!envoiAvatar) fileInputRef.current?.click() }}
          role="button"
          tabIndex={0}
          aria-label={envoiAvatar ? 'Envoi de la photo en cours' : 'Changer la photo de profil'}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !envoiAvatar) { e.preventDefault(); fileInputRef.current?.click() } }}
          style={envoiAvatar ? { opacity: 0.6 } : undefined}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="Avatar" className="profil-avatar-img" />
            : <i className="ti ti-user" style={{ fontSize: 40, color: 'var(--text-hint)' }}></i>
          }
          <div className="profil-avatar-overlay">
            <i className={`ti ${envoiAvatar ? 'ti-loader-2' : 'ti-camera'}`} style={{ fontSize: 16, color: 'white' }}></i>
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
              <label className="form-label" htmlFor="profil-nom">Nom complet</label>
              <input id="profil-nom" className="form-input" autoComplete="name" placeholder="ex. Marie Tremblay" value={nouveauNom} onChange={e => setNouveauNom(e.target.value)} autoFocus />
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
              <label className="form-label" htmlFor="profil-courriel">Nouveau courriel</label>
              <input id="profil-courriel" className="form-input" autoComplete="email" placeholder="ex. nom@clinique.ca" type="email" value={nouveauEmail} onChange={e => setNouveauEmail(e.target.value)} aria-describedby={suggestionEmail.suggestion ? 'suggestion-courriel' : undefined} autoFocus />
              <SuggestionCourriel id="suggestion-courriel" suggestion={suggestionEmail.suggestion} onCorriger={() => setNouveauEmail(suggestionEmail.suggestion)} avertie={suggestionEmail.avertie} bouton="Enregistrer" />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-groupe">
                <label className="form-label" htmlFor="profil-mdp">Nouveau mot de passe</label>
                <input id="profil-mdp" className="form-input" autoComplete="new-password" type="password" value={nouveauMdp} onChange={e => setNouveauMdp(e.target.value)} autoFocus />
                <IndicateurMotDePasse motDePasse={nouveauMdp} email={profil?.email} nom={profil?.nom} />
              </div>
              <div className="form-groupe">
                <label className="form-label" htmlFor="profil-mdp-confirmation">Confirmer le mot de passe</label>
                <input id="profil-mdp-confirmation" className="form-input" autoComplete="new-password" placeholder="Retapez le mot de passe" type="password" value={confirmMdp} onChange={e => setConfirmMdp(e.target.value)} />
              </div>
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
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </p>
            {chargementApercu && (
              <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 12 }}>Vérification en cours...</p>
            )}
            {apercuSuppression?.nbAbonnements > 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Votre abonnement sera annulé immédiatement, vous ne serez plus facturé.
              </p>
            )}
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
                    {apercuSuppression?.nbMembres > 0 && (
                      <> Elle compte <strong>{apercuSuppression.nbMembres} autre{apercuSuppression.nbMembres > 1 ? 's' : ''} membre{apercuSuppression.nbMembres > 1 ? 's' : ''}</strong>.</>
                    )}
                    {' '}Que souhaitez-vous faire ?
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    className="profil-portal-btn"
                    onClick={() => { setModalSupprimerProprietaire(false); navigate('/equipe/gestion', { state: { aideTransfert: true } }) }}
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
                    Cette action est <strong>irréversible</strong>. Le compte propriétaire sera supprimé ainsi que toutes les données partagées de la clinique : médicaments personnalisés, protocoles, charte radiographique.
                  </p>
                  {apercuSuppression?.nbMembres > 0 && (
                    <p style={{ fontSize: 14, color: 'var(--accent-red)', fontWeight: 600, lineHeight: 1.6, marginTop: 12 }}>
                      {apercuSuppression.nbMembres} personne{apercuSuppression.nbMembres > 1 ? 's' : ''} repassera{apercuSuppression.nbMembres > 1 ? 'ont' : ''} au forfait gratuit et perdra{apercuSuppression.nbMembres > 1 ? 'ont' : ''} l'accès aux données de la clinique.
                    </p>
                  )}
                  {apercuSuppression?.nbAbonnements > 0 && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>
                      Votre abonnement sera annulé immédiatement.
                    </p>
                  )}
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
