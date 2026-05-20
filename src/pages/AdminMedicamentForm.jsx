import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Anesthésiques / Analgésiques',
  'Antibiotiques',
  'Antidiarrhéiques',
  'Antiémétiques',
  'Antihistaminiques',
  'Urgence',
  'Cardiovasculaires',
  'Gastroprotecteurs',
  'Neurologiques',
  'Respiratoires',
  'Antagonistes',
]

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

const VIDE = {
  nom: '',
  categorie: '',
  especes: [],
  indication: '',
  type_dose: 'fixe',
  dose_min: '',
  dose_max: '',
  unite_dose: 'mg/kg',
  concentration: '',
  unite_concentration: 'mg/mL',
  voies_admin: [],
  sous_categories: [],
  interactions: '',
  effets_secondaires: '',
  contre_indications: '',
  notes: '',
}

export default function AdminMedicamentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const estNouveau = !id || id === 'nouveau'

  const [form, setForm] = useState(VIDE)
  const [loading, setLoading] = useState(!estNouveau)
  const [popupEspece, setPopupEspece] = useState(false)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [erreur, setErreur] = useState('')
  const [sousCategoriesDisponibles, setSousCategoriesDisponibles] = useState([])

  useEffect(() => {
    if (!estNouveau) chargerMedicament()
  }, [id])

  useEffect(() => {
    async function chargerSousCategories() {
      if (!form.categorie) return
      const { data } = await supabase
        .from('sous_categories')
        .select('*')
        .eq('categorie', form.categorie)
        .order('ordre', { ascending: true })
      setSousCategoriesDisponibles(data || [])
    }
    chargerSousCategories()
  }, [form.categorie])

  async function chargerMedicament() {
    const { data, error } = await supabase
      .from('medicaments')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      setForm({
        ...data,
        especes: data.especes || [],
        type_dose: data.dose_max ? 'min_max' : 'fixe',
        voies_admin: data.voies_admin || [],
        sous_categories: data.sous_categories || [],
        interactions: data.interactions || '',
        effets_secondaires: data.effets_secondaires || '',
        contre_indications: data.contre_indications || '',
        notes: data.notes || '',
        indication: data.indication || '',
      })
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

  function toggleSousCategorie(nom) {
    setForm(prev => {
      const current = prev.sous_categories || []
      return {
        ...prev,
        sous_categories: current.includes(nom)
          ? current.filter(s => s !== nom)
          : [...current, nom],
      }
    })
  }
  async function supprimerMedicament() {
    if (!confirm('Supprimer ce médicament ?')) return
    const { error } = await supabase.from('medicaments').delete().eq('id', id)
    if (!error) navigate('/admin/medicaments')
  }

  async function sauvegarder() {
    setErreur('')
    if (!form.nom.trim())     return setErreur('Le nom est requis.')
    if (!form.categorie)      return setErreur('La catégorie est requise.')
    if (!form.especes.length) return setErreur('Choisir au moins une espèce.')
    if (!form.dose_min)       return setErreur('La dose est requise.')
    if (!form.concentration)  return setErreur('La concentration est requise.')

    setSauvegarde(true)

    const basePayload = {
      nom:                 form.nom.trim(),
      categorie:           form.categorie,
      indication:          form.indication,
      dose_min:            parseFloat(form.dose_min),
      dose_max:            form.type_dose === 'min_max' && form.dose_max
                             ? parseFloat(form.dose_max) : null,
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
    }

    if (estNouveau) {
      const { error } = await supabase.from('medicaments').insert(basePayload)
      if (error) {
        setErreur('Erreur : ' + error.message)
        setSauvegarde(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('medicaments')
        .update(basePayload)
        .eq('id', id)
      if (error) {
        setErreur('Erreur : ' + error.message)
        setSauvegarde(false)
        return
      }
    }

    setSauvegarde(false)
    navigate('/admin/medicaments')
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

 return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="btn-retour" onClick={() => navigate(-1)}>←</button>
        <h1>{estNouveau ? 'Ajouter un médicament' : 'Modifier'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className="form-scroll">

        {/* BOUTON ENREGISTRER EN HAUT */}
        {!estNouveau && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
            <button className="btn-enregistrer-header" onClick={sauvegarder} disabled={sauvegarde}>
              {sauvegarde ? '...' : 'Enregistrer'}
            </button>
          </div>
        )}

        {/* NOM */}
        <div className="form-groupe">
          <label className="form-label">Nom *</label>
          <input
            className="form-input"
            placeholder="Nom du médicament"
            value={form.nom}
            onChange={e => handleChange('nom', e.target.value)}
          />
        </div>

        {/* INDICATION */}
        <div className="form-groupe">
          <label className="form-label">Indication</label>
          <input
            className="form-input"
            placeholder="Indication clinique"
            value={form.indication}
            onChange={e => handleChange('indication', e.target.value)}
          />
        </div>

        {/* CATÉGORIE */}
        <div className="form-groupe">
          <label className="form-label">Catégorie *</label>
          <select
            className="form-input form-select"
            value={form.categorie}
            onChange={e => handleChange('categorie', e.target.value)}
          >
            <option value="">Choisir une catégorie</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* SOUS-CATÉGORIES */}
        {sousCategoriesDisponibles.length > 0 && (
          <div className="form-groupe">
            <label className="form-label">Sous-catégorie(s)</label>
            <div className="voies-liste">
              {sousCategoriesDisponibles.map(sc => (
                <label key={sc.id} className="voie-item">
                  <span>{sc.nom}</span>
                  <input
                    type="checkbox"
                    checked={(form.sous_categories || []).includes(sc.nom)}
                    onChange={() => toggleSousCategorie(sc.nom)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ESPÈCES */}
        <div className="form-groupe">
          <label className="form-label">Espèce(s) *</label>
          <div className="espece-choisir">
            <span className="espece-choisie-texte">
              {form.especes.length
                ? form.especes.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')
                : 'Aucune espèce choisie'}
            </span>
            <button
              type="button"
              className="btn-choisir-espece"
              onClick={() => setPopupEspece(true)}
            >
              Choisir
            </button>
          </div>
        </div>

        {/* TYPE DE DOSE */}
        <div className="form-groupe">
          <label className="form-label">Dosage *</label>
          <div className="toggle-groupe">
            <button
              type="button"
              className={`toggle-btn ${form.type_dose === 'fixe' ? 'actif' : ''}`}
              onClick={() => handleChange('type_dose', 'fixe')}
            >
              Dose fixe
            </button>
            <button
              type="button"
              className={`toggle-btn ${form.type_dose === 'min_max' ? 'actif' : ''}`}
              onClick={() => handleChange('type_dose', 'min_max')}
            >
              Dose min/max
            </button>
          </div>

          {form.type_dose === 'fixe' ? (
            <div className="input-avec-unite">
              <input
                className="form-input"
                placeholder="Dose"
                type="text"
                inputMode="decimal"
                value={form.dose_min}
                onChange={e => handleChange('dose_min', e.target.value)}
              />
              <select
                className="form-select-unite"
                value={form.unite_dose}
                onChange={e => handleChange('unite_dose', e.target.value)}
              >
                {UNITES_DOSE.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          ) : (
            <div className="input-min-max">
              <div className="input-avec-unite">
                <input
                  className="form-input"
                  placeholder="Dose min"
                  type="text"
                  inputMode="decimal"
                  value={form.dose_min}
                  onChange={e => handleChange('dose_min', e.target.value)}
                />
                <select
                  className="form-select-unite"
                  value={form.unite_dose}
                  onChange={e => handleChange('unite_dose', e.target.value)}
                >
                  {UNITES_DOSE.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="input-avec-unite">
                <input
                  className="form-input"
                  placeholder="Dose max"
                  type="text"
                  inputMode="decimal"
                  value={form.dose_max}
                  onChange={e => handleChange('dose_max', e.target.value)}
                />
                <span className="unite-fixe">{form.unite_dose}</span>
              </div>
            </div>
          )}
        </div>

        {/* CONCENTRATION */}
        <div className="form-groupe">
          <label className="form-label">Concentration *</label>
          <div className="input-avec-unite">
            <input
              className="form-input"
              placeholder="Concentration"
              type="text"
              inputMode="decimal"
              value={form.concentration}
              onChange={e => handleChange('concentration', e.target.value)}
            />
            <select
              className="form-select-unite"
              value={form.unite_concentration}
              onChange={e => handleChange('unite_concentration', e.target.value)}
            >
              {UNITES_CONC.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* VOIES D'ADMINISTRATION */}
        <div className="form-groupe">
          <label className="form-label">Voies d'administration</label>
          <div className="voies-liste">
            {VOIES.map(voie => (
              <label key={voie} className="voie-item">
                <span>{voie}</span>
                <input
                  type="checkbox"
                  checked={form.voies_admin.includes(voie)}
                  onChange={() => toggleVoie(voie)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* INTERACTIONS */}
        <div className="form-groupe">
          <label className="form-label">Interactions médicamenteuses</label>
          <textarea
            className="form-textarea"
            placeholder="Interactions..."
            value={form.interactions}
            onChange={e => handleChange('interactions', e.target.value)}
            rows={4}
          />
        </div>

        {/* EFFETS SECONDAIRES */}
        <div className="form-groupe">
          <label className="form-label">Effets secondaires</label>
          <textarea
            className="form-textarea"
            placeholder="Effets secondaires..."
            value={form.effets_secondaires}
            onChange={e => handleChange('effets_secondaires', e.target.value)}
            rows={4}
          />
        </div>

        {/* CONTRE INDICATIONS */}
        <div className="form-groupe">
          <label className="form-label">Contre indications et précautions</label>
          <textarea
            className="form-textarea"
            placeholder="Contre indications..."
            value={form.contre_indications}
            onChange={e => handleChange('contre_indications', e.target.value)}
            rows={4}
          />
        </div>

        {/* NOTES */}
        <div className="form-groupe">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Notes..."
            value={form.notes}
            onChange={e => handleChange('notes', e.target.value)}
            rows={4}
          />
        </div>

       {erreur && <div className="form-erreur">{erreur}</div>}

{!estNouveau && (
  <button className="btn-supprimer-medicament" onClick={supprimerMedicament}>
    Supprimer le médicament
  </button>
)}

<button
  className="btn-sauvegarder"
  onClick={sauvegarder}
  disabled={sauvegarde}
>
  {sauvegarde ? 'Sauvegarde...' : estNouveau ? 'Ajouter' : 'Enregistrer'}
</button>

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
                { id: 'chien', label: 'Chien', icone: '/icone-chien.svg' },
                { id: 'chat',  label: 'Chat',  icone: '/icone-chat.svg'  },
              ].map(esp => (
                <label key={esp.id} className="popup-espece-item">
                  <input
                    type="checkbox"
                    checked={form.especes.includes(esp.id)}
                    onChange={() => toggleEspece(esp.id)}
                  />
                  <img src={esp.icone} alt={esp.label} className="espece-icone-popup" />
                  <span>{esp.label}</span>
                </label>
              ))}
            </div>
            <button
              className="btn-sauvegarder"
              onClick={() => setPopupEspece(false)}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
