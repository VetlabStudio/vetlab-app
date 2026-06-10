const ETAPES = [
  {
    id: 'frequence',
    icone: 'ti-heartbeat',
    couleur: '#254D56',
    titre: '1. Fréquence cardiaque',
    items: [
      'Compter le nombre de complexes QRS sur une bande de 6 secondes et multiplier par 10 pour obtenir les battements par minute (bpm).',
      'Chien : normale entre 60 et 160 bpm (jusqu\'à 180 bpm chez les races de petite taille ou les chiots).',
      'Chat : normale entre 140 et 220 bpm.',
      'Une fréquence trop basse (bradycardie) ou trop élevée (tachycardie) doit être corrélée à l\'état clinique de l\'animal.',
    ],
  },
  {
    id: 'rythme',
    icone: 'ti-wave-sine',
    couleur: '#702F3A',
    titre: '2. Rythme',
    items: [
      'Vérifier la régularité des intervalles R-R (distance entre deux complexes QRS).',
      'Un rythme sinusal normal est régulier, avec une onde P précédant chaque complexe QRS.',
      'L\'arythmie sinusale respiratoire (variation du rythme avec la respiration) est normale chez le chien, surtout les races à tonus vagal élevé.',
    ],
  },
  {
    id: 'onde-p',
    icone: 'ti-activity',
    couleur: '#D7A35C',
    titre: '3. Onde P (dépolarisation auriculaire)',
    items: [
      'Doit être présente avant chaque complexe QRS, de forme arrondie et positive en dérivation II.',
      'Durée normale : ≤ 0,04 s (chien), ≤ 0,035 s (chat).',
      'Amplitude normale : ≤ 0,4 mV.',
      'Une onde P absente, élargie ou de forme anormale peut indiquer une dilatation auriculaire ou un trouble du rythme.',
    ],
  },
  {
    id: 'qrs',
    icone: 'ti-bolt',
    couleur: '#86CAB7',
    titre: '4. Complexe QRS (dépolarisation ventriculaire)',
    items: [
      'Doit être étroit et suivre chaque onde P à intervalle constant.',
      'Durée normale : ≤ 0,05-0,06 s (chien), ≤ 0,04 s (chat).',
      'Amplitude de l\'onde R : reflet de la masse ventriculaire — une onde R trop haute peut suggérer une hypertrophie ventriculaire gauche.',
      'Un complexe QRS élargi suggère une origine ventriculaire (ectopique) ou un trouble de la conduction intraventriculaire.',
    ],
  },
  {
    id: 'onde-t',
    icone: 'ti-chart-line',
    couleur: '#538073',
    titre: '5. Onde T (repolarisation ventriculaire)',
    items: [
      'Peut être positive, négative ou biphasique chez l\'animal normal — sa forme varie davantage que chez l\'humain.',
      'Une onde T très ample ou de forme inhabituelle peut accompagner des troubles électrolytiques (ex. : hyperkaliémie) ou une hypoxie myocardique.',
    ],
  },
  {
    id: 'intervalles',
    icone: 'ti-ruler-2',
    couleur: '#254D56',
    titre: '6. Intervalles PR et QT',
    items: [
      'Intervalle PR (début de l\'onde P à début du QRS) : reflète la conduction auriculo-ventriculaire. Normal : 0,06-0,13 s chez le chien, 0,05-0,09 s chez le chat.',
      'Un PR allongé suggère un bloc AV du premier degré ou plus.',
      'Intervalle QT (début du QRS à fin de l\'onde T) : varie avec la fréquence cardiaque; reflète la durée totale de la dépolarisation et repolarisation ventriculaire.',
      'Un QT anormalement long ou court peut être associé à des déséquilibres électrolytiques ou à certains médicaments.',
    ],
  },
]

export default function ChirurgieECGInterpretation() {
  return (
    <div className="labo-detail-page">

      <div className="postop-intro">
        <i className="ti ti-stethoscope postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Approche systématique pour la lecture d'un tracé ECG : analyser la fréquence, le rythme, puis chaque onde et intervalle dans l'ordre.
        </p>
      </div>

      {ETAPES.map(etape => (
        <div key={etape.id} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: etape.couleur + '18', color: etape.couleur }}>
              <i className={`ti ${etape.icone}`}></i>
            </div>
            <h2 className="postop-section-titre">{etape.titre}</h2>
          </div>
          <ul className="postop-alerte-liste">
            {etape.items.map((item, i) => (
              <li key={i} className="postop-alerte-item">
                <i className="ti ti-point-filled postop-alerte-puce"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>Les valeurs présentées sont des repères généraux. Toute anomalie significative doit être interprétée par le vétérinaire responsable, idéalement avec une dérivation II de référence.</span>
      </div>

    </div>
  )
}
