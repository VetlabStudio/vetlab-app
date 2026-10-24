import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: "Diluer l'urine, dissoudre ou prévenir les calculs et espacer les crises.",
  pourQui: 'cystite idiopathique du chat, calculs ou cristaux urinaires, selon le diagnostic.',

  messages: [
    { titre: "Plus d'eau", texte: 'Nourriture humide, fontaine, eau ajoutée au repas.' },
    { titre: 'Seulement la diète urinaire', texte: "La mélanger à une autre nourriture annule l'effet." },
    { titre: 'Moins de stress (chat)', texte: 'Bacs propres, cachettes, pas de conflits entre chats.' },
  ],

  privilegier: ['Diète urinaire, humide si possible', 'Fontaine, eau à plusieurs endroits', 'Un bac de plus que de chats', 'Changements graduels'],
  eviter: ['Mélanger avec une autre nourriture', 'Gâteries et restes de table', 'Suppléments non prescrits', 'Bacs sales ou couverts'],

  alertes: [
    { titre: 'Chat qui force sans uriner', texte: "Urgence : il peut être bloqué, surtout le mâle. Consulter tout de suite." },
    { titre: 'Oxalate de calcium : pas de dissolution', texte: "Seule la struvite se dissout avec la diète ; l'oxalate doit être retiré." },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    "Ajouter de l'eau ou un bouillon faible en sel au repas ; des glaçons dans l'eau pour certains chats.",
    "Struvite : garder la diète de dissolution environ 1 mois après la disparition du calcul à l'imagerie, puis passer en prévention.",
    "Chien avec struvite : traiter l'infection urinaire en même temps.",
    'Bacs découverts, ramassés chaque jour, répartis sur plusieurs étages.',
  ],

  appeler: [
    "Force pour uriner ou n'urine pas (urgence)",
    "Sang dans l'urine",
    'Urine souvent ou hors de la litière',
    'Se lèche les parties génitales sans arrêt',
  ],
  suivi: [
    "Analyse d'urine et imagerie selon le vétérinaire.",
    "Struvite : imagerie de contrôle pendant la dissolution.",
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Urinary SO', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet c/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets UR Urinary', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Humidité > 60 %', 'Struvite : dissolution ~1 mois', 'Infection traitée en même temps'],
      chat: ['Humidité > 60 %', 'Densité urinaire visée 1,032-1,041', 'Calculs : struvite 50 %, oxalate 37 %'],
    },
    notes: [
      'Cystite idiopathique : la nourriture humide réduit les récidives, tout comme une diète urinaire donnée de façon constante.',
      "Trop acidifier l'urine augmente le risque d'oxalate : ne pas compter seulement sur l'acidification.",
      "Ajouter du sel pour faire boire : à éviter en cas de maladie rénale ou d'hypertension.",
      'Des cristaux sans calcul ne suffisent pas au diagnostic : des chats en santé peuvent en avoir.',
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 56',
    'AAFP, consensus sur les calculs urinaires',
    'ACVIM 2016, consensus sur les calculs urinaires (via Veterinary Practice News)',
  ],
}

export default function NutritionUrinaire() {
  return <FicheNutrition fiche={FICHE} />
}
