const RESULTATS = [
  { resultat: 'Croissance absente', interpretation: 'Absence de bactéries cultivables. Peut indiquer une infection virale, fongique, ou un prélèvement sous antibiotiques.', couleur: 'var(--primary)' },
  { resultat: 'Croissance légère (< 10³ UFC/mL)', interpretation: 'Souvent considéré comme contaminant pour les urines. Peut être significatif pour des prélèvements stériles (LCR, sang).', couleur: 'var(--accent-gold)' },
  { resultat: 'Croissance modérée (10³–10⁵ UFC/mL)', interpretation: 'Significatif pour les urines selon les signes cliniques. À corréler avec la cytologie.', couleur: 'var(--accent-gold)' },
  { resultat: 'Croissance abondante (> 10⁵ UFC/mL)', interpretation: 'Significatif : infection bactérienne confirmée pour les urines par cystocentèse.', couleur: 'var(--accent-red)' },
]

const MILIEUX = [
  { milieu: 'Gélose sang (GS)', description: 'Milieu universel : permet la croissance de la majorité des bactéries. Permet d\'observer l\'hémolyse (α, β, γ).' },
  { milieu: 'MacConkey', description: 'Sélectif pour les entérobactéries (gram -). Différencie les fermenteurs de lactose (rose) des non-fermenteurs (incolore).' },
  { milieu: 'Sabouraud', description: 'Dédié aux champignons et levures. Utilisé pour la dermatophytose et les infections fongiques.' },
  { milieu: 'Gélose chocolat', description: 'Enrichi : pour les bactéries fastidieuses (Haemophilus, Pasteurella). Utile pour les prélèvements respiratoires.' },
  { milieu: 'CLED (urines)', description: 'Milieu différentiel pour les urines : permet de quantifier et différencier les bactéries urinaires.' },
]

export default function LaMicrobiologieCultures() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Interprétation des résultats de culture</h2>
        <div className="labo-etape-card">
          {RESULTATS.map((r, i) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < RESULTATS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: r.couleur, margin: '0 0 4px 0' }}>{r.resultat}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{r.interpretation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Principaux milieux de culture</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <span>Milieu</span>
            <span>Utilisation</span>
          </div>
          {MILIEUX.map((m, i) => (
            <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <span style={{ fontWeight: 700 }}>{m.milieu}</span>
              <span style={{ fontSize: 12 }}>{m.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Hémolyse sur gélose sang</h2>
        <div className="labo-etape-card">
          {[
            { type: 'Hémolyse β (complète)', description: 'Zone claire autour des colonies : lyse totale des hématies. Ex: Streptococcus β-hémolytique, Staphylococcus aureus.', couleur: 'var(--accent-red)' },
            { type: 'Hémolyse α (partielle)', description: 'Halo verdâtre autour des colonies : oxydation partielle. Ex: Streptococcus viridans, Enterococcus.', couleur: 'var(--accent-gold)' },
            { type: 'Hémolyse γ (absence)', description: 'Pas de halo : pas de lyse des hématies. Ex: Staphylococcus epidermidis.', couleur: 'var(--primary)' },
          ].map((h, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: h.couleur, flexShrink: 0, marginTop: 3 }}></span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: h.couleur, margin: '0 0 2px 0' }}>{h.type}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
