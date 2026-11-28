import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'

const SOUS_PAGES = [
  { id: 'charte-chien', label: t('Charte dentaire - Chien'), icone: 'ti-clipboard-list', route: '/soins-generaux/dentisterie/charte-chien' },
  { id: 'charte-chat', label: t('Charte dentaire - Chat'), icone: 'ti-clipboard-list', route: '/soins-generaux/dentisterie/charte-chat' },
  { id: 'termes-directionnels', label: t('Termes directionnels'), icone: 'ti-list-check', route: '/soins-generaux/dentisterie/termes-directionnels' },
]

export default function SoinsGenerauxDentisterie() {
  const navigate = useNavigate()

  return (
    <div className="drogues-page">
      <div className="labo-protocoles-grid">
        {SOUS_PAGES.map(s => (
          <button key={s.id} className="labo-protocole-btn" onClick={() => navigate(s.route)}>
            <i className={`ti ${s.icone}`} style={{ fontSize: 20, color: 'var(--primary)', flexShrink: 0 }}></i>
            <span style={{ flex: 1 }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
