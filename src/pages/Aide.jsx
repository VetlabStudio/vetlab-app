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
