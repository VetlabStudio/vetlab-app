import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/* ════════════════════════════════════════════════════════════
   RÉANIMATION CARDIORESPIRATOIRE
   Doses et paramètres : RECOVER 2024 (ACVECC), JVECC,
   Burkitt-Creedon et coll., doi 10.1111/vec.13391.

   Les doses en mg/kg sont des valeurs de protocole : elles
   restent figées dans le code et ne viennent pas des fiches.
   Les concentrations servent uniquement à convertir en mL ;
   celles inscrites ici reprennent les fiches actuelles de la
   base. Quand les fiches d'urgence seront corrigées, cette
   constante sera remplacée par une lecture de `medicaments`
   avec surcharge par `medicaments_custom`.
   ════════════════════════════════════════════════════════════ */

const BPM = 110                              // 100 à 120/min
const INTERVALLE_COMPRESSION = 60000 / BPM
const INTERVALLE_VENTILATION = 6000          // 10 ventilations/min
const DUREE_CYCLE = 120000                   // cycle de 2 minutes
const LIMITE_VERIFICATION = 10000            // pause de 10 s maximum

/* ─── SONS ───────────────────────────────────────────────────
   Réglés pour une salle bruyante. Le volume monte de 0.3 à 0.9,
   mais le gain compte moins que la forme d'onde : une onde
   carrée porte ses harmoniques dans la bande où l'oreille est
   la plus sensible, donc elle perce le bruit ambiant là où une
   sinusoïde se noie. Tout se règle ici. */
const SONS = {
  compression: { frequence: 800, forme: 'square',   volume: 0.90, duree: 0.06 },
  ventilation: { frequence: 400, forme: 'triangle', volume: 0.85, duree: 0.22 },
  pulse:       { frequence: 600, forme: 'square',   volume: 1.00, duree: 0.30 },
}

const VASOPRESSEURS = ['epinephrine', 'vasopressine']

const PRODUITS = [
  {
    id: 'epinephrine',
    nom: 'Épinéphrine',
    groupe: 'principal',
    doseMin: 0.01, doseMax: null, unite: 'mg/kg',
    concentration: 1, uniteConc: 'mg/mL',
    voie: 'IV/IO',
    frequence: 'aux 3 à 5 min, un cycle sur deux',
    especes: ['chien', 'chat'],
  },
  {
    id: 'vasopressine',
    nom: 'Vasopressine',
    groupe: 'principal',
    doseMin: 0.8, doseMax: null, unite: 'U/kg',
    concentration: null, uniteConc: 'U/mL',
    voie: 'IV/IO',
    frequence: 'aux 3 à 5 min, un cycle sur deux',
    especes: ['chien', 'chat'],
  },
  {
    id: 'atropine',
    nom: 'Atropine',
    groupe: 'principal',
    doseMin: 0.04, doseMax: 0.054, unite: 'mg/kg',
    concentration: 0.54, uniteConc: 'mg/mL',
    voie: 'IV/IO',
    note: 'Dose unique, le plus tôt possible, seulement si un tonus vagal élevé est soupçonné. Ne pas répéter.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'lidocaine',
    nom: 'Lidocaïne',
    groupe: 'antiarythmique',
    doseMin: 2, doseMax: null, unite: 'mg/kg',
    concentration: 20, uniteConc: 'mg/mL',
    voie: 'IV lent sur 2 à 4 min',
    note: 'FV ou TV réfractaire.',
    especes: ['chien'],
  },
  {
    id: 'amiodarone',
    nom: 'Amiodarone',
    groupe: 'antiarythmique',
    doseMin: 5, doseMax: null, unite: 'mg/kg',
    concentration: null, uniteConc: 'mg/mL',
    voie: 'IV lent sur 2 à 4 min',
    note: 'Antiarythmique de remplacement chez le chat.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'esmolol',
    nom: 'Esmolol',
    groupe: 'antiarythmique',
    doseMin: 0.5, doseMax: null, unite: 'mg/kg',
    concentration: null, uniteConc: 'mg/mL',
    voie: 'IV lent sur 3 à 5 min',
    note: 'Suivi d’une CRI de 50 µg/kg/min.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'naloxone',
    nom: 'Naloxone',
    groupe: 'antagoniste',
    doseMin: 0.04, doseMax: null, unite: 'mg/kg',
    concentration: 0.4, uniteConc: 'mg/mL',
    voie: 'IV/IO',
    note: 'Renversement des opioïdes.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'atipamezole',
    nom: 'Atipamézole',
    groupe: 'antagoniste',
    doseMin: 100, doseMax: null, unite: 'mcg/kg',
    concentration: 5, uniteConc: 'mg/mL',
    voie: 'IV lent',
    note: 'Renversement des agonistes alpha-2.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'flumazenil',
    nom: 'Flumazénil',
    groupe: 'antagoniste',
    doseMin: 0.01, doseMax: null, unite: 'mg/kg',
    concentration: 0.1, uniteConc: 'mg/mL',
    voie: 'IV/IO',
    note: 'Renversement des benzodiazépines.',
    especes: ['chien', 'chat'],
  },
  {
    id: 'bicarbonate',
    nom: 'Bicarbonate de sodium',
    groupe: 'tampon',
    doseMin: 1, doseMax: null, unite: 'mEq/kg',
    concentration: null, uniteConc: 'mEq/mL',
    voie: 'IV/IO',
    note: 'Hors algorithme RECOVER. Réservé à l’acidose métabolique documentée lors d’une réanimation prolongée.',
    especes: ['chien', 'chat'],
  },
]

