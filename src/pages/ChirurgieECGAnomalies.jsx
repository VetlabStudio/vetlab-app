function Texte({ children }) {
  const parts = children.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  )
}

const ANOMALIES = [
  {
    id: 'normal',
    image: '/ecg_ECG-normal.jpg',
    titre: 'ECG normal',
    liste: [
      'Chaque onde P (dépolarisation auriculaire) est suivie d\'un complexe QRS (dépolarisation ventriculaire) puis d\'une onde T (repolarisation).',
      'Les ondes P sont positives, régulières et uniformes, précédant chaque QRS.',
      'L\'intervalle PR est constant et dans les limites normales.',
      'Le rythme est régulier, sauf une variation respiratoire possible chez les jeunes chiens (arythmie sinusale respiratoire bénigne).',
      'L\'onde T peut être positive (en forme de montagne, vers le haut), négative (en forme de creux, vers le bas) ou biphasique (ascendante puis descendante, ou l\'inverse).',
    ],
  },
  {
    id: 'bav1',
    image: '/ecg_Bloc-av-degre-1.jpg',
    titre: 'Bloc AV de premier degré',
    paragraphes: [
      'Trouble de conduction bénin caractérisé par un ralentissement de l\'influx électrique au niveau du nœud auriculo-ventriculaire, sans interruption complète. À l\'ECG, il se manifeste par un **intervalle PR prolongé mais constant**. Généralement asymptomatique et souvent d\'origine vagale ou médicamenteuse (ex. : opioïdes, α2-agonistes), il ne nécessite pas de traitement sauf s\'il est associé à d\'autres anomalies.',
    ],
  },
  {
    id: 'bav2',
    image: '/ecg_bloc-av-degre-2.jpg',
    titre: 'Bloc AV de deuxième degré',
    paragraphes: [
      'Trouble de conduction où certains influx électriques sont bloqués au niveau du nœud auriculo-ventriculaire, ce qui empêche la transmission de toutes les impulsions auriculaires vers les ventricules. À l\'ECG, on observe des **ondes P non suivies de complexes QRS** (perte de conduction intermittente). Il existe deux types :',
    ],
    liste: [
      'Mobitz I (Wenckebach) : allongement progressif de l\'intervalle PR jusqu\'à un QRS manquant.',
      'Mobitz II : intervalle PR constant, mais des QRS manquent soudainement.',
    ],
    paragraphesApres: [
      'Le Mobitz I est souvent bénin et d\'origine vagale, alors que le Mobitz II peut être plus préoccupant et nécessite parfois un traitement si symptomatique (bradycardie, syncope).',
    ],
  },
  {
    id: 'bav3',
    image: '/ecg_bloc-av-degre-3.jpg',
    titre: 'Bloc AV de troisième degré',
    paragraphes: [
      'Trouble de conduction complet dans lequel aucun influx électrique provenant des oreillettes ne parvient aux ventricules. Les oreillettes et les ventricules battent de manière indépendante (dissociation AV). À l\'ECG, on observe des **ondes P régulières non reliées aux complexes QRS**, et ces derniers sont souvent **lents et larges** (rythme d\'échappement ventriculaire).',
      'Ce bloc est pathologique et potentiellement grave, souvent causé par une dégénérescence du système de conduction, une inflammation, une fibrose ou une néoplasie. Il nécessite fréquemment la pose d\'un stimulateur cardiaque (pacemaker).',
    ],
  },
  {
    id: 'bradycardie',
    image: '/ecg_bradycardie.jpg',
    titre: 'Bradycardie sinusale',
    paragraphes: [
      '**Rythme cardiaque lent mais régulier**, d\'origine sinusale normale, avec une onde P suivie d\'un complexe QRS à chaque battement. L\'ECG montre une fréquence inférieure à la normale pour l\'espèce (ex. : < 70 bpm chez le chien adulte au repos). Elle peut être physiologique (chez les animaux bien entraînés ou au repos profond) ou pathologique, causée par une stimulation vagale excessive, une hypothermie, certaines médications (opioïdes, anesthésiques), une hypothyroïdie ou une atteinte du nœud sinusal. Elle est généralement asymptomatique, mais peut nécessiter une prise en charge si elle entraîne une intolérance à l\'effort ou des syncopes.',
    ],
  },
  {
    id: 'tachycardie-sinusale',
    image: '/ecg_tachycardie.jpg',
    titre: 'Tachycardie sinusale',
    paragraphes: [
      '**Rythme cardiaque rapide mais régulier**, initié par le nœud sinusal, avec des ondes P normales suivies de complexes QRS. L\'ECG montre une fréquence supérieure à la normale pour l\'espèce (ex. : > 160 bpm chez le chien adulte au repos, > 240 bpm chez le chat). Elle est souvent physiologique (excitation, douleur, exercice, stress) mais peut aussi refléter une fièvre, une anémie, une hypovolémie, une hypoxie, un état de choc, ou être induite par des médicaments sympathomimétiques.',
      'La tachycardie sinusale est un signe compensatoire, non une arythmie primaire; le traitement vise à corriger la cause sous-jacente.',
    ],
  },
  {
    id: 'tsv',
    image: '/ecg_TSV.jpg',
    titre: 'Tachycardie supraventriculaire (TSV)',
    paragraphes: [
      'Arythmie rapide d\'origine auriculaire ou nodale, avec complexes **QRS normaux (étroits)** et un **rythme souvent > 180 bpm**. Les ondes P peuvent être absentes ou anormales. Souvent liée à une cardiopathie sous-jacente, à l\'hyperthyroïdie (chez le chat) ou à une stimulation sympathique excessive.',
      'Le traitement vise à ralentir la conduction AV (ex. : diltiazem) ou à réduire la fréquence si l\'animal est instable.',
    ],
  },
  {
    id: 'tv',
    image: '/ecg_TV.jpg',
    titre: 'Tachycardie ventriculaire (TV)',
    paragraphes: [
      'Arythmie rapide d\'origine ventriculaire, caractérisée par des complexes **QRS larges et anormaux, sans onde P associée**. Le rythme est régulier, avec une fréquence souvent > 160-180 bpm. Elle peut survenir lors de maladies cardiaques, troubles électrolytiques, hypoxie, sepsis ou trauma thoracique. La TV soutenue est potentiellement grave, car elle peut évoluer vers une fibrillation ventriculaire. Traitement indiqué si l\'animal est symptomatique ou si la fréquence est élevée; la lidocaïne IV est le traitement de première ligne chez le chien.',
    ],
  },
  {
    id: 'alternance',
    image: '/ecg_alternance-electrique.jpg',
    titre: 'Alternance électrique',
    paragraphes: [
      'Anomalie de l\'ECG caractérisée par une **variation régulière de l\'amplitude** ou de la morphologie **des complexes QRS**, d\'un battement à l\'autre, sans changement de rythme sous-jacent. Souvent associée à un épanchement péricardique important, où le cœur oscille dans le liquide, modifiant l\'orientation électrique du QRS à chaque cycle. C\'est un indice électrocardiographique clé pour suspecter un tamponnade cardiaque chez le chien ou le chat.',
    ],
  },
  {
    id: 'esv-polymorphes',
    image: '/ecg_extrasystole-ventriculaire.jpg',
    titre: 'Extrasystoles ventriculaires polymorphes',
    paragraphes: [
      'Arythmie ventriculaire caractérisée par des complexes **QRS prématurés de morphologies différentes**, indiquant des foyers d\'origine multiples dans les ventricules. Le **rythme est irrégulier**, et les **QRS sont larges et variables**. Souvent associée à une irritabilité myocardique sévère, une hypoxie, des déséquilibres électrolytiques ou une maladie cardiaque. Cette forme est plus préoccupante que les ESV monomorphes, car elle augmente le risque de tachycardie ou fibrillation ventriculaire.',
    ],
  },
  {
    id: 'idioventriculaire',
    image: '/ecg_rythme-idioventriculaire.jpg',
    titre: 'Rythme idioventriculaire',
    paragraphes: [
      'Rythme d\'origine ventriculaire lente, avec complexes **QRS larges et réguliers, sans onde P associée** ou avec dissociation auriculo-ventriculaire. Fréquence inférieure à celle du rythme sinusal (< 100 bpm chez le chien). Souvent observé chez des animaux systémiquement malades (GDV, trauma, pancréatite, sepsis), mais peut aussi apparaître sous anesthésie ou après un ralentissement marqué du nœud sinusal. Habituellement bien toléré et transitoire, il ne nécessite un traitement que si des signes cliniques sont présents.',
    ],
  },
  {
    id: 'bbg',
    image: '/ecg_bloc-branche-gauche.jpg',
    titre: 'Bloc de branche gauche',
    paragraphes: [
      'Trouble de conduction intraventriculaire causé par un retard ou un blocage dans la branche gauche du faisceau de His, ce qui entraîne une **dépolarisation ventriculaire gauche** anormalement lente. À l\'ECG, les **complexes QRS sont larges**, souvent > 0,08 s chez le chien, avec une **morphologie modifiée**, typiquement sans **onde P anormale**. Le bloc de branche gauche est généralement associé à une maladie cardiaque structurelle, comme une cardiomyopathie ou une myocardite, mais peut aussi être isolé. Il ne cause pas nécessairement une arythmie, mais peut affecter la synchronisation de la contraction ventriculaire.',
    ],
  },
  {
    id: 'bbd',
    image: '/ecg_bloc-branche-droite.jpg',
    titre: 'Bloc de branche droite',
    paragraphes: [
      'Trouble de conduction intraventriculaire causé par un retard ou un blocage de la branche droite du faisceau de His, entraînant une **dépolarisation retardée du ventricule droit**. À l\'ECG, **les complexes QRS sont larges**, souvent > 0,08 s chez le chien, avec une morphologie spécifique **sans modification des ondes P**. Le bloc de branche droit peut être incidental, mais peut aussi refléter une hypertrophie du ventricule droit, une cardiopathie congénitale ou un traumatisme thoracique. Isolé, il est souvent asymptomatique et ne nécessite pas de traitement, sauf si une cause sous-jacente est identifiée.',
    ],
  },
  {
    id: 'fibrillation-auriculaire',
    image: '/ecg_fibrillation-auriculaire.jpg',
    titre: 'Fibrillation auriculaire',
    paragraphes: [
      'Arythmie supraventriculaire irrégulière et rapide, causée par une dépolarisation anarchique des oreillettes sans contraction coordonnée. À l\'ECG, on observe une **absence d\'ondes P**, remplacées par des **fibrillations fines (ondes f)**, avec un **rythme ventriculaire irrégulier (intervalle R à R)**. Fréquente chez les chiens de grande race atteints de dilatation atriale gauche (ex. cardiomyopathie dilatée, maladie valvulaire mitrale avancée). Rare chez le chat. Peut réduire le remplissage ventriculaire et le débit cardiaque. Le traitement vise à ralentir la fréquence ventriculaire (ex. : diltiazem, digoxine) ou à restaurer le rythme sinusal si possible.',
    ],
  },
  {
    id: 'hyperkaliemie',
    image: '/ecg_hyperkaliemie.jpg',
    titre: 'Hyperkaliémie',
    paragraphes: [
      'Trouble électrolytique caractérisé par une augmentation du taux de potassium sanguin, pouvant entraîner des modifications graves de la conduction cardiaque. À l\'ECG, on observe typiquement des **ondes T pointues et symétriques**, un **élargissement progressif des complexes QRS**, un **aplatissement des ondes P**, voire une asystolie en cas sévère. Causes fréquentes : obstruction urinaire, rupture vésicale, insuffisance rénale, acidose métabolique, hypoadrénocorticisme (Addison). L\'hyperkaliémie est une urgence médicale nécessitant une prise en charge pour stabiliser la membrane cardiaque (calcium IV) et abaisser la kaliémie (fluides, insuline-dextrose, bicarbonate).',
    ],
  },
]

