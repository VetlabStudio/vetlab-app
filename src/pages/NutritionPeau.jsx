import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-sparkles',
    titre: 'Peau et pelage - soutien général',
    apercu: 'Oméga-3 marins · zinc · cuivre',
    type: 'bullets',
    bullets: [
      "Un supplément ou une nourriture riche en oméga-3 marins (huile de poisson, pas de lin) améliore souvent la qualité de la peau et du pelage.",
      "Chez certaines races nordiques, un manque de zinc ou de cuivre peut causer peau épaisse/croûteuse ou pelage terne et décoloré. Une bonne nourriture complète prévient généralement ce problème.",
      "Ne pas supplémenter en vitamine A sans avis vétérinaire : un excès est aussi problématique qu'une carence pour la peau.",
    ],
  },
  {
    icone: 'ti-test-pipe',
    titre: 'Allergie ou intolérance alimentaire suspectée',
    apercu: 'Essai élimination strict · 8-12 sem minimum',
    type: 'bullets',
    bullets: [
      "La seule façon fiable de confirmer une allergie alimentaire est un essai d'élimination strict : une diète à protéine unique nouvelle (jamais mangée avant) ou hydrolysée, pendant 8 à 12 semaines minimum.",
      "Pendant l'essai : aucune gâterie, aucun aliment aromatisé, aucun médicament à saveur ajoutée. La moindre exception peut fausser le résultat.",
      "Après amélioration des symptômes, le vétérinaire confirme le diagnostic en réintroduisant l'ancienne nourriture pour voir si les symptômes reviennent.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Hydrolyzed Protein (HP)', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet z/d",                        img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets HA HypoAllergenic',  img: '/logo-purina.jpg' },
]

export default function NutritionPeau() {
  const [ouverts, setOuverts] = useState([])

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

      {/* ── Repères ── */}
      <section>
        <div className="nutri-sec-label">Données à retenir</div>
        <div className="nutri-sec-titre">Repères</div>
        <div className="nutri-reperes-grille">
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--primary)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Peau / Pelage</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Oméga-3 marins (EPA, DHA)</span>
              <span className="nutri-repere-pilule">Sources marines &gt; sources végétales</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Allergie</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Essai élimination 8-12 sem.',
                'Protéine unique ou hydrolysée',
              ].map((p, i) => (
                <span key={i} className="nutri-repere-pilule"
                  style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                  {p}
                </span>
              ))}
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
              <div className="nutri-alerte-titre">Essai d'élimination : zéro exception</div>
              <p className="nutri-alerte-texte">
                Aucune gâterie, aucun aliment aromatisé, aucun médicament à saveur pendant les 8-12 semaines.
                La moindre exception invalide le test.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Vitamine A : ne pas supplémenter sans avis</div>
              <p className="nutri-alerte-texte">
                Excès et carence causent tous deux des problèmes de peau. Passer par une nourriture
                complète déjà bien dosée plutôt qu'un supplément.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
