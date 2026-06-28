import { useState } from 'react'
import IconesEspeces from '../components/IconesEspeces'

// ─── DONNÉES ─────────────────────────────────────────────

const TOXIQUES = {
  plantes: [
    { nom: 'Aloe vera', img: 'aloe-vera.jpg', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Saponines, anthraquinones (latex/sève) : vomissements, léthargie, diarrhée; urine rougeâtre possible. Le gel intérieur est comestible.' },
    { nom: 'Amanite à amatoxines (Amanita phalloides, virosa, ocreata, verna)', img: 'amanita-phalloides.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Amatoxines (alpha-amanitine), inhibition de l\'ARN polymérase II. Évolution en trois temps : phase digestive (6-24h : vomissements, diarrhée hémorragique, douleurs abdominales), puis rémission trompeuse (12-48h), puis insuffisance hépatique aiguë (ictère, hypoglycémie, coagulopathie, encéphalopathie, coma); atteinte rénale possible. Pronostic très sombre, peu d\'antidote spécifique.' },
    { nom: 'Amanite à acide iboténique (Amanita muscaria / tue-mouches, A. pantherina / panthère)', img: 'amanita-muscaria.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Acide iboténique et muscimol, action sur le SNC (GABAergique et glutamatergique); peu de muscarine malgré le nom. Début rapide (30 min à 3h) : alternance de dépression et d\'excitation du SNC, ataxie, désorientation, hypersalivation, mydriase, tremblements, parfois convulsions et coma fluctuant. Rarement mortel; récupération habituelle en 24-48h avec soins de support.' },
    { nom: 'Canne des muets (Dieffenbachia)', img: 'dieffenbachia.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles (sève) : irritation buccale immédiate, hypersalivation, oedème de la langue/lèvres, vomissements, difficulté à avaler.' },
    { nom: 'Gui (Viscum album / Phoradendron spp.)', img: 'gui.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Lectines, phoratoxines : vomissements, diarrhée, hypotension, bradycardie, dyspnée (forte ingestion); les feuilles sont plus toxiques que les baies.' },
    { nom: 'Houx (Ilex spp.)', img: 'houx.jpg', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Saponines : vomissements, diarrhée, abattement, claquement des lèvres, hypersalivation; toxicité généralement légère.' },
    { nom: 'Houblon (Humulus lupulus)', img: 'houblon.jpg', especes: ['chien'], toxicite: 'Très élevée (mortelle)', effets: 'Hyperthermie maligne (>40,6 °C), tachypnée, tachycardie, tremblements, convulsions; décès possible en moins de 6h sans traitement.' },
    { nom: 'Laurier-rose (Nerium oleander)', img: 'laurier-rose.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cardiotoniques : hypersalivation, vomissements, diarrhée, ulcérations buccales, arythmies, hypotension, insuffisance cardiaque.' },
    { nom: 'If (Taxus)', img: 'if.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Taxines : vomissements, tremblements, dyspnée, convulsions, arythmies; mort subite par insuffisance cardiaque aiguë possible sans signes prodromiques.' },
    { nom: 'Digitale (Digitalis purpurea)', img: 'digitale.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cardiotoniques : hypersalivation, vomissements, diarrhée, faiblesse, arythmies, insuffisance cardiaque; toxique même via l\'eau du vase.' },
    { nom: 'Colchique (Colchicum autumnale)', img: 'colchique.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Colchicine : vomissements et diarrhée hémorragiques, choc, atteinte hépatique/rénale, dépression médullaire, convulsions; signes parfois retardés de plusieurs jours.' },
    { nom: 'Lys (toutes espèces de Lilium)', img: 'lys.jpg', especes: ['chat'], toxicite: 'Très élevée (mortelle)', effets: 'Abattement, hypersalivation, vomissements, perte d\'appétit (0-12h), puis polyurie/déshydratation (12-24h) et insuffisance rénale aiguë avec anurie possible (24-72h); ingestion minime suffisante.' },
    { nom: 'Plante maïs (Dracaena)', img: 'dracaena.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Saponines : vomissements, dépression, perte d\'appétit, hypersalivation, incoordination; chez le chat, dilatation pupillaire et tachycardie possibles.' },
    { nom: 'Palmier de Sago (Cycas revoluta)', img: 'palmier-sago.jpg', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Cycasine : vomissements (parfois hémorragiques), selles noires, ictère, polydipsie, troubles de la coagulation, insuffisance hépatique aiguë; jusqu\'à 50% de mortalité, 1-2 graines peuvent être fatales.' },
    { nom: 'Plante de jade (Crassula)', img: 'plante-jade.jpg', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Vomissements, diarrhée, dépression, incoordination (ataxie); rarement tremblements. Le chat semble plus sensible que le chien.' },
    { nom: 'Poinsettia (étoile de Noël)', img: 'poinsettia.jpg', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Irritation buccale et gastrique, vomissements, hypersalivation, rarement diarrhée; irritation cutanée possible au contact de la sève. Signes généralement légers et spontanément résolutifs.' },
    { nom: 'Tulipe (Tulipa spp.)', img: 'tulipe.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Tulipaline (bulbe surtout) : hypersalivation, vomissements, diarrhée, dépression; fortes ingestions : tachycardie, dyspnée, tremblements, convulsions.' },
    { nom: 'Jonquille / Narcisse (Narcissus spp.)', img: 'jonquille.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Lycorine et alcaloïdes (bulbe surtout) : hypersalivation, vomissements, diarrhée; fortes ingestions : hypotension, tremblements, arythmies, convulsions.' },
  ],
  aliments: [
    { nom: 'Alcool', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Vomissements, diarrhée, incoordination, dépression, difficulté respiratoire, tremblements, changements du pH sanguin, coma et même la mort.' },
    { nom: 'Avocat', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Les feuilles, le fruit, les noyaux et l\'écorce contiennent de la persine, pouvant causer vomissements et diarrhée chez le chien. La persine est surtout dangereuse pour les oiseaux et les grands herbivores; chez le chien et le chat, les vrais risques pratiques sont plutôt le noyau (obstruction) et la teneur en gras (pancréatite).' },
    { nom: 'Chocolat', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Contient des méthylxanthines (fèves de cacao) : vomissements, diarrhée, halètement, soif et miction excessives, hyperactivité, rythme cardiaque anormal, tremblements, convulsions et même la mort.' },
    { nom: 'Agrumes', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Les tiges, feuilles, écorces, fruits et graines contiennent de l\'acide citrique et des huiles essentielles pouvant irriter. De petites doses (ex. manger le fruit) ne causent généralement qu\'un léger trouble digestif.' },
    { nom: 'Noix de coco et huile de coco', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'En petite quantité, peu susceptible de causer un tort sérieux. La chair et le lait de coco frais contiennent des huiles pouvant causer trouble digestif, selles molles et diarrhée.' },
    { nom: 'Raisins et raisins secs', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: ' L\'acide tartrique est aujourd\'hui identifié comme le principe toxique probable. La sensibilité varie beaucoup d\'un chien à l\'autre, mais ces fruits peuvent causer une insuffisance rénale chez certains animaux.' },
    { nom: 'Noix de macadamia', especes: ['chien'], toxicite: 'Modérée', effets: 'Faiblesse, dépression, vomissements, tremblements et hyperthermie chez le chien. Signes généralement dans les 12h suivant l\'ingestion, durant environ 12 à 48h.' },
    { nom: 'Lait et produits laitiers', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Les animaux ne possèdent pas suffisamment de lactase (enzyme qui dégrade le lactose) : diarrhée ou autres troubles digestifs.' },
    { nom: 'Noix (amandes, pacanes, noix de Grenoble, etc.)', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Riches en huiles et matières grasses : vomissements, diarrhée et potentiellement une pancréatite.' },
    { nom: 'Oignon, ail et ciboulette', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Irritation gastro-intestinale et dommages aux globules rouges pouvant mener à une anémie. Le chat est plus sensible, mais le chien est aussi à risque selon la quantité ingérée.' },
    { nom: 'Viande, œufs et os crus ou insuffisamment cuits', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'La viande et les œufs crus peuvent contenir des bactéries (Salmonella, E. coli) dangereuses pour l\'animal comme pour l\'humain. Les œufs crus contiennent aussi une protéine nuisant à l\'absorption de certaines vitamines (problèmes de peau/pelage). Les os crus présentent un risque de blessure ou d\'obstruction du tube digestif.' },
    { nom: 'Sel', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'De grandes quantités peuvent causer une soif et miction excessives, voire une intoxication aux ions sodium : vomissements, diarrhée, dépression, tremblements, hyperthermie, convulsions et même la mort.' },
    { nom: 'Xylitol', especes: ['chien'], toxicite: 'Très élevée', effets: 'Édulcorant présent dans la gomme, les bonbons, les produits de boulangerie et le dentifrice. Libération massive d\'insuline provoquant une hypoglycémie sévère (faiblesse, ataxie, convulsions); à plus forte dose, atteinte hépatique aiguë possible.' },
    { nom: 'Pâte à pain crue (levure)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'La levure peut fermenter et produire des gaz dans le système digestif, causant un ballonnement douloureux de l\'estomac pouvant évoluer en torsion — une urgence vitale. La fermentation de la levure produit aussi de l\'éthanol, donc une intoxication alcoolique en parallèle est possible (hypoglycémie, dépression du SNC, acidose métabolique).' },
  ],
  medicaments: [
    { nom: 'Ibuprofène, naproxène, aspirine', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Ulcères gastriques, hémorragie, insuffisance rénale.' },
    { nom: 'Acétaminophène (paracétamol)', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle chez le chat)', effets: 'Anémie, méthémoglobinémie, hépatotoxicité sévère.' },
    { nom: 'Benzodiazépines, antidépresseurs, bêta-bloquants', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Dépression du SNC, hypotension, troubles neurologiques.' },
  ],
 produits_menagers: [
    { nom: 'Antigel (éthylène glycol)', especes: ['chien', 'chat', 'furet', 'oiseau'], toxicite: 'Très élevée (mortelle)', effets: 'Goût sucré attirant, très faible dose suffisante (le chat est extrêmement sensible). Évolution en trois temps : phase d\'ébriété neurologique (30 min à 12h : ataxie, dépression, vomissements, polyuro-polydipsie, convulsions), phase cardiopulmonaire (12-24h), puis insuffisance rénale aiguë par cristaux d\'oxalate de calcium (chat 12-24h, chien 36-72h), souvent irréversible. Urgence absolue : antidote (fomépizole ou éthanol) efficace seulement si administré tôt.' },
    { nom: 'Piles et batteries', especes: ['chien', 'chat', 'furet', 'oiseau'], toxicite: 'Modérée à élevée', effets: 'Piles alcalines percées : brûlures caustiques de la bouche et du tube digestif. Piles boutons (surtout lithium) : nécrose des tissus par courant électrique en quelques heures si logées dans l\'oesophage, brûlures, perforation possible. Métaux lourds (zinc, plomb) en cas de rétention : intoxication métallique; risque aussi d\'obstruction. Les oiseaux sont particulièrement sensibles aux métaux.' },
    { nom: 'Huiles essentielles', especes: ['chien', 'chat', 'oiseau', 'furet'], toxicite: 'Élevée', effets: 'Phénols et terpènes (arbre à thé, gaulthérie, pin, agrumes, eucalyptus, cannelle, menthe, etc.). Le chat métabolise mal ces composés (déficit de glucuronidation hépatique). Exposition par ingestion, voie cutanée ou inhalation (diffuseurs). Signes : hypersalivation, vomissements, ataxie, tremblements, dépression du SNC, atteinte hépatique, irritation cutanée. Les oiseaux sont extrêmement sensibles par inhalation (détresse respiratoire).' },
    { nom: 'Eau de Javel (bleach)', especes: ['chien', 'chat', 'oiseau'], toxicite: 'Faible à modérée', effets: 'Javel non diluée : lésions de la bouche et de l\'oesophage, surtout si concentration ou pH élevé. Diluée, rincée et une fois l\'odeur dissipée, elle peut servir à nettoyer jouets et cages sans danger. Les oiseaux sont extrêmement sensibles aux vapeurs.' },
    { nom: 'Vinaigre et eau', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Solution acide pouvant causer une irritation et un léger trouble digestif. Sans risque si diluée, rincée et séchée avant le retour de l\'animal.' },
    { nom: 'Nettoyants enzymatiques', especes: ['chien', 'chat', 'oiseau'], toxicite: 'Faible', effets: 'Léger trouble digestif. Laisser sécher complètement avant de laisser l\'animal accéder à la zone traitée. Prudence avec les oiseaux, sensibles aux vapeurs de nettoyants.' },
    { nom: 'Cosmétiques (rouge à lèvres, brillant, fond de teint, mascara, fard)', especes: ['chien', 'chat', 'furet'], toxicite: 'Faible', effets: 'Trouble digestif léger. Les produits hydratants (ex. beurre de karité) ont un effet laxatif et peuvent causer de la diarrhée. Le principal risque vient de l\'emballage ingéré : corps étranger et obstruction digestive possibles (urgence).' },
    { nom: 'Lotions hydratantes', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Petite quantité léchée : trouble digestif léger. Plus grande quantité : trouble plus marqué. En cas de vomissement, risque d\'aspiration et de pneumonie par aspiration.' },
    { nom: 'Vaseline (gelée de pétrole)', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Effet laxatif : trouble digestif, plus marqué si grande quantité. Risque de pneumonie par aspiration en cas de vomissement.' },
    { nom: 'Savon en barre', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Trouble digestif léger. Les chiens en raffolent, donc à garder hors de portée. Des bulles peuvent sortir du nez au vomissement, sans gravité.' },
    { nom: 'Dentifrice', especes: ['chien', 'chat', 'furet'], toxicite: 'Variable selon la composition', effets: 'Peut contenir du fluorure ou du xylitol. Fluorure : insuffisant pour des signes dans la plupart des cas, mais une grande quantité cause trouble digestif sévère, arythmies, hypotension et déséquilibres électrolytiques graves. Xylitol : hypoglycémie et atteinte hépatique possibles. La teneur varie beaucoup d\'une marque à l\'autre.' },
    { nom: 'Capsules et détergent à lessive liquide', especes: ['chien', 'chat', 'furet'], toxicite: 'Modérée à élevée', effets: 'Trouble digestif et irritation de la bouche et de la gorge. Dans certains cas, signes graves voire mortels.' },
    { nom: 'Feuilles d\'assouplissant (dryer sheets)', especes: ['chien', 'chat', 'furet'], toxicite: 'Élevée', effets: 'Détergents cationiques (surtout dans les feuilles neuves) : brûlures chimiques et ulcères sévères de la bouche, de l\'oesophage et de l\'estomac. Risque aussi de corps étranger et d\'obstruction digestive.' },
    { nom: 'Assouplissant liquide', especes: ['chien', 'chat', 'furet'], toxicite: 'Élevée', effets: 'Détergents cationiques : brûlures chimiques et ulcères sévères de la bouche, de l\'oesophage et de l\'estomac.' },
  ],
  metaux: [
    { nom: 'Objets métalliques contenant du plomb (plombs de pêche, balles, batteries)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Troubles gastro-intestinaux, neurologiques, signes d\'anémie chronique.' },
    { nom: 'Peintures anciennes au plomb, poussières de rénovation, vieux tuyaux', especes: ['chien', 'chat'], toxicite: 'Élevée à très élevée', effets: 'Vomissements, constipation, convulsions, cécité corticale, ataxie, anémie, hyperexcitabilité.' },
    { nom: 'Poissons contaminés (mercure organique)', especes: ['chat', 'chien'], toxicite: 'Modérée à élevée', effets: 'Tremblements, ataxie, vomissements, polyurie, atteinte rénale ou hépatique.' },
    { nom: 'Thermomètres brisés, désinfectants anciens au mercure', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Signes neurologiques (convulsions, faiblesse), troubles digestifs et rénaux.' },
    { nom: 'Rodenticides à base d\'arsenic, produits agricoles obsolètes', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'Vomissements hémorragiques, diarrhée profuse, douleur abdominale aiguë, déshydratation, coma.' },
    { nom: 'Herbicides et bois traité (cendres contenant de l\'arsenic)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Troubles digestifs aigus, atteinte hépatique ou rénale, effondrement rapide.' },
    { nom: 'Insecticides agricoles à base d\'organophosphorés (malathion, diazinon, chlorpyrifos)', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'Hypersalivation, vomissements, miosis, bradycardie, fasciculations, convulsions, détresse respiratoire.' },
    { nom: 'Colliers antiparasitaires ou produits topiques inappropriés', especes: ['chat', 'chien'], toxicite: 'Élevée à très élevée', effets: 'Tremblements, dépression, convulsions, coma (toxicité accrue chez le chat).' },
  ],
}

const ANTIDOTES = [
  { generique: 'Acétylcystéine', notes: 'Antidote en cas d\'intoxication à l\'acétaminophène, xylitol ou phénol; mucolytique (voies respiratoires, yeux). Forme injectable ou inhalation, efficace si donnée rapidement (dans les 8 heures après ingestion).' },
  { generique: 'Atropine', notes: 'Utilisée comme antidote en cas d\'intoxication aux organophosphorés ou aux carbamates.' },
  { generique: 'Bleu de méthylène', notes: 'Antidote contre la méthémoglobinémie; également utilisé comme colorant diagnostic. Utilisés selon le type de toxine concernée, avec des protocoles spécifiques.' },
  { generique: 'Dimercaprol (B.A.L.)', notes: 'Chélateur pour intoxications graves au plomb, mercure ou arsenic (usage documenté).' },
  { generique: 'EDTA de calcium (CaEDTA)', notes: 'Chélateur pour intoxications au plomb, au mercure ou à l\'arsenic.' },
  { generique: 'Éthanol', notes: 'Antidote contre l\'intoxication à l\'éthylène glycol (antigel), via compétition enzymatique.' },
  { generique: 'Fomépizole (4-MP)', notes: 'Utilisé comme antidote lors d\'intoxication à l\'éthylène glycol; contre-indiqué chez le chat.' },
  { generique: 'Pralidoxime (2-PAM)', notes: 'Réactivateur de la cholinestérase contre les intoxications aux organophosphorés, efficace si administré tôt. Leur efficacité dépend du moment d\'administration et des agents impliqués.' },
  { generique: 'Silibinine / Silymarine', notes: 'Intoxication aux champignons hépatotoxiques (ex. Amanita), toxines hépatotoxiques (Sago palm, xylitol).' },
]

const TESTS_DIAG = [
  { test: 'Bilan biochimique complet', utilite: 'Évalue la fonction hépatique, rénale, électrolytes, glucose.', toxiques: 'Antigel, xylitol, AINS, lys, paracétamol, raisins.' },
  { test: 'Numération formule sanguine (NFS)', utilite: 'Recherche d\'anémie, d\'infection, de troubles hématologiques.', toxiques: 'Plomb, oignon, ail, arsenic, anticoagulants.' },
  { test: 'Analyse d\'urine (BU + sédiment)', utilite: 'Recherche de cristaux, pigmenturie, densité urinaire, anomalies rénales.', toxiques: 'Antigel, lys, AINS, plomb.' },
  { test: 'Gaz sanguins et lactates', utilite: 'Évalue l\'équilibre acido-basique, la perfusion tissulaire, l\'oxygénation.', toxiques: 'Antigel, salicylés, paracétamol, arsenic.' },
  { test: 'Temps de coagulation (PT/PTT)', utilite: 'Vérifie la fonction de la cascade de coagulation.', toxiques: 'Anticoagulants (warfarine, rodenticides), champignons.' },
  { test: 'Radiographie abdominale', utilite: 'Visualisation de corps étrangers radio-opaques.', toxiques: 'Plomb, zinc, piles, médicaments en comprimés.' },
  { test: 'Échographie abdominale', utilite: 'Évaluation hépatique, rénale, pancréatique.', toxiques: 'Palmier de Sago, xylitol, champignons, lys.' },
  { test: 'Dosage de toxiques spécifiques', utilite: 'Confirme l\'exposition à certaines molécules (rarement disponible sur place).', toxiques: 'Paracétamol, éthylène glycol, plomb, broméline, THC.' },
  { test: 'Électrocardiogramme (ECG)', utilite: 'Détection d\'arythmies, conduction anormale.', toxiques: 'Chocolat, digitaliques (oléandre), OP, bêta-bloquants.' },
  { test: 'Bilan hépatique spécifique (ALT, AST, ALP, bilirubine)', utilite: 'Détection précoce d\'atteinte hépatique.', toxiques: 'Paracétamol, xylitol, champignons, arsenic, AINS.' },
  { test: 'Ammoniémie (rarement pratiquée)', utilite: 'Confirme une atteinte hépatique avancée.', toxiques: 'Toxiques à atteinte hépatique massive.' },
  { test: 'Tests rapides de détection (bandelettes, lecteurs spécialisés)', utilite: 'Test de dépistage préliminaire si le matériel est accessible.', toxiques: 'Rodenticides, THC, stimulants.' },
]

const RESSOURCES = [
  {
    nom: 'CAPAEQ',
    description: 'Centre antipoison pour animaux de l\'Est du Québec',
    type: 'Centre vétérinaire toxico',
    pourQui: 'Vétérinaires seulement',
    langue: 'Français (réseau pro)',
    telephone: 'Fourni aux cliniques abonnées seulement (pas public)',
    web: null,
  },
  {
    nom: 'MAPAQ',
    description: 'Ministère de l\'Agriculture, des Pêcheries et de l\'Alimentation du Québec',
    type: 'Gouvernement provincial',
    pourQui: 'Grand public',
    langue: 'Français',
    telephone: '1 800 463-5023',
    web: 'mapaq.gouv.qc.ca',
  },
  {
    nom: 'ASPCA Animal Poison Control Center',
    description: 'Centre antipoison 24/7 (États-Unis)',
    type: 'Centre 24/7 USA',
    pourQui: 'Public et vétérinaires',
    langue: 'Anglais (payant)',
    telephone: '1 888 426-4435 (frais env. 75 à 95 USD)',
    web: 'aspca.org/apcc',
  },
  {
    nom: 'Pet Poison Helpline',
    description: 'Ligne d\'aide antipoison 24/7 (États-Unis)',
    type: 'Centre 24/7 USA',
    pourQui: 'Public et vétérinaires',
    langue: 'Anglais (payant)',
    telephone: '1 855 764-7661 (frais env. 85 à 95 USD)',
    web: 'petpoisonhelpline.com',
  },
]

// ─── NIVEAUX DE TOXICITÉ ─────────────────────────────────
function couleurToxicite(toxicite) {
  const t = toxicite.toLowerCase()
  if (t.includes('mortelle') || t.includes('très élevée')) return 'var(--accent-red)'
  if (t.includes('élevée')) return '#c0392b'
  if (t.includes('modérée')) return 'var(--accent-gold)'
  return 'var(--primary)'
}

// ─── PHOTO DE LA PLANTE (avec repli si absente) ─────────
function PhotoPlante({ img, nom }) {
  const [erreur, setErreur] = useState(false)

  if (!img || erreur) {
    return (
      <div className="toxico-plante-photo toxico-plante-photo--vide">
        <i className="ti ti-plant"></i>
      </div>
    )
  }

  return (
    <img
      src={`/plantes/${img}`}
      alt={nom}
      className="toxico-plante-photo"
      onError={() => setErreur(true)}
    />
  )
}

// ─── ONGLETS ─────────────────────────────────────────────
const ONGLETS = [
  { id: 'plantes', label: 'Plantes', icone: 'ti-plant' },
  { id: 'aliments', label: 'Aliments', icone: 'ti-apple' },
  { id: 'medicaments', label: 'Médicaments', icone: 'ti-pill' },
  { id: 'produits_menagers', label: 'Produits ménagers', icone: 'ti-home' },
  { id: 'metaux', label: 'Métaux et pesticides', icone: 'ti-flask' },
  { id: 'antidotes', label: 'Antidotes', icone: 'ti-first-aid-kit' },
  { id: 'tests', label: 'Tests diagnostiques', icone: 'ti-stethoscope' },
  { id: 'ressources', label: 'Ressources et contacts', icone: 'ti-phone' },
]

export default function Toxicologie() {
  const [onglet, setOnglet] = useState('plantes')
  const [selectionne, setSelectionne] = useState(null)

  const toxiquesActifs = TOXIQUES[onglet] || []

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── SÉLECTEUR D'ONGLETS ────────────── */}
        <div className="dilution-modes">
          {ONGLETS.map(o => (
            <button
              key={o.id}
              className={`dilution-mode-btn ${onglet === o.id ? 'actif' : ''}`}
              onClick={() => setOnglet(o.id)}
            >
              <i className={`ti ${o.icone}`}></i>
              <span className="dilution-mode-label">{o.label}</span>
            </button>
          ))}
        </div>

        {/* ─── LISTE PLANTES (avec photo) ─────── */}
        {onglet === 'plantes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {toxiquesActifs.map((t, i) => (
              <button key={i} className="toxico-plante-card" onClick={() => setSelectionne(t)}>
                <PhotoPlante img={t.img} nom={t.nom} />
                <div className="toxico-plante-contenu">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{t.nom}</span>
                    <IconesEspeces especes={t.especes} />
                  </div>
                  <span style={{ fontSize: 12, color: couleurToxicite(t.toxicite), fontWeight: 600, marginTop: 4, display: 'block' }}>{t.toxicite}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ─── LISTE TOXIQUES (autres catégories) ─ */}
        {['aliments', 'medicaments', 'produits_menagers', 'metaux'].includes(onglet) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {toxiquesActifs.map((t, i) => (
              <button
                key={i}
                className="labo-etape-card"
                onClick={() => setSelectionne(t)}
                style={{ textAlign: 'left', padding: '12px 14px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{t.nom}</span>
                  <IconesEspeces especes={t.especes} />
                </div>
                <span style={{ fontSize: 12, color: couleurToxicite(t.toxicite), fontWeight: 600, marginTop: 4, display: 'block' }}>{t.toxicite}</span>
              </button>
            ))}
          </div>
        )}

        {/* ─── ANTIDOTES ──────────────────────── */}
        {onglet === 'antidotes' && (
          <div className="labo-ref-tableau">
            <div className="labo-ref-header" style={{ gridTemplateColumns: '1fr 3fr' }}>
              <span>Générique</span>
              <span>Notes</span>
            </div>
            {ANTIDOTES.map((a, i) => (
              <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1fr 3fr' }}>
                <span style={{ fontWeight: 700 }}>{a.generique}</span>
                <span style={{ fontSize: 12 }}>{a.notes}</span>
              </div>
            ))}
          </div>
        )}

        {/* ─── TESTS DIAGNOSTIQUES ────────────── */}
        {onglet === 'tests' && (
          <div className="labo-ref-tableau">
            <div className="labo-ref-header" style={{ gridTemplateColumns: '1.2fr 1.4fr 1.2fr' }}>
              <span>Test</span>
              <span>Utilité</span>
              <span>Toxiques ciblés</span>
            </div>
            {TESTS_DIAG.map((t, i) => (
              <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1.2fr 1.4fr 1.2fr' }}>
                <span style={{ fontWeight: 700 }}>{t.test}</span>
                <span style={{ fontSize: 12 }}>{t.utilite}</span>
                <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{t.toxiques}</span>
              </div>
            ))}
          </div>
        )}

        {/* ─── RESSOURCES ─────────────────────── */}
        {onglet === 'ressources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            {RESSOURCES.map((r, i) => (
              <div key={i} className="labo-etape-card" style={{ padding: '14px' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', margin: '0 0 2px 0' }}>{r.nom}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{r.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: 0 }}>Pour : {r.pourQui} · {r.langue}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0 }}>
                    <i className="ti ti-phone" style={{ marginRight: 6, color: 'var(--primary)' }}></i>{r.telephone}
                  </p>
                  {r.web && (
  <a href={`https://${r.web}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
    <i className="ti ti-world" style={{ marginRight: 6 }}></i>{r.web}
  </a>
)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── POPUP DÉTAIL TOXIQUE ────────────── */}
      {selectionne && (
        <div className="popup-overlay" onClick={() => setSelectionne(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{selectionne.nom}</span>
              <button className="popup-close" onClick={() => setSelectionne(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IconesEspeces especes={selectionne.especes} />
                <span style={{ fontSize: 13, fontWeight: 700, color: couleurToxicite(selectionne.toxicite) }}>
                  {selectionne.toxicite}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4 }}>Effets et indications cliniques</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{selectionne.effets}</p>
              </div>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setSelectionne(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
