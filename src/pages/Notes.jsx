import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const COULEURS = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD0', '#E1BEE7', '#FFE0B2']

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes')

  useEffect(() => {
    chargerNotes()
  }, [])

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

  function formaterDate(date) {
    return new Date(date).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  const categories = [...new Set(notes.map(n => n.categorie).filter(Boolean))].sort()
  const notesFiltrees = filtreCategorie === 'Toutes' ? notes : notes.filter(n => n.categorie === filtreCategorie)

  return (
    <div className="notes-page">

      {categories.length > 0 && (
        <div className="notes-filtres">
          <button
            className={`notes-filtre-chip ${filtreCategorie === 'Toutes' ? 'active' : ''}`}
            onClick={() => setFiltreCategorie('Toutes')}
          >
            Toutes
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`notes-filtre-chip ${filtreCategorie === cat ? 'active' : ''}`}
              onClick={() => setFiltreCategorie(cat)}
            >
              {cat}
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
              style={{ background: note.couleur }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <div className="note-tuile-header">
                <h3 className="note-tuile-titre">{note.titre}</h3>
                <button
                  className="note-tuile-supprimer"
                  onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(note) }}
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
              {note.categorie && <span className="note-tuile-categorie">{note.categorie}</span>}
              <p className="note-tuile-apercu">{apercu(note.contenu)}</p>
              <p className="note-tuile-date">{formaterDate(note.updated_at)}</p>
            </div>
          ))}
        </div>
      )}

      <button className="btn-fab" onClick={creerNote}>+</button>

      {showConfirmSupprimer && (
        <div className="popup-overlay" onClick={() => setShowConfirmSupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Supprimer la note</span>
              <button className="popup-close" onClick={() => setShowConfirmSupprimer(null)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Supprimer <strong>{showConfirmSupprimer.titre}</strong> ? Cette action est irréversible.
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(null)}>
                Annuler
              </button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerNote(showConfirmSupprimer.id)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
