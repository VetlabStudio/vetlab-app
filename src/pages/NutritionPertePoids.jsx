const SECTIONS = [
  {
    titre: 'Combien nourrir',
    items: [
      {
        avis: "La quantité de départ se calcule à partir du poids IDÉAL de l'animal, pas de son poids actuel : c'est l'équipe vétérinaire qui fait ce calcul de base pour établir la portion de départ.",
        tech: 'BEE (kcal/jour) = 70 x (poids idéal en kg)^0,75. Chien : 1,0 x BEE (1,4 x si tendance à l\'obésité). Chat : 0,8 x BEE (1,0 x si tendance à l\'obésité)',
      },
      {
        avis: "Toujours peser la nourriture sur une balance de cuisine plutôt qu'avec une tasse à mesurer : une simple tasse peut facilement doubler la portion réelle sans qu'on s'en rende compte.",
        alerte: true,
      },
    ],
  },
  {
    titre: 'Stratégies qui aident vraiment',
    items: [
      {
        avis: "Une nourriture riche en protéines et en fibres aide à garder le muscle et à calmer la faim pendant la perte de poids, plutôt que de simplement donner moins de la même nourriture.",
        food: {
          examples: ["Royal Canin Veterinary Diet Satiety Support Weight Management", "Hill's Prescription Diet Metabolic", "Purina Pro Plan Veterinary Diets OM Obesity Management"],
          why: "Conçues pour garder l'animal rassasié avec moins de calories, contrairement à une nourriture régulière simplement servie en plus petite quantité.",
        },
      },
      {
        avis: "Les gâteries comptent : elles ne devraient jamais dépasser environ le dixième de tout ce que l'animal mange dans une journée, et il faut réduire la nourriture principale en conséquence.",
        tech: 'Friandises <= 10 % de l\'apport énergétique total',
      },
      {
        avis: "Nourrir dans un bol dédié et, s'il y a plusieurs animaux dans la maison, les séparer au moment des repas : ça évite qu'un animal vole la portion d'un autre.",
      },
    ],
  },
  {
    titre: 'Suivi',
    items: [
      {
        avis: "Prévoir une pesée toutes les 2 à 4 semaines pour ajuster la portion selon les résultats réels, plutôt que de garder la même quantité pendant des mois.",
      },
      {
        avis: "Une fois le poids idéal atteint, la portion doit être recalculée et l'animal peut passer à une nourriture d'entretien régulière.",
      },
    ],
  },
]

export default function NutritionPertePoids() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques (formules, ratios) sont indiqués en plus petit pour les cas qui demandent plus de précision.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-scale"></i>
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
