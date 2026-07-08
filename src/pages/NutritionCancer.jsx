const SECTIONS = [
  {
    titre: 'Cachexie cancéreuse',
    principes: [
      'La cachexie associe une perte de gras ET de masse maigre (contrairement au jeûne simple), avec une dépense énergétique de repos normale ou élevée.',
      'Prendre en charge tôt — la cachexie peut affecter la majorité des patients oncologiques avant même que les signes cliniques soient évidents.',
      'Objectif : nourrir le patient tout en limitant les substrats préférentiels des cellules tumorales (glucose).',
    ],
  },
  {
    titre: 'Macronutriments recommandés',
    principes: [
      'Répartition calorique cible : 50–60 % des calories en gras, 30–50 % en protéines, le reste en glucides.',
      'Protéines très digestibles : 30–45 % MS chez le chien, 40–50 % MS chez le chat; minimum 5,14 g/100 kcal, idéal 6–7 g/100 kcal.',
      'Glucides à index glycémique plus bas : orge, sorgho, maïs plutôt que riz.',
      'Graisses comme source d\'énergie principale — les cellules tumorales les utilisent moins efficacement que le glucose.',
    ],
  },
  {
    titre: 'Oméga-3 — supplément prioritaire',
    principes: [
      'EPA et DHA sont le nutraceutique le plus important en oncologie vétérinaire.',
      'Dose cible : EPA 40 mg/kg/jour, DHA 25 mg/kg/jour (environ 1 capsule d\'huile de poisson par 10 lb de poids corporel).',
      'Effets : réduction de la cachexie, anti-inflammatoire, effets immunomodulateurs.',
    ],
  },
  {
    titre: 'Gestion de l\'appétit et voie d\'alimentation',
    principes: [
      'Voie entérale si le tube digestif est fonctionnel — toujours privilégiée sur la voie parentérale.',
      'Stratégies de palatabilité : aliments humides, réchauffés, odorants, présentés en petites quantités fréquentes.',
      'Ne jamais camoufler un médicament dans l\'aliment — risque d\'aversion alimentaire.',
      'Les stimulants de l\'appétit sont peu fiables; une sonde naso-œsophagienne ou de gastrostomie peut être nécessaire si anorexie persistante.',
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
