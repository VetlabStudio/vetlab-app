import { useState } from 'react'

const CATEGORIES = [
  {
    id: 'motrice',
    titre: 'Activité motrice',
    options: [
      { score: 6, texte: 'Démarche normale, réflexes spinaux normaux' },
      { score: 5, texte: 'Hémiparésie, tétraparésie ou rigidité décérébrée', detail: 'Hémiparésie : faiblesse d\'un côté du corps; tétraparésie : 4 membres atteints; rigidité décérébrée : extension rigide de tous les membres (lésion grave du tronc cérébral)' },
      { score: 4, texte: 'Décubitus, rigidité extenseur intermittente', detail: 'L\'animal est couché et présente des épisodes d\'extension involontaire des membres' },
      { score: 3, texte: 'Décubitus, rigidité extenseur constante', detail: 'Extension rigide permanente des membres en position couchée' },
      { score: 2, texte: 'Décubitus, rigidité extenseur constante avec opisthotonos', detail: 'Opisthotonos : hyperextension forcée de la tête et du cou vers l\'arrière, signe d\'atteinte grave du cervelet ou du tronc cérébral' },
      { score: 1, texte: 'Décubitus, hypotonie musculaire, réflexes spinaux diminués ou absents', detail: 'Perte du tonus musculaire et des réflexes - atteinte des motoneurones inférieurs ou stade terminal' },
    ],
  },
  {
    id: 'tronc',
    titre: 'Réflexes du tronc cérébral',
    options: [
      { score: 6, texte: 'RPL et réflexes oculo-céphaliques normaux', detail: 'RPL : réflexe photomoteur (contraction pupillaire en réponse à la lumière). Réflexe oculo-céphalique : les yeux bougent normalement lors des mouvements de la tête' },
      { score: 5, texte: 'RPL lent et réflexes oculo-céphaliques normaux à diminués' },
      { score: 4, texte: 'Myosis bilatéral non réactif avec réflexes oculo-céphaliques diminués', detail: 'Myosis : pupilles très contractées et non réactives à la lumière' },
      { score: 3, texte: 'Pupilles en épingle à tête avec réflexes oculo-céphaliques diminués à absents', detail: 'Myosis extrême - souvent associé à une lésion pontine' },
      { score: 2, texte: 'Mydriase unilatérale non réactive avec réflexes oculo-céphaliques diminués à absents', detail: 'Mydriase unilatérale : une seule pupille dilatée et fixe - peut indiquer une compression du nerf crânien III (nerf oculomoteur)' },
      { score: 1, texte: 'Mydriase bilatérale non réactive avec réflexes oculo-céphaliques diminués à absents', detail: 'Les deux pupilles dilatées et fixes - atteinte diffuse du tronc cérébral, pronostic très sombre' },
    ],
  },
  {
    id: 'conscience',
    titre: 'Niveau de conscience',
    options: [
      { score: 6, texte: 'Périodes de vigilance occasionnelles, réactif à l\'environnement' },
      { score: 5, texte: 'Dépression ou délirium, capable de répondre, mais réponse potentiellement inappropriée' },
      { score: 4, texte: 'Semi-comateux, réactif aux stimuli visuels', detail: 'Réagit lorsqu\'on approche la main ou un objet devant ses yeux' },
      { score: 3, texte: 'Semi-comateux, réactif aux stimuli auditifs', detail: 'Réagit aux sons forts mais plus aux stimuli visuels' },
      { score: 2, texte: 'Semi-comateux, réactif uniquement aux stimuli nociceptifs répétés', detail: 'Nécessite une douleur répétée pour obtenir une réponse' },
      { score: 1, texte: 'Comateux, non réactif aux stimuli nociceptifs répétés', detail: 'Absence totale de réponse à la douleur' },
    ],
  },
]

function getInterpretation(total) {
  if (total === null) return null
  if (total <= 8) return {
    couleur: 'var(--accent-red)',
    bg: 'rgba(112, 47, 58, 0.08)',
    bordure: 'rgba(112, 47, 58, 0.3)',
    icone: 'ti-urgent',
    titre: 'Pronostic grave',
    texte: 'Score 3-8. Pronostic très sombre. Prise en charge intensive et immédiate nécessaire.',
  }
  if (total <= 14) return {
    couleur: 'var(--accent-gold)',
    bg: 'rgba(215, 163, 92, 0.1)',
    bordure: 'rgba(215, 163, 92, 0.4)',
    icone: 'ti-alert-triangle',
    titre: 'Pronostic réservé',
    texte: 'Score 9-14. Surveillance étroite et traitement intensif recommandés.',
  }
  return {
    couleur: 'var(--primary)',
    bg: 'rgba(37, 77, 86, 0.08)',
    bordure: 'rgba(37, 77, 86, 0.3)',
    icone: 'ti-circle-check',
    titre: 'Bon pronostic',
    texte: 'Score 15-18. Pronostic favorable. Continuer la surveillance et la prise en charge.',
  }
}

