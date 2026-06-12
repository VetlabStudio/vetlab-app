import PageInfo from '../components/PageInfo'

const SECTIONS = [
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
      'Les calculateurs de dosage sont des outils d\'aide au calcul — vérifie toujours les valeurs obtenues avant administration.',
      'Les informations sur les médicaments peuvent ne pas refléter les plus récentes données ou les particularités locales (disponibilité, formulations, réglementation).',
      'Les protocoles et guides ne couvrent pas tous les cas cliniques possibles.',
    ],
  },
  {
    titre: 'Limitation de responsabilité',
    icone: 'ti-ban',
    paragraphes: [
      'ADJUVET et Vetlab Studio déclinent toute responsabilité quant aux conséquences directes ou indirectes résultant de l\'utilisation des informations contenues dans l\'application.',
      'En utilisant cette application, tu reconnais comprendre et accepter ces limites.',
    ],
  },
]

export default function Disclaimer() {
  return <PageInfo sections={SECTIONS} />
}
