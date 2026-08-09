import { useState } from 'react'

const ONGLETS = ['Général', 'Forfait Pro', 'Forfait Équipe']

const FAQ = {
  'Général': [
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
  'Forfait Pro': [
    {
      q: 'Comment s\'abonner au forfait Pro ?',
      a: 'Dans le menu Plus, accédez à la page Abonnement, puis choisissez le forfait mensuel ou annuel et complétez le paiement directement dans l\'application (paiement sécurisé via Stripe).',
    },
    {
      q: 'Qu\'est-ce qui est inclus dans le forfait Pro ?',
      a: 'Le Pro donne accès à l\'ensemble du contenu avancé de l\'application : personnalisation de médicaments et des protocoles de laboratoire, références en pharmacologie, laboratoire et chirurgie, ainsi que les outils cliniques comme Démarrer un examen et le Monitoring anesthésique en temps réel (avec génération de rapports PDF).',
    },
    {
      q: 'Comment annuler mon abonnement Pro ?',
      a: 'Dans le menu Plus, page Abonnement, appuyez sur "Gérer mon abonnement" — vous serez redirigé vers le portail Stripe où vous pouvez annuler ou modifier votre abonnement. L\'accès Pro reste actif jusqu\'à la fin de la période déjà payée.',
    },
    {
      q: 'Si je me désabonne, est-ce que je perds mes données Pro ?',
      a: 'Vos données personnalisées (médicaments, protocoles, examens) ne seront plus accessibles sans abonnement actif, mais elles ne sont pas supprimées. Elles redeviennent entièrement disponibles dès que vous vous réabonnez avec le même compte.',
    },
  ],
  'Forfait Équipe': [
    {
      q: 'Qu\'est-ce que le forfait Équipe ?',
      a: 'Le forfait Équipe donne accès à toutes les fonctionnalités Pro pour chaque membre de la clinique, en plus du babillard partagé, du panneau de tâches, des notes d\'équipe et d\'une charte radiographique partagée entre tous les membres. Un seul abonnement couvre toute l\'équipe.',
    },
    {
      q: 'Comment inviter des membres à rejoindre mon équipe ?',
      a: 'Dans la section Équipe, utilisez le bouton d\'invitation et entrez l\'adresse courriel du membre. Vous devez lui attribuer un rôle : Admin (peut ajouter et modifier les médicaments personnalisés et protocoles de la clinique) ou Membre (accès en lecture seule aux données partagées). Le membre reçoit un lien pour créer son compte ou se connecter.',
    },
    {
      q: 'Combien de membres puis-je ajouter ?',
      a: 'Le nombre de sièges est choisi à l\'abonnement. Plus vous avez de membres, moins le prix par siège est élevé. Vous pouvez ajuster le nombre de sièges à tout moment dans votre Profil.',
    },
    {
      q: 'Comment fonctionne la facturation au prorata ?',
      a: 'Si vous ajoutez des sièges en cours d\'abonnement, vous ne payez que la portion correspondant au temps restant dans votre période. Si vous retirez des sièges, la différence est créditée sur votre prochain renouvellement.',
    },
    {
      q: 'Puis-je passer du forfait Pro au forfait Équipe sans perdre ce que j\'ai payé ?',
      a: 'Oui. Votre crédit Pro non utilisé est automatiquement déduit du montant dû pour le forfait Équipe. La transition est sans perte.',
    },
    {
      q: 'Que se passe-t-il si un membre quitte la clinique ?',
      a: 'Vous pouvez le retirer depuis la gestion de l\'équipe. Son accès aux données partagées est révoqué immédiatement et le siège libéré peut être réattribué.',
    },
    {
      q: 'Les données de chaque membre sont-elles privées ?',
      a: 'Chaque membre a accès aux données partagées de la clinique (médicaments personnalisés, protocoles, charte radiographique, babillard, tâches). Seuls les Admins de l\'équipe peuvent ajouter ou modifier ces données partagées — les membres en lecture seule ne peuvent pas en créer. Si un membre possédait un forfait Pro avant de rejoindre l\'équipe, ses données personnalisées antérieures sont conservées et s\'ajoutent aux données d\'équipe, mais il ne peut pas en créer de nouvelles à moins d\'avoir le rôle Admin. Chaque membre dispose également d\'une section de notes personnelles visible uniquement par lui.',
    },
    {
      q: 'Si l\'abonnement Équipe est annulé, les membres perdent-ils leur accès immédiatement ?',
      a: 'Non. L\'accès reste actif pour tous jusqu\'à la fin de la période déjà payée. Les données personnalisées de la clinique (médicaments, protocoles, charte) sont conservées et redeviennent accessibles si l\'abonnement est renouvelé.',
    },
  ],
}

function Section({ icone, titre, children }) {
  return (
    <div className="postop-section">
      <div className="postop-section-header">
        <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
          <i className={`ti ${icone}`}></i>
        </div>
        <h2 className="postop-section-titre">{titre}</h2>
      </div>
      <div className="page-info-contenu">{children}</div>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <div className="page-info-faq-item" onClick={() => setOuvert(o => !o)}>
      <div className="page-info-faq-question">
        <p>{q}</p>
        <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'}`}></i>
      </div>
      {ouvert && <p className="page-info-faq-reponse">{a}</p>}
    </div>
  )
}

export default function Aide() {
  const [onglet, setOnglet] = useState('Général')

  return (
    <div className="labo-detail-page">

      <Section icone="ti-help-circle" titre="Comment ça fonctionne">
        <p>ADJUVET regroupe des calculateurs, des fiches médicaments, des protocoles de laboratoire et des guides de référence pour vous accompagner au quotidien.</p>
        <ul>
          <li>Calcul rapide : calculez une dose à partir du poids, de la posologie et de la concentration.</li>
          <li>Pharmacologie : consultez les fiches médicaments par catégorie, ajoutez vos favoris.</li>
          <li>Laboratoire et Chirurgie : protocoles, guides et valeurs de référence.</li>
          <li>Le forfait Pro donne accès aux contenus avancés (médicaments personnalisés, protocoles, toxicologie, examens, etc.).</li>
        </ul>
      </Section>

      <Section icone="ti-help-square-rounded" titre="Foire aux questions">
        <div className="notes-filtres" style={{ marginBottom: 16 }}>
          {ONGLETS.map(o => (
            <button
              key={o}
              className={`notes-filtre-chip${onglet === o ? ' active' : ''}`}
              onClick={() => setOnglet(o)}
            >
              {o}
            </button>
          ))}
        </div>
        {FAQ[onglet].map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a} />
        ))}
      </Section>

      <Section icone="ti-message-2" titre="Problème ou suggestion">
        <p>Vous avez trouvé une erreur, une information à corriger ou une idée d'amélioration ? Écrivez-nous, on est à l'écoute !</p>
      </Section>

      <Section icone="ti-mail" titre="Nous contacter">
        <a href="mailto:info@vetlabstudio.ca" className="page-info-lien">info@vetlabstudio.ca</a>
      </Section>

    </div>
  )
}
