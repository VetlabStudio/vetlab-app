const SECTIONS = [
  {
    titre: 'Nutriments clés de la peau',
    principes: [
      'La peau consomme une part importante des apports en protéines — qualité, quantité et digestibilité doivent être optimales.',
      'Les besoins augmentent en croissance, gestation, lactation et maladie.',
      'Carence en cuivre : perte de couleur du pelage, poil terne.',
      'Carence en zinc : hyperkératose, dermatoses (surtout races nordiques).',
      'Vitamine A : régule la kératinisation — l\'excès est aussi problématique que la carence.',
    ],
  },
  {
    titre: 'Acides gras essentiels',
    principes: [
      'Les acides gras essentiels (oméga-3 et oméga-6) sont structurels dans les membranes cellulaires de la peau.',
      'Les diètes à protéine novatrice enrichies en oméga-3 améliorent peau et pelage, souvent en quelques jours à deux semaines.',
      'Effet sur le prurit observé chez environ 50 % des chiens atteints de dermatite.',
      'Sources d\'oméga-3 marins (EPA, DHA) préférables aux sources végétales pour leur efficacité directe.',
    ],
  },
  {
    titre: 'Réaction alimentaire indésirable',
    principes: [
      'La protéine est le nutriment de premier intérêt en cas de réaction alimentaire suspectée (type, source, quantité, digestibilité, exposition antérieure).',
      'Essai d\'élimination : diète à protéine novatrice ou hydrolysée; idéalement à ingrédients limités (novel protein ou hydrolysat).',
      'Durée minimale de 8 à 12 semaines, encadrée par un médecin vétérinaire ou un nutritionniste vétérinaire.',
      'Aucune friandise, arôme, médicament aromatisé ou complément pendant l\'essai — toute exposition à la protéine antigénique invalide le test.',
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
