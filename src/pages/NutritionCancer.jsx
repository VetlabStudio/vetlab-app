import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-cell',
    titre: 'Composition de la diète',
    apercu: 'Gras élevé · glucides réduits · protéines préservées',
    type: 'bullets',
    bullets: [
      "Contrairement aux recommandations générales, une diète plus riche en gras et plus pauvre en glucides est souvent mieux tolérée : les cellules cancéreuses utilisent surtout le sucre comme carburant.",
      "Maintenir des protéines de bonne qualité en quantité suffisante pour éviter la fonte musculaire, très fréquente pendant un traitement contre le cancer.",
      "Si l'animal mange encore des glucides, privilégier des sources à absorption plus lente (orge, sorgho, maïs) plutôt que le riz blanc.",
    ],
  },
  {
    icone: 'ti-fish',
    titre: 'Oméga-3 - un supplément à prioriser',
    apercu: 'EPA + DHA · préserve la masse musculaire',
    type: 'bullets',
    bullets: [
      "Un supplément d'huile de poisson (oméga-3) est l'un des ajouts les plus utiles pendant un traitement contre le cancer : aide à préserver la masse musculaire et à réduire l'inflammation.",
    ],
  },
  {
    icone: 'ti-bowl',
    titre: "Stimuler l'appétit",
    apercu: 'Nourriture réchauffée · petits repas fréquents',
    type: 'bullets',
    bullets: [
      "Réchauffer légèrement la nourriture humide et la rendre plus odorante aide à stimuler l'appétit d'un animal nauséeux. Offrir de petites quantités souvent plutôt que deux gros repas.",
      "Si l'animal refuse de manger depuis plus d'un à deux jours, ne pas attendre : le vétérinaire peut proposer une nourriture de récupération très calorique ou une sonde d'alimentation temporaire.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Recovery',                  img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet ONC Care",                     img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets CN Convalescence',     img: '/logo-purina.jpg' },
]

export default function NutritionCancer() {
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
                <div className="nutri-bullet-liste">
                  {c.bullets.map((b, j) => (
                    <div key={j} className="nutri-bullet-item">
                      <div className="nutri-bullet-puce"></div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Macronutriments</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Gras 50-60 % des kcal</span>
              <span className="nutri-repere-pilule">Prot. 30-50 % des kcal</span>
              <span className="nutri-repere-pilule">Prot. chien 30-45 % MS</span>
              <span className="nutri-repere-pilule">Prot. chat 40-50 % MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Oméga-3</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'EPA 40 mg/kg/jour',
                'DHA 25 mg/kg/jour',
                '~1 capsule / 10 lb',
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
        <div className="nutri-sec-label">Diètes de récupération</div>
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
              <div className="nutri-alerte-titre">Ne jamais cacher un médicament dans la nourriture habituelle</div>
              <p className="nutri-alerte-texte">
                L'animal risque de développer une aversion durable envers sa nourriture s'il associe
                le goût du médicament à cet aliment - même une fois le traitement terminé.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Anorexie prolongée : ne pas attendre</div>
              <p className="nutri-alerte-texte">
                Si l'animal refuse de manger depuis plus d'un à deux jours malgré les ajustements,
                consulter rapidement - sonde d'alimentation ou nourriture de récupération à envisager.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
