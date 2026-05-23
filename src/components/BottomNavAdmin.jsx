import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNavAdmin() {
  const navigate = useNavigate()
  const location = useLocation()

  function estActif(route) {
    return location.pathname === route || location.pathname.startsWith(route + '/')
  }

  return (
    <nav className="bottom-nav-v2">
      <button
        className="bottom-nav-v2-btn"
        onClick={() => navigate('/accueil')}
      >
        <i className="ti ti-home"></i>
        <span>Accueil</span>
      </button>
      <button
        className={`bottom-nav-v2-btn ${location.pathname === '/admin' ? 'active' : ''}`}
        onClick={() => navigate('/admin')}
      >
        <i className="ti ti-layout-dashboard"></i>
        <span>Admin</span>
      </button>
      <button
        className={`bottom-nav-v2-btn ${estActif('/admin/medicaments') ? 'active' : ''}`}
        onClick={() => navigate('/admin/medicaments')}
      >
        <i className="ti ti-pill"></i>
        <span>Médicaments</span>
      </button>
      <button
        className={`bottom-nav-v2-btn ${estActif('/admin/labo') ? 'active' : ''}`}
        onClick={() => navigate('/admin/labo')}
      >
        <i className="ti ti-flask"></i>
        <span>Labo</span>
      </button>
    </nav>
  )
}