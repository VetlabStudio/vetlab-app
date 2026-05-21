import { useState, useMemo, useEffect } from 'react'

// ─── TABLEAU DÉSHYDRATATION ───────────────────────────────
const TABLEAU_DESHYDRATATION = [
  { degre: '< 5 %',   signes: 'Aucune anomalie visible.' },
  { degre: '5-6 %',   signes: "Perte modérée de l'élasticité cutanée. Lorsqu'on pince la peau, elle revient légèrement plus lentement à sa position normale. Les muqueuses restent toutefois humides." },
  { degre: '6-8 %',   signes: "Le pli cutané met clairement plus de temps à se remettre en place. Le temps de remplissage capillaire (TRC) peut être prolongé (>2 secondes)." },
  { degre: '10-12 %', signes: "Déshydratation sévère. La peau reste en position pincée, le TRC est très lent, les yeux sont profondément enfoncés et les muqueuses sont sèches, collantes ou pâles." },
  { degre: '12-15 %', signes: "Déshydratation extrême, souvent mortelle. L'état de choc est généralement manifeste, avec effondrement cardiovasculaire et détresse systémique. La mort peut survenir sans traitement d'urgence immédiat." },
]

// ─── FORMULES MAINTENANCE ────────────────────────────────
const FORMULES = {
  chien: [
    { id: 'resting', label: '132 × (Poids en kg)⁰·⁷⁵ ÷ 24 = ml/h', calc: p => 132 * Math.pow(p, 0.75) / 24 },
    { id: 'simple',  label: '60 ml/kg/jour (2,5 ml/kg/h)',           calc: p => (60 * p) / 24 },
    { id: 'linear',  label: '(30 × Poids en kg + 70) ÷ 24 = ml/h',  calc: p => (30 * p + 70) / 24 },
  ],
  chat: [
    { id: 'resting', label: '80 × (Poids en kg)⁰·⁷⁵ ÷ 24 = ml/h',  calc: p => 80 * Math.pow(p, 0.75) / 24 },
    { id: 'simple',  label: '40 ml/kg/jour (1,67 ml/kg/h)',          calc: p => (40 * p) / 24 },
    { id: 'linear',  label: '(30 × Poids en kg + 70) ÷ 24 = ml/h',  calc: p => (30 * p + 70) / 24 },
  ],
}

function arrondir(val, decimales = 2) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

export default function Fluidotherapie() {
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [formuleId, setFormuleId] = useState('resting')
  const [dehydratation, setDehydratation] = useState(0)
  const [popupDeshy, setPopupDeshy] = useState(false)
  const [pertes, setPertes] = useState(0)
  const [duree, setDuree] = useState(24)
  const [facteurGtts, setFacteurGtts] = useState(60)
  const [tempsMin, setTempsMin] = useState(60)
  const [debitGttsManuel, setDebitGttsManuel] = useState('')
  const [volumeSac, setVolumeSac] = useState(500)
  const [debitCRIManuel, setDebitCRIManuel] = useState('')
  const [doseCharge, setDoseCharge] = useState('')
  const [dosageCRI, setDosageCRI] = useState('')
  const [concentrationCRI, setConcentrationCRI] = useState('')

  // ─── CALCULS ─────────────────────────────────────────

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205) : p
  }, [poids, unitePoids])

  const maintenance = useMemo(() => {
    if (poidsKg <= 0) return 0
    const formules = FORMULES[espece]
    const formule = formules.find(f => f.id === formuleId) || formules[0]
    return arrondir(formule.calc(poidsKg))
  }, [poidsKg, espece, formuleId])

  const deficitFluide = useMemo(() => {
    if (poidsKg <= 0) return 0
    return arrondir(poidsKg * (dehydratation / 100) * 1000)
  }, [poidsKg, dehydratation])

  const totalFluide = useMemo(() =>
    maintenance + deficitFluide + pertes
  , [maintenance, deficitFluide, pertes])

