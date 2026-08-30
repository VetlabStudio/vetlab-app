import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-heart-rate-monitor',
    titre: 'Réduire le sodium',
    apercu: 'Sel contrôlé · éviter les extras salés',
    type: 'especes',
    especes: [
      {
        label: 'Chien',
        texte: 'Sodium cible 0,08-0,25 % MS. Éviter charcuterie, fromage, restes de table et gâteries salées : ce sont souvent ces extras qui nuisent le plus.',
      },
      {
        label: 'Chat',
        texte: "Une restriction trop stricte ou trop rapide peut faire perdre l'appétit. Y aller progressivement et surveiller que le chat mange bien. Sodium cible 0,07-0,3 % MS.",
      },
    ],
  },
  {
    icone: 'ti-scale',
    titre: 'Garder le poids et le muscle',
    apercu: 'BCS 4-5/9 · protéines préservées · potassium surveillé',
    type: 'bullets',
    bullets: [
      <>Maintenir un poids santé aide le coeur à moins forcer (<em>Body Condition Score</em> (BCS) cible 4-5/9), mais ne pas restreindre les protéines : la fonte musculaire est un risque important.</>,
      "Si l'animal est sous diurétiques, le vétérinaire surveille souvent le potassium de près - ces médicaments peuvent en faire perdre trop.",
    ],
  },
  {
    icone: 'ti-pill',
    titre: 'Taurine et L-carnitine',
    apercu: 'Vérifier chez les chiens avec cardiomyopathie dilatée',
    type: 'bullets',
    bullets: [
      "Chez un chien avec cardiomyopathie dilatée (surtout s'il mangeait une nourriture sans grains), le vétérinaire vérifie souvent la taurine sanguine : une carence est une cause possible et réversible.",
      "Si une carence en taurine est confirmée, un supplément est ajouté. La L-carnitine peut aussi être considérée dans certains cas spécifiques.",
    ],
  },
  {
    icone: 'ti-fish',
    titre: 'Oméga-3',
    apercu: 'Huile de poisson · réduit inflammation · soutien musculaire',
    type: 'bullets',
    bullets: [
      "Un supplément d'huile de poisson (oméga-3) est souvent recommandé en soutien : aide à réduire l'inflammation et à préserver le muscle cardiaque.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Canine Early Cardiac', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet h/d",                    img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets CC CardioCare',  img: '/logo-purina.jpg' },
]

export default function NutritionCardiaque() {
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
              <span className="nutri-repere-pilule">Sodium 0,08-0,25 % MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chat</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule"
                style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                Sodium 0,07-0,3 % MS
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: 6 }}>Oméga-3 (dose cible)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="nutri-repere-pilule">EPA 40 mg/kg/jour</span>
            <span className="nutri-repere-pilule">DHA 25 mg/kg/jour</span>
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
        <div className="nutri-sec-label">Exemples de diètes adaptées</div>
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
              <div className="nutri-alerte-titre">Éviter tous les extras salés</div>
              <p className="nutri-alerte-texte">
                Charcuterie, fromage, restes de table, gâteries salées - ce sont souvent ces extras
                qui nuisent le plus, pas la nourriture principale.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Nourriture sans grains et cardiomyopathie dilatée</div>
              <p className="nutri-alerte-texte">
                Un lien possible existe entre les diètes sans grains et la cardiomyopathie dilatée
                chez le chien. Vérifier la taurine si le chien mange sans grains depuis longtemps.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