export default function ChirurgieECGAnomalies() {
  return (
    <div className="labo-detail-page">

      <div className="postop-intro">
        <i className="ti ti-alert-triangle postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Aperçu des anomalies les plus fréquemment rencontrées en pratique. Toute arythmie significative doit être confirmée et interprétée par le vétérinaire responsable.
        </p>
      </div>

      {ANOMALIES.map(a => (
        <div key={a.id} className="postop-section">
          <img src={a.image} alt={a.titre} style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)', marginBottom: 12, marginTop: 12 }} />

          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heartbeat"></i>
            </div>
            <h2 className="postop-section-titre">{a.titre}</h2>
          </div>

          {a.paragraphes?.map((texte, i) => (
                        <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '0 16px', marginTop: i === 0 ? 12 : 0, marginBottom: 12 }}>
              <Texte>{texte}</Texte>
            </p>
          ))}

          {a.liste && (
            <ul className="postop-alerte-liste">
              {a.liste.map((item, i) => (
                <li key={i} className="postop-alerte-item">
                  <i className="ti ti-point-filled postop-alerte-puce"></i>
                  <span><Texte>{item}</Texte></span>
                </li>
              ))}
            </ul>
          )}

                    {a.paragraphesApres?.map((texte, i, arr) => (
            <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '0 16px', marginTop: 12, marginBottom: i === arr.length - 1 ? 12 : 0 }}>
              <Texte>{texte}</Texte>
            </p>
          ))}
        </div>
      ))}

      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>Ce guide est un outil de référence. Toute anomalie suspectée doit être confirmée par le vétérinaire responsable, idéalement avec un tracé prolongé.</span>
      </div>

    </div>
  )
}
