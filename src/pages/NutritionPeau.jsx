const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'La peau est un organe très actif métaboliquement — elle consomme environ 25–30 % des apports en protéines.',
      'Assurer un apport adéquat en protéines de haute qualité pour le renouvellement du poil et de l\'épiderme.',
      'Une carence nutritionnelle peut mimer ou aggraver une dermatose — toujours évaluer l\'alimentation.',
    ],
  },
  {
    titre: 'Acides gras essentiels',
    principes: [
      'Oméga-6 (acide linoléique) : maintient la barrière cutanée et réduit la perte d\'eau transépidermique.',
      'Oméga-3 (EPA, DHA) : effets anti-inflammatoires, réduisent le prurit et l\'érythème.',
      'Ratio oméga-6/oméga-3 recommandé : 5:1 à 10:1.',
      'Sources : huile de poisson, huile de lin, aliments enrichis en oméga-3.',
    ],
  },
  {
    titre: 'Micronutriments clés',
    principes: [
      'Zinc : essentiel pour la kératinisation et la cicatrisation (déficit = dermatose zinc-responsive, surtout chez les races nordiques).',
      'Vitamine A : régule la kératinisation — l\'excès est aussi problématique que la carence.',
      'Vitamines du complexe B (biotine, niacine) : soutiennent la santé du poil et de la peau.',
      'Vitamine E et sélénium : antioxydants protégeant les acides gras membranaires.',
    ],
  },
  {
    titre: 'Allergies et hypersensibilités alimentaires',
    principes: [
      'Régime d\'élimination strict pendant 8–12 semaines avec une protéine et une source de glucides inédites.',
      'Hydrolysats de protéines comme alternative aux protéines entières inédites.',
      'Aucune friandise, complément ou arôme pendant la période d\'élimination.',
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
