const SECTIONS = [
  {
    titre: 'Cystite idiopathique féline (chat qui urine souvent/avec douleur, sans cause claire)',
    items: [
      {
        avis: "Le changement le plus efficace est souvent d'augmenter l'apport en eau : nourriture humide, bouillon faible en sodium, glaçons dans le bol, ou même une fontaine à eau si le chat préfère l'eau qui bouge.",
        tech: 'Nourriture humide > 60 % d\'humidité ; densité urinaire cible 1,032 à 1,041',
      },
      {
        avis: "Une nourriture urinaire thérapeutique aide à réduire la fréquence des épisodes, surtout combinée à plus d'eau.",
        food: {
          examples: ["Royal Canin Veterinary Diet Urinary SO", "Hill's Prescription Diet c/d", "Purina Pro Plan Veterinary Diets UR Urinary"],
          why: "Favorisent une urine plus diluée et moins concentrée en minéraux, ce qui réduit l'irritation de la vessie.",
        },
      },
      {
        avis: "Le stress est un déclencheur important chez ces chats : réduire les sources de stress à la maison (accès aux bacs, conflits avec d'autres chats) fait souvent une vraie différence, en plus de la nourriture.",
      },
    ],
  },
  {
    titre: 'Calculs de struvite',
    items: [
      {
        avis: "Ce type de calcul peut se dissoudre avec la bonne nourriture, sans chirurgie, en environ 1 mois. Il faut continuer la même nourriture encore 1 mois après que l'imagerie confirme que le calcul est disparu.",
        food: {
          examples: ["Royal Canin Veterinary Diet Urinary SO", "Hill's Prescription Diet c/d", "Purina Pro Plan Veterinary Diets UR Urinary"],
          why: "Conçues pour créer une urine qui dissout activement les cristaux de struvite, contrairement à une nourriture urinaire d'entretien qui ne fait que prévenir.",
        },
      },
      {
        avis: "Chez le chien, s'il y a une infection urinaire en même temps, elle doit être traitée avant ou en même temps que la diète, sinon la dissolution ne fonctionne pas bien.",
      },
      {
        avis: "Une fois le calcul dissous, on change pour une nourriture urinaire préventive à plus long terme plutôt que de continuer la diète de dissolution indéfiniment.",
      },
    ],
  },
  {
    titre: 'Calculs d\'oxalate de calcium',
    items: [
      {
        avis: "Contrairement aux struvites, ce type de calcul ne se dissout pas avec la nourriture : un retrait chirurgical ou par une autre technique est nécessaire.",
        alerte: true,
      },
      {
        avis: "Après le retrait, une nourriture urinaire humide et une bonne hydratation restent importantes pour réduire le risque de récidive.",
      },
      {
        avis: "Ajouter un peu de sel à la diète pour encourager l'animal à boire plus est parfois utilisé, mais avec prudence : à éviter si l'animal a une maladie rénale ou de l'hypertension. Cette décision revient au vétérinaire.",
      },
    ],
  },
]

export default function NutritionUrinaire() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplets"></i>
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
