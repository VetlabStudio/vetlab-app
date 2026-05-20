import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'

const CATEGORIE = 'Anesthésiques / Analgésiques'

export default function DroguesAnesthesiques() {
  const navigate = useNavigate()
  const [medicaments, setMedicaments] = useState([])
  const [favorisIds, setFavorisIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: meds }, { data: favs }] = await Promise.all([
        supabase
          .from('medicaments')
          .select('*')
          .eq('categorie', CATEGORIE)
          .order('nom', { ascending: true }),
        supabase
          .from('favoris')
          .select('medicament_id')
          .eq('user_id', user.id),
      ])

      const ids = new Set((favs || []).map(f => f.medicament_id))
      setFavorisIds(ids)

      // Favoris en haut, reste par ordre alphabétique
      const tries = [...(meds || [])].sort((a, b) => {
        const aFav = ids.has(a.id)
        const bFav = ids.has(b.id)
        if (aFav && !bFav) return -1
        if (!aFav && bFav) return 1
        return a.nom.localeCompare(b.nom)
      })

      setMedicaments(tries)
    } catch (err) {
      console.error('Erreur chargement:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleFavori(medicamentId) {
    const { data: { user } } = await supabase.auth.getUser()
    const estFavori = favorisIds.has(medicamentId)

    if (estFavori) {
      await supabase.from('favoris').delete()
        .eq('user_id', user.id)
        .eq('medicament_id', medicamentId)
      setFavorisIds(prev => {
        const next = new Set(prev)
        next.delete(medicamentId)
        return next
      })
    } else {
      await supabase.from('favoris').insert({
        user_id: user.id,
        medicament_id: medicamentId,
      })
      setFavorisIds(prev => new Set([...prev, medicamentId]))
    }

    // Retrier après changement de favori
    setMedicaments(prev => [...prev].sort((a, b) => {
      const newIds = new Set(favorisIds)
      if (estFavori) newIds.delete(medicamentId)
      else newIds.add(medicamentId)
      const aFav = newIds.has(a.id)
      const bFav = newIds.has(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return a.nom.localeCompare(b.nom)
    }))
  }

  return (
    <div className="drogues-page">

      {/* LISTE */}
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="drogues-liste">
          {medicaments.length === 0 ? (
            <div className="admin-vide">Aucun médicament dans cette catégorie</div>
          ) : (
            medicaments.map(m => (
              <div
                key={m.id}
                className="drogue-item"
                onClick={() => navigate(`/drogues/fiche/${m.id}`)}
              >
                <button
                  className={`favori-btn ${favorisIds.has(m.id) ? 'actif' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleFavori(m.id) }}
                >
                  {favorisIds.has(m.id) ? '★' : '☆'}
                </button>

                <div className="drogue-info">
  <span className="drogue-nom">{m.nom}</span>
  {m.sous_categories?.length > 0 && (
    <span className="drogue-sous-cat">{m.sous_categories.join(', ')}</span>
  )}
</div>

                <IconesEspeces especes={m.especes} taille={36} />
              </div>
            ))
          )}
        </div>
      )}

      <button
        className="btn-fab"
        onClick={() => navigate('/drogues/ajouter')}
      >
        +
      </button>

    </div>
  )
}