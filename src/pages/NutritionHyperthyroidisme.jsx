const SECTIONS = [
  {
    titre: 'Aliment à iode limité',
    principes: [
      'Iode ≤ 0,32 ppm MS (ex. Hill\'s y/d) utilisé comme SEULE source alimentaire.',
      'T4 normalisée en 8 à 12 semaines; 90 % des chats restent euthyroïdiens.',
      'Aucune gâterie, médicament aromatisé, autre nourriture, ni supplément contenant des algues.',
      'Si eau de puits suspectée comme source d\'iode, passer à l\'eau distillée.',
    ],
  },
  {
    titre: 'Soutien nutritionnel',
    principes: [
      'Protéines de haute qualité et haute digestibilité pour limiter la sarcopénie.',
      'Densité calorique élevée si perte de poids marquée.',
      'Oméga-3 (EPA, DHA) pour soutien rénal et cardioprotection.',
    ],
  },
  {
    titre: 'Suivi post-traitement',
    principes: [
      'Réévaluer et ajuster les apports caloriques après traitement.',
      'Si insuffisance rénale chronique confirmée après traitement : transition vers un aliment rénal.',
    ],
  },
]

export default function NutritionHyperthyroidisme() {
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
              <i className="ti ti-activity"></i>
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
