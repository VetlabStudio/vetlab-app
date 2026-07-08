const SECTIONS = [
  {
    titre: 'Objectifs et énergie',
    principes: [
      'Objectifs : obtenir une croissance saine, optimiser l\'immunité, et minimiser l\'obésité et les maladies orthopédiques du développement (DOD).',
      'DER en début de croissance : environ 3 × RER, diminuant vers 1,8–2 × RER à l\'approche de la taille adulte.',
      'Densité énergétique cible : 3,5 à 4,5 kcal/g MS.',
      'Éviter la suralimentation et le nourrissage à volonté — surveiller la condition corporelle régulièrement (objectif : score 4–5/9).',
    ],
  },
  {
    titre: 'Protéines et calcium',
    principes: [
      'Protéines : 22 à 32 % MS (toutes races), de haute qualité et haute digestibilité.',
      'Calcium — point critique chez la grande race : l\'excès de calcium cause des DOD.',
      'Petites et moyennes races : calcium 0,7 à 1,7 % MS, phosphore 0,6 à 1,1 % MS.',
      'Grandes et géantes races : calcium 0,7 à 1,2 % MS, phosphore 0,6 à 1,1 % MS (fourchette plus étroite).',
      'Ne JAMAIS supplémenter en calcium chez un chiot de grande race — risque de déséquilibre osseux grave.',
    ],
  },
  {
    titre: 'Grandes races (chien)',
    principes: [
      'Choisir un aliment formulé « chiot grande race » à calcium et densité énergétique contrôlés plutôt qu\'un aliment chiot standard.',
      'Une croissance trop rapide augmente le risque de DOD (ostéochondrose, panosteïte, HOD).',
      'Éviter l\'alimentation ad libitum — repas mesurés et fractionnés.',
      'Éviter tout supplément minéral (calcium, phosphore, vitamines liposolubles) sans prescription vétérinaire.',
    ],
  },
  {
    titre: 'Petites races (chien) et chats',
    principes: [
      'Densité énergétique élevée pour compenser la petite capacité gastrique.',
      'Fréquence des repas plus élevée chez les très jeunes animaux — risque d\'hypoglycémie chez le chiot de petite race.',
      'Transition progressive vers l\'aliment adulte selon la taille et l\'espèce.',
      'Choisir un aliment répondant aux normes AAFCO ou FEDIAF « croissance » ou « toutes les étapes de vie ».',
    ],
  },
]

export default function NutritionCroissance() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-plant"></i>
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
