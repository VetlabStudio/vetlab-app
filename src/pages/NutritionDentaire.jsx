const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'La gingivite est réversible; la parodontite est surtout irréversible — intervenir tôt.',
      'La plaque (biofilm bactérien) est le substrat clé : contrôler la plaque, pas seulement le tartre (le contrôle du tartre seul est cosmétique).',
      'Les aliments mous augmentent plaque et tartre; l\'aliment sec ordinaire ne nettoie PAS bien.',
      'Les diètes dentaires à texture spéciale et les friandises certifiées VOHC (vohc.org) sont les seuls aliments à efficacité prouvée sur la plaque.',
    ],
  },
  {
    titre: 'Nutriments clés',
    principes: [
      'Vitamine E : ≥ 400 UI/kg MS (chien), ≥ 500 UI/kg MS (chat).',
      'Vitamine C : ≥ 100 mg/kg MS (chien), 100–200 mg/kg MS (chat).',
      'Sélénium : 0,5 à 1,3 mg/kg MS.',
      'Protéines : 16–35 % MS (chien), 30–50 % MS (chat).',
      'Calcium 0,5–1,5 % MS; phosphore 0,4–1,3 % MS — l\'excès de phosphore favorise le tartre.',
      'Polyphosphates (HMP) : fixent le calcium salivaire et réduisent la reminéralisation du tartre.',
      'Zinc : effet antimicrobien sur le biofilm buccal.',
    ],
  },
  {
    titre: 'Soins à domicile',
    principes: [
      'Brossage dentaire = méthode la plus efficace — technique de Bass modifiée, brosse à 45° sur la gencive.',
      'Débuter le brossage en bas âge pour habituer l\'animal.',
      'Chlorhexidine 0,1–0,2 % en gel ou rinçage buccal comme adjuvant antimicrobien.',
      'Friandises dentaires certifiées VOHC ≤ 10 % de l\'apport énergétique total.',
      'Éviter les os durs (os de bœuf, andouiller, pierre à mâcher) — risque de fractures dentaires.',
    ],
  },
]

export default function NutritionDentaire() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-tooth"></i>
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
