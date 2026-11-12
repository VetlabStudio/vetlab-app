import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { VALEURS_EXOTIQUES } from '../data/valeursExotiques'
import { useEspeceExotique } from '../lib/useEspeceExotique'

/* Valeurs de référence d'une espèce exotique, sur une seule page en
   accordéons. Une espèce seule (lapin, furet...) : un accordéon par
   section (signes vitaux, sang, biochimie, urine). Plusieurs sujets
   (rongeurs, oiseaux, reptiles...) : un accordéon par sujet, avec ses
   sections à l'intérieur. Un seul accordéon ouvert à la fois. */
export default function ExotiqueValeurs() {
  const { espece, connue, inconnue } = useEspeceExotique(() => 'Valeurs de référence', '/valeurs')
  const [ouvert, setOuvert] = useState(null)

  const sujets = connue ? VALEURS_EXOTIQUES[espece] : null
  if (inconnue || (connue && !sujets)) return <Navigate to={connue ? `/exotiques/${espece}` : '/exotiques'} replace />
  if (!connue) return null

  const sources = [...new Set(sujets.map(s => s.source).filter(Boolean))]
  const parSujet = sujets.length > 1
  // Les accordéons : les sujets, ou les sections du sujet unique.
  const elements = parSujet
    ? sujets.map(s => ({ cle: s.nom, titre: s.nom, latin: s.latin, sections: s.sections }))
    : sujets[0].sections.map(sec => ({ cle: sec.titre, titre: sec.titre, lignes: sec.lignes }))

  return (
    <div className="labo-detail-page">
      <p className="exotique-valeurs-intro">
        Valeurs indicatives : toujours se référer aux intervalles de référence de votre laboratoire.
        {sources.length > 0 && <span className="exotique-valeurs-source">Source : {sources.join(' ; ')}</span>}
      </p>

      <div className="exotique-valeurs-liste">
        {elements.map((el, i) => {
          const estOuvert = ouvert === i
          const nb = parSujet ? el.sections.reduce((n, s) => n + s.lignes.length, 0) : el.lignes.length
          const idContenu = `valeurs-${i}`
          return (
            <div key={el.cle} className="labo-tube-card">
              <button
                className={`labo-valeurs-accordeon-header${estOuvert ? ' ouvert' : ''}`}
                aria-expanded={estOuvert}
                aria-controls={idContenu}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <span className="exotique-valeurs-entete">
                  <span className="labo-ref-titre">{el.titre}</span>
                  {el.latin && <span className="exotique-valeurs-latin">{el.latin}</span>}
                </span>
                <span className="exotique-valeurs-compte">{nb} {nb > 1 ? 'valeurs' : 'valeur'}</span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`} aria-hidden="true"></i>
              </button>
              {estOuvert && (
                <div id={idContenu} className="exotique-valeurs-contenu">
                  {parSujet
                    ? el.sections.map(sec => (
                        <section key={sec.titre}>
                          <h3 className="exotique-valeurs-sous-titre">{sec.titre}</h3>
                          <Lignes lignes={sec.lignes} />
                        </section>
                      ))
                    : <Lignes lignes={el.lignes} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Lignes({ lignes }) {
  return lignes.map((l, i) => (
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
  ))
}
