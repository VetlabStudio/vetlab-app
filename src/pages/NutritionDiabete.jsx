const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'L\'objectif nutritionnel est de minimiser les fluctuations glycémiques post-prandiales.',
      'La constance est clé : même aliment, même quantité, même horaire à chaque repas.',
      'Associer les repas à l\'administration d\'insuline selon le protocole vétérinaire.',
      'Atteindre et maintenir un poids corporel idéal (score 4–5/9).',
    ],
  },
  {
    titre: 'Chien diabétique',
    principes: [
      'Régime riche en fibres (fibres solubles et insolubles) pour ralentir l\'absorption du glucose.',
      'Teneur modérée en graisses — éviter l\'obésité et réduire le risque de pancréatite.',
      'Protéines de haute qualité pour maintenir la masse musculaire.',
      'Éviter les aliments riches en sucres simples et en glucides très digestibles.',
      'Nourrir juste avant ou au moment de l\'injection d\'insuline.',
    ],
  },
  {
    titre: 'Chat diabétique',
    principes: [
      'Régime pauvre en glucides (< 10 % de l\'énergie métabolisable) — les chats sont carnivores stricts.',
      'Régime riche en protéines de haute qualité pour maintenir la masse musculaire.',
      'Les aliments humides sont souvent préférables (moins de glucides que les croquettes).',
      'La perte de poids chez un chat obèse peut induire une rémission diabétique.',
      'Éviter les croquettes standard riches en amidon.',
    ],
  },
  {
    titre: 'Surveillance et ajustements',
    principes: [
      'Peser régulièrement et ajuster les portions si prise ou perte de poids.',
      'Surveiller la courbe glycémique après tout changement alimentaire.',
      'En cas d\'hypoglycémie, avoir du miel ou du dextrose à portée de main.',
    ],
  },
]

export default function NutritionDiabete() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplet"></i>
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
