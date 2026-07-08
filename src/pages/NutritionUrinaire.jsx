const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'L\'alimentation joue un rôle clé dans la prévention et la gestion des urolithiases et des FLUTD (Feline Lower Urinary Tract Disease).',
      'Augmenter la dilution urinaire est l\'objectif commun à la plupart des affections urinaires.',
      'Les aliments humides sont systématiquement à privilégier (augmentent l\'apport en eau de 60–80 %).',
      'Surveiller le pH urinaire selon le type de cristaux : objectif pH 6,0–6,5 pour struvites, > 6,5 pour oxalates.',
    ],
  },
  {
    titre: 'Cristaux et calculs de struvite',
    principes: [
      'Acidifier l\'urine (pH cible 6,0–6,5) pour dissoudre les struvites stériles et prévenir leur récidive.',
      'Restreindre le magnésium, l\'ammonium et le phosphore dans l\'alimentation.',
      'Les aliments urinaires du commerce sont formulés pour dissoudre et prévenir les struvites.',
      'Chez le chien : les struvites sont souvent secondaires à une infection — traiter l\'infection en priorité.',
    ],
  },
  {
    titre: 'Cristaux et calculs d\'oxalate de calcium',
    principes: [
      'Alcaliniser légèrement l\'urine (pH > 6,5) — contraire aux struvites.',
      'Éviter les excès de calcium, d\'oxalate et de vitamine D.',
      'Modérer les protéines animales (sources d\'acide urique et d\'oxalate).',
      'Éviter les aliments riches en oxalate : épinards, betteraves, noix.',
      'Les calculs d\'oxalate NE SE dissolvent PAS avec l\'alimentation — chirurgie ou lithotritie nécessaire.',
    ],
  },
  {
    titre: 'FLUTD et cystite idiopathique féline (CIF)',
    principes: [
      'Augmenter l\'apport en eau (aliments humides, fontaine à eau, eau fraîche en tout temps).',
      'Aliments urinaires pour réduire la concentration urinaire (densité urinaire cible < 1,040).',
      'Réduire le stress environnemental — la CIF est souvent multifactorielle (stress, sédentarité).',
      'Éviter les croquettes sèches comme alimentation exclusive chez le chat à risque.',
      'Glucosaminoglycanes (GAG) : supplément potentiellement bénéfique pour la muqueuse vésicale.',
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
