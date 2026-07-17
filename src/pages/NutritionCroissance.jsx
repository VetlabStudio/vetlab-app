const SECTIONS = [
  {
    titre: 'Énergie et densité',
    principes: [
      'BEQ : environ 3 × BEE en début de croissance, diminuant vers 1,8–2 × BEE à l\'approche de la taille adulte.',
      'Densité énergétique cible : 3,5 à 4,5 kcal/g MS.',
      'Repas mesurés et fractionnés — éviter l\'alimentation ad libitum.',
      'Objectif de condition corporelle : score 4–5/9.',
    ],
  },
  {
    titre: 'Protéines et calcium',
    principes: [
      'Protéines : 22 à 32 % MS (toutes races), de haute qualité et haute digestibilité.',
      'Petites et moyennes races : calcium 0,7 à 1,7 % MS, phosphore 0,6 à 1,1 % MS.',
      'Grandes et géantes races : calcium 0,7 à 1,2 % MS, phosphore 0,6 à 1,1 % MS (fourchette plus étroite).',
      'Ne JAMAIS supplémenter en calcium chez un chiot de grande race.',
    ],
  },
  {
    titre: 'Grandes races (chien)',
    principes: [
      'Choisir un aliment formulé « chiot grande race » à calcium et densité énergétique contrôlés.',
      'Éviter tout supplément minéral (calcium, phosphore, vitamines liposolubles) sans prescription vétérinaire.',
    ],
  },
  {
    titre: 'Petites races (chien) et chats',
    principes: [
      'Densité énergétique élevée pour compenser la petite capacité gastrique.',
      'Repas plus fréquents chez les très jeunes animaux (risque d\'hypoglycémie chez le chiot de petite race).',
      'Aliment répondant aux normes AAFCO ou FEDIAF « croissance » ou « toutes les étapes de vie ».',
      'Transition progressive vers l\'aliment adulte selon la taille et l\'espèce.',
    ],
  },
]

export default function NutritionCroissance() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
  <i className="ti ti-info-circle"></i>
  <span><strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient ~75–80 % d'eau alors qu'une croquette en contient ~10 %.</span>
</div>
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