const debitHoraire = useMemo(() => {
  console.log('duree:', duree, 'deficit:', deficitFluide, 'pertes:', pertes, 'maintenance:', maintenance)
  const debitDeficitEtPertes = duree > 0 ? arrondir((deficitFluide + pertes) / duree) : 0
  return arrondir(maintenance + debitDeficitEtPertes)
}, [maintenance, deficitFluide, pertes, duree])

  // Ajuster facteur automatiquement si pas de valeur manuelle
  useEffect(() => {
    if (debitGttsManuel) return
    if (debitHoraire > 0 && debitHoraire < 100) setFacteurGtts(60)
    else if (debitHoraire >= 100) setFacteurGtts(15)
  }, [debitHoraire, debitGttsManuel])

  // Gtts
  const debitPourGtts = parseFloat(debitGttsManuel) || debitHoraire
  const gttsParMin = debitPourGtts > 0 && facteurGtts > 0 && tempsMin > 0
    ? arrondir((debitPourGtts * facteurGtts) / tempsMin, 1)
    : 0
  const gttsParSec = gttsParMin > 0 ? arrondir(gttsParMin / 60, 2) : 0
  const gttsPar15Sec = gttsParMin > 0 ? arrondir(gttsParMin / 4, 1) : 0

  // CRI
  const debitPourCRI = parseFloat(debitCRIManuel) || debitHoraire
  const dureeSac = debitPourCRI > 0 ? arrondir(volumeSac / debitPourCRI, 1) : 0
  const doseChargeVal = parseFloat(doseCharge)
  const dosageCRIVal = parseFloat(dosageCRI)
  const concentrationCRIVal = parseFloat(concentrationCRI)

  const mlDoseCharge = doseChargeVal && poidsKg && concentrationCRIVal
    ? arrondir((doseChargeVal * poidsKg) / concentrationCRIVal)
    : 0

  const mlDansSac = dosageCRIVal && poidsKg && volumeSac && concentrationCRIVal && debitPourCRI
    ? arrondir((dosageCRIVal * poidsKg * volumeSac) / (concentrationCRIVal * debitPourCRI))
    : 0

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── ESPÈCE ─────────────────────────── */}
        <div className="champ">
          <label>Choisir l'espèce</label>
          <div className="espece-toggle">
            <span className={`espece-label ${espece === 'chien' ? 'active' : ''}`}>
              <img src="/icone-chien.svg" alt="Chien" className="espece-icone" />
              Chien
            </span>
            <div
              className={`toggle-slider ${espece === 'chat' ? 'droite' : ''}`}
              onClick={() => setEspece(espece === 'chien' ? 'chat' : 'chien')}
            >
              <div className="toggle-thumb"></div>
            </div>
            <span className={`espece-label ${espece === 'chat' ? 'active' : ''}`}>
              <img src="/icone-chat.svg" alt="Chat" className="espece-icone" />
              Chat
            </span>
          </div>
        </div>

        {/* ─── POIDS ──────────────────────────── */}
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
      placeholder="Ex: 10"
    />
    <div className="radio-groupe">
      <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
      <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
    </div>
  </div>
