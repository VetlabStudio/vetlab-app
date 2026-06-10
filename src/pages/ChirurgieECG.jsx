import { useNavigate } from 'react-router-dom'

const REFERENCES = [
  { id: 'electrodes', label: 'Positionnement des électrodes', icone: 'ti-plug', route: '/chirurgie/ecg/electrodes' },
  { id: 'interpretation', label: 'Interprétation', icone: 'ti-wave-sine', route: '/chirurgie/ecg/interpretation' },
  { id: 'anomalies', label: 'Anomalies courantes', icone: 'ti-alert-triangle', route: '/chirurgie/ecg/anomalies' },
  { id: 'conduction', label: 'Conduction cardiaque', icone: 'ti-heart', route: '/chirurgie/ecg/conduction' },
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
          >
            <i className={`ti ${r.icone}`} style={{ fontSize: 20, marginBottom: 6, display: 'block' }}></i>
            {r.label}
          </button>
        ))}
      </div>

    </div>
  )
}
