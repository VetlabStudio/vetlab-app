import { useState, useMemo } from 'react'

const PARAMS_VITAUX = [
  {
    parametre: 'Fréquence cardiaque',
    valeurs: [
      { label: 'Grand chien', valeur: '60–160 bpm' },
      { label: 'Petit chien', valeur: '70–180 bpm' },
      { label: 'Chat', valeur: '90–200 bpm', alerte: true },
    ],
  },
  {
    parametre: 'Pression artérielle (PA)',
    valeurs: [
      { label: 'Systolique', valeur: '> 80 mmHg' },
      { label: 'MAP', valeur: '> 60 mmHg' },
    ],
  },
  {
    parametre: 'Fréquence respiratoire',
    valeurs: [
      { label: '', valeur: '8–12 /min' },
    ],
  },
  {
    parametre: 'ETCO₂ (capnographie)',
    valeurs: [
      { label: '', valeur: '35–45 mmHg' },
    ],
  },
  {
    parametre: 'SpO₂ (saturation en O₂)',
    valeurs: [
      { label: '', valeur: '> 95 %' },
    ],
  },
  {
    parametre: 'Température',
    valeurs: [
      { label: '', valeur: '≈ 36,7 °C' },
    ],
  },
  {
    parametre: 'Couleur des muqueuses',
    valeurs: [
      { label: '', valeur: 'Rose' },
    ],
  },
  {
    parametre: 'Temps de remplissage capillaire (TRC)',
    valeurs: [
      { label: '', valeur: '1–2 secondes' },
    ],
  },
]

const STADE_4 = {
  titre: 'Stade 4 — Anesthésie trop profonde',
  signes: [
    { texte: 'Diminuer immédiatement le gaz anesthésique' },
    { texte: 'Rehausser la perfusion IV ou administrer bolus de solutés' },
    { texte: 'Oxygène supplémentaire ou antidote selon le cas' },
    { texte: 'Administration d\'un', emphase: 'agent réversif', suite: ' si besoin' },
  ],
}

const RESULTATS_STADES = {
  1: {
    titre: 'Stade 1',
    description: 'Anesthésie légère. Les réflexes de protection sont encore présents : surveiller l\'animal de près, l\'induction n\'est pas encore complète.',
    signes: [
      { texte: 'Réflexes oculaires (palpébral et cornéen)', emphase: 'présents' },
      { texte: 'Oeil en position', emphase: 'centrale' },
      { texte: 'Déglutition', emphase: 'Déglutition', suite: ', mouvements volontaires possibles' },
      { texte: 'FC et FR', emphase: 'élevées', suite: ', vocalisations possibles' },
    ],
  },
  2: {
    titre: 'Stade 2',
    description: 'Plan chirurgical superficiel. À surveiller : certains gestes chirurgicaux peuvent encore déclencher une réaction.',
    signes: [
      { texte: 'Rotation ventrale de l\'oeil' },
      { texte: 'Tonus mandibulaire', emphase: ' diminué mais encore présent' },
     
    ],
  },
  3: {
    titre: 'Stade 3',
    description: 'Plan chirurgical adéquat pour la majorité des interventions. Maintenir ce niveau et continuer la surveillance des paramètres vitaux.',
    signes: [
      { texte: 'Musculature relâchée, mâchoire flasque' },
      { texte: 'Oeil en position centrale' },
      { texte: 'Réflexe cornéen ', emphase: 'absent' },
      { texte: 'Absence de réaction à la stimulation' },
      { texte: 'Rythmes cardio-respiratoires réguliers' },
    ],
  },
}

const CRITERES = [
  {
    id: 'reflexe_palpebral',
    label: 'Réflexes oculaires (palpébral et cornéen)',
    options: [
      { stade: 1, texte: 'Présents' },
      { stade: 2, texte: 'Diminués, mais encore présents' },
      { stade: 3, texte: 'Absents' },
    ],
  },
  {
    id: 'position_oeil',
    label: 'Position de l\'œil',
    options: [
      { stade: 1, texte: 'Centrale' },
      { stade: 2, texte: 'Rotation ventrale' },
      { stade: 3, texte: 'Centrale, fixe' },
    ],
  },
  {
    id: 'tonus_mandibulaire',
    label: 'Tonus mandibulaire',
    options: [
      { stade: 1, texte: 'Normal' },
      { stade: 2, texte: 'Diminué' },
      { stade: 3, texte: 'Flasque, mâchoire relâchée' },
    ],
  },
  {
    id: 'deglutition',
    label: 'Déglutition et mouvements volontaires',
    options: [
      { stade: 1, texte: 'Présents, possibles' },
      { stade: 3, texte: 'Absents' },
    ],
  },
  {
    id: 'reaction_stimulation',
    label: 'Réaction à la stimulation chirurgicale',
    options: [
      { stade: 1, texte: 'Présente' },
      { stade: 3, texte: 'Absente' },
    ],
  },
  {
    id: 'fc_fr',
    label: 'FC, FR et rythme cardio-respiratoire',
    options: [
      { stade: 1, texte: 'Élevées, vocalisations possibles' },
      { stade: 3, texte: 'Régulières et stables' },
    ],
  },
]

