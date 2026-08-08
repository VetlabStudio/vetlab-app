import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'

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

      {showProMsg && (
        <div className="popup-overlay" onClick={() => setShowProMsg(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Fonctionnalité Pro</span>
              <button className="popup-close" onClick={() => setShowProMsg(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                L'ajout de médicaments personnalisés est réservé au forfait <strong>Pro</strong>.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
                Passe au forfait Pro pour accéder à cette fonctionnalité.
              </p>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => { setShowProMsg(false); navigate('/abonnement') }}>Voir les forfaits</button>
          </div>
        </div>
      )}
    </div>
  )
}
