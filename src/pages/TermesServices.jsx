import PageInfo from '../components/PageInfo'

const SECTIONS = [
  {
    titre: 'Acceptation des termes',
    icone: 'ti-file-text',
    paragraphes: [
      'En créant un compte et en utilisant ADJUVET, tu acceptes les présentes conditions d\'utilisation.',
    ],
  },
  {
    titre: 'Utilisation du service',
    icone: 'ti-checklist',
    paragraphes: [
      'ADJUVET est destiné aux professionnels et étudiants du domaine vétérinaire à titre d\'outil de référence et de calcul.',
    ],
    liste: [
      'Le contenu est fourni "tel quel", sans garantie d\'exactitude complète ou d\'absence d\'erreur.',
      'Tu es responsable de l\'usage que tu fais des informations et outils fournis.',
      'Il est interdit de redistribuer, copier ou revendre le contenu de l\'application sans autorisation.',
    ],
  },
  {
    titre: 'Abonnement et facturation',
    icone: 'ti-credit-card',
    paragraphes: [
      'Le forfait Pro est un abonnement payant (mensuel ou annuel) géré via Stripe. Tu peux gérer ou annuler ton abonnement à tout moment depuis la page Profil.',
    ],
  },
  {
    titre: 'Modifications',
    icone: 'ti-edit',
    paragraphes: [
      'Ces conditions peuvent être mises à jour à l\'occasion. Les changements importants te seront communiqués via l\'application.',
    ],
  },
  {
    titre: 'Contact',
    icone: 'ti-mail',
    paragraphes: [
      'Pour toute question concernant ces conditions, écris-nous à info@vetlabstudio.ca.',
    ],
  },
]

export default function TermesServices() {
  return <PageInfo sections={SECTIONS} />
}
