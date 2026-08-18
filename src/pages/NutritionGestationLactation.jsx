const SECTIONS = [
  {
    titre: 'Avant la saillie',
    items: [
      {
        avis: "L'animal devrait être dans une bonne forme physique avant la reproduction, ni trop maigre ni trop gras, et à jour pour les vaccins et le vermifuge.",
        tech: 'BCS cible 4-5/9',
      },
      {
        avis: "Un dépistage de la brucellose et de l'herpèsvirus est recommandé chez la chienne avant la saillie, et un dépistage FeLV/FIV chez la chatte.",
      },
      {
        avis: "Si la chienne fait de l'embonpoint, il vaut mieux la faire maigrir avant la saillie plutôt que pendant la gestation. Chez la chatte, éviter la reproduction si elle est trop maigre ou trop grasse.",
        tech: 'Chatte : éviter si BCS <= 3/9 ou > 6/9',
      },
    ],
  },
  {
    titre: 'Gestation - chienne (~63 jours)',
    items: [
      {
        avis: "Dès la 5e semaine de gestation, augmentez peu à peu la portion habituelle. Au moment de la mise bas, la chienne devrait manger environ une fois et demie sa portion d'avant la saillie.",
        tech: '+15 %/semaine dès la semaine 5, jusqu\'à +60 % au total',
      },
      {
        avis: "En fin de gestation, offrez plusieurs petits repas plutôt que 1 ou 2 gros repas : l'utérus laisse moins de place à l'estomac.",
      },
      {
        avis: "Choisissez une nourriture pour chiots/croissance ou \"toutes étapes de vie\" de bonne qualité : elle fournit déjà assez d'énergie et de glucides pour éviter les baisses de sucre, et couvre aussi le calcium et le phosphore sans calcul.",
        tech: 'Min. 23 % MS glucides digestibles - Ca 1-1,7 % MS - P 0,7-1,3 % MS',
        food: {
          examples: ['Royal Canin Starter Mother & Babydog', 'Hill\'s Science Diet Puppy', 'Purina Pro Plan Puppy'],
          why: "Formulées pour la croissance/gestation : plus riches en énergie et en calcium/phosphore déjà bien balancés, donc pas besoin d'ajuster ou de superviser le calcul soi-même.",
        },
      },
      {
        avis: "Ne donnez jamais de supplément de calcium pendant la gestation ou l'allaitement, même en vente libre : ça peut causer une crise de calcium dangereuse (éclampsie) après la mise bas.",
        alerte: true,
      },
    ],
  },
  {
    titre: 'Gestation - chatte (~63 jours)',
    items: [
      {
        avis: "Chez la chatte, contrairement à la chienne, on augmente la portion dès la première semaine de gestation. La laisser manger à volonté est une bonne option.",
      },
      {
        avis: "En fin de gestation, elle mangera environ une fois et demie sa portion habituelle.",
        tech: 'Jusqu\'à +25 à 50 % vs entretien ; BEQ : BEE x1,6 à la saillie -> BEE x2 à la mise bas',
        food: {
          examples: ['Royal Canin Starter Mother & Babydog', 'Hill\'s Science Diet Kitten', 'Purina Pro Plan Kitten'],
          why: 'Mêmes formules croissance que pour la chienne : énergie et minéraux déjà adaptés à la gestation.',
        },
      },
    ],
  },
  {
    titre: 'Lactation - chienne',
    items: [
      {
        avis: "Laissez la chienne manger à volonté ou offrez-lui des repas très fréquents durant l'allaitement : ses besoins explosent, jusqu'à près du double de sa portion habituelle, et encore plus selon le nombre de chiots.",
        tech: 'BEQ environ 1,9 x BEE + 25 % par chiot ; pic entre 3 et 5 semaines postpartum',
      },
      {
        avis: 'Continuez avec une nourriture pour chiots/croissance riche en protéines et en gras : ça couvre les besoins accrus sans supplément.',
        tech: 'Protéines 25-35 % MS ; matières grasses min. 8,5 % MS, idéalement >= 20 % MS pour les portées nombreuses ou les grandes races',
      },
      {
        avis: "Si la diète est une nourriture commerciale complète et de bonne qualité pour la croissance, aucun supplément vitaminique ou minéral n'est nécessaire. Le DHA, important pour le développement du cerveau des chiots, est déjà inclus dans les bonnes formules croissance.",
      },
    ],
  },
  {
    titre: 'Lactation - chatte',
    items: [
      {
        avis: "Laissez la chatte manger à volonté durant l'allaitement : ses besoins peuvent tripler par rapport à l'entretien normal, et augmentent chaque semaine.",
        tech: '1,5 x BEQ semaine 1 -> 2,5-3 x BEQ semaine 4',
      },
      {
        avis: "Une nourriture pour chatons de bonne qualité, riche en protéines animales et en gras, couvre bien ces besoins. Les protéines végétales seules ne suffisent pas : la taurine, essentielle pour le chat, ne vient que de sources animales.",
        tech: 'Protéines min. 30 % MS, matières grasses min. 9 % MS, DHA+EPA min. 0,01 % MS',
      },
      {
        avis: "Le calcium et le phosphore sont aussi déjà bien dosés dans une bonne nourriture pour chatons, pas besoin de les calculer.",
        tech: 'Ca 1,1-1,6 % MS - P 0,8-1,4 % MS',
      },
    ],
  },
  {
    titre: 'Eau et sevrage',
    items: [
      {
        avis: "De l'eau fraîche doit être accessible en tout temps. Si la mère ou les petits boivent peu, offrir de la nourriture humide aide à combler les besoins en eau.",
      },
      {
        avis: "Commencez à introduire de la nourriture solide, ramollie, vers 3 à 4 semaines. Le sevrage complet se fait généralement vers 6 semaines.",
      },
      {
        avis: "Après le sevrage, réduisez progressivement la portion de la mère pour revenir à son poids et à sa portion d'avant la reproduction, généralement en 6 à 8 semaines.",
      },
    ],
  },
]

export default function NutritionGestationLactation() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
        <i className="ti ti-info-circle"></i>
        <span>Conseils concrets à donner à la clientèle en premier ; les repères techniques (matière sèche, ratios) sont indiqués en plus petit pour les cas qui demandent plus de précision. <strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient environ 75-80 % d'eau alors qu'une croquette en contient environ 10 %.</span>
      </div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heart"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <div className="nutrition-tip-list">
            {s.items.map((it, j) => (
              <div key={j} className={`nutrition-tip${it.alerte ? ' nutrition-tip--alerte' : ''}`}>
                <p className="nutrition-tip-advice">{it.avis}</p>
                {it.food && (
                  <div className="nutrition-food-examples">
                    <p className="nutrition-food-examples-label">Exemples à proposer</p>
                    <div className="nutrition-food-chip-row">
                      {it.food.examples.map((f, k) => (
                        <span key={k} className="nutrition-food-chip">{f}</span>
                      ))}
                    </div>
                    <p className="nutrition-food-why">Pourquoi : {it.food.why}</p>
                  </div>
                )}
                {it.tech && (
                  <div className="nutrition-tip-tech">
                    <span className="nutrition-tip-tech-label">Repère :</span>
                    <span>{it.tech}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
