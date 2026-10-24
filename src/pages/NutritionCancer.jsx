import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Garder le poids et le muscle pendant la maladie et les traitements.',
  pourQui: "chien ou chat atteint d'un cancer, avant, pendant et après les traitements.",

  messages: [
    { titre: 'Manger reste la priorité', texte: 'Perdre du poids réduit la survie : ne pas laisser aller.' },
    { titre: 'Riche en gras et en protéines', texte: 'Les cellules cancéreuses préfèrent le sucre.' },
    { titre: 'Des repas appétissants', texte: 'Nourriture tiède et odorante, petits repas, endroit calme.' },
  ],

  privilegier: ['Diète de récupération', 'Nourriture humide et tiède', 'Petits repas fréquents', 'Oméga-3 selon le vétérinaire'],
  eviter: ['Nourriture crue pendant les traitements', 'Médicaments cachés dans le repas', 'Suppléments non prescrits', "Attendre s'il ne mange plus"],

  alertes: [
    { titre: "Refus de manger plus d'un à deux jours", texte: 'Ne pas attendre : une diète de récupération ou une sonde temporaire peut être proposée.' },
    { titre: 'Médicaments à part du repas', texte: 'Les cacher dans sa nourriture peut le dégoûter de celle-ci pour longtemps.' },
  ],

  pratique: [
    'Réchauffer la nourriture humide et offrir les repas dans un endroit calme, loin du bruit.',
    'Donner les médicaments loin des repas, pas juste avant ni juste après.',
    "Les diètes de récupération contiennent souvent déjà des oméga-3 : ne pas en ajouter sans avis.",
  ],

  appeler: [
    'Mange moins ou refuse depuis 24 à 48 h',
    'Perd du poids ou du muscle',
    'Vomissements ou diarrhée',
    'Semble abattu ou souffrant',
  ],
  suivi: [
    "Pesée et note d'état corporel et musculaire à chaque visite.",
    "Noter chaque jour ce qu'il mange.",
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Recovery', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet ONC Care", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets CN Convalescence', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Gras 50-60 % des kcal', 'Protéines 30-45 % MS', 'EPA 40 mg/kg/j', 'DHA 25 mg/kg/j'],
      chat: ['Gras 50-60 % des kcal', 'Protéines 40-50 % MS', 'EPA 40 mg/kg/j', 'DHA 25 mg/kg/j'],
    },
    notes: [
      'Protéines : au moins 5,14 g/100 kcal, idéalement 6 à 7 g/100 kcal.',
      "Huile de poisson : environ 1 capsule de 1 g par 10 lb (4,5 kg) de poids.",
      "Stimulants d'appétit : effet imprévisible ; une sonde est préférable si l'animal ne mange pas assez.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 48',
  ],
}

export default function NutritionCancer() {
  return <FicheNutrition fiche={FICHE} />
}
