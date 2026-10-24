import { useNavigate, useLocation } from 'react-router-dom'

// Mêmes icônes maison que la barre principale (BottomNav), dans le même style.
const ONGLETS = [
  { label: 'Accueil', svg: '/icone-accueil-nav.svg', route: '/accueil', actif: () => false },
  { label: 'Admin', svg: '/icone-admin-nav.svg', route: '/admin', actif: chemin => chemin === '/admin' || chemin === '/admin/comptes' || chemin === '/admin/signalements' },
  { label: 'Médicaments', svg: '/icone-pill-nav.svg', route: '/admin/medicaments', actif: chemin => chemin.startsWith('/admin/medicaments') },
  { label: 'Labo', svg: '/icone-labo-nav.svg', route: '/admin/labo', actif: chemin => chemin.startsWith('/admin/labo') },
]

export default function BottomNavAdmin() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bottom-nav-v2">
      {ONGLETS.map(o => (
        <button
          key={o.route}
          className={`bottom-nav-v2-btn ${o.actif(location.pathname) ? 'active' : ''}`}
          onClick={() => navigate(o.route)}
        >
          <span className="bottom-nav-v2-icone-zone">
            <img src={o.svg} alt="" className="bottom-nav-v2-icone" />
          </span>
          <span>{o.label}</span>
        </button>
      ))}
    </nav>
  )
}
