import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Limiter la plaque et le tartre pour prévenir la maladie des gencives.',
  pourQui: 'tous les chiens et chats, surtout après un détartrage.',

  messages: [
    { titre: "Le brossage, c'est le meilleur", texte: 'Idéalement chaque jour ; quelques fois par semaine aide déjà.' },
    { titre: 'Chercher le sceau VOHC', texte: 'Diètes et gâteries testées pour réduire plaque et tartre.' },
    { titre: "Pas d'os durs ni de bois de cerf", texte: 'Ils peuvent casser les dents.' },
  ],

  privilegier: ['Brossage, dentifrice pour animaux', 'Diète dentaire VOHC', 'Gâteries VOHC, moins de 10 %', 'Habituer dès le jeune âge'],
  eviter: ['Os, bois de cerf, sabots', 'Jouets très durs', 'Dentifrice pour humains', "Produits sans preuve d'efficacité"],

  alertes: [
    { titre: 'Les croquettes ordinaires ne nettoient pas', texte: 'Seules les diètes testées (sceau VOHC) ont un effet prouvé.' },
    { titre: 'Mauvaise haleine : consulter', texte: "C'est souvent un signe de maladie des gencives, qui fait mal." },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    'Habituer peu à peu : toucher la bouche, frotter avec une gaze, puis passer à la brosse.',
    'Brosser à 45° vers la gencive, avec de petits cercles.',
    'Après un traitement, le vétérinaire peut prescrire un gel à la chlorhexidine pour quelques jours.',
  ],

  appeler: [
    'Mauvaise haleine marquée',
    'Gencives rouges ou qui saignent',
    "Mâche d'un côté ou laisse tomber sa nourriture",
    'Dent cassée ou qui bouge',
  ],
  suivi: [
    'Examen de la bouche à chaque visite, au moins une fois par année.',
    'Détartrage selon le vétérinaire.',
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Canine Dental', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet t/d", img: '/logo-hills.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Protéines 16-35 % MS', 'Ca 0,5-1,5 % MS', 'Vit. E ≥ 400 UI/kg MS', 'Gâteries ≤ 10 % kcal'],
      chat: ['Protéines 30-50 % MS', 'Ca 0,5-1,5 % MS', 'Vit. E ≥ 500 UI/kg MS', 'Gâteries ≤ 10 % kcal'],
    },
    notes: [
      'La gingivite est réversible ; la parodontite ne l\'est pas.',
      'Chlorhexidine à 0,1-0,2 % : efficace contre la plaque, peut tacher les dents.',
      'Les polyphosphates (hexamétaphosphate) réduisent le tartre, pas la plaque.',
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 49',
    'Veterinary Oral Health Council (vohc.org)',
  ],
}

export default function NutritionDentaire() {
  return <FicheNutrition fiche={FICHE} />
}
