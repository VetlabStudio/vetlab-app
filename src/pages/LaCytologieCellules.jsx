import { t } from '../lib/i18n'
const CELLULES = [
  {
    categorie: t('Cellules épithéliales'),
    items: [
      {
        nom: t('Cellules épithéliales squameuses'),
        description: t('Grandes cellules polygonales à cytoplasme abondant et pâle. Noyau petit et pycnotique. Normales en surface cutanée ou muqueuse. Peu diagnostiques seules.'),
        photo: null,
      },
      {
        nom: t('Cellules épithéliales glandulaires'),
        description: t('Cellules cuboïdes à cylindriques, souvent en amas ou en acini. Cytoplasme vacuolaire possible. Présentes dans les glandes mammaires, salivaires, hépatiques.'),
        photo: null,
      },
      {
        nom: t('Cellules transitionnelles'),
        description: t('Cellules de taille variable provenant de la vessie ou de l\'urètre. En agrégats ou abondance = anormal. Peuvent mimer une néoplasie en cas d\'inflammation.'),
        photo: null,
      },
    ],
  },
  {
    categorie: t('Cellules mésenchymateuses'),
    items: [
      {
        nom: t('Fibroblastes'),
        description: t('Cellules fusiformes à allongées, cytoplasme peu abondant. Noyau ovale. Présents dans les tissus de soutien et cicatriciels. Exfoliation faible.'),
        photo: null,
      },
      {
        nom: t('Cellules adipeuses (lipocytes)'),
        description: t('Grandes cellules à cytoplasme vacuolaire unique qui repousse le noyau en périphérie. Présentes dans les lipomes ou le tissu adipeux normal.'),
        photo: null,
      },
    ],
  },
  {
    categorie: t('Cellules rondes (discrètes)'),
    items: [
      {
        nom: t('Mastocytes'),
        description: t('Cellules rondes à cytoplasme rempli de granules violets (Diff-Quik). Noyau central rond. Présents dans les mastocytomes ou en contexte inflammatoire. Dégranulation possible.'),
        photo: null,
      },
      {
        nom: t('Cellules histiocytaires / macrophages'),
        description: t('Grandes cellules rondes à cytoplasme abondant, vacuolaire, parfois avec débris phagocytés. Noyau en forme de rein. Communes dans les inflammations chroniques.'),
        photo: null,
      },
      {
        nom: t('Cellules plasmocytaires'),
        description: t('Cellules rondes à cytoplasme basophile intense. Noyau excentré avec chromatine en "cadran de montre". Présentes dans les plasmocytomes ou inflammations chroniques.'),
        photo: null,
      },
      {
        nom: t('Lymphocytes'),
        description: t('Petites cellules rondes à cytoplasme très réduit. Noyau rond dense. Présents dans les ganglions, la rate, les inflammations lymphocytaires. Abondance = lymphome possible.'),
        photo: null,
      },
    ],
  },
  {
    categorie: t('Cellules inflammatoires'),
    items: [
      {
        nom: t('Neutrophiles non dégénérés'),
        description: t('Noyau segmenté bien conservé. Présents dans les inflammations aiguës steriles ou purulentes modérées.'),
        photo: null,
      },
      {
        nom: t('Neutrophiles dégénérés (caryolyse)'),
        description: t('Noyau gonflé, pâle, mal défini. Signe d\'environnement toxique (bactéries, toxines). Fortement suggestif d\'infection bactérienne.'),
        photo: null,
      },
      {
        nom: t('Éosinophiles'),
        description: t('Granulocytes avec granules orangés-rouges caractéristiques (Diff-Quik). Associés aux parasitoses, allergies, mastocytomes, certaines néoplasies.'),
        photo: null,
      },
    ],
  },
]

export default function LaCytologieCellules() {
  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        {t('Descriptions basées sur la coloration Diff-Quik, standard en cytologie vétérinaire de terrain.')}
      </p>

      {CELLULES.map((cat, i) => (
        <div key={i} className="labo-ref-section">
          <h2 className="labo-ref-titre">{cat.categorie}</h2>
          <div className="labo-sediments-liste">
            {cat.items.map((cell, j) => (
              <div key={j} className="labo-sediment-card">
                <div className="labo-sediment-placeholder">
                  <i className="ti ti-microscope"></i>
                  <span>{t('Photo à venir')}</span>
                </div>
                <div className="labo-sediment-info">
                  <h3 className="labo-sediment-nom">{cell.nom}</h3>
                  <p className="labo-sediment-desc">{cell.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
