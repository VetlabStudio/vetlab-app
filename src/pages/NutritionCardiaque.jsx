const SECTIONS = [
  {
    titre: 'Réduire le sodium',
    items: [
      {
        avis: "Une nourriture cardiaque contrôlée en sel aide à réduire la rétention d'eau, un des problèmes centraux en insuffisance cardiaque.",
        tech: 'Sodium cible 0,08-0,25 % MS (chien), 0,07-0,3 % MS (chat)',
        food: {
          examples: ["Royal Canin Veterinary Diet Canine Early Cardiac", "Hill's Prescription Diet h/d", "Purina Pro Plan Veterinary Diets CC CardioCare"],
          why: "Formulées avec un sodium contrôlé et un soutien nutritionnel pour le cœur (taurine, oméga-3), plutôt que de simplement retirer le sel d'une nourriture ordinaire.",
        },
      },
      {
        avis: "Éviter tout aliment ultra-transformé riche en sel : charcuterie, fromage, restes de table, gâteries salées. Ce sont souvent ces \"extras\" qui nuisent le plus, pas la nourriture principale.",
        alerte: true,
      },
      {
        avis: "Chez le chat en particulier, une restriction de sel trop stricte ou trop rapide peut faire perdre l'appétit. Mieux vaut y aller progressivement et surveiller que le chat mange bien.",
      },
    ],
  },
  {
    titre: 'Garder le poids et le muscle',
    items: [
      {
        avis: "Garder l'animal à un poids santé aide le cœur à moins forcer, mais il ne faut pas non plus restreindre les protéines : la fonte musculaire est un risque important chez les animaux cardiaques.",
        tech: 'Score de condition corporelle cible : 4-5/9',
      },
      {
        avis: "Si l'animal est sous diurétiques, le vétérinaire surveille souvent le potassium de près, car ces médicaments peuvent en faire perdre trop.",
      },
    ],
  },
  {
    titre: 'Taurine et L-carnitine',
    items: [
      {
        avis: "Chez un chien avec une maladie du muscle cardiaque (cardiomyopathie dilatée), surtout s'il mangeait une nourriture \"sans grains\", le vétérinaire vérifie souvent le taux de taurine dans le sang : une carence est une cause possible et réversible.",
      },
      {
        avis: "Si une carence en taurine est confirmée, un supplément est ajouté. La L-carnitine peut aussi être considérée dans certains cas spécifiques, sur recommandation du vétérinaire.",
      },
    ],
  },
  {
    titre: 'Oméga-3',
    items: [
      {
        avis: "Un supplément d'huile de poisson (oméga-3) est souvent recommandé en soutien : ça peut aider à réduire l'inflammation et à préserver le muscle.",
        tech: 'Dose cible : EPA 40 mg/kg/jour + DHA 25 mg/kg/jour (huile de saumon, sardine ou anchois)',
      },
    ],
  },
]

export default function NutritionCardiaque() {
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
              <i className="ti ti-heart-rate-monitor"></i>
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
