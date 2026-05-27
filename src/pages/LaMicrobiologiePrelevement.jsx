const SYSTEMES = [
  {
    nom: 'Voies respiratoires inférieures',
    items: [
      { echantillon: 'Lavage transtrachéal', transport: 'Tube stérile, transport à 4 °C', notes: 'Échantillon semi-invasif, recueilli sous anesthésie.' },
      { echantillon: 'Aspirat ou biopsie des poumons', transport: 'Contenant stérile', notes: 'Indiqué en pathologie profonde; attention aux contaminations.' },
    ],
  },
  {
    nom: 'Voies respiratoires supérieures',
    items: [
      { echantillon: 'Frottis nasopharyngien', transport: 'Écouvillon synthétique avec transport viral ou bactérien', notes: 'Manipulation douce pour ne pas irriter la muqueuse.' },
      { echantillon: 'Lavage des sinus', transport: 'Tube stérile', notes: 'Effectué sous anesthésie; échantillon stérile recommandé.' },
      { echantillon: 'Biopsie des voies respiratoires', transport: 'Contenant stérile ou formol selon analyse', notes: 'Pour culture ou histopathologie selon suspicion.' },
    ],
  },
  {
    nom: 'Voies urinaires',
    items: [
      { echantillon: 'Urine', transport: 'Contenant stérile; transport à 4 °C', notes: 'Cystocentèse préférée; analyser dans les 4 à 6 h.' },
    ],
  },
  {
    nom: 'Appareil gastro-intestinal',
    items: [
      { echantillon: 'Fèces', transport: 'Contenant stérile ou milieu Cary-Blair', notes: 'Ne pas congeler pour culture bactérienne; congélation possible pour virologie.' },
      { echantillon: 'Frottis rectal', transport: 'Écouvillon en milieu de transport (Amies)', notes: 'Prélever en douceur; utile si émission fécale impossible.' },
    ],
  },
  {
    nom: 'Appareils reproducteurs',
    items: [
      { echantillon: 'Liquide prostatique', transport: 'Tube stérile, transport rapide à 4 °C', notes: 'Échantillon recueilli par massage prostatique transrectal ou urétral.' },
      { echantillon: 'Sperme', transport: 'Tube stérile, transport rapide à 37 °C', notes: 'Analyser rapidement; éviter les chocs thermiques.' },
      { echantillon: 'Utérus', transport: 'Biopsie ou écouvillon stérile', notes: 'Transport sur Amies ou Stuart; peut nécessiter anesthésie.' },
      { echantillon: 'Vagin', transport: 'Écouvillon en milieu de transport', notes: 'Prélever dans la profondeur du vagin avec spéculum stérile.' },
      { echantillon: 'Avortement', transport: 'Foetus entier, placenta et liquide amniotique', notes: 'Transport à 4 °C; idéalement complet pour diagnostic multiple.' },
    ],
  },
  {
    nom: 'Oeil',
    items: [
      { echantillon: 'Frottis conjonctival', transport: 'Écouvillon ou lame, transport rapide', notes: 'Utiliser écouvillon synthétique; éviter anesthésie si possible.' },
      { echantillon: 'Grattage cornéen', transport: 'Lame ou écouvillon synthétique sec', notes: 'Sous anesthésie topique; éviter coton.' },
      { echantillon: 'Liquide oculaire', transport: 'Tube stérile ou seringue scellée', notes: 'Petite quantité; manipuler rapidement.' },
    ],
  },
  {
    nom: 'Os et articulations',
    items: [
      { echantillon: 'Aspirat articulaire', transport: 'Tube stérile sans additif', notes: 'Transport rapide à température ambiante ou 4 °C; éviter anticoagulants.' },
      { echantillon: 'Aspirat de moelle osseuse', transport: 'Tube EDTA ou stérile selon l\'analyse', notes: 'Prélever en conditions stériles; quantité minimale suffisante (0,5 ml).' },
      { echantillon: 'Os', transport: 'Fragment dans contenant stérile', notes: 'Transport à 4 °C; éviter contamination en chirurgie.' },
    ],
  },
  {
    nom: 'Peau',
    items: [
      { echantillon: 'Frottis de peau', transport: 'Lame propre, air sec, étui rigide', notes: 'Fixer immédiatement si coloration prévue; utile en cytologie.' },
      { echantillon: 'Écouvillonnage de peau', transport: 'Écouvillon stérile avec Amies ou Stuart', notes: 'Prélever en profondeur ou sous croûte si possible.' },
      { echantillon: 'Biopsie de tissus', transport: 'Formol 10% ou contenant stérile selon l\'analyse', notes: 'Indiquer l\'objectif : histopatho ou culture.' },
      { echantillon: 'Pellicules, poils et grattages', transport: 'Lame propre ou contenant sec', notes: 'Utiliser pour recherche fongique ou parasitaire.' },
    ],
  },
  {
    nom: 'Sang',
    items: [
      { echantillon: 'Sang entier', transport: 'Tube EDTA ou héparine; 3 ml minimum', notes: 'Ne pas congeler; conserver à 4 °C.' },
    ],
  },
  {
    nom: 'Système nerveux central',
    items: [
      { echantillon: 'Liquide céphalorachidien', transport: 'Tube stérile; transport rapide à 4 °C', notes: 'Volume faible (0,5 à 1 ml); analyse rapide essentielle.' },
    ],
  },
  {
    nom: 'Tissus de nécropsie',
    items: [
      { echantillon: 'Lésions de nécropsie', transport: 'Contenant stérile ou formol selon objectif', notes: 'Prélever rapidement post-mortem; séparer les organes pour analyse ciblée.' },
    ],
  },
]

const BONNES_PRATIQUES = [
  'Prélever avant tout traitement antibiotique si possible.',
  'Identifier clairement le prélèvement : animal, propriétaire, site anatomique, méthode.',
  'Respecter la chaîne de froid (4 °C) sauf pour les hémocultures.',
  'Acheminer rapidement au laboratoire, idéalement en moins de 24 h.',
  'Préciser les antibiotiques en cours dans la demande.',
  'Éviter la contamination avec une technique aseptique rigoureuse.',
]

export default function LaMicrobiologiePrelevement() {
  return (
    <div className="labo-detail-page">

      {SYSTEMES.map((sys, i) => (
        <div key={i} className="labo-ref-section">
          <div className="labo-ref-tableau">
            <div className="labo-ref-header labo-ref-header--3col-prelevement">
              <span>{sys.nom}</span>
              <span>Transport</span>
              <span>Notes</span>
            </div>
            {sys.items.map((row, j) => (
              <div key={j} className="labo-ref-ligne labo-ref-ligne--3col-prelevement">
                <span style={{ fontWeight: 600 }}>{row.echantillon}</span>
                <span>{row.transport}</span>
                <span>{row.notes}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Bonnes pratiques pré-analytiques</h2>
        <div className="labo-etape-card">
          {BONNES_PRATIQUES.map((p, i) => (
            <div key={i} className="labo-materiel-item" style={{ borderBottom: i < BONNES_PRATIQUES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <i className="ti ti-check" style={{ color: 'var(--primary)', flexShrink: 0 }}></i>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
