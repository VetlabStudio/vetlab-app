const TUBES = [
  {
    couleur: '#9B59B6',
    nom: 'Tube violet (EDTA)',
    analyses: ['Hématologie (NFS, formule)', 'Frottis sanguin', 'Test de Coombs', 'Cytologie de liquides de ponction', 'PCR sur liquides'],
    notes: 'Anticoagulant EDTA. Inhibiteur de croissance bactérienne — ne pas utiliser pour bactériologie. Chez le chat, préférer le tube CTAD pour éviter l\'agrégation plaquettaire.',
  },
  {
    couleur: '#E74C3C',
    nom: 'Tube rouge (sec / sérum)',
    analyses: ['Biochimie complète (ALT, créatinine, glucose…)', 'Sérologie', 'Dosages hormonaux', 'Électrolytes'],
    notes: 'Sans anticoagulant. Laisser coaguler 15–30 min avant centrifugation. Fournit du sérum.',
  },
  {
    couleur: '#27AE60',
    nom: 'Tube vert (héparine lithium)',
    analyses: ['Biochimie de routine (alternative au tube rouge)', 'Ionogramme', 'Analyses nécessitant du plasma rapide'],
    notes: 'Anticoagulant héparine. Fournit du plasma. Résultats plus rapides que le tube sec car pas d\'attente de coagulation.',
  },
  {
    couleur: '#3498DB',
    nom: 'Tube bleu (citrate)',
    analyses: ['Hémostase (TP, TCA)', 'Dosage des facteurs de coagulation', 'D-dimères'],
    notes: 'Très sensible aux conditions pré-analytiques. Doit être rempli exactement jusqu\'au trait de jauge. Délai d\'acheminement strict.',
  },
  {
    couleur: '#95A5A6',
    nom: 'Tube gris (fluorure)',
    analyses: ['Glycémie (stabilisation du glucose)', 'Lactate'],
    notes: 'Anticoagulant + inhibiteur de glycolyse. À utiliser quand le délai entre prélèvement et analyse est long.',
  },
  {
    couleur: '#2C8C6B',
    nom: 'Tube vert kaki (boraté)',
    analyses: ['Cytobactériologie urinaire (ECBU)'],
    notes: 'Dédié aux urines. Stabilise les cellules et bactéries pendant le transport.',
  },
]

export default function LaBiochimieTubes() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Choix du tube selon l'analyse</h2>
        <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
          Toujours vérifier les exigences spécifiques de ton laboratoire. L'ordre de remplissage recommandé : tube bleu → rouge → vert → violet.
        </p>
      </div>

      <div className="labo-tubes-liste">
        {TUBES.map((tube, i) => (
          <div key={i} className="labo-tube-card">
            <div className="labo-tube-header">
              <div className="labo-tube-couleur" style={{ background: tube.couleur }}></div>
              <span className="labo-tube-nom">{tube.nom}</span>
            </div>
            <div className="labo-tube-analyses">
              {tube.analyses.map((a, j) => (
                <div key={j} className="labo-tube-analyse-item">
                  <span className="labo-materiel-puce" style={{ color: tube.couleur }}>•</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
            {tube.notes && (
              <p className="labo-tube-note">
                <i className="ti ti-info-circle"></i> {tube.notes}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
