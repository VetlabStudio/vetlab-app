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

  useEffect(() => {
    if (!token) { setStatut('invalide'); return }
    verifierToken()
  }, [token])

  async function verifierToken() {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*, equipes(nom)')
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (error || !data) { setStatut('invalide'); return }
    setInvitation(data)
    setStatut('valide')
  }

  async function accepterInvitation() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate(`/connexion?redirect=/rejoindre?token=${token}`)
      return
    }

    if (user.email !== invitation.email) {
      setStatut('erreur')
      setLoading(false)
      return
    }

    const { error: membreErr } = await supabase
      .from('membres_equipe')
      .upsert({ equipe_id: invitation.team_id, user_id: user.id, role: invitation.role }, { onConflict: 'equipe_id,user_id' })

    if (membreErr) { setStatut('erreur'); setLoading(false); return }

    await supabase
      .from('team_invitations')
      .update({ status: 'accepted' })
      .eq('token', token)

    await supabase
      .from('profiles')
      .update({ plan: 'equipe', equipe_id: invitation.team_id, role: invitation.role })
      .eq('id', user.id)

    setStatut('accepte')
    setLoading(false)
    setTimeout(() => navigate('/equipe'), 2000)
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
              Vous êtes invité(e) à rejoindre
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginBottom: 24 }}>
              {invitation.equipes?.nom}
            </p>
            <button
              onClick={accepterInvitation}
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Connexion...' : "Accepter l'invitation"}
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
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Courriel non concordant</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Cette invitation a été envoyée à une autre adresse courriel.</p>
          </>
        )}

        {statut === 'accepte' && (
          <>
            <i className="ti ti-circle-check" style={{ fontSize: 40, color: '#4CAF50', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Bienvenue dans l'équipe!</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Redirection en cours...</p>
          </>
        )}
      </div>
    </div>
  )
}
