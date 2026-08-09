import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'Comment ça fonctionne',
    icone: 'ti-help-circle',
    paragraphes: [
      'ADJUVET regroupe des calculateurs, des fiches médicaments, des protocoles de laboratoire et des guides de référence pour vous accompagner au quotidien.',
    ],
    liste: [
      'Calcul rapide : calculez une dose à partir du poids, de la posologie et de la concentration.',
      'Pharmacologie : consultez les fiches médicaments par catégorie, ajoutez vos favoris.',
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
        q: 'Comment s\'abonner au forfait Pro ?',
        a: 'Allez dans Profil, puis choisissez le forfait mensuel ou annuel et complétez le paiement directement dans l\'application (paiement sécurisé via Stripe).',
      },
      {
        q: 'Comment annuler mon abonnement Pro ?',
        a: 'Dans Profil, appuyez sur "Gérer mon abonnement" — vous serez redirigé vers le portail Stripe où vous pouvez annuler ou modifier votre abonnement. L\'accès Pro reste actif jusqu\'à la fin de la période déjà payée.',
      },
      {
        q: 'Qu\'est-ce qui est inclus dans le forfait Pro ?',
        a: 'Le Pro donne accès à l\'ensemble du contenu avancé de l\'application : personnalisation de médicaments et des protocoles de laboratoire, références en pharmacologie, laboratoire et chirurgie, ainsi que les outils cliniques comme Démarrer un examen et le Monitoring anesthésique en temps réel (avec génération de rapports PDF).',
      },
      {
        q: 'Si je me désabonne, est-ce que je perds mes données Pro ?',
        a: 'Non. Vos médicaments personnalisés, protocoles et examens restent enregistrés. Ils redeviennent simplement accessibles si vous vous réabonnez avec le même compte.',
      },
      {
        q: 'Comment ajouter un médicament à mes favoris ?',
        a: 'Sur la fiche d\'un médicament, appuyez sur l\'icône en forme d\'étoile. Vos favoris sont accessibles rapidement dans l\'onglet "Médicaments favoris" de la barre de navigation.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Dans Profil, utilisez l\'option de suppression de compte. Cette action est définitive et supprime toutes vos données.',
      },
      {
        q: 'Mes informations sont-elles privées ?',
        a: 'Oui. Vos données sont liées uniquement à votre compte et ne sont jamais vendues. Consultez la Politique de confidentialité pour plus de détails.',
      },
    ],
  },
  {
    titre: 'Problème ou suggestion',
    icone: 'ti-message-2',
    paragraphes: [
      'Vous avez trouvé une erreur, une information à corriger ou une idée d\'amélioration ? Écrivez-nous, on est à l\'écoute !',
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
