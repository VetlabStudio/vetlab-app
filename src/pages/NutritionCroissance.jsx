const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'Utiliser un aliment formulé spécifiquement pour la croissance ou toutes les étapes de vie (AAFCO / FEDIAF).',
      'Les besoins énergétiques sont 2× à 3× supérieurs à ceux d\'un adulte au même poids.',
      'Protéines de haute qualité et haute digestibilité essentielles au développement musculaire.',
      'Calcium et phosphore adéquats — ratio Ca:P entre 1:1 et 2:1 pour le développement osseux.',
      'Éviter la supplémentation en calcium chez les grandes races (risque de déséquilibre osseux).',
    ],
  },
  {
    titre: 'Grandes races (chien)',
    principes: [
      'Contrôler la vitesse de croissance — une croissance trop rapide augmente le risque de maladies ostéo-articulaires.',
      'Choisir un aliment formulé spécifiquement pour grandes races (teneur en calcium et densité énergétique adaptées).',
      'Éviter l\'alimentation ad libitum — privilégier des repas mesurés.',
      'Surveiller la condition corporelle régulièrement (objectif : score 4–5/9).',
    ],
  },
  {
    titre: 'Petites races (chien) et chats',
    principes: [
      'Densité énergétique élevée pour compenser un estomac de petite capacité.',
      'Fréquence des repas plus élevée chez les très jeunes animaux (risque d\'hypoglycémie).',
      'Transition progressive vers l\'aliment adulte selon la taille et l\'espèce.',
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