</div>

        {/* ─── FORMULES MAINTENANCE ───────────── */}
        <div className="champ">
          <label>Sélectionner une formule de débit de maintenance</label>
          <div className="fluido-formules">
            {FORMULES[espece].map(f => (
              <button
                key={f.id}
                className={`fluido-formule-btn ${formuleId === f.id ? 'actif' : ''}`}
                onClick={() => setFormuleId(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {poidsKg > 0 && (
            <p className="range-hint">Maintenance : <strong>{maintenance} ml/h</strong></p>
          )}
        </div>

        {/* ─── DÉSHYDRATATION ─────────────────── */}
        <div className="champ">
          <label>Déshydratation</label>
          <div className="fluido-slider-row">
            <span className="fluido-slider-val">{dehydratation} %</span>
          </div>
          <input
            type="range"
            min={0} max={15} step={1}
            value={dehydratation}
            onChange={e => setDehydratation(Number(e.target.value))}
            className="fluido-slider"
          />
          <div className="fluido-slider-labels">
            <span>0 %</span>
            <span>15 %</span>
          </div>
          {poidsKg > 0 && dehydratation > 0 && (
            <p className="range-hint">Déficit en fluide : <strong>{deficitFluide} ml</strong></p>
          )}
          <button className="fluido-btn-tableau" onClick={() => setPopupDeshy(true)}>
            Voir le tableau de déshydratation
          </button>
        </div>

        {/* ─── PERTES EN COURS ────────────────── */}
        <div className="champ">
          <label>Pertes en cours</label>
          <div className="fluido-slider-row">
            <span className="fluido-slider-val">{pertes} ml</span>
          </div>
          <input
            type="range"
            min={0} max={1000} step={10}
            value={pertes}
            onChange={e => setPertes(Number(e.target.value))}
            className="fluido-slider"
          />
          <div className="fluido-slider-labels">
            <span>0 ml</span>
            <span>1000 ml</span>
          </div>
        </div>

        {/* ─── DURÉE ──────────────────────────── */}
        <div className="champ">
          <label>Temps pour remplacer la déshydratation et/ou les pertes en cours</label>
          <div className="fluido-slider-row">
            <span className="fluido-slider-val">{duree} h</span>
          </div>
          <input
            type="range"
            min={1} max={24} step={1}
            value={duree}
            onChange={e => setDuree(Number(e.target.value))}
            className="fluido-slider"
          />
          <div className="fluido-slider-labels">
            <span>1 h</span>
            <span>24 h</span>
          </div>
        </div>

        {/* ─── RÉSULTAT DÉBIT ─────────────────── */}
        {poidsKg > 0 && (
          <div className="fluido-resultat-principal">
            <p className="fluido-resultat-label">Débit initial :</p>
            <p className="fluido-resultat-desc">Maintenance + Déficit + Pertes en cours</p>
            <p className="fluido-resultat-valeur">{debitHoraire} ml/hr pendant {duree} h</p>
          </div>
        )}

        {/* ─── CALCULATEUR GTTS/ML ────────────── */}
        <div className="fluido-section-titre">Calculateur gtts/ml</div>

        <div className="champ">
          <label>Débit</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={debitGttsManuel !== '' ? debitGttsManuel : debitHoraire || ''}
    onChange={e => setDebitGttsManuel(e.target.value)}
    placeholder="ml/h"
  />
  <span className="unite-fixe">ml/h</span>
</div>
        </div>

        <div className="champ">
          <label>Facteur de gtts/ml</label>
         <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={facteurGtts}
    onChange={e => { setFacteurGtts(Number(e.target.value)); setDebitGttsManuel(debitGttsManuel || String(debitHoraire)) }}
  />
  <span className="unite-fixe">gtts/ml</span>
</div>
          <p className="range-hint">
            {debitPourGtts > 0 && debitPourGtts < 100
              ? '💧 Débit < 100 ml/h — utiliser un microgoutteur (60 gtt/ml)'
              : debitPourGtts >= 100
              ? '💧 Débit ≥ 100 ml/h — utiliser un macrogoutteur (10 ou 15 gtt/ml)'
              : 'Microgoutteur (60 gtt/ml) si débit < 100 ml/h — Macrogoutteur (10 ou 15 gtt/ml) si débit ≥ 100 ml/h'}
          </p>
        </div>

        <div className="champ">
          <label>Temps en minutes</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={tempsMin}
    onChange={e => setTempsMin(Number(e.target.value))}
  />
  <span className="unite-fixe">min</span>
</div>
        </div>

        {gttsParMin > 0 && (
          <div className="resultat-card">
            <h2>Débit :</h2>
<div className="resultat-ligne">
  <span>Gouttes aux 15 secondes</span>
  <strong>{gttsPar15Sec} gtts/15 sec</strong>
</div>
<div className="resultat-ligne">
  <span>Gouttes par seconde</span>
  <strong>{gttsParSec} gtts/sec</strong>
</div>
          </div>
        )}

        {/* ─── CRI ────────────────────────────── */}
        <div className="fluido-section-titre">CRI</div>

        <div className="champ">
          <label>Débit</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={debitCRIManuel !== '' ? debitCRIManuel : debitHoraire || ''}
    onChange={e => setDebitCRIManuel(e.target.value)}
    placeholder="ml/h"
  />
  <span className="unite-fixe">ml/h</span>
</div>
        </div>

        <div className="champ">
          <label>Volume du sac de fluide</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={volumeSac}
    onChange={e => setVolumeSac(Number(e.target.value))}
  />
  <span className="unite-fixe">ml</span>
</div>
          {dureeSac > 0 && (
            <p className="range-hint" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
              Durée du sac de fluide : {dureeSac} hrs
            </p>
          )}
        </div>

        <div className="champ">
          <label>Dose de charge (facultatif)</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={doseCharge}
    onChange={e => setDoseCharge(e.target.value)}
    placeholder="0"
  />
  <span className="unite-fixe">mg/kg IV</span>
</div>
        </div>

        <div className="champ">
          <label>Dosage du CRI</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={dosageCRI}
    onChange={e => setDosageCRI(e.target.value)}
    placeholder="0"
  />
  <span className="unite-fixe">mg/kg/h</span>
</div>
        </div>

        <div className="champ">
          <label>Concentration</label>
          <div className="champ-input">
  <input
    type="text"
    inputMode="decimal"
    value={concentrationCRI}
    onChange={e => setConcentrationCRI(e.target.value)}
    placeholder="0"
  />
  <span className="unite-fixe">mg/ml</span>
</div>
        </div>

        {mlDansSac > 0 && (
          <div className="resultat-card">
            {mlDoseCharge > 0 && (
              <div className="resultat-ligne">
                <span>Dose de charge</span>
                <strong>{mlDoseCharge} ml</strong>
              </div>
            )}
            <div className="resultat-ligne">
              <span>À ajouter dans le sac</span>
              <strong>{mlDansSac} ml</strong>
            </div>
            <div className="fluido-instruction">
              Retirer <strong>{mlDansSac} ml</strong> de fluide du sac et ajouter <strong>{mlDansSac} ml</strong> de médication.
            </div>
          </div>
        )}

        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec le vétérinaire responsable avant d'administrer. Ce calculateur est un outil d'aide — ton jugement clinique prime en tout temps.
        </div>

      </div>

      {/* ─── POPUP TABLEAU DÉSHYDRATATION ─────── */}
      {popupDeshy && (
        <div className="popup-overlay" onClick={() => setPopupDeshy(false)}>
          <div className="popup-card popup-large" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Évaluation de l'hydratation</span>
              <button className="popup-close" onClick={() => setPopupDeshy(false)}>✕</button>
            </div>
            <div className="fluido-tableau">
              <div className="fluido-tableau-header">
                <span>Degré de déshydratation</span>
                <span>Signes cliniques</span>
              </div>
              {TABLEAU_DESHYDRATATION.map((row, i) => (
                <div key={i} className="fluido-tableau-row">
                  <span className="fluido-tableau-degre">{row.degre}</span>
                  <span className="fluido-tableau-signes">{row.signes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
