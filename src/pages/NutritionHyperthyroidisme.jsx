import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-activity',
    titre: 'Aliment à iode limité',
    apercu: 'Traitement sans médicament · aucune exception permise',
    type: 'bullets',
    bullets: [
      "Il existe une option de nourriture qui traite l'hyperthyroïdie en limitant l'iode, sans médicament ni chirurgie. Le piège : elle doit être la SEULE chose que le chat mange.",
      "La T4 se normalise généralement en 8 à 12 semaines, et environ 9 chats sur 10 restent bien contrôlés avec cette seule approche.",
      "Si le chat boit de l'eau de puits, utiliser de l'eau distillée pendant le traitement - l'eau de puits peut contenir de l'iode en quantité variable.",
    ],
  },
  {
    icone: 'ti-meat',
    titre: 'Soutien nutritionnel général',
    apercu: 'Protéines · oméga-3 · calories si perte de poids',
    type: 'bullets',
    bullets: [
      "Nourriture riche en protéines de bonne qualité pour limiter la fonte musculaire souvent présente chez ces chats.",
      "Si le chat a beaucoup maigri, une nourriture plus calorique aide à reprendre du poids rapidement.",
      "Les oméga-3 (EPA, DHA) peuvent apporter un soutien supplémentaire pour les reins et le cœur, souvent sollicités par cette maladie.",
    ],
  },
  {
    icone: 'ti-arrows-exchange',
    titre: 'Après le traitement',
    apercu: 'Réévaluer les besoins · surveiller les reins',
    type: 'bullets',
    bullets: [
      "Une fois la thyroïde traitée (médicament, chirurgie ou iode radioactif), les besoins caloriques changent : réévaluer et souvent réduire la quantité pour éviter la prise de poids.",
      "Si une insuffisance rénale se révèle après le traitement (parfois masquée par l'hyperthyroïdie), changer pour une diète rénale.",
    ],
  },
]

const ALIMENTS = [
  { nom: "Hill's Prescription Diet y/d Thyroid Care", img: '/logo-hills.jpg' },
]

export default function NutritionHyperthyroidisme() {
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

      {/* ── Repères ── */}
      <section>
        <div className="nutri-sec-label">Données à retenir</div>
        <div className="nutri-sec-titre">Repères</div>
        <div className="nutri-reperes-grille">
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--primary)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Diète iodée</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Iode ≤ 0,32 ppm MS</span>
              <span className="nutri-repere-pilule">T4 normalisée en 8-12 sem.</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Soutien général</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Protéines élevées',
                'Oméga-3 (EPA, DHA)',
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
        <div className="nutri-sec-label">Diète spécialisée</div>
        <div className="nutri-sec-titre">Aliment à proposer</div>
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
              <div className="nutri-alerte-titre">Diète iodée : aucune exception</div>
              <p className="nutri-alerte-texte">
                Aucune gâterie, aucun médicament aromatisé, aucun supplément contenant des algues.
                Même une petite quantité d'iode en trop peut empêcher le traitement de fonctionner.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Surveiller la fonction rénale après traitement</div>
              <p className="nutri-alerte-texte">
                Une insuffisance rénale peut se révéler après le traitement, car elle était parfois
                masquée par l'hyperthyroïdie. Passer à une diète rénale si nécessaire.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
