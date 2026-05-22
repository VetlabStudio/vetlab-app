import { useNavigate, useLocation } from 'react-router-dom'

const titres = {
  '/accueil': 'Accueil',
  '/calculateurs': 'Calculateur de dosage',
  '/drogues': 'Drogues',
  '/profil': 'Profil',
  '/drogues/anesthesiques': 'Drogues anesthésiques',
  '/admin/medicaments': 'Admin — Médicaments',
  '/calculateurs/cri': 'CRI',
  '/calculateurs/fluido': 'Fluidothérapie',
  '/calculateurs/conversion': 'Conversion',
  '/calculateurs/besoin': 'Besoin énergétique',
  '/calculateurs/dilution': 'Dilution C1V1-C2V2',
  '/calculateurs/transfusion': 'Transfusion sanguine',
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const titre = titres[location.pathname] || 'Vetlab Studio'
  const peutReculer = location.pathname !== '/accueil'

if (location.pathname === '/accueil') return null

return (
  <div className="header">
    {peutReculer && (
      <button className="header-back" onClick={() => navigate(-1)}>
        <i className="ti ti-arrow-left"></i>
      </button>
    )}
    <span>{titre}</span>
  </div>
)
}