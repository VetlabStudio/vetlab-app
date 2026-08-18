const SECTIONS = [
  {
    titre: 'Choisir la bonne nourriture',
    items: [
      {
        avis: "Chez le chien, une nourriture riche en fibres et plus pauvre en glucides simples aide à stabiliser le taux de sucre. Chez le chat, c'est l'inverse qui fonctionne le mieux : une nourriture très pauvre en glucides et riche en protéines, idéalement humide.",
        tech: 'Chien : glucides digestibles <= 55 % MS, fibres 7-18 % MS. Chat : glucides < 20 % MS',
        food: {
          examples: ["Royal Canin Veterinary Diet Diabetic", "Hill's Prescription Diet w/d", "Purina Pro Plan Veterinary Diets DM Diabetes Management"],
          why: "Formulées spécifiquement pour limiter les pics de glycémie après les repas, ce qui facilite le contrôle du diabète en complément de l'insuline.",
        },
      },
      {
        avis: "Les matières grasses ne devraient pas être excessives, et il faut garder assez de protéines pour éviter que l'animal perde du muscle.",
        tech: 'Matières grasses < 25 % MS',
      },
    ],
  },
  {
    titre: 'Routine, la clé du succès',
    items: [
      {
        avis: "Le plus important à faire comprendre à la clientèle : toujours le même aliment, la même quantité, au même moment, en synchronisant les repas avec les injections d'insuline. Changer de nourriture du jour au lendemain peut déstabiliser tout l'équilibre glycémique.",
        alerte: true,
      },
      {
        avis: "Aider l'animal à atteindre et garder un poids santé améliore souvent le contrôle du diabète, parfois même les besoins en insuline diminuent.",
        tech: 'Score de condition corporelle cible : 4-5/9',
      },
      {
        avis: "Les portions peuvent être ajustées avec le temps selon le poids de l'animal et les courbes de glycémie faites par le vétérinaire, jamais de façon improvisée à la maison.",
      },
    ],
  },
]

export default function NutritionDiabete() {
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
              <i className="ti ti-droplet"></i>
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
