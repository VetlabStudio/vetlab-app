import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes')
  const [showForm, setShowForm] = useState(false)
  const [noteActive, setNoteActive] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [confirmSupprimer, setConfirmSupprimer] = useState(null)
  const [form, setForm] = useState({ titre: '', contenu: '', couleur: COULEURS[0], categorie: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { chargerNotes() }, [])

  async function chargerNotes() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('notes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  async function creerNote() {
    if (!form.contenu.trim() && !form.titre.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('notes').insert({
      user_id: user.id,
      titre: form.titre.trim() || null,
      contenu: form.contenu.trim(),
      couleur: form.couleur,
      categorie: form.categorie.trim() || null,
    }).select().single()
    if (data) setNotes(prev => [data, ...prev])
    setForm({ titre: '', contenu: '', couleur: COULEURS[0], categorie: '' })
    setShowForm(false)
    setSaving(false)
  }

  function ouvrirEdit(note) {
    setNoteActive(note)
    setEditForm(null)
  }

  function passerEnEdition(note) {
    setEditForm({ titre: note.titre || '', contenu: note.contenu || '', couleur: note.couleur || COULEURS[0], categorie: note.categorie || '' })
  }

  async function sauvegarderEdit() {
    setSaving(true)
    await supabase.from('notes').update({
      titre: editForm.titre.trim() || null,
      contenu: editForm.contenu.trim(),
      couleur: editForm.couleur,
      categorie: editForm.categorie.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq('id', noteActive.id)
    setNotes(prev => prev.map(n => n.id === noteActive.id ? { ...n, ...editForm } : n))
    setNoteActive(null)
    setEditForm(null)
    setSaving(false)
  }

  async function supprimerNote(id) {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setConfirmSupprimer(null)
    setNoteActive(null)
    setEditForm(null)
  }

  const inputStyle = {
    border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
    fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const categories = ['Toutes', ...new Set(notes.map(n => n.categorie).filter(Boolean))]
  const notesFiltrees = filtreCategorie === 'Toutes' ? notes : notes.filter(n => n.categorie === filtreCategorie)

  function PopupNoteForm({ titre: titrePop, valeurs, setValeurs, onSauvegarder, onAnnuler, onSupprimer, labelBtn }) {
    return (
      <div className="popup-overlay" onClick={onAnnuler}>
        <div className="popup-card" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{titrePop}</p>
            {onSupprimer && (
              <button onClick={onSupprimer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: 18 }}>
                <i className="ti ti-trash"></i>
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input placeholder="Titre (optionnel)" value={valeurs.titre} onChange={e => setValeurs(v => ({ ...v, titre: e.target.value }))} style={inputStyle} />
            <textarea
              placeholder="Contenu…"
              value={valeurs.contenu}
              onChange={e => setValeurs(v => ({ ...v, contenu: e.target.value }))}
              rows={5}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
            />
            <input
              placeholder="Catégorie (optionnel)"
              value={valeurs.categorie}
              onChange={e => setValeurs(v => ({ ...v, categorie: e.target.value }))}
              style={inputStyle}
              list="notes-perso-cats"
            />
            <datalist id="notes-perso-cats">
              {categories.filter(c => c !== 'Toutes').map(c => <option key={c} value={c} />)}
            </datalist>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>Couleur :</span>
              {COULEURS.map(c => (
                <button key={c} onClick={() => setValeurs(v => ({ ...v, couleur: c }))} style={{
                  width: 24, height: 24, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                  outline: valeurs.couleur === c ? '2px solid var(--primary)' : 'none', outlineOffset: 2,
                }} />
              ))}
            </div>
          </div>
          <div className="popup-actions-centrees" style={{ marginTop: 16 }}>
            <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={onAnnuler}>Annuler</button>
            <button
              style={{
                flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                cursor: (valeurs.contenu.trim() || valeurs.titre.trim()) ? 'pointer' : 'not-allowed',
                opacity: (valeurs.contenu.trim() || valeurs.titre.trim()) ? 1 : 0.5,
              }}
              onClick={onSauvegarder}
              disabled={!valeurs.contenu.trim() && !valeurs.titre.trim() || saving}
            >
              {saving ? '...' : labelBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      {categories.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
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

      {!loading && notes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <i className="ti ti-notes" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
          <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune note pour l'instant.</p>
        </div>
      )}

      <div className="notes-grille" style={{ width: '100%' }}>
        {notesFiltrees.map(note => (
          <div key={note.id} className="note-tuile" style={{ background: note.couleur || '#FFF9C4', cursor: 'pointer' }} onClick={() => ouvrirEdit(note)}>
            <div className="note-tuile-header">
              <p className="note-tuile-titre">{note.titre || '(sans titre)'}</p>
            </div>
            {note.categorie && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.1)', color: '#444', alignSelf: 'flex-start' }}>
                {note.categorie}
              </span>
            )}
            <p className="note-tuile-apercu" style={{ flex: 1 }}>
              {note.contenu?.length > 80 ? note.contenu.slice(0, 80) + '...' : note.contenu}
            </p>
          </div>
        ))}
      </div>

      <button className="btn-fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <PopupNoteForm
          titrePop="Nouvelle note"
          valeurs={form}
          setValeurs={setForm}
          onSauvegarder={creerNote}
          onAnnuler={() => setShowForm(false)}
          labelBtn="Créer"
        />
      )}

      {/* Popup: lecture */}
      {noteActive && !editForm && (
        <div className="popup-overlay" onClick={() => setNoteActive(null)}>
          <div className="popup-card" style={{ background: noteActive.couleur || '#FFF9C4' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {noteActive.categorie && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    background: 'rgba(0,0,0,0.1)', color: '#444', display: 'inline-block', marginBottom: 6,
                  }}>{noteActive.categorie}</span>
                )}
                {noteActive.titre && (
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#333', margin: '0 0 4px' }}>{noteActive.titre}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                <button onClick={() => passerEnEdition(noteActive)} style={{
                  background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 8,
                  padding: '6px 10px', cursor: 'pointer', color: '#555', fontSize: 14,
                }}>
                  <i className="ti ti-pencil"></i>
                </button>
                <button onClick={() => setConfirmSupprimer(noteActive.id)} style={{
                  background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 8,
                  padding: '6px 10px', cursor: 'pointer', color: '#555', fontSize: 14,
                }}>
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#333', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {noteActive.contenu}
            </p>
            <div style={{ marginTop: 16 }}>
              <button className="labo-btn-secondary" style={{ width: '100%' }} onClick={() => setNoteActive(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: édition */}
      {noteActive && editForm && (
        <PopupNoteForm
          titrePop="Modifier la note"
          valeurs={editForm}
          setValeurs={setEditForm}
          onSauvegarder={sauvegarderEdit}
          onAnnuler={() => setEditForm(null)}
          onSupprimer={() => setConfirmSupprimer(noteActive.id)}
          labelBtn="Sauvegarder"
        />
      )}

      {confirmSupprimer && (
        <div className="popup-overlay" onClick={() => setConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 36, color: 'var(--accent-red)', marginBottom: 10, display: 'block' }}></i>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Supprimer cette note?</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cette action est irréversible.</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmSupprimer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerNote(confirmSupprimer)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── BABILLARD (notes partagées) ──────────────────────────
function Babillard() {
  const { teamId } = useProfil()
  const [notes, setNotes] = useState([])
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [noteActive, setNoteActive] = useState(null)
  const [noteEditActive, setNoteEditActive] = useState(null)
  const [editBabForm, setEditBabForm] = useState(null)
  const [confirmSupprimer, setConfirmSupprimer] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [tagPos, setTagPos] = useState(0)
  const textareaRef = useRef(null)
  const [form, setForm] = useState({ titre: '', contenu: '', couleur: COULEURS[0], categorie: '' })
  const [recherche, setRecherche] = useState('')
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes')

  useEffect(() => {
    if (!teamId) { setLoading(false); return }
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

  async function charger(silent = false) {
    if (!silent) setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)

    const { data: msgs } = await supabase
      .from('babillard_messages')
      .select('*, profiles(nom)')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })

    const { data: mems } = await supabase
      .from('membres_equipe')
      .select('user_id, profiles(nom)')
      .eq('equipe_id', teamId)

    setNotes(msgs || [])
    setMembres(mems || [])
    setLoading(false)
  }

  function handleContenuChange(e) {
    const val = e.target.value
    setForm(f => ({ ...f, contenu: val }))
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

  function membresFiltrés() {
    const selectionStart = textareaRef.current?.selectionStart || form.contenu.length
    const recherche = form.contenu.slice(tagPos + 1, selectionStart).toLowerCase()
    return membres.filter(m => m.profiles?.nom?.toLowerCase().includes(recherche))
  }

  function insererTag(nom) {
    const avant = form.contenu.slice(0, tagPos)
    const apres = form.contenu.slice(textareaRef.current?.selectionStart || form.contenu.length)
    const nouveau = avant + '@' + nom + ' ' + apres
    setForm(f => ({ ...f, contenu: nouveau }))
    setShowTagMenu(false)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  async function publier() {
    if (!form.contenu.trim() || saving) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const tagEquipe = form.contenu.includes('@equipe')
    const taggedIds = tagEquipe
      ? membres.filter(m => m.user_id !== user.id).map(m => m.user_id)
      : membres.filter(m => m.profiles?.nom && form.contenu.includes('@' + m.profiles.nom)).map(m => m.user_id)

    const { data: newMsg } = await supabase.from('babillard_messages').insert({
      team_id: teamId,
      user_id: user.id,
      titre: form.titre.trim() || null,
      contenu: form.contenu.trim(),
      couleur: form.couleur,
      ...(form.categorie.trim() ? { categorie: form.categorie.trim() } : {}),
      ...(taggedIds.length > 0 ? { tags: taggedIds } : {}),
    }).select('id').single()

    if (taggedIds.length > 0) {
      const { data: monProfil } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
      const auteurNom = monProfil?.nom || user.email
      await supabase.from('notifications').insert(
        taggedIds.map(uid => ({
          user_id: uid,
          type: 'tag_babillard',
          message: tagEquipe
            ? `${auteurNom} a tagué toute l'équipe dans le babillard`
            : `${auteurNom} vous a tagué dans le babillard`,
          reference_type: 'babillard',
          reference_id: newMsg?.id || null,
        }))
      )
    }

    setForm({ titre: '', contenu: '', couleur: COULEURS[0], categorie: '' })
    setShowTagMenu(false)
    setShowForm(false)
    setSaving(false)
    charger(true)
  }

  async function supprimerNote(id) {
    await supabase.from('babillard_messages').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setConfirmSupprimer(null)
    setNoteActive(null)
  }

  function ouvrirEditBab(note) {
    setNoteActive(null)
    setNoteEditActive(note)
    setEditBabForm({ titre: note.titre || '', contenu: note.contenu || '', couleur: note.couleur || COULEURS[0], categorie: note.categorie || '' })
  }

  async function sauvegarderEditBab() {
    if (!editBabForm.contenu.trim()) return
    setSaving(true)
    await supabase.from('babillard_messages').update({
      titre: editBabForm.titre.trim() || null,
      contenu: editBabForm.contenu.trim(),
      couleur: editBabForm.couleur,
      categorie: editBabForm.categorie.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq('id', noteEditActive.id)
    setNotes(prev => prev.map(n => n.id === noteEditActive.id ? { ...n, ...editBabForm } : n))
    setNoteEditActive(null)
    setEditBabForm(null)
    setSaving(false)
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
    if (!contenu) return ''
    return contenu.replace(/@([\w\s]+?)(?=\s|$)/g, '<span style="color:var(--primary);font-weight:600">@$1</span>')
  }

  function apercu(contenu) {
    if (!contenu) return ''
    return contenu.length > 90 ? contenu.slice(0, 90) + '...' : contenu
  }

  const inputStyle = {
    border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
    fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const categories = ['Toutes', ...new Set(notes.map(n => n.categorie).filter(Boolean))]

  const notesFiltrees = notes.filter(note => {
    const nomAuteur = note.profiles?.nom?.toLowerCase() || ''
    const matchRecherche = !recherche.trim() || nomAuteur.includes(recherche.toLowerCase())
    const matchCategorie = filtreCategorie === 'Toutes' || note.categorie === filtreCategorie
    return matchRecherche && matchCategorie
  })

  return (
    <div style={{ padding: '16px 16px 80px', position: 'relative' }}>
      {/* Barre de recherche par membre */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <i className="ti ti-search" style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-hint)', fontSize: 15, pointerEvents: 'none',
        }}></i>
        <input
          placeholder="Rechercher par membre…"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{
            ...inputStyle,
            paddingLeft: 32,
          }}
        />
      </div>

      {/* Filtres catégorie */}
      {categories.length > 1 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
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

      {!loading && notes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <i className="ti ti-messages" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
          <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune note d'équipe pour l'instant.</p>
        </div>
      )}

      {!loading && notes.length > 0 && notesFiltrees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucun résultat.</p>
        </div>
      )}

      <div className="notes-grille" style={{ width: '100%' }}>
        {notesFiltrees.map(note => (
          <div
            key={note.id}
            className="note-tuile"
            style={{ background: note.couleur || '#FFF9C4', cursor: 'pointer' }}
            onClick={() => setNoteActive(note)}
          >
            <div className="note-tuile-header">
              {note.titre
                ? <p className="note-tuile-titre">{note.titre}</p>
                : <p className="note-tuile-titre" style={{ opacity: 0.5 }}>(sans titre)</p>
              }
            </div>
            {note.categorie && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: 'rgba(0,0,0,0.1)', color: '#444', alignSelf: 'flex-start', marginBottom: 4,
              }}>{note.categorie}</span>
            )}
            <p className="note-tuile-apercu"
              dangerouslySetInnerHTML={{ __html: renderContenu(apercu(note.contenu)) }}
            />
            <p className="note-tuile-date">
              <span style={{ fontWeight: 600 }}>{note.profiles?.nom || 'Membre'}</span>
              {' · '}{formatDate(note.created_at)}
            </p>
          </div>
        ))}
      </div>

      <button className="btn-fab" onClick={() => setShowForm(true)}>+</button>

      {/* Popup: voir une note */}
      {noteActive && (
        <div className="popup-overlay" onClick={() => setNoteActive(null)}>
          <div className="popup-card" style={{ background: noteActive.couleur || '#FFF9C4' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {noteActive.categorie && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    background: 'rgba(0,0,0,0.1)', color: '#444', display: 'inline-block', marginBottom: 6,
                  }}>{noteActive.categorie}</span>
                )}
                {noteActive.titre && (
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#333', margin: '0 0 4px' }}>{noteActive.titre}</p>
                )}
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                  {noteActive.profiles?.nom || 'Membre'} · {formatDate(noteActive.created_at)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                {noteActive.user_id === userId && (
                  <button onClick={() => ouvrirEditBab(noteActive)} style={{
                    background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 8,
                    padding: '6px 10px', cursor: 'pointer', color: '#555', fontSize: 14,
                  }}>
                    <i className="ti ti-pencil"></i>
                  </button>
                )}
                {noteActive.user_id === userId && (
                  <button onClick={() => setConfirmSupprimer(noteActive.id)} style={{
                    background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 8,
                    padding: '6px 10px', cursor: 'pointer', color: '#555', fontSize: 14,
                  }}>
                    <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#333', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: renderContenu(noteActive.contenu) }}
            />
            <div style={{ marginTop: 16 }}>
              <button className="labo-btn-secondary" style={{ width: '100%' }} onClick={() => setNoteActive(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: modifier une note du babillard */}
      {noteEditActive && editBabForm && (
        <div className="popup-overlay" onClick={() => { setNoteEditActive(null); setEditBabForm(null) }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Modifier la note</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="Titre (optionnel)"
                value={editBabForm.titre}
                onChange={e => setEditBabForm(f => ({ ...f, titre: e.target.value }))}
                style={inputStyle}
              />
              <textarea
                placeholder="Contenu…"
                value={editBabForm.contenu}
                onChange={e => setEditBabForm(f => ({ ...f, contenu: e.target.value }))}
                rows={5}
                style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
              />
              <input
                placeholder="Catégorie (optionnel)"
                value={editBabForm.categorie}
                onChange={e => setEditBabForm(f => ({ ...f, categorie: e.target.value }))}
                style={inputStyle}
                list="bab-edit-categories"
              />
              <datalist id="bab-edit-categories">
                {categories.filter(c => c !== 'Toutes').map(c => <option key={c} value={c} />)}
              </datalist>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>Couleur :</span>
                {COULEURS.map(c => (
                  <button key={c} onClick={() => setEditBabForm(f => ({ ...f, couleur: c }))} style={{
                    width: 24, height: 24, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                    outline: editBabForm.couleur === c ? '2px solid var(--primary)' : 'none', outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>
            <div className="popup-actions-centrees" style={{ marginTop: 16 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => { setNoteEditActive(null); setEditBabForm(null) }}>Annuler</button>
              <button
                style={{
                  flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: editBabForm.contenu.trim() ? 'pointer' : 'not-allowed',
                  opacity: editBabForm.contenu.trim() ? 1 : 0.5,
                }}
                onClick={sauvegarderEditBab}
                disabled={!editBabForm.contenu.trim() || saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: nouvelle note */}
      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Nouvelle note d'équipe</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="Titre (optionnel)"
                value={form.titre}
                onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                style={inputStyle}
              />
              <div style={{ position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  placeholder="Contenu… (@ pour taguer un membre)"
                  value={form.contenu}
                  onChange={handleContenuChange}
                  rows={4}
                  style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                />
                {showTagMenu && (membresFiltrés().length > 0 || 'equipe'.includes(form.contenu.slice(tagPos + 1, textareaRef.current?.selectionStart || form.contenu.length).toLowerCase())) && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: 0, right: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: 4, zIndex: 10,
                  }}>
                    {'equipe'.includes(form.contenu.slice(tagPos + 1, textareaRef.current?.selectionStart || form.contenu.length).toLowerCase()) && (
                      <button onClick={() => insererTag('equipe')} style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
                        color: 'var(--primary)', fontWeight: 700, borderRadius: 8,
                      }}>
                        @equipe <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-hint)' }}>— notifier tout le monde</span>
                      </button>
                    )}
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
              </div>

              {/* Catégorie */}
              <input
                placeholder="Catégorie (optionnel, ex: Urgence, Admin…)"
                value={form.categorie}
                onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                style={inputStyle}
                list="bab-categories"
              />
              {categories.length > 1 && (
                <datalist id="bab-categories">
                  {categories.filter(c => c !== 'Toutes').map(c => <option key={c} value={c} />)}
                </datalist>
              )}

              {/* Couleur */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>Couleur :</span>
                {COULEURS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, couleur: c }))} style={{
                    width: 24, height: 24, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                    outline: form.couleur === c ? '2px solid var(--primary)' : 'none',
                    outlineOffset: 2,
                  }} />
                ))}
              </div>
            </div>

            <div className="popup-actions-centrees" style={{ marginTop: 16 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => { setShowForm(false); setShowTagMenu(false) }}>Annuler</button>
              <button
                style={{
                  flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: form.contenu.trim() ? 'pointer' : 'not-allowed', opacity: form.contenu.trim() ? 1 : 0.5,
                }}
                onClick={publier}
                disabled={!form.contenu.trim() || saving}
              >
                {saving ? 'Publication...' : 'Publier'}
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
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Supprimer cette note?</p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmSupprimer(null)}>Annuler</button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerNote(confirmSupprimer)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TÂCHES ───────────────────────────────────────────────
const STATUTS = [
  { id: 'todo', label: 'À faire', couleur: '#666', bg: 'var(--bg-secondary)', icone: 'ti-circle' },
  { id: 'en_cours', label: 'En cours', couleur: '#1976D2', bg: '#E3F2FD', icone: 'ti-clock' },
  { id: 'termine', label: 'Terminé', couleur: '#388E3C', bg: '#E8F5E9', icone: 'ti-circle-check' },
]

function BadgeStatut({ statut, onClick }) {
  const s = STATUTS.find(x => x.id === statut) || STATUTS[0]
  return (
    <button onClick={onClick} style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
      border: 'none', cursor: onClick ? 'pointer' : 'default',
      background: s.bg, color: s.couleur, display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <i className={`ti ${s.icone}`} style={{ fontSize: 11 }}></i>
      {s.label}
    </button>
  )
}

function Taches() {
  const { teamId } = useProfil()
  const [taches, setTaches] = useState([])
  const [membres, setMembres] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [tacheActive, setTacheActive] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [confirmSupprimer, setConfirmSupprimer] = useState(null)
  const [form, setForm] = useState({ titre: '', description: '', assignee_id: '', date_echeance: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!teamId) { setLoading(false); return }
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

  async function charger(silent = false) {
    if (!silent) setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)

    const { data: t } = await supabase
      .from('taches')
      .select('*')
      .eq('team_id', teamId)
      .order('date_echeance', { ascending: true, nullsFirst: false })

    const { data: mems } = await supabase
      .from('membres_equipe')
      .select('user_id, profiles(nom)')
      .eq('equipe_id', teamId)

    setTaches(t || [])
    setMembres(mems || [])
    setLoading(false)
  }

  async function toggleTermine(tache) {
    const { data: { user } } = await supabase.auth.getUser()
    const nouveauStatut = tache.statut === 'termine' ? 'todo' : 'termine'
    await supabase.from('taches').update({
      statut: nouveauStatut,
      modifie_par: user.id,
      modifie_le: new Date().toISOString(),
    }).eq('id', tache.id)
    setTaches(prev => prev.map(t => t.id === tache.id ? { ...t, statut: nouveauStatut } : t))
  }

  async function creerTache() {
    if (!form.titre.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: newTache } = await supabase.from('taches').insert({
      team_id: teamId,
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      assignee_id: form.assignee_id || null,
      date_echeance: form.date_echeance || null,
      statut: 'todo',
      created_by: user.id,
      modifie_par: user.id,
      modifie_le: new Date().toISOString(),
    }).select('id').single()
    if (form.assignee_id && form.assignee_id !== user.id) {
      const { data: monProfil } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
      await supabase.from('notifications').insert({
        user_id: form.assignee_id,
        type: 'tache_assignee',
        message: `${monProfil?.nom || user.email} vous a assigné une tâche : ${form.titre.trim()}`,
        reference_type: 'tache',
        reference_id: newTache?.id || null,
      })
    }
    setForm({ titre: '', description: '', assignee_id: '', date_echeance: '' })
    setShowForm(false)
    setSaving(false)
    charger(true)
  }

  async function sauvegarderEdit() {
    if (!editForm?.titre?.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('taches').update({
      titre: editForm.titre.trim(),
      description: editForm.description?.trim() || null,
      assignee_id: editForm.assignee_id || null,
      date_echeance: editForm.date_echeance || null,
      statut: editForm.statut,
      modifie_par: user.id,
      modifie_le: new Date().toISOString(),
    }).eq('id', tacheActive.id)
    if (editForm.assignee_id && editForm.assignee_id !== tacheActive.assignee_id && editForm.assignee_id !== user.id) {
      const { data: monProfil } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
      await supabase.from('notifications').insert({
        user_id: editForm.assignee_id,
        type: 'tache_assignee',
        message: `${monProfil?.nom || user.email} vous a assigné une tâche : ${editForm.titre.trim()}`,
        reference_type: 'tache',
        reference_id: tacheActive.id,
      })
    }
    setTaches(prev => prev.map(t => t.id === tacheActive.id ? { ...t, ...editForm } : t))
    setTacheActive(null)
    setEditForm(null)
    setSaving(false)
  }

  function ouvrirEdit(tache) {
    setTacheActive(tache)
    setEditForm({
      titre: tache.titre || '',
      description: tache.description || '',
      assignee_id: tache.assignee_id || '',
      date_echeance: tache.date_echeance ? tache.date_echeance.slice(0, 10) : '',
      statut: tache.statut || 'todo',
    })
  }

  async function supprimerTache(id) {
    await supabase.from('taches').delete().eq('id', id)
    setTaches(prev => prev.filter(t => t.id !== id))
    setConfirmSupprimer(null)
    setTacheActive(null)
    setEditForm(null)
  }

  function formatDate(iso) {
    if (!iso) return null
    const d = new Date(iso + 'T12:00:00')
    const auj = new Date()
    auj.setHours(0, 0, 0, 0)
    const diff = Math.floor((new Date(iso + 'T00:00:00') - auj) / 86400000)
    if (diff < 0) return { texte: 'En retard', rouge: true }
    if (diff === 0) return { texte: "Aujourd'hui", orange: true }
    if (diff === 1) return { texte: 'Demain', orange: true }
    const jour = d.toLocaleDateString('fr-CA', { weekday: 'long' })
    const jourCap = jour.charAt(0).toUpperCase() + jour.slice(1)
    const date = d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })
    return { texte: `${jourCap} le ${date}` }
  }

  const tachesParStatut = STATUTS.map(s => ({
    ...s,
    items: taches.filter(t => t.statut === s.id),
  }))

  const inputStyle = {
    border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
    fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      {loading && <p style={{ color: 'var(--text-hint)', fontSize: 14 }}>Chargement...</p>}

      {!loading && taches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <i className="ti ti-checklist" style={{ fontSize: 40, color: 'var(--text-hint)', display: 'block', marginBottom: 12 }}></i>
          <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune tâche pour l'instant.</p>
        </div>
      )}

      {tachesParStatut.map(groupe => groupe.items.length > 0 && (
        <div key={groupe.id} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: groupe.couleur, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {groupe.label} ({groupe.items.length})
          </p>
          {groupe.items.map(tache => {
            const echeance = formatDate(tache.date_echeance)
            const termine = tache.statut === 'termine'
            return (
              <div key={tache.id} style={{
                background: 'var(--bg-card)', borderRadius: 12, padding: '12px 14px',
                border: '1px solid var(--border)', marginBottom: 8,
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                {/* Checkbox circle */}
                <button
                  onClick={() => toggleTermine(tache)}
                  style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: '50%', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, marginTop: 1,
                    background: termine ? '#388E3C' : 'transparent',
                    color: termine ? '#fff' : 'var(--text-hint)',
                    outline: termine ? 'none' : '2px solid var(--border)',
                  }}
                >
                  {termine && <i className="ti ti-check" style={{ fontSize: 13 }}></i>}
                </button>

                {/* Contenu cliquable */}
                <div style={{ flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => ouvrirEdit(tache)}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0,
                    textDecoration: termine ? 'line-through' : 'none',
                    opacity: termine ? 0.5 : 1,
                  }}>
                    {tache.titre}
                  </p>
                  {tache.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0', lineHeight: 1.4 }}>
                      {tache.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <BadgeStatut statut={tache.statut} />
                    {tache.assignee_id && membres.find(m => m.user_id === tache.assignee_id) && (
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        <i className="ti ti-user" style={{ marginRight: 3 }}></i>
                        {membres.find(m => m.user_id === tache.assignee_id)?.profiles?.nom}
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
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <button className="btn-fab" onClick={() => setShowForm(true)}>+</button>

      {/* Popup: nouvelle tâche */}
      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Nouvelle tâche</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Titre de la tâche *"
                value={form.titre}
                onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                style={inputStyle}
              />
              <textarea
                placeholder="Description (optionnel)"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
              />
              <select value={form.assignee_id} onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))} style={inputStyle}>
                <option value="">Assigner à… (optionnel)</option>
                {membres.map(m => <option key={m.user_id} value={m.user_id}>{m.profiles?.nom}</option>)}
              </select>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={form.date_echeance}
                  onChange={e => setForm(f => ({ ...f, date_echeance: e.target.value }))}
                  style={{ ...inputStyle, color: form.date_echeance ? 'var(--text-primary)' : 'transparent' }}
                />
                {!form.date_echeance && (
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, color: 'var(--text-hint)', pointerEvents: 'none',
                  }}>Date d'échéance (optionnel)</span>
                )}
              </div>
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

      {/* Popup: modifier une tâche */}
      {tacheActive && editForm && (
        <div className="popup-overlay" onClick={() => { setTacheActive(null); setEditForm(null) }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Modifier la tâche</p>
              <button onClick={() => setConfirmSupprimer(tacheActive.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: 18,
              }}>
                <i className="ti ti-trash"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Titre *"
                value={editForm.titre}
                onChange={e => setEditForm(f => ({ ...f, titre: e.target.value }))}
                style={inputStyle}
              />
              <textarea
                placeholder="Description (optionnel)"
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
              />
              <select value={editForm.assignee_id} onChange={e => setEditForm(f => ({ ...f, assignee_id: e.target.value }))} style={inputStyle}>
                <option value="">Assigner à… (optionnel)</option>
                {membres.map(m => <option key={m.user_id} value={m.user_id}>{m.profiles?.nom}</option>)}
              </select>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={editForm.date_echeance}
                  onChange={e => setEditForm(f => ({ ...f, date_echeance: e.target.value }))}
                  style={{ ...inputStyle, color: editForm.date_echeance ? 'var(--text-primary)' : 'transparent' }}
                />
                {!editForm.date_echeance && (
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, color: 'var(--text-hint)', pointerEvents: 'none',
                  }}>Date d'échéance (optionnel)</span>
                )}
              </div>

              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Statut</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setEditForm(f => ({ ...f, statut: s.id }))}
                      style={{
                        fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 999,
                        border: editForm.statut === s.id ? `2px solid ${s.couleur}` : '2px solid transparent',
                        cursor: 'pointer',
                        background: editForm.statut === s.id ? s.bg : 'var(--bg-secondary)',
                        color: editForm.statut === s.id ? s.couleur : 'var(--text-hint)',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <i className={`ti ${s.icone}`} style={{ fontSize: 12 }}></i>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="popup-actions-centrees" style={{ marginTop: 20 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => { setTacheActive(null); setEditForm(null) }}>Annuler</button>
              <button
                style={{
                  flex: 1, background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 0', fontSize: 14, fontWeight: 700,
                  cursor: editForm.titre.trim() ? 'pointer' : 'not-allowed', opacity: editForm.titre.trim() ? 1 : 0.5,
                }}
                onClick={sauvegarderEdit}
                disabled={!editForm.titre.trim() || saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: confirmer suppression */}
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

// ─── CLOCHE NOTIFICATIONS (mini, blanche) ─────────────────
function ClocheMini() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const { estEquipe } = useProfil()
  const navigate = useNavigate()

  function naviguerNotif(notif) {
    setOpen(false)
    if (notif.reference_type === 'babillard') navigate('/equipe?tab=babillard')
    else if (notif.reference_type === 'tache') navigate('/equipe?tab=taches')
  }

  useEffect(() => {
    if (!estEquipe) return
    charger()
    let active = true
    let channel = null
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active || !user) return
      const name = 'notifs-eq-' + user.id + '-' + Date.now()
      channel = supabase
        .channel(name)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => charger())
        .subscribe()
    })
    return () => { active = false; if (channel) supabase.removeChannel(channel) }
  }, [estEquipe])

  async function charger() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setNotifs(data || [])
    setCount((data || []).filter(n => !n.lu).length)
  }

  async function marquerLues() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('notifications').update({ lu: true }).eq('user_id', user.id).eq('lu', false)
    setCount(0)
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  }

  if (!estEquipe) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open && count > 0) marquerLues() }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px',
          color: '#fff', fontSize: 20, position: 'relative',
        }}
      >
        <i className="ti ti-bell"></i>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 8, background: 'var(--accent-red)',
            color: '#fff', borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 44, right: 0, zIndex: 100, width: 280,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notifications</p>
            </div>
            {notifs.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-hint)' }}>Aucune notification</p>
              </div>
            ) : (
              <div style={{ maxHeight: 320, overflow: 'auto' }}>
                {notifs.map(n => (
                  <div key={n.id}
                    onClick={() => naviguerNotif(n)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      background: n.lu ? 'transparent' : 'var(--bg-secondary)',
                      cursor: n.reference_type ? 'pointer' : 'default',
                    }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: '4px 0 0' }}>
                      {new Date(n.created_at).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── PAGE ÉQUIPE ──────────────────────────────────────────
export default function Equipe() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [sousOnglet, setSousOnglet] = useState(tabParam || 'notes')
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
      {/* Barre supérieure avec sous-onglets + actions */}
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
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--primary)', borderRadius: '0 0 0 12px' }}>
          {(roleEquipe === 'admin' || roleEquipe === 'proprietaire') && (
            <button onClick={() => navigate('/equipe/gestion')} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px',
              color: '#fff', fontSize: 20,
            }}>
              <i className="ti ti-settings"></i>
            </button>
          )}
          <ClocheMini />
        </div>
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
