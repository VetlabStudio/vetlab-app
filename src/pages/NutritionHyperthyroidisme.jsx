const SECTIONS = [
  {
    titre: 'Principes généraux (chat)',
    principes: [
      'L\'hyperthyroïdisme survient presque exclusivement chez le chat de plus de 10 ans.',
      'La maladie entraîne un catabolisme accru : perte de poids et fonte musculaire malgré un appétit augmenté.',
      'L\'objectif nutritionnel est de soutenir la masse musculaire et compenser les pertes énergétiques.',
      'Évaluer systématiquement la fonction rénale avant et pendant le traitement — le traitement peut « démasquer » une insuffisance rénale.',
    ],
  },
  {
    titre: 'Apports nutritionnels recommandés',
    principes: [
      'Protéines de haute qualité et haute digestibilité pour limiter la sarcopénie.',
      'Densité calorique élevée si perte de poids marquée.',
      'Phosphore modéré en anticipation d\'une éventuelle insuffisance rénale sous-jacente.',
      'Oméga-3 (EPA, DHA) — soutien rénal et cardioprotection (cardiomyopathie possible).',
      'Antioxydants (vitamine E, C) — le stress oxydatif est augmenté dans l\'hyperthyroïdisme.',
    ],
  },
  {
    titre: 'Régime pauvre en iode (y3)',
    principes: [
      'L\'alimentation pauvre en iode (ex. Hill\'s y/d) peut être utilisée comme option de gestion exclusive chez certains chats.',
      'Efficace uniquement si l\'animal consomme UNIQUEMENT cet aliment (aucune autre source d\'iode).',
      'Surveiller régulièrement la T4 totale pour confirmer l\'efficacité.',
      'Option moins courante que le méthimazole ou le traitement à l\'iode radioactif.',
    ],
  },
  {
    titre: 'Suivi post-traitement',
    principes: [
      'Après traitement, réévaluer les besoins nutritionnels — le métabolisme se normalise.',
      'Adapter les apports caloriques pour éviter la prise de poids excessive post-traitement.',
      'Si insuffisance rénale confirmée après traitement : adapter l\'alimentation en conséquence (voir section rénale).',
    ],
  },
]

export default function NutritionHyperthyroidisme() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-activity"></i>
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
