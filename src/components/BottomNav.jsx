import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavGuardContext, NavDirectionContext } from '../App'
import { useProfil } from '../context/ProfilContext'
import useNotificationsNonLues from '../hooks/useNotificationsNonLues'

// Les favoris sont accessibles depuis Pharmacologie et Calcul rapide.
const ONGLETS_BASE = [
  { id: 'accueil',      label: 'Accueil',            svg: '/icone-accueil-nav.svg', route: '/accueil' },
  { id: 'calculateurs', label: 'Calcul rapide',       svg: '/icone-calc-nav.svg',    route: '/calculateurs' },
  { id: 'notes',        label: 'Notes',               svg: '/icone-note-nav.svg',    route: '/notes' },
]

const ONGLETS_EQUIPE = [
  { id: 'accueil',      label: 'Accueil',            svg: '/icone-accueil-nav.svg', route: '/accueil' },
  { id: 'calculateurs', label: 'Calcul rapide',       svg: '/icone-calc-nav.svg',    route: '/calculateurs' },
  { id: 'notes',        label: 'Notes',               svg: '/icone-note-nav.svg',    route: '/notes' },
  { id: 'equipe',       label: 'Équipe',              svg: '/icone-equipe-nav.svg',  route: '/equipe' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { demanderConfirmation } = useContext(NavGuardContext)
  const { skipNextRef } = useContext(NavDirectionContext)
  const { estEquipe } = useProfil()
  const nonLues = useNotificationsNonLues(estEquipe)

  const ONGLETS = estEquipe ? ONGLETS_EQUIPE : ONGLETS_BASE

  function allerVers(action) {
    skipNextRef.current = true
    demanderConfirmation(action)
  }

  function estActif(route) {
    if (route === '/accueil') return location.pathname === '/accueil'
    if (route === '/calculateurs') return location.pathname === '/calculateurs'
    if (route === '/notes') return location.pathname.startsWith('/notes')
    if (route === '/equipe') return location.pathname.startsWith('/equipe')
    return false
  }

  return (
    <nav className="bottom-nav-v2">
      {ONGLETS.map(o => {
        // Pastille de notifications sur l'onglet Équipe seulement.
        const pastille = o.id === 'equipe' && nonLues > 0
        return (
          <button
            key={o.id}
            className={`bottom-nav-v2-btn ${estActif(o.route) ? 'active' : ''}`}
            onClick={() => allerVers(() => { navigate('/accueil', { replace: true }); navigate(o.route) })}
            aria-label={pastille ? `${o.label}, ${nonLues} notification${nonLues > 1 ? 's' : ''} non lue${nonLues > 1 ? 's' : ''}` : undefined}
          >
            <span className="bottom-nav-v2-icone-zone">
              <img src={o.svg} alt="" className="bottom-nav-v2-icone" />
              {pastille && <span className="bottom-nav-v2-pastille" aria-hidden="true">{nonLues > 9 ? '9+' : nonLues}</span>}
            </span>
            <span>{o.label}</span>
          </button>
        )
      })}
      <button
        className={`bottom-nav-v2-btn ${location.pathname === '/menu' ? 'active' : ''}`}
        onClick={() => allerVers(() => navigate('/menu'))}
      >
        <i className="ti ti-menu-2"></i>
        <span>Plus</span>
      </button>
    </nav>
  )
}
