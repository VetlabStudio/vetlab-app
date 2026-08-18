const SECTIONS = [
  {
    titre: 'Composition de la diète',
    items: [
      {
        avis: "Contrairement à la plupart des recommandations générales, une diète plus riche en gras et plus pauvre en glucides est souvent mieux tolérée par un animal en traitement contre le cancer : les cellules cancéreuses utilisent surtout le sucre comme carburant.",
        tech: 'Cible : 50-60 % des calories en gras, 30-50 % en protéines, le reste en glucides',
      },
      {
        avis: "Il faut garder assez de protéines de bonne qualité pour éviter la fonte musculaire, très fréquente pendant un traitement contre le cancer.",
        tech: 'Protéines très digestibles : 30-45 % MS chien, 40-50 % MS chat',
      },
      {
        avis: "Si l'animal mange encore des glucides, privilégier des sources à absorption plus lente (orge, sorgho, maïs) plutôt que le riz blanc.",
      },
    ],
  },
  {
    titre: 'Oméga-3, un supplément à prioriser',
    items: [
      {
        avis: "Un supplément d'huile de poisson (oméga-3) est l'un des ajouts les plus utiles pendant un traitement contre le cancer : ça aide à préserver la masse musculaire et à réduire l'inflammation.",
        tech: 'Dose cible : EPA 40 mg/kg/jour + DHA 25 mg/kg/jour, soit environ 1 capsule d\'huile de poisson par 10 lb',
      },
    ],
  },
  {
    titre: 'Stimuler l\'appétit',
    items: [
      {
        avis: "Réchauffer légèrement la nourriture humide et la rendre plus odorante aide beaucoup à stimuler l'appétit d'un animal nauséeux ou fatigué par le traitement. Offrir de petites quantités souvent plutôt que 2 gros repas.",
      },
      {
        avis: "Ne jamais camoufler un médicament dans la nourriture habituelle de l'animal : s'il associe le goût du médicament à cet aliment, il risque de développer une aversion durable envers sa nourriture, même une fois le traitement terminé.",
        alerte: true,
      },
      {
        avis: "Si l'animal refuse de manger depuis plus d'un jour ou deux malgré ces trucs, il ne faut pas attendre : le vétérinaire peut proposer une nourriture de récupération très calorique, ou dans les cas plus sévères une sonde d'alimentation temporaire.",
        food: {
          examples: ["Royal Canin Veterinary Diet Recovery", "Hill's Prescription Diet ONC Care", "Purina Pro Plan Veterinary Diets CN Convalescence (chat)"],
          why: "Très denses en calories et faciles à manger en petite quantité, conçues pour les animaux qui mangent peu ou refusent de manger.",
        },
      },
    ],
  },
]

export default function NutritionCancer() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques (matière sèche, ratios) sont indiqués en plus petit pour les cas qui demandent plus de précision. <strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient environ 75-80 % d'eau alors qu'une croquette en contient environ 10 %.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-cell"></i>
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