const CAPNOGRAPHIE = [
  {
    titre: 'Zéro (aucune lecture ETCO₂)',
    couleur: 'var(--accent-red)',
    items: [
      'Apnée, sonde déconnectée, intubation oesophagienne, arrêt cardiaque',
    ],
  },
  {
    titre: 'Bas (hyperventilation)',
    couleur: 'var(--accent-gold)',
    items: [
      'Faible débit cardiaque; cause fréquente',
      'Animal trop léger sous anesthésie; effet ventilatoire',
    ],
  },
  {
    titre: 'Élevé (hypoventilation)',
    couleur: 'var(--accent-red)',
    items: [
      'Obésité, espace mort, recyclage de CO₂, chaux épuisée',
      'Valves défectueuses; cause mécanique courante',
    ],
  },
]

function renderSigne(s, j) {
  return (
    <li key={j}>
      {s.emphase && !s.suite
        ? <><span>{s.texte.replace(s.emphase, '')}</span><strong>{s.emphase}</strong></>
        : s.emphase && s.suite
        ? <><strong>{s.emphase}</strong>{s.suite}</>
        : s.texte
      }
    </li>
  )
}

export default function ChirurgieMonitoring() {
  const [reponses, setReponses] = useState({})

  const resultatStade = useMemo(() => {
    const stades = Object.values(reponses)
    if (stades.length === 0) return null
    const somme = stades.reduce((a, b) => a + b, 0)
    return Math.min(3, Math.max(1, Math.round(somme / stades.length)))
  }, [reponses])

  return (
    <div className="labo-detail-page">

      {/* ─── PARAMÈTRES VITAUX ──────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Paramètres vitaux normaux sous anesthésie</h2>
        <div className="labo-ref-tableau">
          {PARAMS_VITAUX.map((p, i) => (
            <div key={i} className="monitoring-param-ligne">
              <span className="monitoring-param-nom">{p.parametre}</span>
              <div className="monitoring-param-valeurs">
                {p.valeurs.map((v, j) => (
                  <span key={j} className={`monitoring-valeur ${v.alerte ? 'monitoring-valeur--alerte' : ''}`}>
                    {v.label ? <span className="monitoring-valeur-label">{v.label} : </span> : null}
                    {v.valeur}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PROFONDEUR ANESTHÉSIQUE ────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Profondeur anesthésique</h2>
        <p className="labo-ref-note">Sélectionne le critère observé pour chaque élément afin d'estimer le stade anesthésique.</p>

        <div className="monitoring-questionnaire">
          {CRITERES.map(critere => (
            <div key={critere.id} className="monitoring-critere">
              <p className="monitoring-critere-label">{critere.label}</p>
              <div className="monitoring-critere-options">
                {critere.options.map(opt => (
                  <button
                    key={opt.stade + '-' + opt.texte}
                    className={`monitoring-critere-option ${reponses[critere.id] === opt.stade ? 'selectionne' : ''}`}
                    onClick={() => setReponses(prev => ({ ...prev, [critere.id]: opt.stade }))}
                  >
                    {opt.texte}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {resultatStade && (
          <div className="monitoring-resultat">
            <p className="monitoring-stade-titre">{RESULTATS_STADES[resultatStade].titre}</p>
            <p className="monitoring-resultat-description">{RESULTATS_STADES[resultatStade].description}</p>
            <ul className="monitoring-stade-liste">
              {RESULTATS_STADES[resultatStade].signes.map((s, j) => renderSigne(s, j))}
            </ul>
          </div>
        )}

        {resultatStade && (
          <button className="douleur-btn-reinit" onClick={() => setReponses({})}>
            <i className="ti ti-refresh"></i>
            Réinitialiser
          </button>
        )}

        <div className="monitoring-stade monitoring-stade--alerte">
          <p className="monitoring-stade-titre">{STADE_4.titre}</p>
          <ul className="monitoring-stade-liste">
            {STADE_4.signes.map((s, j) => renderSigne(s, j))}
          </ul>
        </div>
      </div>

      {/* ─── CAPNOGRAPHIE ───────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">ETCO₂ — Capnographie</h2>
        <div className="monitoring-capno">
          {CAPNOGRAPHIE.map((c, i) => (
            <div key={i} className="monitoring-capno-bloc">
              <p className="monitoring-capno-titre" style={{ color: c.couleur }}>{c.titre}</p>
              <ul className="monitoring-stade-liste">
                {c.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
