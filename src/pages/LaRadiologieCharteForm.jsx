import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TitreContext } from '../context/NavigationContext'
import useCharteRadio from '../hooks/useCharteRadio'
import { traduireErreur } from '../lib/messagesErreur'
import { regions, qualiteOptions } from '../data/charteRadioOptions'
import { ESPECES_CONFIG } from '../data/especes'
import { t } from '../lib/i18n'

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

const ESPECES_RAPIDES = ['chien', 'chat']
const ESPECES_AUTRES = Object.keys(ESPECES_CONFIG).filter(e => !ESPECES_RAPIDES.includes(e))

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
    setTitreCustom(modeEdition ? t('Modifier une entrée') : t('Nouvelle entrée'))
    // L'affichage démarre déjà en chargement en mode édition.
    async function chargerEntree() {
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
    if (modeEdition) chargerEntree()
    return () => setTitreCustom('')
  }, [id, modeEdition, obtenirEntree, setTitreCustom])

  function handleChange(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  async function sauvegarder() {
    setErreur('')
    if (!form.espece) return setErreur(t('L\'espèce est requise.'))
    if (!form.region) return setErreur(t('La région anatomique est requise.'))
    if (!form.kv) return setErreur(t('Le kV est requis.'))
    if (!form.mas) return setErreur(t('Le mAs est requis.'))
    if (!form.dff) return setErreur(t('Le DFF est requis.'))

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

    if (error) { setErreur(traduireErreur(error, "L'entrée n'a pas pu être enregistrée.")); setSauvegarde(false); return }

    setSauvegarde(false)
    navigate(-1)
  }

  const especeAutreActive = form.espece && !ESPECES_RAPIDES.includes(form.espece)

  if (loading) return <div className="admin-loading">{t('Chargement...')}</div>

  return (
    <div className="admin-page">
      <div className="form-scroll">

        {/* ─── ESPÈCE ─────────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('Espèce')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {ESPECES_RAPIDES.map(esp => {
              const config = ESPECES_CONFIG[esp]
              const actif = form.espece === esp
              return (
                <button
                  key={esp}
                  type="button"
                  onClick={() => handleChange('espece', esp)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, padding: '8px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    border: actif ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: actif ? 'rgba(37,77,86,0.08)' : 'var(--bg-card)',
                    minWidth: 72,
                  }}
                >
                  <img src={config.icone} alt={config.label} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: actif ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {config.label}
                  </span>
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPopupEspece(true)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 4, padding: '8px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                border: especeAutreActive ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                background: especeAutreActive ? 'rgba(37,77,86,0.08)' : 'var(--bg-card)',
                minWidth: 72,
              }}
            >
              {especeAutreActive ? (
                <img src={ESPECES_CONFIG[form.espece]?.icone} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              ) : (
                <i className="ti ti-dots" style={{ fontSize: 24, color: 'var(--text-hint)', lineHeight: '28px' }}></i>
              )}
              <span style={{ fontSize: 12, fontWeight: 600, color: especeAutreActive ? 'var(--primary)' : 'var(--text-secondary)' }}>
                {especeAutreActive ? ESPECES_CONFIG[form.espece]?.label : t('Autre')}
              </span>
            </button>
          </div>
        </div>

        {/* ─── RÉGION ─────────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('Région anatomique')}</label>
          <select className="form-input form-select" value={form.region} onChange={e => handleChange('region', e.target.value)}>
            <option value="">{t('Sélectionner...')}</option>
            {regions.map(r => <option key={r} value={r}>{t(r)}</option>)}
          </select>
        </div>

        {/* ─── ÉPAISSEUR ──────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('Épaisseur (cm)')}</label>
          <div className="input-min-max">
            <input className="form-input" placeholder="Min" type="text" inputMode="decimal" value={form.epaisseur_min} onChange={e => handleChange('epaisseur_min', e.target.value)} />
            <input className="form-input" placeholder="Max" type="text" inputMode="decimal" value={form.epaisseur_max} onChange={e => handleChange('epaisseur_max', e.target.value)} />
          </div>
          <p className="form-aide">{t('Mesurée au point le plus épais de la région, avec un compas d\'épaisseur. C\'est elle qui vous permet de retrouver le bon réglage pour un animal de taille semblable.')}</p>
        </div>

        {/* ─── kV + mAs CÔTE À CÔTE ───────────── */}
        <div className="form-groupe">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">kV</label>
              <input className="form-input" type="text" inputMode="decimal" value={form.kv} onChange={e => handleChange('kv', e.target.value)} />
            </div>
            <div>
              <label className="form-label">mAs</label>
              <input className="form-input" type="text" inputMode="decimal" value={form.mas} onChange={e => handleChange('mas', e.target.value)} />
            </div>
          </div>
          <p className="form-aide">{t('Tels qu\'affichés sur la console de l\'appareil pour ce cliché.')}</p>
        </div>

        {/* ─── DFF ────────────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('DFF (cm)')}</label>
          <input className="form-input" type="text" inputMode="decimal" value={form.dff} onChange={e => handleChange('dff', e.target.value)} />
          <p className="form-aide">{t('Distance foyer-film : du tube à rayons X jusqu\'à la plaque. Souvent 100 cm.')}</p>
        </div>

        {/* ─── GRILLE ─────────────────────────── */}
        <div className="form-groupe">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="form-label" style={{ margin: 0 }}>{t('Grille antidiffusante')}</span>
            <button
              type="button"
              onClick={() => handleChange('grille', !form.grille)}
              style={{
                width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: form.grille ? 'var(--primary)' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: form.grille ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
          <p className="form-aide">{t('Activez-la si le cliché a été pris avec la grille.')}</p>
        </div>

        {/* ─── QUALITÉ ────────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('Qualité du résultat')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ value: '', label: t('Non précisé') }, ...qualiteOptions].map(q => (
              <button
                key={q.value}
                type="button"
                onClick={() => handleChange('qualite', q.value)}
                style={{
                  flex: 1, padding: '9px 4px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)',
                  border: form.qualite === q.value ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: form.qualite === q.value ? 'rgba(37,77,86,0.08)' : 'var(--bg-card)',
                  color: form.qualite === q.value ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
          <p className="form-aide">{t('Un réglage « À ajuster » garde la trace d\'un essai à corriger, pour ne pas le refaire.')}</p>
        </div>

        {/* ─── NOTES ──────────────────────────── */}
        <div className="form-groupe">
          <label className="form-label">{t('Notes')}</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} />
        </div>

        {erreur && <div className="form-erreur">{erreur}</div>}

        <button className="btn-sauvegarder" onClick={sauvegarder} disabled={sauvegarde}>
          {sauvegarde ? 'Sauvegarde...' : t('Enregistrer')}
        </button>

      </div>

      {/* ─── POPUP AUTRES ESPÈCES ────────────── */}
      {popupEspece && (
        <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{t('Choisir une espèce')}</span>
              <button className="popup-close" onClick={() => setPopupEspece(false)}>✕</button>
            </div>
            <div className="popup-especes">
              {ESPECES_AUTRES.map(esp => {
                const config = ESPECES_CONFIG[esp]
                return (
                  <label key={esp} className="popup-espece-item">
                    <input
                      type="checkbox"
                      checked={form.espece === esp}
                      onChange={() => { handleChange('espece', esp); setPopupEspece(false) }}
                    />
                    <img src={config.icone} alt={config.label} className="espece-icone-popup" />
                    <span>{config.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
