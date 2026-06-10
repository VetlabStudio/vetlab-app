const ETAPES = [
  {
    titre: 'Nœud sinusal (ou sino-auriculaire – SA)',
    texte: 'Situé dans l\'oreillette droite; génère l\'influx électrique et initie la contraction des oreillettes.',
  },
  {
    titre: 'Nœud auriculo-ventriculaire (ou nœud AV)',
    texte: 'Situé à la jonction des oreillettes et des ventricules; ralentit l\'influx pour permettre le remplissage ventriculaire.',
  },
  {
    titre: 'Faisceau de His',
    texte: 'Situé dans le septum interventriculaire; transmet l\'influx vers les ventricules.',
  },
  {
    titre: 'Branches droite et gauche du faisceau de His',
    texte: 'Dirigées vers chaque ventricule; conduisent l\'influx à travers le septum.',
  },
  {
    titre: 'Fibres de Purkinje',
    texte: 'Dans le myocarde ventriculaire; déclenchent la contraction coordonnée des ventricules.',
  },
]

export default function ChirurgieECGConduction() {
  return (
    <div className="labo-detail-page">

      <img src="/coeur.png" alt="Système de conduction électrique du cœur" style={{ width: '100%', display: 'block', margin: '0 auto 16px', borderRadius: 'var(--radius-md)' }} />

      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-heart"></i>
          </div>
          <h2 className="postop-section-titre">Conduction cardiaque</h2>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 0, padding: '16px 16px' }}>
          La conduction cardiaque désigne le système électrique interne du cœur, qui contrôle la fréquence et le rythme des contractions. Ce système suit un parcours bien précis, permettant la contraction coordonnée des oreillettes puis des ventricules.
        </p>

        <ol className="postop-liste">
          {ETAPES.map((etape, i) => (
            <li key={i} className="postop-liste-item">
              <span className="postop-num" style={{ background: 'var(--primary)' }}>{i + 1}</span>
              <span className="postop-texte"><strong>{etape.titre}</strong>. {etape.texte}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  )
}
