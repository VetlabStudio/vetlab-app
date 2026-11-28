import { t } from '../lib/i18n'
const TERMES = [
  { terme: 'Apical', def: t("Orienté vers l'apex ou la pointe de la racine de la dent.") },
  { terme: 'Buccal', def: t('Surface externe de la dent du côté des joues (prémolaires, molaires).') },
  { terme: 'Caudal', def: t("Vers l'arrière de la cavité buccale, après les prémolaires.") },
  { terme: 'Coronal', def: t('En direction de la couronne de la dent, au-dessus de la gencive.') },
  { terme: 'Distal', def: t("Surface de la dent éloignée de la ligne médiane de l'arcade, vers le fond.") },
  { terme: 'Interproximal', def: t('Espace entre deux dents adjacentes, souvent difficile à nettoyer.') },
  { terme: 'Labial', def: t('Surface externe du côté des lèvres (incisives et canines).') },
  { terme: 'Lingual', def: t('Surface interne des dents du côté de la langue (mandibule).') },
  { terme: 'Mésial', def: t("Surface de la dent proche de la ligne médiane, vers l'avant.") },
  { terme: 'Occlusal', def: t('Surface masticatoire des prémolaires et molaires (face de contact).') },
  { terme: 'Palatin', def: t('Surface interne des dents du côté du palais (maxillaire).') },
  { terme: 'Rostral', def: t('En direction de la truffe (utilisé pour les structures antérieures à la bouche).') },
  { terme: 'Sous-gingival', def: t('Situé sous le rebord de la gencive, dans le sulcus (sillon gingival) ou la poche parodontale.') },
  { terme: 'Supragingival', def: t('Situé au-dessus de la gencive, sur la partie visible de la dent.') },
]

export default function SoinsGenerauxDentisterieTermesDirectionnels() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/terminologie-dentaire.png" alt={t('Terminologie dentaire')} className="labo-charte-dentaire" />
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
