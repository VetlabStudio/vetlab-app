import { t } from '../lib/i18n'
const OEUFS = [
  {
    id: 1,
    nom: t('Toxocara canis'),
    especes: t('Chien'),
    description: t('Œuf sphérique à coque épaisse et bosselée, brun foncé. Contient une seule cellule (non embryonné à la ponte). Taille : 75–90 µm.'),
    photo: null,
  },
  {
    id: 2,
    nom: t('Toxocara cati'),
    especes: t('Chat'),
    description: t('Similaire à T. canis mais légèrement plus petit. Coque épaisse ponctuée. Taille : 65–75 µm.'),
    photo: null,
  },
  {
    id: 3,
    nom: t('Toxascaris leonina'),
    especes: t('Chien, Chat'),
    description: t('Œuf ovale à coque lisse et transparente. Plus petit que Toxocara. Taille : 75–85 µm.'),
    photo: null,
  },
  {
    id: 4,
    nom: t('Ancylostoma caninum'),
    especes: t('Chien'),
    description: t('Œuf ovale à paroi mince et lisse, contenant 4–8 cellules à la ponte. Taille : 56–75 µm.'),
    photo: null,
  },
  {
    id: 5,
    nom: t('Uncinaria stenocephala'),
    especes: t('Chien'),
    description: t('Semblable à Ancylostoma, légèrement plus grand. Œuf à paroi mince, morula visible. Taille : 63–76 µm.'),
    photo: null,
  },
  {
    id: 6,
    nom: t('Trichuris vulpis'),
    especes: t('Chien'),
    description: t('Œuf en forme de barillet avec deux bouchons polaires translucides. Brun doré. Taille : 70–90 µm.'),
    photo: null,
  },
  {
    id: 7,
    nom: t('Dipylidium caninum'),
    especes: t('Chien, Chat'),
    description: t('Paquets d\'œufs (capsules ovigères) contenant 8–15 œufs sphériques. Rarement vus isolément à la flottation. Taille du paquet : 120–200 µm.'),
    photo: null,
  },
  {
    id: 8,
    nom: t('Taenia spp.'),
    especes: t('Chien, Chat'),
    description: t('Œuf sphérique à coque striée rayonnante (embryophore), contenant un oncosphère à 6 crochets. Taille : 25–40 µm.'),
    photo: null,
  },
  {
    id: 9,
    nom: t('Giardia duodenalis'),
    especes: t('Chien, Chat'),
    description: t('Kyste ovoïde à paroi lisse, contenant 2–4 noyaux visibles. Détecté par flottation au sulfate de zinc. Taille : 8–12 µm.'),
    photo: null,
  },
  {
    id: 10,
    nom: t('Cryptosporidium spp.'),
    especes: t('Chien, Chat'),
    description: t('Oocyste sphérique très petit, paroi lisse. Détecté par coloration acido-alcoolo-résistante (Ziehl-Neelsen modifié). Taille : 4–6 µm.'),
    photo: null,
  },
  {
    id: 11,
    nom: t('Isospora canis / I. felis'),
    especes: t('Chien / Chat'),
    description: t('Oocyste non sporulé à la ponte, paroi lisse, sporocystes visibles après sporulation. Taille : 30–45 µm (I. canis), 38–51 µm (I. felis).'),
    photo: '/parasites/isospora-felis-estelle-pelletier.jpg',
    credit: t('Estelle Pelletier'),
  },
]

export default function LaboParasitologieOeufs() {
  return (
    <div className="labo-detail-page">
      <div className="labo-sediments-liste">
        {OEUFS.map(o => (
          <div key={o.id} className="labo-sediment-card">
            {o.photo ? (
              <div style={{ position: 'relative' }}>
                <img src={o.photo} alt={o.nom} className="labo-sediment-photo" />
                {o.credit && (
                  <span className="labo-sediment-credit">© {o.credit}</span>
                )}
              </div>
            ) : (
              <div className="labo-sediment-placeholder">
                <i className="ti ti-egg"></i>
                <span>{t('Photo à venir')}</span>
              </div>
            )}
            <div className="labo-sediment-info">
              <h3 className="labo-sediment-nom">{o.nom}</h3>
              <p style={{ fontSize: 11, color: 'var(--accent-gold)', fontStyle: 'italic', marginBottom: 4 }}>
                {o.especes}
              </p>
              <p className="labo-sediment-desc">{o.description}</p>
            </div>
          </div>
        ))}
      </div>
            <div className="postop-note-bas">
        <i className="ti ti-info-circle"></i>
        <span>{t('Les images présentées ne remplacent pas l\'interprétation professionnelle d\'un échantillon.')}</span>
      </div>
    </div>
  )
}
