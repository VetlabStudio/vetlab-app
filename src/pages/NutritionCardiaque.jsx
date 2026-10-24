import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: "Limiter le sel sans couper l'appétit, et garder le poids et le muscle.",
  pourQui: 'chien ou chat avec une maladie cardiaque, selon le stade établi par le vétérinaire.',

  messages: [
    { titre: 'Moins de sel, surtout dans les extras', texte: 'Fromage, charcuterie et gâteries sont les pires sources.' },
    { titre: "Garder l'appétit", texte: 'Un animal qui mange bien garde son muscle.' },
    { titre: 'Nourriture choisie avec le vétérinaire', texte: 'Certaines nourritures « sans grains » sont associées à des maladies du cœur chez le chien.' },
  ],

  privilegier: ['Diète cardiaque vétérinaire', 'Gâteries faibles en sel', 'Repas appétissants', 'Pesée régulière'],
  eviter: ['Fromage, charcuterie, pain', 'Restes de table', 'Gâteries salées', 'Pilules cachées dans du fromage'],

  alertes: [
    { titre: 'Pas de restriction trop forte trop tôt', texte: "Au stade précoce, une baisse légère du sel suffit ; trop restreindre peut couper l'appétit." },
    { titre: 'Chien avec cardiomyopathie dilatée', texte: "Faire vérifier la taurine, surtout s'il mangeait une nourriture sans grains." },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    "Introduire la diète graduellement et vérifier qu'il mange bien.",
    'Pour les pilules, utiliser un aliment faible en sel prévu pour ça plutôt que du fromage ou de la viande froide.',
    'Peser régulièrement : une perte de muscle est un signe à signaler.',
  ],

  appeler: [
    'Toux, respiration rapide ou difficile',
    'Mange moins ou perd du poids',
    'Ventre gonflé',
    'Faiblesse ou évanouissement',
  ],
  suivi: [
    'Contrôles et prises de sang selon le vétérinaire (potassium sous diurétiques).',
    'Compter la respiration au repos à la maison, selon les consignes du vétérinaire.',
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Canine Early Cardiac', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet h/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets CC CardioCare', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Stade B2 : Na 80-99 mg/100 kcal', 'Sodium 0,08-0,25 % MS', 'EPA 40 mg/kg/j + DHA 25 mg/kg/j', 'BCS 4-5/9'],
      chat: ['Sodium 0,07-0,3 % MS', 'Restriction graduelle', 'BCS 4-5/9'],
    },
    notes: [
      'Stades A et B1 (ACVIM) : aucun changement alimentaire recommandé.',
      'Stade B2 : sodium légèrement réduit, gâteries comprises, avec une diète appétissante qui apporte assez de protéines et de calories.',
      'Sous diurétiques : surveiller le potassium. Cachexie cardiaque : maintenir protéines et calories, oméga-3 en soutien.',
    ],
  },

  sources: [
    'ACVIM, consensus sur la maladie valvulaire mitrale (Keene et coll., JVIM 2019)',
    'Veterinary Practice News, nutrition et maladie valvulaire mitrale',
  ],
}

export default function NutritionCardiaque() {
  return <FicheNutrition fiche={FICHE} />
}
