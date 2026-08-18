const SECTIONS = [
  {
    titre: 'Peau et pelage (soutien général)',
    items: [
      {
        avis: "Un supplément ou une nourriture riche en oméga-3 marins (huile de poisson, pas de lin) aide souvent à améliorer la qualité de la peau et du pelage.",
        tech: 'Sources marines (EPA, DHA) préférables aux sources végétales',
      },
      {
        avis: "Ne pas donner de supplément de vitamine A en trop : autant une carence qu'un excès peuvent causer des problèmes de peau. Mieux vaut passer par une nourriture déjà bien dosée que d'ajouter un supplément au hasard.",
        alerte: true,
      },
      {
        avis: "Chez certaines races nordiques en particulier, un manque de zinc ou de cuivre peut causer de la peau épaisse/croûteuse ou un pelage terne et décoloré. Une nourriture complète et de bonne qualité prévient généralement ce problème.",
      },
    ],
  },
  {
    titre: 'Allergie ou intolérance alimentaire suspectée',
    items: [
      {
        avis: "La seule façon fiable de confirmer une allergie alimentaire est un essai d'élimination strict : une diète à protéine unique nouvelle (jamais mangée avant) ou hydrolysée, pendant 8 à 12 semaines minimum, sans aucune exception.",
        tech: 'Durée minimale : 8-12 semaines',
        food: {
          examples: ["Royal Canin Veterinary Diet Hydrolyzed Protein (HP)", "Hill's Prescription Diet z/d", "Purina Pro Plan Veterinary Diets HA HypoAllergenic"],
          why: "Protéines fractionnées en morceaux trop petits pour déclencher une réaction allergique, ce qui permet d'éliminer l'alimentation comme cause pendant l'essai.",
        },
      },
      {
        avis: "Pendant l'essai, aucune gâterie, aucun aliment aromatisé, aucun médicament à saveur ajoutée et aucun supplément ne doit être donné : même une petite exception peut fausser le résultat.",
        alerte: true,
      },
      {
        avis: "Une fois l'essai terminé et les symptômes améliorés, le vétérinaire confirme le diagnostic en réintroduisant l'ancienne nourriture pour voir si les symptômes reviennent, avant d'établir le régime à long terme.",
      },
    ],
  },
]

export default function NutritionPeau() {
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
              <i className="ti ti-sparkles"></i>
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
