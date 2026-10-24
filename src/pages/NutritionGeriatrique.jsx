import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Garder un poids santé et la masse musculaire, et repérer tôt les changements.',
  pourQui: 'chien senior selon sa taille (5 à 9 ans) ou chat de 10 ans et plus, en santé.',

  messages: [
    { titre: 'Ne pas couper les protéines', texte: 'Un senior en santé en a besoin pour garder ses muscles.' },
    { titre: 'Surveiller le poids', texte: 'Le chien a tendance à grossir, le chat âgé à maigrir.' },
    { titre: 'Examen deux fois par année', texte: "Pour repérer tôt les maladies fréquentes avec l'âge." },
  ],

  privilegier: ['Nourriture adulte de qualité', 'Portions mesurées', 'Nourriture humide (chat)', 'Exercice modéré, soins des dents'],
  eviter: ['Diète rénale sans maladie rénale', 'Changements brusques', 'Suppléments non prescrits', 'Ignorer une perte de poids'],

  alertes: [
    { titre: "Une perte de poids n'est jamais « normale »", texte: 'Elle peut cacher une maladie (reins, thyroïde, dents). Consulter.' },
    { titre: 'Une maladie présente passe en premier', texte: 'Nourrir selon la maladie la plus grave (reins, cœur, diabète).' },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    "Une nourriture « senior » n'est pas obligatoire si l'animal est en santé et garde son poids.",
    'Animal difficile : réchauffer la nourriture ou ajouter un peu de bouillon faible en sel.',
    'Animal trop mince : nourriture plus calorique (chiot, chaton ou récupération), selon le vétérinaire.',
    "Bol et eau faciles d'accès s'il a de l'arthrose.",
  ],

  appeler: [
    'Perd du poids ou du muscle',
    'Mange moins ou mâche difficilement',
    "Boit ou urine plus qu'avant",
    'Constipation ou diarrhée répétées',
  ],
  suivi: [
    'Examen de santé au moins deux fois par année.',
    "Pesée et note d'état corporel et musculaire à chaque visite.",
  ],

  dietes: [
    { nom: 'Royal Canin, gamme Senior / Mature adaptée à la taille', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Science Diet Senior / Mature", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Senior', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['BCS visé 4/9', "Énergie : jusqu'à -30 à 40 %", 'Protéines : au-dessus du minimum adulte'],
      chat: ['BCS visé 4-5/9', 'Énergie : remonte après 10-12 ans', 'Protéines : ne pas restreindre'],
    },
    notes: [
      'Âge senior : petite race 8-9 ans, moyenne 7 ans, grande 6 ans, géante 5 ans ; chat 10-12 ans.',
      "Restreindre les protéines ne protège pas les reins d'un animal en santé et fait perdre du muscle.",
      "Chat : jusqu'à 33 % de masse maigre perdue entre 10 et 15 ans ; la digestion des gras peut aussi baisser.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 31',
    'AAHA 2023, soins des seniors : nutrition',
    'AAHA 2021, chats matures et seniors',
  ],
}

export default function NutritionGeriatrique() {
  return <FicheNutrition fiche={FICHE} />
}
