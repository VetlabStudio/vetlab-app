import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'

const CHIRURGIE = [
  { id: 'instruments', label: 'Instruments de chirurgie', route: '/chirurgie/instruments', pro: true },
  { id: 'tubes', label: 'Tubes endotrachéaux', route: '/chirurgie/tubes', pro: true },
  { id: 'monitoring', label: 'Monitoring anesthésique', route: '/chirurgie/monitoring', pro: true },
  { id: 'capnographie', label: 'Interprétation de la capnographie', route: '/chirurgie/capnographie', pro: true },
  { id: 'post-op', label: 'Soins post-opératoires', route: '/chirurgie/post-op', pro: true },
  { id: 'douleur', label: 'Évaluation de la douleur', route: '/chirurgie/douleur' },
]

export default function ChirurgieListe() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="accueil-v2-drogues-grid">
        {CHIRURGIE.map(c => (
          <button
            key={c.id}
            className="accueil-v2-drogue-item"
            onClick={() => navigate(c.route)}
            style={{ position: 'relative' }}
          >
            <span>{c.label}</span>
            <i className="ti ti-chevron-right accueil-v2-chevron"></i>
            {c.pro && <BadgePro />}
          </button>
        ))}
      </div>
    </div>
  )
}
