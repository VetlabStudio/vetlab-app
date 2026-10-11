import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'
import LienFavoris from '../components/LienFavoris'
import { correspond } from '../lib/recherche'

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
  const [catalogue, setCatalogue] = useState([])
  const [dropdownOuvert, setDropdownOuvert] = useState(false)

  /* Les noms sont chargés une seule fois puis filtrés sur place : la
     recherche ignore ainsi les accents, les majuscules et les traits
     d'union (« cefalexine » trouve « Céfalexine »), ce que le filtre
     ilike de la base ne permet pas. */
  useEffect(() => {
    let actif = true
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      const champs = 'id, nom, categorie, sous_categories, especes'
      const [{ data: meds }, { data: custom }] = await Promise.all([
        supabase.from('medicaments').select(champs).order('nom'),
        estEquipe && teamId
          ? supabase.from('medicaments_custom').select(champs).eq('equipe_id', teamId)
          : supabase.from('medicaments_custom').select(champs).eq('user_id', user?.id),
      ])
      if (actif) setCatalogue([...(meds || []), ...(custom || [])].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
    }
    charger()
    return () => { actif = false }
  }, [estEquipe, teamId])

  const resultats = useMemo(() => {
    if (!recherche.trim()) return []
    return catalogue.filter(m => correspond(m.nom, recherche)).slice(0, 25)
  }, [catalogue, recherche])

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
                  {m.especes?.join(' / ')}{m.sous_categories?.length > 0 ? ` — ${m.sous_categories.join(', ')}` : ''}
                </span>
              </div>
            )) : (
              <div className="recherche-item recherche-vide">Aucun résultat</div>
            )}
          </div>
        )}
      </div>

      <LienFavoris />

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

      <button
        className="btn-fab"
        aria-label={estPro ? 'Ajouter un médicament' : 'Ajouter un médicament (fonctionnalité Pro)'}
        onClick={() => estPro ? navigate('/drogues/ajouter') : setShowProMsg(true)}
      >
        +
        {!estPro && (
          <span aria-hidden="true" style={{ position: 'absolute', top: -3, right: -3, width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-lock" style={{ fontSize: 12 }}></i>
          </span>
        )}
      </button>

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
