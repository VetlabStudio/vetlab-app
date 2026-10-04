import { useState } from 'react'

const SECTIONS = [
  {
    titre: 'Densité urinaire',
    colonnes: ['Paramètre', 'Chien', 'Chat'],
    lignes: [
      { param: 'Plage physiologique possible', chien: '1,001–1,075', chat: '1,001–1,085' },
      { param: 'Valeurs usuelles courantes', chien: '1,020–1,040', chat: '1,035–1,060' },
      { param: 'Rein fonctionnel (animal hydraté)', chien: '≥ 1,025–1,035', chat: '≥ 1,040–1,055' },
      { param: 'Isosthénurie (signe d\'alerte)', chien: '1,007–1,015', chat: '1,007–1,015', alerte: true },
      { param: 'Hyposthénurie', chien: '< 1,007', chat: '< 1,007', alerte: true },
    ],
    renderLigne: (row, i) => (
      <div key={i} className={`labo-ref-ligne${row.alerte ? ' alerte' : ''}`}>
        <span>{row.param}</span>
        <span>{row.chien}</span>
        <span>{row.chat}</span>
      </div>
    ),
  },
  {
    titre: 'Paramètres de la bandelette',
    colonnes: ['Paramètre', 'Valeur normale', 'Seuil d\'alerte'],
    lignes: [
      { param: 'pH', normal: '5,0–7,5', alerte_val: '< 5 ou > 7,5' },
      { param: 'Protéines', normal: 'Négatif à trace', alerte_val: '> 1+ avec culot inactif' },
      { param: 'Glucose', normal: 'Négatif', alerte_val: 'Toute détection = anormale' },
      { param: 'Corps cétoniques', normal: 'Négatif', alerte_val: 'Toute détection = anormale' },
      { param: 'Bilirubine', normal: 'Négatif', alerte_val: 'Trace acceptable chien mâle dense seulement' },
      { param: 'Sang / Hémoglobine', normal: 'Négatif', alerte_val: 'Toute détection - confirmer au culot' },
    ],
    renderLigne: (row, i) => (
      <div key={i} className="labo-ref-ligne">
        <span>{row.param}</span>
        <span className="labo-ref-normal">{row.normal}</span>
        <span className="labo-ref-alerte-val">{row.alerte_val}</span>
      </div>
    ),
  },
  {
    titre: 'Sédiment urinaire - seuils',
    note: 'Champ ×400 sauf indication',
    colonnes: ['Élément', 'Normal', 'Anormal'],
    lignes: [
      { element: 'Hématies', normal: '0–5', anormal: '> 5' },
      { element: 'Leucocytes', normal: '0–5', anormal: '> 5' },
      { element: 'Bactéries (cystocentèse)', normal: 'Absentes', anormal: 'Toute présence' },
      { element: 'Cylindres hyalins (×100)', normal: '0–2 / champ', anormal: '> 2' },
      { element: 'Cylindres granuleux / cellulaires', normal: 'Absents', anormal: 'Toute présence' },
      { element: 'Cellules épithéliales non squameuses', normal: 'Rares', anormal: 'Agrégats ou abondance' },
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
                  {section.lignes.length} paramètres
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
