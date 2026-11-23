import { lireNombrePositif } from '../lib/nombres'
import { ECART_MAX_COMPRIMES } from '../lib/doses'
import { t, enAnglais } from '../lib/i18n'

/* Calcul en comprimés, partagé par la fiche médicament et le Calcul
   rapide : choix de la forme, teneur du comprimé et ligne de résultat. */

export function ChoixForme({ forme, onChange }) {
  return (
    <div className="champ">
      <label>{t('Forme')}</label>
      <div className="radio-groupe" role="group" aria-label={t('Forme du médicament')}>
        <button className={`radio-btn ${forme === 'liquide' ? 'active' : ''}`} aria-pressed={forme === 'liquide'} onClick={() => onChange('liquide')}>{t('Liquide')}</button>
        <button className={`radio-btn ${forme === 'comprime' ? 'active' : ''}`} aria-pressed={forme === 'comprime'} onClick={() => onChange('comprime')}>{t('Comprimé')}</button>
      </div>
    </div>
  )
}

export function ChampTeneur({ teneur, onTeneur, unite, onUnite }) {
  const invalide = teneur.trim() !== '' && lireNombrePositif(teneur) === null
  return (
    <div className="champ">
      <label>{t('Teneur d\'un comprimé')}</label>
      <div className="champ-input">
        <div className="champ-icone-wrapper">
          <img src="/icone-pill.svg" alt={t('comprimé')} />
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={teneur}
          onChange={e => onTeneur(e.target.value.replace(',', '.'))}
          placeholder="Ex: 25"
        />
        <div className="radio-groupe">
          <button className={`radio-btn ${unite === 'mg' ? 'active' : ''}`} onClick={() => onUnite('mg')}>mg</button>
          <button className={`radio-btn ${unite === 'mcg' ? 'active' : ''}`} onClick={() => onUnite('mcg')}>mcg</button>
        </div>
      </div>
      {invalide && <p className="fluido-erreur">{t('Teneur invalide, entrez une valeur supérieure à 0.')}</p>}
    </div>
  )
}

// resultat : celui de calculComprimes, ou null tant qu'un champ manque.
export function ResultatComprimes({ resultat }) {
  const ecart = resultat?.comprimes ? Math.abs(resultat.ecart) : 0
  return (
    <>
      <div className="resultat-ligne">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="champ-icone-wrapper">
            <img src="/icone-pill.svg" alt={t('comprimés')} />
          </div>
          {t('Comprimés à donner')}
        </span>
        <strong>{!resultat ? '—' : resultat.comprimes || t('Moins de ¼')}</strong>
      </div>
      {resultat?.comprimes && (
        <p style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.5, margin: '-6px 0 0' }}>
          {t('Calcul exact :')} {resultat.exact} {Number(resultat.exact) >= 2 || (enAnglais && Number(resultat.exact) > 1) ? t('comprimés') : t('comprimé')}. {t('Dose donnée :')} {resultat.doseDonnee}.
        </p>
      )}
      {resultat && (!resultat.comprimes || ecart > ECART_MAX_COMPRIMES) && (
        <div className="avertissement-plage">
          <i className="ti ti-alert-triangle"></i>
          {resultat.comprimes
            ? (resultat.ecart > 0
              ? t('L\'arrondi au quart de comprimé donne {n} % de plus que la dose calculée. Confirmez avec le vétérinaire.', { n: Math.round(ecart * 100) })
              : t('L\'arrondi au quart de comprimé donne {n} % de moins que la dose calculée. Confirmez avec le vétérinaire.', { n: Math.round(ecart * 100) }))
            : t("Moins d'un quart de comprimé : choisissez une teneur plus petite ou une forme liquide.")}
        </div>
      )}
    </>
  )
}
