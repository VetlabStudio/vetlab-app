import { useState, useEffect, useContext, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { TitreContext } from '../App'
import { useProfil } from '../context/ProfilContext'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import IconesEspeces, { ESPECES_CONFIG } from '../components/IconesEspeces'

const ESPECES = [
  { id: 'chien',        label: 'Chien',              icone: '/icone-chien.svg' },
  { id: 'chat',         label: 'Chat',               icone: '/icone-chat.svg' },
  { id: 'cheval',       label: 'Cheval',             icone: '/icone-cheval.png' },
  { id: 'vache',        label: 'Vache',              icone: '/icone-vache.png' },
  { id: 'mouton',       label: 'Mouton',             icone: '/icone-mouton.png' },
  { id: 'lama',         label: 'Lama',               icone: '/icone-lama.png' },
  { id: 'lapin',        label: 'Lapin',              icone: '/icone-lapin.png' },
  { id: 'furet',        label: 'Furet',              icone: '/icone-furet.png' },
  { id: 'oiseau',       label: 'Oiseau',            icone: '/icone-oiseau.png' },
  { id: 'serpent',      label: 'Serpent',            icone: '/icone-serpent.png' },
  { id: 'lezard',       label: 'Lézard',             icone: '/icone-lezard.png' },
  { id: 'tortue',       label: 'Tortue',             icone: '/icone-tortue.png' },
  { id: 'poisson',      label: 'Poisson',           icone: '/icone-poisson.png' },
  { id: 'amphibien',    label: 'Amphibien',         icone: '/icone-grenouille.png' },
  { id: 'rongeur',      label: 'Rongeur',           icone: '/icone-rongeurs.png' },
  { id: 'chinchilla',   label: 'Chinchilla',         icone: '/icone-chinchilla.png' },
  { id: 'cobaye',       label: 'Cochon d\'Inde',     icone: '/icone-cobaye.png' },
  { id: 'herisson',     label: 'Hérisson',           icone: '/icone-herisson.png' },
]

const MUQUEUSES_OPTIONS = ['Roses', 'Pâles', 'Congestives', 'Cyanotiques']
const ASA_OPTIONS = ['I', 'II', 'III', 'IV', 'V']
const CATEGORIES_MED = ['Drogues d\'urgence', 'Pré-anesthésique', 'Inducteurs', 'Intra-opératoire', 'Post-opératoire']
const MAX_HISTORIQUE = 30
const COLONNES_PAR_TABLEAU = 4
const COLONNES_PAR_TABLEAU_PDF = 6

const MESURE_PARAMS = [
  { key: 'fc', label: 'FC (bpm)' },
  { key: 'fr', label: 'FR (rpm)' },
  { key: 'temp', label: 'Température (°C)' },
  { key: 'spo2', label: 'SpO₂ (%)' },
  { key: 'co2', label: 'ETCO₂ (mmHg)' },
  { key: 'syst', label: 'PA systolique' },
  { key: 'diast', label: 'PA diastolique' },
  { key: 'map', label: 'MAP (mmHg)' },
  { key: 'isoSevo', label: 'Iso/Sevo (%)' },
  { key: 'o2', label: 'O₂ (L/min)' },
  { key: 'fluideIv', label: 'Fluide IV (mL/h)' },
]

function etatInitial() {
  return {
    animalNom: '',
    procedure: '',
    espece: '',
    race: '',
    sexe: '',
    sterilise: false,
    poids: '',
    poidsUnite: 'kg',
    asa: '',
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
    volumeTotal: '',
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

function categorieMedDefaut(med) {
  const c = med.categorie || ''
  if (c === 'Urgence' || c === 'Antagonistes') return 'Drogues d\'urgence'
  if (c === 'Anesthésiques / Analgésiques') return 'Inducteurs'
  return 'Intra-opératoire'
}

function chargerImageBase64(url) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
}

function doseEtVolume(poidsKg, doseMgKg, concentration) {
  const dose = parseFloat(doseMgKg)
  const conc = parseFloat(concentration)
  if (!poidsKg || isNaN(dose) || isNaN(conc) || !conc) return { doseMg: null, volume: null }
  const doseMg = poidsKg * dose
  return { doseMg, volume: doseMg / conc }
}

export default function ChirurgieMonitoring() {
  const [vue, setVue] = useState('liste') // 'liste' | 'setup' | 'monitoring'
  const [form, setForm] = useState(etatInitial())
  const [currentId, setCurrentId] = useState(null)
  const [historique, setHistorique] = useState([])
  const [itemConsulte, setItemConsulte] = useState(null)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)
  const [showResume, setShowResume] = useState(null)
  const [showModifs, setShowModifs] = useState(false)
  const [copie, setCopie] = useState(false)
  const [popupEspece, setPopupEspece] = useState(false)
  const [rechercheHistorique, setRechercheHistorique] = useState('')
  const [joursOuverts, setJoursOuverts] = useState(() => new Set())

  const [popupMesure, setPopupMesure] = useState(null) // {heure, ...valeurs}
  const [popupFin, setPopupFin] = useState(false)
  const [rechercheMed, setRechercheMed] = useState('')
  const [resultatsMed, setResultatsMed] = useState([])
  const [tousMedicaments, setTousMedicaments] = useState([])

  const { setTitreCustom } = useContext(TitreContext)
  const { profil, estEquipe, teamId } = useProfil()

  useEffect(() => {
    if (vue === 'setup') setTitreCustom(currentId ? 'Modifier le monitoring' : 'Démarrer l\'anesthésie')
    else if (vue === 'monitoring') setTitreCustom('Monitoring en cours')
    else setTitreCustom('')
    return () => setTitreCustom('')
  }, [vue, currentId])

  // ─── Sauvegarde automatique du brouillon dans l'historique ──
  useEffect(() => {
    if (!currentId || !(vue === 'setup' || vue === 'monitoring')) return
    const t = setTimeout(() => {
      supabase
        .from('monitorings_anesthesiques')
        .update({ animal_nom: form.animalNom || 'Sans nom', donnees: form, updated_at: new Date().toISOString() })
        .eq('id', currentId)
        .then(() => chargerHistorique())
    }, 800)
    return () => clearTimeout(t)
  }, [form, currentId, vue])

  useEffect(() => {
    supabase.from('medicaments').select('*').order('nom').then(({ data }) => setTousMedicaments(data || []))
  }, [])

  useEffect(() => {
    chargerHistorique()
  }, [])

  async function chargerHistorique() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const query = supabase.from('monitorings_anesthesiques').select('*').order('created_at', { ascending: false })
    const { data } = estEquipe && teamId
      ? await query.eq('equipe_id', teamId)
      : await query.eq('user_id', user.id)
    setHistorique(data || [])
  }

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
    setForm(nouveauForm)
    setCurrentId(null)
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
    const payload = { user_id: user.id, animal_nom: 'Sans nom', resume: '', donnees: nouveauForm }
    if (estEquipe && teamId) payload.equipe_id = teamId
    const { data } = await supabase
      .from('monitorings_anesthesiques')
      .insert(payload)
      .select()
      .single()
    if (data) {
      setCurrentId(data.id)
      chargerHistorique()
    }
  }

  // ─── RECHERCHE MÉDICAMENTS ──────────────────────
  useEffect(() => {
    if (!rechercheMed.trim()) {
      setResultatsMed([])
      return
    }
    let actif = true
    supabase
      .from('medicaments')
      .select('*')
      .ilike('nom', `%${rechercheMed.trim()}%`)
      .order('nom')
      .limit(20)
      .then(({ data }) => { if (actif) setResultatsMed(data || []) })
    return () => { actif = false }
  }, [rechercheMed])

  function ajouterMedication(med) {
    const { doseMin, concentration } = normaliserMedicament(med)
    setForm(prev => ({
      ...prev,
      medications: [...prev.medications, {
        id: med.id + '-' + Date.now(),
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
    setResultatsMed([])
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

  // ─── DÉMARRAGE ──────────────────────
  function demarrerAnesthesie() {
    setForm(prev => ({ ...prev, heureDebut: prev.heureDebut || heureActuelle() }))
    setVue('monitoring')
  }

  // ─── MESURES ──────────────────────
  function ouvrirPopupMesure() {
    const init = { heure: heureActuelle() }
    MESURE_PARAMS.forEach(p => { init[p.key] = '' })
    setPopupMesure(init)
  }

  function ajouterMesure() {
    setForm(prev => ({ ...prev, mesures: [...prev.mesures, popupMesure] }))
    setPopupMesure(null)
  }

  function supprimerMesure(index) {
    setForm(prev => ({ ...prev, mesures: prev.mesures.filter((_, i) => i !== index) }))
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
    const poidsKg = getPoidsKg(form)
    const especeLabel = ESPECES.find(e => e.id === form.espece)?.label
    const lignes = []
    lignes.push('MONITORING ANESTHÉSIQUE')
    lignes.push(`Animal : ${form.animalNom || '—'}`)
    lignes.push(`Espèce : ${especeLabel || '—'}`)
    lignes.push(`Race : ${form.race?.trim() || '—'}`)
    lignes.push(`Sexe : ${form.sexe === 'femelle' ? 'Femelle' : form.sexe === 'male' ? 'Mâle' : '—'}${form.sexe && form.sterilise ? ' (stérilisé(e))' : ''}`)
    lignes.push(`Poids : ${form.poids ? form.poids + ' ' + form.poidsUnite : '—'}`)
    lignes.push(`Procédure : ${form.procedure || '—'}`)
    lignes.push(`Risque anesthésique (ASA) : ${form.asa || '—'}`)
    lignes.push('')
    lignes.push('Évaluation pré-anesthésique :')
    lignes.push(`- Température : ${form.temperature ? form.temperature + ' °C' : '—'}`)
    lignes.push(`- FC : ${form.fc ? form.fc + ' bpm' : '—'}`)
    lignes.push(`- FR : ${form.fr ? form.fr + ' rpm' : '—'}`)
    lignes.push(`- TRC : ${form.trc ? form.trc + ' sec' : '—'}`)
    lignes.push(`- Muqueuses : ${form.muqueuses.length ? form.muqueuses.join(', ') : '—'}`)
    lignes.push(`- Particularités : ${form.particularites?.trim() || '—'}`)
    lignes.push('')
    lignes.push('Accès veineux et fluides IV :')
    lignes.push(`- Cathéter : ${form.accesCalibre || '—'}${form.accesSite ? ' (' + form.accesSite + ')' : ''}`)
    lignes.push(`- Soluté : ${form.soluteType || '—'}`)
    lignes.push(`- Débit : ${form.debit || '—'}`)
    lignes.push(`- Volume total prévu : ${form.volumeTotal || '—'}`)
    lignes.push('')
    lignes.push('Maintien anesthésique :')
    lignes.push(`- Agent inhalé : ${form.agentInhale || '—'}`)
    lignes.push(`- Circuit : ${form.circuit || '—'}`)
    lignes.push(`- Tube endotrachéal : ${form.tubeET || '—'}`)
    lignes.push(`- Ballonnet : ${form.ballonnet || '—'}`)
    lignes.push(`- Ballon réservoir : ${form.ballonReservoir || '—'}`)
    lignes.push(`- O₂ : ${form.o2Lmin ? form.o2Lmin + ' L/min' : '—'}`)
    lignes.push('')
    lignes.push('Médicaments administrés :')
    const medsAdministres = form.medications.filter(m => m.administre)
    if (medsAdministres.length) {
      medsAdministres.forEach(m => {
        const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
        lignes.push(`  - ${m.nom} | Concentration : ${m.concentration || '—'} mg/mL | Dose : ${m.doseMgKg || '—'} mg/kg${doseMg != null ? ` (${doseMg.toFixed(2)} mg)` : ''} | Volume : ${volume != null ? volume.toFixed(2) + ' mL' : '—'} | Voie : ${m.voie || '—'} | Heure : ${m.heureAdministration || '—'}`)
      })
    } else {
      lignes.push('  —')
    }
    lignes.push('')
    lignes.push(`Heure de début de l'anesthésie : ${form.heureDebut || '—'}`)
    if (form.mesures.length) {
      lignes.push('')
      lignes.push('Suivi des paramètres :')
      const largeurLabel = Math.max(...MESURE_PARAMS.map(p => p.label.length), 'Heure'.length) + 1
      const largeurCol = Math.max(...form.mesures.map(m => m.heure.length), 5) + 2
      const colonne = (texte) => String(texte).padEnd(largeurCol)
      lignes.push('Heure'.padEnd(largeurLabel) + form.mesures.map(m => colonne(m.heure)).join(''))
      MESURE_PARAMS.forEach(p => {
        lignes.push(p.label.padEnd(largeurLabel) + form.mesures.map(m => colonne(m[p.key] || '—')).join(''))
      })
    }
    lignes.push('')
    lignes.push(`Heure de fin de l'anesthésie : ${form.heureFin || '—'}`)
    lignes.push(`Notes de fin : ${form.notesFin?.trim() || '—'}`)
    lignes.push('')
    lignes.push('Récupération :')
    lignes.push(`- Extubation : ${form.extubationHeure || '—'}${form.extubationEtat ? ' (' + form.extubationEtat + ')' : ''}`)
    lignes.push(`- Température : ${form.postTemp || '—'}`)
    lignes.push(`- FC : ${form.postFc || '—'}`)
    lignes.push(`- FR : ${form.postFr || '—'}`)
    lignes.push(`- TRC : ${form.postTrc || '—'}`)
    lignes.push(`- Douleur : ${form.postDouleur || '—'}`)
    lignes.push(`- Commentaires : ${form.postCommentaires?.trim() || '—'}`)
    return lignes.join('\n')
  }

  // ─── PDF ──────────────────────
  async function genererPDF(donnees) {
    const donneesPdf = donnees || form
    const poidsKg = getPoidsKg(donneesPdf)
    const especeLabel = ESPECES.find(e => e.id === donneesPdf.espece)?.label
    const doc = new jsPDF()
    let y = 15
    try {
      const iconeData = await chargerImageBase64('/icone-monitoring.png')
      doc.addImage(iconeData, 'PNG', 14, 8, 10, 10)
      doc.setFontSize(14)
      doc.text('Monitoring anesthésique', 28, 16)
      y = 23
    } catch {
      doc.setFontSize(14)
      doc.text('Monitoring anesthésique', 14, y)
      y += 7
    }
    doc.setFontSize(8.5)
    const infos = [
      `Animal : ${donneesPdf.animalNom || '—'}`,
      `Espèce : ${especeLabel || '—'}${donneesPdf.race?.trim() ? '   Race : ' + donneesPdf.race.trim() : ''}   Sexe : ${donneesPdf.sexe === 'femelle' ? 'Femelle' : donneesPdf.sexe === 'male' ? 'Mâle' : '—'}${donneesPdf.sterilise ? ' (stérilisé(e))' : ''}`,
      `Poids : ${donneesPdf.poids ? donneesPdf.poids + ' ' + donneesPdf.poidsUnite : '—'}   Procédure : ${donneesPdf.procedure || '—'}`,
      `ASA : ${donneesPdf.asa || '—'}`,
      `Température : ${donneesPdf.temperature || '—'}   FC : ${donneesPdf.fc || '—'}   FR : ${donneesPdf.fr || '—'}   TRC : ${donneesPdf.trc || '—'}`,
      `Muqueuses : ${donneesPdf.muqueuses.join(', ') || '—'}`,
      `Accès veineux : ${donneesPdf.accesCalibre || '—'} ${donneesPdf.accesSite || ''} | Soluté : ${donneesPdf.soluteType || '—'} | Débit : ${donneesPdf.debit || '—'}`,
      `Maintien : ${donneesPdf.agentInhale || '—'} | Circuit : ${donneesPdf.circuit || '—'} | Tube ET : ${donneesPdf.tubeET || '—'}`,
      `Ballonnet : ${donneesPdf.ballonnet || '—'} | Ballon réservoir : ${donneesPdf.ballonReservoir || '—'} | O2 : ${donneesPdf.o2Lmin || '—'} L/min`,
      `Heure de début : ${donneesPdf.heureDebut || '—'}   Heure de fin : ${donneesPdf.heureFin || '—'}`,
    ]
    const recup = [
      `Notes de fin : ${donneesPdf.notesFin || '—'}`,
      `Extubation : ${donneesPdf.extubationHeure || '—'} (${donneesPdf.extubationEtat || '—'})`,
      `Récupération - Temp : ${donneesPdf.postTemp || '—'}, FC : ${donneesPdf.postFc || '—'}, FR : ${donneesPdf.postFr || '—'}, TRC : ${donneesPdf.postTrc || '—'}`,
      `Douleur : ${donneesPdf.postDouleur || '—'}`,
      `Commentaires : ${donneesPdf.postCommentaires || '—'}`,
    ]
    const colGap = 6
    const colWidth = (180 - colGap) / 2
    const xLeft = 14
    const xRight = xLeft + colWidth + colGap
    const yStart = y
    let yLeft = yStart
    infos.forEach(ligne => {
      const lignesSplit = doc.splitTextToSize(ligne, colWidth)
      doc.text(lignesSplit, xLeft, yLeft)
      yLeft += 4 * lignesSplit.length
    })
    let yRight = yStart
    doc.setFont(undefined, 'bold')
    doc.text('Récupération :', xRight, yRight)
    doc.setFont(undefined, 'normal')
    yRight += 4
    recup.forEach(ligne => {
      const lignesSplit = doc.splitTextToSize(ligne, colWidth)
      doc.text(lignesSplit, xRight, yRight)
      yRight += 4 * lignesSplit.length
    })
    y = Math.max(yLeft, yRight) + 2

    const medsAdministresPdf = donneesPdf.medications.filter(m => m.administre)
    if (medsAdministresPdf.length) {
      y += 1
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Médicaments administrés', 14, y)
      doc.setFont(undefined, 'normal')
      y += 2
      autoTable(doc, {
        startY: y,
        head: [['Médicament', 'Conc. (mg/mL)', 'Dose (mg/kg)', 'Dose totale (mg)', 'Volume (mL)', 'Voie', 'Heure']],
        body: medsAdministresPdf.map(m => {
          const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
          return [m.nom, m.concentration || '—', m.doseMgKg || '—', doseMg != null ? doseMg.toFixed(2) : '—', volume != null ? volume.toFixed(2) : '—', m.voie, m.heureAdministration || '—']
        }),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 77, 86] },
        margin: { left: 14, right: 14 },
      })
      y = doc.lastAutoTable.finalY + 3
    }

    if (donneesPdf.mesures.length) {
      const nbMed = medsAdministresPdf.length
      const maxTableauxPage1 = nbMed > 15 ? 0 : nbMed >= 5 ? 1 : 2
      let tableauIndex = 0
      for (let i = 0; i < donneesPdf.mesures.length; i += COLONNES_PAR_TABLEAU_PDF) {
        if (tableauIndex === maxTableauxPage1) {
          doc.addPage()
          y = 15
        }
        const chunk = donneesPdf.mesures.slice(i, i + COLONNES_PAR_TABLEAU_PDF)
        const largeurPage = doc.internal.pageSize.getWidth()
        const largeurTableau = 35 + chunk.length * 24
        autoTable(doc, {
          startY: y,
          head: [['Paramètre', ...chunk.map(m => m.heure)]],
          body: MESURE_PARAMS.map(p => [p.label, ...chunk.map(m => m[p.key] || '—')]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [37, 77, 86] },
          tableWidth: largeurTableau < largeurPage - 28 ? largeurTableau : 'auto',
          columnStyles: { 0: { cellWidth: 35 }, ...Object.fromEntries(chunk.map((_, ci) => [ci + 1, { cellWidth: 24 }])) },
          margin: { left: 14, right: 14 },
        })
        y = doc.lastAutoTable.finalY + 3
        tableauIndex++
      }
    }

    // ─── Pied de page (sur chaque page) ──────────────────────
    const pageHeight = doc.internal.pageSize.getHeight()
    if (y > pageHeight - 25) { doc.addPage(); y = 15 }
    const yFooter = pageHeight - 14
    const nbPages = doc.internal.getNumberOfPages()
    let logoData = null
    try {
      logoData = await chargerImageBase64('/logo-adjuvet.png')
    } catch {
      logoData = null
    }
    for (let p = 1; p <= nbPages; p++) {
      doc.setPage(p)
      if (logoData) {
        doc.addImage(logoData, 'PNG', 14, yFooter - 12, 18, 16)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text("Ce PDF a été généré avec l'aide de l'application Adjuvet", 36, yFooter - 2)
        doc.text('par VetlabStudio — adjuvet.app', 36, yFooter + 3)
      } else {
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text("Ce PDF a été généré avec l'aide de l'application Adjuvet par VetlabStudio — adjuvet.app", 14, yFooter)
      }
    }

    const url = doc.output('bloburl')
    window.open(url, '_blank')
  }

  // ─── SAUVEGARDE / HISTORIQUE ──────────────────────
  async function sauvegarder(texte) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const maintenant = new Date().toISOString()
    const entreeModif = { nom: profil?.nom || 'Membre', timestamp: maintenant }

    if (currentId) {
      const { data: currentRec } = await supabase
        .from('monitorings_anesthesiques').select('historique_modifs').eq('id', currentId).single()
      const modifs = [...(currentRec?.historique_modifs || []), entreeModif]
      await supabase
        .from('monitorings_anesthesiques')
        .update({ animal_nom: form.animalNom || 'Sans nom', resume: texte, donnees: form, updated_at: maintenant, historique_modifs: modifs })
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
      const payload = { user_id: user.id, animal_nom: form.animalNom || 'Sans nom', resume: texte, donnees: form, historique_modifs: [entreeModif] }
      if (estEquipe && teamId) payload.equipe_id = teamId
      const { data } = await supabase.from('monitorings_anesthesiques').insert(payload).select().single()
      if (data) setCurrentId(data.id)
    }
    await chargerHistorique()
  }

  function consulter(item) {
    setItemConsulte(item)
  }

  function modifier(item) {
    setForm({ ...etatInitial(), ...(item.donnees || {}) })
    setCurrentId(item.id)
    setItemConsulte(null)
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
    return new Date(d).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function cleJour(d) {
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  function formaterJour(cle) {
    const [a, m, j] = cle.split('-').map(Number)
    return new Date(a, m - 1, j).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
    return Array.from(groupes.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
  }, [historique])

  function toggleJour(cle) {
    setJoursOuverts(prev => {
      const next = new Set(prev)
      if (next.has(cle)) next.delete(cle)
      else next.add(cle)
      return next
    })
  }

  const poidsKg = getPoidsKg(form)

  // ─── VUE LISTE ──────────────────────
  if (vue === 'liste') {
    return (
      <div className="labo-detail-page">
        <div className="postop-intro">
          <i className="ti ti-activity postop-intro-icone"></i>
          <p className="postop-intro-texte">
            Outil de suivi des paramètres vitaux durant une anesthésie. Démarre une nouvelle anesthésie ou consulte ton historique.
          </p>
        </div>

        <button className="labo-btn-primary" style={{ width: '100%', margin: '0 0 16px' }} onClick={commencerNouveau}>
          <i className="ti ti-plus"></i> Démarrer l'anesthésie
        </button>

        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-history"></i>
            </div>
            <h2 className="postop-section-titre">Historique ({historique.length}/{MAX_HISTORIQUE})</h2>
          </div>
          {historique.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)', padding: '0 16px 16px' }}>
              Aucun monitoring enregistré pour le moment.
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
                    placeholder="Rechercher par nom, espèce ou date..."
                  />
                  {rechercheHistorique && (
                    <button className="recherche-clear" onClick={() => setRechercheHistorique('')}>✕</button>
                  )}
                </div>
              </div>

              {rechercheHistorique.trim() ? (
                <div className="examen-historique-liste" style={{ padding: '0 16px 16px' }}>
                  {historiqueFiltre.length === 0 ? (
                    <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucun résultat.</p>
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
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Monitoring en cours</p>
                  <p style={{ fontSize: 13, color: 'var(--text-hint)', marginBottom: 16 }}>Aucun résumé généré — le monitoring n'a pas encore été finalisé.</p>
                  {itemConsulte.donnees && (
                    <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {itemConsulte.donnees.espece && <div><strong>Espèce :</strong> {itemConsulte.donnees.espece}</div>}
                      {itemConsulte.donnees.race && <div><strong>Race :</strong> {itemConsulte.donnees.race}</div>}
                      {itemConsulte.donnees.poids && <div><strong>Poids :</strong> {itemConsulte.donnees.poids} {itemConsulte.donnees.poidsUnite || 'kg'}</div>}
                      {itemConsulte.donnees.procedure && <div><strong>Procédure :</strong> {itemConsulte.donnees.procedure}</div>}
                    </div>
                  )}
                </div>
              )}
              <button className="labo-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={() => modifier(itemConsulte)}>
                Modifier
              </button>
              {itemConsulte.historique_modifs?.length > 0 && (
                <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setShowModifs(v => !v)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Historique des modifications ({itemConsulte.historique_modifs.length})
                    </span>
                    <i className={`ti ti-chevron-${showModifs ? 'up' : 'down'}`} style={{ fontSize: 14, color: 'var(--text-hint)' }}></i>
                  </button>
                  {showModifs && (
                    <div style={{ padding: '8px 12px 10px', background: 'var(--bg-card)', maxHeight: 220, overflowY: 'auto' }}>
                      {[...itemConsulte.historique_modifs].reverse().map((m, i) => (
                        <p key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Mis à jour par <strong>{m.nom}</strong> · {new Date(m.timestamp).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })} à {new Date(m.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="popup-actions-centrees" style={{ marginTop: 8 }}>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => copierResume(itemConsulte.resume)}>
                  {copie ? 'Copié !' : 'Copier'}
                </button>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => genererPDF(itemConsulte.donnees)}>
                  <i className="ti ti-file-download"></i> PDF
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(itemConsulte)}>
                  Supprimer
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
                <span>Supprimer ce monitoring</span>
                <button className="popup-close" onClick={() => setShowConfirmSupprimer(null)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  As-tu bien noté ces informations dans le dossier de <strong>{showConfirmSupprimer.animal_nom}</strong> avant de supprimer ?
                </p>
              </div>
              <div className="popup-actions-centrees">
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(null)}>
                  Annuler
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerHistorique(showConfirmSupprimer.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── VUE SETUP ──────────────────────
  if (vue === 'setup') {
    return (
      <div className="labo-detail-page">
        <button className="labo-btn-secondary" style={{ marginBottom: 12, width: '100%', textAlign: 'center', display: 'block', boxSizing: 'border-box', position: 'static', right: 'auto' }} onClick={() => setVue('liste')}>
          <i className="ti ti-arrow-left"></i> Retour à l'historique
        </button>

        {/* Identification */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-paw"></i>
            </div>
            <h2 className="postop-section-titre">Identification</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="form-groupe">
              <label className="form-label">Nom de l'animal</label>
              <input type="text" className="form-input" value={form.animalNom} onChange={e => modifierChamp('animalNom', e.target.value)} placeholder="Ex. : Charlie" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Type de procédure</label>
              <input type="text" className="form-input" value={form.procedure} onChange={e => modifierChamp('procedure', e.target.value)} placeholder="Ex. : Castration" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Espèce</label>
              <div className="espece-choisir">
                <span className="espece-choisie-texte" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {form.espece && (
                    <img src={ESPECES.find(e => e.id === form.espece)?.icone} alt="" className="espece-icone-popup" style={{ width: 24, height: 24 }} />
                  )}
                  {ESPECES.find(e => e.id === form.espece)?.label || 'Aucune espèce choisie'}
                </span>
                <button type="button" className="btn-choisir-espece" onClick={() => setPopupEspece(true)}>
                  Choisir
                </button>
              </div>
            </div>
            <div className="form-groupe">
              <label className="form-label">Race</label>
              <input type="text" className="form-input" value={form.race || ''} onChange={e => modifierChamp('race', e.target.value)} placeholder="Ex. : Labrador, Persan..." />
            </div>
            <div className="form-groupe">
              <label className="form-label">Sexe</label>
              <div className="toggle-groupe">
                <button type="button" className={`toggle-btn ${form.sexe === 'femelle' ? 'actif' : ''}`} onClick={() => modifierChamp('sexe', form.sexe === 'femelle' ? '' : 'femelle')}>Femelle</button>
                <button type="button" className={`toggle-btn ${form.sexe === 'male' ? 'actif' : ''}`} onClick={() => modifierChamp('sexe', form.sexe === 'male' ? '' : 'male')}>Mâle</button>
              </div>
              <label className="voie-item" style={{ marginTop: 8 }}>
                <span>Stérilisé(e)</span>
                <input type="checkbox" checked={form.sterilise} onChange={e => modifierChamp('sterilise', e.target.checked)} />
              </label>
            </div>
            <div className="form-groupe">
              <label className="form-label">Poids</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" inputMode="decimal" className="form-input" style={{ flex: 1 }} value={form.poids} onChange={e => modifierChamp('poids', e.target.value.replace(',', '.'))} placeholder="Ex. : 12.5" />
                <div className="toggle-groupe" style={{ flexShrink: 0 }}>
                  <button type="button" className={`toggle-btn ${form.poidsUnite === 'kg' ? 'actif' : ''}`} onClick={() => modifierChamp('poidsUnite', 'kg')}>kg</button>
                  <button type="button" className={`toggle-btn ${form.poidsUnite === 'lb' ? 'actif' : ''}`} onClick={() => modifierChamp('poidsUnite', 'lb')}>lb</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup espèce */}
        {popupEspece && (
          <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>Choisir une espèce</span>
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
              <button className="btn-sauvegarder" onClick={() => setPopupEspece(false)}>Confirmer</button>
            </div>
          </div>
        )}

        {/* ASA */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-alert-circle"></i>
            </div>
            <h2 className="postop-section-titre">Risque anesthésique (ASA)</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="toggle-groupe">
              {ASA_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.asa === opt ? 'actif' : ''}`} onClick={() => modifierChamp('asa', form.asa === opt ? '' : opt)}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Paramètres vitaux pré-op */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heartbeat"></i>
            </div>
            <h2 className="postop-section-titre">Évaluation pré-anesthésique</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="form-groupe">
              <label className="form-label">Température (°C)</label>
              <input type="number" inputMode="decimal" className="form-input" value={form.temperature} onChange={e => modifierChamp('temperature', e.target.value)} placeholder="Ex. : 38.5" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Fréquence cardiaque (bpm)</label>
              <input type="number" inputMode="numeric" className="form-input" value={form.fc} onChange={e => modifierChamp('fc', e.target.value)} placeholder="Ex. : 100" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Fréquence respiratoire (rpm)</label>
              <input type="number" inputMode="numeric" className="form-input" value={form.fr} onChange={e => modifierChamp('fr', e.target.value)} placeholder="Ex. : 24" />
            </div>
            <div className="form-groupe">
              <label className="form-label">TRC (sec)</label>
              <input type="text" className="form-input" value={form.trc} onChange={e => modifierChamp('trc', e.target.value)} placeholder="Ex. : 1-2" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Couleur des muqueuses</label>
              <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
                {MUQUEUSES_OPTIONS.map(opt => (
                  <button key={opt} type="button" className={`toggle-btn ${form.muqueuses.includes(opt) ? 'actif' : ''}`} onClick={() => toggleMuqueuse(opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="form-groupe">
              <label className="form-label">Particularités</label>
              <textarea className="form-textarea" rows={2} value={form.particularites} onChange={e => modifierChamp('particularites', e.target.value)} placeholder="Allergies, conditions particulières..." />
            </div>
          </div>
        </div>

        {/* Accès veineux et fluides IV */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-droplet"></i>
            </div>
            <h2 className="postop-section-titre">Accès veineux et fluides IV</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="form-groupe">
              <label className="form-label">Calibre du cathéter</label>
              <input type="text" className="form-input" value={form.accesCalibre} onChange={e => modifierChamp('accesCalibre', e.target.value)} placeholder="Ex. : 22G" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Site</label>
              <input type="text" className="form-input" value={form.accesSite} onChange={e => modifierChamp('accesSite', e.target.value)} placeholder="Ex. : Patte avant gauche" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Type de soluté</label>
              <input type="text" className="form-input" value={form.soluteType} onChange={e => modifierChamp('soluteType', e.target.value)} placeholder="Ex. : Lactate Ringer" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Débit</label>
              <input type="text" className="form-input" value={form.debit} onChange={e => modifierChamp('debit', e.target.value)} placeholder="Ex. : 5 mL/kg/h" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Volume total prévu</label>
              <input type="text" className="form-input" value={form.volumeTotal} onChange={e => modifierChamp('volumeTotal', e.target.value)} placeholder="Ex. : 250 mL" />
            </div>
          </div>
        </div>

        {/* Maintien anesthésique */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-lungs"></i>
            </div>
            <h2 className="postop-section-titre">Maintien anesthésique</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="form-groupe">
              <label className="form-label">Agent inhalé</label>
              <input type="text" className="form-input" value={form.agentInhale} onChange={e => modifierChamp('agentInhale', e.target.value)} placeholder="Ex. : Isoflurane" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Circuit</label>
              <input type="text" className="form-input" value={form.circuit} onChange={e => modifierChamp('circuit', e.target.value)} placeholder="Ex. : Circuit fermé" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Tube endotrachéal</label>
              <input type="text" className="form-input" value={form.tubeET} onChange={e => modifierChamp('tubeET', e.target.value)} placeholder="Ex. : 7 mm" />
            </div>
            <div className="form-groupe">
              <label className="form-label">Ballonnet</label>
              <div className="toggle-groupe">
                <button type="button" className={`toggle-btn ${form.ballonnet === 'Oui' ? 'actif' : ''}`} onClick={() => modifierChamp('ballonnet', form.ballonnet === 'Oui' ? '' : 'Oui')}>Oui</button>
                <button type="button" className={`toggle-btn ${form.ballonnet === 'Non' ? 'actif' : ''}`} onClick={() => modifierChamp('ballonnet', form.ballonnet === 'Non' ? '' : 'Non')}>Non</button>
              </div>
            </div>
            <div className="form-groupe">
              <label className="form-label">Ballon réservoir</label>
              <input type="text" className="form-input" value={form.ballonReservoir} onChange={e => modifierChamp('ballonReservoir', e.target.value)} placeholder="Ex. : 1 L" />
            </div>
            <div className="form-groupe">
              <label className="form-label">O₂ (L/min)</label>
              <input type="number" inputMode="decimal" className="form-input" value={form.o2Lmin} onChange={e => modifierChamp('o2Lmin', e.target.value)} placeholder="Ex. : 1" />
            </div>
          </div>
        </div>

        {/* Médications */}
        <div className="postop-section" style={{ overflow: 'visible' }}>
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-pill"></i>
            </div>
            <h2 className="postop-section-titre">Médications</h2>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            {!form.poids && (
              <p style={{ fontSize: 13, color: 'var(--accent-gold)', marginBottom: 8 }}>
                <i className="ti ti-alert-triangle"></i> Indique le poids de l'animal pour calculer les volumes automatiquement.
              </p>
            )}
            <div className="recherche-wrapper" style={{ marginBottom: 12, position: 'relative' }}>
              <i className="ti ti-search recherche-icone"></i>
              <input type="text" className="recherche-input" placeholder="Rechercher un médicament..." value={rechercheMed} onChange={e => setRechercheMed(e.target.value)} />
              {resultatsMed.length > 0 && (
                <div className="monitoring-med-dropdown">
                  {resultatsMed.map(med => (
                    <div key={med.id} className="monitoring-med-dropdown-item" onClick={() => ajouterMedication(med)}>
                      <div className="monitoring-med-dropdown-nom">{med.nom}</div>
                      <div className="monitoring-med-dropdown-details">
                        <span>{med.categorie}</span>
                        <IconesEspeces especes={med.especes} taille={18} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-groupe" style={{ marginBottom: 12 }}>
              <label className="form-label">Ou choisir dans la liste</label>
              <select className="form-input" value="" onChange={e => {
                const med = tousMedicaments.find(m => String(m.id) === e.target.value)
                if (med) ajouterMedication(med)
              }}>
                <option value="">Choisir un médicament...</option>
                {tousMedicaments.map(med => {
                  const especesLabel = (med.especes || []).map(e => ESPECES_CONFIG[e]?.label).filter(Boolean).join(', ')
                  return (
                    <option key={med.id} value={med.id}>
                      {med.nom}{med.categorie ? ` — ${med.categorie}` : ''}{especesLabel ? ` (${especesLabel})` : ''}
                    </option>
                  )
                })}
              </select>
            </div>

            {form.medications.map(m => {
              const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
              return (
                <div key={m.id} className="monitoring-med-card">
                  <div className="monitoring-med-card-header">
                    <span className="monitoring-med-card-nom">{m.nom}</span>
                    <button className="examen-historique-supprimer" onClick={() => supprimerMedication(m.id)}><i className="ti ti-trash"></i></button>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Catégorie</label>
                    <select className="form-input" value={m.categorie} onChange={e => modifierMedication(m.id, 'categorie', e.target.value)}>
                      {CATEGORIES_MED.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Concentration (mg/mL)</label>
                    <input type="text" inputMode="decimal" className="form-input" value={m.concentration} onChange={e => modifierMedication(m.id, 'concentration', e.target.value.replace(',', '.'))} />
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Dose (mg/kg)</label>
                    <input type="text" inputMode="decimal" className="form-input" value={m.doseMgKg} onChange={e => modifierMedication(m.id, 'doseMgKg', e.target.value.replace(',', '.'))} />
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Dose totale</label>
                    <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>{doseMg != null ? doseMg.toFixed(2) + ' mg' : '—'}</div>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Volume à administrer</label>
                    <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>{volume != null ? volume.toFixed(2) + ' mL' : '—'}</div>
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Voie</label>
                    <input type="text" className="form-input" value={m.voie} onChange={e => modifierMedication(m.id, 'voie', e.target.value)} placeholder="IV, IM, SC..." />
                  </div>
                  <div className="monitoring-med-card-row">
                    <label className="form-label">Administré</label>
                    <div className="toggle-groupe">
                      <button
                        type="button"
                        className={`toggle-btn ${m.administre ? 'actif' : ''}`}
                        onClick={() => toggleAdministreMedication(m.id, true)}
                      >Oui</button>
                      <button
                        type="button"
                        className={`toggle-btn ${!m.administre ? 'actif' : ''}`}
                        onClick={() => toggleAdministreMedication(m.id, false)}
                      >Non</button>
                    </div>
                  </div>
                  {m.administre && (
                    <div className="monitoring-med-card-row">
                      <label className="form-label">Heure d'administration</label>
                      <input type="time" className="form-input" value={m.heureAdministration || heureActuelle()} onChange={e => modifierMedication(m.id, 'heureAdministration', e.target.value)} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Heure de début */}
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-clock-play"></i>
            </div>
            <h2 className="postop-section-titre">Heure de début de l'anesthésie</h2>
          </div>
          <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
            <div className="form-groupe">
              <input type="time" className="form-input" value={form.heureDebut || heureActuelle()} onChange={e => modifierChamp('heureDebut', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="labo-actions" style={{ padding: '0 16px 16px' }}>
          <button className="labo-btn-primary" style={{ width: '100%' }} onClick={demarrerAnesthesie}>
            <i className="ti ti-player-play"></i> {form.heureDebut ? 'Continuer le monitoring' : 'Commencer le monitoring'}
          </button>
        </div>
      </div>
    )
  }

  // ─── VUE MONITORING ──────────────────────
  const chunks = []
  for (let i = 0; i < form.mesures.length; i += COLONNES_PAR_TABLEAU) {
    chunks.push(form.mesures.slice(i, i + COLONNES_PAR_TABLEAU))
  }

  return (
    <div className="labo-detail-page">
      <div className="postop-intro">
        <i className="ti ti-activity postop-intro-icone"></i>
        <p className="postop-intro-texte">
          <strong>{form.animalNom || 'Animal'}</strong> — Anesthésie débutée à {form.heureDebut || '—'}. Ajoute des mesures au fil du suivi.
        </p>
      </div>

      <div className="labo-actions" style={{ margin: '0 0 16px' }}>
        <button className="labo-btn-secondary" style={{ flex: 1, position: 'static' }} onClick={() => setVue('setup')}>
          <i className="ti ti-arrow-left"></i> Retour aux informations
        </button>
        <button className="labo-btn-primary" style={{ flex: 1 }} onClick={ouvrirPopupMesure}>
          <i className="ti ti-plus"></i> Ajouter une mesure
        </button>
      </div>

      {form.medications.length > 0 && (
        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-pill"></i>
            </div>
            <h2 className="postop-section-titre">Médications préparées</h2>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            {CATEGORIES_MED.map(cat => {
              const meds = form.medications.filter(m => m.categorie === cat)
              if (!meds.length) return null
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{cat}</p>
                  {meds.map(m => {
                    const { doseMg, volume } = doseEtVolume(poidsKg, m.doseMgKg, m.concentration)
                    return (
                      <div key={m.id} className="monitoring-med-resume">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span className="monitoring-med-resume-nom">{m.nom}</span>
                          <div className="toggle-groupe" style={{ flexShrink: 0 }}>
                            <button type="button" className={`toggle-btn ${m.administre ? 'actif' : ''}`} onClick={() => toggleAdministreMedication(m.id, true)}>Oui</button>
                            <button type="button" className={`toggle-btn ${!m.administre ? 'actif' : ''}`} onClick={() => toggleAdministreMedication(m.id, false)}>Non</button>
                          </div>
                        </div>
                        <span className="monitoring-med-resume-detail">{m.concentration || '—'} mg/mL · {m.doseMgKg || '—'} mg/kg{doseMg != null ? ` (${doseMg.toFixed(2)} mg)` : ''} · {volume != null ? volume.toFixed(2) + ' mL' : '—'}{m.voie ? ' · ' + m.voie : ''}</span>
                        {m.administre && (
                          <div className="form-groupe" style={{ marginTop: 6 }}>
                            <label className="form-label">Administré à</label>
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
        </div>
      )}

      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-table"></i>
          </div>
          <h2 className="postop-section-titre">Suivi des paramètres</h2>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          {chunks.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)' }}>Aucune mesure ajoutée pour le moment.</p>
          ) : chunks.map((chunk, ci) => (
            <div key={ci} style={{ marginBottom: 16 }}>
              {ci > 0 && <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Suite de la surveillance</p>}
              <div className="monitoring-table-wrap monitoring-table-wrap--suivi">
                <table className="monitoring-table monitoring-table--suivi">
                  <thead>
                    <tr>
                      <th>Paramètre</th>
                      {chunk.map((m, j) => (
                        <th key={j}>
                          {m.heure}
                          <button className="examen-historique-supprimer" style={{ marginLeft: 4 }} onClick={() => supprimerMesure(ci * COLONNES_PAR_TABLEAU + j)}>
                            <i className="ti ti-x"></i>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MESURE_PARAMS.map(p => (
                      <tr key={p.key}>
                        <td>{p.label}</td>
                        {chunk.map((m, j) => <td key={j}>{m[p.key] || '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="labo-actions" style={{ padding: '0 16px 16px' }}>
        <button className="btn-supprimer-medicament" style={{ width: '100%' }} onClick={ouvrirPopupFin}>
          <i className="ti ti-player-stop"></i> Terminer l'anesthésie
        </button>
      </div>

      {/* Popup ajouter mesure */}
      {popupMesure && (
        <div className="popup-overlay" onClick={() => setPopupMesure(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Nouvelle mesure</span>
              <button className="popup-close" onClick={() => setPopupMesure(null)}>✕</button>
            </div>
            <div className="form-scroll" style={{ gap: 12 }}>
              <div className="form-groupe">
                <label className="form-label">Heure</label>
                <input type="time" className="form-input" value={popupMesure.heure} onChange={e => setPopupMesure(prev => ({ ...prev, heure: e.target.value }))} />
              </div>
              {MESURE_PARAMS.map(p => (
                <div key={p.key} className="form-groupe">
                  <label className="form-label">{p.label}</label>
                  <input type="text" inputMode="decimal" className="form-input" value={popupMesure[p.key]} onChange={e => setPopupMesure(prev => ({ ...prev, [p.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <button className="labo-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={ajouterMesure}>
              Terminé
            </button>
          </div>
        </div>
      )}

      {/* Popup fin d'anesthésie */}
      {popupFin && (
        <div className="popup-overlay" onClick={() => setPopupFin(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Terminer l'anesthésie</span>
              <button className="popup-close" onClick={() => setPopupFin(false)}>✕</button>
            </div>
            <div className="form-scroll" style={{ gap: 12 }}>
              <div className="form-groupe">
                <label className="form-label">Heure de fin</label>
                <input type="time" className="form-input" value={form.heureFin} onChange={e => modifierChamp('heureFin', e.target.value)} />
              </div>
              <div className="form-groupe">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" rows={3} value={form.notesFin} onChange={e => modifierChamp('notesFin', e.target.value)} placeholder="Observations sur la fin de l'anesthésie..." />
              </div>
              <div className="form-groupe">
                <label className="form-label">Heure d'extubation</label>
                <input type="time" className="form-input" value={form.extubationHeure} onChange={e => modifierChamp('extubationHeure', e.target.value)} />
              </div>
              <div className="form-groupe">
                <label className="form-label">État à l'extubation</label>
                <input type="text" className="form-input" value={form.extubationEtat} onChange={e => modifierChamp('extubationEtat', e.target.value)} placeholder="Ex. : Réflexe de déglutition présent" />
              </div>
              <div className="form-groupe">
                <label className="form-label">Température (récupération)</label>
                <input type="text" className="form-input" value={form.postTemp} onChange={e => modifierChamp('postTemp', e.target.value)} placeholder="°C" />
              </div>
              <div className="form-groupe">
                <label className="form-label">FC (récupération)</label>
                <input type="text" className="form-input" value={form.postFc} onChange={e => modifierChamp('postFc', e.target.value)} placeholder="bpm" />
              </div>
              <div className="form-groupe">
                <label className="form-label">FR (récupération)</label>
                <input type="text" className="form-input" value={form.postFr} onChange={e => modifierChamp('postFr', e.target.value)} placeholder="rpm" />
              </div>
              <div className="form-groupe">
                <label className="form-label">TRC (récupération)</label>
                <input type="text" className="form-input" value={form.postTrc} onChange={e => modifierChamp('postTrc', e.target.value)} placeholder="sec" />
              </div>
              <div className="form-groupe">
                <label className="form-label">Douleur</label>
                <input type="text" className="form-input" value={form.postDouleur} onChange={e => modifierChamp('postDouleur', e.target.value)} placeholder="Évaluation de la douleur" />
              </div>
              <div className="form-groupe">
                <label className="form-label">Autres commentaires</label>
                <textarea className="form-textarea" rows={2} value={form.postCommentaires} onChange={e => modifierChamp('postCommentaires', e.target.value)} />
              </div>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={terminerAnesthesie}>
              Terminé
            </button>
          </div>
        </div>
      )}

      {/* Popup rapport final */}
      {showResume && (
        <div className="popup-overlay" onClick={fermerResume}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Rapport de monitoring</span>
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
                {copie ? 'Copié !' : 'Copier'}
              </button>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => genererPDF(form)}>
                <i className="ti ti-file-download"></i> PDF
              </button>
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={fermerResume}>
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
