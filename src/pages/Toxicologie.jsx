import { useState } from 'react'

// ─── DONNÉES ─────────────────────────────────────────────

const TOXIQUES = {
  plantes: [
    { nom: 'Aloe vera', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Diarrhée, vomissements, douleurs abdominales.' },
    { nom: 'Amanita spp. (champignons)', especes: ['chien', 'chat'], toxicite: 'Élevée à très élevée', effets: 'Vomissements, diarrhée, phase de rémission trompeuse puis signes d\'insuffisance hépatique aiguë (ictère, hypoglycémie, coagulopathie, coma hépatique); potentiellement mortelle.' },
    { nom: 'Canne des muets (Dieffenbachia)', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Irritation buccale, hypersalivation, oedème de la langue.' },
    { nom: 'Gui et houx', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Vomissements, bradycardie, hypotension, convulsions (forte ingestion).' },
    { nom: 'Houblon (Humulus lupulus)', especes: ['chien'], toxicite: 'Très élevée', effets: 'Hyperthermie maligne, tachypnée, convulsions; peut être rapidement fatal.' },
    { nom: 'Laurier-rose, if, digitale, colchique', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Arythmies, convulsions, insuffisance cardiaque.' },
    { nom: 'Lys (toutes espèces de Lilium)', especes: ['chat'], toxicite: 'Très élevée (mortelle)', effets: 'Insuffisance rénale aiguë, anurie, vomissements, abattement; ingestion minime suffisante.' },
    { nom: 'Plante maïs (Dracaena)', especes: ['chien', 'chat'], toxicite: 'Modérée', effets: 'Vomissements, dilatation pupillaire, perte d\'appétit.' },
    { nom: 'Palmier de Sago (Cycas revoluta)', especes: ['chien', 'chat'], toxicite: 'Très élevée (mortelle)', effets: 'Vomissements, convulsions, hépatite aiguë, coma.' },
    { nom: 'Plante de jade (Crassula)', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Vomissements, troubles neuromoteurs, léthargie.' },
    { nom: 'Poinsettia (étoile de Noël)', especes: ['chien', 'chat'], toxicite: 'Faible à modérée', effets: 'Vomissements, irritation buccale, diarrhée.' },
    { nom: 'Tulipes, jonquilles (narcisses)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Troubles gastro-intestinaux, arythmie, dépression du SNC.' },
  ],
  aliments: [
    { nom: 'Chocolat (théobromine)', especes: ['chien', 'chat'], toxicite: 'Élevée (dose-dépendante)', effets: 'Agitation, arythmie, hyperthermie, convulsions.' },
    { nom: 'Noix de macadamia', especes: ['chien'], toxicite: 'Modérée à élevée', effets: 'Faiblesse, tremblements, hyperthermie, troubles locomoteurs.' },
    { nom: 'Oignons, ail, ciboulette (allium)', especes: ['chien', 'chat'], toxicite: 'Modérée à élevée', effets: 'Anémie hémolytique, vomissements, tachypnée.' },
    { nom: 'Raisins et raisins secs', especes: ['chien', 'chat'], toxicite: 'Élevée', effets: 'Vomissements, insuffisance rénale aiguë, léthargie.' },
    { nom: 'Xylitol (édulcorant sans sucre)', especes: ['chien'], toxicite: 'Élevée', effets: 'Hypoglycémie grave, convulsions, insuffisance hépatique aiguë.' },
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

        {/* ─── LISTE TOXIQUES ─────────────────── */}
        {['plantes', 'aliments', 'medicaments', 'produits_menagers', 'metaux'].includes(onglet) && (
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
