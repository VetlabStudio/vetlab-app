import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LaboAccueil() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chargerCategories()
  }, [])

  async function chargerCategories() {
    const { data } = await supabase
      .from('labo_categories')
      .select('*')
      .order('ordre')
    setCategories(data || [])
    setLoading(false)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="page-calculateurs">
      <div className="menu-page-section-liste">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            className="menu-page-item"
            onClick={() => navigate(`/labo/${cat.id}`)}
            style={{ borderBottom: idx < categories.length - 1 ? '1px solid var(--border)' : 'none' }}
          >
            <span className="menu-page-item-label">{cat.nom}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
          </button>
        ))}
      </div>
    </div>
  )
}
