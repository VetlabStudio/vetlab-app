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
      <div className="labo-categories-grid">
        {categories.map(cat => (
          <button
            key={cat.id}
            className="labo-categorie-btn"
            onClick={() => navigate(`/labo/${cat.id}`)}
          >
            {cat.nom}
          </button>
        ))}
      </div>
    </div>
  )
}
