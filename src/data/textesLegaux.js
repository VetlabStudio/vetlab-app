export const CONDITIONS_PAGES = [
  {
    fond:   '/fond-jaune.jpg',
    animal: '/Chat08.png',
    sections: [
      {
        titre: 'Acceptation des termes',
        icone: 'ti-circle-check',
        texte: 'En créant un compte et en utilisant ADJUVET, vous acceptez les présentes conditions d\'utilisation. Ces conditions constituent un accord entre vous et VetLab Studio.',
      },
      {
        titre: 'Utilisation du service',
        icone: 'ti-device-mobile',
        texte: 'ADJUVET est destiné aux professionnels et étudiants du domaine vétérinaire à titre d\'outil de référence et de calcul. Le contenu est fourni sans garantie d\'exactitude complète. Vous êtes responsable de l\'usage que vous faites des informations fournies. La redistribution ou revente du contenu est interdite sans autorisation.',
      },
    ],
  },
  {
    fond:   '/fond-vert.jpg',
    animal: '/perroquet01.png',
    sections: [
      {
        titre: 'Abonnement et facturation',
        icone: 'ti-credit-card',
        texte: 'Le forfait Pro est un abonnement payant - mensuel ou annuel - géré via Stripe. Vous pouvez gérer ou annuler votre abonnement à tout moment depuis la page Profil. Aucun remboursement n\'est offert pour les périodes partiellement utilisées.',
      },
    ],
  },
  {
    fond:   '/fond-gris.jpg',
    animal: '/Lapin01.png',
    sections: [
      {
        titre: 'Modifications',
        icone: 'ti-edit',
        texte: 'Ces conditions peuvent être mises à jour à l\'occasion. Les changements importants vous seront communiqués via l\'application. En continuant à utiliser ADJUVET après une mise à jour, vous acceptez les nouvelles conditions.',
      },
      {
        titre: 'Contact',
        icone: 'ti-mail',
        texte: 'Pour toute question concernant ces conditions, écrivez-nous à info@vetlabstudio.ca. Nous répondons généralement dans un délai de 2 à 3 jours ouvrables.',
      },
    ],
  },
]

export const AVERTISSEMENT_SECTIONS = [
  {
    titre: 'Avertissement médical',
    icone: 'ti-alert-triangle',
    paragraphes: [
      'Le contenu d\'ADJUVET (calculateurs, fiches médicaments, protocoles, checklists, guides de référence, etc.) est fourni à titre informatif et éducatif seulement.',
      'Il ne constitue en aucun cas un avis médical, un diagnostic ou une recommandation de traitement, et ne remplace jamais le jugement professionnel d\'un médecin vétérinaire.',
    ],
  },
  {
    titre: 'Responsabilité de l\'utilisateur',
    icone: 'ti-shield-check',
    paragraphes: [
      'Toute décision clinique (dosage, traitement, diagnostic, intervention) doit être validée par un professionnel vétérinaire qualifié, en tenant compte de l\'état particulier de chaque patient.',
    ],
    liste: [
      'Les calculateurs de dosage sont des outils d\'aide au calcul - vérifie toujours les valeurs obtenues avant administration.',
      'Les informations sur les médicaments peuvent ne pas refléter les plus récentes données ou les particularités locales (disponibilité, formulations, réglementation).',
      'Les protocoles et guides ne couvrent pas tous les cas cliniques possibles.',
    ],
  },
  {
    titre: 'Exactitude de l\'information',
    icone: 'ti-alert-circle',
    paragraphes: [
      'Bien que le contenu d\'ADJUVET soit basé sur la littérature et la recherche vétérinaire, nous ne pouvons garantir son exactitude, son exhaustivité ou son actualité complètes.',
      'L\'utilisateur assume l\'entière responsabilité des décisions ou actions prises à partir des informations contenues dans ADJUVET.',
    ],
  },
  {
    titre: 'Limitation de responsabilité',
    icone: 'ti-ban',
    paragraphes: [
      'ADJUVET, Vetlab Studio et toute personne ayant contribué à la préparation, à la publication ou à la distribution de l\'application déclinent toute responsabilité quant aux dommages directs, indirects, accessoires ou consécutifs résultant de l\'utilisation ou de l\'impossibilité d\'utiliser l\'information contenue dans l\'application, y compris ceux liés à une défectuosité du système.',
      'ADJUVET est fourni "tel quel", sans garantie d\'aucune sorte, expresse ou implicite, quant à sa qualité, son exactitude ou son adéquation à un usage particulier.',
      'En utilisant cette application, vous reconnaissez comprendre et accepter ces limites.',
    ],
  },
]

export const CONFIDENTIALITE_SECTIONS = [
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
      'Les données sont hébergées de façon sécurisée via Supabase. Les paiements sont traités par Stripe - ADJUVET n\'a pas accès à vos informations de carte de crédit.',
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
      'Si vous passez du forfait Pro au forfait Gratuit, les données associées aux fonctionnalités Pro (médicaments personnalisés, protocoles, etc.) restent conservées dans notre système - elles ne sont simplement plus accessibles tant que vous n\'êtes pas réabonné. Si vous vous réabonnez au forfait Pro avec le même compte, vous retrouverez ces informations. La seule façon de supprimer définitivement toutes vos données est de supprimer votre compte.',
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

const conditionsParTitre = Object.fromEntries(
  CONDITIONS_PAGES.flatMap(p => p.sections).map(s => [
    s.titre,
    { titre: s.titre, icone: s.icone, paragraphes: [s.texte] },
  ])
)

// Version lisible d'un seul bloc : conditions + avertissement médical.
export const CONDITIONS_COMPLETES_SECTIONS = [
  conditionsParTitre['Utilisation du service'],
  ...AVERTISSEMENT_SECTIONS,
  conditionsParTitre['Modifications'],
  conditionsParTitre['Abonnement et facturation'],
  conditionsParTitre['Contact'],
  conditionsParTitre['Acceptation des termes'],
]
