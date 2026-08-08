import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

export default function EquipeGestion() {
  const { teamId, roleEquipe, chargement, chargerProfil } = useProfil()
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
  const [erreurInvit, setErreurInvit] = useState('')
  const [confirmRevoquer, setConfirmRevoquer] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showTransfertModal, setShowTransfertModal] = useState(false)
  const [cibleTransfert, setCibleTransfert] = useState(null)
  const [transfertEnCours, setTransfertEnCours] = useState(false)
  const [erreurTransfert, setErreurTransfert] = useState('')
  const [userId, setUserId] = useState(null)
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

    const token = crypto.randomUUID()
    const { error } = await supabase.from('team_invitations').insert({
      team_id: teamId, email, role: roleInvit, invited_by: userId, token, status: 'pending',
    })
    if (error) return false

    const baseUrl = import.meta.env.VITE_APP_URL || 'https://adjuvet.app'
    const { error: fnError } = await supabase.functions.invoke('send-invitation', {
      body: { email, nomClinique: equipe?.nom || 'notre équipe', lien: `${baseUrl}/rejoindre?token=${token}`, emailInvite: email },
    })
    if (fnError) console.error('send-invitation error:', fnError)
    return true
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
      setTimeout(() => { setShowInviteModal(false); setMsgSucces('') }, 2000)
    } else {
      setErreurInvit(`${envoyes} envoyée${envoyes > 1 ? 's' : ''}, ${erreurs} échouée${erreurs > 1 ? 's' : ''}.`)
    }
    setEnvoiProgress(null)
    setEnvoi(false)
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
    setTransfertEnCours(false)
    await charger()
    if (chargerProfil) chargerProfil()
  }

  if (chargement || loading) return null

  if (roleEquipe !== 'admin' && roleEquipe !== 'proprietaire') {
    navigate('/equipe')
    return null
  }

  const labelRole = r => r === 'proprietaire' ? 'Propriétaire' : r === 'admin' ? 'Admin' : 'Membre'
  const couleurRole = r => r === 'proprietaire' ? 'var(--accent-gold)' : r === 'admin' ? 'var(--primary)' : 'var(--text-secondary)'
  const plein = equipe?.max_membres && membres.length >= equipe.max_membres

  return (
    <div className="abonnement-page">

      {/* Clinique */}
      {equipe && (
        <div className="abonnement-carte" style={{ padding: '14px 16px' }}>
          {editNomClinique ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={nouveauNomClinique}
                onChange={e => setNouveauNomClinique(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sauvegarderNomClinique(); if (e.key === 'Escape') setEditNomClinique(false) }}
                autoFocus
                style={{
                  flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px',
                  fontSize: 15, fontWeight: 700, background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none',
                }}
              />
              <button onClick={sauvegarderNomClinique} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                Sauvegarder
              </button>
              <button onClick={() => setEditNomClinique(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Clinique</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{equipe.nom}</p>
              </div>
              <button onClick={() => { setNouveauNomClinique(equipe.nom); setEditNomClinique(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: 16, padding: 4 }}>
                <i className="ti ti-pencil"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sièges */}
      {equipe?.max_membres && (
        <div className="abonnement-carte" style={{ borderColor: plein ? 'var(--accent-red)' : 'var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              <i className="ti ti-users" style={{ marginRight: 6 }}></i>Sièges utilisés
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: plein ? 'var(--accent-red)' : 'var(--primary)' }}>
              {membres.length} / {equipe.max_membres}
            </span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${Math.min(100, (membres.length / equipe.max_membres) * 100)}%`,
              background: plein ? 'var(--accent-red)' : 'var(--primary)',
              transition: 'width 0.3s',
            }} />
          </div>
          <p style={{ fontSize: 12, color: plein ? 'var(--accent-red)' : 'var(--text-hint)', margin: '8px 0 0' }}>
            {plein
              ? "Limite atteinte — augmentez le nombre de sièges pour inviter d'autres membres."
              : `${equipe.max_membres - membres.length} siège${equipe.max_membres - membres.length > 1 ? 's' : ''} disponible${equipe.max_membres - membres.length > 1 ? 's' : ''}`
            }
          </p>
          {plein && roleEquipe === 'proprietaire' && (
            <button
              onClick={() => navigate('/abonnement')}
              style={{ marginTop: 10, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <i className="ti ti-arrow-up-circle" style={{ marginRight: 5 }}></i>Augmenter les sièges
            </button>
          )}
        </div>
      )}

      {/* Membres */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
          Membres
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {membres.map(m => (
            <div key={m.id} className="abonnement-carte" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    {m.profiles?.nom || '—'}
                    {m.user_id === userId && <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 6 }}>(vous)</span>}
                  </p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: couleurRole(m.role) }}>{labelRole(m.role)}</span>
                </div>
                {m.role !== 'proprietaire' && m.user_id !== userId && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={m.role}
                      onChange={e => {
                        if (e.target.value === 'proprietaire') {
                          setCibleTransfert(m)
                          setShowTransfertModal(true)
                        } else {
                          changerRole(m.id, e.target.value)
                        }
                      }}
                      style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '5px 8px', fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--text)' }}
                    >
                      <option value="membre">Membre</option>
                      <option value="admin">Admin</option>
                      {roleEquipe === 'proprietaire' && (
                        <option value="proprietaire">Propriétaire</option>
                      )}
                    </select>
                    <button onClick={() => setConfirmRevoquer(m.id)} style={{ background: 'none', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Révoquer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations en attente */}
      {invitations.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
            Invitations en attente ({invitations.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invitations.map(inv => (
              <div key={inv.id} className="abonnement-carte" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, margin: 0 }}>{inv.email}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '2px 0 0' }}>{labelRole(inv.role)}</p>
                </div>
                <button onClick={() => annulerInvitation(inv.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: 13, fontWeight: 600 }}>
                  Annuler
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton ajouter */}
      <button
        className="abonnement-btn-abonner"
        onClick={() => plein ? navigate('/abonnement') : setShowInviteModal(true)}
        style={{ background: plein ? 'var(--text-hint)' : 'var(--primary)' }}
      >
        {plein
          ? <><i className="ti ti-lock"></i> Limite atteinte</>
          : <><i className="ti ti-user-plus"></i> Ajouter un membre</>
        }
      </button>

      {/* Modal invitation */}
      {showInviteModal && (
        <div className="popup-overlay" onClick={() => { setShowInviteModal(false); setEmailsInput(''); setErreurInvit(''); setMsgSucces('') }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Ajouter un membre</span>
              <button className="popup-close" onClick={() => { setShowInviteModal(false); setEmailsInput(''); setErreurInvit(''); setMsgSucces('') }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0 8px' }}>
              <textarea
                placeholder={'Courriel(s) — séparés par virgule, espace ou retour de ligne'}
                value={emailsInput}
                onChange={e => { setEmailsInput(e.target.value); setErreurInvit('') }}
                rows={3}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text)',
                  outline: 'none', resize: 'vertical', fontFamily: 'var(--font)', width: '100%', boxSizing: 'border-box',
                }}
              />

              {emailsParsed.length > 1 && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text)' }}
              >
                <option value="membre">Membre</option>
                <option value="admin">Admin</option>
              </select>

              {envoiProgress && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  <i className="ti ti-loader-2" style={{ marginRight: 6 }}></i>
                  Envoi en cours… {envoiProgress.envoyes + envoiProgress.erreurs} / {envoiProgress.total}
                </p>
              )}

              {erreurInvit && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FFEBEE', color: 'var(--accent-red)', fontSize: 13, fontWeight: 600 }}>
                  <i className="ti ti-alert-circle" style={{ marginRight: 6 }}></i>{erreurInvit}
                </div>
              )}

              {msgSucces && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#E8F5E9', color: '#388E3C', fontSize: 13, fontWeight: 600 }}>
                  <i className="ti ti-circle-check" style={{ marginRight: 6 }}></i>{msgSucces}
                </div>
              )}

              <button
                className="abonnement-btn-abonner"
                onClick={inviter}
                disabled={emailsParsed.length === 0 || envoi}
                style={{ marginTop: 4 }}
              >
                {envoi ? 'Envoi en cours…' : emailsParsed.length > 1 ? `Envoyer ${emailsParsed.length} invitations` : "Envoyer l'invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal transfert de propriété */}
      {showTransfertModal && cibleTransfert && (
        <div className="popup-overlay" onClick={() => { if (!transfertEnCours) { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') } }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Transférer la propriété</span>
              <button className="popup-close" onClick={() => { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') }} disabled={transfertEnCours}>✕</button>
            </div>

            <div style={{ padding: '8px 0 16px' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <i className="ti ti-arrows-exchange" style={{ fontSize: 36, color: 'var(--primary)', display: 'block', marginBottom: 8 }}></i>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
                  Transférer à {cibleTransfert.profiles?.nom}?
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  Vous deviendrez Admin. Cette action est irréversible.
                </p>
              </div>

              {/* Avertissement facturation */}
              <div style={{ background: 'rgba(244, 181, 44, 0.1)', border: '1px solid var(--accent-gold)', borderRadius: 10, padding: '12px 14px', marginBottom: erreurTransfert ? 12 : 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
                  <i className="ti ti-credit-card" style={{ marginRight: 6, color: 'var(--accent-gold)' }}></i>Attention — Facturation
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Le renouvellement sera chargé sur la <strong>carte de crédit actuellement enregistrée</strong> jusqu'à ce que <strong>{cibleTransfert.profiles?.nom}</strong> mette à jour ses informations de paiement dans <strong>Abonnement → Gérer</strong>.
                </p>
              </div>

              {erreurTransfert && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FFEBEE', color: 'var(--accent-red)', fontSize: 13, fontWeight: 600 }}>
                  <i className="ti ti-alert-circle" style={{ marginRight: 6 }}></i>{erreurTransfert}
                </div>
              )}
            </div>

            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => { setShowTransfertModal(false); setCibleTransfert(null); setErreurTransfert('') }} disabled={transfertEnCours}>
                Annuler
              </button>
              <button
                className="abonnement-btn-abonner"
                style={{ flex: 1, marginTop: 0 }}
                onClick={effectuerTransfert}
                disabled={transfertEnCours}
              >
                {transfertEnCours ? 'Transfert…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation révoquer */}
      {confirmRevoquer && (
        <div className="popup-overlay" onClick={() => setConfirmRevoquer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-user-x" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Révoquer cet accès?</p>
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
