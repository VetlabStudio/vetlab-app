const SECTIONS = [
  {
    titre: 'Colostrum et lait maternel',
    items: [
      {
        avis: "Le colostrum est essentiel dans les 24 à 72 premières heures : c'est ce qui transmet l'immunité de la mère au petit. Après ce délai, l'intestin ne peut plus l'absorber, donc plus tôt c'est donné, mieux c'est.",
      },
      {
        avis: "Le lait maternel est la seule source de nutrition adéquate pour les 4 à 6 premières semaines.",
      },
      {
        avis: "Ne jamais donner du lait de vache ou de chèvre à un chiot ou un chaton orphelin : ça peut causer de la diarrhée. Utiliser seulement un lait de remplacement conçu spécifiquement pour chiots ou chatons.",
        alerte: true,
        food: {
          examples: ["Royal Canin Babydog Milk (chiot)", "Royal Canin Babycat Milk (chaton)"],
          why: "Formulés pour reproduire la composition du lait maternel (protéines, gras, calcium, lactose adaptés), contrairement au lait de vache ou de chèvre.",
        },
      },
    ],
  },
  {
    titre: 'Comment donner le lait de remplacement',
    items: [
      {
        avis: "Toujours répartir le lait sur plusieurs petits repas dans la journée, jamais en 1 ou 2 grosses portions : l'estomac d'un nouveau-né est minuscule.",
        tech: 'Volume total : environ 13-18 mL/100 g de poids corporel/jour',
      },
      {
        avis: "La première semaine, un boire toutes les 2 heures est nécessaire (jour et nuit) : le nouveau-né n'a presque pas de réserve d'énergie. Ensuite, 4 à 6 boires par jour suffisent.",
      },
      {
        avis: "Pour vérifier que ça fonctionne bien, on surveille le gain de poids quotidien plutôt que de se fier à l'appétit seul.",
        tech: 'Gain attendu : chaton environ 18-20 g/jour ; chiot environ 1 g de gain par 2-5 g de lait consommé',
      },
      {
        avis: "Les besoins en eau sont plus élevés que chez l'adulte, à garder en tête en cas de déshydratation.",
        tech: 'Besoins en eau : chiot 132-220 mL/kg/jour ; chaton 155-230 mL/kg/jour',
      },
    ],
  },
  {
    titre: 'Chaleur et sevrage',
    items: [
      {
        avis: "Un nouveau-né ne régule pas bien sa température : l'environnement doit rester chaud, puis se refroidir peu à peu à mesure qu'il grandit.",
        tech: '29-32 °C (semaine 1) -> 26-29 °C (semaine 2) -> environ 23 °C (semaine 4)',
      },
      {
        avis: "L'introduction de nourriture solide, ramollie, peut commencer entre 3 et 4 semaines.",
      },
      {
        avis: "Il est préférable d'attendre au moins 7 à 8 semaines avant le sevrage comportemental complet (retrait de la mère) : la tétée a aussi un rôle psychologique important pour le petit.",
      },
    ],
  },
]

export default function NutritionNeonatologie() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques (volumes, températures) sont indiqués en plus petit pour les cas qui demandent plus de précision.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-baby-carriage"></i>
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
