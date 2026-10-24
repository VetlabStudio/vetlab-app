import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Une croissance régulière, ni trop rapide ni trop grasse.',
  pourQui: 'chiots et chatons, du sevrage à la taille adulte.',

  messages: [
    { titre: 'Nourriture de croissance adaptée', texte: 'Grande race : formule « grande race », pour protéger les os.' },
    { titre: 'Des portions mesurées', texte: 'Ajustées selon la silhouette, pas seulement selon le sac.' },
    { titre: 'Une silhouette mince', texte: 'Côtes faciles à sentir : un chiot gras grandit trop vite.' },
  ],

  privilegier: ['Formule chiot ou chaton', 'Formule grande race si gros chien', 'Portions mesurées', 'Gâteries : moins de 10 %'],
  eviter: ['Suppléments de calcium', 'Chiot nourri à volonté', 'Nourriture adulte trop tôt', 'Lait de vache'],

  alertes: [
    { titre: 'Aucun calcium ajouté', texte: "Surtout en grande race : l'excès de calcium nuit aux os et aux articulations." },
    { titre: 'Chat stérilisé : réduire la ration', texte: "Les besoins baissent d'environ 25 % dès la stérilisation." },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    'Chiot : 2 à 4 repas mesurés par jour, jamais à volonté.',
    "Chaton : à volonté possible ; repas mesurés s'il y a d'autres chats ou un risque d'embonpoint.",
    'Passage à la nourriture adulte : petite race vers 8-12 mois, moyenne 12-18 mois, grande et géante 18-24 mois ; chaton vers 10-12 mois.',
    'Petites races : plusieurs petits repas par jour pour éviter les baisses de sucre.',
  ],

  appeler: [
    'Boiterie ou douleur aux pattes',
    'Diarrhée ou vomissements plus de 24 h',
    'Ne prend pas de poids',
    'Petite race faible ou tremblante',
  ],
  suivi: [
    'Chiot : peser chaque semaine ; silhouette vérifiée idéalement toutes les 2 semaines.',
    "Chaton : peser chaque mois jusqu'à 4-5 mois, aux visites de vaccins.",
  ],

  dietes: [
    { nom: 'Royal Canin Mini / Medium / Maxi Puppy (ou Kitten)', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Science Diet Puppy ou Kitten", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Puppy ou Kitten', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['BCS 4-5/9 (grande race : 4/9)', 'Protéines 22-32 % MS', 'Gras 10-25 % MS', 'Grande race : Ca 0,7-1,2 % MS', 'Grande race : P 0,6-1,1 % MS'],
      chat: ['BCS 4-5/9', 'Gras 18-35 % MS', 'Ca:P 1,1:1 à 1,5:1', '~200 kcal/kg/jour vers 10 sem.', 'Stérilisation : -24 à 33 %'],
    },
    notes: [
      "Facteur de croissance du chiot : x3 jusqu'à 50 % du poids adulte, x2,5 de 50 à 80 %, x1,8 à 2 au-delà.",
      'Petite et moyenne race : Ca 0,7-1,7 % MS, Ca:P 1:1 à 1,8:1. Grande race : Ca:P 1:1 à 1,5:1.',
      'Étude sur des Labradors : 25 % de nourriture en moins a donné 2 ans de vie de plus et une arthrose plus tardive.',
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 27 et 28',
    'VCA, chiots de grande et très grande race',
    'Tufts Petfoodology, passer à la nourriture adulte',
  ],
}

export default function NutritionCroissance() {
  return <FicheNutrition fiche={FICHE} />
}
