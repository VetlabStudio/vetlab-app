import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavGuardContext, NavDirectionContext } from '../context/NavigationContext'
import { useProfil } from '../context/ProfilContext'
import useNotificationsNonLues from '../hooks/useNotificationsNonLues'

/* Icônes sans libellés : avec les favoris et l'équipe, une clinique a six
   onglets, trop serrés avec du texte sur un téléphone. Chaque bouton garde
   son nom pour les lecteurs d'écran (aria-label) et en info-bulle. */
const ACCUEIL      = { id: 'accueil',      label: 'Accueil',             svg: '/icone-accueil-nav.svg', route: '/accueil' }
const CALCULATEURS = { id: 'calculateurs', label: 'Calcul rapide',       svg: '/icone-calc-nav.svg',    route: '/calculateurs' }
const FAVORIS      = { id: 'favoris',      label: 'Médicaments favoris', icone: 'ti-star',              route: '/drogues/mes-drogues' }
const NOTES        = { id: 'notes',        label: 'Notes',               svg: '/icone-note-nav.svg',    route: '/notes' }
const EQUIPE       = { id: 'equipe',       label: 'Équipe',              svg: '/icone-equipe-nav.svg',  route: '/equipe' }

const ONGLETS_BASE = [ACCUEIL, CALCULATEURS, FAVORIS, NOTES]
const ONGLETS_EQUIPE = [ACCUEIL, CALCULATEURS, FAVORIS, NOTES, EQUIPE]

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
    if (route === '/drogues/mes-drogues') return location.pathname === '/drogues/mes-drogues'
    if (route === '/notes') return location.pathname.startsWith('/notes')
    if (route === '/equipe') return location.pathname.startsWith('/equipe')
    return false
  }

  return (
    <nav className="bottom-nav-v2">
      {ONGLETS.map(o => {
        // Pastille de notifications sur l'onglet Équipe seulement.
        const pastille = o.id === 'equipe' && nonLues > 0
        const actif = estActif(o.route)
        return (
          <button
            key={o.id}
            className={`bottom-nav-v2-btn ${actif ? 'active' : ''}`}
            onClick={() => allerVers(() => { navigate('/accueil', { replace: true }); navigate(o.route) })}
            aria-label={pastille ? `${o.label}, ${nonLues} notification${nonLues > 1 ? 's' : ''} non lue${nonLues > 1 ? 's' : ''}` : o.label}
            aria-current={actif ? 'page' : undefined}
            title={o.label}
          >
            <span className="bottom-nav-v2-icone-zone">
              {o.icone
                ? <i className={`ti ${o.icone}`} aria-hidden="true"></i>
                : <img src={o.svg} alt="" className="bottom-nav-v2-icone" />}
              {pastille && <span className="bottom-nav-v2-pastille" aria-hidden="true">{nonLues > 9 ? '9+' : nonLues}</span>}
            </span>
            <span className="bottom-nav-v2-indicateur" aria-hidden="true"></span>
          </button>
        )
      })}
      <button
        className={`bottom-nav-v2-btn ${location.pathname === '/menu' ? 'active' : ''}`}
        onClick={() => allerVers(() => navigate('/menu'))}
        aria-label="Plus"
        aria-current={location.pathname === '/menu' ? 'page' : undefined}
        title="Plus"
      >
        <i className="ti ti-menu-2" aria-hidden="true"></i>
        <span className="bottom-nav-v2-indicateur" aria-hidden="true"></span>
      </button>
    </nav>
  )
}
