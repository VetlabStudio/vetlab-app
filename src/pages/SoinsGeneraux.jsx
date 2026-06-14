import { useNavigate } from 'react-router-dom'

const SOINS_GENERAUX = [
  { id: 'ecg', label: 'ECG', route: '/chirurgie/ecg' },
]

export default function SoinsGeneraux() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="labo-categories-grid">
        {SOINS_GENERAUX.map(s => (
          <button
            key={s.id}
            className="labo-categorie-btn"
            onClick={() => navigate(s.route)}
          >
            <span>{s.label}</span>
            
          </button>
        ))}
      </div>
    </div>
  )
}
