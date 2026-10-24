import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Une peau et un pelage sains, et confirmer ou écarter une allergie alimentaire.',
  pourQui: 'démangeaisons, otites à répétition, pelage terne ou allergie alimentaire soupçonnée.',

  messages: [
    { titre: 'Un essai strict, 8 semaines', texte: "Seulement la diète prescrite : rien d'autre, même une bouchée." },
    { titre: 'Tout compte', texte: 'Gâteries, restes, médicaments à saveur, os à mâcher.' },
    { titre: 'Les oméga-3 de poisson', texte: 'Ils aident la peau et le pelage, selon le vétérinaire.' },
  ],

  privilegier: ['Diète hydrolysée ou protéine nouvelle', 'Médicaments sans saveur', 'Gâteries faites de la même diète', 'Oméga-3 de poisson'],
  eviter: ['Gâteries et restes de table', 'Médicaments à saveur', 'Os et jouets à mâcher aromatisés', 'Vitamine A sans avis'],

  alertes: [
    { titre: "Zéro exception pendant l'essai", texte: "Une seule bouchée d'autre chose peut fausser le résultat." },
    { titre: 'Toute la famille doit savoir', texte: 'Enfants, visiteurs, garderie : personne ne donne autre chose.' },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    "Dresser la liste de tout ce que l'animal a mangé dans sa vie : elle aide à choisir la diète.",
    'Pour les récompenses, utiliser la diète elle-même (croquettes ou petits morceaux de la conserve).',
    "Après l'amélioration, le vétérinaire réintroduit l'ancienne nourriture pour confirmer le diagnostic.",
  ],

  appeler: [
    'Démangeaisons qui empirent',
    'Plaies, croûtes ou infection de la peau',
    'Vomissements ou diarrhée avec la nouvelle diète',
    'Refuse de manger la diète',
  ],
  suivi: [
    "Contrôle à la fin de l'essai, après environ 8 semaines.",
    "Noter chaque semaine l'intensité des démangeaisons, de 0 à 10.",
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Hydrolyzed Protein (HP)', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet z/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets HA HypoAllergenic', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Essai : 8 semaines minimum', 'Protéine hydrolysée ou nouvelle', 'Oméga-3 marins (EPA, DHA)'],
      chat: ['Essai : 8 semaines minimum', 'Protéine hydrolysée ou nouvelle', 'Oméga-3 marins (EPA, DHA)'],
    },
    notes: [
      'Les diètes hydrolysées vétérinaires sont souvent plus efficaces que les nourritures à protéine nouvelle vendues en magasin.',
      'Sans amélioration après un deuxième essai bien fait, une allergie alimentaire devient peu probable.',
      'Races nordiques : un manque de zinc peut donner une peau épaisse et croûteuse ; une nourriture complète le prévient généralement.',
    ],
  },

  sources: [
    "VCA, mener un essai d'élimination chez le chien",
    'Tufts Petfoodology, essais alimentaires',
  ],
}

export default function NutritionPeau() {
  return <FicheNutrition fiche={FICHE} />
}
