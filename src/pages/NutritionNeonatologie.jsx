const SECTIONS = [
  {
    titre: 'Colostrum et lait maternel',
    principes: [
      'Colostrum obligatoire dans les premières 24–72 h — immunité passive (immunoglobulines); capacité d\'absorption intestinale perdue après 24–72 h.',
      'Lait maternel : seule source de nutrition adéquate les 4–6 premières semaines.',
      'Lait de vache ou de chèvre inadéquat (protéines, gras, calcium et lactose inadaptés; excès de caséine et de lactose → diarrhée).',
    ],
  },
  {
    titre: 'Substituts de lait',
    principes: [
      'Utiliser des produits commerciaux testés spécifiquement pour chiots ou chatons.',
      'Densité cible : ~1 kcal/mL.',
      'Volume : 13–18 mL/100 g de poids corporel/jour (~1 kcal/mL), réparti sur tous les repas — ne jamais donner en 1 ou 2 grosses portions (petite capacité gastrique).',
      'Fréquence : toutes les 2 heures durant la 1re semaine (réserves de glycogène insuffisantes); puis au moins 4 à 6 fois par jour les semaines suivantes.',
      'Gain attendu : chaton ~18–20 g/jour; chiot ~1 g de gain par 2–5 g de lait consommé (0–5 semaines).',
      'Eau : besoins néonataux 132–220 mL/kg/jour (chiot), 155–230 mL/kg/jour (chaton).',
    ],
  },
  {
    titre: 'Thermorégulation et sevrage',
    principes: [
      'Maintenir l\'environnement à 29–32 °C (semaine 1), 26–29 °C (semaine 2), diminuant graduellement à 23 °C (semaine 4).',
      'Introduction de l\'alimentation solide entre 3 et 4 semaines.',
      'Sevrage comportemental complet : ne pas sevrer avant 7–8 semaines (bénéfice psychologique de la tétée).',
    ],
  },
]

export default function NutritionNeonatologie() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-baby-carriage"></i>
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
