import { useState } from 'react'

const CONSEILS = [
  {
    icone: 'ti-bowl',
    titre: 'Nourriture et gâteries',
    apercu: 'Sceau VOHC · croquettes abrasives · éviter os durs',
    type: 'bullets',
    bullets: [
      "Une nourriture ou des gâteries dentaires avec le sceau VOHC (vohc.org) ont été testées pour vraiment réduire la plaque et le tartre, contrairement à beaucoup de produits qui le prétendent sans preuve.",
      "Éviter les aliments trop mous exclusivement : ils collent davantage aux dents et favorisent l'accumulation de plaque.",
      "Les gâteries dentaires ne devraient pas dépasser 10 % de l'apport total de la journée, même si elles sont bonnes pour les dents.",
    ],
  },
  {
    icone: 'ti-sparkles',
    titre: "Ce qui aide en plus de la nourriture",
    apercu: 'Brossage 2-3x/sem · chlorhexidine en complément',
    type: 'bullets',
    bullets: [
      "Le brossage des dents à la maison reste le geste le plus efficace, même fait 2 à 3 fois par semaine : brosser en angle vers la gencive, pas juste sur le bout des dents.",
      "Un gel ou rinçage à la chlorhexidine peut être utilisé en complément du brossage, sur les conseils du vétérinaire, pour aider à contrôler les bactéries en bouche.",
    ],
  },
]

const ALIMENTS = [
  { nom: 'Royal Canin Veterinary Diet Canine Dental', img: '/logo-royal-canin.jpg' },
  { nom: "Hill's Prescription Diet t/d",              img: '/logo-hills.jpg' },
]

export default function NutritionDentaire() {
  const [ouverts, setOuverts] = useState([])

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

      {/* Repères */}
      <section>
        <div className="nutri-sec-label">Données à retenir</div>
        <div className="nutri-sec-titre">Repères</div>
        <div className="nutri-reperes-grille">
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--primary)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--primary)' }}>Alimentation</span>
            </div>
            <div className="nutri-repere-pilules">
              <span className="nutri-repere-pilule">Sceau VOHC recommandé</span>
              <span className="nutri-repere-pilule">Gâteries ≤ 10 % kcal</span>
            </div>
          </div>
          <div className="nutri-repere-col">
            <div className="nutri-repere-en-tete">
              <div className="nutri-repere-point" style={{ background: 'var(--accent-red)' }}></div>
              <span className="nutri-repere-titre" style={{ color: 'var(--accent-red)' }}>Hygiène</span>
            </div>
            <div className="nutri-repere-pilules">
              {[
                'Brossage 2-3x / semaine',
                'Chlorhexidine si prescrit',
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
              <div className="nutri-alerte-titre">Éviter les os durs et bois de cervidé</div>
              <p className="nutri-alerte-texte">
                Os de bœuf, bois de cervidé, sabots - cause fréquente de dents cassées,
                surtout les prémolaires et molaires. La règle : si ça ne plie pas, ça peut casser une dent.
              </p>
            </div>
          </div>
          <div className="nutri-alerte nutri-alerte--amber">
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#7A500A', flexShrink: 0, marginTop: 1 }}></i>
            <div>
              <div className="nutri-alerte-titre">Méfiance envers les produits sans certification</div>
              <p className="nutri-alerte-texte">
                Beaucoup de produits "dentaires" n'ont pas de preuve d'efficacité. Privilégier ceux
                portant le sceau VOHC (Veterinary Oral Health Council).
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
