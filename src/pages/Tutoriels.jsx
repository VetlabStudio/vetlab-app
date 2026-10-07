import { useState, useMemo } from 'react'

const BADGE_PRO = (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: '2px 7px',
    borderRadius: 20, background: 'rgba(212,175,55,0.15)',
    color: 'var(--accent-gold)', border: '1px solid rgba(212,175,55,0.3)',
    flexShrink: 0, letterSpacing: 0.3,
  }}>PRO</span>
)

const BADGE_EQUIPE = (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: '2px 7px',
    borderRadius: 20, background: 'rgba(99,102,241,0.12)',
    color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)',
    flexShrink: 0, letterSpacing: 0.3,
  }}>ÉQUIPE</span>
)

const SECTIONS = [
  {
    id: 'calculateurs',
    label: 'Calculateurs',
    icone: 'ti-calculator',
    couleur: '#3b82f6',
    outils: [
      {
        id: 'dosage',
        label: 'Dosage',
        resume: 'Calcule la dose et le volume à administrer selon le poids et la posologie.',
        pro: false,
        description: 'Convertit le poids, la posologie (mg/kg ou mcg/kg) et la concentration du médicament en dose totale et volume à préparer.',
        actions: [
          'Entrer le poids en kg ou en lb',
          'Choisir la posologie en mg/kg ou mcg/kg',
          'Entrer la concentration du médicament (mg/mL)',
          'Voir instantanément la dose totale et le volume à administrer',
          'Afficher le calcul détaillé étape par étape',
        ],
      },
      {
        id: 'fluido',
        label: 'Fluidothérapie',
        resume: 'Calcule le taux de perfusion IV (maintien + correction de déshydratation).',
        pro: false,
        description: 'Calcule les besoins liquidiens en maintien et en correction selon le degré de déshydratation, la durée de correction et la taille du sac.',
        actions: [
          'Choisir l\'espèce (chien ou chat)',
          'Entrer le poids',
          'Sélectionner la formule de maintien (RER, simple ou linéaire)',
          'Définir le % de déshydratation et la durée de correction',
          'Obtenir le débit en mL/h et la durée du sac',
          'Ouvrir le calculateur CRI directement depuis cette page',
        ],
      },
      {
        id: 'cri',
        label: 'CRI (Perfusion continue)',
        resume: 'Calcule la quantité de médicament à ajouter dans un sac de fluides pour une perfusion continue.',
        pro: false,
        description: 'Détermine le volume de médicament à ajouter dans le sac IV pour atteindre la dose CRI souhaitée au débit de fluide calculé.',
        actions: [
          'Entrer le poids et le débit IV (mL/h ou mL/kg/h)',
          'Définir la dose de charge et la dose CRI (mg/kg/h ou mg/kg/j)',
          'Entrer la concentration du médicament',
          'Obtenir le volume à ajouter dans le sac et la dose de charge à administrer',
          'Recevoir les données pré-remplies depuis le calculateur de fluidothérapie',
        ],
      },
      {
        id: 'rcr',
        label: 'RCR - Réanimation cardiopulmonaire',
        resume: 'Guide RCR avec doses médicamenteuses et minuterie de compressions audio guidée.',
        pro: false,
        description: 'Outil de réanimation basé sur le protocole RECOVER 2024. Calcule les doses de tous les médicaments d\'urgence et inclut une minuterie de compressions avec signal sonore.',
        actions: [
          'Entrer le poids et l\'espèce',
          'Consulter les doses (mg et mL) pour épinéphrine, vasopressine, atropine, lidocaïne, bicarbonate',
          'Activer la minuterie de compressions audio (110/min) avec signal ventilatoire toutes les 6 secondes',
          'Suivre les cycles de 2 minutes',
        ],
        astuce: 'La minuterie fonctionne en mode veille - l\'écran peut rester ouvert pendant la réanimation.',
      },
      {
        id: 'douleur-aigue',
        label: 'Évaluation de la douleur aiguë',
        resume: 'Échelle de douleur aiguë Colorado State University pour chien et chat.',
        pro: false,
        description: 'Évaluation structurée de la douleur aiguë post-opératoire ou traumatique selon les critères comportementaux et d\'expression faciale de l\'échelle CSU.',
        actions: [
          'Choisir l\'espèce (chien ou chat)',
          'Consulter les critères comportementaux et faciaux par niveau (0 à 4)',
          'Obtenir une recommandation de traitement dès un score de 2 ou plus',
        ],
      },
      {
        id: 'toxicite-chocolat',
        label: 'Toxicité du chocolat',
        resume: 'Calcule le risque de toxicité selon le type de chocolat ingéré et le poids du chien.',
        pro: false,
        description: 'Estime la dose de théobromine reçue et le niveau de risque clinique selon le type et la quantité de chocolat ingérés.',
        actions: [
          'Entrer le poids du chien',
          'Sélectionner le type de chocolat et la quantité',
          'Voir la dose de théobromine calculée et la cote de risque (faible / modéré / élevé)',
        ],
      },
      {
        id: 'transfusion',
        label: 'Transfusion sanguine',
        resume: 'Calcule le volume de sang à transfuser selon les taux d\'hématocrite.',
        pro: false,
        description: 'Utilise la formule standard pour calculer le volume de sang total ou de culot globulaire à administrer selon le PCV du donneur et du receveur.',
        actions: [
          'Entrer le poids du receveur',
          'Saisir le PCV du receveur et le PCV cible',
          'Entrer le PCV du donneur',
          'Obtenir le volume à transfuser en mL',
        ],
      },
      {
        id: 'tap-tempo',
        label: 'Fréquence cardiaque (Tap Tempo)',
        resume: 'Mesure la fréquence cardiaque en tapotant le rythme perçu à l\'auscultation.',
        pro: false,
        description: 'Calcule la fréquence cardiaque en temps réel en moyennant les 8 derniers intervalles entre les tapotements.',
        actions: [
          'Tapoter le grand bouton au rythme du coeur',
          'Lire la fréquence en BPM en temps réel',
          'Réinitialiser (bouton reset ou 3 secondes de silence)',
        ],
      },
      {
        id: 'besoin-energetique',
        label: 'Besoin énergétique',
        resume: 'Calcule les besoins énergétiques au repos (RER) et d\'entretien (MER).',
        pro: false,
        description: 'Estimation des besoins caloriques quotidiens selon le poids et le stade physiologique de l\'animal.',
        actions: [
          'Entrer le poids',
          'Choisir le stade physiologique ou l\'état de santé',
          'Obtenir le RER et le MER en kcal/jour',
        ],
      },
      {
        id: 'dilution',
        label: 'Dilution',
        resume: 'Calcule les dilutions médicamenteuses (formule C1V1 = C2V2).',
        pro: false,
        description: 'Outil de dilution pour préparer une concentration cible à partir d\'une solution mère.',
        actions: [
          'Entrer trois des quatre paramètres (C1, V1, C2, V2)',
          'Obtenir la valeur manquante calculée automatiquement',
        ],
      },
      {
        id: 'conversion',
        label: 'Conversion d\'unités',
        resume: 'Convertit des unités de poids, volume, concentration et température.',
        pro: false,
        description: 'Outil de conversion rapide pour les unités couramment utilisées en clinique vétérinaire.',
        actions: [
          'Entrer une valeur dans l\'unité source',
          'Voir la conversion instantanée dans toutes les unités équivalentes',
        ],
      },
      {
        id: 'mise-bas',
        label: 'Date de mise bas',
        resume: 'Calcule la date prévue d\'accouchement selon la date de saillie ou du pic LH.',
        pro: false,
        description: 'Estime la date de parturition chez la chienne et la chatte à partir de la date de saillie ou du pic de LH.',
        actions: [
          'Entrer la date de saillie ou de détection du pic LH',
          'Obtenir la date prévue de mise bas',
        ],
      },
      {
        id: 'glasgow',
        label: 'Score de Glasgow modifié (MCGS)',
        resume: 'Évalue le niveau de conscience et le pronostic neurologique chez le chien et le chat.',
        pro: true,
        description: 'Échelle de Glasgow modifiée évaluant l\'activité motrice, les réflexes du tronc cérébral et le niveau de conscience (score de 3 à 18).',
        actions: [
          'Sélectionner un score (1 à 6) pour chacune des 3 catégories',
          'Voir le score total calculé automatiquement',
          'Lire le pronostic associé (score ≤8 : grave, 9-14 : réservé, 15-18 : favorable)',
          'Consulter la description clinique détaillée pour chaque option',
        ],
      },
    ],
  },
  {
    id: 'pharmacologie',
    label: 'Pharmacologie',
    icone: 'ti-pill',
    couleur: '#10b981',
    outils: [
      {
        id: 'recherche-medicament',
        label: 'Recherche de médicament',
        resume: 'Recherche globale en temps réel dans tous les médicaments de la base.',
        pro: false,
        description: 'Barre de recherche sur la page principale Pharmacologie qui filtre l\'ensemble des médicaments (base + personnalisés) en temps réel avec autocomplétion.',
        actions: [
          'Taper le nom d\'un médicament',
          'Voir les suggestions en liste déroulante',
          'Appuyer sur un résultat pour ouvrir la fiche directement',
        ],
      },
      {
        id: 'fiche-medicament',
        label: 'Fiche médicament',
        resume: 'Consulte les doses, voies d\'administration, indications et notes d\'un médicament.',
        pro: false,
        description: 'Fiche détaillée d\'un médicament avec toutes ses informations cliniques et un outil de calcul de dose intégré.',
        actions: [
          'Voir les doses recommandées par espèce et voie d\'administration',
          'Calculer la dose pour un poids d\'animal spécifique',
          'Afficher le calcul étape par étape',
          'Ajouter le médicament aux favoris (étoile)',
          'Personnaliser les doses pour votre usage (Pro)',
        ],
      },
      {
        id: 'mes-drogues',
        label: 'Mes médicaments favoris',
        resume: 'Accès rapide aux médicaments mis en favoris, filtrés par espèce.',
        pro: false,
        description: 'Liste personnalisée regroupant les médicaments marqués comme favoris, incluant les médicaments de la base et les médicaments personnalisés.',
        actions: [
          'Filtrer par espèce (chien, chat, etc.)',
          'Voir les médicaments favoris de la base et les médicaments personnalisés',
          'Appuyer pour ouvrir la fiche',
        ],
      },
      {
        id: 'ajouter-medicament',
        label: 'Ajouter un médicament personnalisé',
        resume: 'Crée un médicament personnalisé avec ses doses, concentration et notes.',
        pro: true,
        description: 'Permet de créer un médicament qui n\'est pas dans la base de données ou d\'en ajouter un spécifique à votre clinique.',
        actions: [
          'Remplir le nom, la catégorie et l\'espèce',
          'Entrer les plages de doses et la concentration',
          'Ajouter des notes cliniques',
          'Sauvegarder dans la bibliothèque personnelle ou d\'équipe',
        ],
      },
      {
        id: 'personnaliser-medicament',
        label: 'Personnaliser un médicament',
        resume: 'Modifie les doses ou notes d\'un médicament de la base pour votre usage.',
        pro: true,
        description: 'Permet de créer une version personnalisée d\'un médicament existant pour votre clinique (doses ajustées, concentration différente, notes internes).',
        actions: [
          'Ouvrir la fiche d\'un médicament',
          'Appuyer sur "Personnaliser"',
          'Modifier la concentration, les doses et les notes',
          'Sauvegarder - votre version remplace l\'affichage par défaut',
        ],
      },
      {
        id: 'toxicologie',
        label: 'Toxicologie',
        resume: 'Référence des substances toxiques avec signes cliniques, mécanisme et prise en charge.',
        pro: true,
        description: 'Base de données des substances toxiques (plantes, produits ménagers, aliments) avec niveau de toxicité par espèce, signes cliniques et conduite à tenir.',
        actions: [
          'Filtrer par espèce et par catégorie de toxique',
          'Appuyer sur une substance pour voir : identification, mécanisme, signes cliniques, notes',
          'Consulter le niveau de risque par espèce',
        ],
      },
      {
        id: 'categories-drogues',
        label: 'Catégories de médicaments',
        resume: 'Navigation par catégorie : anesthésiques, antibiotiques, urgence, cardiovasculaires, etc.',
        pro: false,
        description: 'La page Pharmacologie liste toutes les catégories de médicaments de référence disponibles dans l\'app.',
        actions: [
          'Appuyer sur une catégorie pour voir tous les médicaments de cette classe',
          'Appuyer sur un médicament pour accéder à sa fiche',
        ],
        astuce: 'La catégorie "Urgence" est mise en évidence pour un accès rapide en situation critique.',
      },
    ],
  },
  {
    id: 'laboratoire',
    label: 'Laboratoire',
    icone: 'ti-flask',
    couleur: '#8b5cf6',
    outils: [
      {
        id: 'labo-protocoles',
        label: 'Protocoles de laboratoire',
        resume: 'Consulte et crée des protocoles d\'analyse pour chaque section du labo.',
        pro: false,
        description: 'Chaque section du laboratoire (biochimie, urologie, etc.) affiche les protocoles de base disponibles et permet d\'ajouter ses propres protocoles personnalisés.',
        actions: [
          'Consulter les protocoles de base de chaque section',
          'Appuyer sur un protocole pour voir le contenu complet',
          'Créer un protocole personnalisé (Pro)',
          'Modifier ou supprimer ses propres protocoles',
        ],
      },
      {
        id: 'biochimie-tubes',
        label: 'Choix du tube - Biochimie',
        resume: 'Référence des tubes de prélèvement par couleur avec les analyses compatibles.',
        pro: true,
        description: 'Guide de sélection du bon tube de prélèvement selon l\'analyse demandée, avec les anticoagulants, volumes minimaux et notes de manipulation pour 6 types de tubes.',
        actions: [
          'Appuyer sur un tube pour voir les analyses compatibles et les notes de handling',
          'Consulter l\'ordre de prélèvement recommandé',
        ],
      },
      {
        id: 'biochimie-valeurs',
        label: 'Valeurs de référence - Biochimie',
        resume: 'Valeurs normales des paramètres biochimiques par espèce.',
        pro: true,
        description: 'Tableaux de référence des valeurs normales biochimiques organisés par catégories (hépatique, rénal, électrolytes, etc.) pour le chien et le chat.',
        actions: [
          'Appuyer sur une section pour dérouler le tableau',
          'Voir les plages normales par espèce',
        ],
      },
      {
        id: 'biochimie-organes',
        label: 'Tests par organe - Biochimie',
        resume: 'Associe chaque organe à ses marqueurs biochimiques spécifiques.',
        pro: true,
        description: 'Référence permettant de partir d\'un organe cible et de trouver rapidement les tests biochimiques les plus pertinents pour l\'évaluer.',
        actions: [
          'Sélectionner un organe dans la grille (foie, rein, pancréas, etc.)',
          'Voir les tests associés avec leurs valeurs normales et interprétation',
          'Rechercher un test par nom dans la barre de recherche',
        ],
      },
      {
        id: 'urologie-valeurs',
        label: 'Valeurs de référence - Urologie',
        resume: 'Valeurs normales pour la densité urinaire, la bandelette et le sédiment.',
        pro: true,
        description: 'Tableaux de référence pour l\'interprétation des résultats d\'analyse d\'urine : densité, paramètres de la bandelette et sédiment urinaire.',
        actions: [
          'Appuyer sur une section pour dérouler le tableau',
          'Voir les valeurs normales et les seuils d\'alerte',
        ],
      },
      {
        id: 'urologie-sediments',
        label: 'Sédiments urinaires',
        resume: 'Guide visuel d\'identification des éléments du sédiment urinaire.',
        pro: true,
        description: 'Référence illustrée pour reconnaître et interpréter les éléments retrouvés au microscope dans le sédiment urinaire.',
        actions: [
          'Consulter les éléments par catégorie (cellules, cylindres, cristaux, bactéries)',
          'Voir les images et descriptions de chaque élément',
        ],
      },
      {
        id: 'parasitologie-oeufs',
        label: 'Oeufs de parasites',
        resume: 'Atlas visuel des oeufs de parasites identifiables à la coprologie.',
        pro: false,
        description: 'Référence illustrée des oeufs de parasites intestinaux avec caractéristiques morphologiques pour identification microscopique.',
        actions: [
          'Parcourir les parasites avec leurs photos d\'oeufs',
          'Consulter la morphologie, le flottant utilisé et les notes d\'identification',
        ],
      },
      {
        id: 'parasitologie-hotes',
        label: 'Hôtes et espèces affectées',
        resume: 'Tableau des parasites avec espèces hôtes, transmission et localisation.',
        pro: true,
        description: 'Référence structurée listant les parasites par catégorie (nématodes, cestodes, protozoaires, ectoparasites) avec les hôtes affectés, le mode de transmission et la localisation.',
        actions: [
          'Appuyer sur une catégorie pour la déplier',
          'Appuyer sur un parasite pour voir la transmission et la localisation',
          'Consulter les badges chien/chat pour chaque parasite',
        ],
      },
      {
        id: 'parasitologie-externes',
        label: 'Parasites externes',
        resume: 'Référence des ectoparasites (puces, tiques, acariens, etc.).',
        pro: false,
        description: 'Guide de référence sur les principaux parasites externes en médecine vétérinaire des petits animaux.',
        actions: [
          'Parcourir les ectoparasites par type',
          'Consulter les caractéristiques d\'identification et la clinique associée',
        ],
      },
      {
        id: 'cytologie-prelevement',
        label: 'Guide de prélèvement - Cytologie',
        resume: 'Techniques de prélèvement cytologique (AAF, impression, écouvillonnage, grattage).',
        pro: true,
        description: 'Guide pratique des 4 techniques de prélèvement cytologique avec les étapes numérotées, les indications et les conseils pour chaque méthode.',
        actions: [
          'Appuyer sur une technique pour voir les étapes détaillées',
          'Consulter les indications et le conseil clinique de chaque technique',
          'Voir le tableau de fixation des lames',
          'Consulter les erreurs pré-analytiques fréquentes',
        ],
      },
      {
        id: 'cytologie-cellules',
        label: 'Atlas cellulaire - Cytologie',
        resume: 'Référence des types cellulaires pour l\'interprétation cytologique.',
        pro: true,
        description: 'Guide de référence pour identifier et interpréter les types cellulaires observés en cytologie vétérinaire.',
        actions: [
          'Parcourir les cellules par catégorie',
          'Consulter les caractéristiques morphologiques et la signification clinique',
        ],
      },
      {
        id: 'microbiologie-prelevement',
        label: 'Guide de prélèvement - Microbiologie',
        resume: 'Référence des prélèvements pour culture par système anatomique.',
        pro: true,
        description: 'Guide complet listant les prélèvements possibles par site anatomique (voies respiratoires, urinaires, peau, os, etc.) avec le transport recommandé et les notes importantes.',
        actions: [
          'Appuyer sur un système pour voir les prélèvements possibles',
          'Consulter le contenant et les conditions de transport pour chaque prélèvement',
          'Voir les bonnes pratiques pré-analytiques',
        ],
      },
      {
        id: 'microbiologie-cultures',
        label: 'Milieux de culture et interprétation',
        resume: 'Référence des milieux de culture bactérienne et interprétation des résultats.',
        pro: true,
        description: 'Guide des milieux de culture microbiologique courants avec leur objectif, leur inoculation et l\'interprétation des réactions observées, ainsi que les seuils d\'interprétation quantitatifs.',
        actions: [
          'Consulter l\'interprétation des résultats par seuil de croissance (UFC/mL)',
          'Appuyer sur un milieu pour voir les réactions et leur interprétation',
          'Consulter les types d\'hémolyse sur gélose sang',
        ],
      },
      {
        id: 'microbiologie-antibiogramme',
        label: 'Antibiogramme',
        resume: 'Référence pour l\'interprétation des résultats d\'antibiogramme.',
        pro: true,
        description: 'Guide d\'interprétation des catégories de sensibilité (S, I, R) et des principaux antibiotiques testés en médecine vétérinaire.',
        actions: [
          'Consulter les catégories de sensibilité et leur signification clinique',
          'Voir les antibiotiques par classe',
        ],
      },
      {
        id: 'microbiologie-bacteries',
        label: 'Bactéries courantes',
        resume: 'Référence des principales bactéries en médecine vétérinaire.',
        pro: true,
        description: 'Guide des bactéries les plus fréquentes avec morphologie, Gram, caractéristiques de culture et pertinence clinique.',
        actions: [
          'Parcourir les bactéries par type (Gram +/-, forme)',
          'Consulter les caractéristiques et la pathogénicité',
        ],
      },
      {
        id: 'microbiologie-levures',
        label: 'Levures et champignons',
        resume: 'Référence des agents fongiques courants en médecine vétérinaire.',
        pro: true,
        description: 'Guide des levures et champignons pathogènes avec identification et pertinence clinique.',
        actions: [
          'Parcourir les agents fongiques par type',
          'Consulter les caractéristiques d\'identification',
        ],
      },
      {
        id: 'radiologie-charte',
        label: 'Charte d\'exposition radiographique',
        resume: 'Enregistre et consulte les paramètres techniques (kVp/mAs) par espèce et région.',
        pro: true,
        description: 'Outil permettant de bâtir la charte d\'exposition spécifique à votre clinique en enregistrant les paramètres qui fonctionnent bien pour chaque région anatomique et espèce.',
        actions: [
          'Consulter les entrées existantes filtrées par espèce et région',
          'Ajouter une nouvelle entrée (espèce, région, kVp, mAs, épaisseur, qualité)',
          'Supprimer une entrée',
        ],
        astuce: 'La charte d\'exposition est partagée entre tous les membres de l\'équipe (forfait Équipe).',
      },
      {
        id: 'radiologie-bases',
        label: 'Notions de base en radiographie',
        resume: 'Référence des concepts fondamentaux en radiologie vétérinaire.',
        pro: true,
        description: 'Guide de référence couvrant les principes techniques de la radiographie (kVp, mAs, facteurs d\'exposition, positionnement, etc.).',
        actions: [
          'Lire les sections thématiques sur les fondamentaux',
        ],
      },
      {
        id: 'radiologie-depannage',
        label: 'Dépannage radiographique',
        resume: 'Solutions aux problèmes de qualité d\'image radiographique courants.',
        pro: false,
        description: 'Guide de résolution des problèmes courants affectant la qualité des images radiographiques (surexposition, flou, artéfacts, etc.).',
        actions: [
          'Identifier le problème observé sur la radiographie',
          'Consulter les causes et les corrections recommandées',
        ],
      },
    ],
  },
  {
    id: 'chirurgie',
    label: 'Chirurgie & Anesthésie',
    icone: 'ti-scalpel',
    couleur: '#ef4444',
    outils: [
      {
        id: 'monitoring',
        label: 'Monitoring anesthésique',
        resume: 'Feuille de monitoring peranesthésique en temps réel avec alertes et export PDF.',
        pro: true,
        description: 'Outil complet pour enregistrer les paramètres vitaux pendant une anesthésie, avec alertes automatiques hors normes et génération d\'un rapport PDF.',
        actions: [
          'Configurer le patient (espèce, nom, procédure, cathéter, agents anesthésiques)',
          'Démarrer le minuteur de monitoring',
          'Enregistrer FC, FR, température, SpO2, ETCO2, pression artérielle, % iso/sévo, O2, fluides toutes les 5 minutes',
          'Voir les valeurs hors normes surlignées automatiquement',
          'Générer et télécharger la feuille anesthésique en PDF',
        ],
        astuce: 'Disponible pour 18 espèces différentes.',
      },
      {
        id: 'instruments',
        label: 'Instruments chirurgicaux',
        resume: 'Atlas illustré de ~46 instruments chirurgicaux avec description.',
        pro: true,
        description: 'Référence visuelle des instruments chirurgicaux les plus courants en médecine vétérinaire.',
        actions: [
          'Rechercher un instrument par nom',
          'Parcourir par ordre alphabétique',
          'Appuyer sur une carte pour lire la description',
        ],
      },
      {
        id: 'tubes-endotracheaux',
        label: 'Tubes endotrachéaux',
        resume: 'Guide de sélection de la taille de tube endotrachéal par espèce et poids.',
        pro: true,
        description: 'Référence pour choisir la bonne taille de tube endotrachéal selon l\'espèce et le poids de l\'animal.',
        actions: [
          'Consulter les recommandations par espèce et tranche de poids',
        ],
      },
      {
        id: 'capnographie',
        label: 'Interprétation de la capnographie',
        resume: 'Guide d\'interprétation des formes d\'onde capnographiques.',
        pro: true,
        description: 'Référence visuelle et clinique pour identifier et interpréter les anomalies de la courbe de capnographie pendant l\'anesthésie.',
        actions: [
          'Parcourir les formes d\'onde avec leur signification clinique',
        ],
      },
      {
        id: 'post-op',
        label: 'Soins post-opératoires',
        resume: 'Guide et liste de vérification des soins post-anesthésiques.',
        pro: true,
        description: 'Référence des soins à prodiguer en période post-opératoire immédiate avec les critères de surveillance.',
        actions: [
          'Lire les recommandations par phase de réveil',
        ],
      },
      {
        id: 'douleur-post-op',
        label: 'Évaluation de la douleur post-op',
        resume: 'Échelle de douleur post-opératoire avec recommandation de traitement.',
        pro: false,
        description: 'Outil d\'évaluation de la douleur post-chirurgicale permettant de scorer l\'animal sur des critères comportementaux.',
        actions: [
          'Scorer l\'animal selon les critères comportementaux',
          'Recevoir une recommandation d\'analgésie selon le score obtenu',
        ],
      },
      {
        id: 'ecg',
        label: 'ECG - Positionnement et anomalies',
        resume: 'Guide de positionnement des électrodes ECG et référence des anomalies courantes.',
        pro: true,
        description: 'Section ECG comprenant le guide de placement des électrodes par espèce et la référence des arythmies et anomalies ECG courantes.',
        actions: [
          'Consulter le positionnement des électrodes par espèce',
          'Parcourir les anomalies ECG avec bandelettes et notes cliniques',
        ],
      },
    ],
  },
  {
    id: 'soins',
    label: 'Soins généraux',
    icone: 'ti-stethoscope',
    couleur: '#f59e0b',
    outils: [
      {
        id: 'dentisterie',
        label: 'Charte dentaire',
        resume: 'Charte dentaire interactive pour chien et chat avec numérotation des dents.',
        pro: true,
        description: 'Outil interactif permettant d\'annoter visuellement la charte dentaire du chien ou du chat pendant un examen ou une prophylaxie.',
        actions: [
          'Choisir l\'espèce (chien ou chat)',
          'Sélectionner et annoter les dents par numéro',
          'Consulter les termes directionnels dentaires',
        ],
      },
      {
        id: 'abreviations',
        label: 'Abréviations courantes',
        resume: 'Référence alphabétique des abréviations médicales vétérinaires.',
        pro: true,
        description: 'Liste complète des abréviations utilisées en médecine vétérinaire, consultable alphabétiquement ou par recherche.',
        actions: [
          'Rechercher une abréviation',
          'Parcourir par ordre alphabétique',
        ],
      },
      {
        id: 'termes-directionnels',
        label: 'Termes directionnels anatomiques',
        resume: 'Référence des termes d\'orientation anatomique avec définitions.',
        pro: true,
        description: 'Guide des termes directionnels et anatomiques utilisés en médecine vétérinaire.',
        actions: [
          'Parcourir les termes avec leurs définitions',
        ],
      },
      {
        id: 'examen-physique',
        label: 'Examen physique',
        resume: 'Guide systématique d\'examen physique par système.',
        pro: true,
        description: 'Guide structuré pour réaliser un examen physique complet et systématique par système corporel.',
        actions: [
          'Suivre les étapes par système',
        ],
      },
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutrition clinique',
    icone: 'ti-apple',
    couleur: '#84cc16',
    outils: [
      {
        id: 'nutrition-guides',
        label: '14 guides nutritionnels par condition',
        resume: 'Recommandations nutritionnelles spécifiques pour 14 conditions cliniques.',
        pro: true,
        description: 'La section Nutrition regroupe 14 guides détaillés couvrant les besoins alimentaires spécifiques aux principales conditions cliniques rencontrées chez le chien et le chat.',
        actions: [
          'Accéder au guide de la condition souhaitée',
          'Consulter les recommandations par espèce',
          'Voir les conseils de fréquence d\'alimentation et les types d\'aliments',
        ],
        astuce: 'Conditions couvertes : gestation/lactation, néonatologie, croissance, gériatrie, GI, peau, diabète, hyperthyroïdie, cancer, cardiaque, perte de poids, dentaire, rénal, urinaire.',
      },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    icone: 'ti-notes',
    couleur: '#06b6d4',
    outils: [
      {
        id: 'notes-perso',
        label: 'Notes personnelles',
        resume: 'Prise de notes cliniques personnelles avec couleurs et catégories.',
        pro: false,
        description: 'Outil de notes rapides pour usage clinique personnel. Les notes sont affichées en grille de tuiles colorées, classées par date de modification.',
        actions: [
          'Créer une note (titre + contenu requis, catégorie optionnelle)',
          'Choisir parmi 6 couleurs de tuile',
          'Filtrer par catégorie via les chips en haut',
          'Appuyer sur une tuile pour lire la note complète',
          'Modifier ou supprimer depuis la vue de lecture',
        ],
      },
    ],
  },
  {
    id: 'equipe',
    label: 'Équipe',
    icone: 'ti-users',
    couleur: '#6366f1',
    equipe: true,
    outils: [
      {
        id: 'babillard',
        label: 'Babillard d\'équipe',
        resume: 'Tableau d\'affichage partagé et synchronisé en temps réel pour toute la clinique.',
        equipe: true,
        description: 'Espace de communication partagé entre tous les membres de l\'équipe, mis à jour en temps réel. Remplace les post-it et les messages verbaux entre équipes.',
        actions: [
          'Publier un message d\'équipe',
          'Mentionner un membre avec @ (autocomplétion) ou toute l\'équipe avec @equipe',
          'Filtrer les messages par auteur ou catégorie',
          'Épingler un message important (admin/propriétaire)',
          'Archiver manuellement ou laisser l\'archivage automatique se faire après 90 jours',
          'Rechercher dans les messages actifs et les archives',
          'Recevoir une notification push quand vous êtes mentionné',
        ],
      },
      {
        id: 'taches',
        label: 'Gestion des tâches',
        resume: 'Suivi des tâches d\'équipe par statut avec assignation et notifications.',
        equipe: true,
        description: 'Gestionnaire de tâches partagé pour l\'équipe, organisé par statut (À faire, En cours, Terminé) avec assignation à un membre et date d\'échéance.',
        actions: [
          'Créer une tâche (titre, description, assigné, date d\'échéance)',
          'Cocher comme terminée avec le cercle',
          'Modifier tous les champs depuis la fiche tâche',
          'Filtrer "Mes tâches" pour ne voir que ce qui m\'est assigné',
          'Voir les dates en rouge (en retard) ou orange (aujourd\'hui/demain)',
          'Recevoir une notification push quand une tâche vous est assignée',
        ],
      },
      {
        id: 'gestion-equipe',
        label: 'Gestion des membres',
        resume: 'Inviter des membres et gérer les rôles (admin, propriétaire, membre).',
        equipe: true,
        description: 'Interface de gestion de l\'équipe permettant d\'inviter de nouveaux membres par courriel et de gérer leurs rôles.',
        actions: [
          'Inviter un membre par courriel',
          'Assigner le rôle : Propriétaire (plein accès), Admin (peut modifier le contenu partagé) ou Membre (lecture)',
          'Retirer un membre de l\'équipe',
        ],
        astuce: 'Les Admins peuvent modifier les médicaments personnalisés et les protocoles de labo partagés par la clinique.',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        resume: 'Historique des notifications de babillard et de tâches assignées.',
        equipe: true,
        description: 'Centre de notifications affichant les mentions (@vous, @equipe) du babillard et les nouvelles tâches assignées.',
        actions: [
          'Voir toutes les notifications non lues',
          'Appuyer sur une notification pour aller directement au message ou à la tâche',
        ],
      },
    ],
  },
]

const TOUS_OUTILS = SECTIONS.flatMap(s =>
  s.outils.map(o => ({ ...o, sectionLabel: s.label, sectionId: s.id, sectionCouleur: s.couleur }))
)

function BadgeOutil({ pro, equipe }) {
  if (equipe) return BADGE_EQUIPE
  if (pro) return BADGE_PRO
  return null
}

function GuideOutil({ outil, onBack }) {
  return (
    <div className="labo-detail-page">
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 14, fontWeight: 600, padding: '0 0 16px 0' }}
      >
        <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i> Retour
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{outil.label}</h1>
            <BadgeOutil pro={outil.pro} equipe={outil.equipe} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-hint)', margin: '4px 0 0 0' }}>{outil.sectionLabel}</p>
        </div>
      </div>

      <div className="labo-etape-card" style={{ marginBottom: 12 }}>
        <div style={{ padding: '12px 14px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{outil.description}</p>
        </div>
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Ce qu'on peut faire</h2>
        <div className="labo-etape-card">
          {outil.actions.map((action, i) => (
            <div key={i} className="labo-materiel-item" style={{ borderBottom: i < outil.actions.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <i className="ti ti-circle-check" style={{ color: 'var(--primary)', flexShrink: 0, fontSize: 15 }}></i>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {outil.astuce && (
        <div style={{ display: 'flex', gap: 10, background: 'rgba(212,175,55,0.08)', borderRadius: 'var(--radius-lg)', padding: '10px 14px', border: '1px solid rgba(212,175,55,0.2)' }}>
          <i className="ti ti-bulb" style={{ color: 'var(--accent-gold)', flexShrink: 0, fontSize: 16, marginTop: 1 }}></i>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{outil.astuce}</p>
        </div>
      )}
    </div>
  )
}

function ListeSection({ section, onOutil, onBack }) {
  return (
    <div className="labo-detail-page">
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 14, fontWeight: 600, padding: '0 0 16px 0' }}
      >
        <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i> Tutoriels
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: section.couleur + '1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <i className={`ti ${section.icone}`} style={{ fontSize: 20, color: section.couleur }}></i>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{section.label}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {section.outils.map((outil, i) => (
          <button
            key={outil.id}
            onClick={() => onOutil(outil.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--surface)', border: 'none', cursor: 'pointer',
              padding: '12px 14px', textAlign: 'left',
              borderRadius: i === 0 ? 'var(--radius-lg) var(--radius-lg) 4px 4px' : i === section.outils.length - 1 ? '4px 4px var(--radius-lg) var(--radius-lg)' : '4px',
              borderBottom: i < section.outils.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{outil.label}</span>
                <BadgeOutil pro={outil.pro} equipe={outil.equipe} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.4, display: 'block' }}>{outil.resume}</span>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 14, color: 'var(--text-hint)', flexShrink: 0 }}></i>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Tutoriels() {
  const [recherche, setRecherche] = useState('')
  const [sectionActive, setSectionActive] = useState(null)
  const [outilActif, setOutilActif] = useState(null)

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    if (!q) return []
    return TOUS_OUTILS.filter(o =>
      o.label.toLowerCase().includes(q) ||
      o.resume.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q)
    )
  }, [recherche])

  if (outilActif) {
    const outil = TOUS_OUTILS.find(o => o.id === outilActif)
    return <GuideOutil outil={outil} onBack={() => setOutilActif(null)} />
  }

  if (sectionActive) {
    const section = SECTIONS.find(s => s.id === sectionActive)
    return <ListeSection section={section} onOutil={setOutilActif} onBack={() => setSectionActive(null)} />
  }

  return (
    <div className="labo-detail-page">
      <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 14px 0' }}>Tutoriels</h1>

      {/* Barre de recherche */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: '8px 12px', marginBottom: 20,
      }}>
        <i className="ti ti-search" style={{ fontSize: 16, color: 'var(--text-hint)', flexShrink: 0 }}></i>
        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="Rechercher un outil ou une fonctionnalité..."
          style={{
            flex: 1, border: 'none', background: 'transparent', fontSize: 14,
            color: 'var(--text-primary)', outline: 'none',
          }}
        />
        {recherche && (
          <button onClick={() => setRecherche('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
            <i className="ti ti-x" style={{ fontSize: 14, color: 'var(--text-hint)' }}></i>
          </button>
        )}
      </div>

      {/* Résultats de recherche */}
      {recherche.trim() ? (
        resultats.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-hint)', textAlign: 'center', marginTop: 40 }}>Aucun résultat pour "{recherche}"</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {resultats.map((outil, i) => (
              <button
                key={outil.id}
                onClick={() => { setOutilActif(outil.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--surface)', border: 'none', cursor: 'pointer',
                  padding: '12px 14px', textAlign: 'left', borderRadius: 'var(--radius-lg)',
                  marginBottom: 6,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{outil.label}</span>
                    <BadgeOutil pro={outil.pro} equipe={outil.equipe} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-hint)', display: 'block', marginBottom: 2 }}>{outil.sectionLabel}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>{outil.resume}</span>
                </div>
                <i className="ti ti-chevron-right" style={{ fontSize: 14, color: 'var(--text-hint)', flexShrink: 0 }}></i>
              </button>
            ))}
          </div>
        )
      ) : (
        /* Grille de sections */
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setSectionActive(section.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: 8, padding: '14px 14px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: section.couleur + '1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${section.icone}`} style={{ fontSize: 18, color: section.couleur }}></i>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{section.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>
                    {section.outils.length} outil{section.outils.length > 1 ? 's' : ''}
                    {section.equipe ? ' · Équipe' : section.outils.some(o => o.pro) ? ' · dont Pro' : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-hint)', textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
            {TOUS_OUTILS.filter(o => !o.pro && !o.equipe).length} outils gratuits ·{' '}
            {TOUS_OUTILS.filter(o => o.pro).length} Pro ·{' '}
            {TOUS_OUTILS.filter(o => o.equipe).length} Équipe
          </p>
        </>
      )}
    </div>
  )
}
