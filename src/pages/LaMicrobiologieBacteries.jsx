import FichesMicroorganismes from '../components/FichesMicroorganismes'

const BACTERIES = [
  {
    nom: 'Staphylococcus pseudintermedius',
    gram: '+',
    morphologie: 'Coque en grappes',
    infections: ['Pyodermite', 'Otite externe', 'Plaies', 'Infection post-chirurgicale'],
    resistances: 'Résistance aux bêtalactamines fréquente (MRSP). Antibiogramme recommandé.',
    notes: 'Bactérie la plus fréquente en dermatologie canine. Flore normale de la peau et des muqueuses.',
  },
  {
    nom: 'Pseudomonas aeruginosa',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Otite externe chronique', 'Plaies infectées', 'Pneumonie nosocomiale'],
    resistances: 'Résistances multiples très fréquentes. Sensible souvent à la gentamicine (topique) et polymyxine B.',
    notes: 'Fréquent dans les otites chroniques en association avec Staphylococcus. Odeur sucrée caractéristique, pigment verdâtre.',
  },
  {
    nom: 'Escherichia coli',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Infection urinaire', 'Entérite', 'Septicémie', 'Péritonite'],
    resistances: 'BLSE (bêtalactamases à spectre étendu) en augmentation. Antibiogramme indispensable.',
    notes: 'Principale cause d\'infection urinaire chez la chienne. Souvent sensible à l\'amoxicilline-clavulanate et fluoroquinolones.',
  },
  {
    nom: 'Streptococcus canis',
    gram: '+',
    morphologie: 'Coque en chaînes',
    infections: ['Septicémie néonatale', 'Pharyngite', 'Pneumonie', 'Lymphadénite'],
    resistances: 'Généralement sensible aux pénicillines.',
    notes: 'Pathogène opportuniste : peut causer des infections sévères chez les chiots et chats immunodéprimés.',
  },
  {
    nom: 'Pasteurella multocida',
    gram: '-',
    morphologie: 'Coccobacille',
    infections: ['Abcès de morsure', 'Rhinite féline', 'Pneumonie', 'Septicémie'],
    resistances: 'Généralement sensible aux pénicillines et tétracyclines.',
    notes: 'Très fréquent dans les morsures de chat chez l\'humain. Flore normale de la cavité buccale des chats.',
  },
  {
    nom: 'Proteus mirabilis',
    gram: '-',
    morphologie: 'Bacille',
    infections: ['Infection urinaire', 'Otite externe', 'Pyodermite'],
    resistances: 'Résistance naturelle à la nitrofurantoïne. Antibiogramme recommandé.',
    notes: 'Souvent associé à Staphylococcus dans les otites. Odeur caractéristique dans les cultures.',
  },
  {
    nom: 'Klebsiella pneumoniae',
    gram: '-',
    morphologie: 'Bacille encapsulé',
    infections: ['Infection urinaire', 'Pneumonie', 'Septicémie'],
    resistances: 'Résistances multiples fréquentes dont BLSE. Antibiogramme indispensable.',
    notes: 'Pathogène opportuniste important en milieu hospitalier vétérinaire.',
  },
  {
    nom: 'Clostridium spp.',
    gram: '+',
    morphologie: 'Bacille sporulé anaérobie',
    infections: ['Entérite hémorragique', 'Nécrose tissulaire', 'Tétanos (C. tetani)'],
    resistances: 'Sensible à la pénicilline et métronidazole.',
    notes: 'Anaérobie strict : prélèvement en milieu anaérobie obligatoire. Spores résistantes dans l\'environnement.',
  },
]

const FICHES = BACTERIES.map(b => ({
  nom: b.nom,
  pastilles: [
    { texte: `Gram ${b.gram}`, ton: b.gram === '+' ? 'rouge' : 'bleu' },
    { texte: b.morphologie },
  ],
  sections: [
    { titre: 'Infections associées', liste: b.infections },
    { titre: 'Antibiotiques', texte: b.resistances },
  ],
  note: b.notes,
}))

export default function LaMicrobiologieBacteries() {
  return (
    <FichesMicroorganismes
      intro="Bactéries les plus fréquemment isolées en clinique vétérinaire pour chiens et chats."
      fiches={FICHES}
    />
  )
}
