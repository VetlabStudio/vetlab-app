const CHIEN = [
  { poids: '2', tube: '5' },
  { poids: '3', tube: '5,5' },
  { poids: '4', tube: '6' },
  { poids: '5,5', tube: '6,5' },
  { poids: '7', tube: '7' },
  { poids: '8,5', tube: '7,5' },
  { poids: '10', tube: '8' },
  { poids: '13', tube: '8,5' },
  { poids: '14', tube: '9' },
  { poids: '15', tube: '9,5' },
  { poids: '16,5', tube: '10' },
  { poids: '18', tube: '11' },
  { poids: '30', tube: '12' },
  { poids: '40 +', tube: '14-16' },
]

const CHAT = [
  { poids: '1', tube: '3' },
  { poids: '2', tube: '3,5' },
  { poids: '3', tube: '4' },
  { poids: '4 +', tube: '4,5' },
]

export default function ChirurgieTubes() {
  return (
    <div className="labo-detail-page">

      {/* ─── CHIEN ──────────────────────────── */}
      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header tubes-grid">
            <span className="tubes-header-espece">
              <img src="/icone-chien.svg" alt="chien" className="tubes-header-icone" />
              Chien - Poids (kg)
            </span>
            <span className="tubes-header-val">Grosseur de tube (mm)</span>
          </div>
          {CHIEN.map((row, i) => (
            <div key={i} className="labo-ref-ligne tubes-grid">
              <span>{row.poids}</span>
              <span className="tubes-val">{row.tube}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CHAT ───────────────────────────── */}
      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--chat tubes-grid">
            <span className="tubes-header-espece">
              <img src="/icone-chat.svg" alt="chat" className="tubes-header-icone" />
              Chat - Poids (kg)
            </span>
            <span className="tubes-header-val">Grosseur de tube (mm)</span>
          </div>
          {CHAT.map((row, i) => (
            <div key={i} className="labo-ref-ligne tubes-grid">
              <span>{row.poids}</span>
              <span className="tubes-val">{row.tube}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="labo-ref-note tubes-note">
        Ces valeurs sont des guides approximatifs. Toujours vérifier avec le vétérinaire responsable et avoir des tubes de taille supérieure et inférieure disponibles.
      </p>

    </div>
  )
}
