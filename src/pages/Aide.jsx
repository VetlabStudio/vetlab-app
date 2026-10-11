import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SECTIONS_AIDE } from '../data/centreAide'

// Recherche sans tenir compte des accents ni des majuscules.
const normaliser = (t) => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function texteFiche(f) {
  return normaliser([f.titre, f.texte, ...(f.etapes || [])].join(' '))
}

function Etiquette({ fiche }) {
  if (fiche.equipe) return <span className="aide-etiquette equipe">Équipe</span>
  if (fiche.pro) return <span className="aide-etiquette pro">Pro</span>
  return null
}

function Fiche({ fiche, ouverte, onBasculer }) {
  const navigate = useNavigate()
  return (
    <div className={`aide-fiche${ouverte ? ' ouverte' : ''}`}>
      <button className="aide-fiche-titre" onClick={onBasculer} aria-expanded={ouverte}>
        <span>{fiche.titre}</span>
        <Etiquette fiche={fiche} />
        <i className={`ti ti-chevron-${ouverte ? 'up' : 'down'}`} aria-hidden="true"></i>
      </button>
      {ouverte && (
        <div className="aide-fiche-corps">
          {fiche.texte && <p>{fiche.texte}</p>}
          {fiche.etapes && (
            <ol>
              {fiche.etapes.map((e, i) => <li key={i}>{e}</li>)}
            </ol>
          )}
          {fiche.lien && (
            <button className="aide-fiche-lien" onClick={() => navigate(fiche.lien.route)}>
              {fiche.lien.label}
              <i className="ti ti-arrow-right" aria-hidden="true"></i>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Aide() {
  const [recherche, setRecherche] = useState('')
  const [ouverte, setOuverte] = useState(null)
  const [sectionOuverte, setSectionOuverte] = useState('null')

  const resultats = useMemo(() => {
    const q = normaliser(recherche.trim())
    if (!q) return null
    const mots = q.split(/\s+/)
    return SECTIONS_AIDE
      .map(s => ({ ...s, fiches: s.fiches.filter(f => mots.every(m => texteFiche(f).includes(m))) }))
      .filter(s => s.fiches.length > 0)
  }, [recherche])

  const basculer = (cle) => setOuverte(o => (o === cle ? null : cle))

  return (
    <div className="aide-page">
      <div className="recherche-wrapper aide-recherche">
        <i className="ti ti-search recherche-icone" aria-hidden="true"></i>
        <input
          type="text"
          className="recherche-input"
          placeholder="Rechercher : favoris, inviter, se désabonner..."
          aria-label="Rechercher dans l'aide"
          value={recherche}
          onChange={e => { setRecherche(e.target.value); setOuverte(null) }}
        />
        {recherche && (
          <button className="recherche-clear" onClick={() => setRecherche('')} aria-label="Effacer la recherche">
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {resultats ? (
        resultats.length === 0 ? (
          <p className="aide-vide">
            Aucun résultat pour « {recherche.trim()} ». Essayez un autre mot, ou écrivez-nous.
          </p>
        ) : (
          resultats.map(section => (
            <section key={section.id} className="aide-section">
              <h2 className="aide-resultats-titre">{section.titre}</h2>
              <div className="aide-fiches">
                {section.fiches.map(f => {
                  const cle = `${section.id}:${f.titre}`
                  return <Fiche key={cle} fiche={f} ouverte={ouverte === cle} onBasculer={() => basculer(cle)} />
                })}
              </div>
            </section>
          ))
        )
      ) : (
        SECTIONS_AIDE.map(section => {
          const deroulee = sectionOuverte === section.id
          return (
            <section key={section.id} className="aide-section">
              <button
                className="aide-section-entete"
                onClick={() => setSectionOuverte(deroulee ? null : section.id)}
                aria-expanded={deroulee}
              >
                <span className="aide-section-icone"><i className={`ti ${section.icone}`} aria-hidden="true"></i></span>
                <span className="aide-section-titre">{section.titre}</span>
                <span className="aide-section-compte">{section.fiches.length}</span>
                <i className={`ti ti-chevron-${deroulee ? 'up' : 'down'}`} aria-hidden="true"></i>
              </button>
              {deroulee && (
                <div className="aide-fiches">
                  {section.fiches.map(f => {
                    const cle = `${section.id}:${f.titre}`
                    return <Fiche key={cle} fiche={f} ouverte={ouverte === cle} onBasculer={() => basculer(cle)} />
                  })}
                </div>
              )}
            </section>
          )
        })
      )}

      <section className="aide-contact">
        <h2>Une question, une erreur, une idée ?</h2>
        <p>Écrivez-nous, nous répondons généralement en 2 à 3 jours ouvrables.</p>
        <a href="mailto:info@vetlabstudio.ca" className="aide-contact-lien">info@vetlabstudio.ca</a>
      </section>
    </div>
  )
}
