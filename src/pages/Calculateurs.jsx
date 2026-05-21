import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ─── DÉMARCHE DE CALCUL ───────────────────────────────────
function DemarcheCollapsible({ resultat, poids, unitePoids }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <div className="demarche-card">
      <button className="demarche-header" onClick={() => setOuvert(!ouvert)}>
        <h2>Démarche de calcul</h2>
        <i className={`ti ${ouvert ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
      </button>
      {ouvert && (
        <div className="demarche-contenu">
          <div className="demarche-etape">
            <span className="demarche-num">1</span>
            <div>
              <p className="demarche-titre">Poids converti en kg</p>
              <p className="demarche-calcul">
                {unitePoids === 'lb'
                  ? `${poids} lb ÷ 2,205 = ${resultat.poidsKg} kg`
                  : `${resultat.poidsKg} kg`}
              </p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">2</span>
            <div>
              <p className="demarche-titre">Dose sélectionnée</p>
              <p className="demarche-calcul">{resultat.poso} {resultat.uniteDose}</p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">3</span>
            <div>
              <p className="demarche-titre">Dose totale = poids (kg) × posologie</p>
              <p className="demarche-calcul">
                {resultat.etapeConversion ||
                  `${resultat.poidsKg} kg × ${resultat.poso} ${resultat.uniteDose} = ${resultat.doseTotale} mg`}
              </p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">4</span>
            <div>
              <p className="demarche-titre">Volume = dose totale ÷ concentration</p>
              <p className="demarche-calcul">
                {resultat.doseTotale} mg ÷ {resultat.conc} {resultat.uniteConc} = {resultat.volume} mL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SECTION COLLAPSIBLE ──────────────────────────────────
function SectionCollapsible({ titre, icone, contenu }) {
  const [ouvert, setOuvert] = useState(false)
  if (!contenu) return null
  return (
    <div className="demarche-card">
      <button className="demarche-header" onClick={() => setOuvert(!ouvert)}>
        <h2><i className={`ti ${icone}`} style={{ marginRight: '0.5rem' }}></i>{titre}</h2>
        <i className={`ti ${ouvert ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
      </button>
      {ouvert && (
        <div className="demarche-contenu">
          <p className="section-contenu" style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{contenu}</p>
        </div>
      )}
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────
export default function Calculateurs() {
  const [medicaments, setMedicaments] = useState([])
  const [chargement, setChargement] = useState(true)

  const [medicamentChoisi, setMedicamentChoisi] = useState(null)
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [posologie, setPosologie] = useState('')
  const [concentration, setConcentration] = useState('')
  const [resultat, setResultat] = useState(null)
  const [horsPlage, setHorsPlage] = useState(false)
  const [recherche, setRecherche] = useState('')
  const [dropdownOuvert, setDropdownOuvert] = useState(false)

  // Charger tous les médicaments depuis Supabase
  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from('medicaments')
        .select('*')
        .order('categorie', { ascending: true })
        .order('nom', { ascending: true })
      setMedicaments(data || [])
      setChargement(false)
    }
    charger()
  }, [])

  // Pré-remplir posologie et concentration quand on choisit un médicament
  useEffect(() => {
    if (!medicamentChoisi) return
    setPosologie(medicamentChoisi.dose_min?.toString() || '')
    setConcentration(medicamentChoisi.concentration?.toString() || '')
    setHorsPlage(false)
  }, [medicamentChoisi])

  // Calcul automatique
  useEffect(() => {
    if (!poids || !posologie || !concentration) {
      setResultat(null)
      return
    }

    const poidsKg = unitePoids === 'lb'
      ? Math.round((parseFloat(poids) / 2.205) * 100) / 100
      : parseFloat(poids)

    const uniteDose = medicamentChoisi?.unite_dose || 'mg/kg'
    const uniteConc = medicamentChoisi?.unite_concentration || 'mg/mL'
    const poso = parseFloat(posologie)
    const conc = parseFloat(concentration)

    let doseTotale
    let etapeConversion = null

    if (uniteDose === 'mcg/kg' && uniteConc === 'mg/mL') {
      doseTotale = (poidsKg * poso) / 1000
      etapeConversion = `${poidsKg} kg × ${poso} mcg/kg ÷ 1000 = ${doseTotale.toFixed(2)} mg`
    } else if (uniteDose === 'mg/kg' && uniteConc === 'mcg/mL') {
      doseTotale = poidsKg * poso * 1000
      etapeConversion = `${poidsKg} kg × ${poso} mg/kg × 1000 = ${doseTotale.toFixed(2)} mcg`
    } else {
      doseTotale = poidsKg * poso
    }

    const volume = doseTotale / conc
    const range = getDoseRange()
    if (range) setHorsPlage(poso < range.min || poso > range.max)

    setResultat({
      poidsKg: poidsKg.toFixed(2),
      unitePoids: unitePoids === 'lb' ? `(${poids} lb → ${poidsKg.toFixed(2)} kg)` : '',
      poso,
      doseTotale: doseTotale.toFixed(2),
      volume: volume.toFixed(2),
      uniteDose,
      uniteConc,
      conc,
      etapeConversion,
      voiesAdmin: medicamentChoisi?.voies_admin?.join(', '),
    })
  }, [poids, unitePoids, posologie, concentration, medicamentChoisi])

  function getDoseRange() {
    if (!medicamentChoisi) return null
    const min = parseFloat(medicamentChoisi.dose_min)
    const max = parseFloat(medicamentChoisi.dose_max)
    const unite = medicamentChoisi.unite_dose || 'mg/kg'
    if (!min && !max) return null
    return { min, max, unite, texte: `${min} à ${max} ${unite}` }
  }

  // Grouper par catégorie pour la liste déroulante
  function medsParCategorie() {
    const groupes = {}
    medicaments.forEach(med => {
      if (!groupes[med.categorie]) groupes[med.categorie] = []
      groupes[med.categorie].push(med)
    })
    return groupes
  }

  // Médicaments filtrés pour la recherche
  const medsFiltres = medicaments.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="page-calculateurs">
      {chargement ? (
        <p className="texte-hint">Chargement des médicaments...</p>
      ) : (
        <div className="calc-form">

          {/* Barre de recherche */}
          <div className="champ" style={{ position: 'relative', zIndex: 10 }}>
            <label>Recherche rapide</label>
            <div className="recherche-wrapper">
              <i className="ti ti-search recherche-icone"></i>
              <input
                type="text"
                className="recherche-input"
                placeholder="Rechercher un médicament..."
                value={recherche}
                onChange={e => {
                  setRecherche(e.target.value)
                  setDropdownOuvert(true)
                }}
                onFocus={() => setDropdownOuvert(true)}
              />
              {recherche && (
                <button className="recherche-clear" onClick={() => {
                  setRecherche('')
                  setDropdownOuvert(false)
                }}>
                  <i className="ti ti-x"></i>
                </button>
              )}
            </div>

            {dropdownOuvert && recherche.length > 0 && (
              <div className="recherche-dropdown">
                {medsFiltres.length > 0 ? medsFiltres.map(m => (
                  <div
                    key={m.id}
                    className="recherche-item"
                    onClick={() => {
                      setMedicamentChoisi(m)
                      setRecherche(m.nom)
                      setDropdownOuvert(false)
                    }}
                  >
                    <span className="recherche-nom">{m.nom}</span>
<span className="recherche-cat">
  {m.especes?.join(' / ')} — {m.categorie}
</span>
                  </div>
                )) : (
                  <div className="recherche-vide">Aucun résultat</div>
                )}
              </div>
            )}
          </div>

          {/* Liste déroulante par catégorie */}
          <div className="champ">
  <label>Médicament</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-pill.svg" alt="médicament" />
    </div>
    <select
      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: '1rem', color: 'var(--text-primary)', padding: '8px 0', appearance: 'none', WebkitAppearance: 'none' }}
      value={medicamentChoisi?.id || ''}
      onChange={e => {
        const med = medicaments.find(m => m.id === e.target.value)
        setMedicamentChoisi(med || null)
        setHorsPlage(false)
      }}
    >
      <option value="">-- Choisir un médicament --</option>
      {Object.entries(medsParCategorie()).map(([categorie, meds]) => (
        <optgroup key={categorie} label={categorie}>
          {meds.map(m => (
            <option key={m.id} value={m.id}>
              {m.nom} ({m.especes?.join(', ')})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
    <i className="ti ti-chevron-down" style={{ color: 'var(--text-hint)', fontSize: 16, flexShrink: 0 }}></i>
  </div>
</div>

          {/* Poids */}
          <div className="champ">
  <label>Poids de l'animal</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-poids.svg" alt="poids" />
    </div>
    <input
      type="text"
      inputMode="decimal"
      value={poids}
      onChange={e => setPoids(e.target.value)}
      placeholder="Ex: 5.2"
    />
    <div className="radio-groupe">
      <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
      <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
    </div>
  </div>
</div>

          {/* Posologie */}
          <div className="champ">
  <label>Posologie</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-seringue.svg" alt="posologie" />
    </div>
    <input
      type="text"
      inputMode="decimal"
      value={posologie}
      onChange={e => { setPosologie(e.target.value); setHorsPlage(false) }}
      placeholder="Ex: 0.05"
    />
    <span className="unite-fixe">{medicamentChoisi?.unite_dose || 'mg/kg'}</span>
  </div>
            {getDoseRange() && (
              <p className="range-hint">Plage recommandée : {getDoseRange().texte}</p>
            )}
            {horsPlage && (
              <div className="avertissement-plage">
                <i className="ti ti-alert-triangle"></i>
                Dosage hors de la plage recommandée — veuillez confirmer avec le vétérinaire responsable avant d'administrer.
              </div>
            )}
          </div>

          {/* Concentration */}
        <div className="champ">
  <label>Concentration</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-fluido.svg" alt="concentration" />
    </div>
    <input
      type="text"
      inputMode="decimal"
      value={concentration}
      onChange={e => setConcentration(e.target.value)}
      placeholder="Ex: 10"
    />
    <span className="unite-fixe">{medicamentChoisi?.unite_concentration || 'mg/mL'}</span>
  </div>
          </div>

          {/* Résultats */}
          <div className="resultat-card">
  <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div className="champ-icone-wrapper">
      <img src="/icone-calc.svg" alt="résultats" />
    </div>
    Résultats
  </h2>
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-poids.svg" alt="poids" />
      </div>
      Poids utilisé
    </span>
    <strong>{resultat ? `${resultat.poidsKg} kg ${resultat.unitePoids}` : '—'}</strong>
  </div>
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-seringue.svg" alt="dose" />
      </div>
      Dose totale
    </span>
    <strong>{resultat ? `${resultat.doseTotale} mg` : '—'}</strong>
  </div>
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-fluido.svg" alt="volume" />
      </div>
      Volume à administrer
    </span>
    <strong>{resultat ? `${resultat.volume} mL` : '—'}</strong>
  </div>
  <div className="resultat-ligne">
    <span>Voies d'administration</span>
    <strong>{resultat?.voiesAdmin || '—'}</strong>
  </div>
</div>
            <div className="calc-avertissement">
  <i className="ti ti-alert-circle"></i>
  Valide toujours le dosage avec un vétérinaire avant d'administrer un médicament. Ce calculateur est un outil d'aide, ton jugement clinique prime en tout temps.
</div>

          {/* Démarche */}
          {resultat && (
            <DemarcheCollapsible resultat={resultat} poids={poids} unitePoids={unitePoids} />
          )}

          {/* Infos médicament */}
          <SectionCollapsible
            titre="Indication"
            icone="ti-stethoscope"
            contenu={medicamentChoisi?.indication}
          />
          <SectionCollapsible
            titre="Interactions médicamenteuses"
            icone="ti-alert-circle"
            contenu={medicamentChoisi?.interactions}
          />
          <SectionCollapsible
            titre="Effets secondaires"
            icone="ti-heart-rate-monitor"
            contenu={medicamentChoisi?.effets_secondaires}
          />
          <SectionCollapsible
            titre="Contre indications et précautions"
            icone="ti-ban"
            contenu={medicamentChoisi?.contre_indications}
          />
          <SectionCollapsible
            titre="Notes"
            icone="ti-notes"
            contenu={medicamentChoisi?.notes}
          />

        </div>
      )}
    </div>
  )
}
