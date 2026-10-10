import { useState } from 'react'

function FaqItem({ q, a }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <div className="page-info-faq-item" onClick={() => setOuvert(o => !o)}>
      <div className="page-info-faq-question">
        <p>{q}</p>
        <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'}`}></i>
      </div>
      {ouvert && <p className="page-info-faq-reponse">{a}</p>}
    </div>
  )
}

export default function PageInfo({ sections }) {
  return (
    <div className="labo-detail-page">
      {sections.map((section, i) => (
        <div key={i} className="postop-section">
          {section.titre && (
            <div className="postop-section-header">
              <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
                <i className={`ti ${section.icone || 'ti-info-circle'}`}></i>
              </div>
              <h2 className="postop-section-titre">{section.titre}</h2>
            </div>
          )}
          <div className="page-info-contenu">
            {section.paragraphes.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {section.faq && section.faq.map((item, j) => (
              <FaqItem key={j} q={item.q} a={item.a} />
            ))}
            {section.liste && (
              <ul>
                {section.liste.map((item, k) => (
                  <li key={k}>
                    {typeof item === 'object'
                      ? <>{item.texte}{item.texte ? ' ' : ''}<a href={item.href} className="page-info-lien" target="_blank" rel="noreferrer">{item.href}</a></>
                      : item}
                  </li>
                ))}
              </ul>
            )}
            {section.lien && (
              <a href={section.lien.href} className="page-info-lien">{section.lien.label}</a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
