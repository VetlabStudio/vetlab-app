const SECTIONS = [
  {
    titre: 'Contexte et facteurs de risque',
    principes: [
      'Le chien est surtout atteint de diabète de type 1 (insulinodépendant); le chat peut présenter un type 1 ou un type 2.',
      'Facteurs de risque : obésité (résistance à l\'insuline), certaines maladies, corticostéroïdes, progestatifs, certaines races.',
      'La perte de poids chez un chat obèse peut induire une rémission diabétique — objectif prioritaire.',
    ],
  },
  {
    titre: 'Glucides et fibres',
    principes: [
      'Chien : aliment à ≤ 55 % de glucides digestibles MS; préférer les glucides complexes (orge) à index glycémique plus bas.',
      'Chat diabétique : aliment faible en glucides (< 20 % MS) et riche en protéines — les aliments humides sont généralement préférables.',
      'Fibres : modérées 7–18 % MS (insolubles ou mixtes) dans les aliments riches en glucides pour ralentir l\'absorption du glucose.',
      'Aliments félins faibles en glucides : fibres plus basses acceptables (2–7 % MS).',
    ],
  },
  {
    titre: 'Matières grasses et protéines',
    principes: [
      'Matières grasses < 25 % MS — l\'excès favorise la résistance à l\'insuline, la production hépatique de glucose et la pancréatite.',
      'Protéines en qualité et quantité suffisantes pour éviter la fonte musculaire, sans excès.',
      'Conserver la même source protéique — un changement d\'aliment peut déstabiliser l\'équilibre glycémique.',
    ],
  },
  {
    titre: 'Routine et surveillance',
    principes: [
      'La constance est clé : même aliment, même quantité, même horaire à chaque repas, coordonnés avec l\'injection d\'insuline.',
      'Peser régulièrement et surveiller la courbe glycémique après tout changement alimentaire.',
      'Atteindre et maintenir un poids corporel idéal (score 4–5/9) — ajuster les portions selon l\'évolution du poids.',
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
