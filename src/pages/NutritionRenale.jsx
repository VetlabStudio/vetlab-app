const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'L\'alimentation est un pilier central du traitement de l\'insuffisance rénale chronique (IRC).',
      'Initier la transition vers un aliment rénal dès le stade 2 IRIS (créatinine > 1,6 mg/dL chez le chien, > 1,4 mg/dL chez le chat).',
      'La transition vers un aliment rénal doit être progressive (7–14 jours) pour éviter l\'aversion alimentaire.',
      'Maintenir un appétit et un apport calorique adéquat — une cachexie rénale aggrave le pronostic.',
    ],
  },
  {
    titre: 'Phosphore',
    principes: [
      'La restriction en phosphore est l\'intervention nutritionnelle la plus importante dans l\'IRC.',
      'Objectif : phosphore sérique < 4,5 mg/dL (stade 1–2) à < 6 mg/dL (stade 3–4).',
      'Les aliments rénaux du commerce sont formulés avec une teneur réduite en phosphore.',
      'Si restriction alimentaire insuffisante : ajouter un chélateur de phosphore intestinal (carbonate de calcium, sevelamer).',
    ],
  },
  {
    titre: 'Protéines',
    principes: [
      'Restriction protéique modérée pour réduire la charge azotée (urée) — mais ne pas restreindre excessivement.',
      'Protéines de haute valeur biologique (digestibilité élevée) pour minimiser les déchets azotés.',
      'Chez le chat : ne pas restreindre trop agressivement (risque de sarcopénie — les chats ont des besoins protéiques élevés).',
      'Surveiller l\'albumine sérique — une hypoalbuminémie indique un apport insuffisant.',
    ],
  },
  {
    titre: 'Hydratation et sodium',
    principes: [
      'Hydratation maximale — les reins en insuffisance ont besoin d\'un flux urinaire adéquat.',
      'Favoriser les aliments humides (conserves, sachets) pour augmenter l\'apport en eau.',
      'Sodium modéré — éviter les excès (hypertension fréquente en IRC) sans restriction sévère.',
      'Potassium : surveillance et supplémentation si hypokaliémie (fréquente chez le chat en IRC).',
    ],
  },
  {
    titre: 'Acides gras oméga-3',
    principes: [
      'EPA et DHA (huile de poisson) : réduisent l\'inflammation rénale et ralentissent la progression.',
      'Dose recommandée : 40 mg EPA+DHA/kg/jour.',
      'Éviter les huiles végétales (lin, chanvre) — l\'ALA est peu converti en EPA/DHA chez le carnivore.',
    ],
  },
]

export default function NutritionRenale() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-filter"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <ul className="nutrition-principes">
            {s.principes.map((p, j) => (
              <li key={j} className="nutrition-principe-item">{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
