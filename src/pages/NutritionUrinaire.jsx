const SECTIONS = [
  {
    titre: 'Contexte et diagnostic',
    principes: [
      'Signes de FLUTD : dysurie, pollakiurie, strangurie, hématurie, périurie. L\'obstruction urétrale est une urgence.',
      'Chat < 10 ans : surtout cystite idiopathique féline (CIF, diagnostic d\'exclusion), puis urolithes et bouchons urétraux.',
      'Chat > 10 ans : infection urinaire ou urolithes plus fréquents.',
      'Urolithes les plus courants : struvite (~50 %) et oxalate de calcium (~37 %).',
      'Diagnostic : analyse d\'urine complète < 30 min; examen du sédiment essentiel; ne pas se fier à la bandelette seule (faux positifs de pyurie chez le chat).',
    ],
  },
  {
    titre: 'Cystite idiopathique féline (CIF) — approche multimodale',
    principes: [
      'Aliment humide (> 60 % d\'humidité) : réduit les récidives; viser une densité urinaire de 1,032 à 1,041.',
      'Augmenter l\'apport en eau : bouillon faible en sodium, glaçons, fontaines à eau.',
      'Aliment urinaire thérapeutique pour réduire la fréquence des épisodes.',
      'Nutriments anti-stress : L-tryptophane (précurseur de la sérotonine) et alpha-casozépine ou caséine hydrolysée.',
      'Oméga-3 (EPA/DHA), vitamine E et bêta-carotène — effet anti-inflammatoire sur la muqueuse vésicale.',
      'Enrichissement environnemental, réduction du stress, gestion des litières : règle « 1 litière par chat + 1 », litière agglomérante non parfumée, bac non couvert, nettoyage quotidien.',
    ],
  },
  {
    titre: 'Urolithes de struvite',
    principes: [
      'Dissolubles par aliment calculolytique en ~1 mois — poursuivre 1 mois après résolution à l\'imagerie.',
      'Cibles : pH urinaire < 6,1 et densité urinaire < 1,040.',
      'Après dissolution : passer à un aliment préventif pour struvites.',
      'Chez le chien : struvites souvent secondaires à une infection urinaire — traiter l\'infection en priorité.',
    ],
  },
  {
    titre: 'Urolithes d\'oxalate de calcium',
    principes: [
      'Non dissolubles par l\'alimentation — retrait chirurgical ou par lithotritie nécessaire.',
      'Après retrait : aliment humide thérapeutique et hydratation maximale pour la prévention.',
      'Suivi : analyse d\'urine aux 3 mois, imagerie aux 6 mois.',
      'Sel (NaCl) : augmente la dilution urinaire mais prudence si IRC ou hypertension concomitantes.',
    ],
  },
]

export default function NutritionUrinaire() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplets"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <ul className="nutrition-principes">
            {s.principes.map((p, j) => (
              <li key={j} className="nutrition-principe-item">{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
