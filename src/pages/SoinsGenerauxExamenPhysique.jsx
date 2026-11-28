import { useState, useEffect, useContext, useMemo, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { TitreContext } from '../context/NavigationContext'
import { useProfil } from '../context/ProfilContext'
import {
  COULEUR_PRIMAIRE, creerDocument, bandeauPatient, sectionGrille,
  titreSection, tableau, finaliser, ouvrir,
} from '../lib/pdfadjuvet'
import SelecteurEspece from '../components/SelecteurEspece'
import { t, tn, enAnglais, locale, decimal } from '../lib/i18n'

/* ─── SYSTÈMES, DANS L'ORDRE DE L'EXAMEN ───────────────── */
const SYSTEMES = [
  {
    id: 'yeux', titre: t('Yeux'), icone: '/examen-yeux.png',
    constats: ['Écoulement ou infection', 'Inflammation', 'Opacité du cristallin', 'Problème de vision', 'Déformation des paupières'],
  },
  {
    id: 'oreilles', titre: t('Oreilles'), icone: '/examen-oreilles.png',
    constats: ['Écoulement ou infection', 'Cérumen', 'Démangeaisons', 'Mites', 'Enflure', 'Odeur'],
  },
  {
    id: 'nez-gorge', titre: t('Nez et gorge'), icone: '/examen-respiratoire.png',
    constats: ['Écoulement nasal', 'Ganglions ou amygdales enflammés'],
  },
  {
    id: 'buccal', titre: t('Cavité buccale et muqueuses'), icone: '/examen-muqueuses.png',
    constats: ['Gingivite', 'Tartre', 'Dent brisée', 'Dent retenue', 'Dent mobile', 'Muqueuses pâles', 'Muqueuses ictériques', 'Muqueuses cyanosées', 'Muqueuses sèches', 'Halitose'],
  },
  {
    id: 'tegumentaire', titre: t('Tégumentaire'), icone: '/examen-tegumentaire.png',
    constats: ['Poil terne', 'Gras', 'Sec ou squameux', 'Emmêlé', 'Alopécie', 'Pustules', 'Rougeur ou inflammation', 'Masse', 'Puces', 'Autres parasites', 'Plaie', 'Pli cutané persistant'],
  },
  {
    id: 'lymphatique', titre: t('Système lymphatique'), icone: '/examen-lymphatique.png',
    constats: ['Ganglion augmenté', 'Consistance anormale', 'Douleur à la palpation'],
  },
  {
    id: 'cardiovasculaire', titre: t('Cardiovasculaire'), icone: '/examen-cardiovasculaire.png',
    constats: ['Souffle', 'Arythmie', 'Pouls faible', 'Pouls irrégulier', 'Déficit de pouls', 'TRC supérieur à 2 s', "Intolérance à l'effort"],
  },
  {
    id: 'respiratoire', titre: t('Respiratoire'), icone: '/examen-respiratoire.png',
    constats: ['Toux', 'Éternuements', 'Respiration rapide', 'Difficulté respiratoire', 'Bruits anormaux'],
  },
  {
    id: 'digestif', titre: t('Digestif'), icone: '/examen-digestif.png',
    constats: ['Vomissements ou régurgitation', 'Diarrhée', 'Constipation', 'Selles anormales', 'Sacs anaux', 'Douleur abdominale', 'Abdomen tendu', 'Abdomen distendu'],
  },
  {
    id: 'genito-urinaire', titre: t('Génito-urinaire'), icone: '/examen-genito-urinaire.png',
    constats: ['Écoulement vulvaire ou préputial', 'Testicules anormaux', 'Gestation', 'Lactation', 'Miction anormale'],
  },
  {
    id: 'musculosquelettique', titre: t('Musculosquelettique'), icone: '/examen-musculosquelettique.png',
    constats: ['Boiterie', 'Douleur ou enflure articulaire', 'Faiblesse', 'Atrophie musculaire', 'Démarche anormale', 'Ongles à tailler'],
  },
  {
    id: 'nerveux', titre: t('Système nerveux'), icone: '/examen-nerveux.png',
    constats: ['Tremblements', 'Convulsions', 'Mouvements anormaux', 'Ataxie', 'Réflexes diminués', "Changement d'état mental"],
  },
]

/* Les constats et les choix (attitude, appétit...) sont enregistrés
   en français dans l'examen et traduits à l'affichage avec t() :
   un examen commencé dans une langue se relit dans l'autre. */

/* ─── PLAGES PHYSIOLOGIQUES ─────────────────────────────
   Chien et chat seulement. Pour les autres espèces, aucun
   repère n'est affiché. Chat : température et fréquence
   respiratoire selon le Merck Veterinary Manual.          */
const PLAGES = {
  chien: {
    temperature: [38.3, 39.2],
    freqCardiaque: [70, 120],
    freqRespiratoire: [18, 34],
  },
  chat: {
    temperature: [38.1, 39.2],
    freqCardiaque: [110, 200],
    freqRespiratoire: [16, 40],
  },
}

const NOTE_PLAGE = {
  freqCardiaque: t('La plage varie selon le format de l\'animal.'),
}

const ATTITUDE_OPTIONS = ['Alerte et réactif', 'Calme et réactif', 'Abattu (léthargique)']
const ENERGIE_OPTIONS = ['Normal', 'Diminué', 'Augmenté']
const COMPORTEMENT_OPTIONS = ['Calme', 'Craintif / anxieux', 'Agressif', 'Agité / excité']
const APPETIT_OPTIONS = ['Normal', 'Diminué', 'Augmenté']
const SOIF_OPTIONS = ['Normale', 'Diminuée', 'Augmentée']
const EXERCICE_OPTIONS = ['Normal', 'Diminué', 'Augmenté']
const MUSCLE_OPTIONS = ['Normale', 'Perte légère', 'Perte modérée', 'Perte sévère']

/* Score de condition corporelle sur 9 */
const BCS_LIBELLES = {
  1: t('Cachectique'), 2: t('Très maigre'), 3: t('Maigre'),
  4: t('Sous le poids idéal'), 5: t('Idéale'),
  6: t('Léger surpoids'), 7: t('Surpoids'),
  8: t('Obèse'), 9: t('Obésité sévère'),
}
const BCS_ANCIEN = { 'Maigre': 3, 'Idéale': 5, 'Surpoids': 7, 'Obèse': 9 }

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
  { id: 'cobaye',       label: t("Cochon d'Inde"),      icone: '/icone-cobaye.png' },
  { id: 'herisson',     label: t('Hérisson'),           icone: '/icone-herisson.png' },
]

