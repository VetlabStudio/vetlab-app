const TECHNIQUES = [
  {
    titre: 'Aspiration à l\'aiguille fine (AAF)',
    icone: 'ti-needle',
    indication: 'Masses solides, ganglions, organes internes (avec guidage échographique)',
    etapes: [
      'Stabiliser la masse avec une main. Insérer une aiguille 22–25G sans seringue dans la lésion.',
      'Rediriger l\'aiguille plusieurs fois dans différentes directions pour obtenir du matériel.',
      'Retirer l\'aiguille, fixer une seringue de 5–10 ml et expulser le contenu sur une lame.',
      'Étaler délicatement avec une deuxième lame à 45°.',
    ],
    conseils: 'Éviter l\'aspiration active sur les lésions très vascularisées (risque de sang). Pour les masses kystiques, l\'aspiration avec seringue est appropriée.',
  },
  {
    titre: 'Impression directe (contact)',
    icone: 'ti-hand-stop',
    indication: 'Lésions cutanées érosives ou ulcérées, biopsies fraîches, masses exposées',
    etapes: [
      'Sécher délicatement la surface de la lésion avec une compresse pour retirer l\'excès de sang.',
      'Appuyer doucement une lame propre sur la surface lésionnelle.',
      'Soulever la lame sans glisser pour éviter d\'écraser les cellules.',
      'Répéter sur plusieurs zones différentes de la lésion.',
    ],
    conseils: 'Technique simple mais moins cellulaire que l\'AAF. Idéale pour les lésions de surface.',
  },
  {
    titre: 'Écouvillonnage',
    icone: 'ti-cotton-bud',
    indication: 'Conduit auditif, fistules, surfaces muqueuses, vagin',
    etapes: [
      'Insérer délicatement l\'écouvillon dans la zone à prélever.',
      'Faire rouler l\'écouvillon sur 360° pour maximiser la collecte cellulaire.',
      'Rouler (ne pas frotter) l\'écouvillon sur la lame pour déposer les cellules.',
      'Laisser sécher à l\'air avant la coloration.',
    ],
    conseils: 'Rouler l\'écouvillon plutôt que de frotter pour préserver la morphologie cellulaire.',
  },
  {
    titre: 'Grattage cutané',
    icone: 'ti-tool',
    indication: 'Lésions cutanées squameuses, suspicion de dermatophytose ou gale',
    etapes: [
      'Huiler légèrement la zone avec de l\'huile minérale si recherche d\'acariens.',
      'Gratter fermement avec une lame de scalpel (bord non tranchant) ou une curette.',
      'Déposer le matériel directement sur une lame.',
      'Poser une lamelle avec une goutte d\'huile minérale ou colorer selon l\'objectif.',
    ],
    conseils: 'Grattage superficiel pour les éléments fongiques, grattage profond (jusqu\'au saignement) pour la recherche de Demodex.',
  },
]

const FIXATION = [
  { type: 'Air libre (séchage rapide)', usage: 'Colorations Diff-Quik, May-Grünwald Giemsa. Standard pour la plupart des cytologies.', recommande: true },
  { type: 'Fixateur humide (alcool 95%)', usage: 'Coloration de Papanicolaou. Réservé aux cytologies gynécologiques ou respiratoires.', recommande: false },
  { type: 'Formol 10%', usage: 'À éviter pour la cytologie : réservé aux biopsies histologiques.', recommande: false },
]

export default function LaCytologiePrelevement() {
  return (
    <div className="labo-detail-page">

      {/* ─── TECHNIQUES ─────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Techniques de prélèvement</h2>
      </div>

      {TECHNIQUES.map((t, i) => (
        <div key={i} className="labo-etape-card">
          <div style={{ padding: '12px 14px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className={`ti ${t.icone}`}></i> {t.titre}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '0 0 12px 0' }}>
              <strong>Indication :</strong> {t.indication}
            </p>
          </div>

          {t.etapes.map((etape, j) => (
            <div key={j} style={{ display: 'flex', gap: 10, padding: '8px 14px', borderTop: '1px solid var(--border)', alignItems: 'flex-start' }}>
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}>{j + 1}</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{etape}</p>
            </div>
          ))}

          {t.conseils && (
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <i className="ti ti-bulb" style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 1 }}></i>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{t.conseils}</p>
            </div>
          )}
        </div>
      ))}

      {/* ─── FIXATION ───────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Fixation des lames</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <span>Type de fixation</span>
            <span>Usage</span>
          </div>
          {FIXATION.map((f, i) => (
            <div key={i} className={`labo-ref-ligne ${f.recommande ? '' : 'alerte'}`} style={{ gridTemplateColumns: '1fr 2fr' }}>
              <span style={{ fontWeight: 600 }}>{f.type}</span>
              <span style={{ fontSize: 12 }}>{f.usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ERREURS PRÉ-ANALYTIQUES ────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Erreurs pré-analytiques fréquentes</h2>
        <div className="labo-etape-card">
          {[
            'Étalement trop épais = cellules superposées, morphologie difficile à interpréter',
            'Séchage trop lent = artéfacts cellulaires, mauvaise coloration',
            'Contamination sanguine excessive = dilution du matériel diagnostique',
            'Délai trop long avant fixation = lyse cellulaire et dégradation',
            'Lame étiquetée incorrectement ou illisiblement',
          ].map((e, i) => (
            <div key={i} className="labo-materiel-item" style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--accent-red)', fontSize: 16, flexShrink: 0 }}>✕</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
