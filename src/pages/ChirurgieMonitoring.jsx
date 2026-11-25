import { useState, useEffect, useContext, useMemo, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { TitreContext } from '../context/NavigationContext'
import { useProfil } from '../context/ProfilContext'
import IconesEspeces from '../components/IconesEspeces'
import { ESPECES_CONFIG } from '../data/especes'
import { correspond } from '../lib/recherche'
import {
  COULEUR_PRIMAIRE, COULEUR_ROUGE, creerDocument, bandeauPatient, sectionGrille,
  titreSection, tableau, dureeEntre, finaliser, ouvrir,
} from '../lib/pdfadjuvet'
import { t, tn, enAnglais, locale, chiffres } from '../lib/i18n'

const ESPECES = [
  { id: 'chien',        label: t('Chien'),              icone: '/icone-chien.svg' },
  { id: 'chat',         label: t('Chat'),               icone: '/icone-chat.svg' },
  { id: 'cheval',       label: t('Cheval'),             icone: '/icone-cheval.png' },
  { id: 'vache',        label: t('Vache'),              icone: '/icone-vache.png' },
  { id: 'mouton',       label: t('Mouton'),             icone: '/icone-mouton.png' },
  { id: 'lama',         label: t('Lama'),               icone: '/icone-lama.png' },
  { id: 'lapin',        label: t('Lapin'),              icone: '/icone-lapin.png' },
  { id: 'furet',        label: t('Furet'),              icone: '/icone-furet.png' },
  { id: 'oiseau',       label: t('Oiseau'),             icone: '/icone-oiseau.png' },
  { id: 'serpent',      label: t('Serpent'),            icone: '/icone-serpent.png' },
  { id: 'lezard',       label: t('Lézard'),             icone: '/icone-lezard.png' },
  { id: 'tortue',       label: t('Tortue'),             icone: '/icone-tortue.png' },
  { id: 'poisson',      label: t('Poisson'),            icone: '/icone-poisson.png' },
  { id: 'amphibien',    label: t('Amphibien'),          icone: '/icone-grenouille.png' },
  { id: 'rongeur',      label: t('Rongeur'),            icone: '/icone-rongeurs.png' },
  { id: 'chinchilla',   label: t('Chinchilla'),         icone: '/icone-chinchilla.png' },
  { id: 'cobaye',       label: t('Cochon d\'Inde'),      icone: '/icone-cobaye.png' },
  { id: 'herisson',     label: t('Hérisson'),           icone: '/icone-herisson.png' },
]

const MUQUEUSES_OPTIONS = ['Roses', 'Pâles', 'Congestives', 'Cyanotiques']
const ASA_OPTIONS = ['I', 'II', 'III', 'IV', 'V']
const CATEGORIES_MED = ["Drogues d'urgence", 'Pré-anesthésique', 'Inducteurs', 'Intra-opératoire', 'Post-opératoire']
const MAX_HISTORIQUE = 30
const INTERVALLE_MESURE_MIN = 5

const COLONNES_SUIVI_PDF = 9

const MESURE_PARAMS = [
  { key: 'fc', label: t('FC (bpm)'), court: t('FC'), unite: 'bpm' },
  { key: 'fr', label: t('FR (rpm)'), court: t('FR'), unite: 'rpm' },
  { key: 'temp', label: t('Température (°C)'), court: t('Temp'), unite: '°C' },
  { key: 'spo2', label: t('SpO₂ (%)'), court: t('SpO₂'), unite: '%' },
  { key: 'co2', label: 'ETCO₂ (mmHg)', court: 'ETCO₂', unite: 'mmHg' },
  { key: 'syst', label: t('PA systolique'), court: t('PAS'), unite: 'mmHg' },
  { key: 'diast', label: t('PA diastolique'), court: t('PAD'), unite: 'mmHg' },
  { key: 'map', label: t('PAM (mmHg)'), court: t('PAM'), unite: 'mmHg' },
  { key: 'isoSevo', label: t('Iso/Sevo (%)'), court: t('Iso/Sevo'), unite: '%' },
  { key: 'o2', label: 'O₂ (L/min)', court: 'O₂', unite: 'L/min' },
  { key: 'fluideIv', label: t('Fluide IV (mL/h)'), court: t('Fluide'), unite: 'mL/h' },
]

const CLES_ESSENTIELLES = ['fc', 'fr', 'temp', 'spo2', 'co2']
const CLES_COMPLEMENTAIRES = ['syst', 'diast', 'map', 'isoSevo', 'o2', 'fluideIv']

/* Plages physiologiques, chien et chat seulement */
const PLAGES = {
  chien: { temperature: [38.3, 39.2], fc: [70, 120], fr: [18, 34] },
  chat: { temperature: [38.0, 38.5], fc: [110, 200], fr: [10, 20] },
}

/* ─── CHOIX RAPIDES ─────────────────────────────────────── */
const PROCEDURES = [
  'Stérilisation (OVE / OVH)', 'Castration', 'Détartrage', 'Extraction dentaire',
  'Retrait de masse', 'Corps étranger', 'Césarienne', 'Cystotomie',
  'Réparation de plaie', 'Imagerie sous sédation',
]
const CALIBRES = ['18G', '20G', '22G', '24G']
// Code couleur international des cathéters (ISO 10555-5), affiché sous chaque calibre.
const COULEURS_CALIBRES = {
  '18G': { nom: 'vert', hex: '#2e9e4f' },
  '20G': { nom: 'rose', hex: '#f08cb4' },
  '22G': { nom: 'bleu', hex: '#2f7fd8' },
  '24G': { nom: 'jaune', hex: '#f5d10a' },
}
const SITES_CATHETER = [
  'Membre antérieur droit', 'Membre antérieur gauche',
  'Membre postérieur droit', 'Membre postérieur gauche', 'Jugulaire',
]
const SOLUTES = ['Lactate Ringer (LRS)', 'Plasma-Lyte A', 'Normosol-R', 'NaCl 0,9 %', 'Dextrose 5 %']
const DEBITS_RAPIDES = ['3', '5', '10']
const AGENTS_INHALES = ['Isoflurane', 'Sévoflurane']
const CIRCUITS = ['Réinspiratoire (cercle)', 'Non réinspiratoire (Bain)', 'Non réinspiratoire (Jackson-Rees)']
const TUBES_ET = ['3', '3,5', '4', '4,5', '5', '6', '7', '8', '9', '10']
const BALLONS = [
  { label: '0,5 L', litres: 0.5 },
  { label: '1 L', litres: 1 },
  { label: '2 L', litres: 2 },
  { label: '3 L', litres: 3 },
  { label: '5 L', litres: 5 },
]
const CLE_NOMS = 'monitoring-noms'

const LONGUEUR_MIN_NOM = 3

function nomValide(nom) {
  return String(nom || '').trim().length >= LONGUEUR_MIN_NOM
}

/* Les entrées trop courtes sont écartées à la lecture, ce qui
   nettoie aussi les fragments enregistrés par erreur. */
function lireNomsRecents() {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE_NOMS)) || {}
    return {
      veterinaire: (brut.veterinaire || []).filter(nomValide),
      technicien: (brut.technicien || []).filter(nomValide),
    }
  } catch {
    return { veterinaire: [], technicien: [] }
  }
}

function ecrireNomsRecents(noms) {
  try {
    localStorage.setItem(CLE_NOMS, JSON.stringify(noms))
  } catch {
    /* stockage indisponible */
  }
}

function ajouterNomRecent(champ, nom) {
  const valeur = String(nom || '').trim()
  if (!nomValide(valeur)) return null
  const actuel = lireNomsRecents()
  const liste = [valeur, ...(actuel[champ] || []).filter(n => n.toLowerCase() !== valeur.toLowerCase())].slice(0, 8)
  const noms = { ...actuel, [champ]: liste }
  ecrireNomsRecents(noms)
  return noms
}

function retirerNomRecent(champ, nom) {
  const actuel = lireNomsRecents()
  const noms = { ...actuel, [champ]: (actuel[champ] || []).filter(n => n !== nom) }
  ecrireNomsRecents(noms)
  return noms
}

/* Ballon réservoir : au moins 4 à 6 fois le volume courant,
   ce qui revient à poids en kg × 60 mL, arrondi à la taille au-dessus */
function ballonSuggere(poidsKg) {
  if (!poidsKg) return null
  const litresRequis = (poidsKg * 60) / 1000
  return BALLONS.find(b => b.litres >= litresRequis) || BALLONS[BALLONS.length - 1]
}

/* Débits d'O₂ recommandés, en mL/kg/min, avec un plancher
   pratique de 0,5 L/min dans les deux cas */
const DEBITS_O2 = {
  cercle: { min: 20, max: 40, libelle: t('cercle') },
  nonReinspiratoire: { min: 200, max: 300, libelle: t('circuit non réinspiratoire') },
}
const O2_PLANCHER_LMIN = 0.5

const VERIFICATIONS = [
  { champ: 'checkMachineQuotidien', label: t('Contrôle quotidien de la machine') },
  { champ: 'checkO2Pret', label: t('O₂ prêt à l\'emploi') },
  { champ: 'checkEtancheite', label: t('Test d\'étanchéité') },
  { champ: 'checkChauxSodee', label: t('Chaux sodée en bon état'), siCercle: true },
  { champ: 'checkValvesUni', label: t('Valves unidirectionnelles fonctionnelles'), siCercle: true },
  { champ: 'checkValveAPL', label: t('Valve APL ouverte'), critique: true },
  { champ: 'checkMoniteur', label: t('Moniteur de surveillance') },
  { champ: 'checkRechauffement', label: t('Dispositif de réchauffement') },
  { champ: 'checkIntubation', label: t('Matériel pour intubation') },
  { champ: 'checkUrgence', label: t('Équipement d\'urgence prêt') },
]

function etatInitial() {
  return {
    animalNom: '',
    proprietaireNom: '',
    consentementSigne: false,
    procedure: '',
    veterinaire: '',
    technicien: '',
    espece: '',
    race: '',
    sexe: '',
    sterilise: false,
    poids: '',
    poidsUnite: 'kg',
    asa: '',
    antecedents: '',
    problemesAnticipes: '',
    temperature: '',
    fc: '',
    fr: '',
    trc: '',
    muqueuses: [],
    particularites: '',
    accesCalibre: '',
    accesSite: '',
    soluteType: '',
    debit: '',
    debitUnite: 'mL/kg/h',
    volumeTotal: '',
    checkMachineQuotidien: false,
    checkO2Pret: false,
    checkEtancheite: false,
    checkChauxSodee: false,
    checkValvesUni: false,
    checkValveAPL: false,
    checkMoniteur: false,
    checkRechauffement: false,
    checkIntubation: false,
    checkUrgence: false,
    agentInhale: '',
    circuit: '',
    tubeET: '',
    ballonnet: '',
    ballonReservoir: '',
    o2Lmin: '',
    medications: [],
    heureDebut: '',
    mesures: [],
    heureFin: '',
    notesFin: '',
    extubationHeure: '',
    extubationEtat: '',
    postTemp: '',
    postFc: '',
    postFr: '',
    postTrc: '',
    postDouleur: '',
    postCommentaires: '',
  }
}

function heureActuelle() {
  const d = new Date()
  return d.toTimeString().slice(0, 5)
}

function minutesDepuis(hhmm) {
  if (!hhmm) return null
  const [h, m] = String(hhmm).split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return null
  const maintenant = new Date()
  let diff = (maintenant.getHours() * 60 + maintenant.getMinutes()) - (h * 60 + m)
  if (diff < 0) diff += 24 * 60
  return diff
}

function formaterDuree(min) {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`
}

function getPoidsKg(form) {
  const p = parseFloat(form.poids)
  if (!p || isNaN(p)) return null
  return form.poidsUnite === 'lb' ? p / 2.20462 : p
}

function normaliserMedicament(med) {
  let doseMin = parseFloat(med.dose_min)
  let doseMax = parseFloat(med.dose_max)
  let conc = parseFloat(med.concentration)
  if (med.unite_dose === 'mcg/kg') {
    if (!isNaN(doseMin)) doseMin /= 1000
    if (!isNaN(doseMax)) doseMax /= 1000
  }
  if (med.unite_concentration === 'mcg/mL' && !isNaN(conc)) conc /= 1000
  return { doseMin, doseMax, concentration: conc }
}

// Identifiant d'une médication ajoutée ; appelée seulement au clic.
function idMedication(medId) {
  return medId + '-' + Date.now()
}

function categorieMedDefaut(med) {
  const c = med.categorie || ''
  if (c === 'Urgence' || c === 'Antagonistes') return "Drogues d'urgence"
  if (c === 'Anesthésiques / Analgésiques') return 'Inducteurs'
  return 'Intra-opératoire'
}

function doseEtVolume(poidsKg, doseMgKg, concentration) {
  const dose = parseFloat(doseMgKg)
  const conc = parseFloat(concentration)
  if (!poidsKg || isNaN(dose) || isNaN(conc) || !conc) return { doseMg: null, volume: null }
  const doseMg = poidsKg * dose
  return { doseMg, volume: doseMg / conc }
}

/* ─── DÉFILEMENT SOUS LE HEADER COLLANT ─────────────────── */
function conteneurDeScroll(el) {
  let parent = el.parentElement
  while (parent) {
    const overflow = getComputedStyle(parent).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollHeight > parent.clientHeight) return parent
    parent = parent.parentElement
  }
  return null
}

function scrollVersSection(id) {
  const el = document.getElementById(`section-${id}`)
  if (!el) return
  const header = document.querySelector('.header')
  const marge = (header?.offsetHeight || 0) + 8
  const conteneur = conteneurDeScroll(el)
  if (conteneur) {
    const haut = el.getBoundingClientRect().top - conteneur.getBoundingClientRect().top + conteneur.scrollTop
    conteneur.scrollTo({ top: Math.max(haut - marge, 0), behavior: 'smooth' })
  } else {
    const haut = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(haut - marge, 0), behavior: 'smooth' })
  }
}

function SectionAccordeon({ titre, icone, resume, etat, ouvert, onToggle, children, ancre }) {
  return (
    <div className={`examen-section ${ouvert ? 'ouvert' : ''}`} id={ancre}>
      <button className="examen-section-header" onClick={onToggle}>
        <span className={`examen-section-pastille ${etat}`}>
          {etat === 'complet' ? <i className="ti ti-check"></i> : <i className={`ti ${icone}`}></i>}
        </span>
        <span className="examen-section-textes">
          <span className="examen-section-titre">{titre}</span>
          {resume && <span className="examen-section-resume">{resume}</span>}
        </span>
        <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'} examen-section-chevron`}></i>
      </button>
      {ouvert && <div className="examen-section-contenu">{children}</div>}
    </div>
  )
}

