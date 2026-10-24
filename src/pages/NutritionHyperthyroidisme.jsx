import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chat'],
  objectif: 'Contrôler la thyroïde par la nourriture, ou soutenir le chat pendant et après son traitement.',
  pourQui: 'chat hyperthyroïdien, selon le traitement choisi avec le vétérinaire.',

  messages: [
    { titre: 'Diète iodée : seulement elle', texte: 'Aucune gâterie, aucune autre nourriture, aucune chasse.' },
    { titre: 'Un effet en quelques semaines', texte: 'La T4 se normalise généralement en 8 à 12 semaines.' },
    { titre: 'Des prises de sang régulières', texte: 'Pour suivre la thyroïde et les reins.' },
  ],

  privilegier: ['Diète à iode limité, seule', 'Eau du robinet ou distillée', 'Repas à part des autres chats', 'Conserve de la même diète'],
  eviter: ['Gâteries, restes, lait', 'Nourriture des autres chats', 'Chasse et sorties non surveillées', 'Eau de puits'],

  alertes: [
    { titre: "Une seule bouchée d'autre chose suffit", texte: 'La diète ne fonctionne plus : aucune exception.' },
    { titre: 'Les reins peuvent se révéler', texte: 'Une maladie rénale cachée peut apparaître une fois la thyroïde contrôlée.' },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    'Plusieurs chats : nourrir le chat traité à part et ramasser les restes.',
    'Chat amaigri : demander au vétérinaire comment l\'aider à reprendre du poids.',
    'Après un traitement (médicament, chirurgie, iode radioactif), les besoins baissent : réévaluer la portion.',
  ],

  appeler: [
    'Maigrit encore malgré le traitement',
    'Vomissements ou diarrhée',
    'Boit ou urine beaucoup plus',
    'Mange moins ou semble abattu',
  ],
  suivi: [
    'Prises de sang (T4 et reins) selon le vétérinaire.',
    'Pesée à chaque visite.',
  ],

  dietes: [
    { nom: "Hill's Prescription Diet y/d Thyroid Care", img: '/logo-hills.jpg' },
  ],

  equipe: {
    reperes: {
      chat: ['Iode ≤ 0,32 ppm MS', 'T4 normalisée en 8-12 sem.', 'Protéines élevées', 'Oméga-3 (EPA, DHA)'],
    },
    notes: [
      'La diète ne stoppe pas la croissance du tissu thyroïdien anormal.',
      'Chats à T4 très élevée : normalisation plus lente, parfois incomplète.',
      "Dans une étude d'un an, la majorité des chats nourris exclusivement à la diète gardaient une T4 normale.",
    ],
  },

  sources: [
    "Tufts Petfoodology, gérer l'hyperthyroïdie par l'alimentation",
    "Étude d'un an sur une diète à iode limité (Veterinary Medicine: Research and Reports, vol. 10)",
  ],
}

export default function NutritionHyperthyroidisme() {
  return <FicheNutrition fiche={FICHE} />
}
