import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const BPM = 110
const INTERVALLE_COMPRESSION = 60000 / BPM
const INTERVALLE_VENTILATION = 6000
const DUREE_CYCLE = 120000

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

function creerSon(audioCtx, type) {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if (type === 'compression') {
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.05)
  } else if (type === 'ventilation') {
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.2)
  } else if (type === 'pulse') {
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.3)
  }
}

export default function RCR() {
  // ─── CHRONOMÈTRE ────────────────────────────
  const [actif, setActif] = useState(false)
  const [tempsTotal, setTempsTotal] = useState(0)
  const [tempsCycle, setTempsCycle] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [progressionVentilation, setProgressionVentilation] = useState(1)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showPulseAlert, setShowPulseAlert] = useState(false)

  const audioCtxRef = useRef(null)
  const intervalRef = useRef(null)
  const compressionRef = useRef(null)
  const ventilationRef = useRef(null)
  const debutRef = useRef(null)
  const tempsAccumuléRef = useRef(0)
  const tempsCycleAccumuléRef = useRef(0)
  const ventilDebutRef = useRef(null)

  // ─── DROGUES / DÉFIBRILLATION ────────────────
  const [poidsDefib, setPoidsDefib] = useState('')
  const [unitePoidsDefib, setUnitePoidsDefib] = useState('kg')

  const poidsDefibKg = useMemo(() => {
    const p = parseFloat(poidsDefib)
    if (!p || p <= 0) return 0
    return unitePoidsDefib === 'lb' ? arrondir(p / 2.205, 2) : p
  }, [poidsDefib, unitePoidsDefib])

  function getAudioCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const demarrerSons = useCallback(() => {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    compressionRef.current = setInterval(() => {
      creerSon(ctx, 'compression')
    }, INTERVALLE_COMPRESSION)

    ventilDebutRef.current = Date.now()
    ventilationRef.current = setInterval(() => {
      creerSon(ctx, 'ventilation')
      ventilDebutRef.current = Date.now()
    }, INTERVALLE_VENTILATION)
  }, [])

  const arreterSons = useCallback(() => {
    clearInterval(compressionRef.current)
    clearInterval(ventilationRef.current)
  }, [])

  useEffect(() => {
    if (actif) {
      debutRef.current = Date.now()

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = now - debutRef.current
        const newTempsTotal = tempsAccumuléRef.current + elapsed
        const newTempsCycle = tempsCycleAccumuléRef.current + elapsed

        setTempsTotal(newTempsTotal)
        setTempsCycle(newTempsCycle)

        if (ventilDebutRef.current) {
          const ventilElapsed = now - ventilDebutRef.current
          setProgressionVentilation(1 - Math.min(ventilElapsed / INTERVALLE_VENTILATION, 1))
        }

        if (newTempsCycle >= DUREE_CYCLE) {
          tempsCycleAccumuléRef.current = 0
          debutRef.current = Date.now()
          setCycles(prev => prev + 1)
          setShowPulseAlert(true)
          const ctx = getAudioCtx()
          creerSon(ctx, 'pulse')
          setTimeout(() => creerSon(ctx, 'pulse'), 400)
          setTimeout(() => creerSon(ctx, 'pulse'), 800)
        }
      }, 50)

      demarrerSons()
    } else {
      clearInterval(intervalRef.current)
      arreterSons()
      if (debutRef.current) {
        tempsAccumuléRef.current += Date.now() - debutRef.current
        tempsCycleAccumuléRef.current += Date.now() - debutRef.current
        debutRef.current = null
      }
    }

    return () => {
      clearInterval(intervalRef.current)
      arreterSons()
    }
  }, [actif])

  function handleBouton() {
    if (actif) {
      setActif(false)
      setShowPauseModal(true)
    } else {
      setActif(true)
    }
  }

  function reprendreCode() {
    setShowPauseModal(false)
    setActif(true)
  }

  function terminerCode() {
    setShowPauseModal(false)
    setActif(false)
    setTempsTotal(0)
    setTempsCycle(0)
    setCycles(0)
    setProgressionVentilation(1)
    tempsAccumuléRef.current = 0
    tempsCycleAccumuléRef.current = 0
    debutRef.current = null
    ventilDebutRef.current = null
  }

  function acquitterPulse() {
    setShowPulseAlert(false)
  }

  const progressionCycle = Math.min(tempsCycle / DUREE_CYCLE, 1)
  const secondesRestantes = Math.max(0, Math.ceil((DUREE_CYCLE - tempsCycle) / 1000))
  const rayon = 80
  const circonference = 2 * Math.PI * rayon
  const offset = circonference * (1 - progressionCycle)

  const p = poidsDefibKg

  return (
    <div className="rcr-page">

      {/* ─── STATUS ─────────────────────────── */}
      <div className={`rcr-status ${actif ? 'actif' : tempsTotal > 0 ? 'pause' : ''}`}>
        <span className="rcr-status-texte">
          {actif ? '🔴 CODE EN COURS' : tempsTotal > 0 ? '⏸ EN PAUSE' : 'PRÊT'}
        </span>
        <span className="rcr-temps-total">{formaterTemps(tempsTotal)}</span>
      </div>

      {/* ─── CERCLE + BARRE VENTILATION ─────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
            <text x="100" y="88" textAnchor="middle" fontSize="13" fill="var(--text-secondary)" fontFamily="Montserrat">
              Vérif. pouls dans
            </text>
            <text x="100" y="115" textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--text-primary)" fontFamily="Montserrat">
              {secondesRestantes}s
            </text>
            <text x="100" y="135" textAnchor="middle" fontSize="11" fill="var(--text-hint)" fontFamily="Montserrat">
              Cycle {cycles + 1}
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

      {/* ─── INFOS ──────────────────────────── */}
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

      {/* ─── BOUTON PRINCIPAL ───────────────── */}
      <button
        className={`rcr-btn-principal ${actif ? 'stop' : 'start'}`}
        onClick={handleBouton}
      >
        {actif ? '⏸ PAUSE' : tempsTotal > 0 ? '▶ REPRENDRE' : '▶ DÉMARRER LE CODE'}
      </button>

      {/* ─── RAPPELS ────────────────────────── */}
      <div className="rcr-rappels">
        <div className="rcr-rappel">
          <i className="ti ti-heart-rate-monitor"></i>
          <span>Compressions : Animal en décubitus latéral droit sur surface rigide. Mains placées derrière la pointe du coude, sur la partie la plus large du thorax. Bras tendus, comprimer 1/3 de l'épaisseur thoracique, relâchement complet entre chaque compression.</span>
        </div>
        <div className="rcr-rappel">
          <i className="ti ti-wind"></i>
          <span>Ventilation : 1 insufflation toutes les 6 secondes : se fier à la barre de progression.</span>
        </div>
        <div className="rcr-rappel">
          <i className="ti ti-refresh"></i>
          <span>Changer de compresseur à chaque cycle de 2 minutes pour maintenir l'efficacité.</span>
        </div>
      </div>

      {/* ─── DROGUES ET DÉFIBRILLATION ──────── */}
      <div className="rcr-section-titre">Drogues d'urgence & Défibrillation</div>

      <div className="champ" style={{ width: '100%' }}>
        <label>Poids de l'animal</label>
        <div className="champ-input">
          <div className="champ-icone-wrapper">
            <img src="/icone-poids.svg" alt="poids" />
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={poidsDefib}
            onChange={e => setPoidsDefib(e.target.value.replace(',', '.'))}
            placeholder="Ex: 10"
          />
          <div className="radio-groupe">
            <button className={`radio-btn ${unitePoidsDefib === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoidsDefib('kg')}>kg</button>
            <button className={`radio-btn ${unitePoidsDefib === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoidsDefib('lb')}>lb</button>
          </div>
        </div>
      </div>

      <div className="rcr-drogues-tableau" style={{ width: '100%' }}>

        <div className="rcr-drogue-header">Vasoconstriction</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Épinéphrine</span><span className="rcr-drogue-dose">0.01 mg/kg IV/IO</span></div>
          <strong>{p ? arrondir(0.01 * p, 2) + ' mg' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Vasopressine</span><span className="rcr-drogue-dose">0.8 U/kg IV/IO</span></div>
          <strong>{p ? arrondir(0.8 * p, 2) + ' U' : '—'}</strong>
        </div>

        <div className="rcr-drogue-header">Vagolytique</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Atropine</span><span className="rcr-drogue-dose">0.04–0.054 mg/kg IV/IO</span></div>
          <strong>{p ? arrondir(0.04 * p, 2) + '–' + arrondir(0.054 * p, 2) + ' mg' : '—'}</strong>
        </div>

        <div className="rcr-drogue-header">Antiarythmique</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Lidocaïne <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>(chien seulement)</span></span><span className="rcr-drogue-dose">2 mg/kg IV lent sur 2–4 min</span></div>
          <strong>{p ? arrondir(2 * p, 2) + ' mg' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Amiodarone</span><span className="rcr-drogue-dose">5 mg/kg IV lent sur 2–4 min</span></div>
          <strong>{p ? arrondir(5 * p, 2) + ' mg' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Esmolol</span><span className="rcr-drogue-dose">0.5 mg/kg IV lent sur 3–5 min + CRI 50 µg/kg/min</span></div>
          <strong>{p ? arrondir(0.5 * p, 2) + ' mg' : '—'}</strong>
        </div>

        <div className="rcr-drogue-header">Antagonistes / Reversal</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Naloxone</span><span className="rcr-drogue-dose">0.04 mg/kg IV/IO</span></div>
          <strong>{p ? arrondir(0.04 * p, 2) + ' mg' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Atipamézole</span><span className="rcr-drogue-dose">100 µg/kg IV lent</span></div>
          <strong>{p ? arrondir(100 * p) + ' µg' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Flumazénil</span><span className="rcr-drogue-dose">0.01 mg/kg IV/IO</span></div>
          <strong>{p ? arrondir(0.01 * p, 2) + ' mg' : '—'}</strong>
        </div>

        <div className="rcr-drogue-header">Thérapie tampon</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Bicarbonate de sodium</span><span className="rcr-drogue-dose">1 mEq/kg IV/IO</span></div>
          <strong>{p ? arrondir(1 * p, 1) + ' mEq' : '—'}</strong>
        </div>

        <div className="rcr-drogue-header">
  <img src="/icone-energie.svg" alt="défibrillation" style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 6, filter: 'invert(25%) sepia(80%) saturate(600%) hue-rotate(140deg)' }} />
  Défibrillation électrique
</div>
        <div className="rcr-drogue-note">Choquable : FV, TV sans pouls | Non-choquable : Asystolie, AESP</div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Biphasique externe</span><span className="rcr-drogue-dose">2–4 J/kg</span></div>
          <strong>{p ? arrondir(2 * p) + '–' + arrondir(4 * p) + ' J' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Biphasique interne</span><span className="rcr-drogue-dose">0.2–0.4 J/kg</span></div>
          <strong>{p ? arrondir(0.2 * p, 1) + '–' + arrondir(0.4 * p, 1) + ' J' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne">
          <div><span className="rcr-drogue-nom">Monophasique externe</span><span className="rcr-drogue-dose">4–6 J/kg</span></div>
          <strong>{p ? arrondir(4 * p) + '–' + arrondir(6 * p) + ' J' : '—'}</strong>
        </div>
        <div className="rcr-drogue-ligne" style={{ borderBottom: 'none' }}>
          <div><span className="rcr-drogue-nom">Monophasique interne</span><span className="rcr-drogue-dose">0.5–1 J/kg</span></div>
          <strong>{p ? arrondir(0.5 * p, 1) + '–' + arrondir(1 * p) + ' J' : '—'}</strong>
        </div>

      </div>

      <div className="calc-avertissement">
        <i className="ti ti-alert-circle"></i>
         Doses basées sur les lignes directrices RECOVER 2024 de l'American College of Veterinary Emergency and Critical Care (ACVECC). Valider avec le vétérinaire responsable. La lidocaïne est contre-indiquée chez le chat.
      </div>

      {/* ─── MODAL PAUSE ────────────────────── */}
      {showPauseModal && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-header">
              <span>Code en pause</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
              Temps écoulé : <strong>{formaterTemps(tempsTotal)}</strong><br />
              Cycles complétés : <strong>{cycles}</strong>
            </p>
            <button className="rcr-btn-principal start" onClick={reprendreCode} style={{ marginBottom: 10 }}>
              ▶ Reprendre le code
            </button>
            <button className="rcr-btn-terminer" onClick={terminerCode}>
              Terminer et réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL VÉRIFICATION DU POULS ────── */}
      {showPulseAlert && (
        <div className="popup-overlay">
          <div className="popup-card rcr-pulse-card">
            <p className="rcr-pulse-titre">⚡ VÉRIFICATION DU POULS</p>
            <p className="rcr-pulse-sous-titre">Cycle {cycles} complété — {formaterTemps(tempsTotal)}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              Vérifier le pouls fémoral. Changer de compresseur. Réévaluer le rythme cardiaque.
            </p>
            <button className="rcr-btn-principal start" onClick={acquitterPulse}>
              ✓ Continuer le code
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
