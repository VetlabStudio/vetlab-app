import { useState, useMemo } from 'react'
import { t, enAnglais } from '../lib/i18n'

/* Les abréviations ne se traduisent pas mot à mot : chaque langue a
   sa propre liste, celle en usage dans les cliniques. */
const SECTIONS_FR = [
  {
    titre: 'Généralités',
    items: [
      { abr: 'cap.', sign: 'Capsule' },
      { abr: 'co.', sign: 'Comprimé' },
      { abr: 'Dx', sign: 'Diagnostic' },
      { abr: 'gtt.', sign: 'Goutte' },
      { abr: 'N', sign: 'Narcotique' },
      { abr: 'Px ou rx', sign: 'Prescription' },
      { abr: 'Tx', sign: 'Traitement' },
      { abr: 'Sx', sign: 'Chirurgie' },
    ],
  },
  {
    titre: 'Horaire d\'administration',
    items: [
      { abr: 'ad lib', sign: 'À volonté / au besoin' },
      { abr: 'SID', sign: 'Une fois par jour' },
      { abr: 'BID', sign: 'Deux fois par jour' },
      { abr: 'TID', sign: 'Trois fois par jour' },
      { abr: 'QID', sign: 'Quatre fois par jour' },
      { abr: 'qod', sign: 'Un jour sur deux' },
      { abr: 'qd', sign: 'Tous les jours' },
      { abr: 'PRN', sign: 'Au besoin' },
      { abr: 'Stat', sign: 'Immédiatement' },
      { abr: 'h.', sign: 'Heure' },
      { abr: 'qh', sign: 'Toutes les heures' },
      { abr: 'q4h', sign: 'Toutes les 4 heures' },
      { abr: 'q8h', sign: 'Toutes les 8 heures' },
    ],
  },
  {
    titre: 'Voies et sites d\'administration',
    items: [
      { abr: 'AD', sign: 'Oreille droite' },
      { abr: 'AS', sign: 'Oreille gauche' },
      { abr: 'AU', sign: 'Pour chaque oreille' },
      { abr: 'OD', sign: 'Œil droit' },
      { abr: 'OS', sign: 'Œil gauche' },
      { abr: 'OU', sign: 'Pour chaque œil' },
      { abr: 'ID', sign: 'Intradermique' },
      { abr: 'IM', sign: 'Intramusculaire' },
      { abr: 'IN', sign: 'Intranasal' },
      { abr: 'IP', sign: 'Intrapéritonéal' },
      { abr: 'IT', sign: 'Intratrachéal' },
      { abr: 'IV', sign: 'Intraveineux' },
      { abr: 'PO', sign: 'Par la bouche' },
      { abr: 'SC ou SQ', sign: 'Sous-cutané' },
      { abr: 'MAD', sign: 'Membre antérieur droit' },
      { abr: 'MAG', sign: 'Membre antérieur gauche' },
      { abr: 'MDI', sign: 'Inhalateur doseur (Metered Dose Inhaler)' },
      { abr: 'MPD', sign: 'Membre postérieur droit' },
      { abr: 'MPG', sign: 'Membre postérieur gauche' },
      { abr: 'MTD', sign: 'Membre thoracique droit' },
      { abr: 'MTG', sign: 'Membre thoracique gauche' },
      { abr: 'LD', sign: 'Lombaire droit' },
      { abr: 'LG', sign: 'Lombaire gauche' },
    ],
  },
]

