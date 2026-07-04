import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

const COULEURS = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD0', '#E1BEE7', '#FFE0B2']

const SOUS_ONGLETS = [
  { id: 'notes', label: 'Notes perso', icone: 'ti-notes' },
  { id: 'babillard', label: 'Babillard', icone: 'ti-messages' },
  { id: 'taches', label: 'Tâches', icone: 'ti-checklist' },
]

// ─── NOTES PERSO ─────────────────────────────────────────
function NotesPerso() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes')
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)

  useEffect(() => { chargerNotes() }, [])

  async function chargerNotes() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  async function creerNote() {
    const { data: { user } } = await supabase.auth.getUser()
    const couleur = COULEURS[Math.floor(Math.random() * COULEURS.length)]
    const { data } = await supabase
      .from('notes')
      .insert({ user_id: user.id, titre: '', contenu: '', couleur })
      .select()
      .single()
    if (data) navigate(`/notes/${data.id}`)
  }

  async function supprimerNote(id) {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setShowConfirmSupprimer(null)
  }

  function apercu(contenu) {
    if (!contenu) return ''
    return contenu.length > 80 ? contenu.slice(0, 80) + '...' : contenu
  }

  const categories = ['Toutes', ...new Set(notes.map(n => n.categorie).filter(Boolean))]
  const notesFiltrees = filtreCategorie === 'Toutes'
    ? notes
    : notes.filter(n => n.categorie === filtreCategorie)

  return (
    <div className="page-calculateurs">
      <div className="calc-form">
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFiltreCategorie(c)} style={{
                fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: filtreCategorie === c ? 'var(--primary)' : 'var(--bg-card)',
                color: filtreCategorie === c ? '#fff' : 'var(--text-secondary)',
              }}>{c}</button>
            ))}
          </div>
        )}

        {loading && <p style={{ color: 'var(--text-hint)', fontSize: 14 }}>Chargement...</p>}

        {!loading && notesFiltrees.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <i className="ti ti-notes" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune note pour l'instant.</p>
          </div>
        )}

        <div className="notes-grille">
          {notesFiltrees.map(note => (
            <div key={note.id} className="note-carte" style={{ background: note.couleur || '#FFF9C4' }}>
              <button className="note-carte-supprimer" onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(note.id) }}>
                <i className="ti ti-x"></i>
              </button>
              <div className="note-carte-contenu" onClick={() => navigate(`/notes/${note.id}`)}>
                {note.titre && <p className="note-carte-titre">{note.titre}</p>}
                {note.categorie && <span className="note-carte-categorie">{note.categorie}</span>}
                <p className="note-carte-apercu">{apercu(note.contenu)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-fab" onClick={creerNote}>+</button>

      {showConfirmSupprimer && (
        <div className="popup-overlay" onClick={() => setShowConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Supprimer cette note?</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cette action est irréversible.</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerNote(showConfirmSupprimer)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── BABILLARD ────────────────────────────────────────────
function Babillard() {
  const { teamId } = useProfil()
  const [messages, setMessages] = useState([])
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [texte, setTexte] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [userId, setUserId] = useState(null)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [tagPos, setTagPos] = useState(0)
  const textareaRef = useRef(null)
  const [confirmSupprimer, setConfirmSupprimer] = useState(null)

  useEffect(() => {
    if (!teamId) return
    charger()

    const channel = supabase
      .channel('babillard-' + teamId)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'babillard_messages',
        filter: `team_id=eq.${teamId}`
      }, () => charger())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [teamId])

  async function charger() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)

    const { data: msgs } = await supabase
      .from('babillard_messages')
      .select('*, profiles(nom)')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: mems } = await supabase
      .from('team_members')
      .select('user_id, profiles(nom)')
      .eq('team_id', teamId)

    setMessages(msgs || [])
    setMembres(mems || [])
    setLoading(false)
  }

  function handleTexteChange(e) {
    const val = e.target.value
    setTexte(val)
    const pos = e.target.selectionStart
    const avant = val.slice(0, pos)
    const dernier = avant.lastIndexOf('@')
    if (dernier !== -1 && !avant.slice(dernier).includes(' ')) {
      setShowTagMenu(true)
      setTagPos(dernier)
    } else {
      setShowTagMenu(false)
    }
  }

  function insererTag(nom) {
    const avant = texte.slice(0, tagPos)
    const apres = texte.slice(textareaRef.current.selectionStart)
    const nouveau = avant + '@' + nom + ' ' + apres
    setTexte(nouveau)
    setShowTagMenu(false)
    textareaRef.current.focus()
  }

  function membresFiltrés() {
    const recherche = texte.slice(tagPos + 1, textareaRef.current?.selectionStart || texte.length).toLowerCase()
    return membres.filter(m => m.profiles?.nom?.toLowerCase().includes(recherche))
  }

  async function envoyer() {
    if (!texte.trim() || envoi) return
    setEnvoi(true)
    const { data: { user } } = await supabase.auth.getUser()

    const tags = [...texte.matchAll(/@([\w\s]+?)(?=\s|$)/g)].map(m => m[1].trim())
    const taggedIds = membres
      .filter(m => tags.some(t => m.profiles?.nom?.toLowerCase() === t.toLowerCase()))
      .map(m => m.user_id)

    await supabase.from('babillard_messages').insert({
      team_id: teamId,
      user_id: user.id,
      contenu: texte.trim(),
      tags: taggedIds,
    })

    if (taggedIds.length > 0) {
      const notifs = taggedIds.map(uid => ({
        user_id: uid,
        type: 'tag_babillard',
        message: `${user.email} vous a tagué dans le babillard`,
        reference_type: 'babillard',
      }))
      await supabase.from('notifications').insert(notifs)
    }

    setTexte('')
    setEnvoi(false)
  }

  function formatDate(iso) {
    const d = new Date(iso)
    const maintenant = new Date()
    const diff = (maintenant - d) / 1000
    if (diff < 60) return 'À l\'instant'
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
    return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })
  }

  function renderContenu(contenu) {
    return contenu.replace(/@([\w\s]+?)(?=\s|$)/g, '<span style="color:var(--primary);font-weight:600">@$1</span>')
  }

  async function supprimerMessage(id) {
    await supabase.from('babillard_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
    setConfirmSupprimer(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column-reverse', gap: 12 }}>
        {loading && <p style={{ color: 'var(--text-hint)', fontSize: 14, textAlign: 'center' }}>Chargement...</p>}
        {!loading && messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <i className="ti ti-messages" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucun message. Soyez le premier!</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: '10px 14px',
            border: '1px solid var(--border)',
            alignSelf: msg.user_id === userId ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                {msg.profiles?.nom || 'Membre'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{formatDate(msg.created_at)}</span>
                {msg.user_id === userId && (
                  <button onClick={() => setConfirmSupprimer(msg.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'var(--text-hint)', fontSize: 13,
                  }}>
                    <i className="ti ti-x"></i>
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: renderContenu(msg.contenu) }} />
          </div>
        ))}
      </div>

      {/* Tag menu */}
      {showTagMenu && membresFiltrés().length > 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
          margin: '0 16px', padding: 6,
        }}>
          {membresFiltrés().map(m => (
            <button key={m.user_id} onClick={() => insererTag(m.profiles?.nom)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
              color: 'var(--text-primary)', borderRadius: 8,
            }}>
              @{m.profiles?.nom}
            </button>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div style={{
        padding: '10px 16px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)', display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={texte}
          onChange={handleTexteChange}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyer() } }}
          placeholder="Message… (@ pour taguer)"
          rows={2}
          style={{
            flex: 1, resize: 'none', border: '1px solid var(--border)', borderRadius: 10,
            padding: '10px 12px', fontSize: 14, background: 'var(--bg-secondary)',
            color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button onClick={envoyer} disabled={!texte.trim() || envoi} style={{
          background: 'var(--primary)', border: 'none', borderRadius: 10, padding: '10px 14px',
          color: '#fff', cursor: texte.trim() ? 'pointer' : 'not-allowed', opacity: texte.trim() ? 1 : 0.5,
          fontSize: 18,
        }}>
          <i className="ti ti-send"></i>
        </button>
      </div>

      {confirmSupprimer && (
        <div className="popup-overlay" onClick={() => setConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Supprimer ce message?</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmSupprimer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerMessage(confirmSupprimer)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TÂCHES ───────────────────────────────────────────────
const STATUTS = [
  { id: 'todo', label: 'À faire', couleur: 'var(--text-hint)', bg: 'var(--bg-secondary)' },
  { id: 'en_cours', label: 'En cours', couleur: '#1976D2', bg: '#E3F2FD' },
  { id: 'termine', label: 'Terminé', couleur: '#388E3C', bg: '#E8F5E9' },
]

function Taches() {
  const { teamId } = useProfil()
  const [taches, setTaches] = useState([])
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmSupprimer, setConfirmSupprimer] = useState(null)
  const [form, setForm] = useState({ titre: '', description: '', assignee_id: '', date_echeance: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!teamId) return
    charger()

    const channel = supabase
      .channel('taches-' + teamId)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'taches',
        filter: `team_id=eq.${teamId}`
      }, () => charger())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [teamId])

  async function charger() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)

    const { data: t } = await supabase
      .from('taches')
      .select('*, profiles!taches_created_by_fkey(nom), assignee:profiles!taches_assignee_id_fkey(nom), modifie_par:profiles!taches_modifie_par_fkey(nom)')
      .eq('team_id', teamId)
      .order('date_echeance', { ascending: true, nullsFirst: false })

    const { data: mems } = await supabase
      .from('team_members')
      .select('user_id, profiles(nom)')
      .eq('team_id', teamId)

    setTaches(t || [])
    setMembres(mems || [])
    setLoading(false)
  }

  async function changerStatut(tache, nouveauStatut) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('taches').update({
      statut: nouveauStatut,
      modifie_par: user.id,
      modifie_le: new Date().toISOString(),
    }).eq('id', tache.id)
    charger()
  }

  async function creerTache() {
    if (!form.titre.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('taches').insert({
      team_id: teamId,
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      assignee_id: form.assignee_id || null,
      date_echeance: form.date_echeance || null,
      statut: 'todo',
      created_by: user.id,
      modifie_par: user.id,
      modifie_le: new Date().toISOString(),
    })
    setForm({ titre: '', description: '', assignee_id: '', date_echeance: '' })
    setShowForm(false)
    setSaving(false)
  }

  async function supprimerTache(id) {
    await supabase.from('taches').delete().eq('id', id)
    setTaches(prev => prev.filter(t => t.id !== id))
    setConfirmSupprimer(null)
  }

  function formatDate(iso) {
    if (!iso) return null
    const d = new Date(iso)
    const auj = new Date()
    auj.setHours(0, 0, 0, 0)
    const diff = Math.floor((new Date(iso).setHours(0,0,0,0) - auj) / 86400000)
    if (diff < 0) return { texte: 'En retard', rouge: true }
    if (diff === 0) return { texte: "Aujourd'hui", orange: true }
    if (diff === 1) return { texte: 'Demain', orange: true }
    return { texte: d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' }) }
  }

  const tachesParStatut = STATUTS.map(s => ({
    ...s,
    items: taches.filter(t => t.statut === s.id),
  }))

  return (
    <div className="page-calculateurs">
      <div className="calc-form">
        {loading && <p style={{ color: 'var(--text-hint)', fontSize: 14 }}>Chargement...</p>}

        {tachesParStatut.map(groupe => groupe.items.length > 0 && (
          <div key={groupe.id} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: groupe.couleur, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {groupe.label} ({groupe.items.length})
            </p>
            {groupe.items.map(tache => {
              const echeance = formatDate(tache.date_echeance)
              return (
                <div key={tache.id} style={{
                  background: 'var(--bg-card)', borderRadius: 12, padding: '12px 14px',
                  border: '1px solid var(--border)', marginBottom: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, flex: 1,
                      textDecoration: tache.statut === 'termine' ? 'line-through' : 'none',
                      opacity: tache.statut === 'termine' ? 0.6 : 1,
                    }}>
                      {tache.titre}
                    </p>
                    <button onClick={() => setConfirmSupprimer(tache.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: 14, padding: 0,
                    }}>
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>

                  {tache.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {tache.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Statut chips */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {STATUTS.map(s => (
                        <button key={s.id} onClick={() => changerStatut(tache, s.id)} style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                          border: 'none', cursor: 'pointer',
                          background: tache.statut === s.id ? s.bg : 'var(--bg-secondary)',
                          color: tache.statut === s.id ? s.couleur : 'var(--text-hint)',
                        }}>
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    {tache.assignee?.nom && (
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        <i className="ti ti-user" style={{ marginRight: 3 }}></i>{tache.assignee.nom}
                      </span>
                    )}

                    {echeance && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: echeance.rouge ? 'var(--accent-red)' : echeance.orange ? '#F57C00' : 'var(--text-hint)',
                      }}>
                        <i className="ti ti-calendar" style={{ marginRight: 3 }}></i>{echeance.texte}
                      </span>
                    )}
                  </div>

                  {tache.modifie_par && tache.modifie_le && (
                    <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: '6px 0 0' }}>
                      Modifié par {tache.modifie_par?.nom || 'un membre'} · {new Date(tache.modifie_le).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {!loading && taches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <i className="ti ti-checklist" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune tâche pour l'instant.</p>
          </div>
        )}
      </div>

      <button className="btn-fab" onClick={() => setShowForm(true)}>+</button>

      {/* Formulaire nouvelle tâche */}
      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Nouvelle tâche</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Titre de la tâche *"
                value={form.titre}
                onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <textarea
                placeholder="Description (optionnel)"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  outline: 'none', resize: 'none', fontFamily: 'inherit',
                }}
              />
              <select
                value={form.assignee_id}
                onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                }}
              >
                <option value="">Assigner à… (optionnel)</option>
                {membres.map(m => (
                  <option key={m.user_id} value={m.user_id}>{m.profiles?.nom}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.date_echeance}
                onChange={e => setForm(f => ({ ...f, date_echeance: e.target.value }))}
                style={{
                  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="popup-actions-centrees" style={{ marginTop: 20 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Annuler</button>
              <button
                style={{
                  flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: form.titre.trim() ? 'pointer' : 'not-allowed', opacity: form.titre.trim() ? 1 : 0.5,
                }}
                onClick={creerTache}
                disabled={!form.titre.trim() || saving}
              >
                {saving ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmSupprimer && (
        <div className="popup-overlay" onClick={() => setConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Supprimer cette tâche?</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmSupprimer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerTache(confirmSupprimer)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PAGE ÉQUIPE ──────────────────────────────────────────
export default function Equipe() {
  const [sousOnglet, setSousOnglet] = useState('notes')
  const { estEquipe, chargement, roleEquipe } = useProfil()
  const navigate = useNavigate()

  if (chargement) return null

  if (!estEquipe) {
    return (
      <div className="page-calculateurs">
        <div className="calc-form" style={{ textAlign: 'center', padding: '48px 0' }}>
          <i className="ti ti-lock" style={{ fontSize: 48, color: 'var(--accent-gold)', display: 'block', marginBottom: 14 }}></i>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Forfait Équipe requis</p>
          <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Cette section est réservée au forfait Équipe.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Barre supérieure avec sous-onglets + bouton gestion */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1 }}>
          {SOUS_ONGLETS.map(o => (
            <button
              key={o.id}
              onClick={() => setSousOnglet(o.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 4px', fontSize: 11, fontWeight: 600, border: 'none',
                borderBottom: sousOnglet === o.id ? '2px solid var(--primary)' : '2px solid transparent',
                background: 'none',
                color: sousOnglet === o.id ? 'var(--primary)' : 'var(--text-hint)',
                cursor: 'pointer',
              }}
            >
              <i className={`ti ${o.icone}`} style={{ fontSize: 18 }}></i>
              {o.label}
            </button>
          ))}
        </div>
        {(roleEquipe === 'admin' || roleEquipe === 'proprietaire') && (
          <button onClick={() => navigate('/equipe/gestion')} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px',
            color: 'var(--text-hint)', fontSize: 20,
          }}>
            <i className="ti ti-settings"></i>
          </button>
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {sousOnglet === 'notes' && <NotesPerso />}
        {sousOnglet === 'babillard' && <Babillard />}
        {sousOnglet === 'taches' && <Taches />}
      </div>
    </div>
  )
}
