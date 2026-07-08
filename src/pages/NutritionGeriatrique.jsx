const SECTIONS = [
  {
    titre: 'Principes clés',
    principes: [
      'Surveiller régulièrement le poids et la condition corporelle (objectif : score 4–5/9).',
      'Évaluer la masse musculaire — la sarcopénie est fréquente et souvent sous-estimée.',
      'Protéines de haute qualité et haute digestibilité pour maintenir la masse musculaire (éviter la restriction protéique inutile).',
      'Adapter la densité calorique selon la tendance : réduire si embonpoint, augmenter si perte de poids.',
      'Maximiser l\'hydratation — les animaux âgés sont plus à risque de déshydratation et de maladies rénales.',
      'Intégrer des aliments humides ou ajouter de l\'eau si l\'appétit diminue.',
    ],
  },
  {
    titre: 'Suppléments bénéfiques',
    principes: [
      'Acides gras oméga-3 (EPA, DHA) — effets anti-inflammatoires, bénéfiques pour les articulations et la cognition.',
      'Antioxydants (vitamine E, C, bêta-carotène) — soutien du système immunitaire.',
      'Glucosamine et chondroïtine — soutien articulaire si arthrose.',
      'Probiotiques si altération de la flore digestive.',
    ],
  },
  {
    titre: 'Points de vigilance',
    principes: [
      'Dépistage régulier des maladies chroniques (rénale, cardiaque, endocrinienne) — adapter l\'alimentation en conséquence.',
      'Faciliter l\'accès à la nourriture (bol surélevé, croquettes plus faciles à mâcher).',
      'Fractionner les repas si digestion difficile.',
    ],
  },
]

export default function NutritionGeriatrique() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-clock"></i>
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