// Usage nord-américain (cliniques vétérinaires du Canada et des États-Unis).
const SECTIONS_EN = [
  {
    titre: 'General',
    items: [
      { abr: 'cap.', sign: 'Capsule' },
      { abr: 'tab.', sign: 'Tablet' },
      { abr: 'Dx', sign: 'Diagnosis' },
      { abr: 'gtt.', sign: 'Drop' },
      { abr: 'N', sign: 'Narcotic' },
      { abr: 'Rx', sign: 'Prescription' },
      { abr: 'Tx', sign: 'Treatment' },
      { abr: 'Sx', sign: 'Surgery' },
    ],
  },
  {
    titre: 'Dosing schedule',
    items: [
      { abr: 'ad lib', sign: 'Free choice / as desired' },
      { abr: 'SID', sign: 'Once a day' },
      { abr: 'BID', sign: 'Twice a day' },
      { abr: 'TID', sign: 'Three times a day' },
      { abr: 'QID', sign: 'Four times a day' },
      { abr: 'EOD', sign: 'Every other day' },
      { abr: 'PRN', sign: 'As needed' },
      { abr: 'Stat', sign: 'Immediately' },
      { abr: 'h', sign: 'Hour' },
      { abr: 'q1h', sign: 'Every hour' },
      { abr: 'q4h', sign: 'Every 4 hours' },
      { abr: 'q8h', sign: 'Every 8 hours' },
    ],
  },
  {
    titre: 'Routes and sites of administration',
    items: [
      { abr: 'AD', sign: 'Right ear' },
      { abr: 'AS', sign: 'Left ear' },
      { abr: 'AU', sign: 'Both ears' },
      { abr: 'OD', sign: 'Right eye' },
      { abr: 'OS', sign: 'Left eye' },
      { abr: 'OU', sign: 'Both eyes' },
      { abr: 'ID', sign: 'Intradermal' },
      { abr: 'IM', sign: 'Intramuscular' },
      { abr: 'IN', sign: 'Intranasal' },
      { abr: 'IP', sign: 'Intraperitoneal' },
      { abr: 'IT', sign: 'Intratracheal' },
      { abr: 'IV', sign: 'Intravenous' },
      { abr: 'PO', sign: 'By mouth' },
      { abr: 'SC or SQ', sign: 'Subcutaneous' },
      { abr: 'MDI', sign: 'Metered-dose inhaler' },
      { abr: 'RF', sign: 'Right forelimb' },
      { abr: 'LF', sign: 'Left forelimb' },
      { abr: 'RH', sign: 'Right hind limb' },
      { abr: 'LH', sign: 'Left hind limb' },
    ],
  },
]

const SECTIONS = enAnglais ? SECTIONS_EN : SECTIONS_FR

export default function AbreviationsCourantes() {
  const [recherche, setRecherche] = useState('')

  const resultats = useMemo(() => {
    const terme = recherche.trim().toLowerCase()
    if (!terme) return null
    return SECTIONS.flatMap(s => s.items)
      .filter(i => i.abr.toLowerCase().includes(terme) || i.sign.toLowerCase().includes(terme))
  }, [recherche])

  return (
    <div className="labo-detail-page">

      <div className="recherche-wrapper">
        <div className="recherche-icone">
          <i className="ti ti-search"></i>
        </div>
        <input
          type="text"
          className="recherche-input"
          placeholder={t('Rechercher une abréviation...')}
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
        />
        {recherche && (
          <button className="recherche-clear" onClick={() => setRecherche('')}>
            <i className="ti ti-x"></i>
          </button>
        )}
      </div>

      {resultats ? (
        <div className="labo-ref-section">
          <div className="labo-ref-tableau">
            <div className="labo-ref-header labo-ref-header--2col-abrev">
              <span>{t('Abréviation')}</span>
              <span>{t('Signification')}</span>
            </div>
            {resultats.length > 0 ? resultats.map((item, i) => (
              <div key={i} className="labo-ref-ligne labo-ref-ligne--2col">
                <span className="labo-ref-normal">{item.abr}</span>
                <span>{item.sign}</span>
              </div>
            )) : (
              <div className="labo-ref-ligne labo-ref-ligne--2col">
                <span style={{ gridColumn: '1 / -1', color: 'var(--text-hint)' }}>{t('Aucun résultat')}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        SECTIONS.map(section => (
          <div className="labo-ref-section" key={section.titre}>
            <h2 className="labo-ref-titre">{section.titre}</h2>
            <div className="labo-ref-tableau">
              <div className="labo-ref-header labo-ref-header--4col-abrev">
                <span>{t('Abréviation')}</span>
                <span>{t('Signification')}</span>
                <span>{t('Abréviation')}</span>
                <span>{t('Signification')}</span>
              </div>
              {Array.from({ length: Math.ceil(section.items.length / 2) }).map((_, rowIndex) => {
                const a = section.items[rowIndex * 2]
                const b = section.items[rowIndex * 2 + 1]
                return (
                  <div key={rowIndex} className="labo-ref-ligne labo-ref-ligne--4col-abrev">
                    <span className="labo-ref-normal">{a.abr}</span>
                    <span>{a.sign}</span>
                    <span className="labo-ref-normal">{b ? b.abr : ''}</span>
                    <span>{b ? b.sign : ''}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

    </div>
  )
}
