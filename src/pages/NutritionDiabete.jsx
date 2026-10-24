import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Une glycémie stable, grâce à une routine de repas constante et un poids santé.',
  pourQui: "chien ou chat diabétique traité à l'insuline.",

  messages: [
    { titre: 'La même routine chaque jour', texte: 'Même nourriture, même quantité, aux mêmes heures.' },
    { titre: "Repas, puis insuline", texte: "S'il mange peu ou pas, appeler avant de donner l'insuline." },
    { titre: 'Viser un poids santé', texte: 'Chez le chat, la perte de poids peut mener à la rémission.' },
  ],

  privilegier: ['Diète diabétique vétérinaire', 'Chat : riche en protéines, pauvre en glucides', 'Chien : riche en fibres', 'Repas aux mêmes heures'],
  eviter: ['Gâteries non prévues', 'Restes de table', 'Changer de nourriture sans avis', 'Nourriture à volonté'],

  alertes: [
    { titre: 'Ne pas changer la nourriture sans avis', texte: "Un changement de diète peut modifier la dose d'insuline nécessaire." },
    { titre: 'Baisse de sucre (hypoglycémie)', texte: 'Faiblesse, tremblements ou convulsions : urgence, appeler tout de suite.' },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    "Changer de nourriture seulement avec le vétérinaire, qui ajuste l'insuline au besoin.",
    "Mesurer chaque repas (balance de cuisine) et noter ce qu'il a mangé.",
    'Chat en surpoids : nourriture humide pauvre en glucides et perte de poids lente (0,5 à 2 % par semaine).',
  ],

  appeler: [
    'Mange peu ou pas du tout',
    'Faiblesse, tremblements, démarche ivre',
    "Boit ou urine plus qu'avant",
    'Vomissements ou abattement',
  ],
  suivi: [
    'Pesée au moins une à deux fois par mois.',
    'Courbes de glycémie et contrôles selon le vétérinaire.',
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Diabetic', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet w/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets DM Diabetes Management', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Glucides ≤ 55 % MS', 'Fibres 7-18 % MS', 'Gras < 25 % MS', 'Maigrir : 1-2 %/sem.'],
      chat: ['Glucides < 20 % MS', 'Protéines élevées', 'Maigrir : 0,5-2 %/sem.'],
    },
    notes: [
      'Calculer les besoins sur la masse maigre et viser un BCS de 4-5/9.',
      "Chat : une diète pauvre en glucides augmente les chances de rémission ; surveiller les hypoglycémies quand les besoins en insuline baissent.",
      "L'obésité cause une résistance à l'insuline : perdre du poids améliore le contrôle de la glycémie.",
    ],
  },

  sources: [
    'AAHA 2018, lignes directrices sur le diabète (mise à jour 2022) : gestion alimentaire',
  ],
}

export default function NutritionDiabete() {
  return <FicheNutrition fiche={FICHE} />
}
