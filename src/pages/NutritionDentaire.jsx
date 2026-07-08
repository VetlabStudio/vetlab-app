const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'L\'alimentation peut prévenir ou ralentir l\'accumulation de tartre et de plaque dentaire.',
      'La texture de l\'aliment joue un rôle mécanique : les croquettes à grande taille favorisent le contact abrasif avec la dent.',
      'L\'alimentation seule ne remplace pas le brossage dentaire quotidien ni les détartrages professionnels.',
    ],
  },
  {
    titre: 'Aliments à privilégier',
    principes: [
      'Croquettes à effet mécanique (VOHC — Veterinary Oral Health Council) : croquettes plus grandes et à texture spécifique réduisant la plaque.',
      'Aliments dentaires formulés (ex. Hill\'s t/d) : fibre orientée pour nettoyer toute la couronne dentaire.',
      'Friandises dentaires certifiées VOHC (ex. CET chews, Greenies, OraVet) pour une action abrasive douce.',
    ],
  },
  {
    titre: 'Aliments à éviter',
    principes: [
      'Aliments humides exclusifs sans hygiène bucco-dentaire : favorisent l\'accumulation de plaque.',
      'Friandises collantes ou riches en sucres.',
      'Os à mâcher durs (risque de fractures dentaires : os de bœuf, andouiller, pierre à mâcher).',
      'Restes de table sucrés ou transformés.',
    ],
  },
  {
    titre: 'Compléments et additifs',
    principes: [
      'Additifs antimicrobiens dans l\'eau de boisson (chlorhexidine, xylitol à faible dose, polyphosphates) — certains certifiés VOHC.',
      'Zinc : joue un rôle dans la santé gingivale et la résistance aux bactéries parodontales.',
      'Antioxydants (vitamine C, E) : soutien inflammatoire de la gencive.',
      'Attention : le xylitol est toxique chez le chien à doses élevées — vérifier la concentration des produits.',
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
