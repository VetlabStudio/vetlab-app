import FicheNutrition from '../components/FicheNutrition'

const FICHE = {
  especes: ['chien', 'chat'],
  objectif: "Laisser l'intestin récupérer avec une nourriture très digestible, sans jeûne prolongé.",
  pourQui: 'vomissements, diarrhée, pancréatite ou insuffisance pancréatique, selon le diagnostic.',

  messages: [
    { titre: 'Nourriture très digestible', texte: 'Diète gastro-intestinale vétérinaire, en petits repas.' },
    { titre: 'Pas de jeûne prolongé', texte: 'On recommence à nourrir tôt, en petites quantités.' },
    { titre: 'Aucun repas gras', texte: 'Restes de table et gras peuvent déclencher une pancréatite.' },
  ],

  privilegier: ['Diète gastro-intestinale', 'Petits repas, 4 à 6 par jour', 'Nourriture tiède', 'Eau fraîche en tout temps'],
  eviter: ['Restes de table et aliments gras', 'Gâteries et os', 'Changements fréquents de nourriture', 'Jeûne prolongé'],

  alertes: [
    { titre: 'Pancréatite', texte: 'Nourriture faible en gras, et aucun écart, même une seule fois.' },
    { titre: 'Insuffisance pancréatique (IPE)', texte: 'Enzymes en poudre mêlées à chaque repas, à vie, et vitamine B12 par la clinique.' },
  ],

  pratique: [
    'Pendant un épisode : diète gastro-intestinale dès le début. Une fois guéri, retour à la nourriture habituelle sur 7 jours, selon le vétérinaire.',
    'Servir la nourriture entre la température de la pièce et celle du corps (21 à 38 °C).',
    "IPE : mélanger la poudre d'enzymes à la nourriture juste avant le repas ; plusieurs petits repas.",
    'Chien à museau court (bouledogue, carlin) : petits repas fréquents, nourriture humide ou faible en gras, bol incliné et poids santé.',
  ],

  appeler: [
    'Vomissements répétés ou sang dans les selles',
    'Ne mange plus ou semble abattu',
    'Ventre douloureux ou gonflé',
    "Diarrhée qui ne s'améliore pas en 2 à 3 jours",
  ],
  suivi: [
    'Contrôle et pesée selon le vétérinaire.',
    'IPE : dosage de la vitamine B12 selon le vétérinaire.',
  ],

  dietes: [
    { nom: 'Royal Canin Veterinary Diet Gastrointestinal Low Fat', img: '/logo-royal-canin.jpg' },
    { nom: "Hill's Prescription Diet i/d", img: '/logo-hills.jpg' },
    { nom: 'Purina Pro Plan Veterinary Diets EN Gastrointestinal', img: '/logo-purina.jpg' },
  ],

  equipe: {
    reperes: {
      chien: ['Digestibilité ≥ 85 %', 'Pancréatite : gras < 15 % MS', 'Obèse ou lipides élevés : ≤ 10 % MS', 'Protéines 15-30 % MS', 'Fibres ≤ 5 % MS'],
      chat: ['Digestibilité ≥ 85 %', 'Pancréatite : gras < 25 % MS', 'Obèse ou lipides élevés : ≤ 15 % MS', 'Protéines 30-40 % MS', 'Fibres ≤ 5 % MS'],
    },
    notes: [
      "IPE : digestibilité ≥ 90 % (gras et glucides) et ≥ 87 % (protéines) ; gras 10-15 % MS (chien), 15-25 % MS (chat). Animal maigre : 2 x RER au poids idéal jusqu'au poids visé.",
      'IPE : B12 en injection chaque semaine pendant 6 semaines si elle est basse (chien 250-1200 µg, chat 100-250 µg).',
      "Éviter les fibres solubles gélifiantes (gommes, pectines) : elles ralentissent la vidange de l'estomac.",
    ],
  },

  sources: [
    'Wortinger et Burns, Nutrition and Disease Management for Veterinary Technicians and Nurses, 3e éd., chap. 50, 51 et 55',
    "Today's Veterinary Practice, nutrition et pancréatite (ACVN)",
    'MSD Vet Manual, insuffisance pancréatique exocrine',
  ],
}

export default function NutritionGastroIntestinal() {
  return <FicheNutrition fiche={FICHE} />
}
