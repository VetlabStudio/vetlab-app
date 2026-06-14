import { useNavigate } from 'react-router-dom'

const SOINS_GENERAUX = [
  { id: 'ecg', label: 'ECG', route: '/chirurgie/ecg' },
]

export default function SoinsGeneraux() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="accueil-v2-drogues-grid">
        {SOINS_GENERAUX.map(s => (
          <button
            key={s.id}
            className="accueil-v2-drogue-item"
            onClick={() => navigate(s.route)}
          >
            <span>{s.label}</span>
            <i className="ti ti-chevron-right accueil-v2-chevron"></i>
          </button>
        ))}
      </div>
    </div>
  )
}
