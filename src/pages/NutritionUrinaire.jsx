import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-droplet',
    titre: 'Cystite idiopathique féline',
    apercu: 'Augmenter l\'eau · nourriture humide · réduire le stress',
    type: 'bullets',
    bullets: [
      "Le changement le plus efficace est souvent d'augmenter l'apport en eau : nourriture humide, bouillon faible en sodium, glaçons dans le bol, ou fontaine à eau si le chat préfère l'eau qui bouge.",
      "Une nourriture urinaire thérapeutique aide à réduire la fréquence des épisodes, surtout combinée à plus d'eau.",
      "Le stress est un déclencheur important : réduire les sources de stress (accès aux bacs, conflits avec d'autres chats) fait souvent une vraie différence, en plus de la nourriture.",
    ],
  },
  {
    icone: 'ti-circles',
    titre: 'Calculs de struvite',
    apercu: 'Dissolution possible · confirmer par imagerie · passer en préventif ensuite',
    type: 'bullets',
    bullets: [
      "Ce type de calcul peut se dissoudre avec la bonne nourriture, sans chirurgie. Continuer la même nourriture encore 1 mois après que l'imagerie confirme la disparition du calcul.",
      "Chez le chien, si une infection urinaire est présente en même temps, elle doit être traitée avant ou en même temps que la diète - sinon la dissolution ne fonctionne pas bien.",
      "Une fois le calcul dissous, passer à une nourriture urinaire préventive à long terme plutôt que de continuer la diète de dissolution indéfiniment.",
    ],
  },
  {
    icone: 'ti-circle-x',
    titre: "Calculs d'oxalate de calcium",
    apercu: 'Pas de dissolution possible · chirurgie nécessaire · prévenir récidive',
    type: 'bullets',
    bullets: [
      "Contrairement aux struvites, ce type de calcul ne se dissout pas avec la nourriture : un retrait chirurgical ou par urohydropropulsion est nécessaire.",
      "Après le retrait, une nourriture urinaire humide et une bonne hydratation restent importantes pour réduire le risque de récidive.",
      "L'ajout de sel pour encourager la boisson est parfois utilisé, mais à éviter si l'animal a une maladie rénale ou de l'hypertension - décision revenant au vétérinaire.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Urinary SO', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet c/d",           img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets UR Urinary', img: '/logo-purina.jpg' },
]

export default function NutritionUrinaire() {
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

      {/* Repères nutritionnels */}
      <section>
        <div className="nutri-sec-label">Données à retenir</div>
        <div className="nutri-sec-titre">Repères nutritionnels</div>
        <div className="nutri-reperes-grille">
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--primary)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Struvite</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Dissolution ~1 mois</span>
              <span className="nutri-repere-pilule">Confirmer par imagerie</span>
              <span className="nutri-repere-pilule">Humidité &gt; 60 %</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Oxalate Ca</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Pas de dissolution',
                'Chirurgie requise',
                'Prévenir récidive',
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
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-hint)', marginBottom: 6 }}>Cystite idiopathique féline</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="nutri-repere-pilule">Densité urinaire cible 1,032-1,041</span>
            <span className="nutri-repere-pilule">Humidité aliment &gt; 60 %</span>
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
              <div className="nutri-alerte-titre">Oxalate de calcium : pas de dissolution possible</div>
              <p className="nutri-alerte-texte">
                Ne pas attendre qu'une diète dissolve ce type de calcul - une intervention
                physique est toujours nécessaire. La diète sert uniquement à prévenir la récidive.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Struvite chien : traiter l'infection en même temps</div>
              <p className="nutri-alerte-texte">
                Une infection urinaire concomitante empêche la dissolution. Antibiothérapie
                et diète doivent être démarrées en même temps pour que le traitement soit efficace.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
