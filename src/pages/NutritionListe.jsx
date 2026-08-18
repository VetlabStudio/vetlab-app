import { useNavigate } from 'react-router-dom'

const CONDITIONS = [
  { id: 'gestation-lactation', label: 'Gestation et lactation',      route: '/nutrition/gestation-lactation' },
  { id: 'neonatologie',        label: 'Néonatologie (0-2 semaines)', route: '/nutrition/neonatologie' },
  { id: 'croissance',          label: 'Croissance',                  route: '/nutrition/croissance' },
  { id: 'geriatrique',         label: 'Animaux gériatriques',        route: '/nutrition/geriatrique' },
  { id: 'gastro-intestinal',   label: 'Maladies gastro-intestinales', route: '/nutrition/gastro-intestinal' },
  { id: 'peau',                label: 'Maladies de peau',            route: '/nutrition/peau' },
  { id: 'diabete',             label: 'Diabète',                     route: '/nutrition/diabete' },
  { id: 'hyperthyroidisme',    label: 'Hyperthyroïdisme',            route: '/nutrition/hyperthyroidisme' },
  { id: 'cancer',              label: 'Cancer',                      route: '/nutrition/cancer' },
  { id: 'cardiaque',           label: 'Maladies cardiaques',         route: '/nutrition/cardiaque' },
  { id: 'perte-poids',         label: 'Perte de poids / Obésité',    route: '/nutrition/perte-poids' },
  { id: 'dentaire',            label: 'Santé dentaire',              route: '/nutrition/dentaire' },
  { id: 'renale',              label: 'Maladies rénales',            route: '/nutrition/renale' },
  { id: 'urinaire',            label: 'Système urinaire',            route: '/nutrition/urinaire' },
]

export default function NutritionListe() {
  const navigate = useNavigate()

  return (
    <div className="page-calculateurs">
      <div className="menu-page-section-liste">
        {CONDITIONS.map((c, idx) => (
          <button
            key={c.id}
            className="menu-page-item"
            onClick={() => navigate(c.route)}
            style={{ borderBottom: idx < CONDITIONS.length - 1 ? '1px solid var(--border)' : 'none' }}
          >
            <span className="menu-page-item-label">{c.label}</span>
            <i className="ti ti-chevron-right menu-page-item-chevron"></i>
          </button>
        ))}
      </div>
    </div>
  )
}