export default function ScoreGlasgow() {
  const [selections, setSelections] = useState({})

  function selectionner(catId, score) {
    setSelections(prev => ({
      ...prev,
      [catId]: prev[catId] === score ? null : score,
    }))
  }

  function reinitialiser() {
    setSelections({})
  }

  const scores = CATEGORIES.map(c => selections[c.id] ?? null)
  const selectedCount = scores.filter(s => s !== null).length
  const partialTotal = scores.filter(s => s !== null).reduce((a, b) => a + b, 0)
  const total = selectedCount === 3 ? partialTotal : null
  const interpretation = getInterpretation(total)

  return (
    <div className="douleur-page">

      {/* ─── INTRO ──────────────────────────────── */}
      <div className="postop-section" style={{ marginBottom: 8 }}>
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-brain"></i>
          </div>
          <h2 className="postop-section-titre">À propos du MCGS</h2>
        </div>
        <div style={{ padding: '8px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Le MCGS (Modified Glasgow Coma Scale) est un outil de surveillance neurologique utilisé pour évaluer les traumatismes crâniens et les lésions du système nerveux central. Il doit être utilisé en complément des paramètres vitaux : fréquence cardiaque, fréquence respiratoire et pression artérielle.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Dans toute urgence, la perméabilité des voies respiratoires, la ventilation et la circulation doivent être évaluées en priorité. Une hypoxie ou une hypovolémie sévère aggraveront les altérations de l'état mental.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            La pression artérielle moyenne (PAM) est particulièrement utile car elle reflète la perfusion cérébrale. Une hypotension associée à une bradycardie peut indiquer un réflexe de Cushing, signe d'une hypertension intracrânienne critique.
          </p>
        </div>
      </div>

      {/* ─── INSTRUCTIONS ───────────────────────── */}
      <div className="douleur-intro">
        <i className="ti ti-list-check douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          Sélectionner une observation par catégorie. Le score total (3-18) est calculé automatiquement.
        </p>
      </div>

      {/* ─── CATÉGORIES ─────────────────────────── */}
      {CATEGORIES.map(cat => {
        const selectionCat = selections[cat.id]
        return (
          <div key={cat.id} className="eda-score-card">
            <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{cat.titre}</h3>
              {selectionCat != null && (
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', background: 'rgba(37,77,86,0.1)', borderRadius: 20, padding: '2px 10px' }}>
                  {selectionCat}
                </span>
              )}
            </div>
            <div className="eda-colonne" style={{ padding: 0 }}>
              {cat.options.map(opt => {
                const selectionne = selectionCat === opt.score
                return (
                  <button
                    key={opt.score}
                    className={`douleur-option ${selectionne ? 'selectionne' : ''}`}
                    onClick={() => selectionner(cat.id, opt.score)}
                    style={{ alignItems: 'flex-start' }}
                  >
                    <span className="douleur-option-texte" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: 16, flexShrink: 0 }}>{opt.score}</span>
                        <span>{opt.texte}</span>
                      </span>
                      {opt.detail && (
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', paddingLeft: 26, fontStyle: 'italic', lineHeight: 1.4 }}>{opt.detail}</span>
                      )}
                    </span>
                    <span className={`douleur-checkbox ${selectionne ? 'selectionne' : ''}`} style={{ marginTop: 2, flexShrink: 0 }}>
                      {selectionne && <i className="ti ti-check"></i>}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ─── RÉSULTAT ───────────────────────────── */}
      <div className="douleur-resultat-section">
        <div className="douleur-score-total">
          <span className="douleur-score-label">Score MCGS</span>
          <span className="douleur-score-valeur">
            {selectedCount === 0
              ? '—'
              : selectedCount < 3
                ? <>{partialTotal}<span className="douleur-score-max"> ({selectedCount}/3)</span></>
                : <>{total}<span className="douleur-score-max"> / 18</span></>
            }
          </span>
        </div>

        {interpretation && (
          <div className="douleur-interpretation" style={{ background: interpretation.bg, borderColor: interpretation.bordure }}>
            <div className="douleur-interpretation-header" style={{ color: interpretation.couleur }}>
              <i className={`ti ${interpretation.icone}`}></i>
              <span>{interpretation.titre}</span>
            </div>
            <p className="douleur-interpretation-texte">{interpretation.texte}</p>
          </div>
        )}

        <button className="douleur-btn-reinit" onClick={reinitialiser}>
          <i className="ti ti-refresh"></i>
          Réinitialiser
        </button>
      </div>

      {/* ─── NOTE BAS ───────────────────────────── */}
      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>MCGS : Modified Glasgow Coma Scale. Source : Aldridge et O'Dwyer (2013), Chiang et al. (2024).</span>
      </div>

    </div>
  )
}
