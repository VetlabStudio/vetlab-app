import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-salad',
    titre: 'Alimentation',
    apercu: 'Chien → fibres · Chat → protéines',
    type: 'especes',
    especes: [
      {
        label: 'Chien',
        texte: 'Riche en fibres solubles et insolubles, glucides modérés. Éviter les aliments à index glycémique élevé.',
      },
      {
        label: 'Chat',
        texte: 'Riche en protéines, très pauvre en glucides. Un régime faible en glucides peut induire une rémission diabétique.',
      },
    ],
  },
  {
    icone: 'ti-clock',
    titre: 'Routine',
    apercu: 'Même aliment · même quantité · mêmes heures',
    type: 'bullets',
    bullets: [
      'Toujours le même aliment, la même quantité, aux mêmes heures.',
      "Synchroniser les repas avec l'injection d'insuline, généralement au moment du repas ou juste après.",
      "Éviter les friandises non planifiées; elles perturbent la glycémie postprandiale.",
    ],
  },
  {
    icone: 'ti-scale',
    titre: 'Poids santé',
    apercu: 'Atteindre et maintenir un poids idéal',
    type: 'poids',
    texte: "L'obésité entraîne une résistance à l'insuline. La perte de poids peut améliorer significativement le contrôle glycémique, parfois jusqu'à la rémission chez le chat.",
    chip: <>Cible <em>Body Condition Score</em> (BCS) : 4-5 / 9</>,
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Diabetic',                    img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet w/d",                             img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets DM Diabetes Management', img: '/logo-purina.jpg' },
]

export default function NutritionDiabete() {
  const [ouverts, setOuverts]       = useState([])
  const [msOuverte, setMsOuverte]   = useState(false)
  const [savoirPlus, setSavoirPlus] = useState(false)

  const toggleConseil = (i) =>
    setOuverts(o => o.includes(i) ? o.filter(x => x !== i) : [...o, i])

  return (
    <div className="labo-detail-page">

      {/* ── À conseiller au client ── */}
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
                {c.type === 'poids' && (
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{c.texte}</p>
                    <div className="nutri-target-chip">
                      <i className="ti ti-target" style={{ fontSize: 12 }}></i>
                      {c.chip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Repères nutritionnels ── */}
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
              <span className="nutri-repere-pilule">Glucides ≤ 55 % MS</span>
              <span className="nutri-repere-pilule">Fibres 7-18 % MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chat</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule" style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>Glucides &lt; 20 % MS</span>
            </div>
          </div>
        </div>

        <div className={`nutri-ms-expand${msOuverte ? ' ouvert' : ''}`}>
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

      {/* ── Aliments à proposer ── */}
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

      {/* ── Points importants ── */}
      <section>
        <div className="nutri-sec-titre">Points importants</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="nutri-alerte nutri-alerte--rouge">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: 'var(--accent-red)', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Ne pas changer brusquement l'alimentation</div>
              <p className="nutri-alerte-texte">
                Changer de nourriture du jour au lendemain peut déstabiliser tout l'équilibre glycémique.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Éviter un apport excessif en matières grasses</div>
              <p className="nutri-alerte-texte">
                Matières grasses <span className="nutri-alerte-valeur">&lt; 25 % MS</span> pour
                limiter le risque de pancréatite et de dyslipidémie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── En savoir plus ── */}
      <div className={`nutri-savoir-plus${savoirPlus ? ' ouvert' : ''}`}>
        <button className="nutri-savoir-btn" onClick={() => setSavoirPlus(v => !v)}>
          <i className="ti ti-book-2" style={{ color: 'var(--primary)', fontSize: 18 }}></i>
          En savoir plus sur le diabète et l'alimentation
          <i className="ti ti-chevron-down nutri-savoir-chevron"></i>
        </button>
        <div className="nutri-savoir-corps">
          <p>
            <strong>Physiopathologie :</strong> Le diabète de type 1 (déficit en insuline) prédomine
            chez le chien; le type 2 (résistance à l'insuline) est plus fréquent chez le chat.
            L'alimentation agit directement sur la glycémie postprandiale et la sensibilité à l'insuline.
          </p>
          <p>
            <strong>Rémission chez le chat :</strong> Un régime très faible en glucides (&lt; 20 % MS)
            associé à une insulinothérapie adaptée peut induire une rémission diabétique - objectif
            atteignable dans les 3 à 6 premiers mois de traitement.
          </p>
          <p>
            <strong>Suivi glycémique :</strong> Courbe de glycémie toutes les 1 à 2 semaines lors
            de l'ajustement, puis toutes les 6 à 12 semaines. La fructosamine reflète le contrôle
            des 2-3 dernières semaines et est utile si l'animal est stressé lors des prises de sang.
          </p>
        </div>
      </div>

    </div>
  )
}
