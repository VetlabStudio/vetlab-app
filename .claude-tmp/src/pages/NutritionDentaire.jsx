const SECTIONS = [
  {
    titre: 'Aliment et friandises',
    principes: [
      'Diètes dentaires à texture spéciale et friandises certifiées VOHC (vohc.org).',
      'Éviter les aliments mous — augmentent la plaque et le tartre.',
      'Friandises dentaires certifiées VOHC ≤ 10 % de l\'apport énergétique total.',
      'Éviter les os durs (os de bœuf, bois de cervidé) — risque de fractures dentaires.',
    ],
  },
  {
    titre: 'Nutriments clés',
    principes: [
      'Vitamine E : ≥ 400 UI/kg MS (chien), ≥ 500 UI/kg MS (chat).',
      'Vitamine C : ≥ 100 mg/kg MS (chien), 100–200 mg/kg MS (chat).',
      'Sélénium : 0,5 à 1,3 mg/kg MS.',
      'Calcium 0,5–1,5 % MS; phosphore 0,4–1,3 % MS.',
      'Polyphosphates (HMP) — réduisent la reminéralisation du tartre.',
      'Zinc — effet antimicrobien sur le biofilm buccal.',
    ],
  },
  {
    titre: 'Soins à domicile',
    principes: [
      'Brossage dentaire quotidien — technique de Bass modifiée, brosse à 45° sur la gencive.',
      'Chlorhexidine 0,1–0,2 % en gel ou rinçage buccal comme adjuvant antimicrobien.',
    ],
  },
]

export default function NutritionDentaire() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
  <i className="ti ti-info-circle"></i>
  <span><strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient ~75–80 % d'eau alors qu'une croquette en contient ~10 %.</span>
</div>
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
