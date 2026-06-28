import { useState } from 'react'

// ─── DONNÉES ─────────────────────────────────────────────

const TOXIQUES = {
  plantes: [
    { nom: 'Aloe vera', img: 'aloe-vera.jpg', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Saponines, anthraquinones (latex/sève) : vomissements, léthargie, diarrhée; urine rougeâtre possible. Le gel intérieur est comestible.' },
    { nom: 'Amanita spp. (champignons)', img: 'amanita.jpg', especes: ['chien', 'chat'], toxicite: 'Élevée à très élevée', effets: 'Vomissements, diarrhée hémorragique, douleurs abdominales, puis phase de rémission trompeuse (quelques heures à 2-3 jours) suivie d\'une insuffisance hépatique aiguë (ictère, hypoglycémie, coagulopathie, coma); pronostic très sombre.' },
    { nom: 'Canne des muets (Dieffenbachia)', img: 'dieffenbachia.jpg', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Oxalates de calcium insolubles (sève) : irritation buccale immédiate, hypersalivation, oedème de la langue/lèvres, vomissements, difficulté à avaler; chez le chat, atteinte rénale possible si systémique.' },
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
    { nom: 'Chocolat (théobromine et caféine)', especes: ['chien', 'chat'], toxicite: 'Élevée (dose-dépendante)', effets: 'Méthylxanthines : vomissements, diarrhée, polydipsie, hyperactivité, tachycardie, tremblements, convulsions; signes en 6-12h. Chocolat noir/pâtissier plus dangereux que le chocolat au lait.' },
    { nom: 'Café et caféine', especes: ['chien', 'chat'], toxicite: 'Élevée (dose-dépendante)', effets: 'Méthylxanthines : agitation, vomissements, diarrhée, hypersalivation, tachycardie, hypertension, tremblements, convulsions; signes dans les 1-2h suivant l\'ingestion.' },
    { nom: 'Alcool (boissons, pâtes fermentées)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Éthanol : vomissements, diarrhée, ataxie, désorientation, hypothermie, tremblements; cas graves : coma, bradycardie, dépression respiratoire. Chats particulièrement sensibles.' },
    { nom: 'Avocat (persine)', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Persine (feuilles, fruit, noyau, écorce) : vomissements, diarrhée; toxicité systémique surtout documentée chez oiseaux, lapins et ruminants. Risque d\'occlusion digestive si le noyau est avalé entier.' },
    { nom: 'Noix de macadamia', especes: ['chien'], toxicite: 'Modérée', effets: 'Faiblesse (surtout postérieurs), dépression, vomissements, ataxie, tremblements, hyperthermie; signes en moins de 12h, résolution généralement en 24-72h. Risque de pancréatite (aliment très gras).' },
    { nom: 'Oignon, ail, ciboulette, poireau (allium)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Composés sulfurés : dommages aux globules rouges (anémie hémolytique, corps de Heinz), hémoglobinurie, ictère, faiblesse, tachycardie, tachypnée; formes concentrées (poudre, déshydratée) plus dangereuses. Chat plus sensible; ail environ 3-5x plus toxique que l\'oignon.' },
    { nom: 'Raisins et raisins secs', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Acide tartrique (composant présumé) : vomissements, diarrhée, léthargie, anorexie, puis insuffisance rénale aiguë avec anurie possible (12-24h); toxicité imprévisible, environ 50% des chiens exposés ne développent aucun signe.' },
    { nom: 'Xylitol (édulcorant sans sucre)', especes: ['chien'], toxicite: 'Très élevée', effets: 'Hypoglycémie sévère (dès 30 min, parfois retardée 12-18h) : faiblesse, ataxie, convulsions, coma; à plus forte dose, insuffisance hépatique aiguë (ictère, coagulopathie) possible dès 24h.' },
    { nom: 'Pâte à pain crue (levure)', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Fermentation de la levure dans l\'estomac : production d\'éthanol (intoxication alcoolique) et de CO2 (distension gastrique pouvant évoluer en dilatation-torsion de l\'estomac, urgence vitale).' },
    { nom: 'Viande et œufs crus', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Risque de contamination bactérienne (Salmonella, E. coli) : vomissements, diarrhée, fièvre; les œufs crus contiennent aussi une enzyme limitant l\'absorption de la biotine (problèmes de peau/pelage à long terme).' },
    { nom: 'Lait et produits laitiers', especes: ['chien', 'chat'], toxicite: 'Faible', effets: 'Intolérance au lactose fréquente (surtout chez le chat adulte) : ballonnements, douleurs abdominales, diarrhée, vomissements; non toxique en soi mais mal toléré en grande quantité.' },
  ],
  medicaments: [
    { nom: 'Ibuprofène, naproxène, aspirine', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Ulcères gastriques, hémorragie, insuffisance rénale.' },
    { nom: 'Acétaminophène (paracétamol)', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle chez le chat)', effets: 'Anémie, méthémoglobinémie, hépatotoxicité sévère.' },
    { nom: 'Benzodiazépines, antidépresseurs, bêta-bloquants', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Dépression du SNC, hypotension, troubles neurologiques.' },
  ],
  produits_menagers: [
    { nom: 'Antigel (éthylène glycol)', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Troubles neurologiques, vomissements, insuffisance rénale irréversible en 24 à 72 h.' },
    { nom: 'Batteries, piles', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Brûlures orales, perforations GI, intoxication aux métaux.' },
    { nom: 'Nettoyants ménagers', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Irritation gastro-intestinale, vomissements, douleur ou brûlure oesophagienne.' },
    { nom: 'Huiles essentielles', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Toxicité hépatique, troubles neurologiques, vomissements, ataxie.' },
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

// ─── COMPOSANT ICONES ESPÈCES ────────────────────────────
function EspecesIcones({ especes }) {
  return (
    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {especes.includes('chien') && <img src="/icone-chien.svg" alt="chien" style={{ width: 28, height: 28 }} />}
      {especes.includes('chat') && <img src="/icone-chat.svg" alt="chat" style={{ width: 28, height: 28 }} />}
    </span>
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
                    <EspecesIcones especes={t.especes} />
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
                  <EspecesIcones especes={t.especes} />
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
                <EspecesIcones especes={selectionne.especes} />
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
