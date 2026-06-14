import { useNavigate } from 'react-router-dom'
import BadgePro from '../components/BadgePro'

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
  { id: 'toxicologie', label: 'Toxicologie', route: '/drogues/toxicologie', accent: false, pro: true },
]

export default function Pharmacologie() {
  const navigate = useNavigate()

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
            <span>{d.label}</span>
            <i className="ti ti-chevron-right accueil-v2-chevron"></i>
            {d.pro && <BadgePro />}
          </button>
        ))}
      </div>
    </div>
  )
}
