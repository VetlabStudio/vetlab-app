const SECTIONS = [
  {
    titre: 'Pancréatite',
    principes: [
      'Réalimenter tôt par voie entérale — stimule la régénération de la muqueuse et réduit la translocation bactérienne. Administrer des antiémétiques pour permettre la reprise alimentaire.',
      'Hydratation : fluides SC ou IV si nausées ou vomissements. Cibles électrolytiques : K 0,8–1,1 % MS, Cl 0,5–1,3 % MS, Na 0,3–0,5 % MS.',
      'Digestibilité ≥ 85 % MS.',
      'Protéines : chien 15–30 % MS, chat 30–40 % MS. Éviter l\'excès (stimule la sécrétion pancréatique) tout en couvrant la réparation.',
      'Matières grasses : chien < 15 % MS, chat < 25 % MS. Si obésité ou hypertriglycéridémie : ≤ 10 % (chien) et ≤ 15 % (chat) MS.',
      'Fibres : éviter les fibres solubles gélifiantes (pectines, gommes); fibres brutes ≤ 5 % MS. Prébiotiques (pulpe de betterave, lin) utiles.',
      'Forme : aliments humides réchauffés à 21–38 °C. Oméga-3 comme adjuvant anti-inflammatoire.',
    ],
  },
  {
    titre: 'Insuffisance pancréatique exocrine (IPE)',
    principes: [
      'Enzymes pancréatiques à chaque repas, à vie — les poudres sont plus efficaces que les comprimés; ajouter juste avant le repas.',
      'Digestibilité élevée : graisses et glucides ≥ 90 % MS, protéines ≥ 87 % MS.',
      'Matières grasses : chien 10–15 % MS, chat 15–25 % MS.',
      'Fibres faibles ≤ 5 % MS — les fibres nuisent à l\'activité enzymatique.',
      'Vitamines liposolubles (A, D, E, K) mal absorbées — surveiller et supplémenter si nécessaire.',
      'Cobalamine (B12) souvent basse — supplémenter systématiquement. Vitamine K si coagulopathie.',
      'Petits repas fréquents; DER majoré chez l\'animal amaigri (2 × RER au poids idéal).',
    ],
  },
  {
    titre: 'Chien brachycéphale',
    principes: [
      'Maintenir une condition corporelle idéale — l\'obésité aggrave le syndrome brachycéphale.',
      'Protéines à digestibilité ≥ 87 % MS; diètes à protéine novatrice ou hydrolysée.',
      'Matières grasses réduites — le gras retarde la vidange gastrique.',
      'Éviter les fibres solubles gélifiantes.',
      'Aliments humides réchauffés, en petits repas fréquents; consistance liquide ou semi-liquide selon la tolérance.',
      'Utiliser un bol adapté aux brachycéphales (rebord incliné à 45°) — améliore la posture, ralentit la mastication et réduit l\'aérophagie.',
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
