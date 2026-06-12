import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'Données collectées',
    icone: 'ti-database',
    paragraphes: [
      'Pour fonctionner, ADJUVET collecte et conserve les informations suivantes liées à ton compte :',
    ],
    liste: [
      'Adresse courriel et nom (pour l\'authentification et le profil)',
      'Informations d\'abonnement (forfait Gratuit ou Pro)',
      'Médicaments favoris, médicaments personnalisés, notes et historiques d\'examens que tu crées dans l\'application',
    ],
  },
  {
    titre: 'Utilisation des données',
    icone: 'ti-settings',
    paragraphes: [
      'Ces données sont utilisées uniquement pour faire fonctionner l\'application (sauvegarder ton contenu, gérer ton abonnement, te donner accès aux fonctionnalités selon ton forfait).',
      'Aucune donnée n\'est vendue à des tiers.',
    ],
  },
  {
    titre: 'Stockage et sécurité',
    icone: 'ti-lock',
    paragraphes: [
      'Les données sont hébergées de façon sécurisée via Supabase. Les paiements sont traités par Stripe — ADJUVET n\'a pas accès à tes informations de carte de crédit.',
    ],
  },
  {
    titre: 'Tes droits',
    icone: 'ti-user-check',
    paragraphes: [
      'Tu peux modifier ou supprimer ton compte et tes données à tout moment depuis la page Profil. Pour toute question, écris-nous à info@vetlabstudio.ca.',
    ],
  },
    {
    titre: 'Conservation et suppression des données',
    icone: 'ti-trash',
    paragraphes: [
      'Nous conservons tes données uniquement le temps nécessaire pour fournir le service et respecter nos obligations légales.',
      'Si tu passes du forfait Pro au forfait Gratuit, les données associées aux fonctionnalités Pro (médicaments personnalisés, protocoles, etc.) restent conservées dans notre système — elles ne sont simplement plus accessibles tant que tu n\'es pas réabonné. Si tu te réabonnes au forfait Pro avec le même compte, tu retrouveras ces informations. La seule façon de supprimer définitivement toutes tes données est de supprimer ton compte.',
      'Lorsque tu supprimes ton compte depuis la page Profil, toutes les données associées (favoris, médicaments personnalisés, notes, historiques d\'examens) sont définitivement supprimées de nos systèmes, y compris des sauvegardes, dans un délai raisonnable.',
    ],
  },
  {
    titre: 'Droits internationaux (RGPD et autres)',
    icone: 'ti-world',
    paragraphes: [
      'Si tu résides en dehors du Canada, notamment dans l\'Union européenne, tu disposes de droits supplémentaires en vertu de lois comme le RGPD :',
    ],
    liste: [
      'Le droit d\'accéder, de corriger ou de supprimer tes données personnelles.',
      'Le droit de t\'opposer à certaines utilisations de tes données.',
      'Le droit à la portabilité de tes données.',
      'Le droit de déposer une plainte auprès de l\'autorité de protection des données de ta juridiction.',
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
      'Nous prenons des mesures raisonnables pour protéger tes données contre l\'accès non autorisé, la modification, la divulgation ou la destruction. Toutefois, aucun système n\'est totalement sécurisé et nous ne pouvons garantir une sécurité absolue.',
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
