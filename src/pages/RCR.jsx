import { useState, useEffect, useRef, useCallback } from 'react'

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

        // Progression ventilation
        if (ventilDebutRef.current) {
          const ventilElapsed = now - ventilDebutRef.current
          setProgressionVentilation(1 - Math.min(ventilElapsed / INTERVALLE_VENTILATION, 1))
        }

        // Fin de cycle
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
    setProgressionVentilation(0)
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

        {/* BARRE VENTILATION */}
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
          <span>Ventilation : 1 insufflation toutes les 6 secondes — se fier à la barre de progression.</span>
        </div>
        <div className="rcr-rappel">
          <i className="ti ti-refresh"></i>
          <span>Changer de compresseur à chaque cycle de 2 minutes pour maintenir l'efficacité.</span>
        </div>
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
