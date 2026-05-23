import { useNavigate, useLocation } from 'react-router-dom'

const ONGLETS = [
  { id: 'accueil',    label: 'Accueil',              icone: 'ti-home',        route: '/accueil' },
  { id: 'calculateurs', label: 'Calcul rapide\nde dosage', icone: 'ti-calculator', route: '/calculateurs' },
  { id: 'drogues', label: 'Médicaments favoris', icone: 'ti-pill', route: '/drogues/mes-drogues' },
  { id: 'profil',     label: 'Profil',               icone: 'ti-user',        route: '/profil' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

function estActif(route) {
  if (route === '/accueil') return location.pathname === '/accueil'
  if (route === '/calculateurs') return location.pathname === '/calculateurs'
  if (route === '/drogues/mes-drogues') return location.pathname === '/drogues/mes-drogues'
  if (route === '/profil') return location.pathname === '/profil'
  return false
}

  return (
    <nav className="bottom-nav-v2">
      {ONGLETS.map(o => (
        <button
          key={o.id}
          className={`bottom-nav-v2-btn ${estActif(o.route) ? 'active' : ''}`}
          onClick={() => navigate(o.route)}
        >
          <i className={`ti ${o.icone}`}></i>
          <span>{o.label}</span>
        </button>
      ))}
    </nav>
  )
}
