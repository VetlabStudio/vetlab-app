const BACTERIES = [
  {
    nom: 'Staphylococcus pseudintermedius',
    gram: '+',
    morphologie: 'Coque en grappes',
    infections: ['Pyodermite', 'Otite externe', 'Plaies', 'Infection post-chirurgicale'],
    resistances: 'Résistance aux bêtalactamines fréquente (MRSP). Antibiogramme recommandé.',
    notes: 'Bactérie la plus fréquente en dermatologie canine. Flore normale de la peau et des muqueuses.',
  },
  {
    nom: 'Pseudomonas aeruginosa',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Otite externe chronique', 'Plaies infectées', 'Pneumonie nosocomiale'],
    resistances: 'Résistances multiples très fréquentes. Sensible souvent à la gentamicine (topique) et polymyxine B.',
    notes: 'Fréquent dans les otites chroniques en association avec Staphylococcus. Odeur sucrée caractéristique, pigment verdâtre.',
  },
  {
    nom: 'Escherichia coli',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Infection urinaire', 'Entérite', 'Septicémie', 'Péritonite'],
    resistances: 'BLSE (bêtalactamases à spectre étendu) en augmentation. Antibiogramme indispensable.',
    notes: 'Principale cause d\'infection urinaire chez la chienne. Souvent sensible à l\'amoxicilline-clavulanate et fluoroquinolones.',
  },
  {
    nom: 'Streptococcus canis',
    gram: '+',
    morphologie: 'Coque en chaînes',
    infections: ['Septicémie néonatale', 'Pharyngite', 'Pneumonie', 'Lymphadénite'],
    resistances: 'Généralement sensible aux pénicillines.',
    notes: 'Pathogène opportuniste : peut causer des infections sévères chez les chiots et chats immunodéprimés.',
  },
  {
    nom: 'Pasteurella multocida',
    gram: '-',
    morphologie: 'Coccobacille',
    infections: ['Abcès de morsure', 'Rhinite féline', 'Pneumonie', 'Septicémie'],
    resistances: 'Généralement sensible aux pénicillines et tétracyclines.',
    notes: 'Très fréquent dans les morsures de chat chez l\'humain. Flore normale de la cavité buccale des chats.',
  },
  {
    nom: 'Proteus mirabilis',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Infection urinaire', 'Otite externe', 'Pyodermite'],
    resistances: 'Résistance naturelle à la nitrofurantoïne. Antibiogramme recommandé.',
    notes: 'Souvent associé à Staphylococcus dans les otites. Odeur caractéristique dans les cultures.',
  },
  {
    nom: 'Klebsiella pneumoniae',
    gram: '-',
    morphologie: 'Bacille encapsulé',
    infections: ['Infection urinaire', 'Pneumonie', 'Septicémie'],
    resistances: 'Résistances multiples fréquentes dont BLSE. Antibiogramme indispensable.',
    notes: 'Pathogène opportuniste important en milieu hospitalier vétérinaire.',
  },
  {
    nom: 'Clostridium spp.',
    gram: '+',
    morphologie: 'Bacille sporulé anaérobie',
    infections: ['Entérite hémorragique', 'Nécrose tissulaire', 'Tétanos (C. tetani)'],
    resistances: 'Sensible à la pénicilline et métronidazole.',
    notes: 'Anaérobie strict : prélèvement en milieu anaérobie obligatoire. Spores résistantes dans l\'environnement.',
  },
]

export default function LaMicrobiologieBacteries() {
  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        Bactéries les plus fréquemment isolées en clinique vétérinaire pour chiens et chats.
      </p>

      {BACTERIES.map((b, i) => (
        <div key={i} className="labo-etape-card">
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontStyle: 'italic' }}>{b.nom}</h3>
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                background: b.gram === '+' ? 'rgba(112,47,58,0.1)' : 'rgba(37,77,86,0.1)',
                color: b.gram === '+' ? 'var(--accent-red)' : 'var(--primary)',
              }}>
                Gram {b.gram} / {b.morphologie}
              </span>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Infections associées</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {b.infections.map((inf, j) => (
                <span key={j} style={{
                  fontSize: 12,
                  padding: '3px 8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-secondary)',
                }}>{inf}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <i className="ti ti-shield-exclamation" style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: 1 }}></i>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{b.resistances}</p>
          </div>

          <div style={{ padding: '8px 14px', display: 'flex', gap: 8 }}>
            <i className="ti ti-info-circle" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}></i>
            <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: 0, lineHeight: 1.4 }}>{b.notes}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