function etatInitial() {
  return {
    animalNom: '',
    espece: '',
    race: '',
    sexe: '',
    sterilise: false,
    poids: '',
    poidsUnite: 'kg',
    raisonVisite: '',
    temperature: '',
    freqCardiaque: '',
    freqRespiratoire: '',
    attitude: '',
    niveauEnergie: '',
    conditionCorporelle: '',
    comportement: '',
    systemes: SYSTEMES.reduce((acc, s) => ({ ...acc, [s.id]: { constats: [], note: '' } }), {}),
    anamnese: { appetit: '', soif: '', exercice: '', diete: '', gateries: '', commentaires: '' },
    complements: {
      vaccination: '', parasitaire: '', micropuce: false, scoreMusculaire: '',
      pressionArterielle: '', analyseUrine: '', autresDiagnostics: '',
    },
  }
}

/* ─── MIGRATION DES ANCIENS EXAMENS ─────────────────────
   Ancien format : systemes[id] = { normal, note }, muqueuses
   comme système distinct, condition corporelle en texte.   */
function normaliserDonnees(donnees) {
  const base = etatInitial()
  if (!donnees) return base

  const systemes = { ...base.systemes }
  SYSTEMES.forEach(s => {
    const ancienId = s.id === 'buccal' ? 'muqueuses' : s.id
    const src = donnees.systemes?.[s.id] || donnees.systemes?.[ancienId]
    if (!src) return
    if (Array.isArray(src.constats)) {
      systemes[s.id] = { constats: src.constats, note: src.note || '' }
    } else {
      systemes[s.id] = {
        constats: src.normal ? ['Normal'] : (src.note?.trim() ? ['Autre'] : []),
        note: src.note || '',
      }
    }
  })

  let bcs = donnees.conditionCorporelle
  if (typeof bcs === 'string' && bcs !== '') bcs = BCS_ANCIEN[bcs] || ''

  return {
    ...base,
    ...donnees,
    conditionCorporelle: bcs || '',
    systemes,
    anamnese: {
      ...base.anamnese,
      ...(donnees.anamnese || {}),
      commentaires: donnees.anamnese?.commentaires || donnees.commentairesProprietaire || '',
    },
    complements: { ...base.complements, ...(donnees.complements || {}) },
  }
}

const MAX_HISTORIQUE = 30

/* ─── SOUS-COMPOSANTS ───────────────────────────────────── */

/* Le conteneur qui défile n'est pas toujours la fenêtre : on le
   cherche, puis on retranche la hauteur du header collant pour que
   le bloc arrive juste en dessous et non derrière. */
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
          {etat === 'complet'
            ? <i className="ti ti-check"></i>
            : <i className={`ti ${icone}`}></i>}
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

