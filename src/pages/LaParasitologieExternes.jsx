import { t } from '../lib/i18n'
const PARASITES = [
  {
    nom: t('Sarcoptes scabiei'),
    type: t('Acarien'),
    especes: t('Chien (zoonose possible)'),
    detection: t('Grattage cutané profond (jusqu\'au saignement)'),
    morphologie: t('Acarien rond, pattes courtes avec ventouses. Œufs ovales dans les galeries cutanées.'),
    signes: t('Prurit intense, lésions croûteuses aux coudes, oreilles, ventre. Contagieux.'),
    photo: null,
  },
  {
    nom: t('Demodex canis'),
    type: t('Acarien'),
    especes: t('Chien'),
    detection: t('Grattage profond ou biopsie cutanée'),
    morphologie: t('Acarien allongé en forme de cigare, 8 pattes. Vit dans les follicules pileux.'),
    signes: t('Démodécie localisée ou généralisée. Alopécie, squames, érythème. Non prurigineux sauf surinfection.'),
    photo: null,
  },
  {
    nom: t('Otodectes cynotis'),
    type: t('Acarien'),
    especes: t('Chien, Chat'),
    detection: t('Examen du cérumen à l\'otoscope ou microscopie'),
    morphologie: t('Acarien blanc visible à l\'œil nu dans le cérumen brun foncé.'),
    signes: t('Otite externe prurigineuse, cérumen brun-noir abondant, secouement de tête.'),
    photo: null,
  },
  {
    nom: t('Linognathus setosus'),
    type: t('Pou (piqueur)'),
    especes: t('Chien'),
    detection: t('Examen du pelage, lentes fixées aux poils'),
    morphologie: t('Insecte aplati, allongé, tête étroite. Lentes ovales attachées à la base des poils.'),
    signes: t('Prurit, irritation cutanée, pelage terne. Fréquent chez les chiots ou animaux débilités.'),
    photo: null,
  },
  {
    nom: t('Trichodectes canis'),
    type: t('Pou (broyeur)'),
    especes: t('Chien'),
    detection: t('Examen visuel du pelage'),
    morphologie: t('Tête large et carrée, corps aplati. Se nourrit de squames et sécrétions cutanées.'),
    signes: t('Prurit modéré, pelage terne, squames. Hôte intermédiaire de Dipylidium caninum.'),
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/MA_I374838_TePapa_Trichodectes-Trichodectes_preview.jpg',
  },
  {
    nom: t('Cheyletiella spp.'),
    type: t('Acarien (surface)'),
    especes: t('Chien, Chat, Lapin'),
    detection: t('Grattage superficiel, ruban adhésif sur squames'),
    morphologie: t('Acarien visible à la loupe — responsable des "squames qui bougent". Crochets caractéristiques.'),
    signes: t('Squames dorsales abondantes, prurit variable. Zoonose possible (lésions papuleuses chez l\'humain).'),
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/cheyletiella.jpg',
  },
  {
    nom: t('Puces (Siphonaptera)'),
    type: t('Insecte'),
    especes: t('Chien, Chat (Ctenocephalides spp.)'),
    detection: t('Peigne fin, crottes de puces (rougissent sur papier humide)'),
    morphologie: t('Insecte brun aplat latéralement, sans ailes, pattes postérieures sauteuses.'),
    signes: t('Prurit intense, dermatite allergique aux piqûres de puces (DAPP), transmission de Dipylidium caninum.'),
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/siphonaptera-28512.jpg',
  },
  {
    nom: t('Tiques (Ixodida)'),
    type: t('Acarien'),
    especes: t('Chien, Chat (Ixodes, Rhipicephalus, Dermacentor…)'),
    detection: t('Examen visuel du pelage, palpation'),
    morphologie: t('Acarien à corps dur (ixodidés). Taille variable selon le stade (larve, nymphe, adulte, gorgée).'),
    signes: t('Vecteurs de maladies (Ehrlichia, Anaplasma, Babesia, Borrelia, RMSF). Localisation préférentielle : cou, oreilles, pattes.'),
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Parasites/Tique.jpg',
  },
]

export default function LaParasitologieExternes() {
  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        {t('Parasites externes les plus fréquemment rencontrés en clinique vétérinaire pour chiens et chats.')}
      </p>

      <div className="labo-sediments-liste">
        {PARASITES.map((p, i) => (
          <div key={i} className="labo-sediment-card">

            {/* Photo */}
            {p.photo ? (
              <img src={p.photo} alt={p.nom} className="labo-sediment-photo" />
            ) : (
              <div className="labo-sediment-placeholder">
                <i className="ti ti-bug"></i>
                <span>{t('Photo à venir')}</span>
              </div>
            )}

            {/* Entête */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 className="labo-sediment-nom" style={{ margin: 0, fontStyle: 'italic' }}>{p.nom}</h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(37,77,86,0.1)',
                  color: 'var(--primary)',
                }}>{p.type}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: 0 }}>
                <i className="ti ti-paw" style={{ marginRight: 4 }}></i>{p.especes}
              </p>
            </div>

            {/* Morphologie */}
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{t('Morphologie')}</p>
              <p className="labo-sediment-desc" style={{ margin: 0 }}>{p.morphologie}</p>
            </div>

            {/* Détection */}
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <i className="ti ti-microscope" style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}></i>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}><strong>{t('Détection :')}</strong> {p.detection}</p>
            </div>

            {/* Signes cliniques */}
            <div style={{ padding: '8px 14px', background: 'var(--bg)', display: 'flex', gap: 8 }}>
              <i className="ti ti-stethoscope" style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 1 }}></i>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{p.signes}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
