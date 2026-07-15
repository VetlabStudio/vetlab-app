const SECTIONS = [
  {
    titre: 'Macronutriments',
    principes: [
      'Répartition calorique cible : 50–60 % des calories en gras, 30–50 % en protéines, le reste en glucides.',
      'Protéines très digestibles : 30–45 % MS chez le chien, 40–50 % MS chez le chat; idéal 6–7 g/100 kcal.',
      'Glucides à index glycémique bas : orge, sorgho, maïs plutôt que riz.',
      'Graisses comme source d\'énergie principale.',
    ],
  },
  {
    titre: 'Oméga-3 — supplément prioritaire',
    principes: [
      'Dose cible : EPA 40 mg/kg/jour + DHA 25 mg/kg/jour (environ 1 capsule d\'huile de poisson par 10 lb).',
    ],
  },
  {
    titre: 'Gestion de l\'appétit',
    principes: [
      'Aliments humides, réchauffés, odorants, en petites quantités fréquentes.',
      'Ne jamais camoufler un médicament dans l\'aliment (risque d\'aversion alimentaire).',
      'Si anorexie persistante : sonde naso-œsophagienne ou de gastrostomie.',
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
