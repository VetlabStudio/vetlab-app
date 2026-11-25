import { useState } from 'react'
import { t } from '../lib/i18n'

const TECHNIQUES = [
  {
    titre: t('Aspiration à l\'aiguille fine (AAF)'),
    icone: '/icone-seringue.svg',
    indication: t('Masses solides, ganglions, organes internes (avec guidage échographique)'),
    etapes: [
      t('Stabiliser la masse avec une main. Insérer une aiguille 22–25G sans seringue dans la lésion.'),
      t('Rediriger l\'aiguille plusieurs fois dans différentes directions pour obtenir du matériel.'),
      t('Retirer l\'aiguille, fixer une seringue de 5–10 ml et expulser le contenu sur une lame.'),
      t('Étaler délicatement avec une deuxième lame à 45°.'),
    ],
    conseils: t('Éviter l\'aspiration active sur les lésions très vascularisées (risque de sang). Pour les masses kystiques, l\'aspiration avec seringue est appropriée.'),
  },
  {
    titre: t('Impression directe (contact)'),
    icone: '/lame-microscope.svg',
    indication: t('Lésions cutanées érosives ou ulcérées, biopsies fraîches, masses exposées'),
    etapes: [
      t('Sécher délicatement la surface de la lésion avec une compresse pour retirer l\'excès de sang.'),
      t('Appuyer doucement une lame propre sur la surface lésionnelle.'),
      t('Soulever la lame sans glisser pour éviter d\'écraser les cellules.'),
      t('Répéter sur plusieurs zones différentes de la lésion.'),
    ],
    conseils: t('Technique simple mais moins cellulaire que l\'AAF. Idéale pour les lésions de surface.'),
  },
  {
    titre: t('Écouvillonnage'),
    icone: '/ecouvillon.svg',
    indication: t('Conduit auditif, fistules, surfaces muqueuses, vagin'),
    etapes: [
      t('Insérer délicatement l\'écouvillon dans la zone à prélever.'),
      t('Faire rouler l\'écouvillon sur 360° pour maximiser la collecte cellulaire.'),
      t('Rouler (ne pas frotter) l\'écouvillon sur la lame pour déposer les cellules.'),
      t('Laisser sécher à l\'air avant la coloration.'),
    ],
    conseils: t('Rouler l\'écouvillon plutôt que de frotter pour préserver la morphologie cellulaire.'),
  },
  {
    titre: t('Grattage cutané'),
    icone: '/lame-scalpel.svg',
    indication: t('Lésions cutanées squameuses, suspicion de dermatophytose ou gale'),
    etapes: [
      t('Huiler légèrement la zone avec de l\'huile minérale si recherche d\'acariens.'),
      t('Gratter fermement avec une lame de scalpel (bord non tranchant) ou une curette.'),
      t('Déposer le matériel directement sur une lame.'),
      t('Poser une lamelle avec une goutte d\'huile minérale ou colorer selon l\'objectif.'),
    ],
    conseils: t('Grattage superficiel pour les éléments fongiques, grattage profond (jusqu\'au saignement) pour la recherche de Demodex.'),
  },
]

const FIXATION = [
  { type: t('Air libre (séchage rapide)'), usage: t('Colorations Diff-Quik, May-Grünwald Giemsa. Standard pour la plupart des cytologies.'), recommande: true },
  { type: t('Fixateur humide (alcool 95%)'), usage: t('Coloration de Papanicolaou. Réservé aux cytologies gynécologiques ou respiratoires.'), recommande: false },
  { type: t('Formol 10%'), usage: t('À éviter pour la cytologie : réservé aux biopsies histologiques.'), recommande: false },
]

export default function LaCytologiePrelevement() {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">

      {/* ─── TECHNIQUES ─────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {TECHNIQUES.map((tech, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={i} className="labo-tube-card">
              <button
                className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <img src={tech.icone} alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div className="labo-tube-nom">{tech.titre}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 2, fontWeight: 400 }}>{tech.indication}</div>
                </div>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>

              {estOuvert && (
                <>
                  {tech.etapes.map((etape, j) => (
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

                  {tech.conseils && (
                    <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <i className="ti ti-bulb" style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 1 }}></i>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{tech.conseils}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── FIXATION ───────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Fixation des lames')}</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <span>{t('Type de fixation')}</span>
            <span>{t('Usage')}</span>
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
        <h2 className="labo-ref-titre">{t('Erreurs pré-analytiques fréquentes')}</h2>
        <div className="labo-etape-card">
          {[
            t('Étalement trop épais = cellules superposées, morphologie difficile à interpréter'),
            t('Séchage trop lent = artéfacts cellulaires, mauvaise coloration'),
            t('Contamination sanguine excessive = dilution du matériel diagnostique'),
            t('Délai trop long avant fixation = lyse cellulaire et dégradation'),
            t('Lame étiquetée incorrectement ou illisiblement'),
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
