import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'

export default function AdminMedicaments() {
  const navigate = useNavigate()
  const [medicaments, setMedicaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [categorieFiltre, setCategorieFiltre] = useState('tous')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    chargerMedicaments()
  }, [])

  async function chargerMedicaments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('medicaments')
      .select('*')
      .order('categorie', { ascending: true })
      .order('nom', { ascending: true })

    if (!error) {
      setMedicaments(data)
      const cats = [...new Set(data.map(m => m.categorie))]
      setCategories(cats)
    }
    setLoading(false)
  }

  async function supprimerMedicament(id, nom) {
    if (!confirm(`Supprimer « ${nom} » ?`)) return
    const { error } = await supabase.from('medicaments').delete().eq('id', id)
    if (!error) setMedicaments(prev => prev.filter(m => m.id !== id))
  }

  const medicamentsFiltres = medicaments.filter(m => {
    const matchRecherche = m.nom.toLowerCase().includes(recherche.toLowerCase())
    const matchCategorie = categorieFiltre === 'tous' || m.categorie === categorieFiltre
    return matchRecherche && matchCategorie
  })

  return (
    <div className="admin-page">
      

      <div className="admin-filtres">
        <input
          type="text"
          placeholder="Rechercher..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          className="admin-recherche"
        />
        <select
          value={categorieFiltre}
          onChange={e => setCategorieFiltre(e.target.value)}
          className="admin-select"
        >
          <option value="tous">Toutes les catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="admin-liste">
          {medicamentsFiltres.length === 0 ? (
            <div className="admin-vide">Aucun médicament trouvé</div>
          ) : (
            medicamentsFiltres.map(m => (
              <div key={m.id} className="admin-item">
  <div className="admin-item-info">
    <span className="admin-item-nom">{m.nom}</span>
    <div className="admin-item-meta">
      <span className="admin-item-categorie">{m.categorie}</span>
   <IconesEspeces especes={m.especes} taille={20} />
    </div>
  </div>
  <div className="admin-item-actions">
    <button className="btn-edit" onClick={() => navigate(`/admin/medicaments/${m.id}`)}>✏️</button>
    <button className="btn-delete" onClick={() => supprimerMedicament(m.id, m.nom)}>🗑️</button>
  </div>
</div>
            ))
          )}
        </div>
      )}

      <div className="admin-stats">
        {medicamentsFiltres.length} médicament{medicamentsFiltres.length !== 1 ? 's' : ''}
      </div>
      <button className="btn-fab" onClick={() => navigate('/admin/medicaments/nouveau')}>+</button>
    </div>
  )
}
