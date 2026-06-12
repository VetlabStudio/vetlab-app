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
      'En utilisant cette application, tu reconnais comprendre et accepter ces limites.',
    ],
  },
]

export default function Disclaimer() {
  return <PageInfo sections={SECTIONS} />
}
