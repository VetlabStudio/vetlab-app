import { useNavigate } from 'react-router-dom'

const LIENS = [
  { id: 'profil', label: 'Profil', icone: 'ti-user', route: '/profil' },
  { id: 'sources', label: 'Sources et références', icone: 'ti-books', route: '/sources-references' },
  { id: 'disclaimer', label: 'Avertissement', icone: 'ti-alert-triangle', route: '/disclaimer' },
  { id: 'confidentialite', label: 'Politique de confidentialité', icone: 'ti-lock', route: '/politique-confidentialite' },
  { id: 'termes', label: 'Termes et services', icone: 'ti-file-text', route: '/termes-services' },
  { id: 'aide', label: 'Aide', icone: 'ti-help-circle', route: '/aide' },
]

export default function MenuOverlay({ onClose }) {
  const navigate = useNavigate()

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <span>Menu</span>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <div className="menu-overlay-liste">
          {LIENS.map(lien => (
            <button
              key={lien.id}
              className="menu-overlay-item"
              onClick={() => { onClose(); navigate(lien.route) }}
            >
              <i className={`ti ${lien.icone}`}></i>
              <span>{lien.label}</span>
              <i className="ti ti-chevron-right"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
