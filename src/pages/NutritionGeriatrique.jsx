import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-meat',
    titre: 'Protéines : ne pas restreindre',
    apercu: 'Maintenir la qualité, pas réduire la quantité',
    type: 'especes',
    especes: [
      {
        label: 'Chien',
        texte: "Un chien senior en santé n'a pas besoin de moins de protéines. Mieux vaut privilégier une nourriture de meilleure qualité plutôt qu'en réduire la quantité.",
      },
      {
        label: 'Chat',
        texte: "Les besoins en protéines restent élevés toute la vie du chat. Ne pas restreindre chez un chat senior en bonne santé.",
      },
    ],
  },
  {
    icone: 'ti-seeding',
    titre: 'Antioxydants et oméga-3',
    apercu: 'Déjà inclus dans les bons aliments seniors',
    type: 'bullets',
    bullets: [
      "Les bons aliments seniors contiennent déjà des antioxydants (vitamines E, C) qui aident à ralentir le vieillissement général.",
      "Les oméga-3 (DHA, EPA) sont inclus dans les formules seniors adaptées - inutile de supplémenter si l'aliment est complet et de qualité.",
    ],
  },
  {
    icone: 'ti-droplet',
    titre: 'Hydratation',
    apercu: 'Particulièrement importante chez le chat âgé',
    type: 'bullets',
    bullets: [
      "Privilégier la nourriture humide chez le chat âgé pour assurer un apport hydrique suffisant.",
      "S'assurer que l'animal a toujours accès à de l'eau fraîche; l'hydratation devient plus fragile avec l'âge.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin gamme Senior/Mature adaptée à la taille', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Science Diet Senior/Mature",                    img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Senior',                               img: '/logo-purina.jpg' },
]

const ADAPTATIONS = [
  "Bol surélevé et croquettes plus faciles à mâcher (ou nourriture humide) si l'animal a de la difficulté à se déplacer ou à mâcher.",
  "Fractionner les repas en plus petites portions en cas de perte d'appétit ou de digestion plus difficile.",
]

export default function NutritionGeriatrique() {
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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Chien</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Prot. 15-23 % MS</span>
              <span className="nutri-repere-pilule">MG 7-15 % MS</span>
              <span className="nutri-repere-pilule">Fibres ≥ 2 % MS</span>
              <span className="nutri-repere-pilule">3,0-4,0 kcal/g MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chat</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Prot. 30-45 % MS',
                'MG 10-25 % MS',
                '3,5-4,5 kcal/g MS',
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
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Maladie rénale concomitante</div>
              <p className="nutri-alerte-texte">
                Si l'animal a aussi une maladie rénale, les besoins en protéines changent.
                Se référer à la section nutrition rénale plutôt qu'à ces recommandations générales.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Hydratation sous diurétiques ou insuffisance rénale</div>
              <p className="nutri-alerte-texte">
                Surveiller l'hydratation de plus près chez un animal sous diurétiques
                ou présentant une atteinte rénale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Adaptations pratiques ── */}
      <section>
        <div className="nutri-sec-titre">Adaptations pratiques</div>
        <div className="postop-section">
          <div className="nutri-bullet-liste" style={{ padding: '12px 14px' }}>
            {ADAPTATIONS.map((a, i) => (
              <div key={i} className="nutri-bullet-item">
                <div className="nutri-bullet-puce"></div>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
