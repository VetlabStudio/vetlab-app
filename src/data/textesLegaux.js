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
      'Vous pouvez modifier ou supprimer votre compte et vos données à tout moment depuis la page Profil. Pour toute question, écrivez-nous à confidentialite@vetlabstudio.ca.',
    ],
  },
  {
    titre: 'Responsable de la protection des renseignements personnels',
    icone: 'ti-id-badge',
    paragraphes: [
      'Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25), VetLab Studio a désigné une personne responsable de la protection des renseignements personnels.',
      'Pour une question, une demande d\'accès ou de correction, une plainte, ou pour signaler un incident de confidentialité, écrivez à : Responsable de la protection des renseignements personnels, VetLab Studio, confidentialite@vetlabstudio.ca.',
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

// Version complète des conditions d'utilisation : page Termes et services
// et fenêtre « conditions complètes » de l'inscription.
const MISE_A_JOUR = '11 octobre 2026'

export const CONDITIONS_COMPLETES_SECTIONS = [
  {
    titre: 'Utilisation du service',
    icone: 'ti-device-mobile',
    paragraphes: [
      'ADJUVET est un outil de référence et de calcul destiné aux professionnels et aux étudiants du domaine vétérinaire.',
      'Votre compte est personnel. Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité effectuée avec votre compte.',
    ],
    liste: [
      'Le contenu d\'ADJUVET ne peut pas être copié, redistribué ou revendu sans l\'autorisation écrite de VetLab Studio.',
      'Il est interdit de contourner les limites des forfaits ou de tenter d\'accéder aux données d\'autres utilisateurs ou d\'autres cliniques.',
      'N\'inscrivez pas de renseignements personnels sur les clients de votre clinique (nom, téléphone, adresse, etc.) dans les notes, le babillard ou les tâches. Utilisez plutôt le nom de l\'animal ou un numéro de dossier.',
      'VetLab Studio peut suspendre ou fermer un compte qui ne respecte pas ces conditions.',
    ],
  },
  ...AVERTISSEMENT_SECTIONS,
  {
    titre: 'Modifications',
    icone: 'ti-edit',
    paragraphes: [
      'Ces conditions peuvent être mises à jour. Les changements importants vous seront communiqués par courriel ou dans l\'application. En continuant à utiliser ADJUVET après une mise à jour, vous acceptez les nouvelles conditions.',
      `Dernière mise à jour : ${MISE_A_JOUR}.`,
    ],
  },
  {
    titre: 'Abonnement et facturation',
    icone: 'ti-credit-card',
    paragraphes: [
      'Le forfait Gratuit donne accès aux fonctionnalités de base. Les forfaits Pro (mensuel ou annuel) et Équipe (annuel, par siège) sont des abonnements payants, aux tarifs affichés dans l\'application au moment de l\'abonnement. Les paiements sont traités par Stripe.',
      'L\'abonnement se renouvelle automatiquement à la fin de chaque période, jusqu\'à son annulation.',
    ],
    liste: [
      'Annulation : vous pouvez annuler à tout moment depuis la page Abonnement. Vous gardez l\'accès jusqu\'à la fin de la période déjà payée, puis votre compte passe au forfait gratuit.',
      'Remboursement : aucun remboursement n\'est offert pour une période partiellement utilisée, sauf dans le cas prévu à la section Forfait Équipe (abonnement Pro remplacé par l\'adhésion à une clinique).',
      'Paiement refusé : si un renouvellement échoue, de nouvelles tentatives sont faites automatiquement pendant quelques jours. Si vous avez déjà payé votre abonnement, vous gardez l\'accès pendant ces tentatives, pour un maximum de 21 jours. Sinon, l\'accès est suspendu jusqu\'à ce que le paiement passe. Si le paiement n\'aboutit pas, l\'abonnement est annulé.',
      'Essais gratuits et codes promotionnels : ils peuvent être offerts à certaines conditions. À la fin d\'un essai, l\'abonnement devient payant, sauf s\'il est annulé avant.',
      'Changement de tarif : VetLab Studio peut modifier ses tarifs. Un changement s\'applique au renouvellement suivant et vous est communiqué à l\'avance.',
    ],
  },
  {
    titre: 'Forfait Équipe',
    icone: 'ti-users',
    paragraphes: [
      'Le forfait Équipe permet à une clinique de partager l\'accès Pro et ses données (protocoles, médicaments personnalisés, chartes, babillard, tâches) entre ses membres.',
    ],
    liste: [
      'Le propriétaire de la clinique paie l\'abonnement et choisit le nombre de sièges. Les membres n\'ont aucuns frais.',
      'Le propriétaire et les admins invitent et retirent les membres. Une invitation expire après 7 jours.',
      'Un membre peut quitter l\'équipe à tout moment depuis la page Abonnement. Il repasse alors au forfait gratuit.',
      'Une personne qui a un abonnement Pro et rejoint une clinique voit son abonnement Pro annulé. La portion non utilisée lui est remboursée au prorata, sur le moyen de paiement d\'origine.',
      'Transfert de propriété : le nouveau propriétaire doit accepter et entrer sa propre carte. L\'abonnement de l\'ancien propriétaire s\'arrête à la fin de la période déjà payée, et celui-ci reste dans l\'équipe comme admin. Une demande de transfert expire après 7 jours.',
      'Si l\'abonnement Équipe prend fin, tous les membres repassent au forfait gratuit. Les données de la clinique sont conservées et redeviennent accessibles si l\'abonnement est réactivé.',
      'Les données partagées appartiennent à la clinique : un membre qui quitte l\'équipe n\'y a plus accès.',
    ],
  },
  {
    titre: 'Compte et suppression',
    icone: 'ti-user-x',
    paragraphes: [
      'Vous pouvez supprimer votre compte à tout moment depuis la page Profil. La suppression est définitive.',
    ],
    liste: [
      'Votre abonnement est annulé immédiatement, sans remboursement de la période en cours.',
      'Vos données personnelles sont supprimées, conformément à la Politique de confidentialité.',
      'Si vous êtes propriétaire d\'une clinique, la clinique et toutes ses données partagées sont supprimées, et ses membres repassent au forfait gratuit. Pour l\'éviter, transférez d\'abord la propriété à un membre.',
    ],
  },
  {
    titre: 'Contact',
    icone: 'ti-mail',
    paragraphes: [
      'Pour toute question concernant ces conditions, écrivez-nous à info@vetlabstudio.ca. Nous répondons généralement dans un délai de 2 à 3 jours ouvrables.',
    ],
  },
  {
    titre: 'Acceptation des termes',
    icone: 'ti-circle-check',
    paragraphes: [
      'En créant un compte et en utilisant ADJUVET, vous acceptez les présentes conditions d\'utilisation, ainsi que l\'Avertissement médical et la Politique de confidentialité. Ces conditions constituent un accord entre vous et VetLab Studio.',
    ],
  },
]
