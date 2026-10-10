import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONDITIONS_PAGES as PAGES } from '../data/textesLegaux'

export default function TermesServices() {
  const [page, setPage] = useState(0)
  const navigate = useNavigate()

  const handleValider = () => {
    if (page < PAGES.length - 1) {
      setPage(p => p + 1)
    } else {
      navigate('/accueil')
    }
  }

  const { fond, animal, sections } = PAGES[page]

  return (
    <div
      className="cgu-page"
      style={{ backgroundImage: `url('${fond}')` }}
    >
      <div className="cgu-contenu">
        <img src="/icone-logo-bleu.svg" alt="" className="cgu-icone" />

        <h1 className="cgu-titre">Conditions d'utilisations</h1>

        <div className="cgu-sections">
          {sections.map((s, i) => (
            <div key={i} className="cgu-section">
              <p className="cgu-section-titre">{s.titre}</p>
              <p className="cgu-section-texte">{s.texte}</p>
            </div>
          ))}
        </div>

        <button className="cgu-btn" onClick={handleValider}>
          Valider
        </button>

        <div className="cgu-dots">
          {PAGES.map((_, i) => (
            <button
              key={i}
              className={`cgu-dot${i === page ? ' actif' : ''}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      </div>

      <div className="cgu-photo">
        <img src={animal} alt="" />
      </div>
    </div>
  )
}
