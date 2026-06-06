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

const STADES = [
  {
    numero: 1,
    titre: 'Stade 1',
    signes: [
      { texte: 'Réflexes oculaires (palpébral et cornéen)', emphase: 'présents' },
      { texte: 'Oeil en position', emphase: 'centrale' },
      { texte: 'Déglutition', emphase: 'Déglutition', suite: ', mouvements volontaires possibles' },
      { texte: 'FC et FR', emphase: 'élevées', suite: ', vocalisations possibles' },
    ],
  },
  {
    numero: 2,
    titre: 'Stade 2',
    signes: [
      { texte: 'Rotation ventrale de l\'oeil' },
      { texte: 'Tonus mandibulaire', emphase: 'diminué' },
      { texte: 'Réflexe cornéen', emphase: 'diminué', suite: ' mais encore présent' },
    ],
  },
  {
    numero: 3,
    titre: 'Stade 3',
    signes: [
      { texte: 'Musculature relâchée, mâchoire flasque' },
      { texte: 'Oeil en position centrale' },
      { texte: 'Réflexe cornéen', emphase: 'absent' },
      { texte: 'Absence de réaction à la stimulation' },
      { texte: 'Rythmes cardio-respiratoires réguliers' },
    ],
  },
  {
    numero: 4,
    titre: 'Stade 4 — Anesthésie trop profonde',
    alerte: true,
    signes: [
      { texte: 'Diminuer immédiatement le gaz anesthésique' },
      { texte: 'Rehausser la perfusion IV ou administrer bolus de solutés' },
      { texte: 'Oxygène supplémentaire ou antidote selon le cas' },
      { texte: 'Administration d\'un', emphase: 'agent réversif', suite: ' si besoin' },
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

export default function ChirurgieMonitoring() {
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
        <div className="monitoring-stades">
          {STADES.map((stade, i) => (
            <div key={i} className={`monitoring-stade ${stade.alerte ? 'monitoring-stade--alerte' : ''}`}>
              <p className="monitoring-stade-titre">{stade.titre}</p>
              <ul className="monitoring-stade-liste">
                {stade.signes.map((s, j) => (
                  <li key={j}>
                    {s.emphase && !s.suite
                      ? <><span>{s.texte.replace(s.emphase, '')}</span><strong>{s.emphase}</strong></>
                      : s.emphase && s.suite
                      ? <><strong>{s.emphase}</strong>{s.suite}</>
                      : s.texte
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
