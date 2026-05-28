const RESULTATS = [
  { resultat: 'Croissance absente', interpretation: 'Absence de bactéries cultivables. Peut indiquer une infection virale, fongique, ou un prélèvement sous antibiotiques.', couleur: 'var(--primary)' },
  { resultat: 'Croissance légère (moins de 10³ UFC/mL)', interpretation: 'Souvent considéré comme contaminant pour les urines. Peut être significatif pour des prélèvements stériles (LCR, sang).', couleur: 'var(--accent-gold)' },
  { resultat: 'Croissance modérée (10³ à 10⁵ UFC/mL)', interpretation: 'Significatif pour les urines selon les signes cliniques. À corréler avec la cytologie.', couleur: 'var(--accent-gold)' },
  { resultat: 'Croissance abondante (plus de 10⁵ UFC/mL)', interpretation: 'Significatif : infection bactérienne confirmée pour les urines par cystocentèse.', couleur: 'var(--accent-red)' },
]

const MILIEUX = [
  {
    milieu: 'Gélose au sang (Blood agar)',
    objectif: 'Milieu enrichi non sélectif utilisé pour isoler des bactéries exigeantes. Inoculation en stries ou piqûres.',
    reactions: [
      'Bêta-hémolyse (claire) : Streptococcus pyogenes, E. coli',
      'Alpha-hémolyse (verdâtre) : Streptococcus pneumoniae',
      'Gamma-hémolyse (aucune) : Enterococcus faecalis',
    ],
  },
  {
    milieu: 'Gélose MacConkey',
    objectif: 'Milieu sélectif pour les entérobactéries (Gram négatif). Inoculation en stries.',
    reactions: [
      'Colonies roses : lactose positif (ex. E. coli)',
      'Colonies incolores : lactose négatif (ex. Salmonella spp.)',
    ],
  },
  {
    milieu: 'Bouillon au sélénite et bouillon tétrathionate',
    objectif: 'Milieux d\'enrichissement pour isoler Salmonella spp. à partir de matières fécales ou autres échantillons contaminés. Inoculation directe, incubation 18 à 24 h.',
    reactions: [
      'Pas de changement visuel notable; ensemencement subséquent sur gélose sélective (ex. XLD, SS agar)',
      'Inhibe E. coli, favorise la croissance de Salmonella',
    ],
  },
  {
    milieu: 'Gélose TSI (Triple sucre-fer) en tube incliné',
    objectif: 'Milieu différentiel pour identifier les entérobactéries fermentatives. Inoculation en piqûre et surface inclinée.',
    reactions: [
      'Jaune/jaune (acid/acid) : glucose positif, lactose ou saccharose positif (ex. E. coli)',
      'Rouge/jaune (alk/acid) : glucose positif seulement (ex. Salmonella)',
      'Gaz (fissures) ou H2S (noir) : H2S positif (ex. Proteus)',
    ],
  },
  {
    milieu: 'Milieu de motilité',
    objectif: 'Permet de tester la motilité bactérienne. Inoculation en piqûre droite au centre.',
    reactions: [
      'Diffusion de la culture hors de la ligne de piqûre : bactérie mobile (ex. Proteus spp.)',
      'Croissance seulement sur la ligne : non mobile (ex. Klebsiella)',
    ],
  },
  {
    milieu: 'Milieu indole (ex. tryptophane ou SIM)',
    objectif: 'Détecte la production d\'indole à partir du tryptophane. Inoculation par piqûre, attendre 24 à 48 h, puis ajout de réactif de Kovacs.',
    reactions: [
      'Anneau rouge en surface : indole positif (ex. E. coli)',
      'Aucun changement : indole négatif (ex. Klebsiella spp.)',
    ],
  },
  {
    milieu: 'Sabouraud',
    objectif: 'Dédié aux champignons et levures. Utilisé pour la dermatophytose et les infections fongiques.',
    reactions: [
      'Croissance de colonies blanchâtres à colorées selon l\'espèce fongique',
    ],
  },
  {
    milieu: 'Gélose chocolat',
    objectif: 'Enrichi pour les bactéries fastidieuses (Haemophilus, Pasteurella). Utile pour les prélèvements respiratoires.',
    reactions: [
      'Croissance de bactéries incapables de pousser sur gélose sang standard',
    ],
  },
  {
    milieu: 'CLED (urines)',
    objectif: 'Milieu différentiel pour les urines; permet de quantifier et différencier les bactéries urinaires.',
    reactions: [
      'Colonies jaunes : fermenteurs de lactose',
      'Colonies bleutées : non fermenteurs',
    ],
  },
]

export default function LaMicrobiologieCultures() {
  return (
    <div className="labo-detail-page">

      {/* ─── RÉSULTATS ──────────────────────── */}
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

      {/* ─── MILIEUX ────────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Milieux de culture et interprétation</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--3col-cultures">
            <span>Milieu</span>
            <span>Objectif et inoculation</span>
            <span>Réactions et interprétation</span>
          </div>
          {MILIEUX.map((m, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--3col-cultures">
              <span style={{ fontWeight: 700 }}>{m.milieu}</span>
              <span>{m.objectif}</span>
              <span>
                {Array.isArray(m.reactions) ? (
                  <ul style={{ margin: 0, paddingLeft: 14 }}>
                    {m.reactions.map((r, j) => (
                      <li key={j} style={{ marginBottom: 3 }}>{r}</li>
                    ))}
                  </ul>
                ) : m.reactions}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HÉMOLYSE ───────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Hémolyse sur gélose sang</h2>
        <div className="labo-etape-card">
          {[
            { type: 'Hémolyse bêta (complète)', description: 'Zone claire autour des colonies, lyse totale des hématies. Ex. Streptococcus bêta-hémolytique, Staphylococcus aureus.', couleur: 'var(--accent-red)' },
            { type: 'Hémolyse alpha (partielle)', description: 'Halo verdâtre autour des colonies, oxydation partielle. Ex. Streptococcus viridans, Enterococcus.', couleur: 'var(--accent-gold)' },
            { type: 'Hémolyse gamma (absence)', description: 'Pas de halo, pas de lyse des hématies. Ex. Staphylococcus epidermidis.', couleur: 'var(--primary)' },
          ].map((h, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: h.couleur, flexShrink: 0, marginTop: 3 }}></span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: h.couleur, margin: '0 0 2px 0' }}>{h.type}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
