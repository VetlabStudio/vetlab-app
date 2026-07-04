import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'
import { useProfil } from '../context/ProfilContext'

export default function DroguesCategorie({ categorie }) {
  const navigate = useNavigate()
  const [medicaments, setMedicaments] = useState([])
  const [favorisIds, setFavorisIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [dropdownOuvert, setDropdownOuvert] = useState(false)
  const [sousCategorieFiltree, setSousCategorieFiltree] = useState('Tous')
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro, estEquipe, roleEquipe } = useProfil()
  const peutModifier = !estEquipe || roleEquipe === 'admin' || roleEquipe === 'proprietaire'

  useEffect(() => {
    chargerDonnees()
  }, [categorie])

  async function chargerDonnees() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: meds }, { data: medsCustom }, { data: favs }] = await Promise.all([
  supabase
    .from('medicaments')
    .select('*')
    .eq('categorie', categorie)
    .order('nom', { ascending: true }),
  supabase
    .from('medicaments_custom')
    .select('*')
    .eq('user_id', user.id)
    .eq('categorie', categorie)
    .is('medicament_id', null),
 supabase
  .from('favoris')
  .select('medicament_id, custom_medicament_id')
  .eq('user_id', user.id),
])

      const ids = new Set((favs || []).map(f => f.custom_medicament_id || f.medicament_id).filter(Boolean))
      setFavorisIds(ids)

      const medsCustomBase = await supabase
  .from('medicaments_custom')
  .select('*')
  .eq('user_id', user.id)
  .eq('categorie', categorie)
  .not('medicament_id', 'is', null)

const medsAvecCustom = (meds || []).map(m => {
  const custom = (medsCustomBase.data || []).find(c => c.medicament_id === m.id)
  return custom ? { ...custom, estCustom: true } : m
})

const tries = [...medsAvecCustom, ...(medsCustom || []).map(m => ({ ...m, estCustom: true }))].sort((a, b) => {
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

  async function toggleFavori(medicamentId, estCustom = false) {
  const { data: { user } } = await supabase.auth.getUser()
  const estFavori = favorisIds.has(medicamentId)

  if (estFavori) {
    await supabase.from('favoris').delete()
      .eq('user_id', user.id)
      .eq(estCustom ? 'custom_medicament_id' : 'medicament_id', medicamentId)
    setFavorisIds(prev => {
      const next = new Set(prev)
      next.delete(medicamentId)
      return next
    })
  } else {
    await supabase.from('favoris').insert({
      user_id: user.id,
      ...(estCustom
        ? { custom_medicament_id: medicamentId }
        : { medicament_id: medicamentId }),
    })
    setFavorisIds(prev => new Set([...prev, medicamentId]))
  }

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

  // Sous-catégories uniques
  const sousCats = ['Tous', ...new Set(
    medicaments.flatMap(m => m.sous_categories || [])
  )]

  // Filtrer par recherche et sous-catégorie
  const medsFiltres = medicaments.filter(m => {
    const matchRecherche = m.nom.toLowerCase().includes(recherche.toLowerCase())
    const matchSousCat = sousCategorieFiltree === 'Tous' ||
      (m.sous_categories || []).includes(sousCategorieFiltree)
    return matchRecherche && matchSousCat
  })

  return (
    <div className="drogues-page">

      {/* ─── RECHERCHE ──────────────────────── */}
<div className="champ" style={{ position: 'relative', zIndex: 10 }}>
  <div className="recherche-wrapper">
    <i className="ti ti-search recherche-icone"></i>
    <input
      type="text"
      className="recherche-input"
      placeholder="Rechercher un médicament..."
      value={recherche}
      onChange={e => {
        setRecherche(e.target.value)
        setDropdownOuvert(true)
      }}
      onFocus={() => setDropdownOuvert(true)}
      onBlur={() => setTimeout(() => setDropdownOuvert(false), 150)}
    />
    {recherche && (
      <button className="recherche-clear" onClick={() => {
        setRecherche('')
        setDropdownOuvert(false)
      }}>
        <i className="ti ti-x"></i>
      </button>
    )}
  </div>

  {dropdownOuvert && recherche.length > 0 && (
    <div className="recherche-dropdown">
      {medsFiltres.length > 0 ? medsFiltres.map(m => (
        <div
  key={m.id}
  className="recherche-item"
  onClick={() => {
    navigate(`/drogues/fiche/${m.id}`)
    setRecherche('')
    setDropdownOuvert(false)
  }}
>
  <span className="recherche-item-nom">{m.nom}</span>
  <span className="recherche-cat">
    {m.especes?.join(' / ')} — {m.sous_categories?.join(', ')}
  </span>
</div>
      )) : (
        <div className="recherche-item recherche-vide">Aucun résultat</div>
      )}
    </div>
  )}
</div>

      {/* ─── FILTRES SOUS-CATÉGORIES ─────────── */}
      {sousCats.length > 2 && (
        <div className="drogues-filtres">
          {sousCats.map(sc => (
            <button
              key={sc}
              className={`drogues-filtre-btn ${sousCategorieFiltree === sc ? 'actif' : ''}`}
              onClick={() => setSousCategorieFiltree(sc)}
            >
              {sc}
            </button>
          ))}
        </div>
      )}

      {/* ─── LISTE ──────────────────────────── */}
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="drogues-liste">
          {medsFiltres.length === 0 ? (
            <div className="admin-vide">Aucun médicament trouvé</div>
          ) : (
            medsFiltres.map(m => (
              <div
                key={m.id}
                className="drogue-item"
                onClick={() => navigate(`/drogues/fiche/${m.id}`)}
              >
                <button
                  className={`favori-btn ${favorisIds.has(m.id) ? 'actif' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleFavori(m.id, m.estCustom) }}
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
      {peutModifier && <button className="btn-fab" onClick={() => estPro ? navigate(`/drogues/ajouter?categorie=${encodeURIComponent(categorie)}`) : setShowProMsg(true)}>+</button>}

      {showProMsg && (
        <div className="popup-overlay" onClick={() => setShowProMsg(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Fonctionnalité Pro</span>
              <button className="popup-close" onClick={() => setShowProMsg(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                L'ajout de médicaments personnalisés est réservé au forfait <strong>Pro</strong>.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
                Passe au forfait Pro pour accéder à cette fonctionnalité.
              </p>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>
              Compris
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
