/* Radioprotection pour l'équipe qui prend les clichés : les trois
   réflexes (temps, distance, écran), puis les règles pratiques. Basé sur
   le Code de sécurité 28 de Santé Canada ; les exigences de la province
   et de la clinique ont priorité. Offert à tous, pas seulement en Pro :
   c'est de la sécurité au travail. */

const REFLEXES = [
  {
    icone: 'ti-clock',
    titre: 'Temps',
    texte: "Préparez le positionnement et les réglages avant d'exposer. Un cliché raté à reprendre, c'est une dose de plus pour vous et pour l'animal.",
  },
  {
    icone: 'ti-arrows-horizontal',
    titre: 'Distance',
    texte: "Votre meilleure protection. Doubler votre distance avec le tube divise la dose par 4. Si votre présence n'est pas nécessaire, sortez de la salle ou placez-vous derrière le paravent plombé.",
  },
  {
    icone: 'ti-shield',
    titre: 'Écran',
    texte: "Tablier, protège-thyroïde, gants et paravent plombés arrêtent le rayonnement diffusé, celui qui rebondit sur l'animal et la table.",
  },
]

const SECTIONS = [
  {
    titre: 'Avant chaque cliché',
    icone: 'ti-square-check',
    points: [
      'Seules les personnes nécessaires restent dans la salle.',
      'Chaque personne présente porte un tablier et un protège-thyroïde.',
      "Le faisceau est limité à la région à radiographier : le champ lumineux ne dépasse pas la plaque. Moins de surface exposée, c'est moins de rayonnement diffusé et un cliché plus net.",
      'Les mains et le corps de chacun sont hors du champ lumineux.',
      'Vous portez votre dosimètre.',
    ],
  },
  {
    titre: "Tenir l'animal",
    points: [
      'Privilégiez la contention sans les mains : sacs de sable, cales de mousse, gouttières, rubans. Demandez au vétérinaire si une sédation est indiquée.',
      "Si l'animal doit être tenu : tablier, protège-thyroïde et gants plombés, bras tendus pour garder votre corps le plus loin possible du faisceau.",
      "Alternez : ce n'est pas toujours la même personne qui tient les animaux.",
      "Une personne enceinte ne tient pas d'animal pendant une exposition, pas plus qu'un jeune de moins de 18 ans (stagiaire, bénévole). Si vous êtes enceinte, avisez la personne responsable dès que possible pour adapter vos tâches.",
    ],
    avertissement: 'Jamais les mains dans le faisceau, même avec des gants plombés : ils protègent du rayonnement diffusé, pas du faisceau direct.',
  },
  {
    titre: "L'équipement plombé",
    points: [
      "L'équivalent plomb (en mm Pb) est inscrit sur l'étiquette. Le Code de sécurité 28 demande au moins 0,5 mm pour l'équipement de protection en médecine vétérinaire.",
      'Suspendez les tabliers sur un support après usage. Plié ou roulé en boule, le plomb se fissure et protège moins.',
      "Faites-les vérifier régulièrement : une fissure ne se voit pas toujours à l'œil. Un tablier troué ou fissuré est retiré du service.",
      'Des lunettes plombées protègent vos yeux si vous tenez souvent des animaux.',
    ],
  },
  {
    titre: 'Le dosimètre',
    points: [
      "Il mesure la dose que vous recevez. Portez-le à chaque cliché, toujours au même endroit : celui indiqué par votre clinique (sur ou sous le tablier, selon le cas).",
      "Il est personnel : ne le prêtez pas et ne l'échangez pas.",
      "Ne le laissez pas dans la salle de radiologie : il compterait une dose que vous n'avez pas reçue.",
      'Consultez vos résultats. Une hausse inhabituelle signale une habitude à corriger.',
    ],
  },
]

// ti-point-filled n'existe pas dans la version de Tabler chargée par l'app.
function Point({ icone = 'ti-point', children }) {
  return (
    <div className="labo-materiel-item" style={{ alignItems: 'flex-start' }}>
      <i className={`ti ${icone}`} style={{ fontSize: 16, color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}></i>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{children}</span>
    </div>
  )
}

export default function LaRadiologieRadioprotection() {
  return (
    <div className="labo-detail-page">

      <div className="postop-intro">
        <i className="ti ti-shield-check postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Les rayons X ne se voient pas et ne se sentent pas, et les doses reçues s'additionnent au fil de votre carrière.
          Ces règles réduisent la vôtre au minimum. Celles de votre clinique et de la personne responsable de la radioprotection ont toujours priorité.
        </p>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Les trois réflexes</h2>
        <div className="labo-etape-card">
          {REFLEXES.map(r => (
            <div key={r.titre} className="labo-materiel-item" style={{ alignItems: 'flex-start', gap: 12 }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${r.icone}`} style={{ fontSize: 18 }}></i>
              </span>
              <span>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{r.titre}</span>
                <span style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>{r.texte}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {SECTIONS.map(s => (
        <div key={s.titre} className="labo-ref-section">
          <h2 className="labo-ref-titre">{s.titre}</h2>
          {s.avertissement && (
            <div className="avertissement-plage">
              <i className="ti ti-alert-triangle"></i>
              <span>{s.avertissement}</span>
            </div>
          )}
          <div className="labo-etape-card">
            {s.points.map(p => <Point key={p} icone={s.icone}>{p}</Point>)}
          </div>
        </div>
      ))}

      <p className="labo-ref-note" style={{ margin: 0, lineHeight: 1.5 }}>
        Référence : Santé Canada, Code de sécurité 28, Radioprotection en médecine vétérinaire. Les exigences de votre province et de votre clinique ont priorité.
      </p>

    </div>
  )
}
