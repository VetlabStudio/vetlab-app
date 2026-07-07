import { useState } from 'react'

const CHECKLISTS = [
  {
    id: 'patient',
    label: 'Patient',
    source: 'McCurnin\'s Clinical Textbook for Veterinary Technicians — BOX 2.3',
    sections: [
      {
        titre: 'Dossier médical',
        items: [
          'Confirmer la procédure à effectuer',
          'Recueillir les informations historiques',
          'Confirmer la conformité aux instructions de jeûne',
          'Confirmer que les vaccins et soins préventifs sont à jour',
          'Vérifier les allergies ou réactions médicamenteuses',
          'Noter les problèmes médicaux pertinents et en informer le vétérinaire',
        ],
      },
      {
        titre: 'Communication client',
        items: [
          'Présenter le formulaire de consentement et obtenir la signature',
          'Présenter l\'estimation des frais et obtenir la signature',
          'Compléter les transactions financières',
          'Répondre aux questions du client',
          'Informer le client de la procédure, du résultat attendu et du temps de complétion',
          'Communiquer la date et l\'heure de sortie si connue',
          'Établir un protocole de communication d\'urgence (numéro, disponibilité, horaire)',
        ],
      },
      {
        titre: 'Examen physique',
        items: [
          'Vérifier l\'identité du patient',
          'Peser le patient',
          'Confirmer le sexe et le statut reproducteur',
          'Évaluer le statut hydrique',
          'Prendre les signes vitaux',
          'Effectuer un examen physique (focus cardiovasculaire et pulmonaire)',
          'Déterminer le score de douleur et la classe de statut physique (ASA)',
          'Communiquer au vétérinaire toute anomalie physique pertinente',
          'Noter toute condition pouvant être traitée pendant l\'anesthésie',
        ],
      },
      {
        titre: 'Préparation directe du patient',
        items: [
          'Si hospitalisé, organiser le jeûne préanesthésique',
          'Effectuer les tests diagnostiques et transmettre les résultats anormaux',
          'Administrer les médicaments prescrits',
          'Placer le cathéter IV et administrer les fluides si indiqué',
          'Administrer les médicaments préanesthésiques',
          'Effectuer les préparations nécessaires aux soins postopératoires',
        ],
      },
    ],
  },
  {
    id: 'machine',
    label: 'Équipement',
    items: [
      'Rassembler tout le matériel nécessaire',
      'Si système d\'évacuation actif : allumer le ventilateur ou la pompe à vide',
      'Identifier et peser le patient',
      'Choisir les tubes endotrachéaux de taille appropriée selon le poids',
      'Vérifier l\'intégrité des tubes et gonfler les ballonnets pour détecter les fuites',
      'Si laryngoscope : choisir la lame appropriée et vérifier la lumière',
      'Choisir la machine appropriée (grand vs petit animal) selon le poids',
      'Choisir le circuit respiratoire (avec ou sans réinhalation) selon le poids',
      'Si circuit avec réinhalation : choisir les tubes corrugués et le ballon réservoir selon le poids',
      'Connecter le tuyau d\'entrée du vaporisateur',
      'Connecter le tuyau de gaz frais à la sortie du vaporisateur ou au port commun',
      'Si circuit avec réinhalation : fixer le ballon réservoir et les tubes corrugués',
      'Connecter les tuyaux du système d\'évacuation',
      'Vérifier que tous les cylindres de gaz comprimé sont correctement montés',
      'Allumer l\'oxygène, vérifier les pressions primaire et secondaire, remplacer les réservoirs vides',
      'Fixer les connecteurs DISS aux prises d\'oxygène murales si applicable',
      'Vérifier les débitmètres pour s\'assurer du bon fonctionnement',
      'Vérifier les fuites du circuit basse pression',
      { texte: 'Ouvrir la valve d\'échappement (APL) une fois le test de fuites terminé', avertissement: true },
      'Vérifier la quantité d\'anesthésique dans le vaporisateur — remplir si nécessaire (vaporisateur éteint)',
      'Faire tourner le cadran du vaporisateur pour vérifier la fluidité, puis remettre à « 0 »',
      'Vérifier l\'absorbeur de CO₂ et le changer si nécessaire',
    ],
  },
  {
    id: 'pre-induction',
    label: 'Pré-induction',
    source: 'Association of Veterinary Anaesthetists (AVA) — Anaesthetic Safety Checklist',
    items: [
      'Nom du patient, consentement du propriétaire et procédure confirmés',
      'Cathéter IV en place et perméable',
      'Équipement de voie aérienne disponible et fonctionnel',
      'Ballonnets des tubes endotrachéaux vérifiés',
      'Machine à anesthésie vérifiée aujourd\'hui',
      'Apport en oxygène adéquat pour la procédure prévue',
      'Circuit respiratoire connecté, sans fuite et valve APL ouverte',
      'Personne assignée au monitoring du patient pendant l\'anesthésie',
      'Risques identifiés et communiqués',
      'Interventions d\'urgence disponibles',
    ],
  },
  {
    id: 'pre-procedure',
    label: 'Pré-procédure',
    source: 'Association of Veterinary Anaesthetists (AVA) — Anaesthetic Safety Checklist',
    items: [
      'Nom du patient et procédure confirmés',
      'Profondeur d\'anesthésie appropriée',
      'Préoccupations de sécurité communiquées',
    ],
  },
  {
    id: 'reveil',
    label: 'Réveil',
    source: 'Association of Veterinary Anaesthetists (AVA) — Anaesthetic Safety Checklist',
    items: [
      { texte: 'Préoccupations de sécurité communiquées concernant :', sous: ['Voies aériennes', 'Respiration', 'Circulation (bilan hydrique)', 'Température corporelle', 'Douleur'] },
      'Plan d\'évaluation et d\'intervention confirmé',
      'Plan d\'analgésie confirmé',
      'Personne assignée au monitoring du patient pendant le réveil',
    ],
  },
]

