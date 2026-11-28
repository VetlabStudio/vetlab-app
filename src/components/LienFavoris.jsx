import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import BadgePro from './BadgePro'

// Raccourci vers « Mes médicaments favoris » (Pharmacologie et Calcul rapide).
export default function LienFavoris() {
  const navigate = useNavigate()

  return (
    <button className="lien-favoris" onClick={() => navigate('/drogues/mes-drogues')}>
      <span className="lien-favoris-icone" aria-hidden="true">★</span>
      <span className="lien-favoris-texte">{t('Mes médicaments favoris')}</span>
      <BadgePro enLigne />
      <i className="ti ti-chevron-right" aria-hidden="true"></i>
    </button>
  )
}
