const SECTIONS = [
  {
    titre: 'Nourriture et gâteries',
    items: [
      {
        avis: "Une nourriture ou des gâteries dentaires avec le sceau VOHC (vohc.org) ont été testées pour vraiment réduire la plaque et le tartre, contrairement à beaucoup de produits qui le prétendent sans preuve.",
        food: {
          examples: ["Royal Canin Veterinary Diet Canine Dental", "Hill's Prescription Diet t/d"],
          why: "Croquettes plus grosses avec une texture qui nettoie la dent par frottement mécanique en mâchant, plutôt que de s'émietter comme une croquette régulière.",
        },
      },
      {
        avis: "Éviter les aliments trop mous exclusivement : ils collent davantage aux dents et favorisent l'accumulation de plaque.",
      },
      {
        avis: "Les gâteries dentaires ne devraient pas dépasser environ le dixième de l'apport total de la journée, même si elles sont bonnes pour les dents.",
        tech: 'Friandises certifiées VOHC <= 10 % de l\'apport énergétique total',
      },
      {
        avis: "Éviter les os durs (os de bœuf, bois de cervidé, sabots) : ils sont une cause fréquente de dents cassées, surtout les prémolaires et molaires.",
        alerte: true,
      },
    ],
  },
  {
    titre: 'Ce qui aide en plus de la nourriture',
    items: [
      {
        avis: "Le brossage des dents à la maison reste le geste le plus efficace, même fait 2 à 3 fois par semaine : brosser en angle vers la gencive, pas juste sur le bout des dents.",
      },
      {
        avis: "Un gel ou rinçage à la chlorhexidine peut être utilisé en complément du brossage, sur les conseils du vétérinaire, pour aider à contrôler les bactéries en bouche.",
      },
    ],
  },
]

export default function NutritionDentaire() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques sont indiqués en plus petit pour les cas qui demandent plus de précision.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-tooth"></i>
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
