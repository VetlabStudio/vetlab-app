/* Espèces de la section Exotiques. Leurs fiches vivent dans la même table
   que celles du chien et du chat (les favoris restent communs), mais la
   Pharmacologie chien et chat ne montre pas celles qui ne visent que des
   exotiques. */
export const GROUPES_EXOTIQUES = [
  { titre: 'Petits mammifères', especes: ['lapin', 'furet', 'cobaye', 'chinchilla', 'rongeur', 'herisson'] },
  { titre: 'Oiseaux et reptiles', especes: ['oiseau', 'serpent', 'lezard', 'tortue'] },
  { titre: 'Amphibiens et poissons', especes: ['amphibien', 'poisson'] },
]

export const ESPECES_EXOTIQUES = GROUPES_EXOTIQUES.flatMap(g => g.especes)

export function estExotiqueSeulement(especes) {
  return Array.isArray(especes) && especes.length > 0 && especes.every(e => ESPECES_EXOTIQUES.includes(e))
}

/* Formes du nom pour les phrases (« pour le lapin », « médicaments des
   rongeurs ») et nom scientifique quand l'entrée vise une seule espèce. */
export const NOMS_EXOTIQUES = {
  lapin:      { le: 'le lapin', du: 'du lapin', latin: 'Oryctolagus cuniculus' },
  furet:      { le: 'le furet', du: 'du furet', latin: 'Mustela putorius furo' },
  cobaye:     { le: "le cochon d'Inde", du: "du cochon d'Inde", latin: 'Cavia porcellus' },
  chinchilla: { le: 'le chinchilla', du: 'du chinchilla', latin: 'Chinchilla lanigera' },
  rongeur:    { le: 'les rongeurs', du: 'des rongeurs', precision: 'Rat, souris, hamster, gerbille' },
  herisson:   { le: 'le hérisson', du: 'du hérisson', latin: 'Atelerix albiventris' },
  oiseau:     { le: 'les oiseaux', du: 'des oiseaux' },
  serpent:    { le: 'les serpents', du: 'des serpents' },
  lezard:     { le: 'les lézards', du: 'des lézards' },
  tortue:     { le: 'les tortues', du: 'des tortues' },
  amphibien:  { le: 'les amphibiens', du: 'des amphibiens' },
  poisson:    { le: 'les poissons', du: 'des poissons' },
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
