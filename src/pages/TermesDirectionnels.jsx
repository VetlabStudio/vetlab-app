import { t } from '../lib/i18n'
const TERMES = [
  { terme: 'Axial', def: t('Relatif au squelette axial (tête, colonne vertébrale, cage thoracique).') },
  { terme: 'Caudal', def: t('Orienté vers l\'arrière-train ou la queue.') },
  { terme: 'Crânial', def: t('Orienté vers la tête.') },
  { terme: 'Dorsal', def: t('Dirigé vers le dos ou la partie supérieure du corps. Opposé de ventral.') },
  { terme: 'Frontal', def: t('Plan parallèle au dos (aussi appelé plan dorsal), qui divise le corps en parties dorsale et ventrale.') },
  { terme: 'Latéral', def: t('Qui se rapporte à un côté du corps.') },
  { terme: 'Mésial', def: t('Situé vers le centre de l\'arcade dentaire.') },
  { terme: 'Oblique', def: t('Plan incliné ou en diagonale.') },
  { terme: 'Palmaire', def: t('Relatif à la surface inférieure (coussinets) des pattes avant.') },
  { terme: 'Plantaire', def: t('Relatif à la surface inférieure (coussinets) des pattes arrière.') },
  { terme: 'Rostral', def: t('Situé vers le nez.') },
  { terme: 'Sagittal', def: t('Plan parallèle au plan médian du corps, divisant celui-ci en parties droite et gauche.') },
  { terme: 'Transversal', def: t('Plan perpendiculaire à l\'axe du corps, qui le divise en parties crâniale et caudale.') },
  { terme: 'Ventral', def: t('Dirigé vers la face ventrale (le ventre) ou inférieure. Opposé de dorsal.') },
]

export default function TermesDirectionnels() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/termes-directionnels.jpg" alt={t('Illustration des plans et termes directionnels')} className="labo-sediment-photo-termes" />
        </div>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--2col-abrev">
            <span>{t('Terme')}</span>
            <span>{t('Définition')}</span>
          </div>
          {TERMES.map((item, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--2col">
              <span className="labo-ref-normal">{t(item.terme)}</span>
              <span>{item.def}</span>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
