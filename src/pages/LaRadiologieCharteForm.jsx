import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TitreContext } from '../App'
import useCharteRadio from '../hooks/useCharteRadio'
import { regions, qualiteOptions } from '../data/charteRadioOptions'
import { ESPECES_CONFIG } from '../components/IconesEspeces'

const FORM_VIDE = {
  espece: '',
  region: '',
  epaisseur_min: '',
  epaisseur_max: '',
  kv: '',
  mas: '',
  dff: '100',
  grille: false,
  qualite: '',
  notes: '',
}

export default function LaRadiologieCharteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const modeEdition = Boolean(id)
  const { obtenirEntree, creerEntree, modifierEntree } = useCharteRadio()
  const { setTitreCustom } = useContext(TitreContext)

  const [form, setForm] = useState(FORM_VIDE)
  const [loading, setLoading] = useState(modeEdition)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [erreur, setErreur] = useState('')
  const [popupEspece, setPopupEspece] = useState(false)

  useEffect(() => {
    setTitreCustom(modeEdition ? 'Modifier une entrée' : 'Nouvelle entrée')
    if (modeEdition) chargerEntree()
    return () => setTitreCustom('')
  }, [id])

  async function chargerEntree() {
    setLoading(true)
    const { data } = await obtenirEntree(id)
    if (data) {
      setForm({
        espece: data.espece,
        region: data.region,
        epaisseur_min: data.epaisseur_min ?? '',
        epaisseur_max: data.epaisseur_max ?? '',
        kv: data.kv,
        mas: data.mas,
        dff: data.dff,
        grille: data.grille,
        qualite: data.qualite || '',
        notes: data.notes || '',
      })
    }
    setLoading(false)
  }

  function handleChange(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  async function sauvegarder() {
    setErreur('')
    if (!form.espece) return setErreur('L\'espèce est requise.')
    if (!form.region) return setErreur('La région anatomique est requise.')
    if (!form.kv) return setErreur('Le kV est requis.')
    if (!form.mas) return setErreur('Le mAs est requis.')
    if (!form.dff) return setErreur('Le DFF est requis.')

    setSauvegarde(true)
    const payload = {
      espece: form.espece,
      region: form.region,
      epaisseur_min: form.epaisseur_min ? parseFloat(form.epaisseur_min) : null,
      epaisseur_max: form.epaisseur_max ? parseFloat(form.epaisseur_max) : null,
      kv: parseFloat(form.kv),
      mas: parseFloat(form.mas),
      dff: parseFloat(form.dff),
      grille: form.grille,
      qualite: form.qualite || null,
      notes: form.notes || null,
    }

    const { error } = modeEdition
      ? await modifierEntree(id, payload)
      : await creerEntree(payload)

    if (error) { setErreur('Erreur : ' + error.message); setSauvegarde(false); return }

    setSauvegarde(false)
    navigate(-1)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="admin-page">
      <div className="form-scroll">

        <div className="form-groupe">
          <label className="form-label">Espèce</label>
          <div className="espece-choisir">
            <span className="espece-choisie-texte">
              {form.espece ? ESPECES_CONFIG[form.espece]?.label : 'Aucune espèce choisie'}
            </span>
            <button type="button" className="btn-choisir-espece" onClick={() => setPopupEspece(true)}>
              Choisir
            </button>
          </div>
        </div>

        <div className="form-groupe">
          <label className="form-label">Région anatomique</label>
          <select className="form-input form-select" value={form.region} onChange={e => handleChange('region', e.target.value)}>
            <option value="">Sélectionner...</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="form-groupe">
          <label className="form-label">Épaisseur (cm)</label>
          <div className="input-min-max">
            <input className="form-input" placeholder="Min" type="text" inputMode="decimal" value={form.epaisseur_min} onChange={e => handleChange('epaisseur_min', e.target.value)} />
            <input className="form-input" placeholder="Max" type="text" inputMode="decimal" value={form.epaisseur_max} onChange={e => handleChange('epaisseur_max', e.target.value)} />
          </div>
        </div>

        <div className="form-groupe">
          <label className="form-label">kV</label>
          <input className="form-input" type="text" inputMode="decimal" value={form.kv} onChange={e => handleChange('kv', e.target.value)} />
        </div>

        <div className="form-groupe">
          <label className="form-label">mAs</label>
          <input className="form-input" type="text" inputMode="decimal" value={form.mas} onChange={e => handleChange('mas', e.target.value)} />
        </div>

        <div className="form-groupe">
          <label className="form-label">DFF (cm)</label>
          <p className="form-aide">Distance foyer-film (ou distance source-récepteur) : distance entre le tube à rayons X et le détecteur. Généralement 100 cm en clinique.</p>
          <input className="form-input" type="text" inputMode="decimal" value={form.dff} onChange={e => handleChange('dff', e.target.value)} />
        </div>

        <div className="form-groupe">
          <label className="charte-checkbox-item">
            <span className="form-label">Grille antidiffusante</span>
            <input type="checkbox" checked={form.grille} onChange={e => handleChange('grille', e.target.checked)} />
          </label>
        </div>

        <div className="form-groupe">
          <label className="form-label">Qualité du résultat</label>
          <select className="form-input form-select" value={form.qualite} onChange={e => handleChange('qualite', e.target.value)}>
            <option value="">Non précisé</option>
            {qualiteOptions.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
        </div>

        <div className="form-groupe">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={4} />
        </div>

        {erreur && <div className="form-erreur">{erreur}</div>}

        <button className="btn-sauvegarder" onClick={sauvegarder} disabled={sauvegarde}>
          {sauvegarde ? 'Sauvegarde...' : 'Enregistrer'}
        </button>

      </div>

      {popupEspece && (
        <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Choisir une espèce</span>
              <button className="popup-close" onClick={() => setPopupEspece(false)}>✕</button>
            </div>
            <div className="popup-especes">
              {Object.entries(ESPECES_CONFIG).map(([id, esp]) => (
                <label key={id} className="popup-espece-item">
                  <input
                    type="checkbox"
                    checked={form.espece === id}
                    onChange={() => { handleChange('espece', id); setPopupEspece(false) }}
                  />
                  <img src={esp.icone} alt={esp.label} className="espece-icone-popup" />
                  <span>{esp.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
