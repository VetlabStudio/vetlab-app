import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

const DROGUES = [
  { id: 'anesthesiques',     label: 'Anesthésiques /\nAnalgésiques', route: '/drogues/anesthesiques', accent: false },
  { id: 'antagonistes',      label: 'Antagonistes',                   route: '/drogues/antagonistes',   accent: false },
  { id: 'antibiotiques',     label: 'Antibiotiques',                  route: '/drogues/antibiotiques',  accent: false },
  { id: 'antidiarrheiques',  label: 'Antidiarrhéiques',               route: '/drogues/antidiarrheiques', accent: false },
  { id: 'antiemetiques',     label: 'Antiémétiques',                  route: '/drogues/antiemetiques',  accent: false },
  { id: 'antihistaminiques', label: 'Antihistaminiques',              route: '/drogues/antihistaminiques', accent: false },
  { id: 'cardiovasculaires', label: 'Cardiovasculaires',              route: '/drogues/cardiovasculaires', accent: false },
  { id: 'gastroprotecteurs', label: 'Gastroprotecteurs',              route: '/drogues/gastroprotecteurs', accent: false },
  { id: 'neurologiques',     label: 'Neurologiques',                  route: '/drogues/neurologiques',  accent: false },
  { id: 'respiratoires',     label: 'Respiratoires',                  route: '/drogues/respiratoires',  accent: false },
  { id: 'urgence',           label: 'Urgence',                        route: '/drogues/urgence',        accent: true },
]

export default function Pharmacologie() {
  const navigate = useNavigate()
  const { estPro, estEquipe, teamId } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])
  const [dropdownOuvert, setDropdownOuvert] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!recherche.trim()) { setResultats([]); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => chercher(recherche), 200)
    return () => clearTimeout(timerRef.current)
  }, [recherche])

  async function chercher(terme) {
    const { data: { user } } = await supabase.auth.getUser()
    const q = terme.trim()

    const [{ data: meds }, { data: custom }] = await Promise.all([
      supabase.from('medicaments').select('id, nom, categorie, sous_categories, especes').ilike('nom', `%${q}%`).order('nom').limit(20),
      estEquipe && teamId
        ? supabase.from('medicaments_custom').select('id, nom, categorie, sous_categories, especes').eq('equipe_id', teamId).ilike('nom', `%${q}%`).order('nom').limit(10)
        : supabase.from('medicaments_custom').select('id, nom, categorie, sous_categories, especes').eq('user_id', user.id).ilike('nom', `%${q}%`).order('nom').limit(10),
    ])

    setResultats([...(meds || []), ...(custom || [])].sort((a, b) => a.nom.localeCompare(b.nom)).slice(0, 25))
  }

  return (
    <div className="page-calculateurs">

      {/* ─── RECHERCHE GLOBALE ─────────────────── */}
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
                <span className="recherche-cat">
                  {m.categorie}{m.sous_categories?.length > 0 ? ` — ${m.sous_categories.join(', ')}` : ''}
                </span>
              </div>
            )) : (
              <div className="recherche-item recherche-vide">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      {/* ─── LISTE CATÉGORIES ──────────────────── */}
      <div className="menu-page-section-liste">
        {DROGUES.map((d, idx) => (
          <button
            key={d.id}
            className="menu-page-item"
            onClick={() => navigate(d.route)}
            style={{ borderBottom: idx < DROGUES.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative', color: d.accent ? 'var(--accent-red)' : d.favori ? 'var(--primary-light)' : undefined }}
          >
            <span className="menu-page-item-label">{d.label}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
            {d.pro && <BadgePro />}
          </button>
        ))}
      </div>

      <button className="btn-fab" onClick={() => estPro ? navigate('/drogues/ajouter') : setShowProMsg(true)}>
        {estPro ? '+' : <i className="ti ti-lock" style={{ fontSize: 20 }}></i>}
      </button>

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
