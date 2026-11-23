import { useState } from 'react'
import { t, enAnglais } from '../lib/i18n'

// ─── ÉTAPES (grimace scale féline) ────────────────────────
const ETAPES = [
  {
    id: 'oreilles',
    titre: t('Position des oreilles'),
    options: [
      { label: t('Aucun'), score: 0, image: '/grimace-chat-oreilles-0.png', description: t('Oreilles orientées vers l\'avant') },
      { label: t('Modéré'), score: 1, image: '/grimace-chat-oreilles-1.png', description: t('Oreilles légèrement écartées vers les côtés') },
      { label: t('Évident'), score: 2, image: '/grimace-chat-oreilles-2.png', description: t('Oreilles aplaties et tournées vers l\'extérieur') },
    ],
  },
  {
    id: 'yeux',
    titre: t('Ouverture des yeux'),
    options: [
      { label: t('Aucun'), score: 0, image: '/grimace-chat-yeux-0.png', description: t('Yeux ouverts') },
      { label: t('Modéré'), score: 1, image: '/grimace-chat-yeux-1.png', description: t('Yeux légèrement fermés ou plissés') },
      { label: t('Évident'), score: 2, image: '/grimace-chat-yeux-2.png', description: t('Yeux fermés ou fortement plissés') },
    ],
  },
  {
    id: 'museau',
    titre: t('Tension du museau'),
    options: [
      { label: t('Aucun'), score: 0, image: '/grimace-chat-museau-0.png', description: t('Museau rond et détendu') },
      { label: t('Modéré'), score: 1, image: '/grimace-chat-museau-1.png', description: t('Museau légèrement tendu') },
      { label: t('Évident'), score: 2, image: '/grimace-chat-museau-2.png', description: t('Museau tendu, de forme ovale (bouche entrouverte)') },
    ],
  },
  {
    id: 'moustaches',
    titre: t('Position des moustaches'),
    options: [
      { label: t('Aucun'), score: 0, image: '/grimace-chat-moustaches-0.png', description: t('Moustaches souples et incurvées vers le bas') },
      { label: t('Modéré'), score: 1, image: '/grimace-chat-moustaches-1.png', description: t('Moustaches légèrement écartées ou redressées') },
      { label: t('Évident'), score: 2, image: '/grimace-chat-moustaches-2.png', description: t('Moustaches droites, hérissées vers l\'avant') },
    ],
  },
  {
    id: 'tete',
    titre: t('Position de la tête'),
    options: [
      { label: t('Aucun'), score: 0, image: '/grimace-chat-tete-0.png', description: t('Tête au-dessus de la ligne des épaules') },
      { label: t('Modéré'), score: 1, image: '/grimace-chat-tete-1.png', description: t('Tête alignée avec les épaules') },
      { label: t('Évident'), score: 2, image: '/grimace-chat-tete-2.png', description: t('Tête sous la ligne des épaules ou rentrée') },
    ],
  },
]

function getInterpretation(score) {
  if (score <= 2) return {
    couleur: 'var(--primary)',
    bg: 'rgba(37, 77, 86, 0.08)',
    bordure: 'rgba(37, 77, 86, 0.3)',
    icone: 'ti-circle-check',
    titre: t('Pas de douleur'),
    texte: t('Le score ne suggère pas de douleur significative. Continuer la surveillance habituelle.'),
  }
  if (score <= 4) return {
    couleur: 'var(--accent-gold)',
    bg: 'rgba(215, 163, 92, 0.1)',
    bordure: 'rgba(215, 163, 92, 0.4)',
    icone: 'ti-alert-triangle',
    titre: t('Douleur possible'),
    texte: t('Réévaluer dans 10 à 15 minutes pour confirmer ou non la présence de douleur.'),
  }
  return {
    couleur: 'var(--accent-red)',
    bg: 'rgba(112, 47, 58, 0.08)',
    bordure: 'rgba(112, 47, 58, 0.3)',
    icone: 'ti-urgent',
    titre: t('Douleur — analgésie requise'),
    texte: t('Le score indique une douleur nécessitant une intervention analgésique.'),
  }
}

export default function EvaluationDouleurAigueChat() {
  const [etape, setEtape] = useState(0)
  const [reponses, setReponses] = useState({})

  const termine = etape >= ETAPES.length
  const etapeActuelle = ETAPES[etape]
  const choixActuel = etapeActuelle ? reponses[etapeActuelle.id] : null

  function choisir(score) {
    setReponses(prev => ({ ...prev, [etapeActuelle.id]: score }))
  }

  function suivant() {
    if (choixActuel === undefined) return
    setEtape(e => e + 1)
  }

  function precedent() {
    setEtape(e => Math.max(0, e - 1))
  }

  function reinitialiser() {
    setReponses({})
    setEtape(0)
  }

  const scoreTotal = Object.values(reponses).reduce((a, b) => a + b, 0)
  const interpretation = termine ? getInterpretation(scoreTotal) : null

  return (
    <div className="douleur-page">
      <div className="douleur-intro">
        <i className="ti ti-clipboard-heart douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          {t('Évalue chaque élément du visage du chat à l\'aide des illustrations, puis passe à l\'étape suivante. Le score total détermine le niveau de douleur.')}
        </p>
      </div>

      {!termine && (
        <>
          <div className="eda-etape-header">
            <span className="eda-etape-progress">{t('Étape {n} / {total}', { n: etape + 1, total: ETAPES.length })}</span>
            <h2 className="eda-etape-titre">{etapeActuelle.titre}</h2>
          </div>

          <div className="eda-etape-options">
            {etapeActuelle.options.map(opt => (
              <button
                key={opt.score}
                className={`eda-etape-option ${choixActuel === opt.score ? 'selectionne' : ''}`}
                onClick={() => choisir(opt.score)}
              >
                <img src={opt.image} alt={opt.label} className="eda-etape-option-image" />
                <span className="eda-etape-option-label">{opt.label}</span>
                <span className="eda-etape-option-description">{opt.description}</span>
              </button>
            ))}
          </div>

          <div className="eda-etape-nav">
            <button className="eda-etape-btn" onClick={precedent} disabled={etape === 0}>
              <i className="ti ti-chevron-left"></i>
              {t('Précédent')}
            </button>
            <button className="eda-etape-btn primaire" onClick={suivant} disabled={choixActuel === undefined}>
              {etape === ETAPES.length - 1 ? t('Voir le résultat') : t('Suivant')}
              <i className="ti ti-chevron-right"></i>
            </button>
          </div>
        </>
      )}

      {termine && (
        <>
          <div className="douleur-resultat-section">
            <div className="douleur-score-total">
              <span className="douleur-score-label">{t('Score retenu')}</span>
              <span className="douleur-score-valeur">
                {scoreTotal}
                <span className="douleur-score-max"> / 10</span>
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
              {t('Réinitialiser')}
            </button>
          </div>
        </>
      )}

      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>{t('Basé sur l\'échelle de grimace féline (')}<a href={enAnglais ? 'https://www.felinegrimacescale.com/' : 'https://www.felinegrimacescale.com/fr'} target="_blank" rel="noreferrer" className="page-info-lien">{t('Feline Grimace Scale')}</a>{t('). Réévaluer régulièrement la douleur et ajuster le plan analgésique au besoin.')}</span>
      </div>
    </div>
  )
}
