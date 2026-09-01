import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

const DROGUES = [
  { id: 'anesthesiques',     label: 'Anesthésiques /\nAnalgésiques', route: '/drogues/anesthesiques', accent: false },
  { id: 'antagonistes',      label: 'Antagonistes',                   route: '/drogues/antagonistes',   accent: false },
  { id: 'antibiotiques',     label: 'Antibiotiques',                  route: '/drogues/antibiotiques',  accent: false },
  { id: 'antidiarrheiques',  label: 'Antidiarrhéiques',               route: '/drogues/antidiarrheiques', accent: false },
  { id: 'antiemetiques',     label: 'Antiémétiques',                  route: '/drogues/antiemetiques',  accent: false },
  { id: 'antihistaminiques', label: 'Antihistaminiques',              route: '/drogues/antihistaminiques', accent: false },
  { id: 'cardiovasculaires', label: 'Cardiovasculaires',              route: '/drogues/cardiovasculaires', accent: false },
  { id: 'gastroprotecteurs', label: 'Gastroprotecteurs',              route: '/drogues/gastroprotecteurs', accent: false },
  { id: 'neurologiques',     label: 'Neurologiques',                  route: '/drogues/neurologiques',  accent: false },
  { id: 'respiratoires',     label: 'Respiratoires',                  route: '/drogues/respiratoires',  accent: false },
  { id: 'urgence',           label: 'Urgence',                        route: '/drogues/urgence',        accent: true },
]

export default function Pharmacologie() {
  const navigate = useNavigate()
  const { estPro } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)

  return (
    <div className="page-calculateurs">
      <div className="menu-page-section-liste">
        {DROGUES.map((d, idx) => (
          <button
            key={d.id}
            className="menu-page-item"
            onClick={() => navigate(d.route)}
            style={{ borderBottom: idx < DROGUES.length - 1 ? '1px solid var(--border)' : 'none', position: 'relative', color: d.accent ? 'var(--accent-red)' : d.favori ? 'var(--primary-light)' : undefined }}
          >
            <span className="menu-page-item-label">{d.label}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
            {d.pro && <BadgePro />}
          </button>
        ))}
      </div>

      <button className="btn-fab" onClick={() => estPro ? navigate('/drogues/ajouter') : setShowProMsg(true)}>
        {estPro ? '+' : <i className="ti ti-lock" style={{ fontSize: 20 }}></i>}
      </button>

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
