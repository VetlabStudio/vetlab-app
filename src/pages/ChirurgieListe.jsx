import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'
import PopupPro from '../components/PopupPro'
import { useProfil } from '../context/ProfilContext'

const CHIRURGIE = [
  { id: 'instruments', label: 'Instruments de chirurgie', route: '/chirurgie/instruments', pro: true },
  { id: 'tubes', label: 'Tubes endotrachéaux', route: '/chirurgie/tubes', pro: true },
  { id: 'capnographie', label: 'Interprétation de la capnographie', route: '/chirurgie/capnographie', pro: true },
  { id: 'post-op', label: 'Soins post-opératoires', route: '/chirurgie/post-op', pro: true },
  { id: 'douleur', label: 'Évaluation de la douleur post-opératoire', route: '/chirurgie/douleur' },
]

export default function ChirurgieListe() {
  const navigate = useNavigate()
  const { estPro } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)

  return (
    <div className="page-calculateurs">
      <div className="menu-page-section-liste">
        {CHIRURGIE.map((c, idx) => (
          <button
            key={c.id}
            className="menu-page-item"
            onClick={() => c.pro && !estPro ? setShowProMsg(true) : navigate(c.route)}
            style={{ borderBottom: idx < CHIRURGIE.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative' }}
          >
            <span className="menu-page-item-label">{c.label}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
            {c.pro && <BadgePro />}
          </button>
        ))}
      </div>
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
