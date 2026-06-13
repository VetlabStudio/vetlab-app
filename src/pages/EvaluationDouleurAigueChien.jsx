import { useState } from 'react'

const ROWS = [
  {
    score: 0,
    image: '/douleur-chien-score-0.png',
    comportements: [
      'Confortable au repos',
      'De bonne humeur',
      "N'est pas préoccupé par la plaie ou le site chirurgical",
      'Intéressé ou curieux de son environnement',
    ],
    palpation: [
      'Non douloureux à la palpation de la plaie, du site chirurgical ou ailleurs',
    ],
    tension: { texte: 'Minimale', notes: [] },
  },
  {
    score: 1,
    image: '/douleur-chien-score-1.png',
    comportements: [
      'Heureux à légèrement agité ou nerveux',
      "Se laisse facilement distraire par l'environnement",
    ],
    palpation: [
      "Réagit à la palpation de la plaie, du site chirurgical ou d'une autre zone corporelle par un regard autour, un tressaillement ou un gémissement",
    ],
    tension: { texte: 'Légère', notes: [] },
  },
  {
    score: 2,
    image: '/douleur-chien-score-2.png',
    comportements: [
      'Semble inconfortable au repos',
      'Peut gémir ou crier, peut lécher ou frotter la plaie si non surveillé',
      'Oreilles tombantes, expression faciale inquiète (sourcils arqués, yeux fuyants)',
      'Peu enclin à répondre lorsqu\'appelé',
      "Pas enthousiaste à l'interaction, mais regarde ce qui se passe",
    ],
    palpation: [
      'Tressaille, gémit, crie ou se retire lors de la palpation',
    ],
    tension: { texte: 'Légère à modérée', notes: ['Réévaluer le plan analgésique'] },
  },
  {
    score: 3,
    image: '/douleur-chien-score-3.png',
    comportements: [
      'Agité, pleure, grogne, mord ou mâche la plaie si non surveillé',
      'Protège la plaie ou le site chirurgical (boiterie, déplacement du poids, changement de posture)',
      'Peut refuser de bouger toute ou partie du corps',
    ],
    palpation: [
      'Peut être subtil (yeux qui bougent, fréquence respiratoire augmentée) si trop douloureux pour bouger ou stoïque',
      "Peut être dramatique : cri aigu, grognement, tentative de mordre ou de s'éloigner",
    ],
    tension: { texte: 'Modérée', notes: ['Réévaluer le plan analgésique'] },
  },
  {
    score: 4,
    image: '/douleur-chien-score-4.png',
    comportements: [
      'Grogne ou crie constamment sans surveillance',
      'Peut mordre ou mâcher la plaie, mais peu enclin à bouger',
      "Potentiellement non réactif à l'environnement",
      'Difficile à distraire de la douleur',
    ],
    palpation: [
      'Crie à la palpation non douloureuse (possible allodynie, hyperalgésie)',
      'Peut réagir agressivement à la palpation',
    ],
    tension: { texte: 'Modérée à sévère', notes: ['Peut être rigide pour éviter le mouvement douloureux', 'Réévaluer le plan analgésique'] },
  },
]

function getInterpretation(score) {
  if (score === null) return null
  if (score <= 1) return {
    couleur: 'var(--primary)',
    bg: 'rgba(37, 77, 86, 0.08)',
    bordure: 'rgba(37, 77, 86, 0.3)',
    icone: 'ti-circle-check',
    titre: 'Animal confortable',
    texte: 'Le niveau de douleur semble bien maîtrisé. Continuer la surveillance et réévaluer régulièrement.',
  }
  if (score <= 3) return {
    couleur: 'var(--accent-gold)',
    bg: 'rgba(215, 163, 92, 0.1)',
    bordure: 'rgba(215, 163, 92, 0.4)',
    icone: 'ti-alert-triangle',
    titre: 'Douleur légère à modérée',
    texte: 'Réévaluer le plan analgésique et surveiller attentivement l\'évolution.',
  }
  return {
    couleur: 'var(--accent-red)',
    bg: 'rgba(112, 47, 58, 0.08)',
    bordure: 'rgba(112, 47, 58, 0.3)',
    icone: 'ti-urgent',
    titre: 'Douleur modérée à sévère',
    texte: 'Une intervention analgésique rapide est nécessaire. Adapter le plan de gestion de la douleur en fonction de l\'état clinique.',
  }
}

