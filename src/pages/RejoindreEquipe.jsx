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
  const [planActuel, setPlanActuel] = useState(null)
  const [confirmCompris, setConfirmCompris] = useState(false)

  useEffect(() => {
    if (!token) { setStatut('invalide'); return }
    verifierToken()
  }, [token])

  async function verifierToken() {
    // Appel Edge Function — service role côté serveur, aucune RLS anon nécessaire
    const { data, error } = await supabase.functions.invoke('verify-invitation', {
      body: { token },
    })

    if (error || !data?.invitation) { setStatut('invalide'); return }
    setInvitation(data.invitation)

    // Vérifier si l'utilisateur est connecté et a un abonnement Pro
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profil } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
      setPlanActuel(profil?.plan || null)
    }

    setStatut('valide')
  }

  async function accepterInvitation() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate(`/connexion?redirect=/rejoindre?token=${token}`)
      return
    }

    // Annuler l'abonnement Pro avant de rejoindre l'équipe
    if (planActuel === 'pro') {
      const { error: cancelErr } = await supabase.functions.invoke('cancel-pro-subscription')
      if (cancelErr) {
        setStatut('erreur-annulation')
        setLoading(false)
        return
      }
    }

    // Accepter l'invitation via Edge Function (toute la logique côté serveur)
    const { data, error } = await supabase.functions.invoke('accept-invitation', {
      body: { token },
    })

    if (error || !data) { setStatut('erreur'); setLoading(false); return }

    if (!data.ok) {
      const code = data.error
      if (code === 'plein') { setStatut('plein'); setLoading(false); return }
      if (code === 'email_mismatch') { setStatut('erreur'); setLoading(false); return }
      setStatut('erreur')
      setLoading(false)
      return
    }

    setStatut('accepte')
    setLoading(false)
    setTimeout(() => navigate('/equipe'), 2000)
  }

  const avertissementPro = planActuel === 'pro'

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg-secondary)',
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, padding: 32,
        maxWidth: 420, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
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

            {avertissementPro && (
              <div style={{
                background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.35)',
                borderRadius: 10, padding: '14px 16px', marginBottom: 20, textAlign: 'left',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92700a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="ti ti-alert-triangle"></i>
                  Vous avez un abonnement Pro actif
                </p>
                <ul style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  <li>Votre abonnement Pro sera <strong>annulé automatiquement</strong></li>
                  <li>Vos entrées personnalisées existantes restent accessibles à <strong>vous seul(e)</strong> — elles ne sont pas partagées avec l'équipe</li>
                  <li>Les nouvelles entrées partagées sont gérées par les <strong>administrateurs de l'équipe</strong></li>
                  <li>Si vous quittez l'équipe, vous retrouverez vos données personnelles intactes</li>
                </ul>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={confirmCompris}
                    onChange={e => setConfirmCompris(e.target.checked)}
                    style={{ marginTop: 2, accentColor: 'var(--primary)', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                    J'ai compris et j'accepte ces conditions
                  </span>
                </label>
              </div>
            )}

            <button
              onClick={accepterInvitation}
              disabled={loading || (avertissementPro && !confirmCompris)}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: (loading || (avertissementPro && !confirmCompris)) ? 'not-allowed' : 'pointer',
                opacity: (loading || (avertissementPro && !confirmCompris)) ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Traitement...' : "Accepter l'invitation"}
            </button>
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

        {statut === 'erreur-annulation' && (
          <>
            <i className="ti ti-credit-card-off" style={{ fontSize: 40, color: 'var(--accent-red)', display: 'block', marginBottom: 16 }}></i>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Impossible d'annuler l'abonnement</p>
            <p style={{ fontSize: 14, color: 'var(--text-hint)', marginBottom: 20 }}>
              L'annulation de votre abonnement Pro a échoué. Veuillez réessayer ou contacter le support si le problème persiste.
            </p>
            <button
              onClick={() => { setStatut('valide'); setLoading(false) }}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
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
