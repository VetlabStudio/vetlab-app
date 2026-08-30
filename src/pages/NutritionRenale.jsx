import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-clock',
    titre: 'Quand commencer et comment faire la transition',
    apercu: 'Valeurs confirmées · transition lente · pas en crise',
    type: 'bullets',
    bullets: [
      "Le passage à une nourriture rénale est recommandé une fois que les valeurs sanguines confirment l'insuffisance rénale (créatinine > 2,0 mg/dL ou SDMA élevé), pas seulement sur des symptômes.",
      "Ne jamais introduire la nouvelle nourriture rénale pendant une crise : l'animal risque d'associer cette nourriture à son mal-être et de la refuser définitivement. Attendre qu'il soit stable et qu'il mange bien.",
      "Faire le changement lentement, sur au moins 7 à 14 jours, en mélangeant de plus en plus de nouvelle nourriture à l'ancienne.",
    ],
  },
  {
    icone: 'ti-filter',
    titre: 'Phosphore en priorité',
    apercu: 'Restriction phosphore · protéines qualité · chélateurs si besoin',
    type: 'especes',
    especes: [
      {
        label: 'Chien',
        texte: 'La restriction du phosphore ralentit la progression plus que toute autre intervention. Protéines cible 14-20 % MS - maintenir un apport suffisant pour éviter la fonte musculaire.',
      },
      {
        label: 'Chat',
        texte: 'Protéines cible 28-35 % MS. Ne pas couper trop agressivement : surveiller l\'albumine. Si la restriction alimentaire ne suffit pas à contrôler le phosphore, ajouter un chélateur intestinal.',
      },
    ],
  },
  {
    icone: 'ti-droplet',
    titre: 'Eau et sodium',
    apercu: 'Nourriture humide · eau fraîche · sodium déjà ajusté',
    type: 'bullets',
    bullets: [
      "Privilégier la nourriture humide et s'assurer que l'eau fraîche est toujours accessible : une bonne hydratation aide beaucoup les reins fragilisés.",
      "Une nourriture rénale contient déjà le bon niveau de sodium - pas besoin de le calculer séparément. Sodium cible : chien ≤ 0,3 % MS, chat ≤ 0,4 % MS.",
    ],
  },
  {
    icone: 'ti-fish',
    titre: 'Oméga-3 et appétit',
    apercu: 'EPA + DHA · ralentit progression · stimuler si appétit réduit',
    type: 'bullets',
    bullets: [
      "Un supplément d'oméga-3 (EPA + DHA) peut aider à ralentir la progression de la maladie rénale - cible 0,4-2,5 % MS.",
      "Si l'appétit diminue, réchauffer légèrement la nourriture humide ou ajouter un peu de bouillon faible en sodium peut aider. Éviter l'ail même en petite quantité.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Renal',                          img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet k/d",                               img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets NF Renal Function',         img: '/logo-purina.jpg' },
]

export default function NutritionRenale() {
  const [ouverts, setOuverts]     = useState([])
  const [msOuverte, setMsOuverte] = useState(false)

  const toggleConseil = (i) =>
    setOuverts(o => o.includes(i) ? o.filter(x => x !== i) : [...o, i])

  return (
    <div className="labo-detail-page">

      {/* À conseiller au client */}
      <section>
        <div className="nutri-sec-label">Essentiel</div>
        <div className="nutri-sec-titre">À conseiller au client</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CONSEILS.map((c, i) => (
            <div key={i} className={`nutri-conseil-card${ouverts.includes(i) ? ' ouvert' : ''}`}>
              <button className="nutri-conseil-row" onClick={() => toggleConseil(i)}>
                <div className="nutri-conseil-icone">
                  <i className={`ti ${c.icone}`}></i>
                </div>
                <div className="nutri-conseil-corps">
                  <div className="nutri-conseil-titre">{c.titre}</div>
                  <div className="nutri-conseil-apercu">{c.apercu}</div>
                </div>
                <i className="ti ti-chevron-right nutri-conseil-chevron"></i>
              </button>
              <div className="nutri-conseil-detail">
                {c.type === 'especes' && (
                  <div>
                    {c.especes.map((e, j) => (
                      <div key={j} className="nutri-espece-ligne">
                        <span className="nutri-espece-tag" style={{ color: 'var(--primary)' }}>{e.label}</span>
                        <span className="nutri-espece-arrow">→</span>
                        <span className="nutri-espece-texte">{e.texte}</span>
                      </div>
                    ))}
                  </div>
                )}
                {c.type === 'bullets' && (
                  <div className="nutri-bullet-liste">
                    {c.bullets.map((b, j) => (
                      <div key={j} className="nutri-bullet-item">
                        <div className="nutri-bullet-puce"></div>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repères nutritionnels */}
      <section>
        <div className="nutri-sec-label">Données à retenir</div>
        <div className="nutri-sec-titre">Repères nutritionnels</div>
        <div className="nutri-reperes-grille">
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--primary)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Chien</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Prot. 14-20 % MS</span>
              <span className="nutri-repere-pilule">Phosphore bas</span>
              <span className="nutri-repere-pilule">Sodium ≤ 0,3 % MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chat</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Prot. 28-35 % MS',
                'Phosphore bas',
                'Sodium ≤ 0,4 % MS',
              ].map((p, i) => (
                <span key={i} className="nutri-repere-pilule"
                  style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: 6 }}>Oméga-3 (dose cible)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="nutri-repere-pilule">EPA + DHA 0,4-2,5 % MS</span>
          </div>
        </div>

        <div className={`nutri-ms-expand${msOuverte ? ' ouvert' : ''}`} style={{ marginTop: 10 }}>
          <button className="nutri-ms-btn" onClick={() => setMsOuverte(v => !v)}>
            <i className="ti ti-info-circle" style={{ color: 'var(--text-hint)', fontSize: 15 }}></i>
            Comprendre la matière sèche (MS)
            <i className="ti ti-chevron-down nutri-ms-chevron"></i>
          </button>
          <div className="nutri-ms-detail">
            <p>
              La <strong>matière sèche (MS)</strong> permet de comparer les aliments indépendamment
              de leur teneur en eau. Une conserve contient environ 75-80 % d'eau, une croquette
              environ 10 % - on ne peut pas les comparer directement en pourcentage tel quel.
            </p>
            <div className="nutri-formule">
              <strong>Formule :</strong><br />
              % nutriment (MS) = % nutriment (tel quel) ÷ (1 - % humidité) × 100
            </div>
          </div>
        </div>
      </section>

      {/* Aliments à proposer */}
      <section>
        <div className="nutri-sec-label">Diètes rénales</div>
        <div className="nutri-sec-titre">Aliments à proposer</div>
        <div className="nutri-aliments-liste">
          {ALIMENTS.map((a, i) => (
            <div key={i} className="nutri-aliment-item">
              <img src={a.img} alt="" className="nutri-aliment-logo" />
              <span className="nutri-aliment-nom">{a.nom}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Points de vigilance */}
      <section>
        <div className="nutri-sec-titre">Points de vigilance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="nutri-alerte nutri-alerte--rouge">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: 'var(--accent-red)', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Ne pas introduire la diète rénale en crise</div>
              <p className="nutri-alerte-texte">
                Si l'animal est hospitalisé ou refuse de manger, attendre qu'il soit stable.
                Une aversion alimentaire formée à ce moment peut être permanente.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Chat : surveiller l'albumine</div>
              <p className="nutri-alerte-texte">
                Une restriction protéique trop agressive peut causer de la malnutrition. L'albumine
                est le marqueur à surveiller pour s'assurer que la restriction est bien tolérée.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
