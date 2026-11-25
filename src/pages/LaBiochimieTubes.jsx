import { useState } from 'react'
import { t } from '../lib/i18n'

const TUBES = [
  {
    couleur: '#9B59B6',
    nom: t('Tube violet (EDTA)'),
    analyses: [t('Hématologie (NFS, formule)'), t('Frottis sanguin'), t('Test de Coombs'), t('Cytologie de liquides de ponction'), t('PCR sur liquides')],
    notes: t('Anticoagulant EDTA. Inhibiteur de croissance bactérienne — ne pas utiliser pour bactériologie. Chez le chat, préférer le tube CTAD pour éviter l\'agrégation plaquettaire.'),
  },
  {
    couleur: '#E74C3C',
    nom: t('Tube rouge (sec / sérum)'),
    analyses: [t('Biochimie complète (ALT, créatinine, glucose…)'), t('Sérologie'), t('Dosages hormonaux'), t('Électrolytes')],
    notes: t('Sans anticoagulant. Laisser coaguler 15–30 min avant centrifugation. Fournit du sérum.'),
  },
  {
    couleur: '#27AE60',
    nom: t('Tube vert (héparine lithium)'),
    analyses: [t('Biochimie de routine (alternative au tube rouge)'), t('Ionogramme'), t('Analyses nécessitant du plasma rapide')],
    notes: t('Anticoagulant héparine. Fournit du plasma. Résultats plus rapides que le tube sec car pas d\'attente de coagulation.'),
  },
  {
    couleur: '#3498DB',
    nom: t('Tube bleu (citrate)'),
    analyses: [t('Hémostase (TP, TCA)'), t('Dosage des facteurs de coagulation'), t('D-dimères')],
    notes: t('Très sensible aux conditions pré-analytiques. Doit être rempli exactement jusqu\'au trait de jauge. Délai d\'acheminement strict.'),
  },
  {
    couleur: '#95A5A6',
    nom: t('Tube gris (fluorure)'),
    analyses: [t('Glycémie (stabilisation du glucose)'), t('Lactate')],
    notes: t('Anticoagulant + inhibiteur de glycolyse. À utiliser quand le délai entre prélèvement et analyse est long.'),
  },
  {
    couleur: '#2C8C6B',
    nom: t('Tube vert kaki (boraté)'),
    analyses: [t('Cytobactériologie urinaire (ECBU)')],
    notes: t('Dédié aux urines. Stabilise les cellules et bactéries pendant le transport.'),
  },
]

export default function LaBiochimieTubes() {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Choix du tube selon l\'analyse')}</h2>
        <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
          {t('Toujours vérifier les exigences spécifiques de votre laboratoire. L\'ordre de remplissage recommandé : tube bleu → rouge → vert → violet.')}
        </p>
      </div>

      <div className="labo-tubes-liste">
        {TUBES.map((tube, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={i} className="labo-tube-card">
              <button
                className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <div className="labo-tube-couleur" style={{ background: tube.couleur }}></div>
                <span className="labo-tube-nom">{tube.nom}</span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>
              {estOuvert && (
                <>
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
                </>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
