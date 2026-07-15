const SECTIONS = [
  {
    titre: 'Gestation',
    principes: [
      'Maintenir le poids idéal en début de gestation — éviter la suralimentation précoce.',
      'Augmenter progressivement les apports caloriques à partir de la 2e moitié de la gestation (↑ 25–50 % en fin de gestation).',
      'Aliment formulé pour la croissance ou toutes les étapes de vie (dense en énergie et en protéines).',
      'Calcium et phosphore adéquats — ratio Ca:P entre 1:1 et 2:1.',
      'Éviter la supplémentation en calcium pendant la gestation (risque d\'éclampsie post-partum).',
      'Fractionner les repas en fin de gestation.',
    ],
  },
  {
    titre: 'Lactation',
    principes: [
      'Accès à la nourriture ad libitum pendant la lactation.',
      'Aliment dense en énergie, haute digestibilité, riche en protéines de haute qualité.',
      'Hydratation maximale — eau fraîche en tout temps, aliments humides.',
      'Surveiller la perte de poids de la mère et ajuster les portions.',
    ],
  },
]

export default function NutritionGestationLactation() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heart"></i>
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
