import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const actif = location.pathname

  const onglets = [
    { chemin: '/accueil', icone: 'ti-home', label: 'Accueil' },
    { chemin: '/calculateurs', icone: 'ti-calculator', label: 'Calcul rapide de dosage' },
    { chemin: '/drogues', icone: 'ti-pill', label: 'Drogues' },
    { chemin: '/profil', icone: 'ti-user', label: 'Profil' },
  ]

  return (
    <nav className="bottom-nav">
      {onglets.map((onglet) => (
        <button
          key={onglet.chemin}
          className={`bottom-nav-btn ${actif === onglet.chemin ? 'active' : ''}`}
          onClick={() => navigate(onglet.chemin)}
        >
          <i className={`ti ${onglet.icone}`}></i>
          {onglet.label}
        </button>
      ))}
    </nav>
  )
}