const GROUPES = [
  { id: 'antiarythmique', label: 'Antiarythmiques' },
  { id: 'antagoniste',    label: 'Antagonistes / renversement' },
  { id: 'tampon',         label: 'Thérapie tampon' },
]

const DEFIBRILLATEURS = [
  { id: 'biph_ext', label: 'Biphasique externe',   court: 'Biph. ext.',   min: 2,   max: 4 },
  { id: 'biph_int', label: 'Biphasique interne',   court: 'Biph. int.',   min: 0.2, max: 0.4 },
  { id: 'mono_ext', label: 'Monophasique externe', court: 'Monoph. ext.', min: 4,   max: 6 },
  { id: 'mono_int', label: 'Monophasique interne', court: 'Monoph. int.', min: 0.5, max: 1 },
]

const CLE_DEFIB = 'adjuvet.rcr.defibrillateur'

// ─── OUTILS ──────────────────────────────────────────────────

function formaterTemps(ms) {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function arrondir(val, decimales = 1) {
  if (!val || isNaN(val) || !isFinite(val)) return 0
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

function formaterNombre(v) {
  if (!isFinite(v)) return '—'
  if (v >= 100) return String(Math.round(v))
  if (v < 0.1) return String(arrondir(v, 3))
  return String(arrondir(v, 2))
}

function uniteSeule(unite) {
  return unite ? unite.split('/')[0] : ''
}

/* Convertit une quantité en volume, quand les unités le
   permettent. Retourne null plutôt qu'un chiffre douteux. */
function volumeMl(quantite, uniteDose, concentration, uniteConc) {
  if (!concentration || concentration <= 0) return null
  const base = uniteSeule(uniteDose)
  const baseConc = uniteSeule(uniteConc)
  let q = quantite
  if (base === baseConc) q = quantite
  else if (base === 'mcg' && baseConc === 'mg') q = quantite / 1000
  else if (base === 'mg' && baseConc === 'mcg') q = quantite * 1000
  else return null
  return q / concentration
}

/* Le compresseur en sortie permet de pousser le volume sans
   que les crêtes de l'onde carrée saturent. */
function creerAudio() {
  const Constructeur = window.AudioContext || window.webkitAudioContext
  if (!Constructeur) return null
  const ctx = new Constructeur()
  const compresseur = ctx.createDynamicsCompressor()
  compresseur.threshold.setValueAtTime(-20, ctx.currentTime)
  compresseur.knee.setValueAtTime(10, ctx.currentTime)
  compresseur.ratio.setValueAtTime(12, ctx.currentTime)
  compresseur.attack.setValueAtTime(0.002, ctx.currentTime)
  compresseur.release.setValueAtTime(0.1, ctx.currentTime)
  compresseur.connect(ctx.destination)
  return { ctx, sortie: compresseur }
}

function creerSon(audio, type) {
  if (!audio) return
  const reglage = SONS[type]
  if (!reglage) return
  const { ctx, sortie } = audio
  const oscillateur = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillateur.type = reglage.forme
  oscillateur.frequency.setValueAtTime(reglage.frequence, ctx.currentTime)
  gain.gain.setValueAtTime(reglage.volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + reglage.duree)
  oscillateur.connect(gain)
  gain.connect(sortie)
  oscillateur.start(ctx.currentTime)
  oscillateur.stop(ctx.currentTime + reglage.duree)
}

// ─── COMPOSANT ───────────────────────────────────────────────

export default function RCR() {
  const [onglet, setOnglet] = useState('chrono')

  // Chronomètre
  const [actif, setActif] = useState(false)
  const [enVerification, setEnVerification] = useState(false)
  const [tempsTotal, setTempsTotal] = useState(0)
  const [tempsCycle, setTempsCycle] = useState(0)
  const [tempsVerif, setTempsVerif] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [progressionVentilation, setProgressionVentilation] = useState(1)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [confirmerFin, setConfirmerFin] = useState(false)
  const [rappelsOuverts, setRappelsOuverts] = useState(false)

  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const compressionRef = useRef(null)
  const ventilationRef = useRef(null)
  const ventilDebutRef = useRef(null)
  const verifDebutRef = useRef(null)
  const totalRef = useRef({ accumule: 0, debut: null })
  const cycleRef = useRef({ accumule: 0, debut: null })

  // Doses
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [groupesOuverts, setGroupesOuverts] = useState([])
  const [defibId, setDefibId] = useState(() => {
    try {
      return localStorage.getItem(CLE_DEFIB) || 'biph_ext'
    } catch {
      return 'biph_ext'
    }
  })

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  // ─── SONS ──────────────────────────────────────────────────

  function getAudio() {
    if (!audioRef.current) audioRef.current = creerAudio()
    const audio = audioRef.current
    if (audio && audio.ctx.state === 'suspended') audio.ctx.resume()
    return audio
  }

  const demarrerSons = useCallback(() => {
    const audio = getAudio()
    if (!audio) return

    compressionRef.current = setInterval(() => {
      creerSon(audio, 'compression')
    }, INTERVALLE_COMPRESSION)

    ventilDebutRef.current = Date.now()
    ventilationRef.current = setInterval(() => {
      creerSon(audio, 'ventilation')
      ventilDebutRef.current = Date.now()
    }, INTERVALLE_VENTILATION)
  }, [])

  const arreterSons = useCallback(() => {
    clearInterval(compressionRef.current)
    clearInterval(ventilationRef.current)
    ventilDebutRef.current = null
  }, [])

  /* Le métronome se tait pendant la vérification du pouls :
     les compressions sont interrompues à ce moment. */
  useEffect(() => {
    if (actif && !enVerification) {
      demarrerSons()
      return () => arreterSons()
    }
    arreterSons()
  }, [actif, enVerification, demarrerSons, arreterSons])

  // ─── HORLOGE ───────────────────────────────────────────────

  const declencherVerification = useCallback(() => {
    cycleRef.current = { accumule: 0, debut: null }
    verifDebutRef.current = Date.now()
    setTempsCycle(0)
    setTempsVerif(0)
    setProgressionVentilation(1)
    setCycles(prev => prev + 1)
    setEnVerification(true)

    const audio = getAudio()
    creerSon(audio, 'pulse')
    setTimeout(() => creerSon(audio, 'pulse'), 400)
    setTimeout(() => creerSon(audio, 'pulse'), 800)
  }, [])

  useEffect(() => {
    if (!actif) return

    intervalRef.current = setInterval(() => {
      const now = Date.now()

      if (totalRef.current.debut) {
        setTempsTotal(totalRef.current.accumule + (now - totalRef.current.debut))
      }

      if (cycleRef.current.debut) {
        const ecoule = cycleRef.current.accumule + (now - cycleRef.current.debut)
        if (ecoule >= DUREE_CYCLE) {
          declencherVerification()
        } else {
          setTempsCycle(ecoule)
        }
      }

      if (ventilDebutRef.current) {
        const ventil = now - ventilDebutRef.current
        setProgressionVentilation(1 - Math.min(ventil / INTERVALLE_VENTILATION, 1))
      }

      if (verifDebutRef.current) {
        setTempsVerif(now - verifDebutRef.current)
      }
    }, 50)

    return () => clearInterval(intervalRef.current)
  }, [actif, declencherVerification])

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(compressionRef.current)
      clearInterval(ventilationRef.current)
    }
  }, [])

  // ─── ACTIONS DU CHRONOMÈTRE ────────────────────────────────

  function demarrer() {
    const now = Date.now()
    totalRef.current.debut = now
    cycleRef.current.debut = now
    setActif(true)
  }

  function mettreEnPause() {
    const now = Date.now()
    if (totalRef.current.debut) {
      totalRef.current.accumule += now - totalRef.current.debut
      totalRef.current.debut = null
    }
    if (cycleRef.current.debut) {
      cycleRef.current.accumule += now - cycleRef.current.debut
      cycleRef.current.debut = null
    }
    setActif(false)
    setConfirmerFin(false)
    setShowPauseModal(true)
  }

  function handleBouton() {
    if (actif) mettreEnPause()
    else demarrer()
  }

  function reprendreCode() {
    setShowPauseModal(false)
    setConfirmerFin(false)
    demarrer()
  }

  function terminerCode() {
    setShowPauseModal(false)
    setConfirmerFin(false)
    setActif(false)
    setEnVerification(false)
    setTempsTotal(0)
    setTempsCycle(0)
    setTempsVerif(0)
    setCycles(0)
    setProgressionVentilation(1)
    totalRef.current = { accumule: 0, debut: null }
    cycleRef.current = { accumule: 0, debut: null }
    verifDebutRef.current = null
    ventilDebutRef.current = null
  }

  function reprendreApresVerification() {
    verifDebutRef.current = null
    cycleRef.current = { accumule: 0, debut: Date.now() }
    setTempsVerif(0)
    setEnVerification(false)
  }

  // ─── DOSES ─────────────────────────────────────────────────

  function basculerGroupe(id) {
    setGroupesOuverts(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function choisirDefib(id) {
    setDefibId(id)
    try {
      localStorage.setItem(CLE_DEFIB, id)
    } catch {
      /* stockage refusé : le choix vaut pour la session */
    }
  }

  const produitsVisibles = useMemo(
    () => PRODUITS.filter(p => p.especes.includes(espece)),
    [espece]
  )

  const lidocaineMasquee = espece === 'chat'

  /* Vasopresseur donné un cycle sur deux : cycles impairs. */
  const cycleActuel = cycles + 1
  const doseDueMaintenant = cycleActuel % 2 === 1
  const prochainCycleDose = doseDueMaintenant ? cycleActuel : cycleActuel + 1

  const defib = DEFIBRILLATEURS.find(d => d.id === defibId) || DEFIBRILLATEURS[0]

  // ─── AFFICHAGE ─────────────────────────────────────────────

  const progressionCycle = Math.min(tempsCycle / DUREE_CYCLE, 1)
  const secondesRestantes = Math.max(0, Math.ceil((DUREE_CYCLE - tempsCycle) / 1000))
  const rayon = 80
  const circonference = 2 * Math.PI * rayon
  const offset = circonference * (1 - progressionCycle)

  const secondesVerif = Math.floor(tempsVerif / 1000)
  const depassement = tempsVerif >= LIMITE_VERIFICATION

  function carteDose(p) {
    const qMin = poidsKg ? p.doseMin * poidsKg : 0
    const qMax = poidsKg && p.doseMax ? p.doseMax * poidsKg : null
    const uniteQ = uniteSeule(p.unite)

    const vMin = poidsKg ? volumeMl(qMin, p.unite, p.concentration, p.uniteConc) : null
    const vMax = qMax ? volumeMl(qMax, p.unite, p.concentration, p.uniteConc) : null

    const estVasopresseur = VASOPRESSEURS.includes(p.id)

    return (
      <div className="rcr-dose" key={p.id}>
        <div className="rcr-dose-haut">
          <span className="rcr-dose-nom">{p.nom}</span>
          <span className="rcr-dose-ref">
            {p.doseMax ? `${p.doseMin} – ${p.doseMax}` : p.doseMin} {p.unite}
          </span>
        </div>

        <div className="rcr-dose-valeurs">
          <span className="rcr-dose-quantite">
            {poidsKg
              ? `${formaterNombre(qMin)}${qMax ? ` – ${formaterNombre(qMax)}` : ''} ${uniteQ}`
              : '—'}
          </span>
          {vMin !== null && (
            <span className="rcr-dose-volume">
              {formaterNombre(vMin)}{vMax !== null ? ` – ${formaterNombre(vMax)}` : ''} mL
            </span>
          )}
        </div>

        <div className="rcr-dose-bas">
          {p.voie}
          {p.concentration ? ` · solution ${p.concentration} ${p.uniteConc}` : ''}
          {p.frequence ? ` · ${p.frequence}` : ''}
        </div>

        {p.note && <div className="rcr-dose-note">{p.note}</div>}

        {estVasopresseur && actif && (
          <span className={`rcr-dose-tag ${doseDueMaintenant ? 'due' : ''}`}>
            {doseDueMaintenant
              ? `Dose due à ce cycle (${cycleActuel})`
              : `Prochaine dose au cycle ${prochainCycleDose}`}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="rcr-page">

      {/* ─── STATUS, PARTAGÉ PAR LES DEUX ONGLETS ─── */}
      <div className={`rcr-status ${actif ? 'actif' : tempsTotal > 0 ? 'pause' : ''}`}>
        <span className="rcr-status-texte">
          {actif ? 'CODE EN COURS' : tempsTotal > 0 ? 'EN PAUSE' : 'PRÊT'}
        </span>
        <span className="rcr-temps-total">{formaterTemps(tempsTotal)}</span>
      </div>

      {/* ─── ONGLETS ────────────────────────── */}
      <div className="rcr-onglets" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={onglet === 'chrono'}
          className={onglet === 'chrono' ? 'actif' : ''}
          onClick={() => setOnglet('chrono')}
        >
          Chrono
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={onglet === 'doses'}
          className={onglet === 'doses' ? 'actif' : ''}
          onClick={() => setOnglet('doses')}
        >
          Doses
          {!poidsKg && <span className="rcr-onglet-point" aria-label="poids à saisir"></span>}
        </button>
      </div>

      {/* ══════════════ ONGLET CHRONO ══════════════ */}
      {onglet === 'chrono' && (
        <>
          <div className="rcr-chrono-rangee">
            <div className="rcr-cercle-wrapper">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={rayon} fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle
                  cx="100" cy="100" r={rayon}
                  fill="none"
                  stroke={actif ? 'var(--accent-red)' : 'var(--primary-light)'}
                  strokeWidth="12"
                  strokeDasharray={circonference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
                <text x="100" y="86" textAnchor="middle" fontSize="13" fill="var(--text-secondary)" fontFamily="Montserrat">
                  Vérif. pouls dans
                </text>
                <text x="100" y="114" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--text-primary)" fontFamily="Montserrat">
                  {secondesRestantes}s
                </text>
                <text x="100" y="136" textAnchor="middle" fontSize="12" fill="var(--text-hint)" fontFamily="Montserrat">
                  Cycle {cycleActuel}
                </text>
              </svg>
            </div>

            <div className="rcr-ventil-wrapper">
              <div className="rcr-ventil-barre-container">
                <div
                  className="rcr-ventil-barre-fill"
                  style={{ height: `${progressionVentilation * 100}%` }}
                />
              </div>
              <span className="rcr-ventil-label">Ventilation</span>
            </div>
          </div>

          <div className="rcr-infos">
            <div className="rcr-info-item">
              <span className="rcr-info-label">Compressions</span>
              <span className="rcr-info-valeur">{BPM} BPM</span>
            </div>
            <div className="rcr-info-item">
              <span className="rcr-info-label">Ventilation</span>
              <span className="rcr-info-valeur">1 / 6 sec</span>
            </div>
            <div className="rcr-info-item">
              <span className="rcr-info-label">Cycles complétés</span>
              <span className="rcr-info-valeur">{cycles}</span>
            </div>
          </div>

          <button
            className={`rcr-btn-principal ${actif ? 'stop' : 'start'}`}
            onClick={handleBouton}
          >
            {actif ? 'PAUSE' : tempsTotal > 0 ? 'REPRENDRE' : 'DÉMARRER LE CODE'}
          </button>

          <div className="rcr-groupe">
            <button
              type="button"
              className={`rcr-groupe-entete ${rappelsOuverts ? 'ouvert' : ''}`}
              onClick={() => setRappelsOuverts(o => !o)}
              aria-expanded={rappelsOuverts}
            >
              <i className="ti ti-list-check rcr-groupe-icone"></i>
              <span className="rcr-groupe-label">Rappels techniques</span>
              <i className={`ti ti-chevron-${rappelsOuverts ? 'up' : 'down'}`}></i>
            </button>

            {rappelsOuverts && (
              <div className="rcr-rappels rcr-rappels--replie">
                <div className="rcr-rappel">
                  <i className="ti ti-heart-rate-monitor"></i>
                  <span>Compressions : animal en décubitus latéral sur surface rigide. Mains placées derrière la pointe du coude, sur la partie la plus large du thorax. Bras tendus, comprimer 1/3 de l'épaisseur thoracique, relâchement complet entre chaque compression.</span>
                </div>
                <div className="rcr-rappel">
                  <i className="ti ti-wind"></i>
                  <span>Ventilation : 1 insufflation toutes les 6 secondes, se fier à la barre de progression.</span>
                </div>
                <div className="rcr-rappel">
                  <i className="ti ti-refresh"></i>
                  <span>Changer de compresseur à chaque cycle de 2 minutes. La pause entre deux cycles ne doit pas dépasser 10 secondes.</span>
                </div>
                <div className="rcr-rappel">
                  <i className="ti ti-bolt"></i>
                  <span>Après un choc, reprendre les compressions pour un cycle complet de 2 minutes sans réévaluer le rythme.</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ ONGLET DOSES ══════════════ */}
      {onglet === 'doses' && (
        <>
          <div className="champ" style={{ width: '100%' }}>
            <div className="espece-toggle">
              <span className={`espece-label ${espece === 'chien' ? 'active' : ''}`}>
                <img src="/icone-chien.svg" alt="Chien" className="espece-icone" />
                Chien
              </span>
              <div
                className={`toggle-slider ${espece === 'chat' ? 'droite' : ''}`}
                onClick={() => setEspece(espece === 'chien' ? 'chat' : 'chien')}
              >
                <div className="toggle-thumb"></div>
              </div>
              <span className={`espece-label ${espece === 'chat' ? 'active' : ''}`}>
                <img src="/icone-chat.svg" alt="Chat" className="espece-icone" />
                Chat
              </span>
            </div>
          </div>

          <div className="champ" style={{ width: '100%' }}>
            <label>Poids de l'animal</label>
            <div className="champ-input">
              <div className="champ-icone-wrapper">
                <img src="/icone-poids.svg" alt="poids" />
              </div>
              <input
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
          </div>

          <div className="rcr-doses-bloc">
            {produitsVisibles.filter(p => p.groupe === 'principal' && VASOPRESSEURS.includes(p.id)).map(carteDose)}
            <p className="rcr-doses-ou">ou l'un ou l'autre, pas les deux</p>
            {produitsVisibles.filter(p => p.groupe === 'principal' && !VASOPRESSEURS.includes(p.id)).map(carteDose)}
          </div>

          {GROUPES.map(g => {
            const produits = produitsVisibles.filter(p => p.groupe === g.id)
            const ouvert = groupesOuverts.includes(g.id)
            if (produits.length === 0) return null
            return (
              <div className="rcr-groupe" key={g.id}>
                <button
                  type="button"
                  className={`rcr-groupe-entete ${ouvert ? 'ouvert' : ''}`}
                  onClick={() => basculerGroupe(g.id)}
                  aria-expanded={ouvert}
                >
                  <span className="rcr-groupe-compte">{produits.length}</span>
                  <span className="rcr-groupe-label">{g.label}</span>
                  <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'}`}></i>
                </button>
                {ouvert && (
                  <div className="rcr-groupe-contenu">
                    {g.id === 'antiarythmique' && lidocaineMasquee && (
                      <div className="rcr-contre-indication">
                        <i className="ti ti-alert-triangle"></i>
                        La lidocaïne est contre-indiquée chez le chat. L'amiodarone est l'antiarythmique de remplacement.
                      </div>
                    )}
                    {produits.map(carteDose)}
                  </div>
                )}
              </div>
            )
          })}

          <div className="rcr-defib">
            <span className="rcr-defib-cle">Défibrillation</span>

            <div className="rcr-defib-chips">
              {DEFIBRILLATEURS.map(d => (
                <button
                  key={d.id}
                  type="button"
                  className={d.id === defibId ? 'actif' : ''}
                  onClick={() => choisirDefib(d.id)}
                >
                  {d.court}
                </button>
              ))}
            </div>

            <p className="rcr-defib-valeur">
              {poidsKg
                ? `${formaterNombre(defib.min * poidsKg)} – ${formaterNombre(defib.max * poidsKg)}`
                : '—'}
              <span className="rcr-defib-unite">J</span>
            </p>
            <p className="rcr-defib-detail">
              {defib.label} · {defib.min} à {defib.max} J/kg
              {poidsKg ? ` · premier choc ${formaterNombre(defib.min * poidsKg)} J` : ''}
            </p>

            <div className="rcr-defib-sep"></div>

            <div className="rcr-rythmes">
              <div className="rcr-rythme">
                <i className="ti ti-bolt"></i>
                <div>
                  <span className="rcr-rythme-titre">Rythmes choquables</span>
                  <span className="rcr-rythme-detail">FV, activité électrique désorganisée</span>
                  <span className="rcr-rythme-detail">TV sans pouls, complexes réguliers &gt; 200/min</span>
                </div>
              </div>
              <div className="rcr-rythme">
                <i className="ti ti-bolt-off"></i>
                <div>
                  <span className="rcr-rythme-titre">Rythmes non choquables</span>
                  <span className="rcr-rythme-detail">Asystolie, aucune activité électrique</span>
                  <span className="rcr-rythme-detail">AESP, complexes organisés &lt; 200/min</span>
                </div>
              </div>
            </div>

            <p className="rcr-defib-note">
              La défibrillation ne s'applique qu'aux rythmes choquables. Pour un rythme non choquable, compressions et vasopresseur.
            </p>
          </div>

          <div className="calc-avertissement">
            <i className="ti ti-alert-circle"></i>
            Doses et paramètres basés sur les lignes directrices RECOVER 2024 de l'ACVECC. Les concentrations affichées sont indicatives : vérifier l'étiquette de la fiole. Valider avec le vétérinaire responsable.
          </div>
        </>
      )}

      {/* ─── MODAL PAUSE ────────────────────── */}
      {showPauseModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            {!confirmerFin ? (
              <>
                <div className="popup-header"><span>Code en pause</span></div>
                <p className="rcr-modal-texte">
                  Temps écoulé : <strong>{formaterTemps(tempsTotal)}</strong><br />
                  Cycles complétés : <strong>{cycles}</strong>
                </p>
                <button className="rcr-btn-principal start" onClick={reprendreCode} style={{ marginBottom: 10 }}>
                  Reprendre le code
                </button>
                <button className="rcr-btn-terminer" onClick={() => setConfirmerFin(true)}>
                  Terminer et réinitialiser
                </button>
              </>
            ) : (
              <>
                <div className="popup-header"><span>Terminer le code ?</span></div>
                <p className="rcr-modal-texte">
                  Le chronomètre et le compte des cycles seront remis à zéro.
                  Note le temps écoulé avant de continuer : <strong>{formaterTemps(tempsTotal)}</strong>, <strong>{cycles}</strong> cycles.
                </p>
                <button className="rcr-btn-terminer" onClick={terminerCode} style={{ marginBottom: 10 }}>
                  Oui, terminer
                </button>
                <button className="rcr-btn-principal start" onClick={() => setConfirmerFin(false)}>
                  Revenir
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL VÉRIFICATION DU POULS ────── */}
      {enVerification && (
        <div className="popup-overlay">
          <div className="popup-card rcr-pulse-card">
            <p className="rcr-pulse-titre">VÉRIFICATION DU POULS</p>
            <p className="rcr-pulse-sous-titre">
              Cycle {cycles} complété · {formaterTemps(tempsTotal)}
            </p>

            <div className={`rcr-verif-compte ${depassement ? 'depassement' : ''}`}>
              <span className="rcr-verif-chiffre">{secondesVerif}s</span>
              <span className="rcr-verif-limite">
                {depassement ? 'Limite de 10 s dépassée' : 'sur 10 s maximum'}
              </span>
            </div>

            <p className="rcr-modal-texte">
              Vérifier le pouls fémoral. Changer de compresseur. Réévaluer le rythme cardiaque.
              Le métronome est en pause.
            </p>

            <button className="rcr-btn-principal start" onClick={reprendreApresVerification}>
              Reprendre les compressions
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
