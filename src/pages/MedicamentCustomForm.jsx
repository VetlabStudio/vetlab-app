import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { TitreContext } from '../App'

const VOIES = [
  'Intraveineux (IV)',
  'Intramusculaire (IM)',
  'Per Os (PO)',
  'Sous-cutanée (SC)',
  'Intranasal (IN)',
  'Épidural',
  'Topique',
]

const UNITES_DOSE = ['mg/kg', 'mcg/kg', 'UI/kg', 'mL/kg']
const UNITES_CONC = ['mg/mL', 'mcg/mL', 'UI/mL', '%']

export default function MedicamentCustomForm() {
  const navigate = useNavigate()
  const { id } = useParams() // medicament_id
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [erreur, setErreur] = useState('')
  const [popupEspece, setPopupEspece] = useState(false)
  const [customId, setCustomId] = useState(null)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(false)
  const { setTitreCustom } = useContext(TitreContext)

  useEffect(() => {
    chargerDonnees()
  }, [id])

  async function chargerDonnees() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Vérifier si un custom existe déjà
    // Chercher par medicament_id (copie d'un médicament de base)
const { data: customParMedId } = await supabase
  .from('medicaments_custom')
  .select('*')
  .eq('user_id', user.id)
  .eq('medicament_id', id)
  .maybeSingle()

// Chercher par id direct (médicament créé de zéro)
const { data: customDirect } = await supabase
  .from('medicaments_custom')
  .select('*')
  .eq('user_id', user.id)
  .eq('id', id)
  .maybeSingle()
console.log('id URL:', id)
console.log('customParMedId:', customParMedId)
console.log('customDirect:', customDirect)
const custom = customParMedId || customDirect

if (custom) {
  setCustomId(custom.id)
  setTitreCustom(`Personnaliser — ${custom.nom}`)
  setForm({
    ...custom,
    type_dose: custom.dose_max ? 'min_max' : 'fixe',
    especes: custom.especes || [],
    voies_admin: custom.voies_admin || [],
    sous_categories: custom.sous_categories || [],
  })
} else {
  // Copier depuis medicaments de base
  const { data: base } = await supabase
    .from('medicaments')
    .select('*')
    .eq('id', id)
    .single()

  if (base) {
    setTitreCustom(`Personnaliser — ${base.nom}`)
    setForm({
      ...base,
      type_dose: base.dose_max ? 'min_max' : 'fixe',
      especes: base.especes || [],
      voies_admin: base.voies_admin || [],
      sous_categories: base.sous_categories || [],
    })
  }
}

    setLoading(false)
  }

  function handleChange(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  function toggleVoie(voie) {
    setForm(prev => ({
      ...prev,
      voies_admin: prev.voies_admin.includes(voie)
        ? prev.voies_admin.filter(v => v !== voie)
        : [...prev.voies_admin, voie],
    }))
  }

  function toggleEspece(espece) {
    setForm(prev => ({
      ...prev,
      especes: prev.especes.includes(espece)
        ? prev.especes.filter(e => e !== espece)
        : [...prev.especes, espece],
    }))
  }

  async function sauvegarder() {
    setErreur('')
    if (!form.nom?.trim()) return setErreur('Le nom est requis.')
    if (!form.dose_min)    return setErreur('La dose est requise.')
    if (!form.concentration) return setErreur('La concentration est requise.')

    setSauvegarde(true)
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
  user_id:             user.id,
  medicament_id: form.medicament_id || (customId ? null : id),
      nom:                 form.nom.trim(),
      categorie:           form.categorie,
      indication:          form.indication,
      dose_min:            parseFloat(form.dose_min),
      dose_max:            form.type_dose === 'min_max' && form.dose_max ? parseFloat(form.dose_max) : null,
      unite_dose:          form.unite_dose,
      concentration:       parseFloat(form.concentration),
      unite_concentration: form.unite_concentration,
      voies_admin:         form.voies_admin,
      sous_categories:     form.sous_categories,
      interactions:        form.interactions,
      effets_secondaires:  form.effets_secondaires,
      contre_indications:  form.contre_indications,
      notes:               form.notes,
      especes:             form.especes,
      updated_at:          new Date().toISOString(),
    }
console.log('customId:', customId)
    if (customId) {
      const { error } = await supabase
        .from('medicaments_custom')
        .update(payload)
        .eq('id', customId)
      if (error) { setErreur('Erreur : ' + error.message); setSauvegarde(false); return }
    } else {
      const { error } = await supabase
        .from('medicaments_custom')
        .insert(payload)
      if (error) { setErreur('Erreur : ' + error.message); setSauvegarde(false); return }
    }

    setSauvegarde(false)
    navigate(-1)
  }

  async function reinitialiser() {
    const { data: { user } } = await supabase.auth.getUser()
   await supabase
  .from('medicaments_custom')
  .delete()
  .eq('id', customId)
    navigate(`/drogues/${form.categorie
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s*\/\s*/g, '-')
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')}`)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>
  if (!form)   return <div className="admin-vide">Médicament introuvable</div>

  return (
    <div className="admin-page">
      <div className="form-scroll">

        <h1 className="fiche-nom">Personnaliser — {form.nom}</h1>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
          <button className="btn-enregistrer-header" onClick={sauvegarder} disabled={sauvegarde}>
            {sauvegarde ? '...' : 'Enregistrer'}
          </button>
        </div>

        {/* NOM */}
        <div className="form-groupe">
          <label className="form-label">Nom</label>
          <input
            className="form-input"
            value={form.nom}
            onChange={e => handleChange('nom', e.target.value)}
          />
        </div>

        {/* INDICATION */}
        <div className="form-groupe">
          <label className="form-label">Indication</label>
          <input
            className="form-input"
            value={form.indication || ''}
            onChange={e => handleChange('indication', e.target.value)}
          />
        </div>

        {/* ESPÈCES */}
        <div className="form-groupe">
          <label className="form-label">Espèce(s)</label>
          <div className="espece-choisir">
            <span className="espece-choisie-texte">
              {form.especes.length
                ? form.especes.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')
                : 'Aucune espèce choisie'}
            </span>
            <button type="button" className="btn-choisir-espece" onClick={() => setPopupEspece(true)}>
              Choisir
            </button>
          </div>
        </div>

        {/* TYPE DE DOSE */}
        <div className="form-groupe">
          <label className="form-label">Dosage</label>
          <div className="toggle-groupe">
            <button type="button" className={`toggle-btn ${form.type_dose === 'fixe' ? 'actif' : ''}`} onClick={() => handleChange('type_dose', 'fixe')}>Dose fixe</button>
            <button type="button" className={`toggle-btn ${form.type_dose === 'min_max' ? 'actif' : ''}`} onClick={() => handleChange('type_dose', 'min_max')}>Dose min/max</button>
          </div>
          {form.type_dose === 'fixe' ? (
            <div className="input-avec-unite">
              <input className="form-input" type="text" inputMode="decimal" value={form.dose_min} onChange={e => handleChange('dose_min', e.target.value)} />
              <select className="form-select-unite" value={form.unite_dose} onChange={e => handleChange('unite_dose', e.target.value)}>
                {UNITES_DOSE.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          ) : (
            <div className="input-min-max">
              <div className="input-avec-unite">
                <input className="form-input" placeholder="Min" type="text" inputMode="decimal" value={form.dose_min} onChange={e => handleChange('dose_min', e.target.value)} />
                <select className="form-select-unite" value={form.unite_dose} onChange={e => handleChange('unite_dose', e.target.value)}>
                  {UNITES_DOSE.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="input-avec-unite">
                <input className="form-input" placeholder="Max" type="text" inputMode="decimal" value={form.dose_max || ''} onChange={e => handleChange('dose_max', e.target.value)} />
                <span className="unite-fixe">{form.unite_dose}</span>
              </div>
            </div>
          )}
        </div>

        {/* CONCENTRATION */}
        <div className="form-groupe">
          <label className="form-label">Concentration</label>
          <div className="input-avec-unite">
            <input className="form-input" type="text" inputMode="decimal" value={form.concentration} onChange={e => handleChange('concentration', e.target.value)} />
            <select className="form-select-unite" value={form.unite_concentration} onChange={e => handleChange('unite_concentration', e.target.value)}>
              {UNITES_CONC.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* VOIES */}
        <div className="form-groupe">
          <label className="form-label">Voies d'administration</label>
          <div className="voies-liste">
            {VOIES.map(voie => (
              <label key={voie} className="voie-item">
                <span>{voie}</span>
                <input type="checkbox" checked={form.voies_admin.includes(voie)} onChange={() => toggleVoie(voie)} />
              </label>
            ))}
          </div>
        </div>

        {/* INTERACTIONS */}
        <div className="form-groupe">
          <label className="form-label">Interactions médicamenteuses</label>
          <textarea className="form-textarea" value={form.interactions || ''} onChange={e => handleChange('interactions', e.target.value)} rows={4} />
        </div>

        {/* EFFETS SECONDAIRES */}
        <div className="form-groupe">
          <label className="form-label">Effets secondaires</label>
          <textarea className="form-textarea" value={form.effets_secondaires || ''} onChange={e => handleChange('effets_secondaires', e.target.value)} rows={4} />
        </div>

        {/* CONTRE INDICATIONS */}
        <div className="form-groupe">
          <label className="form-label">Contre indications et précautions</label>
          <textarea className="form-textarea" value={form.contre_indications || ''} onChange={e => handleChange('contre_indications', e.target.value)} rows={4} />
        </div>

        {/* NOTES */}
        <div className="form-groupe">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" value={form.notes || ''} onChange={e => handleChange('notes', e.target.value)} rows={4} />
        </div>

        {erreur && <div className="form-erreur">{erreur}</div>}

        <button className="btn-sauvegarder" onClick={sauvegarder} disabled={sauvegarde}>
          {sauvegarde ? 'Sauvegarde...' : 'Enregistrer'}
        </button>

        {customId && (
  <button className="btn-supprimer-medicament" onClick={() => setShowConfirmSupprimer(true)}>
    {form.medicament_id ? 'Réinitialiser aux valeurs de base' : 'Supprimer ce médicament'}
  </button>
)}

      </div>

      {/* POPUP ESPÈCES */}
      {popupEspece && (
        <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Choisir une ou plusieurs espèce(s)</span>
              <button className="popup-close" onClick={() => setPopupEspece(false)}>✕</button>
            </div>
            <div className="popup-especes">
              {[
  { id: 'chien',        label: 'Chien',              icone: '/icone-chien.svg' },
  { id: 'chat',         label: 'Chat',               icone: '/icone-chat.svg' },
  { id: 'cheval',       label: 'Cheval',             icone: '/icone-cheval.png' },
  { id: 'vache',        label: 'Vache',              icone: '/icone-vache.png' },
  { id: 'mouton',       label: 'Mouton',             icone: '/icone-mouton.png' },
  { id: 'lama', label: 'Lama', icone: '/icone-lama.png' },
  { id: 'chevre',       label: 'Chèvre',             icone: '/icone-chevre.png' },
  { id: 'cochon',       label: 'Cochon',             icone: '/icone-cochon.png' },
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
].map(esp => (
  <label key={esp.id} className="popup-espece-item">
    <input type="checkbox" checked={form.especes.includes(esp.id)} onChange={() => toggleEspece(esp.id)} />
    {esp.icone
      ? <img src={esp.icone} alt={esp.label} className="espece-icone-popup" />
      : <div className="espece-icone-popup espece-icone-placeholder"></div>
    }
    <span>{esp.label}</span>
  </label>
))}
            </div>
            <button className="btn-sauvegarder" onClick={() => setPopupEspece(false)}>Confirmer</button>
          </div>
        </div>
      )}
      {showConfirmSupprimer && (
  <div className="popup-overlay" onClick={() => setShowConfirmSupprimer(false)}>
    <div className="popup-card" onClick={e => e.stopPropagation()}>
      <div className="popup-header">
        <span>{form.medicament_id ? 'Réinitialiser' : 'Supprimer le médicament'}</span>
        <button className="popup-close" onClick={() => setShowConfirmSupprimer(false)}>✕</button>
      </div>
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <i className="ti ti-trash" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {form.medicament_id
            ? 'Réinitialiser aux valeurs de base ? Tes modifications seront perdues.'
            : `Supprimer ${form.nom} ? Cette action est irréversible.`}
        </p>
      </div>
      <div className="popup-actions-centrees">
        <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(false)}>
          Annuler
        </button>
        <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={reinitialiser}>
          {form.medicament_id ? 'Réinitialiser' : 'Supprimer'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
