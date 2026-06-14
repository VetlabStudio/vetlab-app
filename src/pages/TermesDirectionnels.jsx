const TERMES = [
  { terme: 'Axial', def: 'Relatif au squelette axial (tête, colonne vertébrale, cage thoracique).' },
  { terme: 'Caudal', def: 'Orienté vers l\'arrière-train ou la queue.' },
  { terme: 'Crânial', def: 'Orienté vers la tête.' },
  { terme: 'Dorsal', def: 'Dirigé vers le dos ou la partie supérieure du corps. Opposé de ventral.' },
  { terme: 'Frontal', def: 'Plan qui divise le corps en parties supérieure et inférieure.' },
  { terme: 'Latéral', def: 'Qui se rapporte à un côté du corps.' },
  { terme: 'Mésial', def: 'Situé vers le centre de l\'arcade dentaire.' },
  { terme: 'Oblique', def: 'Plan incliné ou en diagonale.' },
  { terme: 'Palmaire', def: 'Relatif à la surface inférieure (coussinets) des pattes avant.' },
  { terme: 'Plantaire', def: 'Relatif à la surface inférieure (coussinets) des pattes arrière.' },
  { terme: 'Rostral', def: 'Situé vers le nez.' },
  { terme: 'Sagittal', def: 'Plan parallèle au plan médian du corps, divisant celui-ci en parties droite et gauche.' },
  { terme: 'Transversal', def: 'Divise le corps en parties antérieure (avant) et postérieure (arrière).' },
  { terme: 'Ventral', def: 'Dirigé vers la face ventrale (le ventre) ou inférieure. Opposé de dorsal.' },
]

export default function TermesDirectionnels() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/termes-directionnels.jpg" alt="Illustration des plans et termes directionnels" className="labo-sediment-photo-termes" />
        </div>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--2col-abrev">
            <span>Terme</span>
            <span>Définition</span>
          </div>
          {TERMES.map((item, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--2col">
              <span className="labo-ref-normal">{item.terme}</span>
              <span>{item.def}</span>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
