import { t } from '../lib/i18n'
const ETAPES = [
  {
    num: 1,
    texte: t('Les proglottis gravides sont éliminés entiers dans les selles ou sortent du périnée des hôtes (chien, chat ou humain).'),
  },
  {
    num: 2,
    texte: t('Ces proglottis se désintègrent et libèrent des paquets d\'œufs contenant des oncosphères.'),
  },
  {
    num: 3,
    texte: t('Les larves de puces (hôtes intermédiaires) ingèrent les paquets d\'œufs. Les oncosphères éclosent à l\'intérieur et se développent en cysticercoïdes.'),
  },
  {
    num: 4,
    texte: t('Les larves de puces deviennent des puces adultes, qui continuent d\'héberger les cysticercoïdes infectieux.'),
  },
  {
    num: 5,
    texte: t('L\'hôte définitif (chien ou chat) est infecté en ingérant une puce contenant un cysticercoïde lors du toilettage.'),
  },
  {
    num: 6,
    texte: t('Les chiens et chats porteurs peuvent également transmettre les puces infectieuses à l\'humain, qui devient un hôte accidentel.'),
  },
  {
    num: 7,
    texte: t('Le parasite devient adulte dans l\'intestin grêle et s\'y fixe grâce à son scolex (tête munie de crochets).'),
  },
]

export default function LaboParasitologieDipylidium() {
  return (
    <div className="labo-detail-page">

      {/* ─── SCHÉMA ─────────────────────────── */}
      <div className="labo-ref-section">
        <img
          src="https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/cycle%20dipilydium@2x.png"
          alt={t('Cycle de vie de Dipylidium caninum')}
          style={{ width: '100%', borderRadius: 12, display: 'block' }}
        />
      </div>

      {/* ─── ÉTAPES ─────────────────────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Étapes du cycle de vie')}</h2>
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
