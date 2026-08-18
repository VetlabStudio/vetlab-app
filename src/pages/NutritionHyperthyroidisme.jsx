const SECTIONS = [
  {
    titre: 'Aliment à iode limité',
    items: [
      {
        avis: "Il existe une option de nourriture qui traite l'hyperthyroïdie simplement en limitant l'iode, sans médicament ni chirurgie. Le piège : elle doit être la SEULE chose que le chat mange, aucune exception.",
        tech: 'Iode <= 0,32 ppm MS',
        food: {
          examples: ["Hill's Prescription Diet y/d Thyroid Care"],
          why: "Seule gamme confirmée avec un contrôle d'iode assez strict pour ce traitement ; aucune gâterie ou nourriture ordinaire ne doit être ajoutée.",
        },
      },
      {
        avis: "Aucune gâterie, aucun médicament aromatisé, aucune autre nourriture et aucun supplément contenant des algues ne doit être donné : même une petite quantité d'iode en trop peut empêcher le traitement de fonctionner.",
        alerte: true,
      },
      {
        avis: "La T4 se normalise généralement en 8 à 12 semaines, et environ 9 chats sur 10 restent bien contrôlés avec cette seule approche.",
      },
      {
        avis: "Si le chat boit de l'eau de puits, ça peut parfois contenir de l'iode en quantité variable : dans ce cas, il vaut mieux passer à de l'eau distillée le temps du traitement.",
      },
    ],
  },
  {
    titre: 'Soutien nutritionnel général',
    items: [
      {
        avis: "Une nourriture riche en protéines de bonne qualité aide à limiter la fonte musculaire souvent présente chez ces chats.",
      },
      {
        avis: "Si le chat a beaucoup maigri, une nourriture plus calorique peut aider à reprendre du poids plus rapidement.",
      },
      {
        avis: "Les oméga-3 (EPA, DHA) peuvent apporter un soutien supplémentaire pour les reins et le cœur, souvent sollicités par cette maladie.",
      },
    ],
  },
  {
    titre: 'Après le traitement',
    items: [
      {
        avis: "Une fois la thyroïde traitée (médicament, chirurgie ou iode radioactif), les besoins caloriques du chat changent : il faut réévaluer et souvent réduire la quantité de nourriture pour éviter qu'il prenne trop de poids.",
      },
      {
        avis: "Si une insuffisance rénale se révèle après le traitement (elle était parfois masquée par l'hyperthyroïdie), la nourriture doit être changée pour une diète rénale.",
      },
    ],
  },
]

export default function NutritionHyperthyroidisme() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques sont indiqués en plus petit pour les cas qui demandent plus de précision. <strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient environ 75-80 % d'eau alors qu'une croquette en contient environ 10 %.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-activity"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <div className="nutrition-tip-list">
            {s.items.map((it, j) => (
              <div key={j} className={`nutrition-tip${it.alerte ? ' nutrition-tip--alerte' : ''}`}>
                <p className="nutrition-tip-advice">{it.avis}</p>
                {it.food && (
                  <div className="nutrition-food-examples">
                    <p className="nutrition-food-examples-label">Exemples à proposer</p>
                    <div className="nutrition-food-chip-row">
                      {it.food.examples.map((f, k) => (
                        <span key={k} className="nutrition-food-chip">{f}</span>
                      ))}
                    </div>
                    <p className="nutrition-food-why">Pourquoi : {it.food.why}</p>
                  </div>
                )}
                {it.tech && (
                  <div className="nutrition-tip-tech">
                    <span className="nutrition-tip-tech-label">Repère :</span>
                    <span>{it.tech}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
