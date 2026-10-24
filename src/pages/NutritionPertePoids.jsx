import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Perdre du gras sans perdre de muscle, à un rythme sécuritaire.',
  pourQui: 'chien ou chat en surpoids (10 à 19 % au-dessus du poids idéal) ou obèse (20 % et plus).',

  messages: [
    { titre: 'Peser chaque repas', texte: 'Balance de cuisine : une tasse peut doubler la portion.' },
    { titre: 'Les gâteries comptent', texte: 'Moins de 10 % des calories, retirées de la ration.' },
    { titre: 'Bouger un peu plus', texte: 'Marches courtes ou jeux, augmentés peu à peu.' },
  ],

  privilegier: ['Diète de perte de poids', 'Portions pesées', 'Repas séparés, dans son bol', 'Récompenses sans nourriture'],
  eviter: ['Nourriture à volonté', 'Restes de table', 'Juste réduire la nourriture habituelle', 'Perte de poids trop rapide'],

  alertes: [
    { titre: 'Chat : jamais de diète trop rapide', texte: 'Une perte trop rapide peut causer une maladie grave du foie (lipidose).' },
    { titre: 'Calculer sur le poids idéal', texte: "Pas sur le poids actuel, sinon l'animal ne maigrit pas." },
  ],

  lien: { label: 'Calculer la ration à partir du poids idéal', route: '/calculateurs/besoin' },

  transition: { duree: '7 jours' },
  pratique: [
    'Toute la maison suit le même plan ; idéalement, une seule personne prépare les repas.',
    "Noter tout ce qu'il mange dans un journal, gâteries comprises.",
    'Récompenser par le jeu, les caresses ou la promenade plutôt que par la nourriture.',
  ],

  appeler: [
    'Ne maigrit pas après 4 semaines',
    'Chat qui refuse de manger',
    'Faim excessive ou vole de la nourriture',
    'Fatigue, vomissements ou diarrhée',
  ],
  suivi: [
    'Pesée toutes les 2 à 4 semaines et ajustement de la portion.',
    "Une fois le poids idéal atteint, recalculer la ration d'entretien.",
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Satiety Support Weight Management', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet Metabolic", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets OM Obesity Management', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['RER = 70 x poids idéal^0,75', 'Ration : 1,0 x RER', 'Rythme : 1-2 %/sem.', 'Gâteries ≤ 10 % kcal'],
      chat: ['RER = 70 x poids idéal^0,75', 'Ration : 0,8 x RER', 'Rythme : 0,5-2 %/sem.', 'Gâteries ≤ 10 % kcal'],
    },
    notes: [
      'Chaque point de BCS au-dessus de 5/9 correspond à environ 10 % de surpoids.',
      'Prévention : chien enclin à grossir 1,4 x RER ; chat 1,0 x RER.',
      '10 kcal de trop par jour font prendre près de 0,5 kg par année à un chat de 4,5 kg.',
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 47',
    'AAHA 2021, nutrition et gestion du poids',
    'AAHA 2018, diabète : rythme de perte de poids',
  ],
}

export default function NutritionPertePoids() {
  return <FicheNutrition fiche={FICHE} />
}
