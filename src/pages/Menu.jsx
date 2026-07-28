import { useNavigate } from 'react-router-dom'
import { useProfil } from '../context/ProfilContext'

const SECTIONS = [
  {
    titre: 'Mon compte',
    items: [
      { id: 'profil', label: 'Profil', icone: 'ti-user', route: '/profil' },
    ],
  },
  {
    titre: 'Ressources',
    items: [
      { id: 'sources', label: 'Sources et références', icone: 'ti-books', route: '/sources-references' },
      { id: 'aide', label: 'Aide', icone: 'ti-help-circle', route: '/aide' },
    ],
  },
  {
    titre: 'Légal',
    items: [
      { id: 'disclaimer', label: 'Avertissement', icone: 'ti-alert-triangle', route: '/disclaimer' },
      { id: 'confidentialite', label: 'Politique de confidentialité', icone: 'ti-lock', route: '/politique-confidentialite' },
      { id: 'termes', label: 'Termes et services', icone: 'ti-file-text', route: '/termes-services' },
    ],
  },
]

export default function Menu() {
  const navigate = useNavigate()
  const { profil, estPro, estEquipe } = useProfil()

  const prenom = profil?.nom ? profil.nom.split(' ')[0] : null

  return (
    <div className="menu-page">
      <div className="menu-page-profil-banner">
        <div className="menu-page-avatar">
          {profil?.avatar_url
            ? <img src={profil.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : <i className="ti ti-user" style={{ fontSize: 28, color: 'var(--primary)' }}></i>
          }
        </div>
        <div>
          <p className="menu-page-profil-nom">{profil?.nom || profil?.email || 'Mon compte'}</p>
          <span className={`menu-page-badge-plan ${estEquipe ? 'equipe' : estPro ? 'pro' : 'gratuit'}`}>
            {estEquipe ? 'Équipe' : estPro ? 'Pro' : 'Gratuit'}
          </span>
        </div>
        <button
          className="menu-page-profil-btn"
          onClick={() => navigate('/profil')}
        >
          <i className="ti ti-chevron-right"></i>
        </button>
      </div>

      {SECTIONS.map(section => (
        <div key={section.titre} className="menu-page-section">
          <p className="menu-page-section-titre">{section.titre}</p>
          <div className="menu-page-section-liste">
            {section.items.map((item, idx) => (
              <button
                key={item.id}
                className="menu-page-item"
                onClick={() => navigate(item.route)}
                style={{ borderBottom: idx < section.items.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <i className={`ti ${item.icone} menu-page-item-icone`}></i>
                <span className="menu-page-item-label">{item.label}</span>
                <i className="ti ti-chevron-right menu-page-item-chevron"></i>
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="menu-page-version">Adjuvet © {new Date().getFullYear()}</p>
    </div>
  )
}
