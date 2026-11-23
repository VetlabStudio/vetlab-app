import { useNavigate } from 'react-router-dom'
import { useProfil } from '../context/ProfilContext'
import { t, langue, LANGUES, changerLangue } from '../lib/i18n'

const SECTIONS = [
  {
    titre: t('Mon compte'),
    items: [
      { id: 'profil', label: t('Profil'), icone: 'ti-user', route: '/profil' },
      { id: 'abonnement', label: t('Abonnement'), icone: 'ti-crown', route: '/abonnement' },
    ],
  },
  {
    titre: t('Ressources'),
    items: [
      { id: 'sources', label: t('Sources et références'), icone: 'ti-books', route: '/sources-references' },
      { id: 'aide', label: t('Aide et tutoriels'), icone: 'ti-help-circle', route: '/aide' },
    ],
  },
  {
    titre: t('Légal'),
    items: [
      { id: 'disclaimer', label: t('Avertissement'), icone: 'ti-alert-triangle', route: '/disclaimer' },
      { id: 'confidentialite', label: t('Politique de confidentialité'), icone: 'ti-lock', route: '/politique-confidentialite' },
      { id: 'termes', label: t('Termes et services'), icone: 'ti-file-text', route: '/termes-services' },
    ],
  },
]

export default function Menu() {
  const navigate = useNavigate()
  const { profil, estPro, estEquipe } = useProfil()

  return (
    <div className="menu-page">
      <div className="menu-page-profil-banner">
        <div className="menu-page-avatar">
          {profil?.avatar_url
            ? <img src={profil.avatar_url} alt={t('Avatar')} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : <i className="ti ti-user" style={{ fontSize: 28, color: 'var(--primary)' }}></i>
          }
        </div>
        <div>
          <p className="menu-page-profil-nom">{profil?.nom || profil?.email || t('Mon compte')}</p>
          <span className={`menu-page-badge-plan ${estEquipe ? 'equipe' : estPro ? 'pro' : 'gratuit'}`}>
            {estEquipe ? t('Équipe') : estPro ? 'Pro' : t('Gratuit')}
          </span>
        </div>
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

      {/* Langue de l'app : le nom de chaque langue reste dans sa propre langue. */}
      <div className="menu-page-section">
        <p className="menu-page-section-titre">{t('Langue')} / {langue === 'fr' ? 'Language' : 'Langue'}</p>
        <div className="drogues-filtres" role="group" aria-label={t('Langue')} style={{ padding: 0 }}>
          {LANGUES.map(l => (
            <button
              key={l.id}
              lang={l.id}
              className={`drogues-filtre-btn ${langue === l.id ? 'actif' : ''}`}
              aria-pressed={langue === l.id}
              onClick={() => changerLangue(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <p className="menu-page-version">Adjuvet © {new Date().getFullYear()}</p>
    </div>
  )
}
