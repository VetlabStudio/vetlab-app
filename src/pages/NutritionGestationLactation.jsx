import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-clipboard-check',
    titre: 'Avant la saillie',
    apercu: 'BCS 4-5/9 · dépistages · vaccins à jour',
    type: 'bullets',
    bullets: [
      <>L'animal devrait être en bonne forme physique (<em>Body Condition Score</em> (BCS) 4-5/9), à jour pour les vaccins et le vermifuge.</>,
      "Chienne : dépistage brucellose et herpèsvirus recommandé. Chatte : dépistage FeLV/FIV.",
      "Faire maigrir la chienne avant la saillie si nécessaire, pas pendant la gestation. Éviter la reproduction chez la chatte si BCS ≤ 3/9 ou > 6/9.",
    ],
  },
  {
    icone: 'ti-trending-up',
    titre: 'Alimentation en gestation',
    apercu: 'Chienne → dès sem. 5 · Chatte → à volonté dès le début',
    type: 'especes',
    especes: [
      {
        label: 'Chienne',
        texte: "Augmenter la portion progressivement dès la 5e semaine (+15%/sem), jusqu'à 1,5x la portion habituelle à la mise bas. En fin de gestation, fractionner en petits repas fréquents.",
      },
      {
        label: 'Chatte',
        texte: "Laisser manger à volonté dès le début de la gestation. Elle mangera environ 1,5x sa portion habituelle en fin de gestation.",
      },
    ],
  },
  {
    icone: 'ti-droplet',
    titre: 'Alimentation en lactation',
    apercu: 'Manger à volonté · besoins très élevés',
    type: 'especes',
    especes: [
      {
        label: 'Chienne',
        texte: "Laisser manger à volonté ou offrir des repas très fréquents. Les besoins peuvent doubler ou plus selon le nombre de chiots. Pic entre 3 et 5 semaines postpartum.",
      },
      {
        label: 'Chatte',
        texte: "Laisser manger à volonté. Les besoins peuvent tripler par rapport à l'entretien et augmentent chaque semaine jusqu'au sevrage.",
      },
    ],
  },
  {
    icone: 'ti-calendar',
    titre: 'Sevrage',
    apercu: 'Solide dès 3-4 sem · complet vers 6 sem',
    type: 'bullets',
    bullets: [
      "Introduire de la nourriture solide ramollie vers 3 à 4 semaines.",
      "Sevrage complet généralement vers 6 semaines.",
      "Après le sevrage, réduire progressivement la portion de la mère pour revenir à son poids d'avant la reproduction en 6 à 8 semaines.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Starter Mother & Babydog', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Science Diet Puppy ou Kitten",   img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Puppy ou Kitten',       img: '/logo-purina.jpg' },
]

export default function NutritionGestationLactation() {
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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Chienne</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Gest. - Glucides ≥ 23% MS</span>
              <span className="nutri-repere-pilule">Gest. - Ca 1-1,7% MS</span>
              <span className="nutri-repere-pilule">Lact. - Prot. 25-35% MS</span>
              <span className="nutri-repere-pilule">Lact. - MG ≥ 20% MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chatte</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Gest. - +25-50% vs entretien',
                'Lact. - Prot. ≥ 30% MS',
                'Lact. - MG ≥ 9% MS',
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
              <div className="nutri-alerte-titre">Jamais de supplément de calcium</div>
              <p className="nutri-alerte-texte">
                Ne jamais supplémenter en calcium pendant la gestation ou l'allaitement, même en vente libre.
                Risque d'éclampsie (crise de calcium) après la mise bas.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Eau fraîche en tout temps</div>
              <p className="nutri-alerte-texte">
                L'hydratation est critique, surtout en lactation. Si la mère ou les petits boivent peu,
                offrir de la nourriture humide pour combler les besoins en eau.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
