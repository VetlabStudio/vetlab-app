const SEDIMENTS = [
  { id: 1, nom: 'Hématies', description: 'Petits disques biconcaves, incolores à légèrement jaunâtres. Peuvent être crénelés en urine hypertonique ou gonflés en urine hypotonique.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/globule%20rouge.jpg' },
  { id: 2, nom: 'Leucocytes', description: 'Cellules granuleuses plus grandes que les hématies. Présence significative > 5/champ ×400. Indicateur d\'infection ou d\'inflammation.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/globules%20blanc.jpg' },
  { id: 3, nom: 'Cylindres', description: 'Transparents, homogènes, bords parallèles. Formés dans les tubules rénaux. Peu significatifs en petit nombre.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/cylindre%20urinaire.jpg' },
  { id: 4, nom: 'Cristaux de struvite', description: 'Forme de couvercle de cercueil, incolores. Fréquents en urine alcaline. Peuvent être normaux ou associés à des urolithes.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/struvite1.jpg' },
  { id: 5, nom: 'Cristaux d\'oxalate de calcium dihydrate', description: 'Forme d\'enveloppe. Peuvent être normaux ou associés à une hypercalciurie ou une intoxication.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/oxalate%20dihydrate.jpg' },
  { id: 6, nom: 'Cristaux d\'oxalate de calcium monohydrate', description: 'Forme de « dumbbell ». Souvent associée à une insuffisance rénale aiguë ou à une toxicité à l\'éthylène glycol.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/oxalate%20monohydrate1.jpg' },
  { id: 7, nom: 'Bactéries', description: 'Visibles sous forme de points mobiles ou de bâtonnets. Significatifs uniquement sur urine par cystocentèse.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/bacterie.jpg' },
  { id: 8, nom: 'Cellules épithéliales transitionnelles', description: 'Cellules de taille variable, provenant de la vessie ou de l\'urètre. Agrégats ou abondance = anormal.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/cellules%20epitheliales.jpg' },
  { id: 9, nom: 'Phosphate de calcium', description: 'Apparaissent dans une urine neutre à basique, relativement rare. Observés chez les animaux avec une alimentation trop riche en calcium ou en phosphore, ou atteint d\'hypercalcémie.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/stock-photo-calcium-phosphate-crystals-rosette-shape-in-urine-analysis-653684056.jpg' },
  { id: 9, nom: 'Cystine', description: 'Se forme chez certains animaux ayant une anomalie génétique de la réabsorbtion tubulaire rénale de la cystine et d\'autres acides aminés. N\'altère pas la fonction rénale, mais favorise la formation de calculs.', photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/SedimentsUrinaire/cystine.jpg' },
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
