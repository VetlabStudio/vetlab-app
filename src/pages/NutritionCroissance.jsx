const SECTIONS = [
  {
    titre: 'Portions et rythme des repas',
    items: [
      {
        avis: "Un chiot ou un chaton en croissance mange beaucoup plus qu'un adulte proportionnellement à son poids, mais les repas doivent rester mesurés et fractionnés : ne pas laisser à volonté, même s'il semble toujours avoir faim.",
        tech: 'BEQ environ 3 x BEE en début de croissance, diminuant vers 1,8-2 x BEE à l\'approche de la taille adulte',
      },
      {
        avis: "L'objectif est un corps ferme, avec les côtes faciles à sentir sans être visibles, ni trop maigre ni potelé.",
        tech: 'Score de condition corporelle cible : 4-5/9',
      },
    ],
  },
  {
    titre: 'Choisir la bonne nourriture',
    items: [
      {
        avis: "Utilisez une nourriture formulée spécifiquement pour la croissance (\"chiot\"/\"chaton\" ou \"toutes étapes de vie\"), adaptée à la taille de l'animal. Ces formules sont déjà équilibrées en protéines, calcium et phosphore : pas besoin de calculer quoi que ce soit.",
        tech: 'Protéines 22-32 % MS ; densité énergétique cible 3,5-4,5 kcal/g MS',
        food: {
          examples: ["Royal Canin Mini/Medium/Maxi Puppy (ou Babycat/Kitten pour le chat)", "Hill's Science Diet Puppy/Kitten", "Purina Pro Plan Puppy/Kitten"],
          why: "Formulées et adaptées à la taille de l'animal, avec les bons ratios de calcium et de phosphore déjà intégrés pour une croissance harmonieuse.",
        },
      },
      {
        avis: "Ne donnez jamais de supplément de calcium à un chiot de grande race, même s'il grandit vite : ça peut nuire au développement osseux plutôt que l'aider.",
        alerte: true,
        tech: 'Grandes/géantes races : Ca 0,7-1,2 % MS, P 0,6-1,1 % MS (fourchette plus étroite que les petites races)',
      },
    ],
  },
  {
    titre: 'Grandes races de chien',
    items: [
      {
        avis: "Pour un chiot de grande ou très grande race, choisissez spécifiquement une formule \"grande race\" : le calcium et la densité énergétique y sont mieux contrôlés pour ralentir la croissance osseuse et réduire le risque de troubles articulaires plus tard.",
      },
      {
        avis: "Évitez tout supplément (calcium, phosphore, vitamines) sans l'accord du vétérinaire, même les produits vendus en animalerie.",
        alerte: true,
      },
    ],
  },
  {
    titre: 'Petites races et chats',
    items: [
      {
        avis: "Les jeunes animaux de petite taille ont un estomac minuscule : privilégiez des repas plus fréquents pour éviter les baisses de sucre, surtout chez le chiot de petite race.",
      },
      {
        avis: "Une fois la taille adulte presque atteinte, faites la transition vers la nourriture adulte progressivement, sur 7 à 10 jours, en mélangeant les deux.",
      },
    ],
  },
]

export default function NutritionCroissance() {
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
              <i className="ti ti-plant"></i>
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
