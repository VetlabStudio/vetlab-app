import { t } from './i18n'
/* Espèces de la section Exotiques. Leurs fiches vivent dans la même table
   que celles du chien et du chat (les favoris restent communs), mais la
   Pharmacologie chien et chat ne montre pas celles qui ne visent que des
   exotiques. */
export const GROUPES_EXOTIQUES = [
  { titre: t('Petits mammifères'), especes: ['lapin', 'furet', 'cobaye', 'chinchilla', 'rongeur', 'herisson'] },
  { titre: t('Oiseaux et reptiles'), especes: ['oiseau', 'serpent', 'lezard', 'tortue'] },
  { titre: t('Amphibiens et poissons'), especes: ['amphibien', 'poisson'] },
]

export const ESPECES_EXOTIQUES = GROUPES_EXOTIQUES.flatMap(g => g.especes)

export function estExotiqueSeulement(especes) {
  return Array.isArray(especes) && especes.length > 0 && especes.every(e => ESPECES_EXOTIQUES.includes(e))
}

/* Formes du nom pour les phrases (« pour le lapin », « médicaments des
   rongeurs ») et nom scientifique quand l'entrée vise une seule espèce.
   en : le nom anglais au pluriel, pour les phrases en anglais
   (« Add a drug for rabbits »). */
export const NOMS_EXOTIQUES = {
  lapin:      { le: 'le lapin', du: 'du lapin', en: 'rabbits', latin: 'Oryctolagus cuniculus' },
  furet:      { le: 'le furet', du: 'du furet', en: 'ferrets', latin: 'Mustela putorius furo' },
  cobaye:     { le: "le cochon d'Inde", du: "du cochon d'Inde", en: 'guinea pigs', latin: 'Cavia porcellus' },
  chinchilla: { le: 'le chinchilla', du: 'du chinchilla', en: 'chinchillas', latin: 'Chinchilla lanigera' },
  rongeur:    { le: 'les rongeurs', du: 'des rongeurs', en: 'rodents', precision: t('Rat, souris, hamster, gerbille') },
  herisson:   { le: 'le hérisson', du: 'du hérisson', en: 'hedgehogs', latin: 'Atelerix albiventris' },
  oiseau:     { le: 'les oiseaux', du: 'des oiseaux', en: 'birds' },
  serpent:    { le: 'les serpents', du: 'des serpents', en: 'snakes' },
  lezard:     { le: 'les lézards', du: 'des lézards', en: 'lizards' },
  tortue:     { le: 'les tortues', du: 'des tortues', en: 'turtles and tortoises' },
  amphibien:  { le: 'les amphibiens', du: 'des amphibiens', en: 'amphibians' },
  poisson:    { le: 'les poissons', du: 'des poissons', en: 'fish' },
}

/* Catégories de médicaments des exotiques, dans l'ordre de la page
   Médicaments de l'espèce (ordre alphabétique, Urgence à la fin comme en
   Pharmacologie). Seules celles qui ont au moins une fiche pour l'espèce
   y sont affichées. */
export const CATEGORIES_EXOTIQUES = [
  'Anesthésiques / Analgésiques',
  'Antagonistes',
  'Antibiotiques',
  'Antidiarrhéiques',
  'Antiémétiques',
  'Antifongiques',
  'Antihistaminiques',
  'Anti-inflammatoires',
  'Antiparasitaires',
  'Antiseptiques et bains',
  'Antiviraux',
  'Cardiovasculaires',
  'Gastroprotecteurs',
  'Hormones',
  'Neurologiques',
  'Oncologie',
  'Ophtalmologie',
  'Respiratoires',
  'Vitamines et minéraux',
  'Divers',
  'Urgence',
]

// Morceau d'adresse d'une catégorie : « Anesthésiques / Analgésiques » donne « anesthesiques-analgesiques ».
export function slugCategorie(categorie) {
  return categorie.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function categorieDuSlug(slug) {
  return CATEGORIES_EXOTIQUES.find(c => slugCategorie(c) === slug)
}
