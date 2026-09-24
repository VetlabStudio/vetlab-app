import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── TABLEAU DÉSHYDRATATION ──────────────────────────────
   resume : ligne courte affichée sous la valeur choisie
   signes : texte complet, affiché dans le popup
   min    : borne inférieure servant à retrouver la rangée   */
const TABLEAU_DESHYDRATATION = [
  {
    degre: '< 5 %',
    min: 0,
    resume: "Aucune anomalie visible.",
    signes: "Aucune anomalie visible.",
  },
  {
    degre: '5-6 %',
    min: 5,
    resume: "Élasticité cutanée légèrement diminuée, muqueuses humides.",
    signes: "Perte modérée de l'élasticité cutanée. Lorsqu'on pince la peau, elle revient légèrement plus lentement à sa position normale. Les muqueuses restent toutefois humides.",
  },
  {
    degre: '6-8 %',
    min: 6,
    resume: "Pli cutané nettement ralenti, TRC parfois supérieur à 2 s.",
    signes: "Le pli cutané met clairement plus de temps à se remettre en place. Le temps de remplissage capillaire (TRC) peut être prolongé (>2 secondes).",
  },
  {
    degre: '10-12 %',
    min: 10,
    resume: "Pli cutané persistant, TRC très lent, yeux enfoncés, muqueuses sèches.",
    signes: "Déshydratation sévère. La peau reste en position pincée, le TRC est très lent, les yeux sont profondément enfoncés et les muqueuses sont sèches, collantes ou pâles.",
  },
  {
    degre: '12-15 %',
    min: 12,
    resume: "État de choc probable, urgence vitale.",
    signes: "Déshydratation extrême, souvent mortelle. L'état de choc est généralement manifeste, avec effondrement cardiovasculaire et détresse systémique. La mort peut survenir sans traitement d'urgence immédiat.",
  },
]

function rangeeDeshydratation(valeur) {
  let rangee = TABLEAU_DESHYDRATATION[0]
  for (const row of TABLEAU_DESHYDRATATION) {
    if (valeur >= row.min) rangee = row
  }
  return rangee
}

/* ─── FORMULES MAINTENANCE ──────────────────────────────── */
const FORMULES = {
  chien: [
    { id: 'resting', court: 'RER',      label: '132 × (Poids en kg)⁰·⁷⁵ ÷ 24 = ml/h', calc: p => 132 * Math.pow(p, 0.75) / 24 },
    { id: 'simple',  court: 'Simple',   label: '60 ml/kg/jour (2,5 ml/kg/h)',          calc: p => (60 * p) / 24 },
    { id: 'linear',  court: 'Linéaire', label: '(30 × Poids en kg + 70) ÷ 24 = ml/h',  calc: p => (30 * p + 70) / 24 },
  ],
  chat: [
    { id: 'resting', court: 'RER',      label: '80 × (Poids en kg)⁰·⁷⁵ ÷ 24 = ml/h',  calc: p => 80 * Math.pow(p, 0.75) / 24 },
    { id: 'simple',  court: 'Simple',   label: '40 ml/kg/jour (1,67 ml/kg/h)',         calc: p => (40 * p) / 24 },
    { id: 'linear',  court: 'Linéaire', label: '(30 × Poids en kg + 70) ÷ 24 = ml/h',  calc: p => (30 * p + 70) / 24 },
  ],
}

const VALEURS_DESHY = [5, 6, 8, 10, 12]
const DUREES = [4, 6, 8, 12, 24]
const VOLUMES_SAC = [250, 500, 1000]

/* ─── UTILITAIRES ───────────────────────────────────────── */
function fmt(valeur, decimales = 1) {
  if (!isFinite(valeur)) return '0'
  const arrondi = Math.round(valeur * Math.pow(10, decimales)) / Math.pow(10, decimales)
  return String(arrondi).replace('.', ',')
}

const CLE_PREFS = 'fluido-prefs'

function lirePrefs() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PREFS)) || {}
  } catch {
    return {}
  }
}

