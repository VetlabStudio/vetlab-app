import { t } from '../lib/i18n'
const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Colonie%20bacteries'

const CATEGORIES = [
  {
    id: 'forme',
    nom: t('Forme'),
    items: [
      { label: t('Punctiforme'), image: `${BASE_URL}/punctiforme.png` },
      { label: t('Circulaire'), image: `${BASE_URL}/circulaire.png` },
      { label: t('Filamenteuse'), image: `${BASE_URL}/filamenteuse-forme.png` },
      { label: t('Irrégulière'), image: `${BASE_URL}/irreguliere.png` },
      { label: t('Rhizoïde'), image: `${BASE_URL}/rhizoide.png` },
      { label: t('Fusiforme'), image: `${BASE_URL}/fusiforme.png` },
    ],
  },
  {
    id: 'relief',
    nom: t('Relief'),
    items: [
      { label: t('Plate'), image: `${BASE_URL}/plate.png` },
      { label: t('Bombée'), image: `${BASE_URL}/bombee.png` },
      { label: t('Convexe'), image: `${BASE_URL}/convexe.png` },
      { label: t('Pulvinée'), image: `${BASE_URL}/pulvinee.png` },
      { label: t('Ombonée'), image: `${BASE_URL}/ombonee.png` },
    ],
  },
  {
    id: 'contour',
    nom: t('Contour'),
    items: [
      { label: t('Entière'), image: `${BASE_URL}/entiere.png` },
      { label: t('Ondulée'), image: `${BASE_URL}/ondulee.png` },
      { label: t('Filamenteuse'), image: `${BASE_URL}/filamenteuse.png` },
      { label: t('Lobée'), image: `${BASE_URL}/lobee.png` },
      { label: t('Érodée'), image: `${BASE_URL}/erodee.png` },
      { label: t('Frisée'), image: `${BASE_URL}/frisee.png` },
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
