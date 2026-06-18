import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'

const REFERENCES = [
  { id: 'electrodes', label: 'Positionnement des électrodes', icone: 'ti-plug', route: '/chirurgie/ecg/electrodes', pro: true },
  { id: 'anomalies', label: 'Anomalies courantes', icone: 'ti-alert-triangle', route: '/chirurgie/ecg/anomalies', pro: true },
]

export default function ChirurgieECG() {
  const navigate = useNavigate()

  return (
    <div className="drogues-page">

      <div className="labo-section-titre">Électrocardiographie (ECG)</div>

      <div className="labo-protocoles-grid">
        {REFERENCES.map(r => (
          <button
            key={r.id}
            className="labo-protocole-btn"
            onClick={() => navigate(r.route)}
            style={{ position: 'relative' }}
          >
            <i className={`ti ${r.icone}`} style={{ fontSize: 20, marginBottom: 6, display: 'block' }}></i>
            {r.label}
            {r.pro && <BadgePro />}
          </button>
        ))}
      </div>

    </div>
  )
}
