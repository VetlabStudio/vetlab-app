import { useState } from 'react'

/* ════════════════════════════════════════════════════════════
   FICHES REPLIABLES (bactéries courantes, levures)

   Même accordéon que « Choix du tube » (mêmes classes, même
   chevron, une fiche ouverte à la fois, note en bas). Repliée,
   une fiche montre le nom et ses repères clés (Gram, morphologie,
   uréase) : la liste entière se compare d'un coup d'œil.

   Fiche : { nom, pastilles: [{ texte, ton }], sections: [{ titre, texte | liste }], note }
   ════════════════════════════════════════════════════════════ */

const TONS = {
  rouge: { background: 'rgba(112,47,58,0.1)', color: 'var(--accent-red)' },
  bleu: { background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' },
  neutre: { background: 'var(--bg)', color: 'var(--text-secondary)', boxShadow: 'inset 0 0 0 1px var(--border)' },
}

const styleEtiquette = { fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', margin: 0, textTransform: 'uppercase' }

function Pastille({ texte, ton = 'neutre' }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, lineHeight: 1.5, ...TONS[ton] }}>
      {texte}
    </span>
  )
}

export default function FichesMicroorganismes({ intro, fiches }) {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>{intro}</p>

      <div className="labo-tubes-liste">
        {fiches.map((fiche, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={fiche.nom} className="labo-tube-card">
              <button
                className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
                aria-expanded={estOuvert}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', minWidth: 0 }}>
                  <span className="labo-tube-nom" style={{ fontStyle: 'italic' }}>{fiche.nom}</span>
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {fiche.pastilles.map(p => <Pastille key={p.texte} {...p} />)}
                  </span>
                </span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>
              {estOuvert && (
                <>
                  {fiche.sections.map((section, j) => (
                    <div key={section.titre} className="labo-tube-analyses" style={j ? { borderTop: '1px solid var(--border)' } : undefined}>
                      <p style={styleEtiquette}>{section.titre}</p>
                      {section.liste ? section.liste.map(element => (
                        <div key={element} className="labo-tube-analyse-item">
                          <span className="labo-materiel-puce">•</span>
                          <span>{element}</span>
                        </div>
                      )) : (
                        <p className="labo-tube-analyse-item" style={{ margin: 0, lineHeight: 1.5 }}>{section.texte}</p>
                      )}
                    </div>
                  ))}
                  {fiche.note && (
                    <p className="labo-tube-note">
                      <i className="ti ti-info-circle"></i> {fiche.note}
                    </p>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
