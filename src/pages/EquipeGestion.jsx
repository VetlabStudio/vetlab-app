import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

export default function EquipeGestion() {
  const { teamId, roleEquipe, chargement } = useProfil()
  const navigate = useNavigate()
  const [membres, setMembres] = useState([])
  const [invitations, setInvitations] = useState([])
  const [equipe, setEquipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emailInvit, setEmailInvit] = useState('')
  const [roleInvit, setRoleInvit] = useState('membre')
  const [envoi, setEnvoi] = useState(false)
  const [msgSucces, setMsgSucces] = useState('')
  const [confirmRevoquer, setConfirmRevoquer] = useState(null)
  const [userId, setUserId] = useState(null)
  const [erreurInvit, setErreurInvit] = useState('')

  useEffect(() => {
    if (!teamId) return
    charger()
  }, [teamId])

  async function charger() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)

    const { data: eq } = await supabase
      .from('equipes')
      .select('*')
      .eq('id', teamId)
      .single()

    const { data: mems } = await supabase
      .from('membres_equipe')
      .select('*, profiles(nom)')
      .eq('equipe_id', teamId)

    const { data: invits } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    setEquipe(eq)
    setMembres(mems || [])
    setInvitations(invits || [])
    setLoading(false)
  }

  async function inviter() {
    if (!emailInvit.trim() || envoi) return
    setErreurInvit('')

    if (equipe && membres.length >= equipe.max_membres) {
      setErreurInvit(`Limite de ${equipe.max_membres} sièges atteinte. Mettez à niveau votre forfait pour ajouter des membres.`)
      return
    }

    setEnvoi(true)
    const token = crypto.randomUUID()
    const { error } = await supabase.from('team_invitations').insert({
      team_id: teamId,
      email: emailInvit.trim().toLowerCase(),
      role: roleInvit,
      invited_by: userId,
      token,
      status: 'pending',
    })

    if (!error) {
      const lien = `${window.location.origin}/rejoindre?token=${token}`
      const nomClinique = equipe?.nom || 'notre équipe'
      const sujet = encodeURIComponent(`Invitation à rejoindre ${nomClinique} sur Adjuvet`)
      const corps = encodeURIComponent(
        `Bonjour,\n\nVous avez été invité(e) à rejoindre ${nomClinique} sur l'application Adjuvet.\n\nCliquez sur le lien ci-dessous pour accepter l'invitation :\n${lien}\n\nÀ bientôt!`
      )
      window.open(`mailto:${emailInvit.trim()}?subject=${sujet}&body=${corps}`)

      setMsgSucces(`Invitation créée — votre app courriel devrait s'ouvrir.`)
      setEmailInvit('')
      setRoleInvit('membre')
      charger()
      setTimeout(() => setMsgSucces(''), 6000)
    }
    setEnvoi(false)
  }

  async function annulerInvitation(id) {
    await supabase.from('team_invitations').update({ status: 'expired' }).eq('id', id)
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  async function revoquerMembre(memberId) {
    await supabase.from('membres_equipe').delete().eq('id', memberId)
    const membre = membres.find(m => m.id === memberId)
    if (membre) {
      await supabase.from('profiles').update({ plan: 'free', equipe_id: null, role: null }).eq('id', membre.user_id)
    }
    setMembres(prev => prev.filter(m => m.id !== memberId))
    setConfirmRevoquer(null)
  }

  async function changerRole(memberId, nouveauRole) {
    await supabase.from('membres_equipe').update({ role: nouveauRole }).eq('id', memberId)
    const membre = membres.find(m => m.id === memberId)
    if (membre) {
      await supabase.from('profiles').update({ role: nouveauRole }).eq('id', membre.user_id)
    }
    setMembres(prev => prev.map(m => m.id === memberId ? { ...m, role: nouveauRole } : m))
  }

  if (chargement || loading) return null

  if (roleEquipe !== 'admin' && roleEquipe !== 'proprietaire') {
    navigate('/equipe')
    return null
  }

  const labelRole = r => r === 'proprietaire' ? 'Propriétaire' : r === 'admin' ? 'Admin' : 'Membre'
  const couleurRole = r => r === 'proprietaire' ? 'var(--accent-gold)' : r === 'admin' ? 'var(--primary)' : 'var(--text-secondary)'

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {equipe && (
          <div style={{ marginBottom: 24, width: '100%' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Clinique</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{equipe.nom}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{membres.length} / {equipe.max_membres || '∞'} membres</p>
          </div>
        )}

        <div style={{ marginBottom: 24, width: '100%' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Inviter un membre</p>

          {equipe?.max_membres && membres.length >= equipe.max_membres ? (
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', textAlign: 'center',
            }}>
              <i className="ti ti-lock" style={{ fontSize: 20, color: 'var(--text-hint)', display: 'block', marginBottom: 6 }}></i>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                Limite de <strong>{equipe.max_membres} sièges</strong> atteinte.
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '4px 0 0' }}>
                Mettez à niveau votre forfait pour ajouter des membres.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="Adresse courriel"
                value={emailInvit}
                onChange={e => { setEmailInvit(e.target.value); setErreurInvit('') }}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none',
                }}
              />
              <select
                value={roleInvit}
                onChange={e => setRoleInvit(e.target.value)}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                }}
              >
                <option value="membre">Membre</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={inviter}
                disabled={!emailInvit.trim() || envoi}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: emailInvit.trim() ? 'pointer' : 'not-allowed',
                  opacity: emailInvit.trim() ? 1 : 0.5,
                }}
              >
                {envoi ? 'Envoi...' : "Envoyer l'invitation"}
              </button>
            </div>
          )}

          {erreurInvit && (
            <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: '#FFEBEE', color: 'var(--accent-red)', fontSize: 13, fontWeight: 600 }}>
              <i className="ti ti-alert-circle" style={{ marginRight: 6 }}></i>{erreurInvit}
            </div>
          )}
          {msgSucces && (
            <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: '#E8F5E9', color: '#388E3C', fontSize: 13, fontWeight: 600 }}>
              <i className="ti ti-circle-check" style={{ marginRight: 6 }}></i>{msgSucces}
            </div>
          )}
        </div>

        {invitations.length > 0 && (
          <div style={{ marginBottom: 24, width: '100%' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Invitations en attente ({invitations.length})
            </p>
            {invitations.map(inv => (
              <div key={inv.id} style={{
                background: 'var(--bg-card)', borderRadius: 12, padding: '12px 14px',
                border: '1px solid var(--border)', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{inv.email}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '2px 0 0' }}>{labelRole(inv.role)}</p>
                </div>
                <button onClick={() => annulerInvitation(inv.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: 13, fontWeight: 600 }}>
                  Annuler
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ width: '100%' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Membres</p>
          {membres.map(m => (
            <div key={m.id} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {m.profiles?.nom || '—'}
                    {m.user_id === userId && <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 6 }}>(vous)</span>}
                  </p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: couleurRole(m.role) }}>{labelRole(m.role)}</span>
                </div>
                {m.role !== 'proprietaire' && m.user_id !== userId && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={m.role}
                      onChange={e => changerRole(m.id, e.target.value)}
                      style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="membre">Membre</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => setConfirmRevoquer(m.id)} style={{ background: 'none', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Révoquer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmRevoquer && (
        <div className="popup-overlay" onClick={() => setConfirmRevoquer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-user-x" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Révoquer cet accès?</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Ce membre perdra l'accès au forfait Équipe.</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmRevoquer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => revoquerMembre(confirmRevoquer)}>Révoquer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
