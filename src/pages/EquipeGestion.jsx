import { useState, useEffect, useRef, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

const BUCKET_LOGOS = 'logos-cliniques'
const TAILLE_MAX_LOGO = 2 * 1024 * 1024 // 2 Mo
const LARGEUR_LOGO = 600 // px, après redimensionnement

const TYPES_LOGO = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']

function libelleRole(role) {
  if (role === 'proprietaire') return 'Propriétaire'
  if (role === 'admin') return 'Admin'
  return 'Membre'
}

function depuis(dateIso) {
  const jours = Math.floor((Date.now() - new Date(dateIso)) / 86400000)
  if (jours <= 0) return "aujourd'hui"
  if (jours === 1) return 'hier'
  if (jours < 7) return `il y a ${jours} jours`
  const semaines = Math.floor(jours / 7)
  if (semaines < 5) return `il y a ${semaines} semaine${semaines > 1 ? 's' : ''}`
  return `il y a ${Math.floor(jours / 30)} mois`
}

/* Redimensionne et convertit en PNG avant l'envoi : le logo se
   retrouve embarqué dans chaque PDF, autant qu'il soit léger.
   Le SVG est envoyé tel quel, il est déjà minuscule. */
async function preparerLogo(fichier) {
  if (fichier.type === 'image/svg+xml') {
    return { blob: fichier, extension: 'svg', contentType: 'image/svg+xml' }
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(fichier)
  })
  const img = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
  const echelle = Math.min(1, LARGEUR_LOGO / (img.width || LARGEUR_LOGO))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * echelle))
  canvas.height = Math.max(1, Math.round(img.height * echelle))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  return { blob, extension: 'png', contentType: 'image/png' }
}

