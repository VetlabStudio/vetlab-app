const SECTIONS = [
  {
    titre: 'Acides gras essentiels',
    principes: [
      'Diète à protéine novatrice enrichie en oméga-3 pour améliorer peau et pelage.',
      'Sources d\'oméga-3 marins (EPA, DHA) préférables aux sources végétales.',
      'Vitamine A dosée avec précision — l\'excès est aussi problématique que la carence.',
      'Zinc adéquat — carence → hyperkératose et dermatoses (surtout races nordiques).',
      'Cuivre adéquat — carence → perte de couleur du pelage, poil terne.',
    ],
  },
  {
    titre: 'Réaction alimentaire indésirable',
    principes: [
      'Essai d\'élimination : diète à protéine novatrice ou hydrolysée, à ingrédients limités.',
      'Durée minimale de 8 à 12 semaines.',
      'Aucune friandise, arôme, médicament aromatisé ou complément pendant l\'essai.',
      'Rechallenge alimentaire pour confirmer le diagnostic avant de formuler un régime à long terme.',
    ],
  },
]

export default function NutritionPeau() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-sparkles"></i>
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
