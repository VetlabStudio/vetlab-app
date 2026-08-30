import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-heart',
    titre: 'Colostrum et lait maternel',
    apercu: 'Immunité transmise dans les 72 premières heures',
    type: 'bullets',
    bullets: [
      "Le colostrum transmet l'immunité de la mère au petit. Il doit être donné dans les 24 à 72 premières heures - après ce délai, l'intestin ne peut plus l'absorber.",
      "Le lait maternel est la seule source de nutrition adéquate pour les 4 à 6 premières semaines.",
    ],
  },
  {
    icone: 'ti-droplet',
    titre: 'Lait de remplacement',
    apercu: 'Toutes les 2h la 1re semaine · 4-6 boires/jour ensuite',
    type: 'bullets',
    bullets: [
      "Répartir sur plusieurs petits repas. Première semaine : toutes les 2 heures, jour et nuit. Ensuite : 4 à 6 boires par jour.",
      "Surveiller le gain de poids quotidien pour vérifier que l'alimentation est suffisante.",
      "Les besoins en eau sont élevés chez le nouveau-né - garder en tête en cas de déshydratation.",
    ],
  },
  {
    icone: 'ti-thermometer',
    titre: 'Température et sevrage',
    apercu: '29-32°C sem. 1 · solide dès 3-4 sem · sevrage à 7-8 sem',
    type: 'bullets',
    bullets: [
      "Le nouveau-né ne régule pas bien sa température : maintenir l'environnement chaud et le refroidir progressivement au fil des semaines.",
      "Introduire de la nourriture solide ramollie entre 3 et 4 semaines.",
      "Attendre au moins 7 à 8 semaines avant le sevrage comportemental complet : la tétée a aussi un rôle psychologique important pour le petit.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Babydog Milk (chiot)', img: '/logo-royal-canin.jpg' },
  { nom: 'Royal Canin Babycat Milk (chaton)', img: '/logo-royal-canin.jpg' },
]

export default function NutritionNeonatologie() {
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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Chiot</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Lait 13-18 mL/100g/jour</span>
              <span className="nutri-repere-pilule">Eau 132-220 mL/kg/jour</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chaton</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Gain ~18-20 g/jour',
                'Eau 155-230 mL/kg/jour',
              ].map((p, i) => (
                <span key={i} className="nutri-repere-pilule"
                  style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Température ambiante */}
        <div style={{ marginTop: 10, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: 6 }}>Température ambiante</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="nutri-repere-pilule">29-32°C sem. 1</span>
            <span className="nutri-repere-pilule">26-29°C sem. 2</span>
            <span className="nutri-repere-pilule">~23°C sem. 4</span>
          </div>
        </div>
      </section>

      {/* ── Aliments à proposer ── */}
      <section>
        <div className="nutri-sec-label">Laits de remplacement</div>
        <div className="nutri-sec-titre">Produits à proposer</div>
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
              <div className="nutri-alerte-titre">Jamais de lait de vache ou de chèvre</div>
              <p className="nutri-alerte-texte">
                Cause de la diarrhée chez le chiot et le chaton. Utiliser uniquement un lait de remplacement
                conçu spécifiquement pour l'espèce.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