function LigneSysteme({ systeme, valeur, ouvert, evalue, onOuvrir, onConstat, onNote }) {
  const resume = useMemo(() => {
    const anomalies = valeur.constats.filter(c => c !== 'Normal' && c !== 'Autre')
    if (valeur.constats.includes('Normal')) {
      return valeur.note.trim() ? t('Normal, avec note') : t('Normal')
    }
    if (anomalies.length) return anomalies.map(c => t(c)).join(', ')
    if (valeur.note.trim()) return valeur.note.trim()
    return ''
  }, [valeur])

  if (!ouvert) {
    return (
      <button className={`examen-ligne ${evalue ? 'evalue' : ''}`} onClick={onOuvrir}>
        <span className={`examen-ligne-pastille ${evalue ? (valeur.constats.includes('Normal') ? 'normal' : 'anormal') : ''}`}>
          {evalue && <i className={`ti ti-${valeur.constats.includes('Normal') ? 'check' : 'point'}`}></i>}
        </span>
        <span className="examen-ligne-textes">
          <span className="examen-ligne-titre">{systeme.titre}</span>
          {resume && <span className="examen-ligne-resume">{resume}</span>}
        </span>
        <i className="ti ti-chevron-down examen-ligne-chevron"></i>
      </button>
    )
  }

  return (
    <div className="examen-ligne-ouverte">
      <div className="examen-ligne-entete">
        <img src={systeme.icone} alt="" className="examen-systeme-icone" />
        <span className="examen-ligne-titre">{systeme.titre}</span>
      </div>

      <div className="examen-constats">
        <button
          className={`examen-constat normal ${valeur.constats.includes('Normal') ? 'actif' : ''}`}
          onClick={() => onConstat('Normal')}
        >
          {t('Normal')}
        </button>
        {systeme.constats.map(c => (
          <button
            key={c}
            className={`examen-constat ${valeur.constats.includes(c) ? 'actif' : ''}`}
            onClick={() => onConstat(c)}
          >
            {t(c)}
          </button>
        ))}
        <button
          className={`examen-constat ${valeur.constats.includes('Autre') ? 'actif' : ''}`}
          onClick={() => onConstat('Autre')}
        >
          {t('Autre')}
        </button>
      </div>

      {valeur.constats.includes('Autre') && (
        <textarea
          className="form-textarea"
          rows={2}
          placeholder={t('Préciser...')}
          value={valeur.note}
          onChange={e => onNote(e.target.value)}
        />
      )}
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────── */

export default function SoinsGenerauxExamenPhysique() {
  const [vue, setVue] = useState('liste')
  const [form, setForm] = useState(etatInitial())
  const [currentId, setCurrentId] = useState(null)
  const [historique, setHistorique] = useState([])
  // Incrémenté pour recharger l'historique (après un enregistrement).
  const [versionHistorique, setVersionHistorique] = useState(0)
  const [itemConsulte, setItemConsulte] = useState(null)
  const [showResume, setShowResume] = useState(null)
  const [showIncomplet, setShowIncomplet] = useState(false)
  const [showReinit, setShowReinit] = useState(false)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)
  const [copie, setCopie] = useState(false)
  const [showModifs, setShowModifs] = useState(false)
  const [popupEspece, setPopupEspece] = useState(false)
  const [rechercheHistorique, setRechercheHistorique] = useState('')
  const [joursOuverts, setJoursOuverts] = useState(() => new Set())
  const [sectionOuverte, setSectionOuverte] = useState('identification')
  const [systemeOuvert, setSystemeOuvert] = useState(null)
  const [scrollCible, setScrollCible] = useState(null)
  const [clinique, setClinique] = useState({ nom: '', logo: '' })
  const [sauvegarde, setSauvegarde] = useState('idle') // 'idle' | 'encours' | 'ok'
  const { setTitreCustom } = useContext(TitreContext)
  const { estEquipe, teamId } = useProfil()

  const premierRendu = useRef(true)

  useEffect(() => {
    setTitreCustom(vue === 'formulaire' ? (currentId ? t("Modifier l'examen") : t('Nouvel examen')) : t('Démarrer un examen'))
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
    if (!currentId || vue !== 'formulaire') return
    if (premierRendu.current) { premierRendu.current = false; return }
    setSauvegarde('encours')
    const t = setTimeout(() => {
      supabase
        .from('examens_physiques')
        .update({ animal_nom: form.animalNom || t('Sans nom'), donnees: form, updated_at: new Date().toISOString() })
        .eq('id', currentId)
        .then(() => {
          setSauvegarde('ok')
          setVersionHistorique(v => v + 1)
        })
    }, 800)
    return () => clearTimeout(t)
  }, [form, currentId, vue])

  const date = new Date()
  const dateAffichee = date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  /* Rechargé à l'ouverture, quand le profil arrive (clinique) et à
     chaque nouvelle version ; « actif » écarte une réponse périmée. */
  useEffect(() => {
    let actif = true
    async function chargerHistorique() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const query = supabase.from('examens_physiques').select('*').order('created_at', { ascending: false })
      const { data } = estEquipe && teamId
        ? await query.eq('equipe_id', teamId)
        : await query.eq('user_id', user.id)
      if (actif) setHistorique(data || [])
    }
    chargerHistorique()
    return () => { actif = false }
  }, [estEquipe, teamId, versionHistorique])

  /* Nom et logo de la clinique, pour l'entête des PDF */
  useEffect(() => {
    if (!estEquipe || !teamId) return
    supabase
      .from('equipes')
      .select('nom, logo_url')
      .eq('id', teamId)
      .single()
      .then(({ data }) => setClinique({ nom: data?.nom || '', logo: data?.logo_url || '' }))
  }, [estEquipe, teamId])

  function modifierChamp(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  function modifierAnamnese(champ, valeur) {
    setForm(prev => ({ ...prev, anamnese: { ...prev.anamnese, [champ]: valeur } }))
  }

  function modifierComplement(champ, valeur) {
    setForm(prev => ({ ...prev, complements: { ...prev.complements, [champ]: valeur } }))
  }

  /* ─── Systèmes ───────────────────────────────────────── */
  function toggleConstat(systemeId, constat) {
    setForm(prev => {
      const actuel = prev.systemes[systemeId]
      let constats

      if (constat === 'Normal') {
        if (actuel.constats.includes('Normal')) {
          constats = actuel.constats.filter(c => c !== 'Normal')
        } else {
          constats = ['Normal', ...(actuel.constats.includes('Autre') ? ['Autre'] : [])]
        }
      } else if (constat === 'Autre') {
        constats = actuel.constats.includes('Autre')
          ? actuel.constats.filter(c => c !== 'Autre')
          : [...actuel.constats, 'Autre']
      } else {
        const sansNormal = actuel.constats.filter(c => c !== 'Normal')
        constats = sansNormal.includes(constat)
          ? sansNormal.filter(c => c !== constat)
          : [...sansNormal, constat]
      }

      return { ...prev, systemes: { ...prev.systemes, [systemeId]: { ...actuel, constats } } }
    })

    // Normal sans précision : on replie et on passe au suivant
    if (constat === 'Normal') {
      const actuel = form.systemes[systemeId]
      if (!actuel.constats.includes('Normal') && !actuel.constats.includes('Autre')) {
        const index = SYSTEMES.findIndex(s => s.id === systemeId)
        const suivant = SYSTEMES.slice(index + 1).find(s => !estEvalue(form.systemes[s.id]))
        setSystemeOuvert(suivant ? suivant.id : null)
      }
    }
  }

  function modifierNote(systemeId, note) {
    setForm(prev => ({
      ...prev,
      systemes: { ...prev.systemes, [systemeId]: { ...prev.systemes[systemeId], note } },
    }))
  }

  function estEvalue(valeur) {
    if (!valeur) return false
    const anomalies = valeur.constats.filter(c => c !== 'Normal' && c !== 'Autre')
    if (valeur.constats.includes('Normal')) return true
    if (anomalies.length > 0) return true
    if (valeur.constats.includes('Autre') && valeur.note.trim()) return true
    return false
  }

  /* ─── Complétude ─────────────────────────────────────── */
  const manquants = useMemo(() => {
    const liste = []
    if (!form.animalNom.trim()) liste.push({ section: 'identification', label: t("Nom de l'animal") })
    if (!form.espece) liste.push({ section: 'identification', label: t('Espèce') })
    if (!form.temperature) liste.push({ section: 'vitaux', label: t('Température') })
    if (!form.freqCardiaque) liste.push({ section: 'vitaux', label: t('Fréquence cardiaque') })
    if (!form.freqRespiratoire) liste.push({ section: 'vitaux', label: t('Fréquence respiratoire') })
    if (!form.attitude) liste.push({ section: 'general', label: t('Attitude générale') })
    if (!form.niveauEnergie) liste.push({ section: 'general', label: t("Niveau d'énergie") })
    if (!form.conditionCorporelle) liste.push({ section: 'general', label: t('Condition corporelle') })
    if (!form.comportement) liste.push({ section: 'general', label: t('Comportement') })
    const nonEvalues = SYSTEMES.filter(s => !estEvalue(form.systemes[s.id]))
    if (nonEvalues.length) {
      liste.push({
        section: 'systemes',
        label: tn(nonEvalues.length, '{n} système non évalué ({liste})', '{n} systèmes non évalués ({liste})', { liste: nonEvalues.map(s => s.titre).join(', ') }),
      })
    }
    return liste
  }, [form])

  const totalRequis = 9 + SYSTEMES.length
  const nbComplets = useMemo(() => {
    let n = 0
    if (form.animalNom.trim()) n++
    if (form.espece) n++
    if (form.temperature) n++
    if (form.freqCardiaque) n++
    if (form.freqRespiratoire) n++
    if (form.attitude) n++
    if (form.niveauEnergie) n++
    if (form.conditionCorporelle) n++
    if (form.comportement) n++
    n += SYSTEMES.filter(s => estEvalue(form.systemes[s.id])).length
    return n
  }, [form])

  function etatSection(id) {
    switch (id) {
      case 'identification': {
        const total = 2
        const faits = (form.animalNom.trim() ? 1 : 0) + (form.espece ? 1 : 0)
        return faits === total ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'vitaux': {
        const faits = [form.temperature, form.freqCardiaque, form.freqRespiratoire].filter(Boolean).length
        return faits === 3 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'general': {
        const faits = [form.attitude, form.niveauEnergie, form.conditionCorporelle, form.comportement].filter(Boolean).length
        return faits === 4 ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'systemes': {
        const faits = SYSTEMES.filter(s => estEvalue(form.systemes[s.id])).length
        return faits === SYSTEMES.length ? 'complet' : faits > 0 ? 'partiel' : 'vide'
      }
      case 'anamnese': {
        const a = form.anamnese
        const rempli = [a.appetit, a.soif, a.exercice, a.diete, a.gateries, a.commentaires].some(v => String(v || '').trim())
        return rempli ? 'complet' : 'vide'
      }
      case 'complements': {
        const c = form.complements
        const rempli = c.micropuce || [c.vaccination, c.parasitaire, c.scoreMusculaire, c.pressionArterielle, c.analyseUrine, c.autresDiagnostics].some(v => String(v || '').trim())
        return rempli ? 'complet' : 'vide'
      }
      default:
        return 'vide'
    }
  }

  function resumeSection(id) {
    switch (id) {
      case 'identification': {
        const esp = ESPECES.find(e => e.id === form.espece)?.label
        const bouts = [form.animalNom.trim(), esp, form.poids ? `${form.poids} ${form.poidsUnite}` : null].filter(Boolean)
        return bouts.join(' · ')
      }
      case 'vitaux': {
        const bouts = [
          form.temperature ? `${form.temperature} °C` : null,
          form.freqCardiaque ? `${form.freqCardiaque} bpm` : null,
          form.freqRespiratoire ? `${form.freqRespiratoire} ${t('rpm')}` : null,
        ].filter(Boolean)
        return bouts.join(' · ')
      }
      case 'general': {
        const faits = [form.attitude, form.niveauEnergie, form.conditionCorporelle, form.comportement].filter(Boolean).length
        return faits === 4 ? t('Complété') : t('{n} sur {total}', { n: faits, total: 4 })
      }
      case 'systemes': {
        const faits = SYSTEMES.filter(s => estEvalue(form.systemes[s.id])).length
        const anormaux = SYSTEMES.filter(s => {
          const v = form.systemes[s.id]
          return estEvalue(v) && !v.constats.includes('Normal')
        }).length
        const compte = t('{n} sur {total}', { n: faits, total: SYSTEMES.length })
        if (faits === 0) return compte
        return anormaux ? `${compte}, ${tn(anormaux, '{n} anormal', '{n} anormaux')}` : compte
      }
      case 'anamnese':
        return etatSection('anamnese') === 'complet' ? t('Renseignée') : t('Facultatif')
      case 'complements':
        return etatSection('complements') === 'complet' ? t('Renseignés') : t('Facultatif')
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
    setShowIncomplet(false)
    setSectionOuverte(sectionId)
    if (sectionId === 'systemes') {
      const premier = SYSTEMES.find(s => !estEvalue(form.systemes[s.id]))
      setSystemeOuvert(premier ? premier.id : null)
    }
    setScrollCible(sectionId)
  }

  /* ─── Plages physiologiques ──────────────────────────── */
  function infoPlage(champ) {
    const plage = PLAGES[form.espece]?.[champ]
    if (!plage) return null
    const valeur = parseFloat(String(form[champ]).replace(',', '.'))
    const horsPlage = isFinite(valeur) && (valeur < plage[0] || valeur > plage[1])
    return { plage, horsPlage }
  }

  /* ─── Cycle de vie de l'examen ───────────────────────── */
  async function commencerNouvelExamen() {
    const nouveauForm = etatInitial()
    premierRendu.current = true
    setForm(nouveauForm)
    setCurrentId(null)
    setSectionOuverte('identification')
    setSystemeOuvert(null)
    setSauvegarde('idle')
    setVue('formulaire')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (historique.length >= MAX_HISTORIQUE) {
      const aSupprimer = [...historique]
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, historique.length - MAX_HISTORIQUE + 1)
      for (const item of aSupprimer) {
        await supabase.from('examens_physiques').delete().eq('id', item.id)
      }
    }
    const payload = { user_id: user.id, animal_nom: t('Sans nom'), resume: '', donnees: nouveauForm }
    if (estEquipe && teamId) payload.equipe_id = teamId
    const { data } = await supabase.from('examens_physiques').insert(payload).select().single()
    if (data) {
      setCurrentId(data.id)
      setVersionHistorique(v => v + 1)
    }
  }

  function genererResume() {
    const lignes = []
    // « Animal : Max » en français, « Patient: Max » en anglais.
    const deux = enAnglais ? ': ' : ' : '
    const ligne = (libelle, valeur, prefixe = '') => lignes.push(`${prefixe}${t(libelle)}${deux}${valeur}`)
    const titre = libelle => lignes.push(`${t(libelle)}${enAnglais ? ':' : ' :'}`)
    const choix = v => (v ? t(v) : '—')
    const especeLabel = ESPECES.find(e => e.id === form.espece)?.label
    lignes.push(t('EXAMEN PHYSIQUE - PRÉCONSULTATION'))
    ligne('Animal', form.animalNom || '—')
    ligne('Espèce', especeLabel || '—')
    ligne('Race', form.race?.trim() || '—')
    ligne('Sexe', `${form.sexe === 'femelle' ? t('Femelle') : form.sexe === 'male' ? t('Mâle') : '—'}${form.sexe && form.sterilise ? ` (${t('stérilisé(e)')})` : ''}`)
    ligne('Poids', form.poids ? form.poids + ' ' + (form.poidsUnite || 'kg') : '—')
    ligne('Date', dateAffichee)
    ligne('Raison de la visite', form.raisonVisite?.trim() || '—')
    lignes.push('')
    titre('Anamnèse')
    ligne('Appétit', choix(form.anamnese.appetit), '- ')
    ligne('Soif', choix(form.anamnese.soif), '- ')
    ligne('Exercice', choix(form.anamnese.exercice), '- ')
    ligne('Diète', form.anamnese.diete?.trim() || '—', '- ')
    ligne('Gâteries', form.anamnese.gateries?.trim() || '—', '- ')
    lignes.push('')
    titre('Commentaires du propriétaire')
    lignes.push(form.anamnese.commentaires?.trim() || '—')
    lignes.push('')
    titre('Paramètres vitaux')
    ligne('Température', form.temperature ? form.temperature + ' °C' : '—', '- ')
    ligne('Fréquence cardiaque', form.freqCardiaque ? form.freqCardiaque + ' bpm' : '—', '- ')
    ligne('Fréquence respiratoire', form.freqRespiratoire ? form.freqRespiratoire + ' ' + t('rpm') : '—', '- ')
    lignes.push('')
    titre('État général')
    ligne('Attitude générale', choix(form.attitude), '- ')
    ligne("Niveau d'énergie", choix(form.niveauEnergie), '- ')
    ligne('Condition corporelle', form.conditionCorporelle ? `${form.conditionCorporelle}/9 (${BCS_LIBELLES[form.conditionCorporelle]})` : '—', '- ')
    ligne('Comportement', choix(form.comportement), '- ')
    lignes.push('')
    titre('Observation par système')
    SYSTEMES.forEach(s => {
      lignes.push(`- ${s.titre}${deux}${texteSysteme(form.systemes[s.id])}`)
    })

    const c = form.complements
    const aDesComplements = c.micropuce || [c.vaccination, c.parasitaire, c.scoreMusculaire, c.pressionArterielle, c.analyseUrine, c.autresDiagnostics].some(v => String(v || '').trim())
    if (aDesComplements) {
      lignes.push('')
      titre('Compléments')
      if (c.vaccination?.trim()) ligne('Vaccination à prévoir', c.vaccination.trim(), '- ')
      if (c.parasitaire?.trim()) ligne('Contrôle parasitaire', c.parasitaire.trim(), '- ')
      if (c.micropuce) ligne('Micropuce vérifiée', t('oui'), '- ')
      if (c.scoreMusculaire) ligne('Condition musculaire', t(c.scoreMusculaire), '- ')
      if (c.pressionArterielle?.trim()) ligne('Pression artérielle', c.pressionArterielle.trim(), '- ')
      if (c.analyseUrine?.trim()) ligne("Analyse d'urine", c.analyseUrine.trim(), '- ')
      if (c.autresDiagnostics?.trim()) ligne('Autres diagnostics', c.autresDiagnostics.trim(), '- ')
    }

    return lignes.join('\n')
  }

  function texteSysteme(valeur) {
    if (!valeur) return '—'
    const anomalies = valeur.constats.filter(c => c !== 'Normal' && c !== 'Autre')
    const note = valeur.note?.trim()
    const liste = anomalies.map(c => t(c)).join(', ')
    if (valeur.constats.includes('Normal')) {
      return note ? t('Normal, avec note : {note}', { note }) : t('Normal')
    }
    if (anomalies.length) {
      return note ? `${liste}. ${note}` : liste
    }
    if (note) return note
    return '—'
  }

  // ─── PDF ──────────────────────
  async function genererPDF(donneesBrutes, dateTexte) {
    const dp = normaliserDonnees(donneesBrutes || form)
    const dateDoc = dateTexte || dateAffichee
    const especeLabel = ESPECES.find(e => e.id === dp.espece)?.label
    const bcs = dp.conditionCorporelle

    const ctx = await creerDocument({
      titre: t('Examen physique'),
      sousTitre: t('Préconsultation'),
      date: dateDoc,
      clinique: clinique.nom,
      logoClinique: clinique.logo,
    })

    const sexeTexte = dp.sexe === 'femelle' ? t('Femelle') : dp.sexe === 'male' ? t('Mâle') : null
    const poidsTexte = dp.poids ? `${dp.poids} ${dp.poidsUnite || 'kg'}` : null
    bandeauPatient(
      ctx,
      dp.animalNom || t('Animal'),
      [especeLabel, dp.race?.trim(), sexeTexte, poidsTexte, dp.raisonVisite?.trim()].filter(Boolean).join(' · ')
    )

    sectionGrille(ctx, t('Identification'), [
      [t('Espèce'), especeLabel],
      [t('Race'), dp.race],
      [t('Sexe'), sexeTexte ? `${sexeTexte}${dp.sterilise ? `, ${t('stérilisé(e)')}` : ''}` : null],
      [t('Poids'), poidsTexte],
      [t('Raison de la visite'), dp.raisonVisite],
      [t('Date'), dateDoc],
    ])

    const a = dp.anamnese || {}
    const choix = v => (v ? t(v) : v)
    sectionGrille(ctx, t('Anamnèse'), [
      [t('Appétit'), choix(a.appetit)],
      [t('Soif'), choix(a.soif)],
      [t('Exercice'), choix(a.exercice)],
      [t('Diète'), a.diete],
      [t('Gâteries'), a.gateries],
      [t('Commentaires'), a.commentaires],
    ])

    sectionGrille(ctx, t('Paramètres vitaux'), [
      [t('Température'), dp.temperature ? `${dp.temperature} °C` : null],
      [t('Fréq. cardiaque'), dp.freqCardiaque ? `${dp.freqCardiaque} bpm` : null],
      [t('Fréq. respiratoire'), dp.freqRespiratoire ? `${dp.freqRespiratoire} ${t('rpm')}` : null],
    ])

    sectionGrille(ctx, t('État général'), [
      [t('Attitude'), choix(dp.attitude)],
      [t("Niveau d'énergie"), choix(dp.niveauEnergie)],
      [t('Condition corporelle'), bcs ? `${bcs} / 9, ${BCS_LIBELLES[bcs]}` : null],
      [t('Comportement'), choix(dp.comportement)],
    ])

    const anormaux = SYSTEMES.filter(s => {
      const v = dp.systemes?.[s.id]
      return v && !(v.constats || []).includes('Normal') && texteSystemePdf(v) !== '—'
    }).length
    titreSection(
      ctx,
      t('Observation par système'),
      anormaux > 0 ? tn(anormaux, '{n} système avec anomalie', '{n} systèmes avec anomalie') : t('Aucune anomalie notée'),
      6 * 5.5 + 8
    )
    tableau(ctx, {
      head: [t('Système'), t('Observation')],
      body: SYSTEMES.map(s => [s.titre, texteSystemePdf(dp.systemes?.[s.id])]),
      columnStyles: {
        0: { cellWidth: 52, fontStyle: 'bold', textColor: COULEUR_PRIMAIRE },
        1: { cellWidth: 'auto' },
      },
    })

    const c = dp.complements || {}
    const aDesComplements = c.micropuce || [c.vaccination, c.parasitaire, c.scoreMusculaire, c.pressionArterielle, c.analyseUrine, c.autresDiagnostics].some(v => String(v || '').trim())
    if (aDesComplements) {
      sectionGrille(ctx, t('Compléments'), [
        [t('Vaccination'), c.vaccination],
        [t('Contrôle parasitaire'), c.parasitaire],
        [t('Micropuce'), c.micropuce ? t('Vérifiée') : t('Non vérifiée')],
        [t('Condition musculaire'), choix(c.scoreMusculaire)],
        [t('Pression artérielle'), c.pressionArterielle],
        [t("Analyse d'urine"), c.analyseUrine],
        [t('Autres diagnostics'), c.autresDiagnostics],
      ])
    }

    finaliser(ctx, { sujet: `${dp.animalNom || t('Animal')} · ${dateDoc}` })
    ouvrir(ctx)
  }

  function texteSystemePdf(valeur) {
    if (!valeur) return '—'
    const anomalies = (valeur.constats || []).filter(c => c !== 'Normal' && c !== 'Autre')
    const note = valeur.note?.trim()
    const liste = anomalies.map(c => t(c)).join(', ')
    if ((valeur.constats || []).includes('Normal')) return note ? t('Normal, avec note : {note}', { note }) : t('Normal')
    if (anomalies.length) return note ? `${liste}. ${note}` : liste
    if (note) return note
    return '—'
  }

  function handleTermine() {
    if (manquants.length > 0) {
      setShowIncomplet(true)
      return
    }
    finaliserExamen()
  }

  async function finaliserExamen() {
    setShowIncomplet(false)
    const texte = genererResume()
    await sauvegarder(texte)
    setShowResume(texte)
  }

  async function sauvegarder(texte) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profilFrais } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
    const nomUtilisateur = profilFrais?.nom || user.user_metadata?.nom || user.email || t('Membre')

    const maintenant = new Date().toISOString()
    const entreeModif = { nom: nomUtilisateur, timestamp: maintenant }

    if (currentId) {
      const { data: currentRec } = await supabase
        .from('examens_physiques').select('historique_modifs').eq('id', currentId).single()
      const modifs = [...(currentRec?.historique_modifs || []), entreeModif]
      await supabase
        .from('examens_physiques')
        .update({ animal_nom: form.animalNom || t('Sans nom'), resume: texte, donnees: form, updated_at: maintenant, historique_modifs: modifs })
        .eq('id', currentId)
    } else {
      if (historique.length >= MAX_HISTORIQUE) {
        const aSupprimer = [...historique]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .slice(0, historique.length - MAX_HISTORIQUE + 1)
        for (const item of aSupprimer) {
          await supabase.from('examens_physiques').delete().eq('id', item.id)
        }
      }
      const payload = { user_id: user.id, animal_nom: form.animalNom || t('Sans nom'), resume: texte, donnees: form, historique_modifs: [entreeModif] }
      if (estEquipe && teamId) payload.equipe_id = teamId
      const { data } = await supabase.from('examens_physiques').insert(payload).select().single()
      if (data) setCurrentId(data.id)
    }
    setVersionHistorique(v => v + 1)
  }

  function fermerResume() {
    setShowResume(null)
    setVue('liste')
    setItemConsulte(null)
  }

  function reinitialiser() {
    premierRendu.current = true
    setForm(etatInitial())
    setSectionOuverte('identification')
    setSystemeOuvert(null)
    setShowReinit(false)
  }

  function consulter(item) {
    setItemConsulte(item)
  }

  function modifier(item) {
    premierRendu.current = true
    setForm(normaliserDonnees(item.donnees))
    setCurrentId(item.id)
    setItemConsulte(null)
    setSectionOuverte('identification')
    setSystemeOuvert(null)
    setVue('formulaire')
  }

  async function supprimerHistorique(id) {
    await supabase.from('examens_physiques').delete().eq('id', id)
    setHistorique(prev => prev.filter(h => h.id !== id))
    setShowConfirmSupprimer(null)
    setItemConsulte(null)
  }

  function copierResume(texte) {
    navigator.clipboard.writeText(texte)
    setCopie(true)
    setTimeout(() => setCopie(false), 1500)
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

  const historiqueFiltre = useMemo(() => {
    const q = rechercheHistorique.trim().toLowerCase()
    if (!q) return historique
    return historique.filter(item => {
      const especeLabel = ESPECES.find(e => e.id === item.donnees?.espece)?.label || ''
      const champs = [item.animal_nom, especeLabel, item.donnees?.race, formaterDate(item.created_at)]
      return champs.some(c => (c || '').toLowerCase().includes(q))
    })
  }, [historique, rechercheHistorique])

  const groupesHistorique = useMemo(() => {
    const groupes = new Map()
    historique.forEach(item => {
      const cle = cleJour(item.created_at)
      if (!groupes.has(cle)) groupes.set(cle, [])
      groupes.get(cle).push(item)
    })
    return Array.from(groupes.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [historique])

  function toggleJour(cle) {
    setJoursOuverts(prev => {
      const next = new Set(prev)
      if (next.has(cle)) next.delete(cle)
      else next.add(cle)
      return next
    })
  }

  // ─── VUE LISTE ─────────────────────────────────
  if (vue === 'liste') {
    return (
      <div className="labo-detail-page">

        <div className="postop-intro">
          <i className="ti ti-clipboard-check postop-intro-icone"></i>
          <p className="postop-intro-texte">
            {t('Un aide-mémoire pour ne rien oublier : les 12 systèmes un par un, les constats à vérifier et les plages normales des signes vitaux chez le chien et le chat. Idéal en préconsultation. Vos anciens examens sont plus bas.')}
          </p>
        </div>

        <button className="labo-btn-primary" style={{ width: '100%', margin: '0 0 16px' }} onClick={commencerNouvelExamen}>
          <i className="ti ti-plus"></i> {t('Commencer un nouvel examen')}
        </button>

        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-history"></i>
            </div>
            <h2 className="postop-section-titre">{t('Historique')} ({historique.length}/{MAX_HISTORIQUE})</h2>
          </div>
          {historique.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)', padding: '0 16px 16px' }}>
              {t('Aucun examen enregistré pour le moment.')}
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
                      <button
                        className="examen-historique-supprimer"
                        onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(item) }}
                      >
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
                                <button
                                  className="examen-historique-supprimer"
                                  onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(item) }}
                                >
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
                  <i className="ti ti-file-description" style={{ fontSize: 36, color: 'var(--text-hint)', display: 'block', marginBottom: 10 }}></i>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{t('Examen en cours')}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 16 }}>{t("Aucun résumé généré, l'examen n'a pas encore été finalisé.")}</p>
                  {itemConsulte.donnees && (
                    <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {itemConsulte.donnees.espece && <div><strong>{t('Espèce :')}</strong> {ESPECES.find(e => e.id === itemConsulte.donnees.espece)?.label || itemConsulte.donnees.espece}</div>}
                      {itemConsulte.donnees.race && <div><strong>{t('Race :')}</strong> {itemConsulte.donnees.race}</div>}
                      {itemConsulte.donnees.poids && <div><strong>{t('Poids :')}</strong> {itemConsulte.donnees.poids} {itemConsulte.donnees.poidsUnite || 'kg'}</div>}
                      {itemConsulte.donnees.raisonVisite && <div><strong>{t('Raison :')}</strong> {itemConsulte.donnees.raisonVisite}</div>}
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
                      {t('Historique des modifications')} ({itemConsulte.historique_modifs.length})
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
                <button
                  className="labo-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => genererPDF(itemConsulte.donnees, new Date(itemConsulte.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }))}
                >
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
                <span>{t('Supprimer cet examen')}</span>
                <button className="popup-close" onClick={() => setShowConfirmSupprimer(null)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {enAnglais
                    ? <>Have you recorded this information in <strong>{showConfirmSupprimer.animal_nom}</strong>'s medical record before deleting?</>
                    : <>Avez-vous bien noté ces informations dans le dossier de <strong>{showConfirmSupprimer.animal_nom}</strong> avant de supprimer ?</>}
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

  // ─── VUE FORMULAIRE ─────────────────────────────────
  const complet = manquants.length === 0

  return (
    <div className="labo-detail-page examen-page">

      <div className="examen-topbar">
        <button className="examen-retour" onClick={() => setVue('liste')}>
          <i className="ti ti-arrow-left"></i> {t('Historique')}
        </button>
        <span className={`examen-sauvegarde ${sauvegarde}`}>
          {sauvegarde === 'encours' ? t('Enregistrement...') : sauvegarde === 'ok' ? t('Enregistré') : ''}
        </span>
        <button className="examen-reset" onClick={() => setShowReinit(true)}>
          <i className="ti ti-refresh"></i>
        </button>
      </div>

      <div className="examen-sections">

        {/* ═══ IDENTIFICATION ═══ */}
        <SectionAccordeon
          ancre="section-identification"
          titre={t('Identification')}
          icone="ti-clipboard-text"
          resume={resumeSection('identification')}
          etat={etatSection('identification')}
          ouvert={sectionOuverte === 'identification'}
          onToggle={() => ouvrirSection('identification')}
        >
          <div className="form-groupe">
            <label className="form-label">{t("Nom de l'animal")}</label>
            <input
              type="text"
              className="form-input"
              value={form.animalNom}
              onChange={e => modifierChamp('animalNom', e.target.value)}
              placeholder={t('Ex. : Charlie')}
            />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Espèce')}</label>
            <SelecteurEspece
              valeur={form.espece}
              onChange={id => modifierChamp('espece', id)}
              options={['chien', 'chat', {
                id: 'autre',
                actif: !!form.espece && form.espece !== 'chien' && form.espece !== 'chat',
                label: form.espece && form.espece !== 'chien' && form.espece !== 'chat'
                  ? ESPECES.find(e => e.id === form.espece)?.label
                  : t('Autre'),
                onClick: () => setPopupEspece(true),
              }]}
            />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Race')}</label>
            <input
              type="text"
              className="form-input"
              value={form.race || ''}
              onChange={e => modifierChamp('race', e.target.value)}
              placeholder={t('Ex. : Labrador, Persan...')}
            />
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
            <label className="form-label">{t('Poids')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                inputMode="decimal"
                className="form-input"
                style={{ flex: 1 }}
                value={form.poids}
                onChange={e => modifierChamp('poids', e.target.value.replace(',', '.'))}
                placeholder={t('Ex. : 12.5')}
              />
              <div className="radio-groupe" style={{ alignSelf: 'center' }}>
                <button type="button" className={`radio-btn ${form.poidsUnite === 'kg' ? 'active' : ''}`} onClick={() => modifierChamp('poidsUnite', 'kg')}>kg</button>
                <button type="button" className={`radio-btn ${form.poidsUnite === 'lb' ? 'active' : ''}`} onClick={() => modifierChamp('poidsUnite', 'lb')}>lb</button>
              </div>
            </div>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Date')}</label>
            <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>{dateAffichee}</div>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Raison de la visite')}</label>
            <input
              type="text"
              className="form-input"
              value={form.raisonVisite || ''}
              onChange={e => modifierChamp('raisonVisite', e.target.value)}
              placeholder={t('Ex. : vaccination, suivi post-opératoire, bilan annuel...')}
            />
          </div>

          <button className="examen-suivant" onClick={() => ouvrirSection('anamnese')}>
            {t('Suivant : anamnèse')} <i className="ti ti-arrow-right"></i>
          </button>
        </SectionAccordeon>

        {/* ═══ ANAMNÈSE ═══ */}
        <SectionAccordeon
          ancre="section-anamnese"
          titre={t('Anamnèse')}
          icone="ti-message-circle"
          resume={resumeSection('anamnese')}
          etat={etatSection('anamnese')}
          ouvert={sectionOuverte === 'anamnese'}
          onToggle={() => ouvrirSection('anamnese')}
        >
          <p className="examen-aide">{t("Rapporté par le propriétaire, avant l'examen.")}</p>

          {[
            { champ: 'appetit', label: t('Appétit'), options: APPETIT_OPTIONS },
            { champ: 'soif', label: t('Soif'), options: SOIF_OPTIONS },
            { champ: 'exercice', label: t('Exercice'), options: EXERCICE_OPTIONS },
          ].map(({ champ, label, options }) => (
            <div className="form-groupe" key={champ}>
              <label className="form-label">{label}</label>
              <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
                {options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className={`toggle-btn ${form.anamnese[champ] === opt ? 'actif' : ''}`}
                    onClick={() => modifierAnamnese(champ, form.anamnese[champ] === opt ? '' : opt)}
                  >
                    {t(opt)}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="form-groupe">
            <label className="form-label">{t('Diète')}</label>
            <input
              type="text"
              className="form-input"
              value={form.anamnese.diete}
              onChange={e => modifierAnamnese('diete', e.target.value)}
              placeholder={t('Marque, type, quantité par jour...')}
            />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Gâteries')}</label>
            <input
              type="text"
              className="form-input"
              value={form.anamnese.gateries}
              onChange={e => modifierAnamnese('gateries', e.target.value)}
              placeholder={t('Type et fréquence...')}
            />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Commentaires du propriétaire')}</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder={t("Ex. : le propriétaire mentionne que l'animal a moins d'appétit depuis 2 jours...")}
              value={form.anamnese.commentaires}
              onChange={e => modifierAnamnese('commentaires', e.target.value)}
            />
          </div>

          <button className="examen-suivant" onClick={() => ouvrirSection('vitaux')}>
            {t('Suivant : paramètres vitaux')} <i className="ti ti-arrow-right"></i>
          </button>
        </SectionAccordeon>

        {/* ═══ PARAMÈTRES VITAUX ═══ */}
        <SectionAccordeon
          ancre="section-vitaux"
          titre={t('Paramètres vitaux')}
          icone="ti-heartbeat"
          resume={resumeSection('vitaux')}
          etat={etatSection('vitaux')}
          ouvert={sectionOuverte === 'vitaux'}
          onToggle={() => ouvrirSection('vitaux')}
        >
          {[
            { champ: 'temperature', label: t('Température corporelle'), unite: '°C', placeholder: t('Ex. : 38.5') },
            { champ: 'freqCardiaque', label: t('Fréquence cardiaque'), unite: 'bpm', placeholder: t('Ex. : 100') },
            { champ: 'freqRespiratoire', label: t('Fréquence respiratoire'), unite: t('rpm'), placeholder: t('Ex. : 24') },
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
                    {t('Plage {espece} : {min} à {max} {unite}', {
                      // « Plage chien : ... » en français, « Dog range: ... » en anglais.
                      espece: enAnglais
                        ? ESPECES.find(e => e.id === form.espece)?.label || ''
                        : (ESPECES.find(e => e.id === form.espece)?.label || '').toLowerCase(),
                      min: decimal(info.plage[0]), max: decimal(info.plage[1]), unite,
                    })}
                    {info.horsPlage ? t(', valeur hors plage') : ''}
                    {NOTE_PLAGE[champ] ? ` · ${NOTE_PLAGE[champ]}` : ''}
                  </p>
                )}
              </div>
            )
          })}

          <button className="examen-suivant" onClick={() => ouvrirSection('general')}>
            {t('Suivant : état général')} <i className="ti ti-arrow-right"></i>
          </button>
        </SectionAccordeon>

        {/* ═══ ÉTAT GÉNÉRAL ═══ */}
        <SectionAccordeon
          ancre="section-general"
          titre={t('État général')}
          icone="ti-paw"
          resume={resumeSection('general')}
          etat={etatSection('general')}
          ouvert={sectionOuverte === 'general'}
          onToggle={() => ouvrirSection('general')}
        >
          <div className="form-groupe">
            <label className="form-label">{t('Attitude générale')}</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {ATTITUDE_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.attitude === opt ? 'actif' : ''}`} onClick={() => modifierChamp('attitude', form.attitude === opt ? '' : opt)}>
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t("Niveau d'énergie")}</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {ENERGIE_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.niveauEnergie === opt ? 'actif' : ''}`} onClick={() => modifierChamp('niveauEnergie', form.niveauEnergie === opt ? '' : opt)}>
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Condition corporelle')}</label>
            <div className="examen-bcs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`examen-bcs-btn ${form.conditionCorporelle === n ? 'actif' : ''}`}
                  onClick={() => modifierChamp('conditionCorporelle', form.conditionCorporelle === n ? '' : n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="examen-aide">
              {form.conditionCorporelle
                ? `${form.conditionCorporelle}/9 · ${BCS_LIBELLES[form.conditionCorporelle]}`
                : t('1 à 3 maigre · 4 à 5 idéale · 6 à 7 surpoids · 8 à 9 obèse')}
            </p>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Comportement')}</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {COMPORTEMENT_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.comportement === opt ? 'actif' : ''}`} onClick={() => modifierChamp('comportement', form.comportement === opt ? '' : opt)}>
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="examen-suivant"
            onClick={() => {
              ouvrirSection('systemes')
              const premier = SYSTEMES.find(s => !estEvalue(form.systemes[s.id]))
              setSystemeOuvert(premier ? premier.id : null)
            }}
          >
            {t('Suivant : systèmes')} <i className="ti ti-arrow-right"></i>
          </button>
        </SectionAccordeon>

        {/* ═══ SYSTÈMES ═══ */}
        <SectionAccordeon
          ancre="section-systemes"
          titre={t('Systèmes')}
          icone="ti-stethoscope"
          resume={resumeSection('systemes')}
          etat={etatSection('systemes')}
          ouvert={sectionOuverte === 'systemes'}
          onToggle={() => ouvrirSection('systemes')}
        >
          <div className="examen-lignes">
            {SYSTEMES.map(s => (
              <LigneSysteme
                key={s.id}
                systeme={s}
                valeur={form.systemes[s.id]}
                evalue={estEvalue(form.systemes[s.id])}
                ouvert={systemeOuvert === s.id}
                onOuvrir={() => setSystemeOuvert(systemeOuvert === s.id ? null : s.id)}
                onConstat={c => toggleConstat(s.id, c)}
                onNote={note => modifierNote(s.id, note)}
              />
            ))}
          </div>

          <button className="examen-suivant" onClick={() => ouvrirSection('complements')}>
            {t('Suivant : compléments')} <i className="ti ti-arrow-right"></i>
          </button>
        </SectionAccordeon>

        {/* ═══ COMPLÉMENTS ═══ */}
        <SectionAccordeon
          ancre="section-complements"
          titre={t('Compléments')}
          icone="ti-notes"
          resume={resumeSection('complements')}
          etat={etatSection('complements')}
          ouvert={sectionOuverte === 'complements'}
          onToggle={() => ouvrirSection('complements')}
        >
          <div className="form-groupe">
            <label className="form-label">{t('Vaccination à prévoir')}</label>
            <input type="text" className="form-input" value={form.complements.vaccination} onChange={e => modifierComplement('vaccination', e.target.value)} placeholder={t('Ex. : rappel DHPP en mars')} />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Contrôle parasitaire')}</label>
            <input type="text" className="form-input" value={form.complements.parasitaire} onChange={e => modifierComplement('parasitaire', e.target.value)} placeholder={t('Produit et dernière administration')} />
          </div>

          <div className="form-groupe">
            <label className="voie-item">
              <span>{t('Micropuce vérifiée')}</span>
              <input type="checkbox" checked={form.complements.micropuce} onChange={e => modifierComplement('micropuce', e.target.checked)} />
            </label>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Condition musculaire')}</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {MUSCLE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`toggle-btn ${form.complements.scoreMusculaire === opt ? 'actif' : ''}`}
                  onClick={() => modifierComplement('scoreMusculaire', form.complements.scoreMusculaire === opt ? '' : opt)}
                >
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Pression artérielle')}</label>
            <input type="text" className="form-input" value={form.complements.pressionArterielle} onChange={e => modifierComplement('pressionArterielle', e.target.value)} placeholder={t('Ex. : 140 mmHg')} />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t("Analyse d'urine")}</label>
            <input type="text" className="form-input" value={form.complements.analyseUrine} onChange={e => modifierComplement('analyseUrine', e.target.value)} placeholder={t('Résultats ou prélèvement effectué')} />
          </div>

          <div className="form-groupe">
            <label className="form-label">{t('Autres diagnostics')}</label>
            <textarea className="form-textarea" rows={2} value={form.complements.autresDiagnostics} onChange={e => modifierComplement('autresDiagnostics', e.target.value)} placeholder={t('Prises de sang, radiographies...')} />
          </div>
        </SectionAccordeon>

      </div>

      {/* ═══ BARRE COLLANTE ═══ */}
      <div className="examen-barre">
        <div className="examen-barre-progression">
          <div className="examen-barre-jauge">
            <div className="examen-barre-remplissage" style={{ width: `${Math.round((nbComplets / totalRequis) * 100)}%` }}></div>
          </div>
          <span className="examen-barre-texte">{t('{n} sur {total}', { n: nbComplets, total: totalRequis })}</span>
        </div>
        <button className={`examen-barre-btn ${complet ? 'complet' : ''}`} onClick={handleTermine}>
          {t('Terminé')}
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

      {/* Popup résumé */}
      {showResume && (
        <div className="popup-overlay" onClick={fermerResume}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t("Résumé de l'examen")}</span>
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

      {/* Popup formulaire incomplet */}
      {showIncomplet && (
        <div className="popup-overlay" onClick={() => setShowIncomplet(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t('Il reste des éléments à remplir')}</span>
              <button className="popup-close" onClick={() => setShowIncomplet(false)}>✕</button>
            </div>
            <div className="examen-manquants">
              {manquants.map((m, i) => (
                <button key={i} className="examen-manquant" onClick={() => allerA(m.section)}>
                  <span>{m.label}</span>
                  <i className="ti ti-arrow-right"></i>
                </button>
              ))}
            </div>
            <div className="popup-actions-centrees" style={{ marginTop: 12 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowIncomplet(false)}>
                {t('Revenir')}
              </button>
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={finaliserExamen}>
                {t('Poursuivre')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup réinitialisation */}
      {showReinit && (
        <div className="popup-overlay" onClick={() => setShowReinit(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t('Réinitialiser le formulaire')}</span>
              <button className="popup-close" onClick={() => setShowReinit(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-refresh" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t('Toutes les informations saisies seront effacées. Continuer ?')}
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowReinit(false)}>
                {t('Annuler')}
              </button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={reinitialiser}>
                {t('Réinitialiser')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
