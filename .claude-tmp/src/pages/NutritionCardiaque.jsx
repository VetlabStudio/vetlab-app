const SECTIONS = [
  {
    titre: 'Sodium et chlorure',
    principes: [
      'Sodium cible : 0,08–0,25 % MS chez le chien, 0,07–0,3 % MS chez le chat.',
      'Chlorure cible : 1,5 × la teneur en sodium.',
      'Éviter les aliments ultra-transformés riches en sel (charcuterie, fromages, restes de table).',
      'Surveiller la palatabilité chez le chat — la restriction sodée peut réduire l\'appétit.',
    ],
  },
  {
    titre: 'Protéines et poids',
    principes: [
      'Maintenir un poids idéal (score 4–5/9).',
      'Protéines très digestibles sans restriction excessive pour préserver la masse maigre.',
      'Potassium : surveiller et supplémenter si nécessaire (déplétion sous diurétiques).',
    ],
  },
  {
    titre: 'Taurine et L-carnitine',
    principes: [
      'Vérifier les taux de taurine plasmatique chez tout chien avec cardiomyopathie dilatée (CMD), particulièrement si nourri avec un aliment sans grains.',
      'Supplémenter en taurine si carence confirmée.',
      'L-carnitine à considérer dans les formes de CMD à carnitine-responsive.',
    ],
  },
  {
    titre: 'Oméga-3',
    principes: [
      'Dose cible : EPA 40 mg/kg/jour + DHA 25 mg/kg/jour.',
      'Aliment visant 80–150 mg/100 kcal d\'EPA + DHA.',
      'Source : huile de poisson (saumon, sardine, anchois).',
    ],
  },
]

export default function NutritionCardiaque() {
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
              <i className="ti ti-heart-rate-monitor"></i>
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
