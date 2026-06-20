const DENTS = [
  { type: 'Incisives', lait: '3 à 5 semaines', permanentes: '3 à 5 mois' },
  { type: 'Canines', lait: '3 à 6 semaines', permanentes: '3½ à 6 mois' },
  { type: 'Prémolaires', lait: '4 à 10 semaines', permanentes: '3½ à 6 mois' },
  { type: 'Molaires', lait: '-', permanentes: '3½ à 7 mois' },
]

export default function SoinsGenerauxDentisterieCharteChien() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/charte-chien.png" alt="Âge d'apparition des dents chez le chien" className="labo-charte-dentaire" />
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
        Nombre de dents de lait : 28 — Nombre de dents permanentes : 42
      </p>

    </div>
  )
}
