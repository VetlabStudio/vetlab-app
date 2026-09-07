import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RejoindreEquipe() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [statut, setStatut] = useState('chargement')
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)

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

    const { error } = await supabase.rpc('accepter_invitation', { token_param: token })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('Courriel non concordant')) { setStatut('erreur') }
      else if (msg.includes('pleine')) { setStatut('plein') }
      else { setStatut('invalide') }
      setLoading(false)
      return
    }

    setStatut('accepte')
    setLoading(false)
  }

  const redirectUrl = encodeURIComponent(`/rejoindre?token=${token}`)

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
              Vous êtes invité(e) à rejoindre
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
                  Cette invitation est pour <strong>{invitation.email}</strong>.<br />
                  Connectez-vous ou créez un compte avec cette adresse pour l'accepter.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => navigate(`/inscription?redirect=${redirectUrl}&email=${encodeURIComponent(invitation.email)}`)}
                    style={{
                      width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                      background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Créer un compte
                  </button>
                  <button
                    onClick={() => navigate(`/connexion?redirect=${redirectUrl}`)}
                    style={{
                      width: '100%', padding: '12px 0', borderRadius: 10,
                      border: '1.5px solid var(--primary)', background: 'transparent',
                      color: 'var(--primary)', fontSize: 15, fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    J'ai déjà un compte
                  </button>
                </div>
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
