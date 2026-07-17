const SECTIONS = [
  {
    titre: 'Chien senior (dès ~7 ans)',
    principes: [
      'Densité énergétique : 3,0 à 4,0 kcal/g MS; matières grasses : 7 à 15 % MS.',
      'Protéines : 15 à 23 % MS — ne PAS restreindre; améliorer la qualité plutôt que réduire la quantité.',
      'Fibres ≥ 2 % MS.',
      'Aliment enrichi en antioxydants (vitamines E et C), cofacteurs mitochondriaux (acide lipoïque, L-carnitine), caroténoïdes et oméga-3 (DHA, EPA).',
    ],
  },
  {
    titre: 'Chat senior (dès 7 ans; critique à 10–12 ans)',
    principes: [
      'Densité énergétique : 3,5 à 4,5 kcal/g MS; matières grasses : 10 à 25 % MS.',
      'Protéines : 30 à 45 % MS — ne PAS restreindre chez le chat mature en santé.',
      'Fibres ≤ 5 % MS.',
      'Aliments humides à privilégier; eau fraîche en tout temps.',
    ],
  },
  {
    titre: 'Points de vigilance',
    principes: [
      'Adapter les protéines si maladie rénale concomitante.',
      'Surveiller l\'hydratation, notamment sous diurétiques ou en insuffisance rénale chronique.',
      'Faciliter l\'accès à la nourriture (bol surélevé, croquettes plus faciles à mâcher).',
      'Fractionner les repas si digestion difficile ou perte d\'appétit.',
    ],
  },
]

export default function NutritionGeriatrique() {
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
              <i className="ti ti-clock"></i>
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
