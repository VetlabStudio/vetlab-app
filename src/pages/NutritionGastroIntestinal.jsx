const SECTIONS = [
  {
    titre: 'Pancréatite',
    principes: [
      'Réalimenter tôt par voie entérale — administrer des antiémétiques pour permettre la reprise alimentaire.',
      'Digestibilité ≥ 85 % MS.',
      'Protéines : chien 15–30 % MS, chat 30–40 % MS.',
      'Matières grasses : chien < 15 % MS, chat < 25 % MS. Si obésité ou hypertriglycéridémie : ≤ 10 % (chien) et ≤ 15 % (chat) MS.',
      'Fibres brutes ≤ 5 % MS; éviter les fibres solubles gélifiantes (pectines, gommes).',
      'Aliments humides réchauffés à 21–38 °C, en petits repas fréquents.',
      'Oméga-3 comme adjuvant anti-inflammatoire.',
    ],
  },
  {
    titre: 'Insuffisance pancréatique exocrine (IPE)',
    principes: [
      'Enzymes pancréatiques en poudre à chaque repas, à vie — ajouter juste avant le repas.',
      'Digestibilité élevée : graisses et glucides ≥ 90 % MS, protéines ≥ 87 % MS.',
      'Matières grasses : chien 10–15 % MS, chat 15–25 % MS.',
      'Fibres ≤ 5 % MS.',
      'Supplémenter en vitamines liposolubles (A, D, E, K) si carence confirmée.',
      'Supplémenter en cobalamine (B12) systématiquement. Vitamine K si coagulopathie.',
      'Petits repas fréquents; BEQ majoré chez l\'animal amaigri (2 × BEE au poids idéal).',
    ],
  },
  {
    titre: 'Chien brachycéphale',
    principes: [
      'Maintenir une condition corporelle idéale (score 4–5/9).',
      'Protéines à digestibilité ≥ 87 % MS; diète à protéine novatrice ou hydrolysée.',
      'Matières grasses réduites.',
      'Éviter les fibres solubles gélifiantes.',
      'Aliments humides réchauffés, en petits repas fréquents.',
      'Bol adapté aux brachycéphales (rebord incliné à 45°).',
    ],
  },
]

export default function NutritionGastroIntestinal() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-gut"></i>
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
