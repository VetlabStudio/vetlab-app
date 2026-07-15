const SECTIONS = [
  {
    titre: 'Glucides et fibres',
    principes: [
      'Chien : aliment à ≤ 55 % de glucides digestibles MS; préférer les glucides complexes (orge) à index glycémique plus bas.',
      'Chat : aliment faible en glucides (< 20 % MS) et riche en protéines — aliments humides préférables.',
      'Fibres modérées 7–18 % MS (insolubles ou mixtes) dans les aliments riches en glucides pour ralentir l\'absorption du glucose.',
      'Aliments félins faibles en glucides : fibres plus basses acceptables (2–7 % MS).',
    ],
  },
  {
    titre: 'Matières grasses et protéines',
    principes: [
      'Matières grasses < 25 % MS.',
      'Protéines en qualité et quantité suffisantes pour éviter la fonte musculaire.',
      'Conserver la même source protéique — tout changement d\'aliment peut déstabiliser l\'équilibre glycémique.',
    ],
  },
  {
    titre: 'Routine alimentaire',
    principes: [
      'Même aliment, même quantité, même horaire à chaque repas, coordonnés avec l\'injection d\'insuline.',
      'Atteindre et maintenir un poids corporel idéal (score 4–5/9).',
      'Ajuster les portions selon l\'évolution du poids et de la courbe glycémique.',
    ],
  },
]

export default function NutritionDiabete() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplet"></i>
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
