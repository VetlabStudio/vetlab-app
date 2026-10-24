import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: 'Couvrir les besoins de la mère et des petits, sans prise de poids excessive.',
  pourQui: "chienne ou chatte gestante ou qui allaite, jusqu'au sevrage.",

  messages: [
    { titre: 'Nourriture chiot ou chaton', texte: "Plus riche, pour la gestation et l'allaitement." },
    { titre: 'Augmenter peu à peu', texte: 'Chienne : dès la 5e semaine. Chatte : dès la 2e semaine.' },
    { titre: "À volonté pendant l'allaitement", texte: 'Les besoins peuvent doubler ou tripler.' },
  ],

  privilegier: ['Nourriture chiot ou chaton', 'Petits repas fréquents', 'Eau fraîche en tout temps', 'À volonté en lactation'],
  eviter: ['Calcium et suppléments', 'Faire maigrir en gestation', 'Nourriture adulte ou légère', 'Nourriture maison'],

  alertes: [
    { titre: 'Jamais de calcium en gestation', texte: "Il favorise l'éclampsie au pic de lactation (2 à 3 semaines après la mise bas), surtout chez les petites races avec une grosse portée." },
    { titre: 'Une mère qui mange mal ou maigrit', texte: 'Sa production de lait baisse : consulter rapidement.' },
  ],

  transition: { duree: '7 jours' },
  pratique: [
    'Idéalement, passer à la nourriture chiot ou chaton avant la saillie, pour éviter un changement brusque ensuite.',
    'Chienne : +15 % de nourriture par semaine dès la 5e semaine, soit environ 60 % de plus à la mise bas.',
    "Chatte : augmenter graduellement dès la 2e semaine ; à volonté pendant la gestation et l'allaitement.",
    'En fin de gestation, des repas plus petits et plus fréquents : le ventre est plein.',
    "Après le sevrage (6 à 8 semaines), réduire la portion jusqu'aux quantités d'avant la saillie.",
  ],

  appeler: [
    'La mère mange peu ou maigrit',
    'Tremblements, raideur ou halètement pendant l\'allaitement',
    'Les petits pleurent beaucoup ou ne prennent pas de poids',
    'La mère ne mange plus en fin de gestation',
  ],
  suivi: [
    'Peser la mère chaque semaine.',
    'Peser les petits chaque jour : leur prise de poids est le meilleur signe que le lait suffit.',
  ],

  dietes: [
    { nom: 'Royal Canin Starter Mother & Babydog', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Science Diet Puppy ou Kitten", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Puppy ou Kitten', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['+15 %/sem. dès la sem. 5', 'Lactation : 2-4 x les besoins', 'Protéines 25-35 % MS', 'Gras ≥ 20 % MS', 'Ca:P 1,1:1 à 2:1'],
      chat: ['RER x 1,6 puis x 2 à terme', 'Lactation : 2-3 x les besoins', 'Protéines 35-50 % MS', 'Gras 18-35 % MS', 'Prise de poids ~40 %'],
    },
    notes: [
      'Avant la saillie : BCS 4-5/9. Chatte : ne pas faire reproduire si BCS ≤ 3/9 ou > 6/9.',
      'Chienne : prise de poids de 15 à 25 % ; pic de lactation 3 à 5 semaines après la mise bas.',
      "Chienne en lactation : besoin en eau d'environ 1 mL par kcal.",
      "Éclampsie : le calcium se donne à la mise bas sur avis vétérinaire, jamais avant.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 24 et 25',
    'MSD Vet Manual, éclampsie',
    'dvm360, pas de calcium pendant la gestation',
  ],
}

export default function NutritionGestationLactation() {
  return <FicheNutrition fiche={FICHE} />
}
