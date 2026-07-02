import { useState } from 'react'
import IconesEspeces from '../components/IconesEspeces'

// ─── DONNÉES ─────────────────────────────────────────────

const TOXIQUES = {
plantes: [
    { nom: 'Aloe vera', img: 'aloe-vera.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Faible à modérée', effets: 'Saponines, anthraquinones (latex/sève) : vomissements, léthargie, diarrhée; urine rougeâtre possible. Le gel intérieur est comestible.' },
    { nom: 'Amanite à acide iboténique (Amanita muscaria / tue-mouches, A. pantherina / panthère)', img: 'amanita-muscaria.jpg', categorie: 'sauvage', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Acide iboténique et muscimol, action sur le SNC (GABAergique et glutamatergique);malgré le nom, le tableau n\'est pas surtout muscarinique : l\'acide iboténique et le muscimol dominent. Début rapide (30 min à 3h) : alternance de dépression et d\'excitation du SNC, ataxie, désorientation, hypersalivation, mydriase, tremblements, parfois convulsions et coma fluctuant. Rarement mortel; récupération habituelle en 24-48h avec soins de support.' },
    { nom: 'Amanite à amatoxines (Amanita phalloides, virosa, ocreata, verna)', img: 'amanita-phalloides.jpg', categorie: 'sauvage', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Amatoxines (alpha-amanitine), inhibition de l\'ARN polymérase II. Évolution en trois temps : phase digestive (6-24h : vomissements, diarrhée hémorragique, douleurs abdominales), puis rémission trompeuse (12-48h), puis insuffisance hépatique aiguë (ictère, hypoglycémie, coagulopathie, encéphalopathie, coma); atteinte rénale possible. Pronostic très sombre, peu d\'antidote spécifique.' },
    { nom: 'Amaryllis (Hippeastrum)', img: 'amaryllis.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Lycorine et alcaloïdes (bulbe surtout) : hypersalivation, vomissements (parfois sanglants), diarrhée, douleur abdominale, abattement, tremblements. Même famille que le narcisse; plante forcée en pot l\'hiver.' },
    { nom: 'Asclépiade (Asclepias)', img: 'asclepiade.jpg', categorie: 'sauvage', especes: ['chien', 'chat', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Élevée à très élevée', effets: 'Glycosides cardiotoniques et résinoïdes neurotoxiques selon l\'espèce : vomissements, diarrhée, faiblesse, ataxie, tremblements, convulsions, arythmies, dépression respiratoire. Très répandue au Québec (plante hôte du monarque); toxique pour le bétail et les chevaux.' },
    { nom: 'Azalée / Rhododendron', img: 'azalee.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Élevée', effets: 'Grayanotoxines (toutes les parties) : hypersalivation, vomissements, diarrhée, faiblesse, bradycardie et arythmies, hypotension, dépression du SNC, convulsions. Toxique aussi pour les chevaux et ruminants au pâturage; une faible quantité de feuilles suffit.' },
    { nom: 'Canne des muets (Dieffenbachia)', img: 'dieffenbachia.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles (sève) : irritation buccale immédiate, hypersalivation, oedème de la langue/lèvres, vomissements, difficulté à avaler.' },
    { nom: 'Cerisier de Virginie / cerisier sauvage (Prunus virginiana)', img: 'cerisier-virginie.jpg', categorie: 'sauvage', especes: ['chien', 'chat', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cyanogènes, surtout dans les feuilles flétries (gel, bris de branche, sécheresse) : libération de cyanure, muqueuses rouge vif, dyspnée, tachypnée, ataxie, convulsions, mort rapide. Surtout chez les ruminants et les chevaux.' },
    { nom: 'Cicutaire maculée (carotte à Moreau, Cicuta maculata)', img: 'cicutaire.jpg', categorie: 'sauvage', especes: ['chien', 'chat', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Très élevée (mortelle)', effets: 'Cicutoxine (antagoniste des récepteurs GABA), surtout dans le rhizome : hypersalivation, douleurs abdominales, spasmes musculaires, convulsions violentes, coma et mort par asphyxie, parfois en moins de 15 minutes. Considérée comme la plante la plus toxique d\'Amérique du Nord; milieux humides du Québec. Les animaux de ferme s\'empoisonnent par le feuillage.' },
    { nom: 'Ciguë maculée (grande ciguë, Conium maculatum)', img: 'cigue.jpg', categorie: 'sauvage', especes: ['chien', 'chat', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Très élevée (mortelle)', effets: 'Coniine et alcaloïdes neurotoxiques : hypersalivation, mydriase, tremblements, ataxie, bradycardie, faiblesse, paralysie progressive et arrêt respiratoire. Effets tératogènes chez le bétail. Confusion possible avec des plantes de la famille de la carotte.' },
    { nom: 'Colchique (Colchicum autumnale)', img: 'colchique.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval', 'vache'], toxicite: 'Très élevée (mortelle)', effets: 'Colchicine : vomissements et diarrhée hémorragiques, choc, atteinte hépatique/rénale, dépression médullaire, convulsions; signes parfois retardés de plusieurs jours. Toxique pour les chevaux et bovins, notamment via le foin contaminé.' },
    { nom: 'Cyclamen', img: 'cyclamen.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée à élevée', effets: 'Saponines terpénoïdes, concentrées dans le tubercule : hypersalivation, vomissements, diarrhée. Ingestion importante de tubercule : arythmies, convulsions, voire mort.' },
    { nom: 'Digitale (Digitalis purpurea)', img: 'digitale.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval', 'vache'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cardiotoniques : hypersalivation, vomissements, diarrhée, faiblesse, arythmies, insuffisance cardiaque; toxique même via l\'eau du vase. Les chevaux et bovins y sont aussi sensibles.' },
    { nom: 'Érable rouge (Acer rubrum)', img: 'erable-rouge.jpg', categorie: 'sauvage', especes: ['cheval'], toxicite: 'Très élevée (mortelle chez le cheval)', effets: 'Toxicité propre aux équidés : les feuilles flétries ou séchées causent une anémie hémolytique sévère (corps de Heinz, méthémoglobinémie). Faiblesse, muqueuses pâles ou ictériques, urine brun-rouge, tachypnée, détresse respiratoire. Risque surtout en fin d\'été et à l\'automne, ou après une chute de branches.' },
    { nom: 'Fougère-aigle (Pteridium aquilinum)', img: 'fougere-aigle.jpg', categorie: 'sauvage', especes: ['cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Modérée à élevée', effets: 'Thiaminase (carence en vitamine B1) chez le cheval : ataxie, signes neurologiques. Chez les bovins, ingestion chronique : aplasie médullaire, hémorragies, et effet cancérigène (vessie). Intoxication surtout par ingestion répétée.' },
    { nom: 'Gui (Viscum album / Phoradendron spp.)', img: 'gui.jpg', categorie: 'sauvage', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Lectines, phoratoxines : vomissements, diarrhée, hypotension, bradycardie, dyspnée (forte ingestion); les feuilles sont plus toxiques que les baies.' },
    { nom: 'Houblon (Humulus lupulus)', img: 'houblon.jpg', categorie: 'jardin', especes: ['chien'], toxicite: 'Très élevée (mortelle)', effets: 'Hyperthermie maligne (>40,6 °C), tachypnée, tachycardie, tremblements, convulsions; décès possible en moins de 6h sans traitement. Réaction propre au chien (surtout lévriers).' },
    { nom: 'Houx (Ilex spp.)', img: 'houx.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Faible', effets: 'Saponines : vomissements, diarrhée, abattement, claquement des lèvres, hypersalivation; toxicité généralement légère.' },
    { nom: 'If (Taxus)', img: 'if.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Très élevée (mortelle)', effets: 'Taxines : vomissements, tremblements, dyspnée, convulsions, arythmies; mort subite par insuffisance cardiaque aiguë possible sans signes prodromiques. Tueur classique des chevaux et ruminants : une très faible quantité de feuilles (fraîches ou sèches) suffit.' },
    { nom: 'Jonquille / Narcisse (Narcissus spp.)', img: 'jonquille.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée à élevée', effets: 'Lycorine et alcaloïdes (bulbe surtout) : hypersalivation, vomissements, diarrhée; fortes ingestions : hypotension, tremblements, arythmies, convulsions.' },
    { nom: 'Kalanchoé', img: 'kalanchoe.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée à élevée', effets: 'Bufadiénolides (glycosides cardiotoniques) : vomissements, diarrhée, hypersalivation; à forte ingestion, troubles du rythme cardiaque, faiblesse, voire collapsus. Plante grasse ornementale très vendue.' },
    { nom: 'Langue de belle-mère (Sansevieria)', img: 'sansevieria.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Faible à modérée', effets: 'Saponines : nausées, vomissements, diarrhée, hypersalivation. Toxicité généralement légère.' },
    { nom: 'Laurier-rose (Nerium oleander)', img: 'laurier-rose.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cardiotoniques : hypersalivation, vomissements, diarrhée, ulcérations buccales, arythmies, hypotension, insuffisance cardiaque. Toxique aussi pour les chevaux et ruminants au pâturage; une faible quantité de feuilles peut être mortelle.' },
    { nom: 'Lis de la paix (Spathiphyllum)', img: 'lis-de-la-paix.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Malgré son nom, ce n\'est pas un vrai lis : aracée à oxalates de calcium insolubles. Irritation buccale, hypersalivation, oedème de la langue et des lèvres, vomissements, dysphagie. Ne cause PAS l\'insuffisance rénale des vrais Lilium chez le chat; à bien distinguer.' },
    { nom: 'Lys (toutes espèces de Lilium)', img: 'lys.jpg', categorie: 'jardin', especes: ['chat'], toxicite: 'Très élevée (mortelle)', effets: 'Abattement, hypersalivation, vomissements, perte d\'appétit (0-12h), puis polyurie/déshydratation (12-24h) et insuffisance rénale aiguë avec anurie possible (24-72h); ingestion minime suffisante. Néphrotoxicité propre au chat (le chien ne fait qu\'un trouble digestif léger).' },
    { nom: 'Monstera (faux philodendron, plante gruyère)', img: 'monstera.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles : irritation buccale, hypersalivation, oedème buccal, vomissements, difficulté à avaler. Même famille (aracées) que le Dieffenbachia et le philodendron.' },
    { nom: 'Muguet (Convallaria majalis)', img: 'muguet.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin', 'cheval'], toxicite: 'Très élevée (mortelle)', effets: 'Glycosides cardiotoniques (convallatoxine) : hypersalivation, vomissements, diarrhée, bradycardie, arythmies, hypotension, convulsions. Comme la digitale, toxique même via l\'eau du vase. Plante de plate-bande très commune.' },
    { nom: 'Palmier de Sago (Cycas revoluta)', img: 'palmier-sago.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Très élevée (mortelle)', effets: 'Cycasine : vomissements (parfois hémorragiques), selles noires, ictère, polydipsie, troubles de la coagulation, insuffisance hépatique aiguë; jusqu\'à 50% de mortalité, 1-2 graines peuvent être fatales.' },
    { nom: 'Philodendron', img: 'philodendron.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles (toutes les parties) : irritation buccale immédiate, hypersalivation, oedème de la langue et des lèvres, vomissements, dysphagie. De rares signes neurologiques sont rapportés chez le chat à forte ingestion.' },
    { nom: 'Plante de jade (Crassula)', img: 'plante-jade.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Faible à modérée', effets: 'Vomissements, diarrhée, dépression, incoordination (ataxie); rarement tremblements. Le chat semble plus sensible que le chien.' },
    { nom: 'Plante maïs (Dracaena)', img: 'dracaena.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Saponines : vomissements, dépression, perte d\'appétit, hypersalivation, incoordination; chez le chat, dilatation pupillaire et tachycardie possibles.' },
    { nom: 'Poinsettia (étoile de Noël)', img: 'poinsettia.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Faible', effets: 'Irritation buccale et gastrique, vomissements, hypersalivation, rarement diarrhée; irritation cutanée possible au contact de la sève. Signes généralement légers et spontanément résolutifs.' },
    { nom: 'Pothos / lierre du diable (Epipremnum)', img: 'pothos.jpg', categorie: 'interieur', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles : irritation buccale immédiate, hypersalivation, oedème de la langue et des lèvres, vomissements, difficulté à avaler. Une des plantes d\'intérieur les plus répandues; signes habituellement locaux et spontanément résolutifs.' },
    { nom: 'Rhubarbe (feuilles)', img: 'rhubarbe.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'cheval', 'vache', 'mouton', 'chevre'], toxicite: 'Modérée', effets: 'Oxalates SOLUBLES dans les feuilles (les tiges sont comestibles) : hypersalivation, vomissements; à forte dose, hypocalcémie et atteinte rénale par cristaux d\'oxalate de calcium. À distinguer des oxalates insolubles des aracées, qui n\'atteignent pas le rein.' },
    { nom: 'Tulipe (Tulipa spp.)', img: 'tulipe.jpg', categorie: 'jardin', especes: ['chien', 'chat', 'oiseau', 'lapin'], toxicite: 'Modérée', effets: 'Tulipaline (bulbe surtout) : hypersalivation, vomissements, diarrhée, dépression; fortes ingestions : tachycardie, dyspnée, tremblements, convulsions.' },
  ],
  aliments: [
    { nom: 'Alcool', especes: ['chien', 'chat', 'furet', 'oiseau'], toxicite: 'Élevée', effets: 'Vomissements, diarrhée, incoordination, dépression, difficulté respiratoire, tremblements, changements du pH sanguin, coma et même la mort. Le furet et les oiseaux y sont très sensibles vu leur petite taille; quelques gorgées suffisent.' },
    { nom: 'Avocat', especes: ['chien', 'chat', 'furet', 'oiseau', 'lapin', 'rongeur'], toxicite: 'Variable selon l\'espèce (très élevée chez oiseaux, lapin, furet)', effets: 'Persine, présente dans tout le fruit, le noyau, l\'écorce et les feuilles. Chez le chien et le chat : risque faible, surtout trouble digestif léger, plus le noyau (obstruction) et le gras (pancréatite). Chez les oiseaux, le lapin, le furet et les petits rongeurs : toxicité élevée à mortelle, nécrose du myocarde, oedème, détresse respiratoire, mort subite parfois en 24 à 48h pour de petites quantités. Chevaux et ruminants aussi touchés (mammite, atteinte cardiaque). Ne jamais en donner aux oiseaux ni aux petits mammifères.' },
    { nom: 'Chocolat', especes: ['chien', 'chat', 'furet', 'oiseau', 'lapin', 'rongeur'], toxicite: 'Élevée', effets: 'Méthylxanthines (théobromine, caféine des fèves de cacao) : vomissements, diarrhée, halètement, soif et miction excessives, hyperactivité, rythme cardiaque anormal, tremblements, convulsions et même la mort. Toxique pour la plupart des espèces (furet, lapin, oiseaux, rongeurs); le chocolat noir et la poudre de cacao sont les plus concentrés.' },
    { nom: 'Agrumes', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Les tiges, feuilles, écorces, fruits et graines contiennent de l\'acide citrique et des huiles essentielles pouvant irriter. De petites doses (ex. manger le fruit) ne causent généralement qu\'un léger trouble digestif.' },
    { nom: 'Noix de coco et huile de coco', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'En petite quantité, peu susceptible de causer un tort sérieux. La chair et le lait de coco frais contiennent des huiles pouvant causer trouble digestif, selles molles et diarrhée.' },
    { nom: 'Raisins et raisins secs', especes: ['chien', 'chat', 'furet'], toxicite: 'Élevée', effets: 'L\'acide tartrique est aujourd\'hui identifié comme le principe toxique probable. La sensibilité varie beaucoup d\'un chien à l\'autre, mais ces fruits peuvent causer une insuffisance rénale chez certains animaux. Des atteintes rénales sont aussi rapportées chez le furet; à éviter.' },
    { nom: 'Noix de macadamia', especes: ['chien'], toxicite: 'Modérée', effets: 'Faiblesse, dépression, vomissements, tremblements et hyperthermie chez le chien. Signes généralement dans les 12h suivant l\'ingestion, durant environ 12 à 48h. Toxicité documentée uniquement chez le chien (mécanisme inconnu).' },
    { nom: 'Lait et produits laitiers', especes: ['chien', 'chat', 'furet'], toxicite: 'Faible', effets: 'Les animaux ne possèdent pas suffisamment de lactase (enzyme qui dégrade le lactose) : diarrhée ou autres troubles digestifs. Le furet, carnivore strict, ne tolère pas non plus les produits laitiers.' },
    { nom: 'Noix (amandes, pacanes, noix de Grenoble, etc.)', especes: ['chien', 'chat', 'furet'], toxicite: 'Faible à modérée', effets: 'Riches en huiles et matières grasses : vomissements, diarrhée et potentiellement une pancréatite. À éviter chez le furet (carnivore strict, risque digestif et d\'obstruction).' },
    { nom: 'Oignon, ail et ciboulette', especes: ['chien', 'chat', 'furet', 'oiseau', 'rongeur'], toxicite: 'Modérée à élevée', effets: 'Irritation gastro-intestinale et dommages oxydatifs aux globules rouges (corps de Heinz) pouvant mener à une anémie. Le chat est plus sensible, mais le chien est aussi à risque selon la quantité. Le furet y est très sensible (faible réserve de globules rouges); des cas d\'anémie hémolytique sont documentés chez les oiseaux, et le mécanisme s\'applique aux rongeurs.' },
    { nom: 'Viande, œufs et os crus ou insuffisamment cuits', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'La viande et les œufs crus peuvent contenir des bactéries (Salmonella, E. coli) dangereuses pour l\'animal comme pour l\'humain. Les œufs crus contiennent aussi une protéine (avidine) nuisant à l\'absorption de la biotine (problèmes de peau/pelage). Les os crus présentent un risque de blessure ou d\'obstruction du tube digestif.' },
    { nom: 'Sel', especes: ['chien', 'chat', 'oiseau', 'furet'], toxicite: 'Modérée à élevée', effets: 'De grandes quantités peuvent causer une soif et miction excessives, voire une intoxication aux ions sodium : vomissements, diarrhée, dépression, tremblements, hyperthermie, convulsions et même la mort. Les oiseaux sont particulièrement sensibles au sel vu leur petite taille.' },
    { nom: 'Xylitol', especes: ['chien'], toxicite: 'Très élevée', effets: 'Édulcorant présent dans la gomme, les bonbons, les produits de boulangerie et le dentifrice. Libération massive d\'insuline provoquant une hypoglycémie sévère (faiblesse, ataxie, convulsions); à plus forte dose, atteinte hépatique aiguë possible. Sensibilité moindre chez le lapin; données limitées chez le chat.' },
    { nom: 'Pâte à pain crue (levure)', especes: ['chien', 'chat', 'furet'], toxicite: 'Élevée', effets: 'La levure peut fermenter et produire des gaz dans le système digestif, causant un ballonnement douloureux de l\'estomac pouvant évoluer en torsion, une urgence vitale. La fermentation produit aussi de l\'éthanol, donc une intoxication alcoolique en parallèle est possible (hypoglycémie, dépression du SNC, acidose métabolique).' },
  ],
medicaments: [
    { nom: 'Acétaminophène (paracétamol / Tylenol)', especes: ['chien', 'chat', 'furet'], toxicite: 'Très élevée (mortelle chez le chat)', effets: 'Métabolite toxique (NAPQI) qui épuise le glutathion. Chez le chat et le furet, dose toxique très basse (dès 10 mg/kg) : méthémoglobinémie (sang brun, muqueuses cyanosées), corps de Heinz et anémie hémolytique, oedème de la face et des pattes, dyspnée. Chez le chien, surtout hépatotoxicité (nécrose centrolobulaire, ictère); néphrotoxicité possible à forte dose. Antidote : N-acétylcystéine (NAC); bleu de méthylène et vitamine C contre la méthémoglobinémie.' },
    { nom: 'AINS (ibuprofène, naproxène, aspirine)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Inhibition des prostaglandines (COX) : vomissements (parfois sanglants), ulcères gastriques et hémorragie digestive, douleur abdominale, puis insuffisance rénale aiguë. À forte dose, signes neurologiques (ataxie, convulsions, coma) et acidose. Le chat y est plus sensible que le chien (glucuronidation limitée). Le naproxène a une longue demi-vie, donc une toxicité prolongée et un risque accru. Pas d\'antidote spécifique : décontamination, protecteurs gastriques, fluidothérapie.' },
    { nom: 'Antibiotiques chez les herbivores et petits rongeurs (risque iatrogène)', especes: ['lapin', 'cobaye', 'chinchilla', 'rongeur'], toxicite: 'Très élevée (mortelle)', effets: 'Risque iatrogène, pas une ingestion accidentelle. Le lapin, le cobaye, le chinchilla et le hamster ont une flore intestinale à dominante Gram positif, essentielle à leur digestion. Les antibiotiques qui ciblent le Gram positif (pénicillines comme l\'amoxicilline et l\'ampicilline, céphalosporines, lincosamides comme la clindamycine et la lincomycine, macrolides comme l\'érythromycine) détruisent cette flore et laissent proliférer Clostridium difficile : entérotoxémie souvent mortelle, parfois même à dose thérapeutique. Signes 6 à 48h après le début du traitement : anorexie, diarrhée, déshydratation, hypothermie, abattement. Risque plus élevé par voie orale. La streptomycine et la dihydrostreptomycine sont en plus directement toxiques chez la gerbille, le cobaye, le hamster et la souris. Privilégier un spectre Gram négatif (ex. fluoroquinolones) et la voie parentérale.' },
    { nom: 'Antidépresseurs (ISRS, IRSN, tricycliques)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'ISRS (fluoxétine, sertraline), IRSN et tricycliques (amitriptyline, clomipramine). Le chat est plus sensible que le chien. Petits surdosages : sédation ou agitation, hypersalivation, vomissements, mydriase, tremblements, hyperthermie. Forts surdosages : ataxie, dysphorie, nystagmus, convulsions, et syndrome sérotoninergique (rigidité, hyperthermie, tachycardie). Antidote du syndrome sérotoninergique : cyproheptadine.' },
    { nom: 'Baclofène (myorelaxant)', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'Myorelaxant humain à marge de sécurité très étroite. Vocalises, désorientation, hypersalivation, vomissements, faiblesse, puis dépression marquée du SNC, dépression respiratoire, bradycardie, convulsions, coma. Soins intensifs prolongés souvent nécessaires.' },
    { nom: 'Benzodiazépines et somnifères (zolpidem, etc.)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Diazépam, alprazolam, zolpidem (Ambien) et apparentés. Le plus souvent : dépression du SNC, sédation, ataxie, faiblesse, hypotension; parfois excitation paradoxale (agitation, vocalises), surtout avec le zolpidem. Dépression respiratoire possible à forte dose. Le flumazénil peut servir d\'antidote dans certains cas.' },
    { nom: 'Décongestionnants (pseudoéphédrine, éphédrine)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Sympathomimétiques présents dans les médicaments contre le rhume et certains suppléments. Tableau stimulant proche des amphétamines : agitation, halètement, mydriase, tremblements, tachycardie, hypertension, hyperthermie, convulsions. Marge de sécurité étroite chez le chien et le chat.' },
    { nom: '5-Fluorouracile (crème anticancéreuse)', especes: ['chien', 'chat'], toxicite: 'Très élevée (souvent mortelle chez le chien)', effets: 'Crème ou lotion dermatologique (kératoses, cancers cutanés). Même une faible exposition est dramatique chez le chien : vomissements et diarrhée sévères, convulsions réfractaires en moins d\'une heure, puis aplasie médullaire. Pronostic réservé à sombre; urgence absolue.' },
    { nom: 'Médicaments cardiaques (bêta-bloquants, bloqueurs calciques)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Bêta-bloquants (aténolol, propranolol) et bloqueurs des canaux calciques (amlodipine, diltiazem). Bradycardie, hypotension parfois sévère et réfractaire, faiblesse, effondrement, troubles du rythme. Les formes à libération prolongée retardent et allongent les signes. Prise en charge en soins intensifs (fluides, calcium, vasopresseurs, parfois émulsion lipidique IV).' },
    { nom: 'Stimulants (amphétamines, médicaments pour le TDAH)', especes: ['chien', 'chat'], toxicite: 'Élevée à très élevée', effets: 'Amphétamines et dérivés (Adderall, Vyvanse, Ritalin / méthylphénidate), sympathomimétiques. Début souvent rapide (30 min à 2h; plus tardif pour les formes à libération prolongée) : agitation, hyperactivité, halètement, mydriase, tremblements, convulsions, tachycardie, hypertension, hyperthermie. Risque de syndrome sérotoninergique. Soins : sédation (acépromazine ou chlorpromazine), refroidissement, cyproheptadine, contrôle des convulsions.' },
    { nom: 'Vitamine D et analogues (cholécalciférol, calcipotriène)', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'Suppléments de vitamine D, multivitamines, rodenticides au cholécalciférol et crèmes pour le psoriasis (calcipotriène). Provoque une hypercalcémie et une hyperphosphatémie : vomissements, diarrhée, abattement, faiblesse, polyuro-polydipsie, puis minéralisation des tissus mous et insuffisance rénale aiguë. Signes parfois retardés de 12 à 72h. Lapins, oiseaux et chevaux y sont aussi sensibles. Marge étroite; surveillance du calcium et du phosphore sur plusieurs jours.' },
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
    { nom: 'Plomb (plombs de pêche, balles, batteries, vieilles peintures, poussières de rénovation, tuyaux anciens)', especes: ['chien', 'chat', 'furet', 'oiseau', 'cheval', 'vache'], toxicite: 'Élevée à très élevée', effets: 'Sources variées : plombs de pêche et de chasse, batteries, jouets, vieilles peintures, poussières de rénovation, soudures, tuyaux anciens. Atteinte digestive (vomissements, douleur abdominale, constipation ou diarrhée), neurologique (ataxie, hyperexcitabilité, convulsions, cécité corticale) et hématologique. À la formule : ponctuations basophiles et nombreux globules rouges nucléés sans anémie sévère, très évocateurs. Les oiseaux y sont particulièrement sensibles (sauvagine avalant des plombs, perroquets qui rongent), de même que les bovins (batteries, peinture, vieux équipements). Antidotes : chélation (CaEDTA, succimer/DMSA, parfois D-pénicillamine).' },
    { nom: 'Zinc (pièces de 1 cent, boulons galvanisés, écrous de cages, crèmes à l\'oxyde de zinc, fermetures éclair)', especes: ['chien', 'chat', 'furet', 'oiseau'], toxicite: 'Élevée', effets: 'Le chien est le plus touché (ingestion de pièces de monnaie surtout; au Canada, les 1 cent de la fin des années 1990 et du début des années 2000, ont une très forte teneur en zinc. Phase digestive d\'abord (anorexie, vomissements, diarrhée), puis quelques heures à quelques jours plus tard hémolyse intravasculaire : anémie, ictère, hémoglobinurie, parfois insuffisance rénale, pancréatite et CIVD. Peut être confondu avec une anémie hémolytique à médiation immune, d\'où l\'importance de la radiographie (objet métallique). Le furet fait les mêmes signes plus des saignements digestifs; chez l\'oiseau : respiration superficielle, plumes ébouriffées, yeux fermés. Bovins, chevaux et porcs aussi exposés. Traitement : retrait de l\'objet et soins de soutien; la chélation est controversée.' },
    { nom: 'Mercure (poissons contaminés, thermomètres brisés, désinfectants anciens)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Distinction importante : le mercure organique (méthylmercure, accumulé dans les gros poissons) est très neurotoxique et bien absorbé, alors que le mercure élémentaire d\'un thermomètre brisé est mal absorbé par voie orale et présente un risque bien moindre. Le chat est l\'espèce classique (« maladie du chat fou »). Signes neurologiques surtout : ataxie, tremblements, incoordination, cécité, parfois convulsions; troubles digestifs et atteinte rénale possibles. Exposition chronique surtout.' },
    { nom: 'Arsenic (rodenticides anciens, herbicides, bois traité, produits agricoles obsolètes)', especes: ['chien', 'chat', 'cheval', 'vache'], toxicite: 'Très élevée', effets: 'Vieux rodenticides, herbicides, cendres de bois traité (arséniate de cuivre chromaté), produits agricoles périmés. Gastro-entérite hémorragique violente : vomissements sanglants, diarrhée profuse parfois sanglante, douleur abdominale, déshydratation rapide, puis collapsus cardiovasculaire, atteinte hépatique et rénale, coma. Évolution souvent rapide. Antidote : chélation (dimercaprol/BAL, succimer). Le bétail au pâturage est aussi exposé.' },
    { nom: 'Insecticides organophosphorés et carbamates (malathion, diazinon, chlorpyrifos, carbaryl)', especes: ['chien', 'chat', 'oiseau', 'cheval', 'vache'], toxicite: 'Très élevée', effets: 'Inhibition de l\'acétylcholinestérase, donc crise cholinergique : hypersalivation, larmoiement, mictions et défécations (syndrome SLUD), myosis, bradycardie, fasciculations musculaires, bronchospasme et hypersécrétion bronchique, dyspnée, convulsions. La mort survient surtout par défaillance respiratoire. Antidotes : atropine (signes muscariniques) et pralidoxime (2-PAM, surtout pour les organophosphorés, à donner tôt). Le chat et les oiseaux y sont sensibles; intoxications fréquentes en milieu agricole.' },
    { nom: 'Pyréthrinoïdes (perméthrine) : antipuces pour chien appliqués au chat', especes: ['chien', 'chat'], toxicite: 'Élevée à très élevée (chez le chat)', effets: 'Cause classique et évitable : un antipuce concentré pour chien (perméthrine) appliqué sur un chat, ou un chat en contact étroit avec un chien fraîchement traité. Le chien tolère bien la perméthrine, mais le chat y est très sensible. Action sur les canaux sodiques : tremblements, fasciculations, hyperesthésie, hypersalivation, mydriase, hyperthermie, ataxie, cécité temporaire, convulsions; durée des tremblements souvent longue (24 à 79h). Pas d\'antidote : décontamination (bain à l\'eau tiède et savon à vaisselle), méthocarbamol pour les tremblements, anticonvulsivants au besoin. Point clé : l\'atropine n\'est PAS l\'antidote et est contre-indiquée (ce n\'est pas une crise cholinergique), à la différence des organophosphorés.' },
    { nom: 'Rodenticides anticoagulants (warfarine, bromadiolone, brodifacoum, diphacinone)', especes: ['chien', 'chat', 'furet', 'oiseau'], toxicite: 'Très élevée', effets: 'Les plus courants. Inhibition de la vitamine K époxyde réductase, donc baisse des facteurs de coagulation II, VII, IX et X. Signes retardés : saignements typiquement 3 à 7 jours après l\'ingestion (le temps d\'épuiser les facteurs en circulation). Abattement, faiblesse, muqueuses pâles, épistaxis, toux, hémoptysie, dyspnée (hémothorax), hématomes, saignements de tout site. Antidote : vitamine K1 (phytoménadione), pendant 2 à 4 semaines (plus longtemps pour les molécules de 2e génération), avec transfusion de plasma ou de sang si saignement grave. La vitamine K1 orale s\'absorbe mieux avec un repas gras. Risque aussi par empoisonnement relais (chat ou rapace mangeant un rongeur intoxiqué).' },
    { nom: 'Brométhaline (rodenticide neurotoxique)', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'De plus en plus utilisée depuis le resserrement de la réglementation des anticoagulants. Découple la phosphorylation oxydative dans le SNC, provoquant un oedème cérébral. Délai de quelques heures à quelques jours. Faible dose : abattement, parésie ou paralysie des postérieurs, ataxie. Forte dose : tremblements, hyperexcitabilité, hyperesthésie, vomissements, convulsions. Aucun antidote; soins de soutien et contrôle de l\'oedème cérébral. Empoisonnement relais possible chez le chat bon chasseur.' },
    { nom: 'Métaldéhyde (appâts à limaces et escargots)', especes: ['chien', 'chat'], toxicite: 'Très élevée', effets: 'Granulés de jardin contre limaces et escargots, parfois attirants (souvent à base de son). Début rapide : tremblements intenses et continus, hyperthermie marquée, tachycardie, hypersalivation, ataxie, convulsions (surnommé « shake and bake »). Aucun antidote spécifique : décontamination, myorelaxants (méthocarbamol), contrôle des convulsions et de l\'hyperthermie, soins intensifs.' },
  ],
}

// ─── ANTIDOTES PAR INTOXICATION ──────────────────────────

const INTOXICATIONS_ANTIDOTES = [
  {
    intoxication: 'Acétaminophène (paracétamol)',
    icone: 'ti-pill',
    antidotes: [
      { generique: 'N-Acétylcystéine (NAC)', notes: 'Antidote principal - donneur de glutathion, neutralise le métabolite toxique NAPQI. Plus efficace dans les 4–8 premières heures, mais un bénéfice reste possible plus tardivement. Administrée IV ou PO.' },
      { generique: 'Bleu de méthylène', notes: 'Contre la méthémoglobinémie (sang brun, muqueuses cyanosées). Surtout utile chez le chat. Prudence : à forte dose, il peut lui-même provoquer une hémolyse chez le chat - utiliser à faible dose (1–1,5 mg/kg IV).' },
      { generique: 'Vitamine C (acide ascorbique)', notes: 'Adjuvant réducteur contre la méthémoglobinémie, souvent associé au bleu de méthylène.' },
    ],
  },
  {
    intoxication: 'Antigel (éthylène glycol)',
    icone: 'ti-droplet',
    antidotes: [
      { generique: 'Fomépizole (4-MP)', notes: 'Antidote de choix - inhibiteur de l\'alcool déshydrogénase. Efficace chez le chien et le chat (dose plus élevée chez le chat : 125 mg/kg charge puis 31,25 mg/kg). À donner le plus tôt possible, avant l\'insuffisance rénale. Bien supérieur à l\'éthanol.' },
      { generique: 'Éthanol', notes: 'Alternative si le fomépizole est indisponible - compétition sur l\'alcool déshydrogénase. Moins préféré : provoque dépression du SNC, acidose et hyperosmolalité.' },
    ],
  },
  {
    intoxication: 'Organophosphorés / Carbamates',
    icone: 'ti-bug',
    antidotes: [
      { generique: 'Atropine', notes: 'Contre les signes muscariniques (hypersalivation, mictions, défécations, bradycardie, bronchospasme -- syndrome SLUD). À titrer jusqu\'à l\'assèchement des sécrétions bronchiques, pas jusqu\'à la mydriase. Doses élevées souvent nécessaires.' },
      { generique: 'Pralidoxime (2-PAM)', notes: 'Réactivateur de la cholinestérase, surtout pour les organophosphorés. Efficacité douteuse et bénéfice limité contre les carbamates (la liaison à l\'enzyme se défait spontanément, sans « vieillissement »), mais pas contre-indiqué. D\'autant plus efficace qu\'il est donné tôt, idéalement dans les 24 h. S\'associe à l\'atropine, ne la remplace pas.' },
    ],
  },
  {
    intoxication: 'Rodenticides anticoagulants',
    icone: 'ti-mouse',
    antidotes: [
      { generique: 'Vitamine K1 (phytoménadione)', notes: 'Antidote spécifique. La durée dépend de la molécule plutôt que de la génération : environ 2 semaines pour la warfarine, 4 semaines pour toutes les autres, y compris les longues durées d\'action (bromadiolone, brodifacoum, et le diphacinone, qui est en fait un produit de 1re génération à action prolongée). Mieux absorbée PO avec un repas gras. Contrôler le PT 48 à 72 h après l\'arrêt : s\'il reste allongé, prolonger de 2 semaines. Transfusion de plasma ou de sang complet si saignement actif ou anémie sévère.' },
    ],
  },
  {
    intoxication: 'Plomb',
    icone: 'ti-fish',
    antidotes: [
      { generique: 'Succimer (DMSA)', notes: 'Chélateur oral préféré en première intention chez l\'animal ambulatoire - bien toléré. Ne chélate pas le zinc, le cuivre ni le fer.' },
      { generique: 'CaEDTA (EDTA de calcium)', notes: 'Chélateur IV/SC du plomb, souvent utilisé en milieu hospitalier. Parfois associé au succimer ou au dimercaprol pour les cas graves.' },
      { generique: 'Dimercaprol (BAL)', notes: 'Réservé aux formes graves - administré IM, toxicité propre notable. Chélateur de référence historique pour le plomb, arsenic et mercure.' },
    ],
  },
  {
    intoxication: 'Arsenic',
    icone: 'ti-flask',
    antidotes: [
      { generique: 'Dimercaprol (BAL)', notes: 'Chélateur de référence pour l\'arsenic aigu - administré IM. Toxicité propre notable.' },
      { generique: 'Succimer (DMSA)', notes: 'Alternative orale, mieux tolérée, de plus en plus préférée pour les formes moins sévères.' },
    ],
  },
  {
    intoxication: 'Mercure',
    icone: 'ti-thermometer',
    antidotes: [
      { generique: 'Dimercaprol (BAL)', notes: 'Pour le mercure inorganique et les expositions aiguës - administré IM.' },
      { generique: 'Succimer (DMSA)', notes: 'Chélateur de choix pour le mercure organique (le dimercaprol est à éviter dans cette forme, car il peut redistribuer le mercure vers le cerveau). Voie orale, mieux toléré que le BAL.' },
    ],
  },
  {
    intoxication: 'Syndrome sérotoninergique',
    icone: 'ti-brain',
    antidotes: [
      { generique: 'Cyproheptadine', notes: 'Antagoniste des récepteurs 5-HT2A. Indiqué lors de surdosage d\'ISRS, IRSN, antidépresseurs tricycliques, amphétamines ou 5-HTP. Administrée par voie orale ou en lavement rectal; à répéter selon les signes. Traitement adjuvant : sédation, refroidissement, fluidothérapie.' },
    ],
  },
  {
    intoxication: 'Benzodiazépines / Zolpidem',
    icone: 'ti-zzz',
    antidotes: [
      { generique: 'Flumazénil', notes: 'Antagoniste des récepteurs aux benzodiazépines - réverse la sédation. Effet court (30–60 min), à répéter si la dépression du SNC revient. À éviter si ingestion mixte avec un proconvulsivant (ex. tricycliques), car il peut abaisser le seuil convulsif.' },
    ],
  },
  {
    intoxication: 'Vitamine D (cholécalciférol)',
    icone: 'ti-sun',
    antidotes: [
      { generique: 'Pamidronate', notes: 'Bisphosphonate contre l\'hypercalcémie - inhibe la résorption osseuse par les ostéoclastes. S\'associe aux fluides salins IV, diurèse forcée, et parfois calcitonine ou corticostéroïdes. Surveiller la calcémie et la phosphatémie sur plusieurs jours.' },
    ],
  },
  {
    intoxication: 'Champignons à amatoxines (Amanita)',
    icone: 'ti-mushroom',
    antidotes: [
      { generique: 'Silibinine / Silymarine', notes: 'Bloque la captation hépatique des amatoxines par les hépatocytes. Antidote le plus reconnu pour ce type d\'empoisonnement - à débuter le plus tôt possible. Traitement de soutien hépatique intensif en parallèle.' },
    ],
  },
  {
    intoxication: 'Pyréthrinoïdes / Perméthrine',
    icone: 'ti-paw',
    antidotes: [
      { generique: 'Méthocarbamol', notes: 'Myorelaxant central pour contrôler les tremblements et fasciculations - traitement symptomatique principal chez le chat intoxiqué. Anticonvulsivants (diazépam, phénobarbital) si convulsions. Décontamination (bain eau tiède + savon vaisselle) en priorité.' },
      { generique: 'Émulsion lipidique IV (Intralipid)', notes: 'Adjuvant en cas de signes sévères réfractaires - séquestre les molécules lipophiles dans un compartiment lipidique sanguin. Pas un antidote spécifique. NOTE : l\'atropine est CONTRE-INDIQUÉE (ce n\'est pas une crise cholinergique).' },
    ],
  },
  {
    intoxication: 'Baclofène / Bloqueurs calciques / Bêta-bloquants',
    icone: 'ti-heart-rate-monitor',
    antidotes: [
      { generique: 'Émulsion lipidique IV (Intralipid)', notes: 'Piège lipidique pour les molécules lipophiles (baclofène, diltiazem, vérapamil, propranolol). Adjuvant aux soins intensifs (fluides, vasopresseurs, gluconate de calcium pour les bloqueurs calciques).' },
    ],
  },
  {
    intoxication: 'Méthémoglobinémie (agents oxydants)',
    icone: 'ti-droplet-half-2',
    antidotes: [
      { generique: 'Bleu de méthylène', notes: 'Antidote de la méthémoglobinémie - réduit la méthémoglobine en hémoglobine fonctionnelle. Prudence chez le chat : peut lui-même causer hémolyse et corps de Heinz à forte dose. Utiliser à 1–1,5 mg/kg IV lent.' },
      { generique: 'Vitamine C (acide ascorbique)', notes: 'Réducteur adjuvant, moins puissant que le bleu de méthylène mais sans risque hémolytique.' },
    ],
  },
  {
    intoxication: 'Palmier de Sago / Xylitol (hépatotoxicité)',
    icone: 'ti-plant-2',
    antidotes: [
      { generique: 'N-Acétylcystéine (NAC)', notes: 'Hépatoprotecteur adjuvant - restaure le glutathion intrahépatique. Pas un antidote spécifique, mais réduit les dommages oxydatifs hépatiques.' },
      { generique: 'Silibinine / Silymarine', notes: 'Hépatoprotecteur adjuvant - soutient la fonction hépatique. Rôle plus marginal ici que pour les amatoxines.' },
    ],
  },
]

const TESTS_DIAG = [
  { test: 'Bilan biochimique complet', utilite: 'Évalue la fonction hépatique, rénale, les électrolytes, le glucose, le calcium et le phosphore.', toxiques: 'Antigel, xylitol, AINS, lys, paracétamol, raisins, vitamine D (calcium et phosphore élevés).' },
  { test: 'Numération formule sanguine (NFS) et frottis sanguin', utilite: 'Recherche d\'anémie et de troubles hématologiques. Le frottis révèle des indices clés : corps de Heinz, ponctuations basophiles, globules rouges nucléés.', toxiques: 'Plomb (ponctuations basophiles, GR nucléés), oignon et ail (corps de Heinz), zinc (anémie hémolytique), paracétamol (corps de Heinz), arsenic, anticoagulants (anémie par saignement).' },
  { test: 'Analyse d\'urine (BU + sédiment)', utilite: 'Recherche de cristaux, pigmenturie (hémoglobine/myoglobine), densité urinaire, anomalies rénales.', toxiques: 'Antigel (cristaux d\'oxalate de calcium), lys, AINS, plomb, zinc (hémoglobinurie).' },
  { test: 'Gaz sanguins et lactates', utilite: 'Évalue l\'équilibre acido-basique, la perfusion tissulaire, l\'oxygénation.', toxiques: 'Antigel (acidose métabolique à trou anionique élevé), salicylés, paracétamol, arsenic.' },
  { test: 'Glycémie rapide (glucomètre)', utilite: 'Dépistage immédiat d\'une hypoglycémie au chevet du patient.', toxiques: 'Xylitol (hypoglycémie), pâte à pain crue et alcool (éthanol).' },
  { test: 'Co-oxymétrie (fraction de méthémoglobine)', utilite: 'Mesure la méthémoglobine quand le sang paraît brun et les muqueuses cyanosées.', toxiques: 'Paracétamol (surtout chez le chat), agents oxydants.' },
  { test: 'Activité cholinestérase (sang)', utilite: 'Diminuée lors d\'intoxication aux organophosphorés ou carbamates; reste normale avec les pyréthrinoïdes, ce qui aide à les distinguer.', toxiques: 'Organophosphorés, carbamates.' },
  { test: 'Temps de coagulation (PT/PTT)', utilite: 'Vérifie la cascade de coagulation. Le PT s\'allonge en premier avec les anticoagulants (facteur VII, demi-vie courte).', toxiques: 'Rodenticides anticoagulants (warfarine, bromadiolone, brodifacoum), champignons à amatoxines.' },
  { test: 'Bilan hépatique spécifique (ALT, AST, ALP, bilirubine)', utilite: 'Détection précoce d\'atteinte hépatique.', toxiques: 'Paracétamol, xylitol, palmier de Sago, champignons à amatoxines, arsenic.' },
  { test: 'Ammoniémie (rarement pratiquée)', utilite: 'Confirme une atteinte hépatique avancée (insuffisance hépatique).', toxiques: 'Champignons à amatoxines, palmier de Sago, xylitol.' },
  { test: 'Radiographie abdominale', utilite: 'Visualisation de corps étrangers métalliques radio-opaques. Attention : la plupart des comprimés ne sont PAS radio-opaques (exceptions : fer, certains comprimés enrobés).', toxiques: 'Plomb, zinc (pièces de monnaie), piles, objets métalliques.' },
  { test: 'Échographie abdominale', utilite: 'Évaluation hépatique, rénale, pancréatique (ex. reins augmentés de volume avec l\'antigel).', toxiques: 'Palmier de Sago, xylitol, champignons, lys, antigel.' },
  { test: 'Électrocardiogramme (ECG)', utilite: 'Détection d\'arythmies et de troubles de conduction.', toxiques: 'Chocolat, glycosides cardiotoniques (laurier-rose, digitale, muguet), organophosphorés, bêta-bloquants et bloqueurs calciques, stimulants.' },
  { test: 'Dosage de toxiques spécifiques', utilite: 'Quantifie l\'exposition à certaines molécules (souvent en laboratoire externe, rarement sur place).', toxiques: 'Paracétamol (taux sérique), éthylène glycol, plombémie, zincémie, activité cholinestérase.' },
  { test: 'Tests de drogue urinaires (bandelettes humaines)', utilite: 'Dépistage rapide, mais conçus pour l\'humain et peu fiables chez l\'animal. Un résultat positif oriente; un négatif n\'exclut rien.', toxiques: 'Amphétamines, benzodiazépines, opiacés (assez détectables); THC très peu fiable.' },
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

// ─── FILTRES DE CATÉGORIE (onglet plantes) ───────────────
const FILTRES_PLANTES = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'interieur', label: 'Intérieur' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'sauvage', label: 'Sauvage' },
]

export default function Toxicologie() {
  const [onglet, setOnglet] = useState('plantes')
  const [selectionne, setSelectionne] = useState(null)
  const [filtrePlante, setFiltrePlante] = useState('toutes')
  const [intoxicationSelectionnee, setIntoxicationSelectionnee] = useState(null)

  const toxiquesActifs = TOXIQUES[onglet] || []

  const plantesFiltrees = filtrePlante === 'toutes'
    ? toxiquesActifs
    : toxiquesActifs.filter(t => t.categorie === filtrePlante)

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

            {/* Filtres par catégorie */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              {FILTRES_PLANTES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFiltrePlante(f.id)}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                    background: filtrePlante === f.id ? 'var(--primary)' : 'var(--bg-card)',
                    color: filtrePlante === f.id ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {plantesFiltrees.map(t => (
              <button key={t.nom} className="toxico-plante-card" onClick={() => setSelectionne(t)}>
                <PhotoPlante img={t.img} nom={t.nom} />
                <div className="toxico-plante-contenu">
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{t.nom}</span>
                  <span style={{ fontSize: 12, color: couleurToxicite(t.toxicite), fontWeight: 600, marginTop: 4, display: 'block' }}>{t.toxicite}</span>
                  <div style={{ marginTop: 6 }}><IconesEspeces especes={t.especes} /></div>
                </div>
              </button>
            ))}

            {plantesFiltrees.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-hint)', textAlign: 'center', padding: '16px 0' }}>Aucune plante dans cette catégorie.</p>
            )}
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
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{t.nom}</span>
                <span style={{ fontSize: 12, color: couleurToxicite(t.toxicite), fontWeight: 600, marginTop: 4, display: 'block' }}>{t.toxicite}</span>
                <div style={{ marginTop: 6 }}><IconesEspeces especes={t.especes} /></div>
              </button>
            ))}
          </div>
        )}

        {/* ─── ANTIDOTES PAR INTOXICATION ─────── */}
        {onglet === 'antidotes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', margin: 0 }}>
              Sélectionnez un type d'intoxication pour afficher le ou les antidotes correspondants.
            </p>

            {/* Grille de chips d'intoxication */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTOXICATIONS_ANTIDOTES.map((item, i) => {
                const estSelectionnee = intoxicationSelectionnee === i
                return (
                  <button
                    key={i}
                    onClick={() => setIntoxicationSelectionnee(estSelectionnee ? null : i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      borderRadius: 999,
                      border: estSelectionnee ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: estSelectionnee ? 'var(--primary)' : 'var(--bg-card)',
                      color: estSelectionnee ? '#fff' : 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <i className={`ti ${item.icone}`} style={{ fontSize: 15 }}></i>
                    {item.intoxication}
                  </button>
                )
              })}
            </div>

            {/* Antidotes de l'intoxication sélectionnée */}
            {intoxicationSelectionnee !== null && (() => {
              const item = INTOXICATIONS_ANTIDOTES[intoxicationSelectionnee]
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                    <i className={`ti ${item.icone}`} style={{ marginRight: 6 }}></i>
                    {item.intoxication}
                  </p>
                  {item.antidotes.map((a, j) => (
                    <div
                      key={j}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderLeft: '4px solid var(--primary)',
                        borderRadius: 10,
                        padding: '12px 14px',
                      }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                        {a.generique}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {a.notes}
                      </p>
                    </div>
                  ))}
                </div>
              )
            })()}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <IconesEspeces especes={selectionne.especes} wrap />
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
