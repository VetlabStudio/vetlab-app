import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Chaleur, colostrum et lait en quantité suffisante pour un gain de poids régulier.',
  pourQui: 'nouveau-nés de 0 à 2 semaines, orphelins ou dont la mère manque de lait.',

  messages: [
    { titre: "Le colostrum d'abord", texte: "Téter dans les 24 premières heures : il transmet l'immunité." },
    { titre: 'Toujours au chaud', texte: 'Un petit froid ne digère pas : le réchauffer avant de nourrir.' },
    { titre: 'Un lait pour chiot ou chaton', texte: 'Jamais de lait de vache ou de chèvre.' },
  ],

  privilegier: ['Lait de remplacement chiot ou chaton', 'Biberon, petit couché sur le ventre', 'Lait tiède, environ 38 °C', 'Pesée chaque jour'],
  eviter: ['Lait de vache ou de chèvre', 'Recette de lait maison', 'Nourrir un petit froid', 'Lait préparé laissé à la température ambiante'],

  alertes: [
    { titre: 'Ne jamais nourrir un petit froid', texte: "Le réchauffer lentement d'abord, puis consulter." },
    { titre: 'Mieux vaut un peu moins que trop', texte: 'Trop de lait cause diarrhée et fausses routes.' },
  ],

  pratique: [
    'Première semaine : un boire environ toutes les 2 heures, jour et nuit ; ensuite plus espacés.',
    "Après chaque boire, stimuler le pipi et les selles avec une ouate, puis bien sécher (jusqu'à 16 à 21 jours).",
    "Préparer seulement le lait d'une journée et le garder au réfrigérateur.",
    'Bouillie de nourriture chiot ou chaton vers 3 à 4 semaines, retirée après 20 à 30 minutes.',
  ],

  appeler: [
    'Ne prend pas de poids ou en perd',
    'Tète faiblement ou refuse le biberon',
    'Froid au toucher ou pleure sans arrêt',
    'Diarrhée, lait par le nez ou toux',
  ],
  suivi: [
    'Peser chaque jour à la même heure, sur une balance de cuisine en grammes.',
    'Contrôle à la clinique selon le vétérinaire.',
  ],

  dietes: [
    { nom: 'Royal Canin Babydog Milk (chiot)', img: '/logo-royal-canin.jpg' },
    { nom: 'Royal Canin Babycat Milk (chaton)', img: '/logo-royal-canin.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Lait 13-18 mL/100 g/jour', 'Eau 132-220 mL/kg/jour', '1 g de gain par 2-5 g de lait'],
      chat: ['Lait 13-18 mL/100 g/jour', 'Eau 155-230 mL/kg/jour', 'Gain ~18-20 g/jour'],
    },
    notes: [
      'Température ambiante : 29-32 °C (sem. 1), 26-29 °C (sem. 2), 23-26 °C (sem. 3), 23 °C (sem. 4).',
      "Lait de remplacement : environ 1 kcal/mL. Volume par repas : environ 4 mL/100 g (capacité de l'estomac).",
      "Le colostrum n'est absorbé que dans les 24 à 72 premières heures.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 26',
    'VCA, nourrir un chaton orphelin',
    "Best Friends, capacité de l'estomac du chaton",
  ],
}

export default function NutritionNeonatologie() {
  return <FicheNutrition fiche={FICHE} />
}
