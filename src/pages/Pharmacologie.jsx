import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'

const DROGUES = [
  { id: 'anesthesiques',     label: 'Anesthésiques /\nAnalgésiques', route: '/drogues/anesthesiques', accent: false },
  { id: 'antibiotiques',     label: 'Antibiotiques',                  route: '/drogues/antibiotiques',  accent: false },
  { id: 'antidiarrheiques',  label: 'Antidiarrhéiques',               route: '/drogues/antidiarrheiques', accent: false },
  { id: 'antiemetiques',     label: 'Antiémétiques',                  route: '/drogues/antiemetiques',  accent: false },
  { id: 'antihistaminiques', label: 'Antihistaminiques',              route: '/drogues/antihistaminiques', accent: false },
  { id: 'urgence',           label: 'Urgence',                        route: '/drogues/urgence',        accent: true },
  { id: 'cardiovasculaires', label: 'Cardiovasculaires',              route: '/drogues/cardiovasculaires', accent: false },
  { id: 'gastroprotecteurs', label: 'Gastroprotecteurs',              route: '/drogues/gastroprotecteurs', accent: false },
  { id: 'neurologiques',     label: 'Neurologiques',                  route: '/drogues/neurologiques',  accent: false },
  { id: 'respiratoires',     label: 'Respiratoires',                  route: '/drogues/respiratoires',  accent: false },
  { id: 'antagonistes',      label: 'Antagonistes',                   route: '/drogues/antagonistes',   accent: false },
  { id: 'mes-drogues', label: 'Médicaments favoris', route: '/drogues/mes-drogues', accent: false, favori: true },
]

export default function Pharmacologie() {
  const navigate = useNavigate()
  const { estPro } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)

  return (
    <div className="page-calculateurs">
      <div className="accueil-v2-drogues-grid">
        {DROGUES.map(d => (
          <button
            key={d.id}
            className={`accueil-v2-drogue-item ${d.accent ? 'accent' : ''} ${d.favori ? 'favori' : ''}`}
            onClick={() => navigate(d.route)}
            style={{ position: 'relative' }}
          >
            {d.favori && <i className="ti ti-star" style={{ fontSize: 13, marginRight: 4 }}></i>}
            {d.accent && <i className="ti ti-alert-triangle" style={{ fontSize: 13, marginRight: 4 }}></i>}
            {!d.favori && !d.accent && <i className="ti ti-pill" style={{ fontSize: 13, marginRight: 4 }}></i>}
            <span>{d.label}</span>
            <i className="ti ti-chevron-right accueil-v2-chevron"></i>
            {d.pro && <BadgePro />}
          </button>
        ))}
      </div>

      <button className="btn-fab" onClick={() => estPro ? navigate('/drogues/ajouter') : setShowProMsg(true)}>+</button>

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
            <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
