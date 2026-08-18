const SECTIONS = [
  {
    titre: 'Calcul des besoins',
    principes: [
      'BEE (kcal/jour) = 70 × (poids idéal en kg)^0,75',
      'BEQ perte de poids chien : 1,0 × BEE au poids idéal. Chien à tendance obèse : 1,4 × BEE.',
      'BEQ perte de poids chat : 0,8 × BEE au poids idéal. Chat à tendance obèse : 1,0 × BEE.',
    ],
  },
  {
    titre: 'Stratégies alimentaires',
    principes: [
      'Peser les portions à la balance — les mesures volumétriques sont peu précises.',
      'Protéines élevées pour préserver la masse musculaire pendant la perte de poids.',
      'Fibres alimentaires élevées pour augmenter la satiété.',
      'Friandises ≤ 10 % de l\'apport énergétique total — déduire de l\'aliment de base.',
      'Nourrir dans un bol désigné; séparer les animaux si plusieurs dans le foyer.',
    ],
  },
  {
    titre: 'Suivi',
    principes: [
      'Pesée toutes les 2–4 semaines et ajustement des portions selon les résultats.',
      'Une fois le poids idéal atteint, recalculer les besoins et passer à un aliment d\'entretien.',
    ],
  },
]

export default function NutritionPertePoids() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-scale"></i>
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
