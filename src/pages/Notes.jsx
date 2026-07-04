import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const COULEURS = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD0', '#E1BEE7', '#FFE0B2']

const inputStyle = {
  border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px',
  fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function Notes() {
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
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
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

  if (loading) return <div className="admin-loading">Chargement...</div>

  const categories = ['Toutes', ...new Set(notes.map(n => n.categorie).filter(Boolean)).values()]
  const notesFiltrees = filtreCategorie === 'Toutes' ? notes : notes.filter(n => n.categorie === filtreCategorie)

  function PopupForm({ titrePop, valeurs, setValeurs, onSauvegarder, onAnnuler, onSupprimer, labelBtn }) {
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
            <input
              placeholder="Titre (optionnel)"
              value={valeurs.titre}
              onChange={e => setValeurs(v => ({ ...v, titre: e.target.value }))}
              style={inputStyle}
            />
            <textarea
              placeholder="Contenu…"
              value={valeurs.contenu}
              onChange={e => setValeurs(v => ({ ...v, contenu: e.target.value }))}
              rows={6}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
            />
            <input
              placeholder="Catégorie (optionnel, ex: Chirurgie, Urgence…)"
              value={valeurs.categorie}
              onChange={e => setValeurs(v => ({ ...v, categorie: e.target.value }))}
              style={inputStyle}
              list="notes-cats-list"
            />
            <datalist id="notes-cats-list">
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
              disabled={(!valeurs.contenu.trim() && !valeurs.titre.trim()) || saving}
            >
              {saving ? '...' : labelBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-page">

      {categories.length > 1 && (
        <div className="notes-filtres">
          {categories.map(c => (
            <button
              key={c}
              className={`notes-filtre-chip ${filtreCategorie === c ? 'active' : ''}`}
              onClick={() => setFiltreCategorie(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="mes-drogues-vide">
          <i className="ti ti-notes" style={{ fontSize: 40, color: 'var(--text-hint)' }}></i>
          <p>Aucune note</p>
          <p className="mes-drogues-vide-hint">Appuie sur + pour créer ta première note.</p>
        </div>
      ) : notesFiltrees.length === 0 ? (
        <p className="admin-vide">Aucune note dans cette catégorie.</p>
      ) : (
        <div className="notes-grille">
          {notesFiltrees.map(note => (
            <div
              key={note.id}
              className="note-tuile"
              style={{ background: note.couleur || '#FFF9C4', cursor: 'pointer' }}
              onClick={() => ouvrirEdit(note)}
            >
              <div className="note-tuile-header">
                <h3 className="note-tuile-titre">{note.titre || '(sans titre)'}</h3>
              </div>
              {note.categorie && <span className="note-tuile-categorie">{note.categorie}</span>}
              <p className="note-tuile-apercu">
                {note.contenu?.length > 80 ? note.contenu.slice(0, 80) + '...' : note.contenu}
              </p>
            </div>
          ))}
        </div>
      )}

      <button className="btn-fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <PopupForm
          titrePop="Nouvelle note"
          valeurs={form}
          setValeurs={setForm}
          onSauvegarder={creerNote}
          onAnnuler={() => setShowForm(false)}
          labelBtn="Créer"
        />
      )}

      {noteActive && editForm && (
        <PopupForm
          titrePop="Modifier la note"
          valeurs={editForm}
          setValeurs={setEditForm}
          onSauvegarder={sauvegarderEdit}
          onAnnuler={() => { setNoteActive(null); setEditForm(null) }}
          onSupprimer={() => setConfirmSupprimer(noteActive.id)}
          labelBtn="Sauvegarder"
        />
      )}

      {confirmSupprimer && (
        <div className="popup-overlay" onClick={() => setConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
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
