import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const JOURS_VALIDITE = 7

export default function RejoindreEquipe() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [statut, setStatut] = useState('chargement')
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)
  const [equipePossedee, setEquipePossedee] = useState(null)

  // Inscription directe depuis le lien d'invitation
  const [modeInscription, setModeInscription] = useState(false)
  const [nom, setNom] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreurInscription, setErreurInscription] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user || null)
    })
  }, [])

  useEffect(() => {
    if (!token) { setStatut('invalide'); return }
    verifierToken()
  }, [token])

  async function verifierToken() {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (error || !data) { setStatut('invalide'); return }

    /* Même règle que côté serveur, pour annoncer l'expiration
       tout de suite au lieu de laisser remplir un formulaire
       qui serait refusé à l'envoi. */
    if (Date.now() - new Date(data.created_at).getTime() > JOURS_VALIDITE * 86400000) {
      setStatut('expiree')
      return
    }

    const { data: equipeData } = await supabase
      .from('equipes')
      .select('nom')
      .eq('id', data.team_id)
      .single()

    setInvitation({ ...data, equipes: equipeData || null })
    setStatut('valide')
  }

  async function accepterInvitation() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate(`/connexion?redirect=${encodeURIComponent(`/rejoindre?token=${token}`)}`)
      return
    }

    /* La fonction edge plutôt que le RPC : elle seule peut
       annuler l'abonnement Pro auprès de Stripe, ce qu'une
       fonction SQL ne sait pas faire. Elle renvoie des codes
       plutôt que des messages, donc plus besoin de fouiller
       du texte français pour deviner ce qui s'est passé. */
    const { data, error } = await supabase.functions.invoke('accept-invitation', {
      body: { token },
    })

    setLoading(false)

    if (error) {
      setStatut('invalide')
      return
    }

    if (data?.ok) {
      setStatut('accepte')
      return
    }

    switch (data?.error) {
      case 'email_mismatch':
        setStatut('erreur')
        break
      case 'plein':
        setStatut('plein')
        break
      case 'expiree':
        setStatut('expiree')
        break
      case 'proprietaire_ailleurs':
        setEquipePossedee(data.nomEquipe || null)
        setStatut('proprietaire')
        break
      default:
        setStatut('invalide')
    }
  }

  /* Création du compte et adhésion en un seul appel.
     L'invitation a été envoyée à cette adresse, donc la
     possession est déjà démontrée : la fonction crée le compte
     avec le courriel confirmé, sans second aller-retour. */
  async function creerCompteEtRejoindre() {
    setErreurInscription('')

    if (!nom.trim()) return setErreurInscription('Le nom est requis.')
    if (motDePasse.length < 6) return setErreurInscription('Le mot de passe doit faire au moins 6 caractères.')
    if (motDePasse !== confirmation) return setErreurInscription('Les deux mots de passe ne correspondent pas.')

    setLoading(true)

    const { data, error } = await supabase.functions.invoke('signup-and-accept-invitation', {
      body: { token, email: invitation.email, password: motDePasse, nom: nom.trim() },
    })

    if (error || (data && !data.ok && !data.error)) {
      setLoading(false)
      return setErreurInscription("La création du compte a échoué. Réessayez dans un instant.")
    }

    if (data?.error) {
      setLoading(false)
      if (data.error === 'deja_inscrit') {
        return setErreurInscription('Un compte existe déjà avec cette adresse. Utilisez « J\'ai déjà un compte ».')
      }
      if (data.error === 'plein') { setStatut('plein'); return }
      if (data.error === 'expiree') { setStatut('expiree'); return }
      if (data.error === 'invalide') { setStatut('invalide'); return }
      return setErreurInscription("La création du compte a échoué. Réessayez dans un instant.")
    }

    /* Le compte est créé et confirmé, mais la fonction ne
       retourne pas de session. On ouvre la sienne tout de suite
       avec le mot de passe qu'on a déjà en main. */
    const { error: erreurConnexion } = await supabase.auth.signInWithPassword({
      email: invitation.email,
      password: motDePasse,
    })

    setLoading(false)

    if (erreurConnexion) {
      // Le compte existe bel et bien : on l'envoie se connecter.
      navigate(`/connexion?redirect=${encodeURIComponent(`/rejoindre?token=${token}`)}`)
      return
    }

    setStatut('accepte')
  }

  const redirectUrl = encodeURIComponent(`/rejoindre?token=${token}`)

  const styleChamp = {
    width: '100%', padding: '11px 13px', borderRadius: 10,
    border: '1px solid var(--border)', fontSize: 15,
    fontFamily: 'inherit', color: 'var(--text-primary)',
    background: 'var(--bg-card)', boxSizing: 'border-box',
  }
  const stylePrincipal = {
    width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
    background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer',
  }
  const styleSecondaire = {
    width: '100%', padding: '12px 0', borderRadius: 10,
    border: '1.5px solid var(--primary)', background: 'transparent',
    color: 'var(--primary)', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg-secondary)',
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, padding: 32,
        maxWidth: 400, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        {statut === 'chargement' && (
          <>
            <i className="ti ti-loader-2" style={{ fontSize: 40, color: 'var(--primary)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Vérification de l'invitation...</p>
          </>
        )}

        {statut === 'valide' && invitation && (
          <>
            <i className="ti ti-users" style={{ fontSize: 40, color: 'var(--primary)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Invitation reçue
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Vous avez reçu une invitation à rejoindre
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginBottom: 24 }}>
              {invitation.equipes?.nom}
            </p>

            {sessionUser ? (
              <button
                onClick={accepterInvitation}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                  background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'En cours...' : "Accepter l'invitation"}
              </button>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                  Cette invitation est pour <strong>{invitation.email}</strong>.
                </p>

                {!modeInscription ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={() => setModeInscription(true)} style={stylePrincipal}>
                      Créer mon compte
                    </button>
                    <button onClick={() => navigate(`/connexion?redirect=${redirectUrl}`)} style={styleSecondaire}>
                      J'ai déjà un compte
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                    <input
                      style={styleChamp}
                      placeholder="Votre nom"
                      value={nom}
                      onChange={e => { setNom(e.target.value); setErreurInscription('') }}
                      autoFocus
                    />
                    <input
                      style={styleChamp}
                      type="password"
                      placeholder="Mot de passe, 6 caractères minimum"
                      value={motDePasse}
                      onChange={e => { setMotDePasse(e.target.value); setErreurInscription('') }}
                    />
                    <input
                      style={styleChamp}
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      value={confirmation}
                      onChange={e => { setConfirmation(e.target.value); setErreurInscription('') }}
                      onKeyDown={e => { if (e.key === 'Enter' && !loading) creerCompteEtRejoindre() }}
                    />

                    {erreurInscription && (
                      <p style={{ fontSize: 13, color: 'var(--accent-red)', lineHeight: 1.5, margin: 0 }}>
                        {erreurInscription}
                      </p>
                    )}

                    <button
                      onClick={creerCompteEtRejoindre}
                      disabled={loading}
                      style={{ ...stylePrincipal, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
                    >
                      {loading ? 'Création...' : "Créer mon compte et rejoindre"}
                    </button>
                    <button
                      onClick={() => { setModeInscription(false); setErreurInscription('') }}
                      style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--text-hint)', cursor: 'pointer', padding: '4px 0' }}
                    >
                      Retour
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {statut === 'plein' && (
          <>
            <i className="ti ti-users-group" style={{ fontSize: 40, color: 'var(--accent-red)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Équipe complète</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Cette équipe a atteint sa limite de membres. Le propriétaire doit ajouter des sièges supplémentaires avant de pouvoir vous inviter.</p>
          </>
        )}

        {statut === 'expiree' && (
          <>
            <i className="ti ti-clock-x" style={{ fontSize: 40, color: 'var(--accent-red)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Invitation expirée
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)', lineHeight: 1.6 }}>
              Les invitations sont valables {JOURS_VALIDITE} jours. Demandez à la personne qui gère
              l'équipe de vous en renvoyer une, le lien arrivera par courriel.
            </p>
          </>
        )}

        {statut === 'proprietaire' && (
          <>
            <i className="ti ti-crown" style={{ fontSize: 40, color: 'var(--accent-gold, #B8860B)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Vous possédez déjà une clinique
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Votre compte est propriétaire {equipePossedee ? <>de <strong>{equipePossedee}</strong></> : "d'une autre équipe"}.
              Une personne n'appartient qu'à une seule équipe, et un propriétaire ne peut pas partir en laissant
              sa clinique sans responsable.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.6, marginBottom: 20 }}>
              Transférez la propriété à un autre membre, ou résiliez votre abonnement, puis revenez à ce lien.
            </p>
            <button
              onClick={() => { window.location.href = '/equipe/gestion' }}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Gérer mon équipe
            </button>
          </>
        )}

        {statut === 'invalide' && (
          <>
            <i className="ti ti-link-off" style={{ fontSize: 40, color: 'var(--accent-red)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Lien invalide</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Ce lien d'invitation est invalide ou a déjà été utilisé.</p>
          </>
        )}

        {statut === 'erreur' && (
          <>
            <i className="ti ti-alert-circle" style={{ fontSize: 40, color: 'var(--accent-red)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Mauvais compte</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)', marginBottom: 20 }}>
              Cette invitation est pour <strong>{invitation?.email}</strong>. Déconnectez-vous et reconnectez-vous avec ce courriel.
            </p>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.reload() }}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Se déconnecter
            </button>
          </>
        )}

        {statut === 'accepte' && (
          <>
            <i className="ti ti-circle-check" style={{ fontSize: 40, color: '#4CAF50', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Bienvenue dans l'équipe!</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Votre forfait équipe est maintenant actif.
            </p>
            <button
              onClick={() => { window.location.href = '/equipe' }}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Accéder à l'équipe
            </button>
          </>
        )}
      </div>
    </div>
  )
}