export default function EquipeGestion() {
  const { teamId, roleEquipe, chargement, chargerProfil } = useProfil()
  const navigate = useNavigate()

  const [membres, setMembres] = useState([])
  const [invitations, setInvitations] = useState([])
  const [equipe, setEquipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [message, setMessage] = useState(null) // { type, texte }

  const [emailsInput, setEmailsInput] = useState('')
  const [roleInvit, setRoleInvit] = useState('membre')
  const [envoi, setEnvoi] = useState(false)
  const [envoiProgress, setEnvoiProgress] = useState(null)
  const [erreurInvit, setErreurInvit] = useState('')
  const [msgSucces, setMsgSucces] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  const [confirmRevoquer, setConfirmRevoquer] = useState(null)
  const [membreGere, setMembreGere] = useState(null)
  const [showTransfertModal, setShowTransfertModal] = useState(false)
  const [cibleTransfert, setCibleTransfert] = useState(null)
  const [transfertEnCours, setTransfertEnCours] = useState(false)
  const [erreurTransfert, setErreurTransfert] = useState('')

  const [editNomClinique, setEditNomClinique] = useState(false)
  const [nouveauNomClinique, setNouveauNomClinique] = useState('')
  const [envoiLogo, setEnvoiLogo] = useState(false)
  const [confirmRetraitLogo, setConfirmRetraitLogo] = useState(false)
  const champLogo = useRef(null)

  useEffect(() => {
    if (!teamId) return
    charger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 4000)
    return () => clearTimeout(t)
  }, [message])

  function signaler(type, texte) {
    setMessage({ type, texte })
  }

  async function charger() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setUserId(user.id)

    const [{ data: eq, error: eqErreur }, { data: mems, error: memErreur }, { data: invits }] = await Promise.all([
      supabase.from('equipes').select('*').eq('id', teamId).single(),
      supabase.from('membres_equipe').select('*, profiles(nom)').eq('equipe_id', teamId),
      supabase.from('team_invitations').select('*').eq('team_id', teamId).eq('status', 'pending').order('created_at', { ascending: false }),
    ])

    if (eqErreur || memErreur) signaler('erreur', "Impossible de charger l'équipe. Vérifiez votre connexion.")

    setEquipe(eq || null)
    setMembres(mems || [])
    setInvitations(invits || [])
    setLoading(false)
  }

  /* ─── LOGO ────────────────────────────────────────────── */
  async function choisirLogo(e) {
    const fichier = e.target.files?.[0]
    e.target.value = ''
    if (!fichier) return

    if (!TYPES_LOGO.includes(fichier.type)) {
      signaler('erreur', 'Format non accepté. Utilisez un PNG, un JPG, un SVG ou un WebP.')
      return
    }
    if (fichier.size > TAILLE_MAX_LOGO) {
      signaler('erreur', 'Fichier trop lourd, maximum 2 Mo.')
      return
    }

    setEnvoiLogo(true)
    try {
      const { blob, extension, contentType } = await preparerLogo(fichier)
      const chemin = `${teamId}/logo.${extension}`

      const { error: erreurUpload } = await supabase.storage
        .from(BUCKET_LOGOS)
        .upload(chemin, blob, { upsert: true, contentType, cacheControl: '3600' })
      if (erreurUpload) throw erreurUpload

      const { data: pub } = supabase.storage.from(BUCKET_LOGOS).getPublicUrl(chemin)
      const url = `${pub.publicUrl}?v=${Date.now()}`

      const { error: erreurMaj } = await supabase.from('equipes').update({ logo_url: url }).eq('id', teamId)
      if (erreurMaj) throw erreurMaj

      setEquipe(prev => ({ ...prev, logo_url: url }))
      signaler('succes', 'Logo mis à jour. Il apparaîtra sur vos prochains PDF.')
    } catch (err) {
      signaler('erreur', `Le logo n'a pas pu être envoyé. ${err?.message || ''}`.trim())
    } finally {
      setEnvoiLogo(false)
    }
  }

  async function retirerLogo() {
    setConfirmRetraitLogo(false)
    setEnvoiLogo(true)
    try {
      await supabase.storage.from(BUCKET_LOGOS).remove([`${teamId}/logo.png`, `${teamId}/logo.svg`])
      const { error } = await supabase.from('equipes').update({ logo_url: null }).eq('id', teamId)
      if (error) throw error
      setEquipe(prev => ({ ...prev, logo_url: null }))
      signaler('succes', 'Logo retiré.')
    } catch (err) {
      signaler('erreur', `Le logo n'a pas pu être retiré. ${err?.message || ''}`.trim())
    } finally {
      setEnvoiLogo(false)
    }
  }

  /* ─── NOM DE LA CLINIQUE ──────────────────────────────── */
  async function sauvegarderNomClinique() {
    const nom = nouveauNomClinique.trim()
    if (!nom) return
    const { error } = await supabase.from('equipes').update({ nom }).eq('id', teamId)
    if (error) {
      signaler('erreur', "Le nom n'a pas pu être enregistré.")
      return
    }
    setEquipe(prev => ({ ...prev, nom }))
    setEditNomClinique(false)
  }

  /* ─── INVITATIONS ─────────────────────────────────────── */
  function parseEmails(texte) {
    return [...new Set(
      texte.split(/[\s,;]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    )]
  }

  const emailsParsed = useMemo(() => parseEmails(emailsInput), [emailsInput])
  const siegesRestants = equipe?.max_membres ? equipe.max_membres - membres.length : Infinity
  const plein = equipe?.max_membres && membres.length >= equipe.max_membres

  async function inviterUn(email, role) {
    await supabase.from('team_invitations').delete().eq('team_id', teamId).eq('email', email)

    const token = crypto.randomUUID()
    const { error } = await supabase.from('team_invitations').insert({
      team_id: teamId, email, role, invited_by: userId, token, status: 'pending',
    })
    if (error) return { ok: false, message: error.message || 'Erreur inconnue' }

    const baseUrl = import.meta.env.VITE_APP_URL || 'https://adjuvet.app'
    const { error: erreurCourriel } = await supabase.functions.invoke('send-invitation', {
      body: { email, nomClinique: equipe?.nom || 'notre équipe', lien: `${baseUrl}/rejoindre?token=${token}`, emailInvite: email },
    })
    // L'invitation existe, mais le courriel n'est pas parti : on le dit.
    if (erreurCourriel) return { ok: false, message: "invitation créée, mais le courriel n'a pas pu être envoyé" }
    return { ok: true }
  }

  async function inviter() {
    if (emailsParsed.length === 0 || envoi) return
    setErreurInvit('')

    if (equipe?.max_membres && emailsParsed.length > siegesRestants) {
      setErreurInvit(`Seulement ${siegesRestants} siège${siegesRestants > 1 ? 's' : ''} disponible${siegesRestants > 1 ? 's' : ''} pour ${emailsParsed.length} invitations.`)
      return
    }

    setEnvoi(true)
    let envoyes = 0
    const erreurs = []
    setEnvoiProgress({ total: emailsParsed.length, envoyes: 0, erreurs: 0 })

    for (const email of emailsParsed) {
      const resultat = await inviterUn(email, roleInvit)
      if (resultat.ok) envoyes++
      else erreurs.push(`${email} : ${resultat.message}`)
      setEnvoiProgress({ total: emailsParsed.length, envoyes, erreurs: erreurs.length })
    }

    setEmailsInput('')
    await charger()

    if (erreurs.length === 0) {
      setMsgSucces(`${envoyes} invitation${envoyes > 1 ? 's' : ''} envoyée${envoyes > 1 ? 's' : ''}.`)
      setTimeout(() => { setShowInviteModal(false); setMsgSucces('') }, 1800)
    } else if (envoyes === 0) {
      setErreurInvit(erreurs.join('\n'))
    } else {
      setErreurInvit(`${envoyes} envoyée${envoyes > 1 ? 's' : ''}. Échec :\n${erreurs.join('\n')}`)
    }
    setEnvoiProgress(null)
    setEnvoi(false)
  }

  async function renvoyerInvitation(invitation) {
    const resultat = await inviterUn(invitation.email, invitation.role)
    if (resultat.ok) signaler('succes', `Invitation renvoyée à ${invitation.email}.`)
    else signaler('erreur', `Échec du renvoi : ${resultat.message}`)
    charger()
  }

  async function annulerInvitation(id) {
    const { error } = await supabase.from('team_invitations').delete().eq('id', id)
    if (error) {
      signaler('erreur', "L'invitation n'a pas pu être annulée.")
      return
    }
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  /* ─── MEMBRES ─────────────────────────────────────────── */
  async function changerRole(membre, nouveauRole) {
    const { error } = await supabase.rpc('changer_role_membre', {
      membre_user_id: membre.user_id,
      equipe_id_param: teamId,
      nouveau_role: nouveauRole,
    })
    if (error) {
      signaler('erreur', "Le rôle n'a pas pu être modifié.")
      return
    }
    setMembres(prev => prev.map(m => m.id === membre.id ? { ...m, role: nouveauRole } : m))
    setMembreGere(prev => prev && prev.id === membre.id ? { ...prev, role: nouveauRole } : prev)
    signaler('succes', `${membre.profiles?.nom || 'Ce membre'} est maintenant ${libelleRole(nouveauRole).toLowerCase()}.`)
  }

  async function revoquerMembre(membre) {
    const { error } = await supabase.rpc('revoquer_membre', {
      membre_user_id: membre.user_id,
      equipe_id_param: teamId,
    })
    if (error) {
      signaler('erreur', "L'accès n'a pas pu être révoqué. Rien n'a été modifié.")
      setConfirmRevoquer(null)
      return
    }
    const { error: erreurProfil } = await supabase.from('profiles')
      .update({ plan: 'free', equipe_id: null, role: null })
      .eq('id', membre.user_id)
    if (erreurProfil) {
      signaler('erreur', "Accès révoqué, mais le forfait du membre n'a pas pu être rétrogradé.")
    } else {
      signaler('succes', 'Accès révoqué.')
    }
    setMembres(prev => prev.filter(m => m.id !== membre.id))
    setConfirmRevoquer(null)
    setMembreGere(null)
  }

  async function effectuerTransfert() {
    if (!cibleTransfert || transfertEnCours) return
    setTransfertEnCours(true)
    setErreurTransfert('')

    const { data, error } = await supabase.functions.invoke('transferer-propriete', {
      body: { equipe_id: teamId, nouveau_proprio_user_id: cibleTransfert.user_id },
    })

    if (error || data?.error) {
      setErreurTransfert(data?.error || 'Une erreur est survenue. Veuillez réessayer.')
      setTransfertEnCours(false)
      return
    }

    setShowTransfertModal(false)
    setCibleTransfert(null)
    setMembreGere(null)
    setTransfertEnCours(false)
    await charger()
    if (chargerProfil) chargerProfil()
  }

  /* ─── RENDU ───────────────────────────────────────────── */
  if (chargement) return null
  if (roleEquipe !== 'admin' && roleEquipe !== 'proprietaire') return <Navigate to="/equipe" replace />

  if (loading) {
    return (
      <div className="equipe-page">
        <div className="equipe-carte equipe-squelette" />
        <div className="equipe-carte equipe-squelette" />
        <div className="equipe-carte equipe-squelette equipe-squelette--haute" />
      </div>
    )
  }

  const estProprietaire = roleEquipe === 'proprietaire'

  return (
    <div className="equipe-page">

      {message && (
        <div className={`equipe-message ${message.type}`}>
          <i className={`ti ti-${message.type === 'erreur' ? 'alert-circle' : 'circle-check'}`}></i>
          <span>{message.texte}</span>
        </div>
      )}

      {/* ═══ CLINIQUE ═══ */}
      <div className="equipe-carte">
        <div className="equipe-carte-titre">Clinique</div>

        <div className="equipe-clinique">
          <div className="equipe-logo">
            {equipe?.logo_url
              ? <img src={equipe.logo_url} alt="Logo de la clinique" />
              : <i className="ti ti-building-hospital"></i>}
          </div>

          <div className="equipe-clinique-textes">
            {editNomClinique ? (
              <div className="equipe-edition-nom">
                <input
                  className="form-input"
                  value={nouveauNomClinique}
                  onChange={e => setNouveauNomClinique(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') sauvegarderNomClinique()
                    if (e.key === 'Escape') setEditNomClinique(false)
                  }}
                  autoFocus
                />
                <button className="equipe-lien" onClick={sauvegarderNomClinique}>Enregistrer</button>
                <button className="equipe-lien discret" onClick={() => setEditNomClinique(false)}>Annuler</button>
              </div>
            ) : (
              <>
                <span className="equipe-clinique-nom">{equipe?.nom || 'Clinique'}</span>
                <button className="equipe-lien" onClick={() => { setNouveauNomClinique(equipe?.nom || ''); setEditNomClinique(true) }}>
                  Renommer
                </button>
              </>
            )}
          </div>
        </div>

        <p className="equipe-aide">
          Le logo remplace le symbole Adjuvet en haut de vos PDF. Image de 2 Mo maximum.
          Un logo carré sur fond transparent ou blanc donne le meilleur résultat.
        </p>

        <div className="equipe-actions-logo">
          <input
            ref={champLogo}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={choisirLogo}
            style={{ display: 'none' }}
          />
          <button className="equipe-btn-secondaire" onClick={() => champLogo.current?.click()} disabled={envoiLogo}>
            <i className="ti ti-upload"></i>
            {envoiLogo ? 'Envoi...' : equipe?.logo_url ? 'Remplacer le logo' : 'Ajouter un logo'}
          </button>
          {equipe?.logo_url && (
            <button className="equipe-lien danger" onClick={() => setConfirmRetraitLogo(true)} disabled={envoiLogo}>
              Retirer
            </button>
          )}
        </div>
      </div>

      {/* ═══ SIÈGES ═══ */}
      {equipe?.max_membres && (
        <div className={`equipe-carte ${plein ? 'alerte' : ''}`}>
          <div className="equipe-sieges-haut">
            <span className="equipe-carte-titre">Sièges utilisés</span>
            <span className={`equipe-sieges-compte ${plein ? 'alerte' : ''}`}>
              {membres.length} / {equipe.max_membres}
            </span>
          </div>
          <div className="equipe-jauge">
            <div
              className={`equipe-jauge-remplissage ${plein ? 'alerte' : ''}`}
              style={{ width: `${Math.min(100, (membres.length / equipe.max_membres) * 100)}%` }}
            />
          </div>
          <p className={`equipe-aide ${plein ? 'alerte' : ''}`}>
            {plein
              ? "Limite atteinte. Augmentez le nombre de sièges pour inviter d'autres membres."
              : `${equipe.max_membres - membres.length} siège${equipe.max_membres - membres.length > 1 ? 's' : ''} disponible${equipe.max_membres - membres.length > 1 ? 's' : ''}`}
          </p>
          {plein && estProprietaire && (
            <button className="equipe-btn-secondaire" onClick={() => navigate('/abonnement')}>
              <i className="ti ti-arrow-up-circle"></i> Augmenter les sièges
            </button>
          )}
        </div>
      )}

      {/* ═══ MEMBRES ═══ */}
      <div className="equipe-bloc">
        <div className="equipe-bloc-entete">
          <span className="equipe-bloc-titre">Membres ({membres.length})</span>
          <button
            className="equipe-lien"
            onClick={() => plein ? navigate('/abonnement') : setShowInviteModal(true)}
          >
            {plein ? 'Limite atteinte' : '+ Ajouter'}
          </button>
        </div>

        <p className="equipe-aide">
          Un admin peut inviter, retirer et changer les rôles. Un membre consulte les protocoles et les
          monographies de l'équipe sans pouvoir les modifier.
        </p>

        <div className="equipe-liste">
          {membres.map(m => {
            const cestMoi = m.user_id === userId
            return (
              <div key={m.id} className="equipe-membre">
                <div className="equipe-membre-avatar">
                  {(m.profiles?.nom || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div className="equipe-membre-textes">
                  <span className="equipe-membre-nom">
                    {m.profiles?.nom || 'Sans nom'}
                    {cestMoi && <span className="equipe-membre-moi">vous</span>}
                  </span>
                  <span className={`equipe-membre-role ${m.role}`}>{libelleRole(m.role)}</span>
                </div>
                {m.role !== 'proprietaire' && !cestMoi && (
                  <button className="equipe-membre-gerer" onClick={() => setMembreGere(m)}>
                    Gérer
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ INVITATIONS ═══ */}
      {invitations.length > 0 && (
        <div className="equipe-bloc">
          <div className="equipe-bloc-entete">
            <span className="equipe-bloc-titre">Invitations en attente ({invitations.length})</span>
          </div>
          <div className="equipe-liste">
            {invitations.map(inv => (
              <div key={inv.id} className="equipe-invitation">
                <div className="equipe-membre-textes">
                  <span className="equipe-membre-nom">{inv.email}</span>
                  <span className="equipe-invitation-detail">
                    {libelleRole(inv.role)} · envoyée {depuis(inv.created_at)}
                  </span>
                </div>
                <div className="equipe-invitation-actions">
                  <button className="equipe-lien" onClick={() => renvoyerInvitation(inv)}>Renvoyer</button>
                  <button className="equipe-lien danger" onClick={() => annulerInvitation(inv.id)}>Annuler</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ POPUP GESTION D'UN MEMBRE ═══ */}
      {membreGere && (
        <div className="popup-overlay" onClick={() => setMembreGere(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{membreGere.profiles?.nom || 'Membre'}</span>
              <button className="popup-close" onClick={() => setMembreGere(null)}>✕</button>
            </div>

            <div className="equipe-gestion">
              <div className="equipe-gestion-section">
                <span className="equipe-carte-titre">Rôle</span>
                <div className="toggle-groupe">
                  <button
                    className={`toggle-btn ${membreGere.role === 'membre' ? 'actif' : ''}`}
                    onClick={() => changerRole(membreGere, 'membre')}
                  >
                    Membre
                  </button>
                  <button
                    className={`toggle-btn ${membreGere.role === 'admin' ? 'actif' : ''}`}
                    onClick={() => changerRole(membreGere, 'admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {estProprietaire && (
                <button
                  className="equipe-btn-secondaire"
                  onClick={() => { setCibleTransfert(membreGere); setShowTransfertModal(true) }}
                >
                  <i className="ti ti-arrows-exchange"></i> Transférer la propriété
                </button>
              )}

              <button className="equipe-btn-danger" onClick={() => setConfirmRevoquer(membreGere)}>
                <i className="ti ti-user-x"></i> Révoquer l'accès
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ POPUP INVITATION ═══ */}
      {showInviteModal && (
        <div className="popup-overlay" onClick={() => { setShowInviteModal(false); setEmailsInput(''); setErreurInvit(''); setMsgSucces('') }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Ajouter un membre</span>
              <button className="popup-close" onClick={() => { setShowInviteModal(false); setEmailsInput(''); setErreurInvit(''); setMsgSucces('') }}>✕</button>
            </div>

            <div className="equipe-gestion">
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Courriels, séparés par une virgule, un espace ou un retour de ligne"
                value={emailsInput}
                onChange={e => { setEmailsInput(e.target.value); setErreurInvit('') }}
              />

              {emailsParsed.length > 1 && (
                <div className="equipe-emails">
                  <span className="equipe-carte-titre">{emailsParsed.length} courriels détectés</span>
                  {emailsParsed.map(e => (
                    <p key={e} className="equipe-email"><i className="ti ti-mail"></i>{e}</p>
                  ))}
                </div>
              )}

              <div>
                <span className="equipe-carte-titre">Rôle attribué</span>
                <div className="toggle-groupe" style={{ marginTop: 6 }}>
                  <button className={`toggle-btn ${roleInvit === 'membre' ? 'actif' : ''}`} onClick={() => setRoleInvit('membre')}>Membre</button>
                  <button className={`toggle-btn ${roleInvit === 'admin' ? 'actif' : ''}`} onClick={() => setRoleInvit('admin')}>Admin</button>
                </div>
              </div>

              {envoiProgress && (
                <p className="equipe-aide">
                  Envoi en cours, {envoiProgress.envoyes + envoiProgress.erreurs} sur {envoiProgress.total}
                </p>
              )}

              {erreurInvit && (
                <div className="equipe-message erreur" style={{ whiteSpace: 'pre-line' }}>
                  <i className="ti ti-alert-circle"></i><span>{erreurInvit}</span>
                </div>
              )}

              {msgSucces && (
                <div className="equipe-message succes">
                  <i className="ti ti-circle-check"></i><span>{msgSucces}</span>
                </div>
              )}

              <button className="equipe-btn-primaire" onClick={inviter} disabled={emailsParsed.length === 0 || envoi}>
                {envoi
                  ? 'Envoi en cours...'
                  : emailsParsed.length > 1
                    ? `Envoyer ${emailsParsed.length} invitations`
                    : "Envoyer l'invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ POPUP TRANSFERT ═══ */}
      {showTransfertModal && cibleTransfert && (
        <div className="popup-overlay" onClick={() => { if (!transfertEnCours) { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') } }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Transférer la propriété</span>
              <button className="popup-close" onClick={() => { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') }} disabled={transfertEnCours}>✕</button>
            </div>

            <div className="equipe-gestion">
              <div className="equipe-centre">
                <i className="ti ti-arrows-exchange equipe-icone-grande"></i>
                <p className="equipe-centre-titre">Transférer à {cibleTransfert.profiles?.nom}?</p>
                <p className="equipe-aide">Vous deviendrez admin. Cette action est irréversible.</p>
              </div>

              <div className="equipe-avertissement">
                <span className="equipe-carte-titre">Facturation</span>
                <p>
                  Le renouvellement sera chargé sur la carte de crédit actuellement enregistrée jusqu'à ce
                  que {cibleTransfert.profiles?.nom} mette à jour ses informations de paiement dans
                  Abonnement, puis Gérer ma facturation.
                </p>
              </div>

              {erreurTransfert && (
                <div className="equipe-message erreur">
                  <i className="ti ti-alert-circle"></i><span>{erreurTransfert}</span>
                </div>
              )}

              <div className="popup-actions-centrees">
                <button className="equipe-btn-secondaire" style={{ flex: 1 }} onClick={() => { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') }} disabled={transfertEnCours}>
                  Annuler
                </button>
                <button className="equipe-btn-primaire" style={{ flex: 1 }} onClick={effectuerTransfert} disabled={transfertEnCours}>
                  {transfertEnCours ? 'Transfert...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRMATION RÉVOCATION ═══ */}
      {confirmRevoquer && (
        <div className="popup-overlay" onClick={() => setConfirmRevoquer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="equipe-centre">
              <i className="ti ti-user-x equipe-icone-grande danger"></i>
              <p className="equipe-centre-titre">Révoquer cet accès?</p>
              <p className="equipe-aide">
                {confirmRevoquer.profiles?.nom || 'Ce membre'} perdra l'accès au forfait équipe et repassera au forfait gratuit.
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="equipe-btn-secondaire" style={{ flex: 1 }} onClick={() => setConfirmRevoquer(null)}>Annuler</button>
              <button className="equipe-btn-danger" style={{ flex: 1 }} onClick={() => revoquerMembre(confirmRevoquer)}>Révoquer</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRMATION RETRAIT DU LOGO ═══ */}
      {confirmRetraitLogo && (
        <div className="popup-overlay" onClick={() => setConfirmRetraitLogo(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="equipe-centre">
              <i className="ti ti-photo-off equipe-icone-grande"></i>
              <p className="equipe-centre-titre">Retirer le logo?</p>
              <p className="equipe-aide">Vos prochains PDF reprendront le symbole Adjuvet.</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="equipe-btn-secondaire" style={{ flex: 1 }} onClick={() => setConfirmRetraitLogo(false)}>Annuler</button>
              <button className="equipe-btn-danger" style={{ flex: 1 }} onClick={retirerLogo}>Retirer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
