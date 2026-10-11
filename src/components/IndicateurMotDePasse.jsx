import { useEffect, useState } from 'react'
import { chargerListes, evaluerMotDePasse, listesChargees } from '../lib/motDePasse'

const LIBELLES = ['', 'Faible', 'Correct', 'Fort']

// Barre de force et conseil sous le champ du nouveau mot de passe.
export default function IndicateurMotDePasse({ motDePasse, email, nom }) {
  const [, setPret] = useState(Boolean(listesChargees()))

  useEffect(() => {
    let actif = true
    chargerListes().then(() => { if (actif) setPret(true) })
    return () => { actif = false }
  }, [])

  const { niveau, message } = evaluerMotDePasse(motDePasse, { email, nom })

  return (
    <div className={`mdp-force niveau-${niveau}`}>
      <div className="mdp-force-barre" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= niveau ? 'rempli' : ''} />
        ))}
      </div>
      <p className="mdp-force-texte" aria-live="polite">
        {niveau > 0 && <strong>{LIBELLES[niveau]}. </strong>}
        {message}
      </p>
    </div>
  )
}
