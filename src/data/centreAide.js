// Contenu du Centre d'aide (page /aide). Texte seulement : chaque fiche a
// un titre, un texte et, au besoin, des étapes et un lien vers l'outil.
// pro / equipe affichent une étiquette à côté du titre.

export const SECTIONS_AIDE = [
  {
    id: 'demarrer',
    titre: 'Bien démarrer',
    icone: 'ti-rocket',
    fiches: [
      {
        titre: "Installer Adjuvet sur l'écran d'accueil (iPhone)",
        texte: "Adjuvet s'ouvre alors comme une application, en plein écran, sans passer par le navigateur.",
        etapes: [
          'Ouvrez Adjuvet dans Safari ou Chrome.',
          'Appuyez sur le bouton Partager (en bas de l\'écran dans Safari, en haut à droite dans Chrome).',
          'Choisissez « Sur l\'écran d\'accueil ». Faites défiler la liste si vous ne le voyez pas.',
          'Appuyez sur « Ajouter ».',
        ],
      },
      {
        titre: "Installer Adjuvet sur l'écran d'accueil (Android)",
        etapes: [
          'Ouvrez Adjuvet dans Chrome.',
          'Ouvrez le menu du navigateur (les trois points en haut à droite).',
          'Choisissez « Installer l\'application » ou « Ajouter à l\'écran d\'accueil ».',
          'Confirmez.',
        ],
      },
      {
        titre: "Se déplacer dans l'app",
        texte: "La barre du bas donne accès à l'essentiel : Accueil, Calcul rapide, Notes, Équipe (avec le forfait Équipe) et Plus. Le bouton en haut à gauche ramène à la page précédente.",
        etapes: [
          "Accueil : tous les calculateurs et les sections de référence.",
          'Plus : votre profil, votre abonnement, cette aide et les textes légaux.',
        ],
      },
      {
        titre: 'Trouver un médicament',
        etapes: [
          "Sur l'Accueil, ouvrez Pharmacologie.",
          'Tapez le nom dans la barre de recherche, ou parcourez les catégories (anesthésiques, antibiotiques, urgence, etc.).',
          'Sélectionnez le médicament pour ouvrir sa fiche.',
        ],
        lien: { route: '/drogues', label: 'Ouvrir Pharmacologie' },
      },
      {
        titre: 'Ajouter un médicament à vos favoris',
        pro: true,
        etapes: [
          "Ouvrez la fiche du médicament.",
          "Appuyez sur l'étoile en haut de la fiche.",
          'Retrouvez vos favoris avec le bouton « Mes médicaments favoris », en haut de la page Pharmacologie et de Calcul rapide.',
        ],
      },
      {
        titre: 'Reconnaître les fonctionnalités Pro',
        texte: "Les outils réservés au forfait Pro portent une étiquette. Avec le forfait Gratuit, un message vous l'indique quand vous les ouvrez. Pour voir les forfaits : Plus > Abonnement.",
        lien: { route: '/abonnement', label: 'Voir les forfaits' },
      },
      {
        titre: 'Notifications',
        equipe: true,
        texte: "Les notifications font partie du forfait Équipe. La cloche en haut de l'Accueil affiche une mention dans le babillard, une tâche qui vous est assignée, une demande de transfert de propriété, etc. Sélectionnez une notification pour aller directement à l'élément concerné.",
        lien: { route: '/notifications', label: 'Ouvrir les notifications' },
      },
    ],
  },

  {
    id: 'outils',
    titre: 'Les outils',
    icone: 'ti-tools',
    fiches: [
      {
        titre: 'Calcul rapide (dose)',
        texte: 'Calcule la dose totale et le volume à administrer à partir du poids, de la posologie (mg/kg ou mcg/kg) et de la concentration.',
        lien: { route: '/calculateurs', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Fluidothérapie',
        texte: 'Calcule le débit de perfusion (maintien et correction de la déshydratation) et la durée du sac. Ouvre le calculateur CRI avec les valeurs déjà remplies.',
        lien: { route: '/calculateurs/fluido', label: "Ouvrir l'outil" },
      },
      {
        titre: 'CRI (perfusion continue)',
        texte: 'Calcule le volume de médicament à ajouter au sac et la dose de charge pour atteindre la dose CRI voulue.',
        lien: { route: '/calculateurs/cri', label: "Ouvrir l'outil" },
      },
      {
        titre: "Conversion d'unités",
        texte: 'Convertit le poids, le volume, la longueur et la température.',
        lien: { route: '/calculateurs/conversion', label: "Ouvrir l'outil" },
      },
      {
        titre: 'RCR (urgence)',
        texte: "Doses des médicaments d'urgence selon le poids (protocole RECOVER) et minuterie de compressions avec signal sonore.",
        lien: { route: '/calculateurs/rcr', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Évaluation de la douleur aiguë',
        texte: "Liens vers les outils d'évaluation de la douleur les plus reconnus, pour le chien et le chat.",
        lien: { route: '/calculateurs/douleur-aigue', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Dilution (C1V1 = C2V2)',
        pro: true,
        texte: 'Calcule les volumes à mélanger pour obtenir la concentration voulue.',
        lien: { route: '/calculateurs/dilution', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Date de mise bas',
        pro: true,
        texte: "Estime la date de mise bas selon l'espèce et la date de saillie.",
        lien: { route: '/calculateurs/mise-bas', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Besoin énergétique',
        pro: true,
        texte: "Calcule le besoin énergétique d'entretien (BEE) et le besoin énergétique quotidien (BEQ), en kcal par jour.",
        lien: { route: '/calculateurs/besoin', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Transfusion sanguine',
        pro: true,
        texte: "Calcule le volume de sang à transfuser selon l'hématocrite du receveur, la cible et celui du donneur.",
        lien: { route: '/calculateurs/transfusion', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Toxicité du chocolat',
        pro: true,
        texte: 'Estime la dose de théobromine reçue et le niveau de risque selon le type et la quantité de chocolat.',
        lien: { route: '/calculateurs/toxicite', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Tap BPM (fréquence cardiaque)',
        pro: true,
        texte: "Appuyez au rythme du cœur entendu à l'auscultation : la fréquence s'affiche en temps réel.",
        lien: { route: '/calculateurs/tempo', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Monitoring anesthésique',
        pro: true,
        texte: "Notez les paramètres pendant l'anesthésie et produisez un rapport PDF. Avec le forfait Équipe, le logo de la clinique s'affiche en haut du rapport.",
        lien: { route: '/chirurgie/monitoring', label: "Ouvrir l'outil" },
      },
      {
        titre: 'Pharmacologie',
        texte: 'Fiches médicaments par catégorie, avec posologies, espèces et précautions. La toxicologie est réservée au forfait Pro.',
        lien: { route: '/drogues', label: 'Ouvrir la section' },
      },
      {
        titre: 'Laboratoire',
        texte: 'Protocoles de laboratoire, valeurs de référence (biochimie, urologie), cytologie, microbiologie, parasitologie et radiologie. La plupart des guides détaillés sont réservés au forfait Pro.',
        lien: { route: '/labo', label: 'Ouvrir la section' },
      },
      {
        titre: 'Chirurgie et anesthésie',
        texte: 'Instruments, tubes endotrachéaux, capnographie, soins post-opératoires, douleur et ECG. Les guides détaillés sont réservés au forfait Pro.',
        lien: { route: '/chirurgie', label: 'Ouvrir la section' },
      },
      {
        titre: 'Soins généraux',
        texte: 'Examen physique guidé, score de Glasgow, charte dentaire, abréviations et termes directionnels. Ces guides sont réservés au forfait Pro.',
        lien: { route: '/soins-generaux', label: 'Ouvrir la section' },
      },
      {
        titre: 'Nutrition clinique',
        texte: 'Guides nutritionnels par condition : croissance, gestation, gériatrie, rénal, diabète, perte de poids, etc. Ces guides sont réservés au forfait Pro.',
        lien: { route: '/nutrition', label: 'Ouvrir la section' },
      },
    ],
  },

  {
    id: 'pro',
    titre: 'Forfait Pro',
    icone: 'ti-crown',
    fiches: [
      {
        titre: 'Ce que comprend le forfait Pro',
        texte: "Tous les calculateurs et guides de l'app, les favoris, les médicaments personnalisés, les protocoles de laboratoire personnalisés, la charte radiographique, l'examen physique guidé et le monitoring anesthésique avec rapport PDF.",
        lien: { route: '/abonnement', label: 'Voir les forfaits' },
      },
      {
        titre: 'Ajouter un médicament personnalisé',
        pro: true,
        texte: "Deux façons de faire : depuis une catégorie, le médicament y est classé automatiquement ; depuis la page Pharmacologie, vous choisissez la catégorie vous-même dans le formulaire.",
        etapes: [
          'Ouvrez Pharmacologie, puis une catégorie, ou restez sur la page Pharmacologie.',
          'Appuyez sur le bouton +.',
          'Remplissez la fiche (et la catégorie si vous partez de la page Pharmacologie), puis enregistrez.',
        ],
      },
      {
        titre: "Modifier la fiche d'un médicament",
        pro: true,
        texte: "Créez votre propre version d'une fiche existante (posologie, notes, etc.).",
        etapes: [
          'Ouvrez la fiche du médicament.',
          'Appuyez sur « Modifier ».',
          'Faites vos changements et enregistrez.',
        ],
      },
      {
        titre: 'Ajouter un protocole de laboratoire',
        pro: true,
        etapes: [
          'Ouvrez Laboratoire, puis la catégorie voulue.',
          'Appuyez sur « Ajouter un protocole ».',
          'Remplissez les étapes et enregistrez.',
        ],
        lien: { route: '/labo', label: 'Ouvrir Laboratoire' },
      },
      {
        titre: "Créer une charte d'exposition radiographique",
        pro: true,
        texte: 'Enregistrez vos réglages (kV, mAs, distance) par espèce, région et épaisseur pour les retrouver en un instant.',
        lien: { route: '/labo/radiologie/charte', label: 'Ouvrir la charte' },
      },
    ],
  },

  {
    id: 'proprietaire',
    titre: 'Clinique : propriétaire et admins',
    icone: 'ti-building-hospital',
    fiches: [
      {
        titre: 'Abonner votre clinique au forfait Équipe',
        texte: "Chaque personne de la clinique profite du Pro, plus le babillard, les tâches et les données partagées. Seul le propriétaire paie.",
        etapes: [
          'Allez dans Plus > Abonnement, onglet Clinique.',
          'Choisissez le nombre de personnes (vous compris).',
          "Appuyez sur « S'abonner » et entrez votre carte.",
        ],
        lien: { route: '/abonnement', label: 'Ouvrir Abonnement' },
      },
      {
        titre: 'Passer du forfait Pro au forfait Équipe',
        texte: 'Dans Plus > Abonnement, onglet Clinique, appuyez sur « Passer à Équipe ». La partie non utilisée de votre forfait Pro est déduite automatiquement.',
      },
      {
        titre: "Ouvrir la gestion de l'équipe",
        equipe: true,
        texte: "Sur la page Équipe, appuyez sur « Gérer l'équipe », en haut à droite à côté de l'onglet Tâches. Ce bouton est réservé au propriétaire et aux admins.",
        lien: { route: '/equipe/gestion', label: "Ouvrir la gestion de l'équipe" },
      },
      {
        titre: 'Inviter une personne',
        equipe: true,
        etapes: [
          "Dans la gestion de l'équipe, appuyez sur « Inviter une personne ».",
          'Entrez une ou plusieurs adresses courriel.',
          'Choisissez le rôle : Membre ou Admin.',
          "Envoyez. La personne reçoit un courriel avec un lien pour créer son compte ou se connecter.",
        ],
        texte: "Une invitation expire après 7 jours. Les invitations en attente occupent un siège jusqu'à ce qu'elles soient acceptées, annulées ou expirées.",
      },
      {
        titre: 'Les rôles : Membre et Admin',
        equipe: true,
        etapes: [
          'Membre : consulte les protocoles et médicaments de la clinique, sans pouvoir les ajouter ni les modifier.',
          'Admin : ajoute et modifie les médicaments et protocoles de la clinique, invite des personnes, change les rôles et gère les réglages.',
          "Propriétaire : tout ce que fait un admin, plus l'abonnement, les sièges et le transfert de propriété.",
        ],
      },
      {
        titre: "Changer le rôle d'un membre ou révoquer son accès",
        equipe: true,
        etapes: [
          "Dans la gestion de l'équipe, sélectionnez la personne dans la liste.",
          'Choisissez Membre ou Admin, ou appuyez sur « Révoquer l\'accès ».',
        ],
        texte: "Une personne dont l'accès est révoqué repasse au forfait gratuit et n'a plus accès aux données de la clinique.",
      },
      {
        titre: 'Nom et logo de la clinique',
        equipe: true,
        texte: "Dans la gestion de l'équipe, appuyez sur l'engrenage à côté du nom de la clinique. Le logo remplace le symbole Adjuvet en haut de vos rapports PDF (PNG, JPG ou SVG, 2 Mo maximum).",
      },
      {
        titre: 'Ajouter ou retirer des sièges',
        equipe: true,
        etapes: [
          'Allez dans Plus > Abonnement, onglet Clinique.',
          'Appuyez sur « Modifier les sièges » et choisissez le nouveau nombre.',
        ],
        texte: "Vous payez seulement la portion qui reste de la période en cours. Pour réduire le nombre de sièges sous le nombre de membres actifs, retirez d'abord des membres.",
      },
      {
        titre: 'Transférer la propriété de la clinique',
        equipe: true,
        texte: "Le nouveau propriétaire doit déjà faire partie de l'équipe. Il accepte la demande et entre sa propre carte. Votre abonnement s'arrête alors à la fin de la période déjà payée, et vous restez dans l'équipe comme admin. La demande expire après 7 jours.",
        etapes: [
          "Dans la gestion de l'équipe, appuyez sur l'engrenage à côté du nom de la clinique.",
          "Dans la section « Propriété de la clinique », appuyez sur « Transférer la propriété ».",
          'Sélectionnez la personne, puis envoyez la demande.',
        ],
      },
      {
        titre: "Annuler l'abonnement de la clinique",
        equipe: true,
        texte: "Allez dans Plus > Abonnement, puis « Gérer la facturation / Se désabonner ». La clinique garde l'accès jusqu'à la fin de la période payée, puis tous les membres repassent au forfait gratuit. Les données de la clinique sont conservées et redeviennent accessibles si vous vous réabonnez. Pour une annulation immédiate, écrivez-nous à info@vetlabstudio.ca.",
      },
    ],
  },

  {
    id: 'membre',
    titre: "Clinique : membres de l'équipe",
    icone: 'ti-users',
    fiches: [
      {
        titre: 'Rejoindre une clinique',
        etapes: [
          "Ouvrez le lien reçu par courriel (il est valide 7 jours).",
          'Créez votre compte, ou connectez-vous si vous en avez déjà un.',
          "Vous arrivez dans l'équipe avec l'accès Pro.",
        ],
        texte: "Si vous aviez votre propre abonnement Pro, il est annulé et la portion non utilisée vous est remboursée au prorata, sur la carte utilisée pour le payer.",
      },
      {
        titre: 'Le babillard',
        equipe: true,
        texte: "Les messages de la clinique, visibles par toute l'équipe.",
        etapes: [
          'Écrivez @ suivi du nom pour mentionner une personne, ou @equipe pour toute l\'équipe. Les personnes mentionnées reçoivent une notification.',
          'Épinglez un message important pour le garder en haut.',
          "Les messages non épinglés sont archivés après 90 jours. Vous les retrouvez dans les archives.",
        ],
        lien: { route: '/equipe?tab=babillard', label: 'Ouvrir le babillard' },
      },
      {
        titre: 'Les tâches',
        equipe: true,
        etapes: [
          'Créez une tâche avec un titre, une description et une échéance au besoin.',
          'Assignez-la à une personne : elle reçoit une notification.',
          'Faites avancer son statut : À faire, En cours, Terminé.',
        ],
        lien: { route: '/equipe?tab=taches', label: 'Ouvrir les tâches' },
      },
      {
        titre: 'Notes personnelles',
        texte: "Vos notes sont visibles par vous seulement, même avec le forfait Équipe. Elles se trouvent dans l'onglet Notes de la barre du bas.",
        lien: { route: '/notes', label: 'Ouvrir les notes' },
      },
      {
        titre: 'Renseignements sur les clients',
        texte: "Par sécurité, n'inscrivez pas de données personnelles de vos clients (nom, téléphone, adresse) dans les notes, le babillard ou les tâches. Utilisez plutôt un numéro de dossier.",
      },
      {
        titre: "Quitter l'équipe",
        equipe: true,
        texte: "Allez dans Plus > Abonnement, onglet Clinique, puis « Quitter l'équipe ». Votre compte repasse au forfait gratuit et vous n'avez plus accès aux données de la clinique. Le propriétaire doit d'abord transférer la propriété.",
      },
    ],
  },

  {
    id: 'compte',
    titre: 'Compte et abonnement',
    icone: 'ti-user-circle',
    fiches: [
      {
        titre: 'Modifier votre nom, votre courriel ou votre mot de passe',
        texte: "Allez dans Plus > Profil et appuyez sur « Modifier » à côté de l'élément. Un nouveau courriel doit être confirmé par le lien reçu.",
        lien: { route: '/profil', label: 'Ouvrir le profil' },
      },
      {
        titre: 'Choisir un bon mot de passe',
        texte: "Au moins 12 caractères. Une courte phrase de quelques mots est facile à retenir et difficile à deviner. Les mots de passe trop courants, les suites (1234, azerty) et ceux qui contiennent votre nom ou votre courriel sont refusés.",
      },
      {
        titre: 'Changer votre photo de profil',
        texte: 'Dans Plus > Profil, appuyez sur votre photo (ou sur le cercle) et choisissez une image.',
      },
      {
        titre: 'Passer au forfait Pro',
        etapes: [
          'Allez dans Plus > Abonnement, onglet Personnel.',
          'Choisissez Mensuel ou Annuel.',
          'Appuyez sur « Passer à Pro » et entrez votre carte. Le paiement est traité par Stripe.',
        ],
        lien: { route: '/abonnement', label: 'Ouvrir Abonnement' },
      },
      {
        titre: 'Factures et carte de crédit',
        texte: 'Dans Plus > Abonnement, appuyez sur « Gérer la facturation / Se désabonner ». Vous pouvez y télécharger vos factures et changer de carte.',
      },
      {
        titre: 'Se désabonner',
        texte: "Dans Plus > Abonnement, appuyez sur « Gérer la facturation / Se désabonner ». Vous gardez l'accès jusqu'à la fin de la période déjà payée, aucun autre paiement n'est prélevé et vous recevez un courriel de confirmation. La période en cours n'est pas remboursée. Pour une annulation immédiate, écrivez-nous à info@vetlabstudio.ca.",
      },
      {
        titre: 'Mes données si je me désabonne',
        texte: "Vos médicaments, protocoles et autres données Pro sont conservés, mais ne sont plus accessibles. Ils reviennent si vous vous réabonnez avec le même compte.",
      },
      {
        titre: 'Paiement refusé',
        texte: "De nouvelles tentatives sont faites automatiquement pendant quelques jours. Si vous aviez déjà payé, vous gardez l'accès pendant ces tentatives (21 jours au maximum). Mettez votre carte à jour dans « Gérer la facturation / Se désabonner ».",
      },
      {
        titre: 'Se déconnecter',
        texte: 'Dans Plus > Profil, appuyez sur « Déconnexion » au bas de la page.',
      },
      {
        titre: 'Supprimer votre compte',
        texte: "Dans Plus > Profil, appuyez sur « Supprimer le compte ». La suppression est définitive : votre abonnement est annulé immédiatement, sans remboursement, et vos données sont supprimées. Si vous êtes propriétaire d'une clinique, transférez d'abord la propriété, sinon la clinique et ses données partagées sont supprimées aussi.",
      },
    ],
  },
]
