import { useNavigate } from 'react-router-dom'
import { useProfil } from '../context/ProfilContext'

// Raccourci vers « Mes médicaments favoris » (Pharmacologie et Calcul rapide).
export default function LienFavoris() {
  const navigate = useNavigate()
  const { estPro } = useProfil()

  return (
    <button className="lien-favoris" onClick={() => navigate('/drogues/mes-drogues')}>
      <span className="lien-favoris-icone" aria-hidden="true">★</span>
      <span className="lien-favoris-texte">Mes médicaments favoris</span>
      {!estPro && <span className="lien-favoris-pro">Pro</span>}
      <i className="ti ti-chevron-right" aria-hidden="true"></i>
    </button>
  )
}