function ecrirePrefs(prefs) {
  try {
    localStorage.setItem(CLE_PREFS, JSON.stringify(prefs))
  } catch {
    /* stockage indisponible, sans conséquence */
  }
}

export default function Fluidotherapie() {
  const navigate = useNavigate()
  const prefsInitiales = useRef(lirePrefs()).current

  /* ─── ÉTAT : PATIENT ─────────────────────────────────── */
  const [espece, setEspece] = useState(prefsInitiales.espece || 'chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState(prefsInitiales.unitePoids || 'kg')
  const [patientOuvert, setPatientOuvert] = useState(true)

  /* ─── ÉTAT : BESOINS ─────────────────────────────────── */
  const [formuleId, setFormuleId] = useState(prefsInitiales.formuleId || 'resting')
  const [formulesOuvertes, setFormulesOuvertes] = useState(false)
  const [deshyActive, setDeshyActive] = useState(false)
  const [deshyChoix, setDeshyChoix] = useState(null)   // nombre, 'autre', ou null
  const [deshyAutre, setDeshyAutre] = useState('')
  const [pertesActive, setPertesActive] = useState(false)
  const [pertesValeur, setPertesValeur] = useState('')

  /* ─── ÉTAT : ADMINISTRATION ──────────────────────────── */
  const [duree, setDuree] = useState(24)

  /* ─── ÉTAT : GOUTTES ─────────────────────────────────── */
  const [gouttesOuvert, setGouttesOuvert] = useState(false)
  const [debitSaisi, setDebitSaisi] = useState('')      // '' = hérite du calcul
  const [facteurManuel, setFacteurManuel] = useState(null) // null = automatique

  /* ─── ÉTAT : INTERFACE ───────────────────────────────── */
  const [popupDeshy, setPopupDeshy] = useState(false)
  const [detailOuvert, setDetailOuvert] = useState(false)
  const [volumeSac, setVolumeSac] = useState(500)
  const [annulation, setAnnulation] = useState(null)
  const [copie, setCopie] = useState(false)

  const blocPatientRef = useRef(null)

  /* ─── PRÉFÉRENCES PERSISTANTES ───────────────────────── */
  useEffect(() => {
    ecrirePrefs({ espece, unitePoids, formuleId })
  }, [espece, unitePoids, formuleId])

  /* ─── HAUTEUR RÉELLE DE LA NAVIGATION DU BAS ─────────
     La barre collante doit se poser juste au-dessus de la
     nav, dont la hauteur varie selon l'appareil.          */
  useEffect(() => {
    const nav = document.querySelector('.bottom-nav-v2, .bottom-nav')
    if (!nav) return
    const majHauteur = () => {
      document.documentElement.style.setProperty('--fluido-nav-h', `${nav.offsetHeight}px`)
    }
    majHauteur()
    const observateur = new ResizeObserver(majHauteur)
    observateur.observe(nav)
    window.addEventListener('resize', majHauteur)
    return () => {
      observateur.disconnect()
      window.removeEventListener('resize', majHauteur)
    }
  }, [])

  /* ─── CALCULS ────────────────────────────────────────── */
  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? p / 2.205 : p
  }, [poids, unitePoids])

  const formuleActive = useMemo(() => {
    const liste = FORMULES[espece]
    return liste.find(f => f.id === formuleId) || liste[0]
  }, [espece, formuleId])

  const maintenance = useMemo(() => {
    if (poidsKg <= 0) return 0
    return formuleActive.calc(poidsKg)
  }, [poidsKg, formuleActive])

  const pourcentDeshy = useMemo(() => {
    if (!deshyActive) return 0
    if (deshyChoix === 'autre') return parseFloat(deshyAutre) || 0
    return deshyChoix || 0
  }, [deshyActive, deshyChoix, deshyAutre])

  const deficitFluide = useMemo(() => {
    if (poidsKg <= 0 || pourcentDeshy <= 0) return 0
    return poidsKg * (pourcentDeshy / 100) * 1000
  }, [poidsKg, pourcentDeshy])

  const pertes = useMemo(() => {
    if (!pertesActive) return 0
    return parseFloat(pertesValeur) || 0
  }, [pertesActive, pertesValeur])

  const aRemplacer = deficitFluide > 0 || pertes > 0

  const debitRemplacement = useMemo(() => {
    if (!aRemplacer || duree <= 0) return 0
    return (deficitFluide + pertes) / duree
  }, [aRemplacer, deficitFluide, pertes, duree])

  const debitHoraire = maintenance + debitRemplacement

  /* ─── GOUTTES ────────────────────────────────────────── */
  const debitPourGtts = debitSaisi !== '' ? (parseFloat(debitSaisi) || 0) : debitHoraire
  const facteurAuto = debitPourGtts > 0 && debitPourGtts < 100 ? 60 : 15
  const facteurGtts = facteurManuel ?? facteurAuto
  const gttsParMin = debitPourGtts > 0 && facteurGtts > 0 ? (debitPourGtts * facteurGtts) / 60 : 0
  const gttsPar15Sec = gttsParMin / 4
  const dureeSac = debitPourGtts > 0 ? volumeSac / debitPourGtts : 0

  const aDesDonnees = poids !== '' || deshyActive || pertesActive || debitSaisi !== ''

  /* ─── RÉINITIALISATION ───────────────────────────────── */
  function reinitialiser() {
    setAnnulation({
      poids, patientOuvert, deshyActive, deshyChoix, deshyAutre,
      pertesActive, pertesValeur, duree, gouttesOuvert, debitSaisi, facteurManuel,
    })
    setPoids('')
    setPatientOuvert(true)
    setDeshyActive(false)
    setDeshyChoix(null)
    setDeshyAutre('')
    setPertesActive(false)
    setPertesValeur('')
    setDuree(24)
    setGouttesOuvert(false)
    setDebitSaisi('')
    setFacteurManuel(null)
    setDetailOuvert(false)
  }

  function annulerReinitialisation() {
    if (!annulation) return
    setPoids(annulation.poids)
    setPatientOuvert(annulation.patientOuvert)
    setDeshyActive(annulation.deshyActive)
    setDeshyChoix(annulation.deshyChoix)
    setDeshyAutre(annulation.deshyAutre)
    setPertesActive(annulation.pertesActive)
    setPertesValeur(annulation.pertesValeur)
    setDuree(annulation.duree)
    setGouttesOuvert(annulation.gouttesOuvert)
    setDebitSaisi(annulation.debitSaisi)
    setFacteurManuel(annulation.facteurManuel)
    setAnnulation(null)
  }

  useEffect(() => {
    if (!annulation) return
    const t = setTimeout(() => setAnnulation(null), 6000)
    return () => clearTimeout(t)
  }, [annulation])

  /* ─── COPIE DU RÉSULTAT ──────────────────────────────── */
  async function copierResultat() {
    const lignes = [
      `Fluidothérapie, ${espece} ${fmt(poidsKg, 2)} kg`,
      `Entretien (${formuleActive.court}) : ${fmt(maintenance)} ml/h`,
    ]
    if (deficitFluide > 0) lignes.push(`Déficit ${fmt(pourcentDeshy)} % : ${fmt(deficitFluide, 0)} ml`)
    if (pertes > 0) lignes.push(`Pertes en cours : ${fmt(pertes, 0)} ml`)
    lignes.push(
      aRemplacer
        ? `Débit : ${fmt(debitHoraire)} ml/h pendant ${duree} h`
        : `Débit : ${fmt(debitHoraire)} ml/h`
    )
    if (gttsParMin > 0) lignes.push(`Gouttes : ${fmt(gttsParMin)} gtt/min (${facteurGtts} gtt/ml)`)

    try {
      await navigator.clipboard.writeText(lignes.join('\n'))
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    } catch {
      /* presse-papiers indisponible */
    }
  }

  /* ─── COMPORTEMENT DU BLOC PATIENT ───────────────────── */
  function replierPatient(e) {
    if (blocPatientRef.current && e.relatedTarget && blocPatientRef.current.contains(e.relatedTarget)) return
    if (poidsKg > 0) setPatientOuvert(false)
  }

  const rangeeActive = pourcentDeshy > 0 ? rangeeDeshydratation(pourcentDeshy) : null

  return (
    <div className="page-calculateurs fluido-page">

      {/* ─── BARRE DU HAUT ──────────────────────────────── */}
      <div className="fluido-topbar">
        <button
          className="fluido-reset"
          onClick={reinitialiser}
          disabled={!aDesDonnees}
          aria-label="Réinitialiser le calcul"
        >
          <i className="ti ti-refresh"></i>
          Réinitialiser
        </button>
      </div>

      <div className="calc-form">

        {/* ═══ BLOC 1 : PATIENT ═════════════════════════ */}
        {patientOuvert ? (
          <div className="fluido-bloc" ref={blocPatientRef} onBlur={replierPatient}>

            <div className="champ">
              <label>Choisir l'espèce</label>
              <div className="espece-toggle">
                <span className={`espece-label ${espece === 'chien' ? 'active' : ''}`}>
                  <img src="/icone-chien.svg" alt="" className="espece-icone" />
                  Chien
                </span>
                <button
                  type="button"
                  className={`toggle-slider ${espece === 'chat' ? 'droite' : ''}`}
                  onClick={() => setEspece(espece === 'chien' ? 'chat' : 'chien')}
                  aria-label={`Espèce : ${espece}. Changer d'espèce`}
                >
                  <div className="toggle-thumb"></div>
                </button>
                <span className={`espece-label ${espece === 'chat' ? 'active' : ''}`}>
                  <img src="/icone-chat.svg" alt="" className="espece-icone" />
                  Chat
                </span>
              </div>
            </div>

            <div className="champ">
              <label htmlFor="fluido-poids">Poids de l'animal</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-poids.svg" alt="" />
                </div>
                <input
                  id="fluido-poids"
                  type="text"
                  inputMode="decimal"
                  value={poids}
                  onChange={e => setPoids(e.target.value.replace(',', '.'))}
                  placeholder="Ex: 10"
                />
                <div className="radio-groupe">
                  <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
                  <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
                </div>
              </div>
              {poids !== '' && poidsKg <= 0 && (
                <p className="fluido-erreur">Poids invalide, entrez une valeur supérieure à 0.</p>
              )}
              {unitePoids === 'lb' && poidsKg > 0 && (
                <p className="range-hint">Soit {fmt(poidsKg, 2)} kg</p>
              )}
            </div>

          </div>
        ) : (
          <button className="fluido-resume" onClick={() => setPatientOuvert(true)}>
            <img src={espece === 'chat' ? '/icone-chat.svg' : '/icone-chien.svg'} alt="" className="fluido-resume-icone" />
            <span className="fluido-resume-texte">
              {espece === 'chat' ? 'Chat' : 'Chien'}, {poids.replace('.', ',')} {unitePoids}
            </span>
            <i className="ti ti-pencil"></i>
          </button>
        )}

        {/* ═══ BLOC 2 : BESOINS ═════════════════════════ */}
        {poidsKg > 0 && (
          <div className="fluido-bloc">

            <div className="fluido-ligne-principale">
              <span>Entretien</span>
              <strong>{fmt(maintenance)} ml/h</strong>
            </div>

            <button className="fluido-lien" onClick={() => setFormulesOuvertes(o => !o)}>
              {formuleActive.court} · {formulesOuvertes ? 'masquer les formules' : 'changer de formule'}
            </button>

            {formulesOuvertes && (
              <div className="fluido-formules">
                {FORMULES[espece].map(f => (
                  <button
                    key={f.id}
                    className={`fluido-formule-btn ${formuleId === f.id ? 'actif' : ''}`}
                    onClick={() => { setFormuleId(f.id); setFormulesOuvertes(false) }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            <div className="fluido-chips">
              <button
                className={`fluido-chip ${deshyActive ? 'actif' : ''}`}
                onClick={() => setDeshyActive(a => !a)}
              >
                {deshyActive
                  ? <>Déshydratation{pourcentDeshy > 0 ? ` ${fmt(pourcentDeshy)} %` : ''} <i className="ti ti-x"></i></>
                  : <>+ Déshydratation</>}
              </button>
              <button
                className={`fluido-chip ${pertesActive ? 'actif' : ''}`}
                onClick={() => setPertesActive(a => !a)}
              >
                {pertesActive
                  ? <>Pertes{pertes > 0 ? ` ${fmt(pertes, 0)} ml` : ''} <i className="ti ti-x"></i></>
                  : <>+ Pertes en cours</>}
              </button>
            </div>

            {deshyActive && (
              <div className="fluido-sous-bloc">
                <div className="fluido-valeurs">
                  {VALEURS_DESHY.map(v => (
                    <button
                      key={v}
                      className={`fluido-valeur-btn ${deshyChoix === v ? 'actif' : ''}`}
                      onClick={() => setDeshyChoix(v)}
                    >
                      {v} %
                    </button>
                  ))}
                  <button
                    className={`fluido-valeur-btn ${deshyChoix === 'autre' ? 'actif' : ''}`}
                    onClick={() => setDeshyChoix('autre')}
                  >
                    Autre
                  </button>
                </div>

                {deshyChoix === 'autre' && (
                  <div className="champ-input fluido-champ-compact">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={deshyAutre}
                      onChange={e => setDeshyAutre(e.target.value.replace(',', '.'))}
                      placeholder="0"
                      aria-label="Pourcentage de déshydratation"
                    />
                    <span className="unite-fixe">%</span>
                  </div>
                )}

                {rangeeActive && (
                  <p className="fluido-signes">{rangeeActive.resume}</p>
                )}

                {deficitFluide > 0 && (
                  <p className="range-hint">Déficit en fluide : <strong>{fmt(deficitFluide, 0)} ml</strong></p>
                )}

                <button className="fluido-lien" onClick={() => setPopupDeshy(true)}>
                  Voir le tableau complet
                </button>
              </div>
            )}

            {pertesActive && (
              <div className="fluido-sous-bloc">
                <div className="champ-input fluido-champ-compact">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={pertesValeur}
                    onChange={e => setPertesValeur(e.target.value.replace(',', '.'))}
                    placeholder="0"
                    aria-label="Volume des pertes en cours"
                  />
                  <span className="unite-fixe">ml</span>
                </div>
                <p className="fluido-aide">Volume estimé à remplacer sur la durée de correction.</p>
              </div>
            )}

          </div>
        )}

        {/* ═══ BLOC 3 : DURÉE ═══════════════════════════ */}
        {poidsKg > 0 && aRemplacer && (
          <div className="fluido-bloc">
            <div className="fluido-bloc-titre">Remplacer le déficit sur</div>
            <div className="fluido-valeurs">
              {DUREES.map(h => (
                <button
                  key={h}
                  className={`fluido-valeur-btn ${duree === h ? 'actif' : ''}`}
                  onClick={() => setDuree(h)}
                >
                  {h} h
                </button>
              ))}
            </div>
            <div className="champ-input fluido-champ-compact">
              <input
                type="text"
                inputMode="numeric"
                value={duree}
                onChange={e => setDuree(Math.max(0, parseFloat(e.target.value.replace(',', '.')) || 0))}
                aria-label="Durée de correction en heures"
              />
              <span className="unite-fixe">h</span>
            </div>
          </div>
        )}

        {/* ═══ SECTION REPLIABLE : GOUTTES ══════════════ */}
        <div className="fluido-repliable">
          <button className="fluido-repliable-header" onClick={() => setGouttesOuvert(o => !o)}>
            <span>Convertisseur en gouttes</span>
            <i className={`ti ti-chevron-${gouttesOuvert ? 'up' : 'down'}`}></i>
          </button>

          {gouttesOuvert && (
            <div className="fluido-repliable-contenu">

              <div className="champ">
                <label htmlFor="fluido-debit-gtts">Débit utilisé</label>
                <div className="champ-input">
                  <div className="champ-icone-wrapper">
                    <img src="/icone-debit.svg" alt="" />
                  </div>
                  <input
                    id="fluido-debit-gtts"
                    type="text"
                    inputMode="decimal"
                    value={debitSaisi !== '' ? debitSaisi : (debitHoraire > 0 ? fmt(debitHoraire) : '')}
                    onChange={e => setDebitSaisi(e.target.value.replace(',', '.'))}
                    placeholder="ml/h"
                  />
                  <span className="unite-fixe">ml/h</span>
                </div>
                {debitSaisi === '' && debitHoraire > 0 && (
                  <p className="fluido-aide">Repris du calcul ci-dessus.</p>
                )}
                {debitSaisi !== '' && debitHoraire > 0 && (
                  <button className="fluido-lien" onClick={() => setDebitSaisi('')}>
                    Rétablir le débit calculé ({fmt(debitHoraire)} ml/h)
                  </button>
                )}
              </div>

              <div className="champ">
                <label>Facteur du perfuseur</label>
                <div className="fluido-valeurs">
                  {[10, 15, 20, 60].map(f => (
                    <button
                      key={f}
                      className={`fluido-valeur-btn ${facteurGtts === f ? 'actif' : ''}`}
                      onClick={() => setFacteurManuel(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <p className="fluido-aide">
                  {debitPourGtts > 0 && debitPourGtts < 100
                    ? `Débit sous 100 ml/h, microgoutteur recommandé (60 gtt/ml).`
                    : debitPourGtts >= 100
                    ? `Débit de 100 ml/h ou plus, macrogoutteur recommandé (10 ou 15 gtt/ml).`
                    : `Microgoutteur (60 gtt/ml) sous 100 ml/h, macrogoutteur (10 ou 15 gtt/ml) au-delà.`}
                </p>
                {facteurManuel !== null && facteurManuel !== facteurAuto && (
                  <button className="fluido-lien" onClick={() => setFacteurManuel(null)}>
                    Rétablir le facteur recommandé ({facteurAuto} gtt/ml)
                  </button>
                )}
              </div>

              {gttsParMin > 0 && (
                <div className="resultat-card">
                  <div className="resultat-ligne">
                    <span>Gouttes par minute</span>
                    <strong>{fmt(gttsParMin)} gtt/min</strong>
                  </div>
                  <div className="resultat-ligne">
                    <span>Gouttes aux 15 secondes</span>
                    <strong>{fmt(gttsPar15Sec)} gtt/15 s</strong>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ═══ LIEN VERS LE CRI ═════════════════════════ */}
        {debitHoraire > 0 && (
          <button
            className="fluido-lien-page"
            onClick={() => navigate('/calculateurs/cri', {
              state: { debit: Math.round(debitHoraire * 100) / 100, poidsKg, espece },
            })}
          >
            <span>Calculer une médication en CRI avec ce débit</span>
            <i className="ti ti-chevron-right"></i>
          </button>
        )}

        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec le vétérinaire responsable avant d'administrer. Ce calculateur est un outil d'aide, votre jugement clinique prime en tout temps.
        </div>

      </div>

      {/* ═══ BARRE DE RÉSULTAT COLLANTE ═══════════════════ */}
      {debitHoraire > 0 && (
        <button className="fluido-barre" onClick={() => setDetailOuvert(true)}>
          <span className="fluido-barre-valeur">{fmt(debitHoraire)} ml/h</span>
          {aRemplacer && <span className="fluido-barre-detail">pendant {duree} h</span>}
          <i className="ti ti-chevron-up"></i>
        </button>
      )}

      {/* ═══ PANNEAU DE DÉTAIL ════════════════════════════ */}
      {detailOuvert && (
        <div className="fluido-sheet-overlay" onClick={() => setDetailOuvert(false)}>
          <div className="fluido-sheet" onClick={e => e.stopPropagation()}>
            <div className="fluido-sheet-poignee"></div>

            <div className="popup-header">
              <span>Détail du calcul</span>
              <button className="popup-close" onClick={() => setDetailOuvert(false)}>✕</button>
            </div>

            <div className="resultat-card">
              <div className="resultat-ligne">
                <span>Entretien ({formuleActive.court})</span>
                <strong>{fmt(maintenance)} ml/h</strong>
              </div>
              {deficitFluide > 0 && (
                <div className="resultat-ligne">
                  <span>Déficit {fmt(pourcentDeshy)} %</span>
                  <strong>{fmt(deficitFluide, 0)} ml</strong>
                </div>
              )}
              {pertes > 0 && (
                <div className="resultat-ligne">
                  <span>Pertes en cours</span>
                  <strong>{fmt(pertes, 0)} ml</strong>
                </div>
              )}
              {aRemplacer && (
                <div className="resultat-ligne">
                  <span>Remplacement sur {duree} h</span>
                  <strong>{fmt(debitRemplacement)} ml/h</strong>
                </div>
              )}
              <div className="resultat-ligne">
                <span>Débit total</span>
                <strong>{fmt(debitHoraire)} ml/h</strong>
              </div>
              {aRemplacer && (
                <div className="resultat-ligne">
                  <span>Volume sur {duree} h</span>
                  <strong>{fmt(debitHoraire * duree, 0)} ml</strong>
                </div>
              )}
            </div>

            <div className="resultat-card">
              <div className="resultat-ligne">
                <span>Gouttes ({facteurGtts} gtt/ml)</span>
                <strong>{fmt(gttsParMin)} gtt/min</strong>
              </div>
              <div className="resultat-ligne">
                <span>Aux 15 secondes</span>
                <strong>{fmt(gttsPar15Sec)} gtt/15 s</strong>
              </div>
              <button
                className="fluido-lien"
                onClick={() => { setDetailOuvert(false); setGouttesOuvert(true) }}
              >
                Ajuster le débit ou le facteur
              </button>
            </div>

            <div className="resultat-card">
              <div className="fluido-bloc-titre">Sac de fluide</div>
              <div className="fluido-valeurs">
                {VOLUMES_SAC.map(v => (
                  <button
                    key={v}
                    className={`fluido-valeur-btn ${volumeSac === v ? 'actif' : ''}`}
                    onClick={() => setVolumeSac(v)}
                  >
                    {v} ml
                  </button>
                ))}
              </div>
              {dureeSac > 0 && (
                <div className="resultat-ligne">
                  <span>Durée du sac</span>
                  <strong>{fmt(dureeSac)} h</strong>
                </div>
              )}
            </div>

            <button className="fluido-btn-copier" onClick={copierResultat}>
              {copie ? 'Copié' : 'Copier le résultat'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ BANDEAU D'ANNULATION ═════════════════════════ */}
      {annulation && (
        <div className="fluido-bandeau">
          <span>Calcul réinitialisé</span>
          <button onClick={annulerReinitialisation}>Annuler</button>
        </div>
      )}

      {/* ═══ POPUP TABLEAU DÉSHYDRATATION ═════════════════ */}
      {popupDeshy && (
        <div className="popup-overlay" onClick={() => setPopupDeshy(false)}>
          <div className="popup-card popup-large" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Évaluation de l'hydratation</span>
              <button className="popup-close" onClick={() => setPopupDeshy(false)}>✕</button>
            </div>
            <div className="fluido-tableau">
              <div className="fluido-tableau-header">
                <span>Degré de déshydratation</span>
                <span>Signes cliniques</span>
              </div>
              {TABLEAU_DESHYDRATATION.map((row, i) => (
                <div key={i} className="fluido-tableau-row">
                  <span className="fluido-tableau-degre">{row.degre}</span>
                  <span className="fluido-tableau-signes">{row.signes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
