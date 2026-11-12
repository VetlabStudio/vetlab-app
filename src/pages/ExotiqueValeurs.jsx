import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { VALEURS_EXOTIQUES } from '../data/valeursExotiques'
import { useEspeceExotique } from '../lib/useEspeceExotique'

// Valeurs de référence d'une espèce exotique (signes vitaux, sang, biochimie rénale, urine).
export default function ExotiqueValeurs() {
  const { espece, connue, inconnue } = useEspeceExotique(() => 'Valeurs de référence', '/valeurs')
  const [choix, setChoix] = useState(0)

  const sujets = connue ? VALEURS_EXOTIQUES[espece] : null
  if (inconnue || (connue && !sujets)) return <Navigate to={connue ? `/exotiques/${espece}` : '/exotiques'} replace />
  if (!connue) return null

  // Plusieurs sujets pour une même entrée (rongeurs : rat, souris, hamster, gerbille).
  const sujet = sujets[Math.min(choix, sujets.length - 1)]

  return (
    <div className="labo-detail-page">
      <p className="exotique-valeurs-intro">
        Valeurs indicatives : toujours se référer aux intervalles de référence de votre laboratoire.
      </p>

      {sujets.length > 1 && (
        <div className="drogues-filtres" role="group" aria-label="Espèce">
          {sujets.map((s, i) => (
            <button
              key={s.nom}
              className={`drogues-filtre-btn ${sujet === s ? 'actif' : ''}`}
              aria-pressed={sujet === s}
              onClick={() => setChoix(i)}
            >
              {s.nom}
            </button>
          ))}
        </div>
      )}

      {sujet.sections.map(section => (
        <section key={section.titre} className="labo-tube-card">
          <h2 className="labo-ref-titre exotique-valeurs-titre">{section.titre}</h2>
          {section.lignes.map((l, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--2col exotique-valeurs-ligne">
              <span>
                {l.nom}
                {l.unite && <span className="exotique-valeurs-unite">{l.unite}</span>}
              </span>
              <span>
                <span className="labo-ref-normal">{l.valeur}</span>
                {l.detail && <span className="exotique-valeurs-detail">{l.detail}</span>}
              </span>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
