const SECTIONS = [
  {
    titre: 'Cystite idiopathique féline (CIF)',
    principes: [
      'Aliment humide (> 60 % d\'humidité); viser une densité urinaire de 1,032 à 1,041.',
      'Augmenter l\'apport en eau : bouillon faible en sodium, glaçons, fontaines à eau.',
      'Aliment urinaire thérapeutique pour réduire la fréquence des épisodes.',
      'Nutriments anti-stress : L-tryptophane et alpha-casozépine ou caséine hydrolysée.',
      'Oméga-3 (EPA/DHA), vitamine E et bêta-carotène.',
    ],
  },
  {
    titre: 'Urolithes de struvite',
    principes: [
      'Aliment calculolytique dissout les struvites en ~1 mois — poursuivre 1 mois après résolution à l\'imagerie.',
      'Cibles : pH urinaire < 6,1 et densité urinaire < 1,040.',
      'Après dissolution : passer à un aliment préventif pour struvites.',
      'Chez le chien : traiter l\'infection urinaire en priorité avant la diète calculolytique.',
    ],
  },
  {
    titre: 'Urolithes d\'oxalate de calcium',
    principes: [
      'Non dissolubles par l\'alimentation — retrait chirurgical ou par lithotritie requis.',
      'Après retrait : aliment humide thérapeutique et hydratation maximale.',
      'Sel (NaCl) pour augmenter la dilution urinaire — prudence si insuffisance rénale chronique ou hypertension.',
    ],
  },
]

export default function NutritionUrinaire() {
  return (
    <div className="labo-detail-page">
      
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplets"></i>
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
