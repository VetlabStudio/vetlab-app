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
  const [emailsInput, setEmailsInput] = useState('')
  const [roleInvit, setRoleInvit] = useState('membre')
  const [envoi, setEnvoi] = useState(false)
  const [envoiProgress, setEnvoiProgress] = useState(null)
  const [msgSucces, setMsgSucces] = useState('')
  const [confirmRevoquer, setConfirmRevoquer] = useState(null)
  const [userId, setUserId] = useState(null)
  const [erreurInvit, setErreurInvit] = useState('')
  const [editNomClinique, setEditNomClinique] = useState(false)
  const [nouveauNomClinique, setNouveauNomClinique] = useState('')

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

  function parseEmails(text) {
    return [...new Set(
      text.split(/[\s,;]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    )]
  }

  const emailsParsed = parseEmails(emailsInput)
  const siegesRestants = equipe?.max_membres ? equipe.max_membres - membres.length : Infinity

  async function inviterUn(email) {
    await supabase.from('team_invitations')
      .delete()
      .eq('team_id', teamId)
      .eq('email', email)
      .neq('status', 'pending')

    const token = crypto.randomUUID()
    const { error } = await supabase.from('team_invitations').insert({
      team_id: teamId, email, role: roleInvit, invited_by: userId, token, status: 'pending',
    })
    if (error) return false

    const baseUrl = import.meta.env.VITE_APP_URL || 'https://adjuvet.app'
    const { error: fnError } = await supabase.functions.invoke('send-invitation', {
      body: { email, nomClinique: equipe?.nom || 'notre équipe', lien: `${baseUrl}/rejoindre?token=${token}`, emailInvite: email },
    })
    return !fnError
  }

  async function inviter() {
    if (emailsParsed.length === 0 || envoi) return
    setErreurInvit('')

    if (equipe?.max_membres && emailsParsed.length > siegesRestants) {
      setErreurInvit(`Seulement ${siegesRestants} siège(s) disponible(s) pour ${emailsParsed.length} invitations.`)
      return
    }

    setEnvoi(true)
    let envoyes = 0
    let erreurs = 0
    setEnvoiProgress({ total: emailsParsed.length, envoyes: 0, erreurs: 0 })

    for (const email of emailsParsed) {
      const ok = await inviterUn(email)
      if (ok) envoyes++
      else erreurs++
      setEnvoiProgress({ total: emailsParsed.length, envoyes, erreurs })
    }

    setEmailsInput('')
    charger()
    if (erreurs === 0) {
      setMsgSucces(`${envoyes} invitation${envoyes > 1 ? 's' : ''} envoyée${envoyes > 1 ? 's' : ''} avec succès.`)
    } else {
      setErreurInvit(`${envoyes} envoyée${envoyes > 1 ? 's' : ''}, ${erreurs} échouée${erreurs > 1 ? 's' : ''}.`)
    }
    setEnvoiProgress(null)
    setEnvoi(false)
    setTimeout(() => { setMsgSucces(''); setErreurInvit('') }, 6000)
  }

  async function annulerInvitation(id) {
    await supabase.from('team_invitations').delete().eq('id', id)
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  async function revoquerMembre(memberId) {
    const membre = membres.find(m => m.id === memberId)
    if (!membre) return
    await supabase.rpc('revoquer_membre', {
      membre_user_id: membre.user_id,
      equipe_id_param: teamId,
    })
    setMembres(prev => prev.filter(m => m.id !== memberId))
    setConfirmRevoquer(null)
  }

  async function sauvegarderNomClinique() {
    if (!nouveauNomClinique.trim()) return
    await supabase.from('equipes').update({ nom: nouveauNomClinique.trim() }).eq('id', teamId)
    setEquipe(prev => ({ ...prev, nom: nouveauNomClinique.trim() }))
    setEditNomClinique(false)
  }

  async function changerRole(memberId, nouveauRole) {
    const membre = membres.find(m => m.id === memberId)
    if (!membre) return
    await supabase.rpc('changer_role_membre', {
      membre_user_id: membre.user_id,
      equipe_id_param: teamId,
      nouveau_role: nouveauRole,
    })
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

            {editNomClinique ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input
                  value={nouveauNomClinique}
                  onChange={e => setNouveauNomClinique(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sauvegarderNomClinique(); if (e.key === 'Escape') setEditNomClinique(false) }}
                  autoFocus
                  style={{
                    flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px',
                    fontSize: 16, fontWeight: 700, background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none',
                  }}
                />
                <button onClick={sauvegarderNomClinique} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Sauvegarder</button>
                <button onClick={() => setEditNomClinique(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: 18 }}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{equipe.nom}</p>
                <button onClick={() => { setNouveauNomClinique(equipe.nom); setEditNomClinique(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: 15, padding: 0 }}>
                  <i className="ti ti-pencil"></i>
                </button>
              </div>
            )}

            {/* Compteur de sièges */}
            {equipe.max_membres && (
              <div style={{
                background: membres.length >= equipe.max_membres ? 'rgba(244,67,54,0.07)' : 'var(--bg-secondary)',
                border: `1px solid ${membres.length >= equipe.max_membres ? 'var(--accent-red)' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px', marginBottom: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    <i className="ti ti-users" style={{ marginRight: 6 }}></i>Sièges utilisés
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: membres.length >= equipe.max_membres ? 'var(--accent-red)' : 'var(--primary)' }}>
                    {membres.length} / {equipe.max_membres}
                  </span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${Math.min(100, (membres.length / equipe.max_membres) * 100)}%`,
                    background: membres.length >= equipe.max_membres ? 'var(--accent-red)' : 'var(--primary)',
                    transition: 'width 0.3s',
                  }} />
                </div>
                {membres.length < equipe.max_membres ? (
                  <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '6px 0 0' }}>
                    {equipe.max_membres - membres.length} siège{equipe.max_membres - membres.length > 1 ? 's' : ''} disponible{equipe.max_membres - membres.length > 1 ? 's' : ''}
                  </p>
                ) : roleEquipe === 'proprietaire' && (
                  <button
                    onClick={() => navigate('/profil')}
                    style={{
                      marginTop: 8, background: 'var(--primary)', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <i className="ti ti-arrow-up-circle" style={{ marginRight: 5 }}></i>Augmenter les sièges
                  </button>
                )}
              </div>
            )}

            {/* Instructions */}
            {roleEquipe === 'proprietaire' && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: 13 }}>
                  <i className="ti ti-info-circle" style={{ marginRight: 5 }}></i>Gestion des membres
                </p>
                <p style={{ margin: 0 }}>
                  • <strong>Ajouter</strong> — envoyez une invitation par courriel ci-dessous.<br />
                  • <strong>Retirer</strong> — cliquez sur <em>Révoquer</em> à côté du membre.<br />
                  • <strong>Changer un rôle</strong> — menu déroulant à côté du membre.<br />
                  • <strong>Plus de sièges</strong> —{' '}
                  <span onClick={() => navigate('/profil')} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                    Mon profil → Modifier les sièges
                  </span>.
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 24, width: '100%' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Inviter un membre</p>

          {equipe?.max_membres && membres.length >= equipe.max_membres ? (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <i className="ti ti-lock" style={{ fontSize: 20, color: 'var(--text-hint)', display: 'block', marginBottom: 6 }}></i>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                Limite de <strong>{equipe.max_membres} sièges</strong> atteinte.
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '4px 0 8px' }}>
                Pour ajouter des membres, augmentez le nombre de sièges dans votre forfait.
              </p>
              {roleEquipe === 'proprietaire' && (
                <button onClick={() => navigate('/profil')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  <i className="ti ti-arrow-up-circle" style={{ marginRight: 5 }}></i>Augmenter les sièges
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                placeholder={'Un ou plusieurs courriels, séparés par virgule, espace ou retour de ligne :\njean@clinique.com, marie@clinique.com'}
                value={emailsInput}
                onChange={e => { setEmailsInput(e.target.value); setErreurInvit('') }}
                rows={3}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  outline: 'none', resize: 'vertical', fontFamily: 'var(--font)',
                }}
              />
              {emailsParsed.length > 1 && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {emailsParsed.length} courriels détectés
                  </p>
                  {emailsParsed.map(e => (
                    <p key={e} style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0' }}>
                      <i className="ti ti-mail" style={{ marginRight: 6, color: 'var(--primary)' }}></i>{e}
                    </p>
                  ))}
                </div>
              )}
              <select
                value={roleInvit}
                onChange={e => setRoleInvit(e.target.value)}
                style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="membre">Membre</option>
                <option value="admin">Admin</option>
              </select>
              {envoiProgress && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <i className="ti ti-loader-2" style={{ marginRight: 6 }}></i>
                  Envoi en cours… {envoiProgress.envoyes + envoiProgress.erreurs} / {envoiProgress.total}
                </div>
              )}
              <button
                onClick={inviter}
                disabled={emailsParsed.length === 0 || envoi}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: emailsParsed.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: emailsParsed.length > 0 ? 1 : 0.5,
                }}
              >
                {envoi ? 'Envoi en cours…' : emailsParsed.length > 1 ? `Envoyer ${emailsParsed.length} invitations` : "Envoyer l'invitation"}
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
