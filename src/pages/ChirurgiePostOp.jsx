const SECTIONS = [
  {
    id: 'surveillance',
    icone: 'ti-activity',
    couleur: '#254D56',
    titre: 'Surveillance immédiate (0-2 h post-chirurgie)',
    items: [
      'Température, fréquence cardiaque et respiratoire toutes les 15-30 minutes jusqu\'à stabilisation.',
      'Vérifier les muqueuses, temps de remplissage capillaire (TRC) et perfusion périphérique.',
      'Surveiller le niveau de conscience : retour progressif à l\'éveil, réponse aux stimuli, coordination motrice.',
      'Évaluer la douleur à l\'aide d\'une échelle validée (ex. : Glasgow ou Colorado).',
    ],
  },
  {
    id: 'douleur',
    icone: 'ti-pill',
    couleur: '#702F3A',
    titre: 'Contrôle de la douleur',
    items: [
      'Administrer les analgésiques prescrits selon le protocole (AINS, opioïdes, agents adjuvants).',
      'Adapter la médication au comportement de l\'animal et à la nature de l\'intervention.',
      'Prévoir un suivi de la douleur sur 24 à 48 h.',
    ],
  },
  {
    id: 'site',
    icone: 'ti-bandage',
    couleur: '#D7A35C',
    titre: 'Surveillance du site chirurgical',
    items: [
      'Vérifier l\'apparence de la plaie : rougeur, oedème, saignement ou écoulement anormal.',
      'Empêcher l\'animal de lécher ou gratter la plaie (collerette ou habit post-op).',
      'Nettoyer selon les recommandations du vétérinaire si nécessaire.',
      'Noter tout changement local : chaleur, douleur, déhiscence.',
    ],
  },
  {
    id: 'nutrition',
    icone: 'ti-droplet',
    couleur: '#86CAB7',
    titre: 'Nutrition et hydratation',
    items: [
      'Offrir de l\'eau dès que l\'animal est pleinement éveillé (si non contre-indiqué).',
      'Offrir une petite portion de nourriture facilement digestible 6-8 h après l\'intervention.',
      'Surveiller les vomissements, diarrhée ou anorexie.',
      'S\'assurer que l\'animal urine dans les 12-24 heures suivant la chirurgie.',
    ],
  },
  {
    id: 'repos',
    icone: 'ti-moon',
    couleur: '#254D56',
    titre: 'Repos et restriction d\'activité',
    items: [
      'Limiter l\'activité physique pour 7 à 14 jours, selon la chirurgie.',
      'Maintenir l\'animal en cage ou en pièce restreinte, sans sauts ni jeux vigoureux.',
      'Utiliser une laisse courte lors des sorties hygiéniques.',
    ],
  },
  {
    id: 'communication',
    icone: 'ti-phone-call',
    couleur: '#538073',
    titre: 'Communication avec les propriétaires',
    items: [
      'Fournir des instructions écrites claires (médication, signes à surveiller, soins de la plaie).',
      'Planifier un rendez-vous de suivi pour retirer les points (généralement après 10-14 jours) ou évaluer la cicatrisation.',
      'Informer sur les signes d\'alerte : abattement persistant, fièvre, écoulement, halètement anormal, douleur marquée.',
    ],
  },
]

const SIGNES_ALERTE = [
  'Abattement persistant ou détérioration de l\'état général',
  'Fièvre (> 39,5 °C)',
  'Écoulement, saignement ou odeur anormale à la plaie',
  'Vomissements répétés ou anorexie prolongée',
  'Difficulté respiratoire ou halètement anormal',
  'Absence d\'urination dans les 24 heures post-op',
  'Douleur intense malgré la médication',
]

export default function ChirurgiePostOp() {
  return (
    <div className="labo-detail-page">

      {/* ─── INTRO ──────────────────────────────── */}
      <div className="postop-intro">
        <i className="ti ti-heart-rate-monitor postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Protocole de soins à appliquer après toute intervention chirurgicale. Adapter selon les instructions du vétérinaire responsable.
        </p>
      </div>

      {/* ─── SECTIONS ───────────────────────────── */}
      {SECTIONS.map(section => (
        <div key={section.id} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: section.couleur + '18', color: section.couleur }}>
              <i className={`ti ${section.icone}`}></i>
            </div>
            <h2 className="postop-section-titre">{section.titre}</h2>
          </div>
          <ol className="postop-liste">
            {section.items.map((item, i) => (
              <li key={i} className="postop-liste-item">
                <span className="postop-num" style={{ background: section.couleur }}>{i + 1}</span>
                <span className="postop-texte">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* ─── SIGNES D'ALERTE ────────────────────── */}
      <div className="postop-alerte-section">
        <div className="postop-alerte-header">
          <i className="ti ti-alert-triangle"></i>
          <span>Signes d'alerte à signaler immédiatement</span>
        </div>
        <ul className="postop-alerte-liste">
          {SIGNES_ALERTE.map((signe, i) => (
            <li key={i} className="postop-alerte-item">
              <i className="ti ti-point-filled postop-alerte-puce"></i>
              <span>{signe}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── NOTE BAS ───────────────────────────── */}
      <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>Ce guide est un outil de référence. Toujours se fier aux directives spécifiques du vétérinaire traitant.</span>
      </div>

    </div>
  )
}
