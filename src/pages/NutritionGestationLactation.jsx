const SECTIONS = [
  {
    titre: 'Gestation',
    principes: [
      'Maintenir le poids idéal en début de gestation — éviter la suralimentation précoce.',
      'Augmenter progressivement les apports caloriques à partir de la 2e moitié de la gestation (↑ 25–50 % en fin de gestation).',
      'Privilégier un aliment formulé pour la croissance ou toutes les étapes de vie (dense en énergie et en protéines).',
      'Calcium et phosphore adéquats — ratio Ca:P entre 1:1 et 2:1.',
      'Éviter la supplémentation excessive en calcium pendant la gestation (risque d\'éclampsie post-partum).',
      'Fractionner les repas en fin de gestation si l\'abdomen comprime l\'estomac.',
    ],
  },
  {
    titre: 'Lactation',
    principes: [
      'Phase aux besoins énergétiques les plus élevés — peut atteindre 3× à 4× les besoins d\'entretien.',
      'Accès à la nourriture ad libitum recommandé pendant la lactation.',
      'Aliment dense en énergie, haute digestibilité, riche en protéines de haute qualité.',
      'Hydratation maximale — la production de lait dépend directement de l\'apport en eau.',
      'Surveiller la perte de poids excessive de la mère.',
      'Sevrage progressif des petits pour réduire graduellement la demande lactée.',
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
