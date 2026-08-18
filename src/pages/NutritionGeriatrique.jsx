const SECTIONS = [
  {
    titre: 'Chien senior (dès environ 7 ans)',
    items: [
      {
        avis: "Un chien senior en santé n'a pas besoin de moins de protéines, au contraire : mieux vaut privilégier une nourriture de meilleure qualité plutôt que d'en réduire la quantité.",
        tech: 'Protéines 15-23 % MS (ne pas restreindre) ; densité énergétique 3,0-4,0 kcal/g MS ; matières grasses 7-15 % MS',
        food: {
          examples: ["Royal Canin gamme senior/mature adaptée à la taille", "Hill's Science Diet Senior/Mature", "Purina Pro Plan Senior"],
          why: "Formulées avec des protéines de qualité, des antioxydants et des oméga-3 déjà dosés pour l'âge, sans avoir à ajouter de suppléments.",
        },
      },
      {
        avis: "Une bonne nourriture senior contient déjà des antioxydants et des oméga-3 qui aident à ralentir le vieillissement général, pas besoin d'ajouter de suppléments en plus si l'aliment est complet et de qualité.",
        tech: 'Fibres >= 2 % MS ; enrichi en antioxydants (vitamines E, C), oméga-3 (DHA, EPA)',
      },
    ],
  },
  {
    titre: 'Chat senior (dès 7 ans, plus à risque après 10-12 ans)',
    items: [
      {
        avis: "Comme chez le chien, on ne réduit pas les protéines chez un chat senior en santé : ses besoins restent élevés toute sa vie.",
        tech: 'Protéines 30-45 % MS (ne pas restreindre) ; densité énergétique 3,5-4,5 kcal/g MS ; matières grasses 10-25 % MS',
        food: {
          examples: ["Royal Canin Senior Consult", "Hill's Science Diet Senior", "Purina Pro Plan Senior"],
          why: "Adaptées à l'appétit souvent réduit et aux besoins digestifs du chat âgé.",
        },
      },
      {
        avis: "Privilégiez la nourriture humide chez le chat âgé et assurez-vous qu'il ait toujours de l'eau fraîche accessible : l'hydratation devient plus fragile avec l'âge.",
      },
    ],
  },
  {
    titre: 'Points de vigilance',
    items: [
      {
        avis: "Si l'animal a aussi une maladie rénale, les besoins en protéines changent : dans ce cas, se référer plutôt à la section rénale plutôt qu'à ces recommandations générales.",
      },
      {
        avis: "Chez un animal sous diurétiques ou avec une insuffisance rénale, surveillez l'hydratation de plus près.",
      },
      {
        avis: "Si l'animal a de la difficulté à se déplacer ou à mâcher, un bol surélevé et des croquettes plus faciles à mâcher (ou de la nourriture humide) peuvent faire une grosse différence.",
      },
      {
        avis: "En cas de perte d'appétit ou de digestion plus difficile, fractionner les repas en plus petites portions aide souvent.",
      },
    ],
  },
]

export default function NutritionGeriatrique() {
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
              <i className="ti ti-clock"></i>
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
