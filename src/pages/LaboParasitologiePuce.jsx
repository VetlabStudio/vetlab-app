import { t } from '../lib/i18n'
const ETAPES = [
  {
    num: 1,
    texte: t('Les puces adultes se nourrissent du sang de l\'hôte (chien ou chat).'),
  },
  {
    num: 2,
    texte: t('La puce femelle pond des œufs.'),
  },
  {
    num: 3,
    texte: t('Les œufs tombent de l\'hôte dans l\'environnement.'),
  },
  {
    num: 4,
    texte: t('Les œufs éclosent dans l\'environnement pour donner naissance à des larves.'),
  },
  {
    num: 5,
    texte: t('Les larves se nourrissent de débris organiques.'),
  },
  {
    num: 6,
    texte: t('Les larves filent des cocons.'),
  },
  {
    num: 7,
    texte: t('Les larves se transforment en pupes dans les cocons.'),
  },
  {
    num: 8,
    texte: t('Les adultes émergent et retournent sur l\'hôte pour se nourrir de sang.'),
  },
]

export default function LaboParasitologiePuce() {
  return (
    <div className="labo-detail-page">

      {/* ─── SCHÉMA ─────────────────────────── */}
      <div className="labo-ref-section">
        <img
          src="https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/cycle%20puce@2x.png"
          alt={t('Cycle de vie de la puce')}
          style={{ width: '100%', borderRadius: 12, display: 'block' }}
        />
      </div>

      {/* ─── ÉTAPES ─────────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Étapes du cycle')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ETAPES.map(e => (
            <div key={e.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {e.num}
              </span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, paddingTop: 4 }}>
                {e.texte}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
