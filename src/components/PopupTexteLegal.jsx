import { useState } from 'react'

export default function PopupTexteLegal({ titre, sections, onFermer }) {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="fluido-sheet-overlay" onClick={onFermer}>
      <div
        className="fluido-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onClick={e => e.stopPropagation()}
      >
        <div className="fluido-sheet-poignee"></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{titre}</h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            style={{ background: 'none', border: 'none', padding: 4, fontSize: 24, color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1 }}
          >
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sections.map((section, i) => {
            const estOuvert = ouvert === i
            return (
              <div key={i} className="labo-tube-card">
                <button
                  type="button"
                  className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`}
                  onClick={() => setOuvert(estOuvert ? null : i)}
                  aria-expanded={estOuvert}
                >
                  <i className={`ti ${section.icone || 'ti-info-circle'}`} style={{ fontSize: 20, color: 'var(--primary)', flexShrink: 0 }}></i>
                  <span className="labo-tube-nom">{section.titre}</span>
                  <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
                </button>

                {estOuvert && (
                  <div className="page-info-contenu">
                    {section.paragraphes.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                    {section.liste && (
                      <ul>
                        {section.liste.map((item, k) => (
                          <li key={k}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
