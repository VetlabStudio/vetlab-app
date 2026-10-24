import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: "Ralentir la maladie, éviter les crises et garder l'appétit.",
  pourQui: 'maladie rénale chronique confirmée, dès le stade IRIS 2.',

  messages: [
    { titre: "C'est un traitement", texte: 'Prouvé : moins de crises et une vie plus longue.' },
    { titre: 'Seulement cette nourriture', texte: "Autres aliments et gâteries ordinaires réduisent l'effet." },
    { titre: "Beaucoup d'eau", texte: 'Nourriture humide et eau fraîche à plusieurs endroits.' },
  ],

  privilegier: ['Diète rénale', 'Nourriture humide', 'Eau fraîche, fontaine', 'Gâteries rénales'],
  eviter: ['Fromage, charcuterie', 'Os, viandes séchées', 'Restes de table', 'Suppléments non prescrits'],

  alertes: [
    { titre: 'Jamais pendant une crise', texte: "L'animal nauséeux peut associer la nourriture à son malaise et la refuser pour toujours. Attendre qu'il soit stable." },
    { titre: 'Manger passe avant la diète', texte: "S'il refuse, mieux vaut qu'il mange autre chose que rien, surtout le chat." },
  ],

  transition: { duree: '7 jours ou plus' },
  pratique: [
    "Plus lentement si l'animal hésite : la transition peut prendre 3 à 4 semaines.",
    "Pour l'appétit : réchauffer, ajouter un bouillon faible en sel ou du jus de thon (dans l'eau). Jamais d'ail.",
    "Plusieurs petits repas plutôt qu'un gros ; bol large et plat pour le chat.",
  ],

  appeler: [
    'Refuse de manger plus de 24 h',
    'Vomit, a la diarrhée ou bave',
    'Boit ou urine beaucoup plus',
    'Semble abattu ou maigrit',
  ],
  suivi: [
    'Prise de sang 4 à 6 semaines après le changement, puis selon le vétérinaire.',
    'Pesée et pression artérielle à chaque visite.',
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Renal', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet k/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets NF Renal Function', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Protéines 14-20 % MS', 'Phosphore réduit', 'Sodium ≤ 0,3 % MS', 'Oméga-3 0,4-2,5 % MS'],
      chat: ['Protéines 28-35 % MS', 'Phosphore 0,3-0,6 % MS', 'Sodium ≤ 0,4 % MS', 'Oméga-3 0,4-2,5 % MS'],
    },
    notes: [
      'Diète recommandée dès une créatinine au-dessus de 2,0 mg/dL, sans attendre les signes d\'urémie.',
      'Phosphore sanguin visé au stade IRIS 2 : 0,9 à 1,5 mmol/L. Si la diète seule ne suffit pas, le vétérinaire peut ajouter un chélateur du phosphore.',
      'Chien avec protéinurie (RPCU > 0,5) : la diète rénale fait partie du traitement, peu importe le stade.',
      "Chat : surveiller l'albumine et la masse musculaire. Une restriction protéique trop forte fait fondre les muscles.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 54',
    'IRIS, recommandations de traitement (iris-kidney.com)',
    'Ross et coll., JAVMA 2006',
    'Elliott et coll., JSAP 2000',
  ],
}

export default function NutritionRenale() {
  return <FicheNutrition fiche={FICHE} />
}
