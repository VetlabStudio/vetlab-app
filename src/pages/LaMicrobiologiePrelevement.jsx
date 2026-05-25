const TYPES_PRELEVEMENT = [
  {
    titre: 'Écouvillon avec milieu de transport',
    icone: 'ti-cotton-bud',
    indications: ['Otite externe', 'Infection cutanée / pyodermite', 'Plaie', 'Muqueuse nasale ou buccale'],
    notes: 'Utiliser un écouvillon SWABND avec milieu de transport liquide pour les pus profonds. Écouvillons avec gélose pour les infections superficielles. Éviter les écouvillons charbonnés — rendent la cytologie difficile.',
  },
  {
    titre: 'Tube EDTA (violet) — liquides de ponction',
    icone: 'ti-test-pipe',
    indications: ['LBA (lavage broncho-alvéolaire)', 'LCR (liquide céphalorachidien)', 'Épanchements (thoracique, abdominal)', 'Cytologie + PCR'],
    notes: 'Ne pas utiliser pour la bactériologie — l\'EDTA est un inhibiteur de croissance bactérienne. Réservé à la cytologie et aux PCR.',
  },
  {
    titre: 'Tube boraté (vert kaki) — urines',
    icone: 'ti-droplet',
    indications: ['Cytobactériologie urinaire (ECBU)', 'Prélèvement par cystocentèse recommandé'],
    notes: 'Le tube boraté stabilise les cellules et bactéries pendant le transport. Toujours préciser la méthode de prélèvement (cystocentèse, cathéter, jet libre) — influence directement l\'interprétation.',
  },
  {
    titre: 'Milieu de culture anaérobie',
    icone: 'ti-flask',
    indications: ['Abcès profonds', 'Infections à germes anaérobies suspectés', 'Morsures profondes'],
    notes: 'Transport rapide obligatoire — les anaérobies meurent à l\'air. Utiliser un système de transport anaérobie ou ensemencer directement en clinique si possible.',
  },
]

const BONNES_PRATIQUES = [
  'Prélever avant tout traitement antibiotique si possible',
  'Identifier clairement le prélèvement : animal, propriétaire, site anatomique, méthode',
  'Respecter la chaîne de froid (4°C) sauf pour les hémocultures',
  'Acheminer rapidement au laboratoire — idéalement < 24h',
  'Préciser les antibiotiques en cours dans la demande',
  'Éviter la contamination — technique aseptique rigoureuse',
]

export default function LaMicrobiologiePrelevement() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Types de prélèvements selon l'infection</h2>
      </div>

      {TYPES_PRELEVEMENT.map((t, i) => (
        <div key={i} className="labo-etape-card">
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className={`ti ${t.icone}`}></i> {t.titre}
            </h3>
            <div className="labo-materiel-liste" style={{ border: 'none', background: 'transparent' }}>
              {t.indications.map((ind, j) => (
                <div key={j} className="labo-materiel-item" style={{ border: 'none', padding: '4px 0' }}>
                  <span className="labo-materiel-puce">•</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ind}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '8px 14px', display: 'flex', gap: 8 }}>
            <i className="ti ti-info-circle" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}></i>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: 0, lineHeight: 1.5 }}>{t.notes}</p>
          </div>
        </div>
      ))}

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Bonnes pratiques pré-analytiques</h2>
        <div className="labo-etape-card">
          {BONNES_PRATIQUES.map((p, i) => (
            <div key={i} className="labo-materiel-item" style={{ borderBottom: i < BONNES_PRATIQUES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <i className="ti ti-check" style={{ color: 'var(--primary)', flexShrink: 0 }}></i>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
