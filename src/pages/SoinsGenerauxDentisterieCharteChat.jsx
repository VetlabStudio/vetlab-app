const DENTS = [
  { type: 'Incisives', lait: '2 à 3 semaines', permanentes: '3 à 4 mois' },
  { type: 'Canines', lait: '3 à 4 semaines', permanentes: '4 à 5 mois' },
  { type: 'Prémolaires', lait: '3 à 6 semaines', permanentes: '4 à 6 mois' },
  { type: 'Molaires', lait: '-', permanentes: '4 à 6 mois' },
]

export default function SoinsGenerauxDentisterieCharteChat() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/charte-chat.png" alt="Âge d'apparition des dents chez le chat" className="labo-charte-dentaire" />
        </div>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header">
            <span>Type</span>
            <span>Dents de lait</span>
            <span>Permanentes</span>
          </div>
          {DENTS.map((item, i) => (
            <div key={i} className="labo-ref-ligne">
              <span className="labo-ref-normal">{item.type}</span>
              <span>{item.lait}</span>
              <span>{item.permanentes}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-hint)', textAlign: 'center', marginTop: 12 }}>
        Nombre de dents de lait : 26 — Nombre de dents permanentes : 30
      </p>

    </div>
  )
}