export default function ChirurgieMonitoring() {
  const [vue, setVue] = useState('liste') // 'liste' | 'setup' | 'monitoring'
  const [form, setForm] = useState(etatInitial())
  const [currentId, setCurrentId] = useState(null)
  const [historique, setHistorique] = useState([])
  // Incrémenté pour recharger l'historique (après un enregistrement).
  const [versionHistorique, setVersionHistorique] = useState(0)
  const [itemConsulte, setItemConsulte] = useState(null)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)
  const [showResume, setShowResume] = useState(null)
  const [showModifs, setShowModifs] = useState(false)
  const [showAlertValveAPL, setShowAlertValveAPL] = useState(false)
  const [showManquants, setShowManquants] = useState(false)
  const [copie, setCopie] = useState(false)
  const [popupEspece, setPopupEspece] = useState(false)
  const [rechercheHistorique, setRechercheHistorique] = useState('')
  const [joursOuverts, setJoursOuverts] = useState(() => new Set())
  const [medsOuverts, setMedsOuverts] = useState(() => new Set())

  const [sectionOuverte, setSectionOuverte] = useState('identification')
  const [scrollCible, setScrollCible] = useState(null)
  const [medsReplies, setMedsReplies] = useState(false)
  const [editHeureDebut, setEditHeureDebut] = useState(false)
  const [complementairesOuverts, setComplementairesOuverts] = useState(false)
  const [, setTick] = useState(0)
  const [champsAutres, setChampsAutres] = useState(() => new Set())
  const [membresEquipe, setMembresEquipe] = useState([])
  const [nomClinique, setNomClinique] = useState('')
  const [logoClinique, setLogoClinique] = useState('')
  const [nomsRecents, setNomsRecents] = useState(() => lireNomsRecents())

  const [popupMesure, setPopupMesure] = useState(null)
  const [editMesureIndex, setEditMesureIndex] = useState(null)
  const [popupFin, setPopupFin] = useState(false)
  const [rechercheMed, setRechercheMed] = useState('')
  const [sheetMed, setSheetMed] = useState(false)
  const [tousMedicaments, setTousMedicaments] = useState([])

  const { setTitreCustom } = useContext(TitreContext)
  const { estEquipe, teamId } = useProfil()

  const premierRendu = useRef(true)

  useEffect(() => {
    if (vue === 'setup') setTitreCustom(currentId ? t('Modifier le monitoring') : t('Démarrer l\'anesthésie'))
    else if (vue === 'monitoring') setTitreCustom(t('Monitoring en cours'))
    else setTitreCustom('')
    return () => setTitreCustom('')
  }, [vue, currentId, setTitreCustom])

  /* ─── Hauteur réelle de la navigation du bas ─────────── */
  useEffect(() => {
    const nav = document.querySelector('.bottom-nav-v2, .bottom-nav')
    if (!nav) return
    const maj = () => document.documentElement.style.setProperty('--examen-nav-h', `${nav.offsetHeight}px`)
    maj()
    const ro = new ResizeObserver(maj)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [])

  /* ─── Horloge du monitoring ──────────────────────────── */
  useEffect(() => {
    const horloge = setInterval(() => setTick(n => n + 1), 20000)
    return () => clearInterval(horloge)
  }, [])

  /* ─── Défilement après ouverture d'une section ───────── */
  useEffect(() => {
    if (!scrollCible) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollVersSection(scrollCible)
        setScrollCible(null)
      })
    })
    return () => cancelAnimationFrame(id)
  }, [scrollCible])

  /* ─── Sauvegarde automatique du brouillon ────────────── */
  useEffect(() => {
    if (!currentId || !(vue === 'setup' || vue === 'monitoring')) return
    if (premierRendu.current) { premierRendu.current = false; return }
    const minuterie = setTimeout(() => {
      supabase
        .from('monitorings_anesthesiques')
        .update({ animal_nom: form.animalNom || t('Sans nom'), donnees: form, updated_at: new Date().toISOString() })
        .eq('id', currentId)
        .then(() => setVersionHistorique(v => v + 1))
    }, 800)
    return () => clearTimeout(minuterie)
  }, [form, currentId, vue])

  /* Médicaments de base + médicaments personnalisés de l'équipe
     ou de l'utilisateur, comme dans la page Pharmacologie */
  useEffect(() => {
    let actif = true
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      const requetes = [supabase.from('medicaments').select('*').order('nom')]
      if (user) {
        requetes.push(
          estEquipe && teamId
            ? supabase.from('medicaments_custom').select('*').eq('equipe_id', teamId).order('nom')
            : supabase.from('medicaments_custom').select('*').eq('user_id', user.id).order('nom')
        )
      }
      const resultats = await Promise.all(requetes)
      if (!actif) return
      const base = resultats[0]?.data || []
      const custom = (resultats[1]?.data || []).map(m => ({ ...m, personnalise: true }))
      setTousMedicaments([...base, ...custom].sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr')))
    }
    charger()
    return () => { actif = false }
  }, [estEquipe, teamId])

  /* ─── Membres de l'équipe, pour les suggestions de noms ── */
  useEffect(() => {
    if (!estEquipe || !teamId) return
    supabase
      .from('membres_equipe')
      .select('profiles(nom)')
      .eq('equipe_id', teamId)
      .then(({ data }) => {
        const noms = (data || []).map(m => m.profiles?.nom).filter(Boolean)
        setMembresEquipe([...new Set(noms)])
      })
    supabase
      .from('equipes')
      .select('nom, logo_url')
      .eq('id', teamId)
      .single()
      .then(({ data }) => {
        setNomClinique(data?.nom || '')
        setLogoClinique(data?.logo_url || '')
      })
  }, [estEquipe, teamId])

  /* Rechargé à l'ouverture, quand le profil arrive (clinique) et à
     chaque nouvelle version ; « actif » écarte une réponse périmée. */
  useEffect(() => {
    let actif = true
    async function chargerHistorique() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const query = supabase.from('monitorings_anesthesiques').select('*').order('created_at', { ascending: false })
      const { data } = estEquipe && teamId
        ? await query.eq('equipe_id', teamId)
        : await query.eq('user_id', user.id)
      if (actif) setHistorique(data || [])
    }
    chargerHistorique()
    return () => { actif = false }
  }, [estEquipe, teamId, versionHistorique])

  function modifierChamp(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  function toggleMuqueuse(opt) {
    setForm(prev => ({
      ...prev,
      muqueuses: prev.muqueuses.includes(opt) ? prev.muqueuses.filter(m => m !== opt) : [...prev.muqueuses, opt],
    }))
  }

  async function commencerNouveau() {
    const nouveauForm = etatInitial()
    premierRendu.current = true
    setForm(nouveauForm)
    setCurrentId(null)
    setSectionOuverte('identification')
    setVue('setup')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (historique.length >= MAX_HISTORIQUE) {
      const aSupprimer = [...historique]
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, historique.length - MAX_HISTORIQUE + 1)
      for (const item of aSupprimer) {
        await supabase.from('monitorings_anesthesiques').delete().eq('id', item.id)
      }
    }
    const payload = { user_id: user.id, animal_nom: t('Sans nom'), resume: '', donnees: nouveauForm }
    if (estEquipe && teamId) payload.equipe_id = teamId
    const { data } = await supabase
      .from('monitorings_anesthesiques')
      .insert(payload)
      .select()
      .single()
    if (data) {
      setCurrentId(data.id)
      setVersionHistorique(v => v + 1)
    }
  }

  // ─── RECHERCHE MÉDICAMENTS ──────────────────────
  /* La liste complète est déjà chargée, le filtrage se fait
     localement : pas d'aller-retour réseau à chaque lettre. */
  const medicamentsFiltres = useMemo(() => {
    if (!rechercheMed.trim()) return tousMedicaments
    return tousMedicaments.filter(m => correspond(m.nom, rechercheMed))
  }, [tousMedicaments, rechercheMed])

  const medicamentsGroupes = useMemo(() => {
    const groupes = new Map()
    medicamentsFiltres.forEach(m => {
      const cle = m.categorie || 'Autres'
      if (!groupes.has(cle)) groupes.set(cle, [])
      groupes.get(cle).push(m)
    })
    return Array.from(groupes.entries()).sort((a, b) => a[0].localeCompare(b[0], locale))
  }, [medicamentsFiltres])

  function ouvrirSheetMed() {
    setRechercheMed('')
    setSheetMed(true)
  }

  function choisirMedicament(med) {
    ajouterMedication(med)
    setSheetMed(false)
  }

  function ajouterMedication(med) {
    const { doseMin, concentration } = normaliserMedicament(med)
    const newId = idMedication(med.id)
    setForm(prev => ({
      ...prev,
      medications: [...prev.medications, {
        id: newId,
        nom: med.nom,
        categorie: categorieMedDefaut(med),
        concentration: isNaN(concentration) ? '' : String(concentration),
        doseMgKg: isNaN(doseMin) ? '' : String(doseMin),
        voie: (med.voies_admin && med.voies_admin[0]) || '',
        administre: false,
        heureAdministration: '',
      }],
    }))
    setRechercheMed('')
  }

  function modifierMedication(id, champ, valeur) {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, [champ]: valeur } : m),
    }))
  }

  function supprimerMedication(id) {
    setForm(prev => ({ ...prev, medications: prev.medications.filter(m => m.id !== id) }))
  }

  function toggleAdministreMedication(id, administre) {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id
        ? { ...m, administre, heureAdministration: administre ? (m.heureAdministration || heureActuelle()) : m.heureAdministration }
        : m),
    }))
  }

  /* ─── PROGRESSION DU SETUP ───────────────────────────── */
  const poidsKg = getPoidsKg(form)

  /* Les vérifications propres au cercle ne disparaissent que si
     un circuit non réinspiratoire est explicitement choisi. */
  const estNonReinspiratoire = String(form.circuit || '').startsWith('Non réinspiratoire')
  const verificationsActives = useMemo(
    () => VERIFICATIONS.filter(v => !v.siCercle || !estNonReinspiratoire),
    [estNonReinspiratoire]
  )

  /* Suggestion de débit d'O₂ selon le circuit et le poids */
  const suggestionO2 = useMemo(() => {
    if (!poidsKg || !form.circuit) return null
    const ref = estNonReinspiratoire ? DEBITS_O2.nonReinspiratoire : DEBITS_O2.cercle
    if (!estNonReinspiratoire && !String(form.circuit).startsWith('Réinspiratoire')) return null
    const bas = Math.max(O2_PLANCHER_LMIN, (poidsKg * ref.min) / 1000)
    const haut = Math.max(O2_PLANCHER_LMIN, (poidsKg * ref.max) / 1000)
    const fmt = n => chiffres((Math.round(n * 10) / 10).toString().replace('.', ','))
    return t('Pour un {circuit} : environ {bas} à {haut} L/min ({min} à {max} mL/kg/min, minimum {plancher} L/min).', { circuit: ref.libelle, bas: fmt(bas), haut: fmt(haut), min: ref.min, max: ref.max, plancher: chiffres('0,5') })
  }, [poidsKg, form.circuit, estNonReinspiratoire])

  const manquantsRequis = useMemo(() => {
    const liste = []
    if (!form.animalNom.trim()) liste.push({ section: 'identification', label: t('Nom de l\'animal') })
    if (!form.espece) liste.push({ section: 'identification', label: t('Espèce') })
    if (!form.poids) liste.push({ section: 'identification', label: t('Poids, nécessaire au calcul des volumes') })
    return liste
  }, [form.animalNom, form.espece, form.poids])

  const elements = useMemo(() => {
    const vals = [
      form.animalNom.trim(), form.espece, form.poids,
      form.procedure, form.asa,
      form.temperature, form.fc, form.fr, form.trc, form.muqueuses.length ? 'x' : '',
      form.accesCalibre, form.soluteType, form.debit,
      form.agentInhale, form.tubeET, form.o2Lmin,
    ]
    const faits = vals.filter(v => String(v || '').trim()).length + verificationsActives.filter(v => form[v.champ]).length
    return { faits, total: vals.length + verificationsActives.length }
  }, [form, verificationsActives])

  function etatSection(id) {
    const compte = (vals) => vals.filter(v => String(v || '').trim()).length
    switch (id) {
      case 'identification': {
        const faits = compte([form.animalNom, form.espece, form.poids])
        return faits === 3 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'procedure': {
        const faits = compte([form.procedure, form.veterinaire, form.technicien])
        return faits === 3 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'asa':
        return form.asa ? 'complet' : 'vide'
      case 'preop': {
        const faits = compte([form.temperature, form.fc, form.fr, form.trc]) + (form.muqueuses.length ? 1 : 0)
        return faits === 5 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'acces': {
        const faits = compte([form.accesCalibre, form.soluteType, form.debit])
        return faits === 3 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'materiel': {
        const faits = compte([form.agentInhale, form.tubeET, form.o2Lmin])
        return faits === 3 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'securite': {
        const faits = verificationsActives.filter(v => form[v.champ]).length
        return faits === verificationsActives.length ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'medications':
        return form.medications.length ? 'complet' : 'vide'
      default:
        return 'vide'
    }
  }

  function resumeSection(id) {
    switch (id) {
      case 'identification': {
        const esp = ESPECES.find(e => e.id === form.espece)?.label
        return [form.animalNom.trim(), esp, form.poids ? `${form.poids} ${form.poidsUnite}` : null].filter(Boolean).join(' · ')
      }
      case 'procedure':
        return [form.procedure && t(form.procedure), form.veterinaire].filter(Boolean).join(' · ')
      case 'asa':
        return form.asa ? `ASA ${form.asa}` : t('Non renseigné')
      case 'preop':
        return [
          form.temperature ? `${form.temperature} °C` : null,
          form.fc ? `${form.fc} bpm` : null,
          form.fr ? `${form.fr} rpm` : null,
        ].filter(Boolean).join(' · ')
      case 'acces':
        return [form.accesCalibre, form.soluteType && chiffres(t(form.soluteType)), form.debit ? `${form.debit} ${form.debitUnite || 'mL/kg/h'}` : null].filter(Boolean).join(' · ')
      case 'materiel':
        return [form.agentInhale && t(form.agentInhale), form.tubeET ? `${t('Tube')} ${chiffres(form.tubeET)}` : null, form.o2Lmin ? `O₂ ${form.o2Lmin} L/min` : null].filter(Boolean).join(' · ')
      case 'securite': {
        const faits = verificationsActives.filter(v => form[v.champ]).length
        const apl = form.checkValveAPL ? '' : t(', valve APL à vérifier')
        return t('{faits} sur {total}', { faits, total: verificationsActives.length }) + apl
      }
      case 'medications': {
        const n = form.medications.length
        return n === 0 ? t('Aucun médicament préparé') : tn(n, '{n} médicament préparé', '{n} médicaments préparés')
      }
      default:
        return ''
    }
  }

  function ouvrirSection(id) {
    let ouverture = false
    setSectionOuverte(prev => {
      ouverture = prev !== id
      return prev === id ? null : id
    })
    setScrollCible(ouverture ? id : null)
  }

  function allerA(sectionId) {
    setShowManquants(false)
    setSectionOuverte(sectionId)
    setScrollCible(sectionId)
  }

  function infoPlage(champ) {
    const plage = PLAGES[form.espece]?.[champ]
    if (!plage) return null
    const valeur = parseFloat(String(form[champ]).replace(',', '.'))
    const horsPlage = isFinite(valeur) && (valeur < plage[0] || valeur > plage[1])
    return { plage, horsPlage }
  }

  /* ─── CHOIX RAPIDES ──────────────────────────────────── */
  function estAutre(champ, options) {
    if (champsAutres.has(champ)) return true
    return Boolean(form[champ]) && !options.includes(form[champ])
  }

  function activerAutre(champ, actif) {
    setChampsAutres(prev => {
      const next = new Set(prev)
      if (actif) next.add(champ)
      else next.delete(champ)
      return next
    })
    if (!actif) modifierChamp(champ, '')
    else if (form[champ] && !champsAutres.has(champ)) modifierChamp(champ, '')
  }

  function choisirOption(champ, option) {
    setChampsAutres(prev => {
      const next = new Set(prev)
      next.delete(champ)
      return next
    })
    modifierChamp(champ, form[champ] === option ? '' : option)
  }

  function champChoix(champ, label, options, { placeholder, aide, couleurs } = {}) {
    const autre = estAutre(champ, options)
    return (
      <div className="form-groupe">
        <label className="form-label">{t(label)}</label>
        <div className="examen-valeurs">
          {options.map(opt => {
            const actif = !autre && form[champ] === opt
            const couleur = couleurs?.[opt]
            return (
              <button
                key={opt}
                type="button"
                className={`examen-valeur-btn ${actif ? 'actif' : ''}`}
                onClick={() => choisirOption(champ, opt)}
                aria-label={couleur ? `${opt} (${t(couleur.nom)})` : undefined}
                style={couleur ? { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 } : undefined}
              >
                {/[a-zà-ÿ]{2}/i.test(opt) ? chiffres(t(opt)) : chiffres(opt)}
                {couleur && (
                  <span
                    aria-hidden="true"
                    style={{ width: 12, height: 12, borderRadius: '50%', background: couleur.hex, border: `1.5px solid ${actif ? '#fff' : 'rgba(0, 0, 0, 0.35)'}` }}
                  ></span>
                )}
              </button>
            )
          })}
          <button
            type="button"
            className={`examen-valeur-btn ${autre ? 'actif' : ''}`}
            onClick={() => activerAutre(champ, !autre)}
          >
            {t('Autre')}
          </button>
        </div>
        {autre && (
          <input
            type="text"
            className="form-input"
            value={form[champ] || ''}
            onChange={e => modifierChamp(champ, e.target.value)}
            placeholder={placeholder || t('Préciser...')}
          />
        )}
        {aide && <p className="examen-aide">{aide}</p>}
      </div>
    )
  }

  /* Champ de nom avec suggestions : membres de l'équipe,
     puis les derniers noms saisis sur cet appareil */
  function champNom(champ, label, placeholder) {
    const saisie = String(form[champ] || '').trim().toLowerCase()
    const locaux = nomsRecents[champ] || []
    const vus = new Set()
    const candidats = [...membresEquipe, ...locaux].filter(n => {
      const cle = n.toLowerCase()
      if (!nomValide(n) || vus.has(cle)) return false
      vus.add(cle)
      return true
    })
    const suggestions = candidats
      .filter(n => n.toLowerCase() !== saisie)
      .filter(n => !saisie || n.toLowerCase().includes(saisie))
      .slice(0, 5)
    return (
      <div className="form-groupe">
        <label className="form-label">{label}</label>
        <input
          type="text"
          className="form-input"
          value={form[champ] || ''}
          onChange={e => modifierChamp(champ, e.target.value)}
          placeholder={placeholder}
        />
        {suggestions.length > 0 && (
          <div className="monitoring-suggestions">
            {suggestions.map(n => {
              const estLocal = !membresEquipe.some(m => m.toLowerCase() === n.toLowerCase())
              return (
                <span key={n} className="monitoring-suggestion">
                  <button type="button" onClick={() => modifierChamp(champ, n)}>{n}</button>
                  {estLocal && (
                    <button
                      type="button"
                      className="monitoring-suggestion-retirer"
                      aria-label={t('Retirer {nom} des suggestions', { nom: n })}
                      onClick={() => setNomsRecents(retirerNomRecent(champ, n))}
                    >
                      ✕
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  /* Débit : valeur + unité, avec conversion en mL/h */
  const debitUnite = form.debitUnite || 'mL/kg/h'
  const debitValeur = parseFloat(String(form.debit || '').replace(',', '.'))
  const debitMlH = isFinite(debitValeur)
    ? (debitUnite === 'mL/kg/h' ? (poidsKg ? debitValeur * poidsKg : null) : debitValeur)
    : null
  const debitTexte = form.debit ? `${form.debit} ${debitUnite}` : ''

  // ─── DÉMARRAGE ──────────────────────
  function demarrerAnesthesie() {
    if (manquantsRequis.length > 0) {
      setShowManquants(true)
      return
    }
    if (!form.checkValveAPL) {
      setShowAlertValveAPL(true)
      return
    }
    memoriserNomsSaisis()
    setForm(prev => ({ ...prev, heureDebut: prev.heureDebut || heureActuelle() }))
    setVue('monitoring')
  }

  /* Les noms ne sont mémorisés qu'au démarrage, jamais pendant
     la frappe, pour ne pas garder de fragments comme « j ». */
  function memoriserNomsSaisis() {
    let noms = null
    if (!membresEquipe.some(m => m.toLowerCase() === String(form.veterinaire || '').trim().toLowerCase())) {
      noms = ajouterNomRecent('veterinaire', form.veterinaire) || noms
    }
    if (!membresEquipe.some(m => m.toLowerCase() === String(form.technicien || '').trim().toLowerCase())) {
      noms = ajouterNomRecent('technicien', form.technicien) || noms
    }
    if (noms) setNomsRecents(noms)
  }

  // ─── MESURES ──────────────────────
  const derniereMesure = form.mesures.length ? form.mesures[form.mesures.length - 1] : null

  function ouvrirPopupMesure() {
    const init = { heure: heureActuelle(), lubrifiantOculaire: false }
    MESURE_PARAMS.forEach(p => { init[p.key] = '' })
    setPopupMesure(init)
    setEditMesureIndex(null)
    if (derniereMesure && CLES_COMPLEMENTAIRES.some(k => String(derniereMesure[k] || '').trim())) {
      setComplementairesOuverts(true)
    }
  }

  function ajouterMesure() {
    if (editMesureIndex !== null) {
      setForm(prev => ({ ...prev, mesures: prev.mesures.map((m, i) => i === editMesureIndex ? popupMesure : m) }))
      setEditMesureIndex(null)
    } else {
      setForm(prev => ({ ...prev, mesures: [...prev.mesures, popupMesure] }))
    }
    setPopupMesure(null)
  }

  function ouvrirEditionMesure(index) {
    setEditMesureIndex(index)
    setPopupMesure({ ...form.mesures[index] })
  }

  function supprimerMesure(index) {
    setForm(prev => ({ ...prev, mesures: prev.mesures.filter((_, i) => i !== index) }))
    setEditMesureIndex(null)
    setPopupMesure(null)
  }

  /* Valeur de la mesure précédente, pour l'indication sous le champ */
  function valeurPrecedente(cle) {
    const index = editMesureIndex !== null ? editMesureIndex - 1 : form.mesures.length - 1
    if (index < 0) return ''
    return form.mesures[index]?.[cle] || ''
  }

  // ─── FIN ──────────────────────
  function ouvrirPopupFin() {
    setForm(prev => ({ ...prev, heureFin: prev.heureFin || heureActuelle() }))
    setPopupFin(true)
  }

  async function terminerAnesthesie() {
    setPopupFin(false)
    const texte = genererRapportTexte()
    await sauvegarder(texte)
    setShowResume(texte)
  }

  // ─── RAPPORT TEXTE ──────────────────────
  function genererRapportTexte() {
    const pKg = getPoidsKg(form)
    const especeLabel = ESPECES.find(e => e.id === form.espece)?.label
    const lignes = []
    // « Libellé : valeur » en français, « Label: value » en anglais.
    const ligne = (prefixe, libelle, valeur) => lignes.push(`${prefixe}${t(libelle)}${enAnglais ? ':' : ' :'} ${valeur}`)
    const titre = (libelle) => lignes.push(`${t(libelle)}${enAnglais ? ':' : ' :'}`)
    const ouiNon = (v) => (v ? t('Oui') : t('Non'))
    lignes.push(t('MONITORING ANESTHÉSIQUE'))
    ligne('', 'Animal', form.animalNom || '—')
    ligne('', 'Propriétaire', form.proprietaireNom || '—')
    ligne('', 'Consentement signé', ouiNon(form.consentementSigne))
    ligne('', 'Espèce', especeLabel || '—')
    ligne('', 'Race', form.race?.trim() || '—')
    ligne('', 'Sexe', `${form.sexe === 'femelle' ? t('Femelle') : form.sexe === 'male' ? t('Mâle') : '—'}${form.sexe && form.sterilise ? t(' (stérilisé(e))') : ''}`)
    ligne('', 'Poids', form.poids ? form.poids + ' ' + form.poidsUnite : '—')
    lignes.push('')
    titre('Procédure')
    ligne('- ', 'Type', form.procedure ? t(form.procedure) : '—')
    ligne('- ', 'Vétérinaire', form.veterinaire || '—')
    ligne('- ', 'Technicien.ne', form.technicien || '—')
    lignes.push('')
    ligne('', 'Risque anesthésique (ASA)', form.asa || '—')
    ligne('- ', 'Antécédents / Problèmes présents', form.antecedents?.trim() || '—')
    ligne('- ', 'Problèmes à anticiper', form.problemesAnticipes?.trim() || '—')
    lignes.push('')
    titre('Évaluation pré-anesthésique')
    ligne('- ', 'Température', form.temperature ? form.temperature + ' °C' : '—')
    ligne('- ', 'FC', form.fc ? form.fc + ' bpm' : '—')
    ligne('- ', 'FR', form.fr ? form.fr + ' rpm' : '—')
    ligne('- ', 'TRC', form.trc ? form.trc + ' sec' : '—')
    ligne('- ', 'Muqueuses', form.muqueuses.length ? form.muqueuses.map(m => t(m)).join(', ') : '—')
    ligne('- ', 'Particularités', form.particularites?.trim() || '—')
    lignes.push('')
    titre('Accès veineux et fluides IV')
    ligne('- ', 'Cathéter', `${form.accesCalibre || '—'}${form.accesSite ? ' (' + t(form.accesSite) + ')' : ''}`)
    ligne('- ', 'Soluté', form.soluteType ? chiffres(t(form.soluteType)) : '—')
    ligne('- ', 'Débit', `${debitTexte || '—'}${debitMlH != null && debitUnite === 'mL/kg/h' ? ` (${t('environ {n} mL/h', { n: Math.round(debitMlH) })})` : ''}`)
    ligne('- ', 'Volume total prévu', form.volumeTotal ? form.volumeTotal + ' mL' : '—')
    lignes.push('')
    titre('Maintien anesthésique')
    ligne('- ', 'Agent inhalé', form.agentInhale ? t(form.agentInhale) : '—')
    ligne('- ', 'Circuit', form.circuit ? t(form.circuit) : '—')
    ligne('- ', 'Tube endotrachéal', form.tubeET ? chiffres(form.tubeET) : '—')
    ligne('- ', 'Ballonnet', form.ballonnet ? t(form.ballonnet) : '—')
    ligne('- ', 'Ballon réservoir', form.ballonReservoir ? chiffres(form.ballonReservoir) : '—')
    ligne('- ', 'O₂', form.o2Lmin ? form.o2Lmin + ' L/min' : '—')
    lignes.push('')
    titre('Vérifications de sécurité')
    verificationsActives.forEach(v => {
      lignes.push(`- ${v.label}${enAnglais ? ':' : ' :'} ${ouiNon(form[v.champ])}`)
    })
    lignes.push('')
    titre('Médicaments administrés')
    const medsAdministres = form.medications.filter(m => m.administre)
    if (medsAdministres.length) {
      const sep = enAnglais ? ':' : ' :'
      medsAdministres.forEach(m => {
        const { doseMg, volume } = doseEtVolume(pKg, m.doseMgKg, m.concentration)
        lignes.push(`  - ${m.nom} | ${t('Concentration')}${sep} ${m.concentration || '—'} mg/mL | ${t('Dose')}${sep} ${m.doseMgKg || '—'} mg/kg${doseMg != null ? ` (${doseMg.toFixed(2)} mg)` : ''} | ${t('Volume')}${sep} ${volume != null ? volume.toFixed(2) + ' mL' : '—'} | ${t('Voie')}${sep} ${m.voie ? t(m.voie) : '—'} | ${t('Heure')}${sep} ${m.heureAdministration || '—'}`)
      })
    } else {
      lignes.push('  —')
    }
    lignes.push('')
    ligne('', "Heure de début de l'anesthésie", form.heureDebut || '—')
    if (form.mesures.length) {
      lignes.push('')
      titre('Suivi des paramètres')
      const libHeure = t('Heure')
      const libLubrifiant = t('Lubrifiant oculaire')
      const tousParams = [...MESURE_PARAMS, { key: 'lubrifiantOculaire', label: libLubrifiant }]
      const largeurLabel = Math.max(...tousParams.map(p => p.label.length), libHeure.length) + 1
      const largeurCol = Math.max(...form.mesures.map(m => m.heure.length), 5) + 2
      const colonne = (texte) => String(texte).padEnd(largeurCol)
      lignes.push(libHeure.padEnd(largeurLabel) + form.mesures.map(m => colonne(m.heure)).join(''))
      MESURE_PARAMS.forEach(p => {
        lignes.push(p.label.padEnd(largeurLabel) + form.mesures.map(m => colonne(m[p.key] || '—')).join(''))
      })
      lignes.push(libLubrifiant.padEnd(largeurLabel) + form.mesures.map(m => colonne(ouiNon(m.lubrifiantOculaire))).join(''))
    }
    lignes.push('')
    ligne('', "Heure de fin de l'anesthésie", form.heureFin || '—')
    ligne('', 'Notes de fin', form.notesFin?.trim() || '—')
    lignes.push('')
    titre('Récupération')
    ligne('- ', 'Extubation', `${form.extubationHeure || '—'}${form.extubationEtat ? ' (' + form.extubationEtat + ')' : ''}`)
    ligne('- ', 'Température', form.postTemp || '—')
    ligne('- ', 'FC', form.postFc || '—')
    ligne('- ', 'FR', form.postFr || '—')
    ligne('- ', 'TRC', form.postTrc || '—')
    ligne('- ', 'Douleur', form.postDouleur || '—')
    ligne('- ', 'Commentaires', form.postCommentaires?.trim() || '—')
    return lignes.join('\n')
  }

  // ─── PDF ──────────────────────
  console.log('PDF →', { nomClinique, logoClinique })
  async function genererPDF(donnees, dateTexte) {
    const dp = { ...etatInitial(), ...(donnees || form) }
    const pKg = getPoidsKg(dp)
    const especeLabel = ESPECES.find(e => e.id === dp.espece)?.label
    const dateDoc = dateTexte || new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

    const ctx = await creerDocument({
      titre: t('Monitoring anesthésique'),
      sousTitre: t('Feuille de surveillance'),
      date: dateDoc,
      clinique: nomClinique,
      logoClinique,
    })

    const poidsTexte = dp.poids
      ? (dp.poidsUnite === 'lb' && pKg ? `${dp.poids} lb (${chiffres(pKg.toFixed(1).replace('.', ','))} kg)` : `${dp.poids} ${dp.poidsUnite}`)
      : null
    const sexeTexte = dp.sexe === 'femelle' ? t('Femelle') : dp.sexe === 'male' ? t('Mâle') : null
    bandeauPatient(
      ctx,
      dp.animalNom || t('Animal'),
      [especeLabel, sexeTexte, poidsTexte, dp.procedure && t(dp.procedure), dp.asa ? `ASA ${dp.asa}` : null].filter(Boolean).join(' · ')
    )

    sectionGrille(ctx, t('Patient et procédure'), [
      [t('Propriétaire'), dp.proprietaireNom],
      [t('Consentement'), dp.consentementSigne ? t('Signé') : t('Non signé')],
      [t('Race'), dp.race],
      [t('Stérilisé(e)'), dp.sterilise ? t('Oui') : t('Non')],
      [t('Vétérinaire'), dp.veterinaire],
      [t('Technicien.ne'), dp.technicien],
      [t('Antécédents'), dp.antecedents],
      [t('À anticiper'), dp.problemesAnticipes],
    ])

    sectionGrille(ctx, t('Évaluation pré-anesthésique'), [
      [t('Température'), dp.temperature ? `${dp.temperature} °C` : null],
      [t('TRC'), dp.trc ? `${dp.trc} s` : null],
      [t('Fréq. cardiaque'), dp.fc ? `${dp.fc} bpm` : null],
      [t('Fréq. respiratoire'), dp.fr ? `${dp.fr} rpm` : null],
      [t('Muqueuses'), (dp.muqueuses || []).map(m => t(m)).join(', ')],
      [t('Particularités'), dp.particularites],
    ])

    const uniteDebitPdf = dp.debitUnite || 'mL/kg/h'
    const valeurDebitPdf = parseFloat(String(dp.debit || '').replace(',', '.'))
    const debitConverti = isFinite(valeurDebitPdf) && uniteDebitPdf === 'mL/kg/h' && pKg
      ? ` (${t('environ {n} mL/h', { n: Math.round(valeurDebitPdf * pKg) })})`
      : ''
    sectionGrille(ctx, t('Accès veineux et fluides'), [
      [t('Cathéter'), dp.accesCalibre],
      [t('Site'), dp.accesSite && t(dp.accesSite)],
      [t('Soluté'), dp.soluteType && chiffres(t(dp.soluteType))],
      [t('Débit'), dp.debit ? `${dp.debit} ${uniteDebitPdf}${debitConverti}` : null],
      [t('Volume prévu'), dp.volumeTotal ? `${dp.volumeTotal} mL` : null],
    ])

    const nonReinsPdf = String(dp.circuit || '').startsWith('Non réinspiratoire')
    const verifsPdf = VERIFICATIONS.filter(v => !v.siCercle || !nonReinsPdf)
    const manquantesPdf = verifsPdf.filter(v => !dp[v.champ])
    const celluleVerifs = manquantesPdf.length === 0
      ? t('{n} sur {n} complétées', { n: verifsPdf.length })
      : {
          content: t('{faits} sur {total} · non cochées : {liste}', { faits: verifsPdf.length - manquantesPdf.length, total: verifsPdf.length, liste: manquantesPdf.map(v => v.label.toLowerCase()).join(', ') }),
          styles: { textColor: COULEUR_ROUGE, fontStyle: 'bold' },
        }
    sectionGrille(ctx, t('Matériel et maintien'), [
      [t('Agent inhalé'), dp.agentInhale && t(dp.agentInhale)],
      [t('Circuit'), dp.circuit && t(dp.circuit)],
      [t('Tube endotrachéal'), dp.tubeET ? `${chiffres(dp.tubeET)} mm${dp.ballonnet ? `, ${t('ballonnet')} ${t(dp.ballonnet).toLowerCase()}` : ''}` : null],
      [t('Ballon réservoir'), dp.ballonReservoir && chiffres(dp.ballonReservoir)],
      ['O2', dp.o2Lmin ? `${dp.o2Lmin} L/min` : null],
      [t('Vérifications'), celluleVerifs],
    ])

    const medsAdministresPdf = (dp.medications || []).filter(m => m.administre)
    if (medsAdministresPdf.length) {
      titreSection(
        ctx,
        t('Médicaments administrés'),
        t('{n} au total', { n: medsAdministresPdf.length }),
        Math.min(medsAdministresPdf.length, 5) * 5.5 + 8
      )
      tableau(ctx, {
        head: [t('Médicament'), t('Conc.'), t('Dose'), t('Dose totale'), t('Volume'), t('Voie'), t('Heure')],
        body: medsAdministresPdf.map(m => {
          const { doseMg, volume } = doseEtVolume(pKg, m.doseMgKg, m.concentration)
          return [
            m.nom,
            m.concentration ? `${m.concentration} mg/mL` : '—',
            m.doseMgKg ? `${m.doseMgKg} mg/kg` : '—',
            doseMg != null ? `${doseMg.toFixed(2)} mg` : '—',
            volume != null ? `${volume.toFixed(2)} mL` : '—',
            m.voie ? t(m.voie) : '—',
            m.heureAdministration || '—',
          ]
        }),
      })
    }

    const mesuresPdf = dp.mesures || []
    if (mesuresPdf.length) {
      const nbBlocs = Math.ceil(mesuresPdf.length / COLONNES_SUIVI_PDF)
      let bloc = 1
      for (let i = 0; i < mesuresPdf.length; i += COLONNES_SUIVI_PDF) {
        const chunk = mesuresPdf.slice(i, i + COLONNES_SUIVI_PDF)
        titreSection(
          ctx,
          t('Suivi des paramètres'),
          nbBlocs > 1 ? t('bloc {bloc} de {nb} · {debut} à {fin}', { bloc, nb: nbBlocs, debut: chunk[0].heure, fin: chunk[chunk.length - 1].heure }) : null,
          (MESURE_PARAMS.length + 2) * 5.2
        )
        tableau(ctx, {
          head: [t('Paramètre'), ...chunk.map(m => m.heure)],
          body: [
            ...MESURE_PARAMS.map(p => [p.label, ...chunk.map(m => m[p.key] || '—')]),
            [t('Lubrifiant oculaire'), ...chunk.map(m => m.lubrifiantOculaire ? t('Oui') : '—')],
          ],
          columnStyles: {
            0: { cellWidth: 32, fontStyle: 'bold', textColor: COULEUR_PRIMAIRE },
            ...Object.fromEntries(chunk.map((_, ci) => [ci + 1, { cellWidth: 17, halign: 'center' }])),
          },
        })
        bloc++
      }
    }

    const dureeTotale = dureeEntre(dp.heureDebut, dp.heureFin)
    sectionGrille(ctx, t('Horaires et récupération'), [
      [t('Début'), dp.heureDebut],
      [t('Fin'), dp.heureFin],
      [t('Durée totale'), dureeTotale != null ? formaterDuree(dureeTotale) : null],
      [t('Extubation'), [dp.extubationHeure, dp.extubationEtat].filter(Boolean).join(', ')],
      [t('Température'), dp.postTemp],
      [t('Fréq. cardiaque'), dp.postFc],
      [t('Fréq. respiratoire'), dp.postFr],
      [t('TRC'), dp.postTrc],
      [t('Douleur'), dp.postDouleur],
      [t('Notes de fin'), dp.notesFin],
      [t('Commentaires'), dp.postCommentaires],
    ])

    finaliser(ctx, { sujet: `${dp.animalNom || t('Animal')} · ${dateDoc}` })
    ouvrir(ctx)
  }

  // ─── SAUVEGARDE / HISTORIQUE ──────────────────────
  async function sauvegarder(texte) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profilFrais } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
    const nomUtilisateur = profilFrais?.nom || user.user_metadata?.nom || user.email || 'Membre'

    const maintenant = new Date().toISOString()
    const entreeModif = { nom: nomUtilisateur, timestamp: maintenant }

    if (currentId) {
      const { data: currentRec } = await supabase
        .from('monitorings_anesthesiques').select('historique_modifs').eq('id', currentId).single()
      const modifs = [...(currentRec?.historique_modifs || []), entreeModif]
      await supabase
        .from('monitorings_anesthesiques')
        .update({ animal_nom: form.animalNom || t('Sans nom'), resume: texte, donnees: form, updated_at: maintenant, historique_modifs: modifs })
        .eq('id', currentId)
    } else {
      if (historique.length >= MAX_HISTORIQUE) {
        const aSupprimer = [...historique]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .slice(0, historique.length - MAX_HISTORIQUE + 1)
        for (const item of aSupprimer) {
          await supabase.from('monitorings_anesthesiques').delete().eq('id', item.id)
        }
      }
      const payload = { user_id: user.id, animal_nom: form.animalNom || t('Sans nom'), resume: texte, donnees: form, historique_modifs: [entreeModif] }
      if (estEquipe && teamId) payload.equipe_id = teamId
      const { data } = await supabase.from('monitorings_anesthesiques').insert(payload).select().single()
      if (data) setCurrentId(data.id)
    }
    setVersionHistorique(v => v + 1)
  }

  function consulter(item) {
    setItemConsulte(item)
  }

  function modifier(item) {
    premierRendu.current = true
    setForm({ ...etatInitial(), ...(item.donnees || {}) })
    setCurrentId(item.id)
    setItemConsulte(null)
    setSectionOuverte('identification')
    setVue(item.donnees?.heureDebut ? 'monitoring' : 'setup')
  }

  async function supprimerHistorique(id) {
    await supabase.from('monitorings_anesthesiques').delete().eq('id', id)
    setHistorique(prev => prev.filter(h => h.id !== id))
    setShowConfirmSupprimer(null)
    setItemConsulte(null)
  }

  function copierResume(texte) {
    navigator.clipboard.writeText(texte)
    setCopie(true)
    setTimeout(() => setCopie(false), 1500)
  }

  function fermerResume() {
    setShowResume(null)
    setVue('liste')
    setItemConsulte(null)
  }

  function formaterDate(d) {
    return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function cleJour(d) {
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  function formaterJour(cle) {
    const [a, m, j] = cle.split('-').map(Number)
    return new Date(a, m - 1, j).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  /* Un dossier sans résumé n'est pas terminé : il est en cours
     si l'anesthésie a démarré, en préparation sinon. */
  const actifs = useMemo(
    () => historique
      .filter(item => !item.resume)
      .sort((a, b) => {
        const aDemarre = a.donnees?.heureDebut ? 1 : 0
        const bDemarre = b.donnees?.heureDebut ? 1 : 0
        if (aDemarre !== bDemarre) return bDemarre - aDemarre
        return new Date(b.created_at) - new Date(a.created_at)
      }),
    [historique]
  )
  const termines = useMemo(() => historique.filter(item => item.resume), [historique])

  const historiqueFiltre = useMemo(() => {
    const q = rechercheHistorique.trim().toLowerCase()
    if (!q) return termines
    return termines.filter(item => {
      const especeLabel = ESPECES.find(e => e.id === item.donnees?.espece)?.label || ''
      const champs = [item.animal_nom, especeLabel, item.donnees?.race, formaterDate(item.created_at)]
      return champs.some(c => (c || '').toLowerCase().includes(q))
    })
  }, [termines, rechercheHistorique])

  const groupesHistorique = useMemo(() => {
    const groupes = new Map()
    termines.forEach(item => {
      const cle = cleJour(item.created_at)
      if (!groupes.has(cle)) groupes.set(cle, [])
      groupes.get(cle).push(item)
    })
    return Array.from(groupes.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [termines])

  function toggleJour(cle) {
    setJoursOuverts(prev => {
      const next = new Set(prev)
      if (next.has(cle)) next.delete(cle)
      else next.add(cle)
      return next
    })
  }

  // ─── VUE LISTE ──────────────────────
  if (vue === 'liste') {
    return (
      <div className="labo-detail-page">
        <div className="postop-intro">
          <i className="ti ti-activity postop-intro-icone"></i>
          <p className="postop-intro-texte">
            {t('Outil de suivi des paramètres vitaux durant une anesthésie. Démarrez une nouvelle anesthésie ou consultez votre historique.')}
          </p>
        </div>

        <button className="labo-btn-primary" style={{ width: '100%', margin: '0 0 16px' }} onClick={commencerNouveau}>
          <i className="ti ti-plus"></i> {t('Démarrer l\'anesthésie')}
        </button>

        {actifs.length > 0 && (
          <div className="monitoring-actifs">
            <h2 className="monitoring-actifs-titre">
              <i className="ti ti-activity"></i>
              En cours ({actifs.length})
            </h2>
            {actifs.map(item => {
              const demarre = Boolean(item.donnees?.heureDebut)
              const minutes = demarre ? minutesDepuis(item.donnees.heureDebut) : null
              const details = [
                ESPECES.find(e => e.id === item.donnees?.espece)?.label,
                item.donnees?.procedure && t(item.donnees.procedure),
              ].filter(Boolean).join(' · ')
              return (
                <div key={item.id} style={{ position: 'relative' }}>
                <button className={`monitoring-actif ${demarre ? 'demarre' : ''}`} style={{ paddingRight: 56 }} onClick={() => modifier(item)}>
                  <div className="monitoring-actif-haut">
                    <span className="monitoring-actif-nom">{item.animal_nom}</span>
                    <span className={`monitoring-actif-badge ${demarre ? '' : 'preparation'}`}>
                      {demarre ? t('En cours') : t('En préparation')}
                    </span>
                  </div>
                  {details && <span className="monitoring-actif-details">{details}</span>}
                  <div className="monitoring-actif-bas">
                    <span>
                      {demarre
                        ? t('Début {heure} · {duree} d\'anesthésie', { heure: item.donnees.heureDebut, duree: formaterDuree(minutes) })
                        : t('Créé le {date}', { date: formaterDate(item.created_at) })}
                    </span>
                    <span className="monitoring-actif-action">
                      {demarre ? t('Reprendre') : t('Continuer')} <i className="ti ti-arrow-right"></i>
                    </span>
                  </div>
                </button>
                {/* Suppression rapide, avec la même confirmation que l'historique. */}
                <button
                  type="button"
                  className="examen-historique-supprimer"
                  aria-label={t('Supprimer le monitoring de {nom}', { nom: item.animal_nom })}
                  onClick={() => setShowConfirmSupprimer(item)}
                  style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}
                >
                  <i className="ti ti-trash"></i>
                </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-history"></i>
            </div>
            <h2 className="postop-section-titre">{t('Historique ({n})', { n: termines.length })}</h2>
          </div>
          {termines.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)', padding: '16px 16px 16px' }}>
              {t('Aucun monitoring terminé pour le moment.')}
            </p>
          ) : (
            <>
              <div style={{ padding: '0 16px 12px' }}>
                <div className="recherche-wrapper">
                  <span className="recherche-icone"><i className="ti ti-search"></i></span>
                  <input
                    type="text"
                    className="recherche-input"
                    value={rechercheHistorique}
                    onChange={e => setRechercheHistorique(e.target.value)}
                    placeholder={t('Rechercher par nom, espèce ou date...')}
                  />
                  {rechercheHistorique && (
                    <button className="recherche-clear" onClick={() => setRechercheHistorique('')}>✕</button>
                  )}
                </div>
              </div>

              {rechercheHistorique.trim() ? (
                <div className="examen-historique-liste" style={{ padding: '0 16px 16px' }}>
                  {historiqueFiltre.length === 0 ? (
                    <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>{t('Aucun résultat.')}</p>
                  ) : historiqueFiltre.map(item => (
                    <div key={item.id} className="examen-historique-item" onClick={() => consulter(item)}>
                      <div className="examen-historique-info">
                        <h3 className="examen-historique-nom">{item.animal_nom}</h3>
                        <p className="examen-historique-date">{formaterDate(item.created_at)}</p>
                      </div>
                      <button className="examen-historique-supprimer" onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(item) }}>
                        <i className="ti ti-trash"></i>
                      </button>
                      <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)', fontSize: 18 }}></i>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '0 16px 16px' }}>
                  {groupesHistorique.map(([cle, items]) => {
                    const ouvert = joursOuverts.has(cle)
                    return (
                      <div key={cle} className="examen-historique-groupe">
                        <button className="examen-historique-groupe-header" onClick={() => toggleJour(cle)}>
                          <i className={`ti ti-chevron-right examen-historique-groupe-chevron ${ouvert ? 'ouvert' : ''}`}></i>
                          <span className="examen-historique-groupe-titre">{formaterJour(cle)}</span>
                          <span className="examen-historique-groupe-compte">{items.length}</span>
                        </button>
                        {ouvert && (
                          <div className="examen-historique-liste">
                            {items.map(item => (
                              <div key={item.id} className="examen-historique-item" onClick={() => consulter(item)}>
                                <div className="examen-historique-info">
                                  <h3 className="examen-historique-nom">{item.animal_nom}</h3>
                                  <p className="examen-historique-date">{formaterDate(item.created_at)}</p>
                                </div>
                                <button className="examen-historique-supprimer" onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(item) }}>
                                  <i className="ti ti-trash"></i>
                                </button>
                                <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)', fontSize: 18 }}></i>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Popup consultation */}
        {itemConsulte && (
          <div className="popup-overlay" onClick={() => setItemConsulte(null)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>{itemConsulte.animal_nom}</span>
                <button className="popup-close" onClick={() => setItemConsulte(null)}>✕</button>
              </div>
              {itemConsulte.resume ? (
                <textarea
                  className="form-textarea"
                  style={{ width: '100%', minHeight: 320, fontFamily: 'monospace', fontSize: 12 }}
                  value={itemConsulte.resume}
                  readOnly
                />
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <i className="ti ti-heartbeat" style={{ fontSize: 36, color: 'var(--text-hint)', display: 'block', marginBottom: 10 }}></i>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{t('Monitoring en cours')}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 16 }}>{t('Aucun résumé généré, le monitoring n\'a pas encore été finalisé.')}</p>
                  {itemConsulte.donnees && (
                    <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {itemConsulte.donnees.espece && <div><strong>{t('Espèce :')}</strong> {ESPECES.find(e => e.id === itemConsulte.donnees.espece)?.label || itemConsulte.donnees.espece}</div>}
                      {itemConsulte.donnees.race && <div><strong>{t('Race :')}</strong> {itemConsulte.donnees.race}</div>}
                      {itemConsulte.donnees.poids && <div><strong>{t('Poids :')}</strong> {itemConsulte.donnees.poids} {itemConsulte.donnees.poidsUnite || 'kg'}</div>}
                      {itemConsulte.donnees.procedure && <div><strong>{t('Procédure :')}</strong> {itemConsulte.donnees.procedure}</div>}
                    </div>
                  )}
                </div>
              )}
              <button className="labo-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={() => modifier(itemConsulte)}>
                {t('Modifier')}
              </button>
              {itemConsulte.historique_modifs?.length > 0 && (
                <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setShowModifs(v => !v)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {t('Historique des modifications ({n})', { n: itemConsulte.historique_modifs.length })}
                    </span>
                    <i className={`ti ti-chevron-${showModifs ? 'up' : 'down'}`} style={{ fontSize: 14, color: 'var(--text-hint)' }}></i>
                  </button>
                  {showModifs && (
                    <div style={{ padding: '8px 12px 10px', background: 'var(--bg-card)', maxHeight: 220, overflowY: 'auto' }}>
                      {[...itemConsulte.historique_modifs].reverse().map((m, i) => (
                        <p key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          <strong>{m.nom}</strong> · {t('{date} à {heure}', { date: new Date(m.timestamp).toLocaleDateString(locale, { day: 'numeric', month: 'long' }), heure: new Date(m.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) })}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="popup-actions-centrees" style={{ marginTop: 8 }}>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => copierResume(itemConsulte.resume)}>
                  {copie ? t('Copié !') : t('Copier')}
                </button>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => genererPDF(itemConsulte.donnees, new Date(itemConsulte.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }))}>
                  <i className="ti ti-file-download"></i> PDF
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(itemConsulte)}>
                  {t('Supprimer')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup confirmation suppression */}
        {showConfirmSupprimer && (
          <div className="popup-overlay" onClick={() => setShowConfirmSupprimer(null)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>{t('Supprimer ce monitoring')}</span>
                <button className="popup-close" onClick={() => setShowConfirmSupprimer(null)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {showConfirmSupprimer.resume
                    ? <>{t('Avez-vous bien noté ces informations dans le dossier de')} <strong>{showConfirmSupprimer.animal_nom}</strong> {t('avant de supprimer ?')}</>
                    : <>{t('Ce monitoring n\'est pas terminé : toutes les données saisies pour')} <strong>{showConfirmSupprimer.animal_nom}</strong> {t('seront effacées. Cette action est irréversible.')}</>}
                </p>
              </div>
              <div className="popup-actions-centrees">
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(null)}>
                  {t('Annuler')}
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerHistorique(showConfirmSupprimer.id)}>
                  {t('Supprimer')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── BLOC MÉDICATIONS, PARTAGÉ SETUP / MONITORING ──────
  function blocMedications() {
    return (
      <>
        {!form.poids && (
          <p className="examen-plage hors">
            <i className="ti ti-alert-triangle"></i>
            {t('Indiquez le poids de l\'animal pour calculer les volumes automatiquement.')}
          </p>
        )}

        <button className="monitoring-ajouter-med" onClick={ouvrirSheetMed}>
          <i className="ti ti-plus"></i> {t('Ajouter un médicament')}
        </button>

        {sheetMed && (
          <div className="fluido-sheet-overlay" onClick={() => setSheetMed(false)}>
            <div className="fluido-sheet monitoring-sheet-med" onClick={e => e.stopPropagation()}>
              <div className="fluido-sheet-poignee"></div>

              <div className="popup-header">
                <span>{t('Ajouter un médicament')}</span>
                <button className="popup-close" onClick={() => setSheetMed(false)}>✕</button>
              </div>

              <div className="recherche-wrapper">
                <i className="ti ti-search recherche-icone"></i>
                <input
                  type="text"
                  className="recherche-input"
                  placeholder={t('Rechercher un médicament...')}
                  value={rechercheMed}
                  onChange={e => setRechercheMed(e.target.value)}
                />
                {rechercheMed && (
                  <button className="recherche-clear" onClick={() => setRechercheMed('')}>
                    <i className="ti ti-x"></i>
                  </button>
                )}
              </div>

              <div className="monitoring-med-liste">
                {medicamentsFiltres.length === 0 ? (
                  <p className="examen-aide" style={{ padding: '16px 4px' }}>{t('Aucun médicament ne correspond.')}</p>
                ) : medicamentsGroupes.map(([categorie, meds]) => (
                  <div key={categorie}>
                    <p className="monitoring-categorie">{categorie}</p>
                    {meds.map(med => (
                      <button
                        key={`${med.personnalise ? 'c' : 'b'}-${med.id}`}
                        className="monitoring-med-item"
                        onClick={() => choisirMedicament(med)}
                      >
                        <span className="monitoring-med-item-nom">
                          {med.nom}
                          {med.personnalise && <span className="monitoring-med-item-badge">{t('Perso')}</span>}
                        </span>
                        <span className="monitoring-med-item-details">
                          <span>{(med.especes || []).map(e => ESPECES_CONFIG[e]?.label).filter(Boolean).join(' / ')}</span>
                          <IconesEspeces especes={med.especes} taille={22} />
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {form.medications.map(m => {
          const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
          const ouvert = medsOuverts.has(m.id)
          return (
            <div key={m.id} className="monitoring-med-card">
              <button
                type="button"
                className="monitoring-med-card-header monitoring-med-card-header--toggle"
                onClick={() => setMedsOuverts(prev => {
                  const next = new Set(prev)
                  if (next.has(m.id)) next.delete(m.id)
                  else next.add(m.id)
                  return next
                })}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start', gap: 2 }}>
                  <span className="monitoring-med-card-nom">{m.nom}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {volume != null ? <strong style={{ color: 'var(--primary)' }}>{volume.toFixed(2)} mL</strong> : '—'}
                    {doseMg != null ? <span style={{ color: 'var(--text-hint)' }}> · {doseMg.toFixed(2)} mg</span> : ''}
                    {m.voie ? <span style={{ color: 'var(--text-hint)' }}> · {m.voie}</span> : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button className="examen-historique-supprimer" onClick={e => { e.stopPropagation(); supprimerMedication(m.id) }}><i className="ti ti-trash"></i></button>
                  <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'}`} style={{ fontSize: 16, color: 'var(--text-hint)' }}></i>
                </div>
              </button>
              {ouvert && (
                <>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Catégorie')}</label>
                    <select className="form-input" value={m.categorie} onChange={e => modifierMedication(m.id, 'categorie', e.target.value)}>
                      {CATEGORIES_MED.map(c => <option key={c} value={c}>{t(c)}</option>)}
                    </select>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Concentration (mg/mL)')}</label>
                    <input type="text" inputMode="decimal" className="form-input" value={m.concentration} onChange={e => modifierMedication(m.id, 'concentration', e.target.value.replace(',', '.'))} />
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Dose (mg/kg)')}</label>
                    <input type="text" inputMode="decimal" className="form-input" value={m.doseMgKg} onChange={e => modifierMedication(m.id, 'doseMgKg', e.target.value.replace(',', '.'))} />
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Dose totale')}</label>
                    <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>{doseMg != null ? doseMg.toFixed(2) + ' mg' : '—'}</div>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Volume à administrer')}</label>
                    <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--primary)', fontWeight: 700, fontSize: 15 }}>{volume != null ? volume.toFixed(2) + ' mL' : '—'}</div>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">{t('Voie')}</label>
                    <input type="text" className="form-input" value={m.voie} onChange={e => modifierMedication(m.id, 'voie', e.target.value)} placeholder={t('IV, IM, SC...')} />
                  </div>
                </>
              )}
            </div>
          )
        })}
      </>
    )
  }

  // ─── VUE SETUP ──────────────────────
  if (vue === 'setup') {
    return (
      <div className="labo-detail-page examen-page">

        <div className="examen-topbar">
          <button className="examen-retour" onClick={() => setVue('liste')}>
            <i className="ti ti-arrow-left"></i> {t('Historique')}
          </button>
        </div>

        <div className="examen-sections">

          {/* ═══ IDENTIFICATION ═══ */}
          <SectionAccordeon
            ancre="section-identification"
            titre={t('Identification')}
            icone="ti-paw"
            resume={resumeSection('identification')}
            etat={etatSection('identification')}
            ouvert={sectionOuverte === 'identification'}
            onToggle={() => ouvrirSection('identification')}
          >
            <div className="form-groupe">
              <label className="form-label">{t('Nom de l\'animal')}</label>
              <input type="text" className="form-input" value={form.animalNom} onChange={e => modifierChamp('animalNom', e.target.value)} placeholder={t('Ex. : Charlie')} />
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Espèce')}</label>
              <div className="examen-especes-rapides">
                <button type="button" className={`examen-espece-btn ${form.espece === 'chien' ? 'actif' : ''}`} onClick={() => modifierChamp('espece', 'chien')}>
                  <img src="/icone-chien.svg" alt="" /> {t('Chien')}
                </button>
                <button type="button" className={`examen-espece-btn ${form.espece === 'chat' ? 'actif' : ''}`} onClick={() => modifierChamp('espece', 'chat')}>
                  <img src="/icone-chat.svg" alt="" /> {t('Chat')}
                </button>
                <button
                  type="button"
                  className={`examen-espece-btn ${form.espece && form.espece !== 'chien' && form.espece !== 'chat' ? 'actif' : ''}`}
                  onClick={() => setPopupEspece(true)}
                >
                  {form.espece && form.espece !== 'chien' && form.espece !== 'chat'
                    ? <>
                        <img src={ESPECES.find(e => e.id === form.espece)?.icone} alt="" />
                        {ESPECES.find(e => e.id === form.espece)?.label}
                      </>
                    : t('Autre espèce')}
                </button>
              </div>
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Poids')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" inputMode="decimal" className="form-input" style={{ flex: 1 }} value={form.poids} onChange={e => modifierChamp('poids', e.target.value.replace(',', '.'))} placeholder={t('Ex. : 12.5')} />
                <div className="toggle-groupe" style={{ flexShrink: 0 }}>
                  <button type="button" className={`toggle-btn ${form.poidsUnite === 'kg' ? 'actif' : ''}`} onClick={() => modifierChamp('poidsUnite', 'kg')}>kg</button>
                  <button type="button" className={`toggle-btn ${form.poidsUnite === 'lb' ? 'actif' : ''}`} onClick={() => modifierChamp('poidsUnite', 'lb')}>lb</button>
                </div>
              </div>
              {poidsKg != null && form.poidsUnite === 'lb' && (
                <p className="examen-aide">{t('Soit {kg} kg, utilisé pour les calculs.', { kg: chiffres(poidsKg.toFixed(2).replace('.', ',')) })}</p>
              )}
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Race')}</label>
              <input type="text" className="form-input" value={form.race || ''} onChange={e => modifierChamp('race', e.target.value)} placeholder={t('Ex. : Labrador, Persan...')} />
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Sexe')}</label>
              <div className="toggle-groupe">
                <button type="button" className={`toggle-btn ${form.sexe === 'femelle' ? 'actif' : ''}`} onClick={() => modifierChamp('sexe', form.sexe === 'femelle' ? '' : 'femelle')}>{t('Femelle')}</button>
                <button type="button" className={`toggle-btn ${form.sexe === 'male' ? 'actif' : ''}`} onClick={() => modifierChamp('sexe', form.sexe === 'male' ? '' : 'male')}>{t('Mâle')}</button>
              </div>
              <label className="voie-item" style={{ marginTop: 8 }}>
                <span>{t('Stérilisé(e)')}</span>
                <input type="checkbox" checked={form.sterilise} onChange={e => modifierChamp('sterilise', e.target.checked)} />
              </label>
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Nom du propriétaire')}</label>
              <input type="text" className="form-input" value={form.proprietaireNom || ''} onChange={e => modifierChamp('proprietaireNom', e.target.value)} placeholder={t('Ex. : Marie Tremblay')} />
            </div>

            <label className="voie-item">
              <span>{t('Consentement du propriétaire signé')}</span>
              <input type="checkbox" checked={form.consentementSigne || false} onChange={e => modifierChamp('consentementSigne', e.target.checked)} />
            </label>

            <button className="examen-suivant" onClick={() => ouvrirSection('procedure')}>
              {t('Suivant : procédure')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ PROCÉDURE ═══ */}
          <SectionAccordeon
            ancre="section-procedure"
            titre={t('Procédure')}
            icone="ti-scissors"
            resume={resumeSection('procedure')}
            etat={etatSection('procedure')}
            ouvert={sectionOuverte === 'procedure'}
            onToggle={() => ouvrirSection('procedure')}
          >
            {champChoix('procedure', 'Type de procédure', PROCEDURES, { placeholder: t('Ex. : Énucléation') })}
            {champNom('veterinaire', t('Nom du vétérinaire'), t('Ex. : Dr. Dupont'))}
            {champNom('technicien', t('Nom du / de la technicien.ne'), t('Ex. : Sophie Martin'))}

            <button className="examen-suivant" onClick={() => ouvrirSection('asa')}>
              {t('Suivant : risque ASA')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ ASA ═══ */}
          <SectionAccordeon
            ancre="section-asa"
            titre={t('Risque anesthésique')}
            icone="ti-alert-circle"
            resume={resumeSection('asa')}
            etat={etatSection('asa')}
            ouvert={sectionOuverte === 'asa'}
            onToggle={() => ouvrirSection('asa')}
          >
            <div className="form-groupe">
              <label className="form-label">{t('Cote ASA')}</label>
              <div className="examen-valeurs">
                {ASA_OPTIONS.map(opt => (
                  <button key={opt} type="button" className={`examen-valeur-btn ${form.asa === opt ? 'actif' : ''}`} onClick={() => modifierChamp('asa', form.asa === opt ? '' : opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="form-groupe">
              <label className="form-label">{t('Antécédents / Problèmes présents')}</label>
              <textarea className="form-textarea" rows={2} value={form.antecedents || ''} onChange={e => modifierChamp('antecedents', e.target.value)} placeholder={t('Ex. : Souffle cardiaque grade II, obésité...')} />
            </div>
            <div className="form-groupe">
              <label className="form-label">{t('Problèmes à anticiper')}</label>
              <textarea className="form-textarea" rows={2} value={form.problemesAnticipes || ''} onChange={e => modifierChamp('problemesAnticipes', e.target.value)} placeholder={t('Ex. : Risque de régurgitation, instabilité hémodynamique...')} />
            </div>

            <button className="examen-suivant" onClick={() => ouvrirSection('preop')}>
              {t('Suivant : évaluation pré-anesthésique')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ ÉVALUATION PRÉ-ANESTHÉSIQUE ═══ */}
          <SectionAccordeon
            ancre="section-preop"
            titre={t('Évaluation pré-anesthésique')}
            icone="ti-heartbeat"
            resume={resumeSection('preop')}
            etat={etatSection('preop')}
            ouvert={sectionOuverte === 'preop'}
            onToggle={() => ouvrirSection('preop')}
          >
            {[
              { champ: 'temperature', label: t('Température'), unite: '°C', placeholder: t('Ex. : 38.5') },
              { champ: 'fc', label: t('Fréquence cardiaque'), unite: 'bpm', placeholder: t('Ex. : 100') },
              { champ: 'fr', label: t('Fréquence respiratoire'), unite: 'rpm', placeholder: t('Ex. : 24') },
            ].map(({ champ, label, unite, placeholder }) => {
              const info = infoPlage(champ)
              return (
                <div className="form-groupe" key={champ}>
                  <label className="form-label">{label} ({unite})</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="form-input"
                    value={form[champ]}
                    onChange={e => modifierChamp(champ, e.target.value.replace(',', '.'))}
                    placeholder={placeholder}
                  />
                  {info && (
                    <p className={`examen-plage ${info.horsPlage ? 'hors' : ''}`}>
                      {info.horsPlage && <i className="ti ti-info-circle"></i>}
                      {t('Plage {espece} : {min} à {max} {unite}', { espece: String(ESPECES.find(e => e.id === form.espece)?.label || form.espece).toLowerCase(), min: chiffres(String(info.plage[0]).replace('.', ',')), max: chiffres(String(info.plage[1]).replace('.', ',')), unite })}
                      {info.horsPlage ? t(', valeur hors plage') : ''}
                    </p>
                  )}
                </div>
              )
            })}

            <div className="form-groupe">
              <label className="form-label">TRC (sec)</label>
              <input type="text" inputMode="decimal" className="form-input" value={form.trc} onChange={e => modifierChamp('trc', e.target.value)} placeholder={t('Ex. : 1-2')} />
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Couleur des muqueuses')}</label>
              <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
                {MUQUEUSES_OPTIONS.map(opt => (
                  <button key={opt} type="button" className={`toggle-btn ${form.muqueuses.includes(opt) ? 'actif' : ''}`} onClick={() => toggleMuqueuse(opt)}>{t(opt)}</button>
                ))}
              </div>
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Particularités')}</label>
              <textarea className="form-textarea" rows={2} value={form.particularites} onChange={e => modifierChamp('particularites', e.target.value)} placeholder={t('Allergies, conditions particulières...')} />
            </div>

            <button className="examen-suivant" onClick={() => ouvrirSection('acces')}>
              {t('Suivant : accès veineux')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ ACCÈS VEINEUX ═══ */}
          <SectionAccordeon
            ancre="section-acces"
            titre={t('Accès veineux et fluides')}
            icone="ti-droplet"
            resume={resumeSection('acces')}
            etat={etatSection('acces')}
            ouvert={sectionOuverte === 'acces'}
            onToggle={() => ouvrirSection('acces')}
          >
            {champChoix('accesCalibre', 'Calibre du cathéter', CALIBRES, { placeholder: t('Ex. : 16G'), couleurs: COULEURS_CALIBRES })}
            {champChoix('accesSite', 'Site', SITES_CATHETER, { placeholder: t('Préciser le site') })}
            {champChoix('soluteType', 'Type de soluté', SOLUTES, { placeholder: t('Préciser le soluté') })}

            <div className="form-groupe">
              <label className="form-label">{t('Débit')}</label>
              <div className="examen-valeurs">
                {DEBITS_RAPIDES.map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`examen-valeur-btn ${form.debit === d && debitUnite === 'mL/kg/h' ? 'actif' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, debit: prev.debit === d ? '' : d, debitUnite: 'mL/kg/h' }))}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="champ-input">
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.debit}
                  onChange={e => modifierChamp('debit', e.target.value.replace(',', '.'))}
                  placeholder={t('Ex. : 5')}
                />
                <select className="cri-select" value={debitUnite} onChange={e => modifierChamp('debitUnite', e.target.value)}>
                  <option value="mL/kg/h">mL/kg/h</option>
                  <option value="mL/h">mL/h</option>
                </select>
              </div>
              {debitMlH != null && debitUnite === 'mL/kg/h' && (
                <p className="examen-aide">{t('Soit environ {n} mL/h pour ce patient.', { n: Math.round(debitMlH) })}</p>
              )}
              {debitUnite === 'mL/kg/h' && !poidsKg && (
                <p className="examen-aide">{t('Indiquez le poids pour voir la conversion en mL/h.')}</p>
              )}
              <p className="examen-aide">
                {t('Repère AAHA 2024 : 5 mL/kg/h chez le chien, 3 à 5 mL/kg/h chez le chat, si la fonction cardiaque et rénale est normale.')}
              </p>
            </div>

            <div className="form-groupe">
              <label className="form-label">{t('Volume total prévu')}</label>
              <div className="champ-input">
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.volumeTotal}
                  onChange={e => modifierChamp('volumeTotal', e.target.value.replace(',', '.'))}
                  placeholder={t('Ex. : 250')}
                />
                <span className="unite-fixe">mL</span>
              </div>
            </div>

            <button className="examen-suivant" onClick={() => ouvrirSection('materiel')}>
              {t('Suivant : matériel et maintien')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ MATÉRIEL ET MAINTIEN ═══ */}
          <SectionAccordeon
            ancre="section-materiel"
            titre={t('Matériel et maintien')}
            icone="ti-lungs"
            resume={resumeSection('materiel')}
            etat={etatSection('materiel')}
            ouvert={sectionOuverte === 'materiel'}
            onToggle={() => ouvrirSection('materiel')}
          >
            {champChoix('agentInhale', 'Agent inhalé', AGENTS_INHALES, { placeholder: t('Préciser l\'agent') })}

            {champChoix('circuit', 'Circuit', CIRCUITS, {
              placeholder: t('Préciser le circuit'),
              aide: poidsKg && poidsKg <= 7
                ? t('Sous 7 kg, un circuit non réinspiratoire est généralement recommandé.')
                : null,
            })}

            {champChoix('tubeET', 'Tube endotrachéal (mm)', TUBES_ET, { placeholder: t('Ex. : 12') })}

            <div className="form-groupe">
              <label className="form-label">{t('Ballonnet')}</label>
              <div className="toggle-groupe">
                <button type="button" className={`toggle-btn ${form.ballonnet === 'Oui' ? 'actif' : ''}`} onClick={() => modifierChamp('ballonnet', form.ballonnet === 'Oui' ? '' : 'Oui')}>{t('Oui')}</button>
                <button type="button" className={`toggle-btn ${form.ballonnet === 'Non' ? 'actif' : ''}`} onClick={() => modifierChamp('ballonnet', form.ballonnet === 'Non' ? '' : 'Non')}>{t('Non')}</button>
              </div>
            </div>

            {champChoix('ballonReservoir', 'Ballon réservoir', BALLONS.map(b => b.label), {
              placeholder: t('Préciser la taille'),
              aide: ballonSuggere(poidsKg)
                ? t('Suggestion : {taille}, à partir du poids × 60 mL.', { taille: chiffres(ballonSuggere(poidsKg).label) })
                : null,
            })}
            <div className="form-groupe">
              <label className="form-label">O₂ (L/min)</label>
              <div className="champ-input">
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.o2Lmin}
                  onChange={e => modifierChamp('o2Lmin', e.target.value.replace(',', '.'))}
                  placeholder={t('Ex. : 1')}
                />
                <span className="unite-fixe">L/min</span>
              </div>
              {suggestionO2 && <p className="examen-aide">{suggestionO2}</p>}
              {!suggestionO2 && !poidsKg && (
                <p className="examen-aide">{t('Indiquez le poids et le circuit pour voir le débit recommandé.')}</p>
              )}
            </div>

            <button className="examen-suivant" onClick={() => ouvrirSection('securite')}>
              {t('Suivant : vérifications')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ VÉRIFICATIONS DE SÉCURITÉ ═══ */}
          <SectionAccordeon
            ancre="section-securite"
            titre={t('Vérifications de sécurité')}
            icone="ti-shield-check"
            resume={resumeSection('securite')}
            etat={etatSection('securite')}
            ouvert={sectionOuverte === 'securite'}
            onToggle={() => ouvrirSection('securite')}
          >
            {estNonReinspiratoire && (
              <p className="examen-aide">
                {t('Circuit non réinspiratoire : pas de chaux sodée ni de valves unidirectionnelles à vérifier.')}
              </p>
            )}

            <div className="monitoring-checklist">
              {verificationsActives.map(v => (
                <button
                  key={v.champ}
                  type="button"
                  className={`monitoring-check ${form[v.champ] ? 'coche' : ''} ${v.critique ? 'critique' : ''}`}
                  onClick={() => modifierChamp(v.champ, !form[v.champ])}
                >
                  <span className="monitoring-check-case">
                    {form[v.champ] && <i className="ti ti-check"></i>}
                  </span>
                  <span className="monitoring-check-label">{v.label}</span>
                  {v.critique && !form[v.champ] && <i className="ti ti-alert-triangle monitoring-check-alerte"></i>}
                </button>
              ))}
            </div>

            <button className="examen-suivant" onClick={() => ouvrirSection('medications')}>
              {t('Suivant : médications')} <i className="ti ti-arrow-right"></i>
            </button>
          </SectionAccordeon>

          {/* ═══ MÉDICATIONS ═══ */}
          <SectionAccordeon
            ancre="section-medications"
            titre={t('Médications')}
            icone="ti-pill"
            resume={resumeSection('medications')}
            etat={etatSection('medications')}
            ouvert={sectionOuverte === 'medications'}
            onToggle={() => ouvrirSection('medications')}
          >
            {blocMedications()}
          </SectionAccordeon>

        </div>

        {/* ═══ BARRE COLLANTE ═══ */}
        <div className="examen-barre">
          <div className="examen-barre-progression">
            <div className="examen-barre-jauge">
              <div className="examen-barre-remplissage" style={{ width: `${Math.round((elements.faits / elements.total) * 100)}%` }}></div>
            </div>
            <span className="examen-barre-texte">{t('{faits} sur {total}', { faits: elements.faits, total: elements.total })}</span>
          </div>
          <button className="examen-barre-btn complet" onClick={demarrerAnesthesie}>
            <i className="ti ti-player-play"></i> {form.heureDebut ? t('Continuer') : t('Commencer')}
          </button>
        </div>

        {/* Popup espèce */}
        {popupEspece && (
          <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>{t('Choisir une espèce')}</span>
                <button className="popup-close" onClick={() => setPopupEspece(false)}>✕</button>
              </div>
              <div className="popup-especes">
                {ESPECES.map(esp => (
                  <label key={esp.id} className="popup-espece-item">
                    <input type="radio" checked={form.espece === esp.id} onChange={() => { modifierChamp('espece', esp.id); setPopupEspece(false) }} />
                    <img src={esp.icone} alt={esp.label} className="espece-icone-popup" />
                    <span>{esp.label}</span>
                  </label>
                ))}
              </div>
              <button className="btn-sauvegarder" onClick={() => setPopupEspece(false)}>{t('Confirmer')}</button>
            </div>
          </div>
        )}

        {/* Popup éléments obligatoires manquants */}
        {showManquants && (
          <div className="popup-overlay" onClick={() => setShowManquants(false)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>{t('Informations requises')}</span>
                <button className="popup-close" onClick={() => setShowManquants(false)}>✕</button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                {t('Ces éléments sont nécessaires avant de démarrer le monitoring.')}
              </p>
              <div className="examen-manquants">
                {manquantsRequis.map((m, i) => (
                  <button key={i} className="examen-manquant" onClick={() => allerA(m.section)}>
                    <span>{m.label}</span>
                    <i className="ti ti-arrow-right"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popup alerte valve APL */}
        {showAlertValveAPL && (
          <div className="popup-overlay" onClick={() => setShowAlertValveAPL(false)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span style={{ color: '#702F3A' }}><i className="ti ti-alert-triangle" style={{ marginRight: 6 }} />{t('Attention, valve APL')}</span>
                <button className="popup-close" onClick={() => setShowAlertValveAPL(false)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 44, color: '#702F3A', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {t('La valve APL n\'est pas cochée comme ouverte.')}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {t('Assurez-vous que la valve d\'échappement (APL) est bien ouverte avant de commencer le monitoring. Une valve fermée peut causer un barotraumatisme.')}
                </p>
              </div>
              <div className="popup-actions-centrees">
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => { modifierChamp('checkValveAPL', true); setShowAlertValveAPL(false) }}>
                  {t('Confirmer et ouvrir')}
                </button>
                <button className="labo-btn-primary" style={{ flex: 1 }} onClick={() => { setShowAlertValveAPL(false); setForm(prev => ({ ...prev, heureDebut: prev.heureDebut || heureActuelle() })); setVue('monitoring') }}>
                  {t('Continuer quand même')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── VUE MONITORING ──────────────────────
  const minutesAnesthesie = minutesDepuis(form.heureDebut)
  const minutesDerniereMesure = derniereMesure ? minutesDepuis(derniereMesure.heure) : null
  const mesureEnRetard = minutesDerniereMesure != null && minutesDerniereMesure >= INTERVALLE_MESURE_MIN
  const aucuneMesure = form.mesures.length === 0
  const medsAdministresCount = form.medications.filter(m => m.administre).length

  return (
    <div className="labo-detail-page examen-page">

      <div className="examen-topbar">
        <button className="examen-retour" onClick={() => setVue('setup')}>
          <i className="ti ti-arrow-left"></i> {t('Informations')}
        </button>
      </div>

      {/* Entête patient */}
      <div className="monitoring-entete">
        <div className="monitoring-entete-textes">
          <span className="monitoring-entete-nom">{form.animalNom || 'Animal'}</span>
          <span className="monitoring-entete-detail">
            {[form.procedure, form.poids ? `${form.poids} ${form.poidsUnite}` : null].filter(Boolean).join(' · ')}
          </span>
        </div>
        <button className="monitoring-entete-heure" onClick={() => setEditHeureDebut(v => !v)}>
          <span>{t('Début {heure}', { heure: form.heureDebut || '—' })}</span>
          <i className="ti ti-pencil"></i>
        </button>
      </div>

      {editHeureDebut && (
        <div className="form-groupe" style={{ marginBottom: 12 }}>
          <label className="form-label">{t('Heure de début')}</label>
          <input type="time" className="form-input" value={form.heureDebut} onChange={e => modifierChamp('heureDebut', e.target.value)} />
        </div>
      )}

      {/* Dernière mesure */}
      <div className="monitoring-derniere">
        <div className="monitoring-derniere-entete">
          <span className="monitoring-derniere-titre">
            {derniereMesure ? t('Dernière mesure · {heure}', { heure: derniereMesure.heure }) : t('Aucune mesure')}
          </span>
          {derniereMesure && (
            <button className="fluido-lien" onClick={() => ouvrirEditionMesure(form.mesures.length - 1)}>{t('Modifier')}</button>
          )}
        </div>
        {derniereMesure ? (
          <div className="monitoring-tuiles">
            {MESURE_PARAMS.filter(p => String(derniereMesure[p.key] || '').trim()).map(p => (
              <div key={p.key} className="monitoring-tuile">
                <span className="monitoring-tuile-valeur">{derniereMesure[p.key]}</span>
                <span className="monitoring-tuile-label">{p.court}</span>
              </div>
            ))}
            {!MESURE_PARAMS.some(p => String(derniereMesure[p.key] || '').trim()) && (
              <p className="examen-aide">{t('Aucune valeur saisie pour cette mesure.')}</p>
            )}
          </div>
        ) : (
          <p className="examen-aide">{t('Ajoutez une première mesure pour démarrer le suivi.')}</p>
        )}
      </div>

      {/* Médications */}
      {form.medications.length > 0 && (
        <div className="examen-sections" style={{ marginBottom: 12 }}>
          <div className={`examen-section ${!medsReplies ? 'ouvert' : ''}`}>
            <button className="examen-section-header" onClick={() => setMedsReplies(v => !v)}>
              <span className="examen-section-pastille partiel"><i className="ti ti-pill"></i></span>
              <span className="examen-section-textes">
                <span className="examen-section-titre">{t('Médications préparées')}</span>
                <span className="examen-section-resume">{tn(medsAdministresCount, '{n} administré sur {total}', '{n} administrés sur {total}', { total: form.medications.length })}</span>
              </span>
              <i className={`ti ti-chevron-${medsReplies ? 'down' : 'up'} examen-section-chevron`}></i>
            </button>
            {!medsReplies && (
              <div className="examen-section-contenu">
                {CATEGORIES_MED.map(cat => {
                  const meds = form.medications.filter(m => m.categorie === cat)
                  if (!meds.length) return null
                  return (
                    <div key={cat}>
                      <p className="monitoring-categorie">{t(cat)}</p>
                      {meds.map(m => {
                        const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
                        return (
                          <div key={m.id} className="monitoring-med-resume">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                              <span className="monitoring-med-resume-nom">{m.nom}</span>
                              <div className="toggle-groupe" style={{ flexShrink: 0 }}>
                                <button type="button" className={`toggle-btn ${m.administre ? 'actif' : ''}`} onClick={() => toggleAdministreMedication(m.id, true)}>{t('Oui')}</button>
                                <button type="button" className={`toggle-btn ${!m.administre ? 'actif' : ''}`} onClick={() => toggleAdministreMedication(m.id, false)}>{t('Non')}</button>
                              </div>
                            </div>
                            <span className="monitoring-med-resume-detail">
                              {m.concentration || '—'} mg/mL · {m.doseMgKg || '—'} mg/kg{doseMg != null ? ` (${doseMg.toFixed(2)} mg)` : ''} ·{' '}
                              {volume != null
                                ? <strong style={{ fontSize: 15, color: 'var(--primary)', fontWeight: 700 }}>{volume.toFixed(2)} mL</strong>
                                : '—'}
                              {m.voie ? ' · ' + m.voie : ''}
                            </span>
                            {m.administre && (
                              <div className="form-groupe" style={{ marginTop: 6 }}>
                                <label className="form-label">{t('Administré à')}</label>
                                <input type="time" className="form-input" value={m.heureAdministration || heureActuelle()} onChange={e => modifierMedication(m.id, 'heureAdministration', e.target.value)} />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tableau de suivi */}
      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-table"></i>
          </div>
          <h2 className="postop-section-titre">{t('Suivi des paramètres ({n})', { n: form.mesures.length })}</h2>
        </div>
        <div style={{ padding: '16px' }}>
          {aucuneMesure ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>{t('Aucune mesure ajoutée pour le moment.')}</p>
          ) : (
            <div className="monitoring-table-wrap monitoring-table-wrap--fige">
              <table className="monitoring-table monitoring-table--suivi monitoring-table--fige">
                <thead>
                  <tr>
                    <th>{t('Paramètre')}</th>
                    {form.mesures.map((m, j) => (
                      <th key={j}>
                        {m.heure}
                        <button className="examen-historique-supprimer" style={{ marginLeft: 4 }} onClick={() => ouvrirEditionMesure(j)}>
                          <i className="ti ti-pencil"></i>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MESURE_PARAMS.map(p => (
                    <tr key={p.key}>
                      <td>{p.label}</td>
                      {form.mesures.map((m, j) => <td key={j}>{m[p.key] || '—'}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <td>{t('Lubrifiant oculaire')}</td>
                    {form.mesures.map((m, j) => <td key={j}>{m.lubrifiantOculaire ? t('Oui') : t('Non')}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="labo-actions" style={{ padding: '0 0 16px' }}>
        <button className="btn-supprimer-medicament" style={{ width: '100%' }} onClick={ouvrirPopupFin}>
          <i className="ti ti-player-stop"></i> {t('Terminer l\'anesthésie')}
        </button>
      </div>

      {/* ═══ BARRE COLLANTE ═══ */}
      <div className="examen-barre">
        <div className="monitoring-chrono">
          <span className="monitoring-chrono-duree">
            <i className="ti ti-clock"></i>
            {t('Sous anesthésie depuis')} <strong>{formaterDuree(minutesAnesthesie)}</strong>
          </span>
          <span className={`monitoring-chrono-mesure ${mesureEnRetard || aucuneMesure ? 'retard' : ''}`}>
            {aucuneMesure
              ? t('Aucune mesure prise')
              : minutesDerniereMesure === 0
                ? t('Dernière mesure à l\'instant')
                : t('Dernière mesure il y a {n} min', { n: minutesDerniereMesure })}
          </span>
        </div>
        <button className="examen-barre-btn complet" onClick={ouvrirPopupMesure}>
          <i className="ti ti-plus"></i> {t('Mesure')}
        </button>
      </div>

      {/* Popup ajouter / modifier mesure */}
      {popupMesure && (
        <div className="popup-overlay" onClick={() => { setPopupMesure(null); setEditMesureIndex(null) }}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{editMesureIndex !== null ? t('Modifier la mesure') : t('Nouvelle mesure')}</span>
              <button className="popup-close" onClick={() => { setPopupMesure(null); setEditMesureIndex(null) }}>✕</button>
            </div>

            <div className="form-scroll" style={{ gap: 12 }}>
              <div className="form-groupe">
                <label className="form-label">{t('Heure')}</label>
                <input type="time" className="form-input" value={popupMesure.heure} onChange={e => setPopupMesure(prev => ({ ...prev, heure: e.target.value }))} />
              </div>

              {CLES_ESSENTIELLES.map(cle => {
                const p = MESURE_PARAMS.find(x => x.key === cle)
                const precedent = valeurPrecedente(cle)
                return (
                  <div key={cle} className="form-groupe">
                    <label className="form-label">{p.label}</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      value={popupMesure[cle] || ''}
                      onChange={e => setPopupMesure(prev => ({ ...prev, [cle]: e.target.value.replace(',', '.') }))}
                    />
                    {precedent && (
                      <button
                        type="button"
                        className="monitoring-precedent"
                        onClick={() => setPopupMesure(prev => ({ ...prev, [cle]: precedent }))}
                      >
                        Précédent : {precedent} <i className="ti ti-arrow-back-up"></i>
                      </button>
                    )}
                  </div>
                )
              })}

              <button className="monitoring-complementaires" onClick={() => setComplementairesOuverts(v => !v)}>
                <span>{t('Paramètres complémentaires')}</span>
                <i className={`ti ti-chevron-${complementairesOuverts ? 'up' : 'down'}`}></i>
              </button>

              {complementairesOuverts && CLES_COMPLEMENTAIRES.map(cle => {
                const p = MESURE_PARAMS.find(x => x.key === cle)
                const precedent = valeurPrecedente(cle)
                return (
                  <div key={cle} className="form-groupe">
                    <label className="form-label">{p.label}</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      value={popupMesure[cle] || ''}
                      onChange={e => setPopupMesure(prev => ({ ...prev, [cle]: e.target.value.replace(',', '.') }))}
                    />
                    {precedent && (
                      <button
                        type="button"
                        className="monitoring-precedent"
                        onClick={() => setPopupMesure(prev => ({ ...prev, [cle]: precedent }))}
                      >
                        Précédent : {precedent} <i className="ti ti-arrow-back-up"></i>
                      </button>
                    )}
                  </div>
                )
              })}

              <label className="voie-item">
                <span>{t('Lubrifiant oculaire')}</span>
                <input type="checkbox" checked={popupMesure.lubrifiantOculaire || false} onChange={e => setPopupMesure(prev => ({ ...prev, lubrifiantOculaire: e.target.checked }))} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {editMesureIndex !== null && (
                <button className="btn-supprimer-medicament" style={{ flex: 1, marginTop: 0 }} onClick={() => supprimerMesure(editMesureIndex)}>
                  {t('Supprimer')}
                </button>
              )}
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={ajouterMesure}>
                {editMesureIndex !== null ? t('Enregistrer') : t('Ajouter')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup fin d'anesthésie */}
      {popupFin && (
        <div className="popup-overlay" onClick={() => setPopupFin(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t('Terminer l\'anesthésie')}</span>
              <button className="popup-close" onClick={() => setPopupFin(false)}>✕</button>
            </div>
            <div className="form-scroll" style={{ gap: 12 }}>
              <div className="form-groupe">
                <label className="form-label">{t('Heure de fin')}</label>
                <input type="time" className="form-input" value={form.heureFin} onChange={e => modifierChamp('heureFin', e.target.value)} />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('Notes')}</label>
                <textarea className="form-textarea" rows={3} value={form.notesFin} onChange={e => modifierChamp('notesFin', e.target.value)} placeholder={t('Observations sur la fin de l\'anesthésie...')} />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('Heure d\'extubation')}</label>
                <input type="time" className="form-input" value={form.extubationHeure} onChange={e => modifierChamp('extubationHeure', e.target.value)} />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('État à l\'extubation')}</label>
                <input type="text" className="form-input" value={form.extubationEtat} onChange={e => modifierChamp('extubationEtat', e.target.value)} placeholder={t('Ex. : Réflexe de déglutition présent')} />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('Température (récupération)')}</label>
                <input type="text" inputMode="decimal" className="form-input" value={form.postTemp} onChange={e => modifierChamp('postTemp', e.target.value)} placeholder="°C" />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('FC (récupération)')}</label>
                <input type="text" inputMode="numeric" className="form-input" value={form.postFc} onChange={e => modifierChamp('postFc', e.target.value)} placeholder="bpm" />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('FR (récupération)')}</label>
                <input type="text" inputMode="numeric" className="form-input" value={form.postFr} onChange={e => modifierChamp('postFr', e.target.value)} placeholder="rpm" />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('TRC (récupération)')}</label>
                <input type="text" inputMode="decimal" className="form-input" value={form.postTrc} onChange={e => modifierChamp('postTrc', e.target.value)} placeholder="sec" />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('Douleur')}</label>
                <input type="text" className="form-input" value={form.postDouleur} onChange={e => modifierChamp('postDouleur', e.target.value)} placeholder={t('Évaluation de la douleur')} />
              </div>
              <div className="form-groupe">
                <label className="form-label">{t('Autres commentaires')}</label>
                <textarea className="form-textarea" rows={2} value={form.postCommentaires} onChange={e => modifierChamp('postCommentaires', e.target.value)} />
              </div>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={terminerAnesthesie}>
              {t('Terminé')}
            </button>
          </div>
        </div>
      )}

      {/* Popup rapport final */}
      {showResume && (
        <div className="popup-overlay" onClick={fermerResume}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t('Rapport de monitoring')}</span>
              <button className="popup-close" onClick={fermerResume}>✕</button>
            </div>
            <textarea
              className="form-textarea"
              style={{ width: '100%', minHeight: 320, fontFamily: 'monospace', fontSize: 12 }}
              value={showResume}
              readOnly
            />
            <div className="popup-actions-centrees" style={{ marginTop: 12 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => copierResume(showResume)}>
                {copie ? t('Copié !') : t('Copier')}
              </button>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => genererPDF(form)}>
                <i className="ti ti-file-download"></i> PDF
              </button>
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={fermerResume}>
                {t('Terminer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
