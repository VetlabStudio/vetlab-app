const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'Maintenir un poids idéal — l\'obésité augmente la charge cardiaque; la cachexie cardiaque aggrave le pronostic.',
      'La restriction sodée est recommandée en cas d\'insuffisance cardiaque congestive avérée (stades C–D ACVIM).',
      'Éviter la restriction sodée trop précoce (stades B1–B2) — peu bénéfique et peut nuire à la palatabilité.',
      'Assurer un apport calorique suffisant pour prévenir la perte de poids (cachexie cardiaque).',
    ],
  },
  {
    titre: 'Sodium et autres minéraux',
    principes: [
      'Sodium : modéré (30–80 mg/100 kcal) en phase d\'insuffisance compensée; plus strict si ascite ou oedèmes.',
      'Magnésium : souvent déficient chez les cardiaques — vérifier les taux si arythmies.',
      'Potassium : risque de déplétion avec les diurétiques — surveiller et supplémenter si nécessaire.',
      'Éviter les aliments ultra-transformés et riches en sodium (charcuterie, fromages, restes de table).',
    ],
  },
  {
    titre: 'Taurine et L-carnitine',
    principes: [
      'Taurine : carence associée à la cardiomyopathie dilatée (DCM) chez le chien et le chat.',
      'Vérifier les taux de taurine plasmatique chez tout chien avec DCM, surtout si nourri avec aliment grain-free.',
      'L-carnitine : potentiellement bénéfique dans certaines formes de DCM chez le chien.',
      'Supplémentation en taurine recommandée chez le chat (besoins métaboliques plus élevés).',
    ],
  },
  {
    titre: 'Acides gras oméga-3',
    principes: [
      'EPA et DHA : réduisent l\'inflammation, diminuent les cytokines pro-inflammatoires, effets antiarythmiques.',
      'Dose recommandée : 40 mg EPA+DHA/kg/jour chez le chien.',
      'Source : huile de poisson (saumon, sardine, anchois) ou suppléments à base d\'huile de poisson.',
    ],
  },
]

export default function NutritionCardiaque() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heart-rate-monitor"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <ul className="nutrition-principes">
            {s.principes.map((p, j) => (
              <li key={j} className="nutrition-principe-item">{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
