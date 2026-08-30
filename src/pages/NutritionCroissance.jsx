import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-bowl',
    titre: 'Portions et repas',
    apercu: 'Mesurés et fractionnés · BCS cible 4-5/9',
    type: 'bullets',
    bullets: [
      <>Un chiot ou chaton mange beaucoup plus qu'un adulte proportionnellement à son poids, mais les repas restent mesurés et fractionnés - ne pas laisser à volonté, même s'il semble toujours avoir faim.</>,
      <>Objectif : corps ferme, côtes faciles à sentir sans être visibles (<em>Body Condition Score</em> (BCS) cible 4-5/9).</>,
    ],
  },
  {
    icone: 'ti-checklist',
    titre: 'Choisir la bonne nourriture',
    apercu: 'Formule croissance adaptée à la taille · déjà équilibrée',
    type: 'especes',
    especes: [
      {
        label: 'Grandes races',
        texte: "Choisir spécifiquement une formule 'grande race' : le calcium et la densité énergétique y sont mieux contrôlés pour ralentir la croissance osseuse et réduire le risque de troubles articulaires.",
      },
      {
        label: 'Petites races et chats',
        texte: "Une formule 'chiot'/'chaton' standard de bonne qualité convient. Ces formules sont déjà équilibrées en protéines, calcium et phosphore - pas besoin de calculer.",
      },
    ],
  },
  {
    icone: 'ti-arrows-exchange',
    titre: 'Transition vers adulte',
    apercu: 'Progressive sur 7 à 10 jours',
    type: 'bullets',
    bullets: [
      "Une fois la taille adulte presque atteinte, passer progressivement à la nourriture adulte sur 7 à 10 jours en mélangeant les deux.",
      "Chez les petites races, préférer des repas plus fréquents pour éviter les baisses de sucre pendant toute la période de croissance.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Mini / Medium / Maxi Puppy (ou Kitten)', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Science Diet Puppy ou Kitten",                 img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Puppy ou Kitten',                    img: '/logo-purina.jpg' },
]

export default function NutritionCroissance() {
  const [ouverts, setOuverts]     = useState([])
  const [msOuverte, setMsOuverte] = useState(false)

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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Général</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Prot. 22-32 % MS</span>
              <span className="nutri-repere-pilule">3,5-4,5 kcal/g MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Grande race</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Ca 0,7-1,2 % MS',
                'P 0,6-1,1 % MS',
              ].map((p, i) => (
                <span key={i} className="nutri-repere-pilule"
                  style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                  {p}
                </span>
              ))}
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

      {/* ── Points de vigilance ── */}
      <section>
        <div className="nutri-sec-titre">Points de vigilance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="nutri-alerte nutri-alerte--rouge">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: 'var(--accent-red)', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Jamais de supplément de calcium chez les grandes races</div>
              <p className="nutri-alerte-texte">
                Supplémenter en calcium un chiot de grande race peut nuire au développement osseux
                plutôt que l'aider. Les formules croissance contiennent déjà les bons ratios.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Éviter tous suppléments sans avis vétérinaire</div>
              <p className="nutri-alerte-texte">
                Calcium, phosphore, vitamines - même les produits vendus en animalerie peuvent
                déséquilibrer la ration d'une formule croissance déjà complète.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
