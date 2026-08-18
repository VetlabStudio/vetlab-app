const SECTIONS = [
  {
    titre: 'Pancréatite',
    items: [
      {
        avis: "Contrairement à une vieille croyance, on ne met plus l'estomac au repos total : on recommence à nourrir tôt, en petites quantités, avec des antiémétiques si besoin pour contrôler les nausées.",
      },
      {
        avis: "Choisissez une nourriture très digestible et faible en gras, réchauffée légèrement (autour de la température du corps), en petits repas fréquents.",
        tech: 'Digestibilité >= 85 % MS ; gras chien < 15 % MS, chat < 25 % MS (encore moins si obésité ou triglycérides élevés) ; fibres <= 5 % MS',
        food: {
          examples: ["Royal Canin Veterinary Diet Gastrointestinal Low Fat", "Hill's Prescription Diet i/d", "Purina Pro Plan Veterinary Diets EN Gastrointestinal"],
          why: "Formulées pour être faciles à digérer et pauvres en gras, ce qui repose le pancréas pendant la guérison.",
        },
      },
      {
        avis: "Un supplément d'oméga-3 peut aider comme anti-inflammatoire d'appoint, en discuter avec le vétérinaire traitant.",
      },
    ],
  },
  {
    titre: 'Insuffisance pancréatique exocrine (IPE)',
    items: [
      {
        avis: "Le traitement de base, c'est l'ajout d'enzymes pancréatiques en poudre directement dans la nourriture à chaque repas, à vie. Sans ça, l'animal n'absorbe pas ses aliments correctement même avec la meilleure diète.",
        tech: 'Enzymes ajoutées juste avant le repas, à chaque repas',
      },
      {
        avis: "En complément des enzymes, une nourriture très digestible aide à limiter les selles molles et la perte de poids.",
        tech: 'Digestibilité gras/glucides >= 90 % MS, protéines >= 87 % MS ; gras chien 10-15 % MS, chat 15-25 % MS',
      },
      {
        avis: "Si l'animal a beaucoup maigri, le vétérinaire peut recommander d'augmenter temporairement la quantité de nourriture au-delà du calcul habituel, le temps de reprendre du poids.",
        tech: 'BEQ majoré chez l\'animal amaigri : environ 2 x BEE au poids idéal',
      },
      {
        avis: "Une carence en vitamine B12 (cobalamine) est fréquente avec cette maladie ; le vétérinaire supplémente généralement de façon systématique.",
      },
    ],
  },
  {
    titre: 'Chien brachycéphale (museau court)',
    items: [
      {
        avis: "Garder un poids santé est particulièrement important chez ces races : l'excès de poids aggrave les problèmes respiratoires déjà présents.",
        tech: 'Score de condition corporelle cible : 4-5/9',
      },
      {
        avis: "Une nourriture facile à digérer et faible en gras aide, car ces chiens ont souvent aussi une digestion plus sensible.",
        food: {
          examples: ["Royal Canin Veterinary Diet Gastrointestinal Low Fat", "Hill's Prescription Diet i/d", "Purina Pro Plan Veterinary Diets EN Gastrointestinal"],
          why: "Mêmes formules digestives que pour la pancréatite : faciles à digérer et pauvres en gras.",
        },
      },
      {
        avis: "Réchauffer légèrement la nourriture humide et offrir des repas plus petits et fréquents aide à réduire les épisodes de régurgitation.",
      },
      {
        avis: "Un bol avec un rebord incliné (conçu pour les races à museau court) facilite la prise de nourriture et réduit l'ingestion d'air.",
      },
    ],
  },
]

export default function NutritionGastroIntestinal() {
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
              <i className="ti ti-gut"></i>
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