function getAllItemIds(cl) {
  if (cl.sections) {
    return cl.sections.flatMap((s, si) => s.items.map((_, ii) => `${si}-${ii}`))
  }
  return cl.items.map((_, i) => `${i}`)
}

export default function ChirurgieChecklists() {
  const [onglet, setOnglet] = useState(0)
  const [etatChecked, setEtatChecked] = useState({})

  const cl = CHECKLISTS[onglet]
  const checked = etatChecked[cl.id] || new Set()

  const toggle = (id) => {
    setEtatChecked(prev => {
      const cur = new Set(prev[cl.id] || [])
      cur.has(id) ? cur.delete(id) : cur.add(id)
      return { ...prev, [cl.id]: cur }
    })
  }

  const reset = () => setEtatChecked(prev => ({ ...prev, [cl.id]: new Set() }))

  const allIds = getAllItemIds(cl)
  const total = allIds.length
  const done = allIds.filter(id => checked.has(id)).length

  const renderItem = (item, id) => {
    const texte = typeof item === 'string' ? item : item.texte
    const sous = typeof item === 'object' && item.sous ? item.sous : null
    const avertissement = typeof item === 'object' && item.avertissement
    const isChecked = checked.has(id)
    return (
      <div key={id}>
        {avertissement && !isChecked && (
          <div className="checklist-avertissement-badge">
            <i className="ti ti-alert-triangle" /> À ne pas oublier
          </div>
        )}
        <button
          className={`checklist-item${isChecked ? ' checked' : ''}${avertissement && !isChecked ? ' avertissement' : ''}`}
          onClick={() => toggle(id)}
        >
          <span className="checklist-item-checkbox">
            {isChecked && <i className="ti ti-check" />}
          </span>
          <span className="checklist-item-text">{texte}</span>
        </button>
        {sous && (
          <div className="checklist-sous-liste">
            {sous.map((s, si) => (
              <div key={si} className="checklist-sub-item">
                <i className="ti ti-corner-down-right" style={{ fontSize: 11, opacity: 0.5 }} /> {s}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="labo-detail-page">
      <div className="checklist-tabs">
        {CHECKLISTS.map((c, i) => (
          <button
            key={c.id}
            className={`checklist-tab${i === onglet ? ' active' : ''}`}
            onClick={() => setOnglet(i)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="checklist-progress-bar-wrap">
        <div
          className="checklist-progress-bar"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
        />
      </div>
      <div className="checklist-progress-label">
        <span>{done} / {total} complétés</span>
        <button className="checklist-reset-btn" onClick={reset}>Réinitialiser</button>
      </div>

      <div className="checklist-body">
        {cl.sections
          ? cl.sections.map((section, si) => (
              <div key={si}>
                <div className="checklist-section-titre">{section.titre}</div>
                {section.items.map((item, ii) => renderItem(item, `${si}-${ii}`))}
              </div>
            ))
          : cl.items.map((item, i) => renderItem(item, `${i}`))}
      </div>

    </div>
  )
}
