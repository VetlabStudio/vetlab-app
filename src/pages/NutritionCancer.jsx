const SECTIONS = [
  {
    titre: 'Considérations générales',
    principes: [
      'La cachexie cancéreuse (perte de masse maigre) peut affecter jusqu\'à 80 % des animaux atteints — prendre en charge tôt.',
      'Les tumeurs utilisent préférentiellement les glucides — limiter les glucides simples peut être bénéfique.',
      'Maintenir un apport calorique suffisant pour prévenir la perte de poids involontaire.',
      'La palatabilité est prioritaire si l\'appétit est réduit (effets secondaires des traitements).',
    ],
  },
  {
    titre: 'Macronutriments recommandés',
    principes: [
      'Protéines élevées (> 30–35 % de l\'énergie métabolisable) pour préserver la masse musculaire.',
      'Graisses comme source d\'énergie privilégiée (les tumeurs les utilisent moins efficacement que les glucides).',
      'Acides gras oméga-3 (EPA, DHA) : effets anti-inflammatoires, réduction de la cachexie, possibles effets antitumoraux.',
      'Glucides limités, préférer des sources à faible index glycémique.',
      'Arginine et glutamine : acides aminés qui soutiennent la fonction immunitaire et la réparation intestinale.',
    ],
  },
  {
    titre: 'Micronutriments et suppléments',
    principes: [
      'Antioxydants (vitamine E, C, sélénium) : soutien immunitaire — attention, ne pas supplémenter en excès pendant la chimiothérapie ou la radiothérapie (risque d\'interférence).',
      'Probiotiques pour maintenir la santé intestinale si chimiothérapie.',
      'Éviter la supplémentation excessive sans avis spécialisé (certains suppléments peuvent interagir avec les traitements).',
    ],
  },
  {
    titre: 'Gestion de l\'appétit',
    principes: [
      'Proposer des aliments humides, tièdes et odorants pour stimuler l\'appétit.',
      'Fractionner en petits repas fréquents si nausées ou mucite orale (chimiothérapie).',
      'Envisager une stimulation de l\'appétit (mirtazapine chez le chat) si anorexie persistante.',
      'Support nutritionnel entéral (sonde naso-œsophagienne ou gastrostomie) si nécessaire.',
    ],
  },
]

export default function NutritionCancer() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-cell"></i>
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
