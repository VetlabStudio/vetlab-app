import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'

const SOINS_GENERAUX = [
  { id: 'ecg', label: 'ECG', route: '/chirurgie/ecg', pro: true },
  { id: 'dentisterie', label: 'Dentisterie', route: '/soins-generaux/dentisterie', pro: true },
  { id: 'abreviations', label: 'Abréviations courantes', route: '/soins-generaux/abreviations', pro: true },
  { id: 'termes-directionnels', label: 'Termes directionnels', route: '/soins-generaux/termes-directionnels', pro: true },
]

export default function SoinsGeneraux() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="accueil-v2-drogues-grid accueil-v2-drogues-grid--1col">
        {SOINS_GENERAUX.map(s => (
          <button
            key={s.id}
            className="labo-categorie-btn"
            onClick={() => navigate(s.route)}
            style={{ position: 'relative' }}
          >
            <span>{s.label}</span>
            {s.pro && <BadgePro />}
          </button>
        ))}
      </div>
    </div>
  )
}
