const SECTIONS = [
  {
    titre: 'Évaluation initiale',
    principes: [
      'Évaluer la condition corporelle (BCS) et la masse musculaire (MCS) avant de débuter un programme.',
      'Peser l\'animal et calculer le poids idéal cible selon la race et le gabarit.',
      'Calculer les besoins énergétiques d\'entretien au poids IDÉAL (pas au poids actuel).',
      'Viser une perte de poids de 1–2 % du poids corporel par semaine.',
      'Exclure les causes médicales d\'obésité (hypothyroïdie, hyperadrénocorticisme) avant de débuter.',
    ],
  },
  {
    titre: 'Stratégies alimentaires',
    principes: [
      'Utiliser un aliment formulé pour la perte de poids (contrôle calorique avec satiété maintenue).',
      'Peser les portions à la balance — les mesures volumétriques (tasses) sont peu précises.',
      'Réduire progressivement les apports (réduction de 20–25 % des besoins d\'entretien calculés au poids idéal).',
      'Conserver une teneur élevée en protéines pour préserver la masse musculaire pendant la perte de poids.',
      'Fibres alimentaires élevées pour augmenter la satiété sans excès calorique.',
      'Fractionner en 2 repas par jour minimum pour limiter la faim.',
    ],
  },
  {
    titre: 'Friandises et suppléments',
    principes: [
      'Les friandises ne doivent pas dépasser 10 % des apports caloriques totaux.',
      'Privilégier les friandises légumes (carotte, brocoli) ou les croquettes du régime comme récompense.',
      'Éviter les os à mâcher, les produits de charcuterie et les restes de table.',
      'Les compléments alimentaires ne sont pas nécessaires si l\'aliment choisi est complet et équilibré.',
    ],
  },
  {
    titre: 'Suivi et maintenance',
    principes: [
      'Pesée toutes les 2–4 semaines et ajustement des portions selon les résultats.',
      'Une fois le poids idéal atteint, recalculer les besoins et passer à un aliment d\'entretien ou de maintenance.',
      'L\'activité physique augmente la dépense énergétique et prévient la reprise de poids.',
      'La moitié des animaux reprend du poids dans les 6 mois sans suivi — planifier des visites de contrôle.',
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
