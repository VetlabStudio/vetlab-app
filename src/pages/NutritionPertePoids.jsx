import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONSEILS = [
  {
    icone: 'ti-scale',
    titre: 'Combien nourrir',
    apercu: 'Calculer sur le poids idéal · peser la portion',
    type: 'bullets',
    bullets: [
      "Utiliser le calculateur de besoin énergétique en entrant le poids idéal (pas le poids actuel). Appliquer le facteur de perte de poids : chien 1,0 × BEE, chat 0,8 × BEE. Diviser par la densité calorique de l'aliment (indiquée sur l'emballage) pour obtenir la portion en grammes.",
      "Toujours peser la nourriture sur une balance de cuisine plutôt qu'avec une tasse à mesurer : une simple tasse peut facilement doubler la portion réelle sans qu'on s'en rende compte.",
    ],
  },
  {
    icone: 'ti-bowl',
    titre: 'Stratégies qui aident vraiment',
    apercu: 'Protéines et fibres élevées · gâteries limitées · repas séparés',
    type: 'bullets',
    bullets: [
      "Une nourriture riche en protéines et en fibres aide à garder le muscle et à calmer la faim pendant la perte de poids, plutôt que de simplement donner moins de la même nourriture.",
      "Les gâteries comptent : elles ne devraient jamais dépasser 10 % de l'apport énergétique total, et il faut réduire la nourriture principale en conséquence.",
      "S'il y a plusieurs animaux dans la maison, les séparer au moment des repas pour éviter qu'un animal mange la portion d'un autre.",
    ],
  },
  {
    icone: 'ti-chart-line',
    titre: 'Suivi du poids',
    apercu: 'Pesée aux 2-4 semaines · ajuster selon les résultats',
    type: 'bullets',
    bullets: [
      "Prévoir une pesée toutes les 2 à 4 semaines pour ajuster la portion selon les résultats réels, plutôt que de garder la même quantité pendant des mois.",
      "Une fois le poids idéal atteint, la portion doit être recalculée et l'animal peut passer à une nourriture d'entretien régulière.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Satiety Support Weight Management', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet Metabolic",                            img: '/logo-hills.jpg' },
  { nom: 'Purina Pro Plan Veterinary Diets OM Obesity Management',        img: '/logo-purina.jpg' },
]

export default function NutritionPertePoids() {
  const [ouverts, setOuverts]     = useState([])
  const [msOuverte, setMsOuverte] = useState(false)
  const navigate                  = useNavigate()

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
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Chien</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">BCS cible 4-5/9</span>
              <span className="nutri-repere-pilule">Facteur 1,0 × BEE</span>
              <span className="nutri-repere-pilule">Protéines élevées</span>
              <span className="nutri-repere-pilule">Gâteries ≤ 10 % kcal</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Chat</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'BCS cible 4-5/9',
                'Facteur 0,8 × BEE',
                'Perte ≤ 2 % poids/sem.',
                'Gâteries ≤ 10 % kcal',
              ].map((p, i) => (
                <span key={i} className="nutri-repere-pilule"
                  style={{ background: 'rgba(112,47,58,0.07)', color: 'var(--accent-red)', borderColor: 'rgba(112,47,58,0.2)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/calculateurs/besoin')}
          style={{
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 12px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <i className="ti ti-calculator" style={{ fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}></i>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Calculateur de besoin énergétique</div>
            <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>Calculer la ration à partir du poids idéal</div>
          </div>
          <i className="ti ti-chevron-right" style={{ fontSize: 14, color: 'var(--text-hint)' }}></i>
        </button>

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
        <div className="nutri-sec-label">Diètes de contrôle du poids</div>
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
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Chat : ne pas restreindre trop rapidement</div>
              <p className="nutri-alerte-texte">
                Une restriction calorique trop rapide chez le chat peut provoquer une lipidose
                hépatique. La perte de poids doit être progressive - idéalement 0,5 à 2 % par semaine.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
