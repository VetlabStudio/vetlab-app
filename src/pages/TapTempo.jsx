import { useState, useRef } from 'react'

const RESET_DELAI = 3000 // ms sans tap avant de recommencer
const MAX_TAPS = 8 // nombre d'intervalles utilisés pour la moyenne

export default function TapTempo() {
  const [bpm, setBpm] = useState(null)
  const [nbTaps, setNbTaps] = useState(0)
  const tapsRef = useRef([])

  function tap() {
    const maintenant = Date.now()
    const derniers = tapsRef.current

    if (derniers.length && maintenant - derniers[derniers.length - 1] > RESET_DELAI) {
      derniers.length = 0
    }

    derniers.push(maintenant)
    if (derniers.length > MAX_TAPS + 1) derniers.shift()

    setNbTaps(derniers.length)

    if (derniers.length >= 2) {
      const intervalles = []
      for (let i = 1; i < derniers.length; i++) {
        intervalles.push(derniers[i] - derniers[i - 1])
      }
      const moyenne = intervalles.reduce((a, b) => a + b, 0) / intervalles.length
      setBpm(Math.round(60000 / moyenne))
    }
  }

  function reinitialiser() {
    tapsRef.current = []
    setNbTaps(0)
    setBpm(null)
  }

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        <div className="calc-avertissement">
          <i className="ti ti-info-circle"></i>
          Tape au rythme des battements pour obtenir une estimation du nombre de battements par minute.
        </div>

        <div className="tempo-resultat">
          <span className="tempo-bpm">{bpm ?? '—'}</span>
          <span className="tempo-bpm-label">battements / min</span>
        </div>

        <button className="tempo-btn" onClick={tap}>
          <i className="ti ti-hand-finger"></i>
          <span>Tap</span>
        </button>

        <p className="tempo-compteur">{nbTaps > 0 ? `${nbTaps} tap${nbTaps > 1 ? 's' : ''}` : 'En attente du premier tap'}</p>

        <button className="labo-btn-secondary" style={{ width: '100%' }} onClick={reinitialiser}>
          <i className="ti ti-refresh"></i> Réinitialiser
        </button>

      </div>
    </div>
  )
}
