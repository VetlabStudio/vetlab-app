import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'

export default function MesDrogues() {
  const navigate = useNavigate()
  const [favoris, setFavoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [especeFiltree, setEspeceFiltree] = useState('tous')

  useEffect(() => {
    chargerFavoris()
  }, [])

  async function chargerFavoris() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: favs } = await supabase
        .from('favoris')
        .select('medicament_id, custom_medicament_id')
        .eq('user_id', user.id)

      if (!favs || favs.length === 0) {
        setFavoris([])
        setLoading(false)
        return
      }

      const idsBase = favs.map(f => f.medicament_id).filter(Boolean)
      const idsCustom = favs.map(f => f.custom_medicament_id).filter(Boolean)

      const [{ data: meds }, { data: medsCustom }, { data: medsCustomBase }] = await Promise.all([
        idsBase.length > 0
          ? supabase.from('medicaments').select('*').in('id', idsBase).order('nom', { ascending: true })
          : { data: [] },
        idsCustom.length > 0
          ? supabase.from('medicaments_custom').select('*').in('id', idsCustom).order('nom', { ascending: true })
          : { data: [] },
        idsBase.length > 0
          ? supabase.from('medicaments_custom').select('*').eq('user_id', user.id).in('medicament_id', idsBase).order('nom', { ascending: true })
          : { data: [] },
      ])

      const medsBaseAvecCustom = (meds || []).map(m => {
        const custom = (medsCustomBase || []).find(c => c.medicament_id === m.id)
        return custom ? { ...custom, estCustom: true } : m
      })

      setFavoris([
        ...medsBaseAvecCustom,
        ...(medsCustom || []).map(m => ({ ...m, estCustom: true })),
      ].sort((a, b) => a.nom.localeCompare(b.nom)))
    } catch (err) {
      console.error('Erreur chargement favoris:', err)
    } finally {
      setLoading(false)
    }
  }

  async function retirerFavori(e, medicamentId) {
    e.stopPropagation()
    const { data: { user } } = await supabase.auth.getUser()
    const m = favoris.find(f => f.id === medicamentId)
    await supabase.from('favoris').delete()
      .eq('user_id', user.id)
      .eq(m?.estCustom ? 'custom_medicament_id' : 'medicament_id', medicamentId)
    setFavoris(prev => prev.filter(m => m.id !== medicamentId))
  }

  // Espèces disponibles dans les favoris
  const especesDisponibles = ['tous', ...new Set(favoris.flatMap(m => m.especes || []))]

  // Filtrer par espèce
  const favorisFiltres = especeFiltree === 'tous'
    ? favoris
    : favoris.filter(m => m.especes?.includes(especeFiltree))

  // Grouper par catégorie
  const parCategorie = favorisFiltres.reduce((acc, m) => {
    const cat = m.categorie || 'Autre'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(m)
    return acc
  }, {})

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="drogues-page">

      {favoris.length === 0 ? (
        <div className="mes-drogues-vide">
          <i className="ti ti-star" style={{ fontSize: 40, color: 'var(--text-hint)' }}></i>
          <p>Aucun médicament en favori</p>
          <p className="mes-drogues-vide-hint">
            Ajoute des favoris en appuyant sur ★ dans les listes de médicaments.
          </p>
        </div>
      ) : (
        <>
          {/* ─── FILTRE ESPÈCE ─────────────────── */}
          <div className="champ">
            <div className="champ-input">
              <div className="champ-icone-wrapper">
                <i className="ti ti-filter" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
              </div>
              <select
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: '1rem', color: 'var(--text-primary)', padding: '8px 0', appearance: 'none', WebkitAppearance: 'none' }}
                value={especeFiltree}
                onChange={e => setEspeceFiltree(e.target.value)}
              >
                {especesDisponibles.map(esp => (
                  <option key={esp} value={esp}>
                    {esp === 'tous' ? 'Toutes les espèces' : esp.charAt(0).toUpperCase() + esp.slice(1)}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down" style={{ color: 'var(--text-hint)', fontSize: 16, flexShrink: 0 }}></i>
            </div>
          </div>

          {/* ─── LISTE ─────────────────────────── */}
          {Object.entries(parCategorie).map(([categorie, meds]) => (
            <div key={categorie} className="drogues-groupe">
              <div className="drogues-sous-cat-titre">{categorie}</div>
              <div className="drogues-liste">
                {meds.map(m => (
                  <div
                    key={m.id}
                    className="drogue-item"
                    onClick={() => navigate(`/drogues/fiche/${m.id}`)}
                  >
                    <button
                      className="favori-btn actif"
                      onClick={e => retirerFavori(e, m.id)}
                    >
                      ★
                    </button>
                    <div className="drogue-info">
                      <span className="drogue-nom">{m.nom}</span>
                      {m.sous_categories?.length > 0 && (
                        <span className="drogue-sous-cat">{m.sous_categories.join(', ')}</span>
                      )}
                    </div>
                    <IconesEspeces especes={m.especes} taille={36} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

    </div>
  )
}
