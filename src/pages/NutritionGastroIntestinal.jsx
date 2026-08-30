import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-flame',
    titre: 'Pancréatite',
    apercu: 'Nourrir tôt · faible en gras · petits repas',
    type: 'bullets',
    bullets: [
      "On recommence à nourrir tôt, en petites quantités, avec des antiémétiques si besoin - contrairement à la croyance de mettre l'estomac au repos total.",
      "Choisir une nourriture très digestible et faible en gras, réchauffée légèrement (autour de la température du corps), en petits repas fréquents.",
      "Un supplément d'oméga-3 peut aider comme anti-inflammatoire d'appoint, en discuter avec le vétérinaire traitant.",
    ],
  },
  {
    icone: 'ti-pill',
    titre: 'Insuffisance pancréatique exocrine (IPE)',
    apercu: 'Enzymes à chaque repas · nourriture très digestible',
    type: 'bullets',
    bullets: [
      "Traitement de base : enzymes pancréatiques en poudre ajoutées dans la nourriture juste avant chaque repas, à vie. Sans elles, l'animal n'absorbe pas ses aliments correctement même avec la meilleure diète.",
      "En complément des enzymes, une nourriture très digestible aide à limiter les selles molles et la perte de poids.",
      "Carence en vitamine B12 (cobalamine) fréquente avec cette maladie - le vétérinaire supplémente généralement de façon systématique.",
      "Si l'animal a beaucoup maigri, augmenter temporairement la quantité de nourriture au-delà du calcul habituel le temps de reprendre du poids.",
    ],
  },
  {
    icone: 'ti-dog',
    titre: 'Chien brachycéphale (museau court)',
    apercu: 'Poids santé · petits repas · bol adapté',
    type: 'bullets',
    bullets: [
      <>Maintenir un poids santé est crucial : l'excès de poids aggrave les problèmes respiratoires déjà présents. Cible <em>Body Condition Score</em> (BCS) 4-5/9.</>,
      "Nourriture facile à digérer et faible en gras, en petits repas fréquents pour réduire les épisodes de régurgitation.",
      "Un bol avec rebord incliné (conçu pour museau court) facilite la prise de nourriture et réduit l'ingestion d'air.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Gastrointestinal Low Fat', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet i/d",                         img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets EN Gastrointestinal', img: '/logo-purina.jpg' },
]

export default function NutritionGastroIntestinal() {
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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Pancréatite</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Dig. ≥ 85 % MS</span>
              <span className="nutri-repere-pilule">Gras chien &lt; 15 % MS</span>
              <span className="nutri-repere-pilule">Gras chat &lt; 25 % MS</span>
              <span className="nutri-repere-pilule">Fibres ≤ 5 % MS</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>IPE</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Dig. gras/glucides ≥ 90 % MS',
                'Dig. prot. ≥ 87 % MS',
                'Gras chien 10-15 % MS',
                'Gras chat 15-25 % MS',
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
              <div className="nutri-alerte-titre">Pancréatite : ne pas jeûner l'animal</div>
              <p className="nutri-alerte-texte">
                La mise à jeun prolongée n'est plus recommandée. Reprendre l'alimentation tôt,
                en petites quantités, favorise la guérison.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">IPE : supplémentation en cobalamine</div>
              <p className="nutri-alerte-texte">
                La carence en vitamine B12 est fréquente et souvent sous-estimée - ne pas attendre
                les signes cliniques pour supplémenter.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
