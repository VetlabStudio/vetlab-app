const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'L\'alimentation est un pilier central du traitement de l\'IRC.',
      'Débuter la diète rénale dès que la créatinine dépasse 2,0 mg/dL — ne pas attendre l\'urémie clinique. La SDMA se positive plus tôt que la créatinine.',
      'Ne PAS donner l\'aliment thérapeutique pendant une crise urémique ni lors d\'une hospitalisation — risque d\'aversion gustative durable.',
      'Transition lente (7–14 jours minimum) pour éviter le rejet de l\'aliment.',
    ],
  },
  {
    titre: 'Phosphore et protéines',
    principes: [
      'Restreindre le phosphore — intervention nutritionnelle la plus importante en IRC; prolonge la survie et réduit l\'hyperparathyroïdie rénale.',
      'Si restriction alimentaire insuffisante, ajouter un chélateur de phosphore intestinal (carbonate de calcium, sevelamer).',
      'Protéines contrôlées : 14–20 % MS (chien), 28–35 % MS (chat); très digestibles, haute valeur biologique.',
      'Éviter la restriction protéique trop agressive chez le chat — risque de sarcopénie élevé. Surveiller l\'albumine sérique.',
    ],
  },
  {
    titre: 'Eau, électrolytes et tampons',
    principes: [
      'Accès à l\'eau illimité — aliments humides à privilégier pour augmenter l\'apport hydrique.',
      'Tampons alcalinisants pour contrer l\'acidose métabolique (fréquente en IRC avancée).',
      'Sodium ≤ 0,3 % MS (chien), ≤ 0,4 % MS (chat); chlorure : 1,5 × la teneur en sodium.',
      'Potassium : 0,4–0,8 % MS (chien); teneur plus élevée recommandée chez le chat — hypokaliémie fréquente en IRC féline.',
    ],
  },
  {
    titre: 'Oméga-3 et autres nutriments',
    principes: [
      'Oméga-3 (EPA/DHA) rénoprotecteurs : cible 0,4–2,5 % MS; ratio oméga-6:oméga-3 de 1:1 à 7:1.',
      'Antioxydants (vitamines E et C, bêta-carotène), vitamines B et fibres solubles — soutien global.',
      'Palatabilité : réchauffer l\'aliment, ajouter du bouillon faible en sodium ou un peu de jus de thon. Éviter l\'ail (risque d\'anémie hémolytique).',
      'Des appels de suivi et visites régulières sont essentiels — l\'observance est le défi majeur en gestion nutritionnelle de l\'IRC.',
    ],
  },
]

export default function NutritionRenale() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-filter"></i>
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
