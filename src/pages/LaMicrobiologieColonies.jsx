const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Colonie%20bacteries'

const CATEGORIES = [
  {
    id: 'forme',
    nom: 'Forme',
    items: [
      { label: 'Punctiforme', image: `${BASE_URL}/punctiforme.png` },
      { label: 'Circulaire', image: `${BASE_URL}/circulaire.png` },
      { label: 'Filamenteuse', image: `${BASE_URL}/filamenteuse-forme.png` },
      { label: 'Irrégulière', image: `${BASE_URL}/irreguliere.png` },
      { label: 'Rhizoïde', image: `${BASE_URL}/rhizoide.png` },
      { label: 'Fusiforme', image: `${BASE_URL}/fusiforme.png` },
    ],
  },
  {
    id: 'relief',
    nom: 'Relief',
    items: [
      { label: 'Plate', image: `${BASE_URL}/plate.png` },
      { label: 'Bombée', image: `${BASE_URL}/bombee.png` },
      { label: 'Convexe', image: `${BASE_URL}/convexe.png` },
      { label: 'Pulvinée', image: `${BASE_URL}/pulvinee.png` },
      { label: 'Ombonée', image: `${BASE_URL}/ombonee.png` },
    ],
  },
  {
    id: 'contour',
    nom: 'Contour',
    items: [
      { label: 'Entière', image: `${BASE_URL}/entiere.png` },
      { label: 'Ondulée', image: `${BASE_URL}/ondulee.png` },
      { label: 'Filamenteuse', image: `${BASE_URL}/filamenteuse.png` },
      { label: 'Lobée', image: `${BASE_URL}/lobee.png` },
      { label: 'Érodée', image: `${BASE_URL}/erodee.png` },
      { label: 'Frisée', image: `${BASE_URL}/frisee.png` },
    ],
  },
]

export default function LaMicrobiologieColonies() {
  return (
    <div className="labo-detail-page">
      {CATEGORIES.map(cat => (
        <div key={cat.id} className="labo-ref-section">
          <h2 className="labo-ref-titre">{cat.nom}</h2>
          <div className="colonies-grid">
            {cat.items.map(item => (
              <div key={item.label} className="colonie-item">
                <div className="colonie-image-wrapper">
                  <img src={item.image} alt={item.label} className="colonie-image" />
                </div>
                <span className="colonie-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
