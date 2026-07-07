const JEUNE = [
  {
    statut: 'Adulte sain',
    nourriture: '4–6 h',
    eau: 'aucune restriction',
    note: 'Petites gâteries en clinique acceptables pour faciliter la manipulation et réduire le stress.',
  },
  {
    statut: 'Adulte < 2 kg',
    nourriture: '≤ 1–2 h',
    eau: 'aucune restriction',
    note: 'Nourriture humide de texture pâteuse acceptable avant la procédure. Planifier en premier cas de la journée.',
  },
  {
    statut: 'Néonatal / pédiatrique (< 8 semaines)',
    nourriture: '≤ 1–2 h',
    eau: 'aucune restriction',
    note: 'Nourriture humide de texture pâteuse acceptable avant la procédure. Planifier en premier cas de la journée.',
  },
  {
    statut: 'Adulte diabétique',
    nourriture: '2–4 h',
    eau: 'aucune restriction',
    note: 'Offrir 50 % de la ration normale en nourriture pâteuse et administrer ½ dose normale d\'insuline 2–4 h avant l\'induction. Planifier en premier cas.',
  },
  {
    statut: 'Risque de régurgitation',
    nourriture: '6–12 h',
    eau: '6–12 h',
    note: 'Considérer 10–25 % de la ration normale en nourriture pâteuse 4–6 h avant l\'induction.',
  },
  {
    statut: 'Cas d\'urgence',
    nourriture: 'dès que possible',
    eau: 'dès que possible',
    note: 'Stabiliser le patient avant l\'induction.',
    urgence: true,
  },
]

export default function ChirurgieJeune() {
  return (
    <div className="labo-detail-page">
      <div className="fluido-info-banner" style={{ marginBottom: 16 }}>
        <i className="ti ti-info-circle" />
        <span>L'eau est généralement permise ad libitum sauf indication contraire. Les médicaments oraux en cours peuvent être administrés avec 1–2 c. à soupe de nourriture humide.</span>
      </div>

      {JEUNE.map((row, i) => (
        <div key={i} className={`jeune-card${row.urgence ? ' urgence' : ''}`}>
          <div className="jeune-statut">{row.statut}</div>
          <div className="jeune-donnees">
            <div className="jeune-donnee">
              <i className="ti ti-tool-kitchen-2" style={{ fontSize: 18, color: 'var(--text-hint)', flexShrink: 0 }} />
              <div>
                <div className="jeune-label">Nourriture</div>
                <div className={`jeune-val${row.urgence ? ' urgence' : ''}`}>{row.nourriture}</div>
              </div>
            </div>
            <div className="jeune-donnee">
              <i className="ti ti-droplet" style={{ fontSize: 18, color: 'var(--text-hint)', flexShrink: 0 }} />
              <div>
                <div className="jeune-label">Eau</div>
                <div className={`jeune-val${row.urgence ? ' urgence' : ''}`}>{row.eau}</div>
              </div>
            </div>
          </div>
          {row.note && <div className="jeune-note-card">{row.note}</div>}
        </div>
      ))}

      <p className="asa-source">Source : Grubb T, Sager J, Gaynor JS et al. — AAHA Anesthesia and Monitoring Guidelines for Dogs and Cats, J Am Anim Hosp Assoc 56(2):59–82, 2020</p>
    </div>
  )
}
