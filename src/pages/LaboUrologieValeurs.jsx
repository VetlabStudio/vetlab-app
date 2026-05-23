export default function LaboUrologieValeurs() {
  return (
    <div className="labo-detail-page">

      {/* ─── DENSITÉ URINAIRE ───────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Densité urinaire</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header">
            <span>Paramètre</span>
            <span>Chien</span>
            <span>Chat</span>
          </div>
          {[
            { param: 'Plage physiologique possible', chien: '1,001–1,075', chat: '1,001–1,085' },
            { param: 'Valeurs usuelles courantes', chien: '1,020–1,040', chat: '1,035–1,060' },
            { param: 'Rein fonctionnel (animal hydraté)', chien: '≥ 1,025–1,035', chat: '≥ 1,040–1,055' },
            { param: 'Isosthénurie (signe d\'alerte)', chien: '1,007–1,015', chat: '1,007–1,015', alerte: true },
            { param: 'Hyposthénurie', chien: '< 1,007', chat: '< 1,007', alerte: true },
          ].map((row, i) => (
            <div key={i} className={`labo-ref-ligne ${row.alerte ? 'alerte' : ''}`}>
              <span>{row.param}</span>
              <span>{row.chien}</span>
              <span>{row.chat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BANDELETTE ─────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Paramètres de la bandelette</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header">
            <span>Paramètre</span>
            <span>Valeur normale</span>
            <span>Seuil d'alerte</span>
          </div>
          {[
            { param: 'pH', normal: '5,0–7,5', alerte_val: '< 5 ou > 7,5' },
            { param: 'Protéines', normal: 'Négatif à trace', alerte_val: '> 1+ avec culot inactif' },
            { param: 'Glucose', normal: 'Négatif', alerte_val: 'Toute détection = anormale' },
            { param: 'Corps cétoniques', normal: 'Négatif', alerte_val: 'Toute détection = anormale' },
            { param: 'Bilirubine', normal: 'Négatif', alerte_val: 'Trace acceptable chien mâle dense seulement' },
            { param: 'Sang / Hémoglobine', normal: 'Négatif', alerte_val: 'Toute détection — confirmer au culot' },
          ].map((row, i) => (
            <div key={i} className="labo-ref-ligne">
              <span>{row.param}</span>
              <span className="labo-ref-normal">{row.normal}</span>
              <span className="labo-ref-alerte-val">{row.alerte_val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SÉDIMENT ───────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Sédiment urinaire — seuils</h2>
        <p className="labo-ref-note">Champ ×400 sauf indication</p>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header">
            <span>Élément</span>
            <span>Normal</span>
            <span>Anormal</span>
          </div>
          {[
            { element: 'Hématies', normal: '0–5', anormal: '> 5' },
            { element: 'Leucocytes', normal: '0–5', anormal: '> 5' },
            { element: 'Bactéries (cystocentèse)', normal: 'Absentes', anormal: 'Toute présence' },
            { element: 'Cylindres hyalins (×100)', normal: '0–2 / champ', anormal: '> 2' },
            { element: 'Cylindres granuleux / cellulaires', normal: 'Absents', anormal: 'Toute présence' },
            { element: 'Cellules épithéliales non squameuses', normal: 'Rares', anormal: 'Agrégats ou abondance' },
          ].map((row, i) => (
            <div key={i} className="labo-ref-ligne">
              <span>{row.element}</span>
              <span className="labo-ref-normal">{row.normal}</span>
              <span className="labo-ref-alerte-val">{row.anormal}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
