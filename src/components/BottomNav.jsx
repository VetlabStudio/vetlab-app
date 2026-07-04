import { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MenuOverlay from './MenuOverlay'
import { NavGuardContext } from '../App'
import { useProfil } from '../context/ProfilContext'

const ONGLETS_BASE = [
  { id: 'accueil',      label: 'Accueil',            icone: 'ti-home',        route: '/accueil' },
  { id: 'calculateurs', label: 'Calcul rapide',       icone: 'ti-calculator',  route: '/calculateurs' },
  { id: 'drogues',      label: 'Médicaments favoris', icone: 'ti-pill',        route: '/drogues/mes-drogues' },
  { id: 'notes',        label: 'Notes',               icone: 'ti-notes',       route: '/notes' },
]

const ONGLETS_EQUIPE = [
  { id: 'accueil',      label: 'Accueil',            icone: 'ti-home',        route: '/accueil' },
  { id: 'calculateurs', label: 'Calcul rapide',       icone: 'ti-calculator',  route: '/calculateurs' },
  { id: 'drogues',      label: 'Médicaments favoris', icone: 'ti-pill',        route: '/drogues/mes-drogues' },
  { id: 'equipe',       label: 'Équipe',              icone: 'ti-users',       route: '/equipe' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const { demanderConfirmation } = useContext(NavGuardContext)
  const { estEquipe } = useProfil()

  const ONGLETS = estEquipe ? ONGLETS_EQUIPE : ONGLETS_BASE

  function allerVers(action) {
    demanderConfirmation(action)
  }

  function estActif(route) {
    if (route === '/accueil') return location.pathname === '/accueil'
    if (route === '/calculateurs') return location.pathname === '/calculateurs'
    if (route === '/drogues/mes-drogues') return location.pathname === '/drogues/mes-drogues'
    if (route === '/notes') return location.pathname.startsWith('/notes')
    if (route === '/equipe') return location.pathname.startsWith('/equipe')
    return false
  }

  return (
    <>
      <nav className="bottom-nav-v2">
        {ONGLETS.map(o => (
          <button
            key={o.id}
            className={`bottom-nav-v2-btn ${estActif(o.route) ? 'active' : ''}`}
            onClick={() => allerVers(() => { navigate('/accueil', { replace: true }); navigate(o.route) })}
          >
            <i className={`ti ${o.icone}`}></i>
            <span>{o.label}</span>
          </button>
        ))}
        <button
          className={`bottom-nav-v2-btn ${menuOuvert ? 'active' : ''}`}
          onClick={() => allerVers(() => setMenuOuvert(true))}
        >
          <i className="ti ti-menu-2"></i>
          <span>Menu</span>
        </button>
      </nav>
      {menuOuvert && <MenuOverlay onClose={() => setMenuOuvert(false)} />}
    </>
  )
}
