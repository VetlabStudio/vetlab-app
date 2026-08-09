import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'Données collectées',
    icone: 'ti-database',
    paragraphes: [
      'Pour fonctionner, ADJUVET collecte et conserve les informations suivantes liées à votre compte :',
    ],
    liste: [
      'Adresse courriel et nom (pour l\'authentification et le profil)',
      'Informations d\'abonnement (forfait Gratuit ou Pro)',
      'Médicaments favoris, médicaments personnalisés, notes et historiques d\'examens que vous créez dans l\'application',
    ],
  },
  {
    titre: 'Utilisation des données',
    icone: 'ti-settings',
    paragraphes: [
      'Ces données sont utilisées uniquement pour faire fonctionner l\'application (sauvegarder votre contenu, gérer votre abonnement, vous donner accès aux fonctionnalités selon votre forfait).',
      'Aucune donnée n\'est vendue à des tiers.',
    ],
  },
  {
    titre: 'Stockage et sécurité',
    icone: 'ti-lock',
    paragraphes: [
      'Les données sont hébergées de façon sécurisée via Supabase. Les paiements sont traités par Stripe — ADJUVET n\'a pas accès à vos informations de carte de crédit.',
    ],
  },
  {
    titre: 'Vos droits',
    icone: 'ti-user-check',
    paragraphes: [
      'Vous pouvez modifier ou supprimer votre compte et vos données à tout moment depuis la page Profil. Pour toute question, écrivez-nous à info@vetlabstudio.ca.',
    ],
  },
  {
    titre: 'Conservation et suppression des données',
    icone: 'ti-trash',
    paragraphes: [
      'Nous conservons vos données uniquement le temps nécessaire pour fournir le service et respecter nos obligations légales.',
      'Si vous passez du forfait Pro au forfait Gratuit, les données associées aux fonctionnalités Pro (médicaments personnalisés, protocoles, etc.) restent conservées dans notre système — elles ne sont simplement plus accessibles tant que vous n\'êtes pas réabonné. Si vous vous réabonnez au forfait Pro avec le même compte, vous retrouverez ces informations. La seule façon de supprimer définitivement toutes vos données est de supprimer votre compte.',
      'Lorsque vous supprimez votre compte depuis la page Profil, toutes les données associées (favoris, médicaments personnalisés, notes, historiques d\'examens) sont définitivement supprimées de nos systèmes, y compris des sauvegardes, dans un délai raisonnable.',
    ],
  },
  {
    titre: 'Droits internationaux (RGPD et autres)',
    icone: 'ti-world',
    paragraphes: [
      'Si vous résidez en dehors du Canada, notamment dans l\'Union européenne, vous disposez de droits supplémentaires en vertu de lois comme le RGPD :',
    ],
    liste: [
      'Le droit d\'accéder, de corriger ou de supprimer vos données personnelles.',
      'Le droit de vous opposer à certaines utilisations de vos données.',
      'Le droit à la portabilité de vos données.',
      'Le droit de déposer une plainte auprès de l\'autorité de protection des données de votre juridiction.',
    ],
  },
  {
    titre: 'Confidentialité des enfants',
    icone: 'ti-shield',
    paragraphes: [
      'ADJUVET est destiné aux étudiants et professionnels en médecine vétérinaire. Nos services ne s\'adressent pas aux enfants de moins de 13 ans, et nous ne collectons pas sciemment de données auprès d\'eux.',
    ],
  },
  {
    titre: 'Sécurité',
    icone: 'ti-shield-lock',
    paragraphes: [
      'Nous prenons des mesures raisonnables pour protéger vos données contre l\'accès non autorisé, la modification, la divulgation ou la destruction. Toutefois, aucun système n\'est totalement sécurisé et nous ne pouvons garantir une sécurité absolue.',
    ],
  },
  {
    titre: 'Modifications de cette politique',
    icone: 'ti-edit',
    paragraphes: [
      'Cette politique de confidentialité peut être mise à jour de temps à autre. Toute modification importante sera affichée dans l\'application.',
    ],
  },
]

export default function PolitiqueConfidentialite() {
  return <PageInfo sections={SECTIONS} />
}
