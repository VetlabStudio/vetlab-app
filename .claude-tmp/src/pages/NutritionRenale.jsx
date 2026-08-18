const SECTIONS = [
  {
    titre: 'Initiation et transition',
    principes: [
      'Débuter la diète rénale dès que la créatinine dépasse 2,0 mg/dL (ou SDMA élevée).',
      'Ne PAS introduire l\'aliment thérapeutique pendant une crise urémique ni lors d\'une hospitalisation — risque d\'aversion gustative durable.',
      'Transition lente (7–14 jours minimum).',
    ],
  },
  {
    titre: 'Phosphore et protéines',
    principes: [
      'Restreindre le phosphore — intervention nutritionnelle la plus importante en insuffisance rénale chronique.',
      'Si restriction alimentaire insuffisante, ajouter un chélateur de phosphore intestinal (carbonate de calcium, sevelamer).',
      'Protéines : 14–20 % MS (matière sèche) (chien), 28–35 % MS (chat); très digestibles, haute valeur biologique.',
      'Éviter la restriction protéique trop agressive chez le chat — surveiller l\'albumine sérique.',
    ],
  },
  {
    titre: 'Eau et électrolytes',
    principes: [
      'Aliments humides à privilégier; accès à l\'eau illimité.',
      'Sodium ≤ 0,3 % MS (chien), ≤ 0,4 % MS (chat); chlorure : 1,5 × la teneur en sodium.',
      'Potassium : 0,4–0,8 % MS (chien); teneur plus élevée recommandée chez le chat.',
      'Tampons alcalinisants si acidose métabolique.',
    ],
  },
  {
    titre: 'Oméga-3 et palatabilité',
    principes: [
      'Oméga-3 (EPA/DHA) : cible 0,4–2,5 % MS; ratio oméga-6:oméga-3 de 1:1 à 7:1.',
      'Antioxydants (vitamines E et C, bêta-carotène), vitamines B et fibres solubles.',
      'Réchauffer l\'aliment, ajouter du bouillon faible en sodium ou un peu de jus de thon. Éviter l\'ail.',
    ],
  },
]

export default function NutritionRenale() {
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
