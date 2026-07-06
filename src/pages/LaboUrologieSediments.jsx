const SEDIMENTS = [
  { id: 1, nom: 'Hématies', description: 'Petits disques biconcaves, incolores à légèrement jaunâtres. Peuvent être crénelés en urine hypertonique ou gonflés en urine hypotonique.', photo: '/sediments/hematies.jpg' },
  { id: 2, nom: 'Leucocytes', description: 'Cellules granuleuses plus grandes que les hématies. Présence significative > 5/champ ×400. Indicateur d\'infection ou d\'inflammation.', photo: '/sediments/leucocytes.jpg' },
  { id: 3, nom: 'Cylindres', description: 'Transparents, homogènes, bords parallèles. Formés dans les tubules rénaux. Peu significatifs en petit nombre.', photo: '/sediments/cylindre.jpg' },
  { id: 4, nom: 'Cristaux de struvite', description: 'Forme de couvercle de cercueil, incolores. Fréquents en urine alcaline. Peuvent être normaux ou associés à des urolithes.', photo: '/sediments/struvite.jpg' },
  { id: 5, nom: 'Cristaux d\'oxalate de calcium dihydrate', description: 'Forme d\'enveloppe. Peuvent être normaux ou associés à une hypercalciurie ou une intoxication.', photo: '/sediments/oxalate-dihydrate.jpg' },
  { id: 6, nom: 'Cristaux d\'oxalate de calcium monohydrate', description: 'Forme de « dumbbell ». Souvent associée à une insuffisance rénale aiguë ou à une toxicité à l\'éthylène glycol.', photo: '/sediments/oxalate-monohydrate.jpg' },
  { id: 7, nom: 'Bactéries', description: 'Visibles sous forme de points mobiles ou de bâtonnets. Significatifs uniquement sur urine par cystocentèse.', photo: '/sediments/bacteries.jpg' },
  { id: 8, nom: 'Cellules épithéliales transitionnelles', description: 'Cellules de taille variable, provenant de la vessie ou de l\'urètre. Agrégats ou abondance = anormal.', photo: '/sediments/cellules-epitheliales.jpg' },
  { id: 9, nom: 'Phosphate de calcium', description: 'Apparaissent dans une urine neutre à basique, relativement rare. Observés chez les animaux avec une alimentation trop riche en calcium ou en phosphore, ou atteint d\'hypercalcémie.', photo: '/sediments/phosphate-calcium.jpg' },
  { id: 10, nom: 'Cystine', description: 'Se forme chez certains animaux ayant une anomalie génétique de la réabsorbtion tubulaire rénale de la cystine et d\'autres acides aminés. N\'altère pas la fonction rénale, mais favorise la formation de calculs.', photo: '/sediments/cystine.jpg' },
  { id: 11, nom: 'Bilirubine', description: 'Cristaux jaune-brun en fines aiguilles ou en granules. Présence anormale chez le chien sauf en très faible quantité, toujours anormale chez le chat. Associée à une maladie hépatique, une obstruction biliaire ou une hémolyse.', photo: '/sediments/bilirubine.jpg' },
]

export default function LaboUrologieSediments() {
  return (
    <div className="labo-detail-page">
      <div className="labo-sediments-liste">
        {SEDIMENTS.map(s => (
          <div key={s.id} className="labo-sediment-card">
            {s.photo ? (
              <img src={s.photo} alt={s.nom} className="labo-sediment-photo" />
            ) : (
              <div className="labo-sediment-placeholder">
                <i className="ti ti-microscope"></i>
                <span>Photo à venir</span>
              </div>
            )}
            <div className="labo-sediment-info">
              <h3 className="labo-sediment-nom">{s.nom}</h3>
              <p className="labo-sediment-desc">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
