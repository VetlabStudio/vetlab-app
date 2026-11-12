import { useState, useEffect, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'
import LienFavoris from '../components/LienFavoris'
import { correspond } from '../lib/recherche'
import { NOMS_EXOTIQUES, CATEGORIES_EXOTIQUES, slugCategorie } from '../lib/especesExotiques'
import { useEspeceExotique } from '../lib/useEspeceExotique'

/* Supabase renvoie au plus 1 000 lignes par requête : on lit par pages. */
const TAILLE_PAGE = 1000
async function toutLire(requete) {
  let tout = []
  for (let debut = 0; ; debut += TAILLE_PAGE) {
    const { data, error } = await requete().range(debut, debut + TAILLE_PAGE - 1)
    if (error || !data) break
    tout = tout.concat(data)
    if (data.length < TAILLE_PAGE) break
  }
  return tout
}

/* Médicaments d'une espèce exotique : recherche, puis les catégories qui
   ont au moins une fiche pour cette espèce, comme la Pharmacologie du
   chien et du chat. Chaque catégorie ouvre sa liste (ExotiqueCategorie). */
export default function ExotiqueMedicaments() {
  const navigate = useNavigate()
  const { espece, connue, inconnue } = useEspeceExotique(e => `Médicaments ${NOMS_EXOTIQUES[e].du}`, '/medicaments')
  const { estPro, estEquipe, teamId, lectureSeule } = useProfil()
  const [catalogue, setCatalogue] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [dropdownOuvert, setDropdownOuvert] = useState(false)
  const [showProMsg, setShowProMsg] = useState(false)

  useEffect(() => {
    if (!connue) return
    let actif = true
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      const champs = 'id, nom, categorie, especes'
      // Fiches de base, et fiches créées par la personne ou sa clinique (pas les versions modifiées d'une fiche de base).
      const [meds, custom] = await Promise.all([
        toutLire(() => supabase.from('medicaments').select(champs).order('nom')),
        toutLire(() => estEquipe && teamId
          ? supabase.from('medicaments_custom').select(champs).eq('equipe_id', teamId).is('medicament_id', null).order('nom')
          : supabase.from('medicaments_custom').select(champs).eq('user_id', user?.id).is('equipe_id', null).is('medicament_id', null).order('nom')),
      ])
      const pourEspece = [...meds, ...custom].filter(m => m.especes?.includes(espece))
      if (actif) setCatalogue(pourEspece.sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    }
    charger()
    return () => { actif = false }
  }, [espece, connue, estEquipe, teamId])

  // Catégories de l'espèce, dans l'ordre de la liste, avec leur nombre de fiches.
  const categories = useMemo(() => {
    if (!catalogue) return []
    const compte = {}
    for (const m of catalogue) if (m.categorie) compte[m.categorie] = (compte[m.categorie] || 0) + 1
    return CATEGORIES_EXOTIQUES.filter(c => compte[c]).map(c => ({ nom: c, nombre: compte[c] }))
  }, [catalogue])

  const resultats = useMemo(() => {
    if (!catalogue || !recherche.trim()) return []
    return catalogue.filter(m => correspond(m.nom, recherche)).slice(0, 25)
  }, [catalogue, recherche])

  if (inconnue) return <Navigate to="/exotiques" replace />
  if (!connue) return null

  return (
    <div className="page-calculateurs">

      {/* ─── RECHERCHE ─────────────────────────── */}
      <div className="champ" style={{ position: 'relative', zIndex: 10, marginBottom: 8 }}>
        <div className="recherche-wrapper">
          <i className="ti ti-search recherche-icone"></i>
          <input
            type="text"
            className="recherche-input"
            placeholder="Rechercher un médicament..."
            value={recherche}
            onChange={e => { setRecherche(e.target.value); setDropdownOuvert(true) }}
            onFocus={() => setDropdownOuvert(true)}
            onBlur={() => setTimeout(() => setDropdownOuvert(false), 150)}
          />
          {recherche && (
            <button className="recherche-clear" onClick={() => { setRecherche(''); setDropdownOuvert(false) }}>
              <i className="ti ti-x"></i>
            </button>
          )}
        </div>

        {dropdownOuvert && recherche.length > 0 && (
          <div className="recherche-dropdown">
            {resultats.length > 0 ? resultats.map(m => (
              <div
                key={m.id}
                className="recherche-item"
                onClick={() => { navigate(`/drogues/fiche/${m.id}`); setRecherche(''); setDropdownOuvert(false) }}
              >
                <span className="recherche-item-nom">{m.nom}</span>
                {m.categorie && <span className="recherche-cat">{m.categorie}</span>}
              </div>
            )) : (
              <div className="recherche-item recherche-vide">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      <LienFavoris />

      {/* ─── CATÉGORIES DE L'ESPÈCE ────────────── */}
      {catalogue === null ? (
        <div className="admin-vide">Chargement…</div>
      ) : categories.length === 0 ? (
        <div className="admin-vide">Aucun médicament pour {NOMS_EXOTIQUES[espece].le} pour l'instant.</div>
      ) : (
        <div className="menu-page-section-liste">
          {categories.map((c, idx) => (
            <button
              key={c.nom}
              className="menu-page-item"
              onClick={() => navigate(`/exotiques/${espece}/medicaments/${slugCategorie(c.nom)}`)}
              style={{ borderBottom: idx < categories.length - 1 ? '1px solid var(--border)' : 'none', color: c.nom === 'Urgence' ? 'var(--accent-red)' : undefined }}
            >
              <span className="menu-page-item-label">{c.nom}</span>
              <span className="menu-page-item-compte">{c.nombre}</span>
              <i className="ti ti-chevron-right menu-page-item-chevron"></i>
            </button>
          ))}
        </div>
      )}

      {/* Un membre de la clinique consulte les médicaments sans en ajouter. */}
      {!lectureSeule && (
        <button
          className="btn-fab"
          aria-label={estPro ? 'Ajouter un médicament' : 'Ajouter un médicament (fonctionnalité Pro)'}
          onClick={() => estPro ? navigate(`/drogues/ajouter?espece=${espece}`) : setShowProMsg(true)}
        >
          +
          {!estPro && (
            <span aria-hidden="true" style={{ position: 'absolute', top: -3, right: -3, width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-lock" style={{ fontSize: 12 }}></i>
            </span>
          )}
        </button>
      )}

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
