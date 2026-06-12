import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'Comment ça fonctionne',
    icone: 'ti-help-circle',
    paragraphes: [
      'ADJUVET regroupe des calculateurs, des fiches médicaments, des protocoles de laboratoire et des guides de référence pour t\'accompagner au quotidien.',
    ],
    liste: [
      'Calcul rapide : calcule une dose à partir du poids, de la posologie et de la concentration.',
      'Pharmacologie : consulte les fiches médicaments par catégorie, ajoute tes favoris.',
      'Laboratoire et Chirurgie : protocoles, guides et valeurs de référence.',
      'Le forfait Pro donne accès aux contenus avancés (médicaments personnalisés, protocoles, toxicologie, examens, etc.).',
    ],
  },
  {
    titre: 'Foire aux questions',
    icone: 'ti-help-square-rounded',
    paragraphes: [],
    faq: [
      {
        q: 'Comment m\'abonner au forfait Pro ?',
        a: 'Va dans Profil, puis choisis le forfait mensuel ou annuel et complète le paiement directement dans l\'application (paiement sécurisé via Stripe).',
      },
      {
        q: 'Comment annuler mon abonnement Pro ?',
        a: 'Dans Profil, appuie sur "Gérer mon abonnement" — tu seras redirigé vers le portail Stripe où tu peux annuler ou modifier ton abonnement. L\'accès Pro reste actif jusqu\'à la fin de la période déjà payée.',
      },
      {
        q: 'Qu\'est-ce qui est inclus dans le forfait Pro ?',
        a: 'Le Pro donne accès aux contenus avancés : toxicologie, médicaments personnalisés, protocoles de laboratoire et chirurgie complets (sédiments, cytologie, microbiologie, biochimie, instruments, monitoring, ECG, etc.) et le module Démarrer un examen.',
      },
      {
        q: 'Si je me désabonne, est-ce que je perds mes données Pro ?',
        a: 'Non. Tes médicaments personnalisés, protocoles et examens restent enregistrés. Ils redeviennent simplement accessibles si tu te réabonnes avec le même compte.',
      },
      {
        q: 'Comment ajouter un médicament à mes favoris ?',
        a: 'Sur la fiche d\'un médicament, appuie sur l\'icône en forme d\'étoile/cœur. Tes favoris sont accessibles rapidement dans l\'onglet "Médicaments favoris" de la barre de navigation.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Dans Profil, utilise l\'option de suppression de compte. Cette action est définitive et supprime toutes tes données.',
      },
      {
        q: 'Mes informations sont-elles privées ?',
        a: 'Oui. Tes données sont liées uniquement à ton compte et ne sont jamais vendues. Consulte la Politique de confidentialité pour plus de détails.',
      },
    ],
  },
  {
    titre: 'Problème ou suggestion',
    icone: 'ti-message-2',
    paragraphes: [
      'Tu as trouvé une erreur, une information à corriger ou une idée d\'amélioration ? Écris-nous, on est à l\'écoute !',
    ],
  },
  {
    titre: 'Nous contacter',
    icone: 'ti-mail',
    paragraphes: [],
    lien: { href: 'mailto:info@vetlabstudio.ca', label: 'info@vetlabstudio.ca' },
  },
]

export default function Aide() {
  return <PageInfo sections={SECTIONS} />
}
