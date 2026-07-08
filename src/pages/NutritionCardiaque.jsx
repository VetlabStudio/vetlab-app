const SECTIONS = [
  {
    titre: 'Signes de décompensation et objectifs',
    principes: [
      'Surveiller : rétention liquidienne (distension jugulaire, hépatomégalie, ascite, épanchement pleural), hypertension secondaire, obésité ou cachexie.',
      'Maintenir un poids idéal — l\'obésité augmente la charge cardiaque; la cachexie cardiaque aggrave le pronostic.',
      'Protéines très digestibles sans restriction excessive pour préserver la masse maigre.',
    ],
  },
  {
    titre: 'Sodium et chlorure',
    principes: [
      'La capacité à excréter le sodium diminue avec la progression de la maladie cardiaque.',
      'Sodium cible : 0,08–0,25 % MS chez le chien, 0,07–0,3 % MS chez le chat.',
      'Chlorure cible : 1,5 × la teneur en sodium.',
      'Éviter les aliments ultra-transformés riches en sel (charcuterie, fromages, restes de table).',
      'La restriction sodée est plus difficile à atteindre chez le chat — palatabilité à surveiller.',
    ],
  },
  {
    titre: 'Taurine et L-carnitine',
    principes: [
      'Taurine : acide aminé clé dans l\'insuffisance myocardique — la carence est associée à la cardiomyopathie dilatée (DCM) chez le chien et le chat.',
      'Vérifier les taux de taurine plasmatique chez tout chien avec DCM, particulièrement si nourri avec un aliment grain-free.',
      'L-carnitine : nutriment myocardique à considérer dans les formes de DCM à carnitine-responsive.',
      'Potassium : risque de déplétion avec les diurétiques — surveiller et supplémenter si nécessaire.',
    ],
  },
  {
    titre: 'Acides gras oméga-3',
    principes: [
      'EPA et DHA : réduisent l\'inflammation, les cytokines pro-inflammatoires, et ont des effets antiarythmiques.',
      'Dose cible : EPA 40 mg/kg/jour + DHA 25 mg/kg/jour; aliment visant 80–150 mg/100 kcal d\'EPA + DHA.',
      'Utile contre la cachexie cardiaque.',
      'Source : huile de poisson (saumon, sardine, anchois).',
    ],
  },
]

export default function NutritionCardiaque() {
  return (
    <div className="labo-detail-page">
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
