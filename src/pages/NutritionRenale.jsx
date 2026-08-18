const SECTIONS = [
  {
    titre: 'Quand commencer et comment faire la transition',
    items: [
      {
        avis: "Le passage à une nourriture rénale est généralement recommandé une fois que les valeurs sanguines montrent une insuffisance rénale confirmée (le vétérinaire se base sur la créatinine ou le SDMA), pas seulement sur des symptômes.",
        tech: 'Créatinine > 2,0 mg/dL ou SDMA élevé',
      },
      {
        avis: "Ne jamais introduire la nouvelle nourriture rénale pendant une crise (animal très malade, hospitalisé, qui ne mange pas) : l'animal risque d'associer cette nourriture à son mal-être et de la refuser pour de bon par la suite. Mieux vaut attendre qu'il soit stable et qu'il mange bien.",
        alerte: true,
      },
      {
        avis: "Faire le changement lentement, sur au moins 1 à 2 semaines, en mélangeant de plus en plus de nouvelle nourriture à l'ancienne.",
        tech: 'Transition sur 7-14 jours minimum',
      },
    ],
  },
  {
    titre: 'Choisir la bonne nourriture',
    items: [
      {
        avis: "La chose la plus importante à changer, c'est le phosphore : c'est l'intervention qui ralentit le plus la progression de la maladie rénale, plus encore que les protéines.",
        food: {
          examples: ["Royal Canin Veterinary Diet Renal", "Hill's Prescription Diet k/d", "Purina Pro Plan Veterinary Diets NF Renal Function"],
          why: "Formulées avec un phosphore restreint et des protéines de haute qualité, faciles à digérer, pour ménager les reins sans priver l'animal de nutriments essentiels.",
        },
        tech: 'Protéines 14-20 % MS (chien), 28-35 % MS (chat)',
      },
      {
        avis: "Chez le chat surtout, il ne faut pas couper les protéines de façon trop agressive : le vétérinaire surveille l'albumine pour s'assurer que la restriction n'est pas excessive.",
      },
      {
        avis: "Si la restriction alimentaire ne suffit pas à contrôler le phosphore, le vétérinaire peut ajouter un médicament qui bloque son absorption dans l'intestin.",
      },
    ],
  },
  {
    titre: 'Eau et sel',
    items: [
      {
        avis: "Privilégier la nourriture humide et s'assurer que l'eau fraîche est toujours accessible en quantité : une bonne hydratation aide beaucoup les reins fragilisés.",
      },
      {
        avis: "Une nourriture rénale contient déjà le bon niveau de sodium, pas besoin de le calculer soi-même.",
        tech: 'Sodium <= 0,3 % MS (chien), <= 0,4 % MS (chat)',
      },
    ],
  },
  {
    titre: 'Oméga-3 et appétit',
    items: [
      {
        avis: "Un supplément d'oméga-3 peut aider à ralentir la progression de la maladie rénale, en discuter avec le vétérinaire traitant.",
        tech: 'Cible 0,4-2,5 % MS',
      },
      {
        avis: "Si l'appétit diminue, réchauffer légèrement la nourriture humide ou ajouter un peu de bouillon faible en sodium peut aider. Éviter l'ail, même en petite quantité.",
        alerte: true,
      },
    ],
  },
]

export default function NutritionRenale() {
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
              <i className="ti ti-filter"></i>
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
