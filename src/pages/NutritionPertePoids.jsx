const SECTIONS = [
  {
    titre: 'Évaluation et définitions',
    principes: [
      'Surpoids : 10–19 % au-dessus du poids optimal. Obésité : ≥ 20 % au-dessus du poids optimal.',
      'Le tissu adipeux est un organe endocrinien actif — l\'obésité favorise l\'inflammation systémique, la résistance à l\'insuline et les maladies chroniques.',
      'BCS (9 points) et MCS à évaluer à chaque visite — le BCS seul est inexact dans 60 % des cas; les propriétaires sous-estiment souvent la condition.',
      'Exclure les causes médicales d\'obésité (hypothyroïdie, hyperadrénocorticisme) avant de débuter un programme.',
    ],
  },
  {
    titre: 'Calcul des besoins et cibles',
    principes: [
      'RER (kcal/jour) = 70 × (poids idéal en kg)^0,75',
      'DER perte de poids chien : 1,0 × RER au poids idéal. DER chien à tendance obèse : 1,4 × RER.',
      'DER perte de poids chat : 0,8 × RER au poids idéal. DER chat à tendance obèse : 1,0 × RER.',
      'Déterminer le poids idéal en premier — 10 kcal/jour de trop chez un chat équivaut à ~0,5 kg par an.',
    ],
  },
  {
    titre: 'Stratégies alimentaires',
    principes: [
      'Peser les portions à la balance (tasse de 8 oz comme repère) — les mesures volumétriques sont peu précises.',
      'Conserver une teneur élevée en protéines pour préserver la masse musculaire pendant la perte de poids.',
      'Fibres alimentaires élevées pour augmenter la satiété sans excès calorique.',
      'Friandises ≤ 10 % de l\'apport énergétique total — les comptabiliser et réduire l\'aliment de base en conséquence.',
      'Nourrir dans un bol désigné uniquement, séparer les animaux si plusieurs dans le foyer.',
    ],
  },
  {
    titre: 'Suivi et maintenance',
    principes: [
      'Pesée toutes les 2–4 semaines et ajustement des portions selon les résultats.',
      'L\'exercice est le seul vrai moyen d\'augmenter la dépense énergétique — commencer graduellement.',
      'Une fois le poids idéal atteint, recalculer les besoins et passer à un aliment d\'entretien.',
      'Planifier des visites de contrôle régulières — la reprise de poids après un programme est fréquente sans suivi.',
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
