import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'
import PopupPro from '../components/PopupPro'
import { useProfil } from '../context/ProfilContext'

const SOINS_GENERAUX = [
  { id: 'ecg', label: 'ECG', route: '/chirurgie/ecg', pro: true },
  { id: 'dentisterie', label: 'Dentisterie', route: '/soins-generaux/dentisterie', pro: true },
  { id: 'abreviations', label: 'Abréviations courantes', route: '/soins-generaux/abreviations', pro: true },
  { id: 'termes-directionnels', label: 'Termes directionnels', route: '/soins-generaux/termes-directionnels', pro: true },
]

export default function SoinsGeneraux() {
  const navigate = useNavigate()
  const { estPro } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)

  return (
    <div className="page-calculateurs">
      <div className="menu-page-section-liste">
        {SOINS_GENERAUX.map((s, idx) => (
          <button
            key={s.id}
            className="menu-page-item"
            onClick={() => s.pro && !estPro ? setShowProMsg(true) : navigate(s.route)}
            style={{ borderBottom: idx < SOINS_GENERAUX.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative' }}
          >
            <span className="menu-page-item-label">{s.label}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
            {s.pro && <BadgePro />}
          </button>
        ))}
      </div>
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
