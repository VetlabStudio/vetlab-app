import FichesMicroorganismes from '../components/FichesMicroorganismes'
import { t } from '../lib/i18n'

const BACTERIES = [
  {
    nom: t('Staphylococcus pseudintermedius'),
    gram: '+',
    morphologie: t('Coque en grappes'),
    infections: [t('Pyodermite'), t('Otite externe'), t('Plaies'), t('Infection post-chirurgicale')],
    resistances: t('Résistance aux bêtalactamines fréquente (MRSP). Antibiogramme recommandé.'),
    notes: t('Bactérie la plus fréquente en dermatologie canine. Flore normale de la peau et des muqueuses.'),
  },
  {
    nom: t('Pseudomonas aeruginosa'),
    gram: '-',
    morphologie: t('Bacille'),
    infections: [t('Otite externe chronique'), t('Plaies infectées'), t('Pneumonie nosocomiale')],
    resistances: t('Résistances multiples très fréquentes. Sensible souvent à la gentamicine (topique) et polymyxine B.'),
    notes: t('Fréquent dans les otites chroniques en association avec Staphylococcus. Odeur sucrée caractéristique, pigment verdâtre.'),
  },
  {
    nom: t('Escherichia coli'),
    gram: '-',
    morphologie: t('Bacille'),
    infections: [t('Infection urinaire'), t('Entérite'), t('Septicémie'), t('Péritonite')],
    resistances: t('BLSE (bêtalactamases à spectre étendu) en augmentation. Antibiogramme indispensable.'),
    notes: t('Principale cause d\'infection urinaire chez la chienne. Souvent sensible à l\'amoxicilline-clavulanate et fluoroquinolones.'),
  },
  {
    nom: t('Streptococcus canis'),
    gram: '+',
    morphologie: t('Coque en chaînes'),
    infections: [t('Septicémie néonatale'), t('Pharyngite'), t('Pneumonie'), t('Lymphadénite')],
    resistances: t('Généralement sensible aux pénicillines.'),
    notes: t('Pathogène opportuniste : peut causer des infections sévères chez les chiots et chats immunodéprimés.'),
  },
  {
    nom: t('Pasteurella multocida'),
    gram: '-',
    morphologie: t('Coccobacille'),
    infections: [t('Abcès de morsure'), t('Rhinite féline'), t('Pneumonie'), t('Septicémie')],
    resistances: t('Généralement sensible aux pénicillines et tétracyclines.'),
    notes: t('Très fréquent dans les morsures de chat chez l\'humain. Flore normale de la cavité buccale des chats.'),
  },
  {
    nom: t('Proteus mirabilis'),
    gram: '-',
    morphologie: t('Bacille'),
    infections: [t('Infection urinaire'), t('Otite externe'), t('Pyodermite')],
    resistances: t('Résistance naturelle à la nitrofurantoïne. Antibiogramme recommandé.'),
    notes: t('Souvent associé à Staphylococcus dans les otites. Odeur caractéristique dans les cultures.'),
  },
  {
    nom: t('Klebsiella pneumoniae'),
    gram: '-',
    morphologie: t('Bacille encapsulé'),
    infections: [t('Infection urinaire'), t('Pneumonie'), t('Septicémie')],
    resistances: t('Résistances multiples fréquentes dont BLSE. Antibiogramme indispensable.'),
    notes: t('Pathogène opportuniste important en milieu hospitalier vétérinaire.'),
  },
  {
    nom: t('Clostridium spp.'),
    gram: '+',
    morphologie: t('Bacille sporulé anaérobie'),
    infections: [t('Entérite hémorragique'), t('Nécrose tissulaire'), t('Tétanos (C. tetani)')],
    resistances: t('Sensible à la pénicilline et métronidazole.'),
    notes: t('Anaérobie strict : prélèvement en milieu anaérobie obligatoire. Spores résistantes dans l\'environnement.'),
  },
]

const FICHES = BACTERIES.map(b => ({
  nom: b.nom,
  pastilles: [
    { texte: `Gram ${b.gram}`, ton: b.gram === '+' ? 'rouge' : 'bleu' },
    { texte: b.morphologie },
  ],
  sections: [
    { titre: t('Infections associées'), liste: b.infections },
    { titre: t('Antibiotiques'), texte: b.resistances },
  ],
  note: b.notes,
}))

export default function LaMicrobiologieBacteries() {
  return (
    <FichesMicroorganismes
      intro={t('Bactéries les plus fréquemment isolées en clinique vétérinaire pour chiens et chats.')}
      fiches={FICHES}
    />
  )
}