export default function EvaluationDouleurAigueChien() {
  const [selections, setSelections] = useState({})

  function toggle(score, cat, index) {
    const cle = `${score}-${cat}-${index}`
    setSelections(prev => ({ ...prev, [cle]: !prev[cle] }))
  }

  function reinitialiser() {
    setSelections({})
  }

  const scoreMax = ROWS.reduce((max, row) => {
    const aUneCoche = row.comportements.some((_, i) => selections[`${row.score}-c-${i}`])
      || row.palpation.some((_, i) => selections[`${row.score}-p-${i}`])
    return aUneCoche ? row.score : max
  }, null)

  const rowResultat = scoreMax !== null ? ROWS.find(r => r.score === scoreMax) : null
  const interpretation = getInterpretation(scoreMax)

  return (
    <div className="douleur-page">

      {/* ─── INTRO ──────────────────────────────── */}
      <div className="douleur-intro">
        <i className="ti ti-clipboard-heart douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          Coche les éléments observés chez le chien. Le score retenu correspond à la rangée la plus élevée où au moins un élément est cochée.
        </p>
      </div>

      {/* ─── GRILLE PAR SCORE ───────────────────── */}
      {ROWS.map(row => (
        <div key={row.score} className="eda-score-card">
          <div className="eda-score-header">
            <img src={row.image} alt={`Score ${row.score}`} className="eda-score-image" />
            <span className="eda-score-numero">{row.score}</span>
          </div>

          <div className="eda-colonne">
            <h3 className="eda-colonne-titre">Observations comportementales</h3>
            {row.comportements.map((texte, i) => {
              const selectionne = !!selections[`${row.score}-c-${i}`]
              return (
                <button key={i} className={`douleur-option ${selectionne ? 'selectionne' : ''}`} onClick={() => toggle(row.score, 'c', i)}>
                  <span className="douleur-option-texte">{texte}</span>
                  <span className={`douleur-checkbox ${selectionne ? 'selectionne' : ''}`}>
                    {selectionne && <i className="ti ti-check"></i>}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="eda-colonne">
            <h3 className="eda-colonne-titre">Réponse à la palpation</h3>
            {row.palpation.map((texte, i) => {
              const selectionne = !!selections[`${row.score}-p-${i}`]
              return (
                <button key={i} className={`douleur-option ${selectionne ? 'selectionne' : ''}`} onClick={() => toggle(row.score, 'p', i)}>
                  <span className="douleur-option-texte">{texte}</span>
                  <span className={`douleur-checkbox ${selectionne ? 'selectionne' : ''}`}>
                    {selectionne && <i className="ti ti-check"></i>}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="eda-colonne">
            <h3 className="eda-colonne-titre">Tension musculaire</h3>
            <p className="eda-tension-texte">{row.tension.texte}</p>
            {row.tension.notes.map((note, i) => (
              <p key={i} className="eda-tension-note">{note}</p>
            ))}
          </div>
        </div>
      ))}

      {/* ─── RÉSULTAT ───────────────────────────── */}
      <div className="douleur-resultat-section">
        <div className="douleur-score-total">
          <span className="douleur-score-label">Score retenu</span>
          <span className="douleur-score-valeur">
            {scoreMax !== null ? scoreMax : '—'}
            <span className="douleur-score-max"> / 4</span>
          </span>
        </div>

        {interpretation && (
          <div className="douleur-interpretation" style={{ background: interpretation.bg, borderColor: interpretation.bordure }}>
            <div className="douleur-interpretation-header" style={{ color: interpretation.couleur }}>
              <i className={`ti ${interpretation.icone}`}></i>
              <span>{interpretation.titre}</span>
            </div>
            <p className="douleur-interpretation-texte">
              Tension musculaire : {rowResultat.tension.texte}
              {rowResultat.tension.notes.length > 0 && ' — ' + rowResultat.tension.notes.join(' • ')}
            </p>
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
        <span>Réévaluer régulièrement la douleur et ajuster le plan analgésique au besoin.</span>
      </div>

    </div>
  )
}
