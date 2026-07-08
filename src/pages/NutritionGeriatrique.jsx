const SECTIONS = [
  {
    titre: 'Dysfonction cognitive (syndrome DISHA)',
    principes: [
      'Dépister chez tout patient âgé : désorientation, interactions modifiées, cycles de sommeil perturbés, malpropreté, baisse d\'activité.',
      'Aliment enrichi en antioxydants (vitamines E et C), cofacteurs mitochondriaux (acide lipoïque, L-carnitine), caroténoïdes, flavonoïdes et oméga-3 (DHA, EPA) : retarde ou renverse partiellement le déclin de l\'apprentissage.',
      'Combiner avec l\'enrichissement environnemental (exercice, jouets nouveaux, stimulation) — meilleurs résultats qu\'avec l\'aliment seul.',
    ],
  },
  {
    titre: 'Chien senior (dès ~7 ans)',
    principes: [
      'Densité énergétique : 3,0 à 4,0 kcal/g MS; matières grasses : 7 à 15 % MS.',
      'Protéines : 15 à 23 % MS chez le chien mature en santé.',
      'Ne PAS restreindre les protéines chez un senior en santé — risque de malnutrition protéino-énergétique; améliorer la qualité plutôt que réduire la quantité.',
      'Fibres ≥ 2 % MS (constipation, chiens à tendance obèse).',
      'Dépistage régulier des maladies chroniques (rénale, cardiaque, endocrinienne) — adapter l\'alimentation en conséquence.',
    ],
  },
  {
    titre: 'Chat senior (dès 7 ans; besoins critiques à 10–12 ans)',
    principes: [
      'Densité énergétique : 3,5 à 4,5 kcal/g MS; matières grasses : 10 à 25 % MS.',
      'Protéines modérées : 30 à 45 % MS — ne PAS restreindre chez le chat mature en santé.',
      'Fibres ≤ 5 % MS.',
      'La sensibilité à la soif diminue avec l\'âge : surveiller l\'hydratation, offrir de l\'eau fraîche en tout temps, favoriser les aliments humides.',
    ],
  },
  {
    titre: 'Points de vigilance',
    principes: [
      'Protéines élevées non recommandées si maladie rénale concomitante — adapter selon la condition.',
      'Risque de déshydratation accru sous diurétiques ou en IRC.',
      'Faciliter l\'accès à la nourriture (bol surélevé, croquettes plus faciles à mâcher).',
      'Fractionner les repas si digestion difficile ou si perte d\'appétit.',
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
