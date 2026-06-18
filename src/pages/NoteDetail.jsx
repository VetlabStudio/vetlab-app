import { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { TitreContext } from '../App'

const COULEURS = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD0', '#E1BEE7', '#FFE0B2']

export default function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setTitreCustom } = useContext(TitreContext)
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [categoriesExistantes, setCategoriesExistantes] = useState([])
  const sauvegardeRef = useRef(null)

  useEffect(() => {
    chargerNote()
    return () => {
      setTitreCustom('')
      if (sauvegardeRef.current) clearTimeout(sauvegardeRef.current)
    }
  }, [id])

  async function chargerNote() {
    setLoading(true)
    const { data } = await supabase.from('notes').select('*').eq('id', id).single()
    if (data) {
      setNote(data)
      setTitreCustom(data.titre)
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { data: autres } = await supabase
      .from('notes')
      .select('categorie')
      .eq('user_id', user.id)
      .not('categorie', 'is', null)
    setCategoriesExistantes([...new Set((autres || []).map(n => n.categorie).filter(Boolean))].sort())
    setLoading(false)
  }

  function modifierChamp(champ, valeur) {
    setNote(prev => ({ ...prev, [champ]: valeur }))
    if (champ === 'titre') setTitreCustom(valeur)
    // Sauvegarde auto après 800ms d'inactivité
    if (sauvegardeRef.current) clearTimeout(sauvegardeRef.current)
    sauvegardeRef.current = setTimeout(() => sauvegarder({ ...note, [champ]: valeur }), 800)
  }

  async function sauvegarder(data) {
    await supabase
      .from('notes')
      .update({ titre: data.titre, contenu: data.contenu, couleur: data.couleur, categorie: data.categorie, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>
  if (!note) return <div className="admin-vide">Note introuvable</div>

  return (
    <div className="note-detail-page" style={{ background: note.couleur, minHeight: '100%' }}>

      {/* ─── CHOIX DE COULEUR ───────────────── */}
      <div className="note-couleurs">
        {COULEURS.map(c => (
          <button
            key={c}
            className={`note-couleur-btn ${note.couleur === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => modifierChamp('couleur', c)}
          />
        ))}
      </div>

      {/* ─── TITRE ──────────────────────────── */}
      <input
        className="note-titre-input"
        value={note.titre}
        onChange={e => modifierChamp('titre', e.target.value)}
        placeholder="Titre (ex: nom du patient)"
      />

      {/* ─── CATÉGORIE ──────────────────────── */}
      <input
        className="note-categorie-input"
        value={note.categorie || ''}
        onChange={e => modifierChamp('categorie', e.target.value)}
        placeholder="Catégorie (ex: Chirurgie, Urgence...)"
        list="categories-existantes"
      />
      <datalist id="categories-existantes">
        {categoriesExistantes.map(c => <option key={c} value={c} />)}
      </datalist>

      {/* ─── CONTENU ────────────────────────── */}
      <textarea
        className="note-contenu-input"
        value={note.contenu}
        onChange={e => modifierChamp('contenu', e.target.value)}
        placeholder="Notes, médicaments administrés, soins, doses..."
        autoFocus
      />

    </div>
  )
}
