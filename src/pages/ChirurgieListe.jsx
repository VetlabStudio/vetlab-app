import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'

const CHIRURGIE = [
  { id: 'instruments', label: 'Instruments de chirurgie', route: '/chirurgie/instruments', pro: true },
  { id: 'tubes', label: 'Tubes endotrachéaux', route: '/chirurgie/tubes', pro: true },
  { id: 'capnographie', label: 'Interprétation de la capnographie', route: '/chirurgie/capnographie', pro: true },
  { id: 'post-op', label: 'Soins post-opératoires', route: '/chirurgie/post-op', pro: true },
  { id: 'douleur', label: 'Évaluation de la douleur post-opératoire', route: '/chirurgie/douleur' },
]

export default function ChirurgieListe() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="accueil-v2-drogues-grid accueil-v2-drogues-grid--1col">
        {CHIRURGIE.map(c => (
          <button
            key={c.id}
            className="labo-categorie-btn"
            onClick={() => navigate(c.route)}
            style={{ position: 'relative' }}
          >
            <span>{c.label}</span>
            
            {c.pro && <BadgePro />}
          </button>
        ))}
      </div>
    </div>
  )
}
