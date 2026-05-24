const CELLULES = [
  {
    categorie: 'Cellules épithéliales',
    items: [
      {
        nom: 'Cellules épithéliales squameuses',
        description: 'Grandes cellules polygonales à cytoplasme abondant et pâle. Noyau petit et pycnotique. Normales en surface cutanée ou muqueuse. Peu diagnostiques seules.',
        photo: null,
      },
      {
        nom: 'Cellules épithéliales glandulaires',
        description: 'Cellules cuboïdes à cylindriques, souvent en amas ou en acini. Cytoplasme vacuolaire possible. Présentes dans les glandes mammaires, salivaires, hépatiques.',
        photo: null,
      },
      {
        nom: 'Cellules transitionnelles',
        description: 'Cellules de taille variable provenant de la vessie ou de l\'urètre. En agrégats ou abondance = anormal. Peuvent mimer une néoplasie en cas d\'inflammation.',
        photo: null,
      },
    ],
  },
  {
    categorie: 'Cellules mésenchymateuses',
    items: [
      {
        nom: 'Fibroblastes',
        description: 'Cellules fusiformes à allongées, cytoplasme peu abondant. Noyau ovale. Présents dans les tissus de soutien et cicatriciels. Exfoliation faible.',
        photo: null,
      },
      {
        nom: 'Cellules adipeuses (lipocytes)',
        description: 'Grandes cellules à cytoplasme vacuolaire unique qui repousse le noyau en périphérie. Présentes dans les lipomes ou le tissu adipeux normal.',
        photo: null,
      },
    ],
  },
  {
    categorie: 'Cellules rondes (discrètes)',
    items: [
      {
        nom: 'Mastocytes',
        description: 'Cellules rondes à cytoplasme rempli de granules violets (Diff-Quik). Noyau central rond. Présents dans les mastocytomes ou en contexte inflammatoire. Dégranulation possible.',
        photo: null,
      },
      {
        nom: 'Cellules histiocytaires / macrophages',
        description: 'Grandes cellules rondes à cytoplasme abondant, vacuolaire, parfois avec débris phagocytés. Noyau en forme de rein. Communes dans les inflammations chroniques.',
        photo: null,
      },
      {
        nom: 'Cellules plasmocytaires',
        description: 'Cellules rondes à cytoplasme basophile intense. Noyau excentré avec chromatine en "cadran de montre". Présentes dans les plasmocytomes ou inflammations chroniques.',
        photo: null,
      },
      {
        nom: 'Lymphocytes',
        description: 'Petites cellules rondes à cytoplasme très réduit. Noyau rond dense. Présents dans les ganglions, la rate, les inflammations lymphocytaires. Abondance = lymphome possible.',
        photo: null,
      },
    ],
  },
  {
    categorie: 'Cellules inflammatoires',
    items: [
      {
        nom: 'Neutrophiles non dégénérés',
        description: 'Noyau segmenté bien conservé. Présents dans les inflammations aiguës steriles ou purulentes modérées.',
        photo: null,
      },
      {
        nom: 'Neutrophiles dégénérés (caryolyse)',
        description: 'Noyau gonflé, pâle, mal défini. Signe d\'environnement toxique (bactéries, toxines). Fortement suggestif d\'infection bactérienne.',
        photo: null,
      },
      {
        nom: 'Éosinophiles',
        description: 'Neutrophiles avec granules orangés-rouges caractéristiques (Diff-Quik). Associés aux parasitoses, allergies, mastocytomes, certaines néoplasies.',
        photo: null,
      },
    ],
  },
]

export default function LaCytologieCellules() {
  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        Descriptions basées sur la coloration Diff-Quik, standard en cytologie vétérinaire de terrain.
      </p>

      {CELLULES.map((cat, i) => (
        <div key={i} className="labo-ref-section">
          <h2 className="labo-ref-titre">{cat.categorie}</h2>
          <div className="labo-sediments-liste">
            {cat.items.map((cell, j) => (
              <div key={j} className="labo-sediment-card">
                <div className="labo-sediment-placeholder">
                  <i className="ti ti-microscope"></i>
                  <span>Photo à venir</span>
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
