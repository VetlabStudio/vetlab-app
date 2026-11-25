import { useState } from 'react'
import { t, tn, chiffres } from '../lib/i18n'

const SECTIONS = [
  {
    titre: t('Densité urinaire'),
    colonnes: [t('Paramètre'), t('Chien'), t('Chat')],
    lignes: [
      { param: t('Plage physiologique possible'), chien: '1,001–1,075', chat: '1,001–1,085' },
      { param: t('Valeurs usuelles courantes'), chien: '1,020–1,040', chat: '1,035–1,060' },
      { param: t('Rein fonctionnel (animal hydraté)'), chien: '≥ 1,025–1,035', chat: '≥ 1,040–1,055' },
      { param: t('Isosthénurie (signe d\'alerte)'), chien: '1,007–1,015', chat: '1,007–1,015', alerte: true },
      { param: t('Hyposthénurie'), chien: '< 1,007', chat: '< 1,007', alerte: true },
    ],
    renderLigne: (row, i) => (
      <div key={i} className={`labo-ref-ligne${row.alerte ? ' alerte' : ''}`}>
        <span>{row.param}</span>
        <span>{chiffres(row.chien)}</span>
        <span>{chiffres(row.chat)}</span>
      </div>
    ),
  },
  {
    titre: t('Paramètres de la bandelette'),
    colonnes: [t('Paramètre'), t('Valeur normale'), t('Seuil d\'alerte')],
    lignes: [
      { param: 'pH', normal: '5,0–7,5', alerte_val: t('< 5 ou > 7,5') },
      { param: t('Protéines'), normal: t('Négatif à trace'), alerte_val: t('> 1+ avec culot inactif') },
      { param: t('Glucose'), normal: t('Négatif'), alerte_val: t('Toute détection = anormale') },
      { param: t('Corps cétoniques'), normal: t('Négatif'), alerte_val: t('Toute détection = anormale') },
      { param: t('Bilirubine'), normal: t('Négatif'), alerte_val: t('Trace acceptable chien mâle dense seulement') },
      { param: t('Sang / Hémoglobine'), normal: t('Négatif'), alerte_val: t('Toute détection - confirmer au culot') },
    ],
    renderLigne: (row, i) => (
      <div key={i} className="labo-ref-ligne">
        <span>{row.param}</span>
        <span className="labo-ref-normal">{chiffres(row.normal)}</span>
        <span className="labo-ref-alerte-val">{chiffres(row.alerte_val)}</span>
      </div>
    ),
  },
  {
    titre: t('Sédiment urinaire - seuils'),
    note: t('Champ ×400 sauf indication'),
    colonnes: [t('Élément'), t('Normal'), t('Anormal')],
    lignes: [
      { element: t('Hématies'), normal: '0–5', anormal: '> 5' },
      { element: t('Leucocytes'), normal: '0–5', anormal: '> 5' },
      { element: t('Bactéries (cystocentèse)'), normal: t('Absentes'), anormal: t('Toute présence') },
      { element: t('Cylindres hyalins (×100)'), normal: t('0–2 / champ'), anormal: '> 2' },
      { element: t('Cylindres granuleux / cellulaires'), normal: t('Absents'), anormal: t('Toute présence') },
      { element: t('Cellules épithéliales non squameuses'), normal: t('Rares'), anormal: t('Agrégats ou abondance') },
    ],
    renderLigne: (row, i) => (
      <div key={i} className="labo-ref-ligne">
        <span>{row.element}</span>
        <span className="labo-ref-normal">{row.normal}</span>
        <span className="labo-ref-alerte-val">{row.anormal}</span>
      </div>
    ),
  },
]

export default function LaboUrologieValeurs() {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SECTIONS.map((section, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={i} className="labo-tube-card">
              <button
                className={`labo-valeurs-accordeon-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <span className="labo-ref-titre">{section.titre}</span>
                <span style={{ fontSize: 12, color: 'var(--text-hint)', marginRight: 4 }}>
                  {tn(section.lignes.length, '{n} paramètre', '{n} paramètres')}
                </span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>
              {estOuvert && (
                <>
                  {section.note && (
                    <p className="labo-ref-note" style={{ margin: '0 16px 0', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      {section.note}
                    </p>
                  )}
                  <div className="labo-ref-tableau" style={{ borderRadius: 0, border: 'none' }}>
                    <div className="labo-ref-header">
                      {section.colonnes.map((c, j) => <span key={j}>{c}</span>)}
                    </div>
                    {section.lignes.map((row, j) => section.renderLigne(row, j))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
