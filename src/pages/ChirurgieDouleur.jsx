import { useState } from 'react'
import { t, tn } from '../lib/i18n'

const CATEGORIES = [
  {
    id: 'interaction',
    label: t('Interaction'),
    options: [
      { score: 0, texte: t('Éveillé, interagit volontiers, endormi') },
      { score: 1, texte: t('Éveillé, répond si encouragé') },
      { score: 2, texte: t('Éveillé, réticent, non coopératif') },
    ],
  },
  {
    id: 'apparence',
    label: t('Apparence'),
    options: [
      { score: 0, texte: t('Endormi, calme') },
      { score: 1, texte: t('Agité, vocalise, regarde sa blessure') },
      { score: 2, texte: t('Très agité, vocalise fortement, se débat') },
    ],
  },
  {
    id: 'posture',
    label: t('Posture'),
    options: [
      { score: 0, texte: t('Normal, bouge facilement, endormi') },
      { score: 1, texte: t('Change souvent de position, posture de protection') },
      { score: 2, texte: t('Refuse de se coucher, démarche anormale') },
    ],
  },
  {
    id: 'cardiovasculaire',
    label: t('Système cardiovasculaire'),
    options: [
      { score: 0, texte: t('Fréquence cardiaque (FC) et/ou pression artérielle (PA) <10 % au-dessus de la normale') },
      { score: 1, texte: t('FC et/ou PA 10-20 % au-dessus de la normale') },
      { score: 2, texte: t('FC et/ou PA >20 % au-dessus de la normale') },
    ],
  },
  {
    id: 'respiration',
    label: t('Respiration'),
    options: [
      { score: 0, texte: t('Normale') },
      { score: 1, texte: t('Protégée, légère respiration abdominale') },
      { score: 2, texte: t('Respiration abdominale marquée') },
    ],
  },
]

function getInterpretation(score, total) {
  if (total === 0) return null
  if (score <= 2) return {
    couleur: 'var(--primary)',
    bg: 'rgba(37, 77, 86, 0.08)',
    bordure: 'rgba(37, 77, 86, 0.3)',
    icone: 'ti-circle-check',
    titre: t('Animal confortable ou bien contrôlé'),
    texte: t('Le niveau de douleur semble bien maîtrisé. Continuer la surveillance et réévaluer régulièrement.'),
  }
  if (score === 3) return {
    couleur: 'var(--accent-gold)',
    bg: 'rgba(215, 163, 92, 0.1)',
    bordure: 'rgba(215, 163, 92, 0.4)',
    icone: 'ti-alert-triangle',
    titre: t('Douleur modérée'),
    texte: t('Surveiller attentivement. Réévaluer le protocole analgésique selon l\'état clinique de l\'animal.'),
  }
  return {
    couleur: 'var(--accent-red)',
    bg: 'rgba(112, 47, 58, 0.08)',
    bordure: 'rgba(112, 47, 58, 0.3)',
    icone: 'ti-urgent',
    titre: t('Douleur significative'),
    texte: t('Une intervention analgésique rapide est nécessaire. Adapter le plan de gestion de la douleur en fonction du score et de l\'état clinique.'),
  }
}

export default function ChirurgieDouleur() {
  const [selections, setSelections] = useState({})

  function toggleOption(categorieId, score) {
    setSelections(prev => ({
      ...prev,
      [categorieId]: prev[categorieId] === score ? undefined : score,
    }))
  }

  function reinitialiser() {
    setSelections({})
  }

  const scores = Object.values(selections).filter(v => v !== undefined)
  const total = scores.reduce((acc, v) => acc + v, 0)
  const toutRempli = scores.length === CATEGORIES.length
  const interpretation = toutRempli ? getInterpretation(total, scores.length) : null

  return (
    <div className="douleur-page">

      {/* ─── INTRO ──────────────────────────────── */}
      <div className="douleur-intro">
        <i className="ti ti-clipboard-heart douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          {t('Évalue la douleur post-opératoire en sélectionnant une option par critère. Score total\u00A0: 0 à 10.')}
        </p>
      </div>

      {/* ─── CATÉGORIES ─────────────────────────── */}
      {CATEGORIES.map(cat => (
        <div key={cat.id} className="douleur-categorie">
          <div className="douleur-categorie-titre">
            {cat.label}
            {selections[cat.id] !== undefined && (
              <span className="douleur-categorie-score">{selections[cat.id]}</span>
            )}
          </div>
          <div className="douleur-options">
            {cat.options.map(opt => {
              const selectionne = selections[cat.id] === opt.score
              return (
                <button
                  key={opt.score}
                  className={`douleur-option ${selectionne ? 'selectionne' : ''}`}
                  onClick={() => toggleOption(cat.id, opt.score)}
                >
                  <span className="douleur-option-texte">{opt.texte}</span>
                  <span className={`douleur-checkbox ${selectionne ? 'selectionne' : ''}`}>
                    {selectionne
                      ? <i className="ti ti-check"></i>
                      : <span className="douleur-score-hint">{opt.score}</span>
                    }
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* ─── RÉSULTAT ───────────────────────────── */}
      <div className="douleur-resultat-section">
        <div className="douleur-score-total">
          <span className="douleur-score-label">{t('Score total')}</span>
          <span className="douleur-score-valeur">
            {scores.length > 0 ? total : '—'}
            <span className="douleur-score-max"> / 10</span>
          </span>
          <span className="douleur-score-detail">
            {scores.length < CATEGORIES.length
              ? tn(scores.length, '{n} critère sur {total} rempli', '{n} critères sur {total} remplis', { total: CATEGORIES.length })
              : t('Tous les critères remplis')
            }
          </span>
        </div>

        {interpretation && (
          <div
            className="douleur-interpretation"
            style={{ background: interpretation.bg, borderColor: interpretation.bordure }}
          >
            <div className="douleur-interpretation-header" style={{ color: interpretation.couleur }}>
              <i className={`ti ${interpretation.icone}`}></i>
              <span>{interpretation.titre}</span>
            </div>
            <p className="douleur-interpretation-texte">{interpretation.texte}</p>
          </div>
        )}

        {!toutRempli && scores.length > 0 && (
          <p className="douleur-reminder">
            <i className="ti ti-info-circle"></i>
            {t('Complétez tous les critères pour obtenir l\'interprétation complète.')}
          </p>
        )}

        <button className="douleur-btn-reinit" onClick={reinitialiser}>
          <i className="ti ti-refresh"></i>
          {t('Réinitialiser')}
        </button>
      </div>

      {/* ─── NOTE BAS ───────────────────────────── */}
      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>{t('Basé sur l\'échelle de douleur Colorado. Toujours combiner avec l\'évaluation clinique du vétérinaire traitant.')}</span>
      </div>

    </div>
  )
}
