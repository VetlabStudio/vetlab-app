import { t } from '../lib/i18n'
const CATEGORIES_ATB = [
  {
    categorie: t('Pénicillines'),
    exemples: t('Amoxicilline, Amoxicilline-clavulanate'),
    spectre: t('Gram + et quelques Gram -'),
    notes: t('Première intention pour de nombreuses infections. Résistance fréquente par production de bêtalactamase.'),
  },
  {
    categorie: t('Céphalosporines'),
    exemples: t('Céfalexine (1ère gén.), Céfovécine (3ème gén.)'),
    spectre: t('Large spectre Gram + / Gram -'),
    notes: t('Usage prudent pour les céphalosporines de 3ème génération (antibiotiques critiques OMS).'),
  },
  {
    categorie: t('Fluoroquinolones'),
    exemples: t('Enrofloxacine, Marbofloxacine, Pradofloxacine'),
    spectre: t('Gram - et certains Gram +'),
    notes: t('Antibiotiques critiques (OMS). Réserver aux infections confirmées résistantes aux autres molécules.'),
  },
  {
    categorie: t('Aminoglycosides'),
    exemples: t('Gentamicine, Tobramycine'),
    spectre: t('Gram - (dont Pseudomonas)'),
    notes: t('Efficace contre Pseudomonas aeruginosa en otite. Usage local recommandé pour limiter la néphrotoxicité.'),
  },
  {
    categorie: t('Tétracyclines'),
    exemples: t('Doxycycline'),
    spectre: t('Large spectre, intracellulaires'),
    notes: t('Efficace contre Ehrlichia, Anaplasma, Mycoplasma, Chlamydia. Bonne pénétration tissulaire.'),
  },
  {
    categorie: t('Macrolides / Lincosamides'),
    exemples: t('Azithromycine, Clindamycine'),
    spectre: t('Gram + et anaérobies'),
    notes: t('Clindamycine efficace pour les infections à staphylocoques et anaérobies. Bonne pénétration osseuse.'),
  },
]

const RESISTANCES = [
  { bacterie: t('Staphylococcus pseudintermedius (MRSP)'), description: t('Résistant à toutes les bêtalactamines. Fréquent en pyodermites et otites récidivantes. Antibiogramme obligatoire.'), alerte: true },
  { bacterie: t('Pseudomonas aeruginosa'), description: t('Résistances multiples fréquentes. Sensible souvent à la gentamicine, fluoroquinolones, polymyxine B. Antibiogramme indispensable.'), alerte: true },
  { bacterie: t('E. coli BLSE'), description: t('Producteur de bêtalactamases à spectre étendu — résistant aux céphalosporines. En augmentation dans les infections urinaires.'), alerte: true },
  { bacterie: t('Enterococcus spp.'), description: t('Résistance naturelle aux céphalosporines. Sensible à l\'amoxicilline et vancomycine en général.'), alerte: false },
]

export default function LaMicrobiologieAntibiogramme() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Lecture de l\'antibiogramme')}</h2>
        <div className="labo-etape-card">
          {[
            { sigle: t('S - Sensible'), desc: t('La bactérie est inhibée aux concentrations thérapeutiques habituelles. Traitement efficace attendu.'), couleur: 'var(--primary)' },
            { sigle: t('I - Intermédiaire'), desc: t('Efficacité incertaine. Peut être utilisé à forte dose ou pour certains sites (urine). À éviter en première intention.'), couleur: 'var(--accent-gold)' },
            { sigle: t('R - Résistant'), desc: t('La bactérie n\'est pas inhibée aux concentrations thérapeutiques. Traitement contre-indiqué.'), couleur: 'var(--accent-red)' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: r.couleur, margin: '0 0 2px 0' }}>{r.sigle}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Principales classes d\'antibiotiques')}</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
            <span>{t('Classe')}</span>
            <span>{t('Spectre')}</span>
            <span>{t('Notes')}</span>
          </div>
          {CATEGORIES_ATB.map((c, i) => (
            <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1fr 1fr 1.5fr' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{c.categorie}</span>
                <br />
                <span style={{ fontSize: 10, color: 'var(--text-hint)' }}>{c.exemples}</span>
              </div>
              <span style={{ fontSize: 11 }}>{c.spectre}</span>
              <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{c.notes}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Résistances importantes à connaître')}</h2>
        {RESISTANCES.map((r, i) => (
          <div key={i} className="labo-etape-card" style={{ marginBottom: 8 }}>
            <div style={{ padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <i className={`ti ${r.alerte ? 'ti-alert-triangle' : 'ti-info-circle'}`} style={{ color: r.alerte ? 'var(--accent-red)' : 'var(--primary)', flexShrink: 0, marginTop: 1 }}></i>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: r.alerte ? 'var(--accent-red)' : 'var(--text-primary)', margin: '0 0 4px 0' }}>{r.bacterie}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{r.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="calc-avertissement">
        <i className="ti ti-alert-circle"></i>
        {t('Toujours adapter le traitement à l\'antibiogramme. Éviter les antibiotiques critiques (fluoroquinolones, céphalosporines de 3e génération) en première intention sauf indication clinique formelle.')}
      </div>

    </div>
  )
}
