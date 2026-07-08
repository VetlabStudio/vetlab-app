const SECTIONS = [
  {
    titre: 'Contexte (chat)',
    principes: [
      'L\'hyperthyroïdisme est l\'endocrinopathie la plus fréquente du chat âgé.',
      'La maladie entraîne un catabolisme accru : perte de poids et fonte musculaire malgré un appétit augmenté.',
      'Options de traitement : thyroïdectomie, antithyroïdiens (méthimazole), iode radioactif, ou aliment à iode limité.',
      'Évaluer systématiquement la fonction rénale avant et pendant le traitement — le traitement peut « démasquer » une IRC sous-jacente.',
    ],
  },
  {
    titre: 'Aliment à iode limité',
    principes: [
      'Un aliment à teneur en iode ≤ 0,32 ppm MS (ex. Hill\'s y/d) utilisé comme SEULE source alimentaire normalise les hormones thyroïdiennes.',
      'La T4 totale baisse en 3 semaines et revient à la normale en 8 à 12 semaines; 90 % des chats restent euthyroïdiens.',
      'La fonction rénale demeure stable avec cette approche.',
      'Règle absolue : aucune gâterie, aucun médicament aromatisé ou composé, aucune autre nourriture, aucun supplément contenant des algues.',
      'Si eau de puits suspectée comme source d\'iode, passer à l\'eau distillée.',
    ],
  },
  {
    titre: 'Soutien nutritionnel',
    principes: [
      'Protéines de haute qualité et haute digestibilité pour limiter la sarcopénie.',
      'Densité calorique élevée si perte de poids marquée — le métabolisme accéléré augmente les besoins énergétiques.',
      'Oméga-3 (EPA, DHA) — soutien rénal et cardioprotection (cardiomyopathie secondaire possible).',
      'Surveiller régulièrement la T4 totale pour confirmer l\'efficacité du traitement choisi.',
    ],
  },
  {
    titre: 'Suivi post-traitement',
    principes: [
      'Après traitement, réévaluer les besoins nutritionnels — le métabolisme se normalise.',
      'Adapter les apports caloriques pour éviter la prise de poids excessive post-traitement.',
      'Si IRC confirmée après traitement : transition vers un aliment rénal (voir section maladies rénales).',
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
