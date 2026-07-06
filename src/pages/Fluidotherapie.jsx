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
  const [uniteDosageCRI, setUniteDosageCRI] = useState('mg/kg/h')
  const [concentrationCRI, setConcentrationCRI] = useState('')

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
    const debitDeficitEtPertes = duree > 0 ? arrondir((deficitFluide + pertes) / duree) : 0
    return arrondir(maintenance + debitDeficitEtPertes)
  }, [maintenance, deficitFluide, pertes, duree])

  useEffect(() => {
    if (debitGttsManuel) return
    if (debitHoraire > 0 && debitHoraire < 100) setFacteurGtts(60)
    else if (debitHoraire >= 100) setFacteurGtts(15)
  }, [debitHoraire, debitGttsManuel])

  const debitPourGtts = parseFloat(debitGttsManuel) || debitHoraire
  const gttsParMin = debitPourGtts > 0 && facteurGtts > 0 && tempsMin > 0
    ? arrondir((debitPourGtts * facteurGtts) / tempsMin, 1)
    : 0
  const gttsParSec = gttsParMin > 0 ? arrondir(gttsParMin / 60, 2) : 0
  const gttsPar15Sec = gttsParMin > 0 ? arrondir(gttsParMin / 4, 1) : 0

  const debitPourCRI = parseFloat(debitCRIManuel) || debitHoraire
  const dureeSac = debitPourCRI > 0 ? arrondir(volumeSac / debitPourCRI, 1) : 0
  const doseChargeVal = parseFloat(doseCharge)
  const dosageCRIVal = parseFloat(dosageCRI)
  const concentrationCRIVal = parseFloat(concentrationCRI)

  const mlDoseCharge = doseChargeVal && poidsKg && concentrationCRIVal
    ? arrondir((doseChargeVal * poidsKg) / concentrationCRIVal)
    : 0

  const dosageCRIHoraire = uniteDosageCRI === 'mg/kg/jour' ? dosageCRIVal / 24 : dosageCRIVal
  const mlDansSac = dosageCRIHoraire && poidsKg && volumeSac && concentrationCRIVal && debitPourCRI
    ? arrondir((dosageCRIHoraire * poidsKg * volumeSac) / (concentrationCRIVal * debitPourCRI))
    : 0

  return (
    <div className="page-calculateurs">
      <div className="fluido-v2">

        {/* INFO BANNER */}
        <div className="fluido-info-banner">
          <i className="ti ti-info-circle"></i>
          <p>Calculez les besoins en fluides et les débits recommandés en quelques étapes.</p>
        </div>

        {/* TOP GRID : Espèce + Poids + Résumé rapide */}
        <div className="fluido-top-grid">

          <div className="fluido-card">
            <div className="fluido-step-header">
              <span className="fluido-step-num">1</span>
              <span className="fluido-step-title">Espèce</span>
            </div>
            <div className="fluido-espece-cards">
              <button
                className={`fluido-espece-card ${espece === 'chien' ? 'active' : ''}`}
                onClick={() => setEspece('chien')}
              >
                <img src="/icone-chien.svg" alt="Chien" />
                <span>Chien</span>
              </button>
              <button
                className={`fluido-espece-card ${espece === 'chat' ? 'active' : ''}`}
                onClick={() => setEspece('chat')}
              >
                <img src="/icone-chat.svg" alt="Chat" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          <div className="fluido-card">
            <div className="fluido-step-header">
              <span className="fluido-step-num">2</span>
              <span className="fluido-step-title">Poids de l'animal</span>
            </div>
            <div className="radio-groupe" style={{ alignSelf: 'flex-start' }}>
              <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
              <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
            </div>
            <div className="champ-input">
             
              <input
                type="text"
                inputMode="decimal"
                value={poids}
                onChange={e => setPoids(e.target.value.replace(',', '.'))}
                placeholder="Ex: 10"
              />
            </div>
          </div>

          <div className="fluido-card fluido-card--resume">
            <p className="fluido-resume-titre">RÉSUMÉ RAPIDE</p>
            <div className="fluido-resume-ligne">
              <span>Débit de maintenance</span>
              <strong>{maintenance > 0 ? `${maintenance} ml/h` : '— ml/h'}</strong>
            </div>
            <div className="fluido-resume-ligne">
              <span>gtts/ml</span>
              <strong>{debitHoraire > 0 ? facteurGtts : '—'}</strong>
            </div>
          </div>
        </div>

        {/* ÉTAPE 3 — Formule de maintenance */}
        <div className="fluido-card">
          <div className="fluido-step-header">
            <span className="fluido-step-num">3</span>
            <span className="fluido-step-title">Formule de débit de maintenance</span>
          </div>
          <div className="fluido-formules">
            {FORMULES[espece].map(f => (
              <button
                key={f.id}
                className={`fluido-formule-btn ${formuleId === f.id ? 'actif' : ''}`}
                onClick={() => setFormuleId(f.id)}
              >
                <span className={`fluido-radio-dot ${formuleId === f.id ? 'checked' : ''}`} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
          {poidsKg > 0 && (
            <p className="range-hint" style={{ marginTop: 4 }}>Maintenance : <strong>{maintenance} ml/h</strong></p>
          )}
        </div>

        {/* ÉTAPES 4 & 5 — Déshydratation + Pertes */}
        <div className="fluido-mid-grid">

          <div className="fluido-card">
            <div className="fluido-step-header">
              <span className="fluido-step-num">4</span>
              <span className="fluido-step-title">Déshydratation</span>
              <span className="fluido-step-val">{dehydratation} %</span>
            </div>
            <input
              type="range" min={0} max={15} step={1}
              value={dehydratation}
              onChange={e => setDehydratation(Number(e.target.value))}
              className="fluido-slider"
            />
            <div className="fluido-slider-labels">
              <span>0 %</span><span>5 %</span><span>10 %</span><span>15 %</span>
            </div>
            {poidsKg > 0 && dehydratation > 0 && (
              <p className="range-hint">Déficit : <strong>{deficitFluide} ml</strong></p>
            )}
            <button className="fluido-btn-tableau" onClick={() => setPopupDeshy(true)}>
              <i className="ti ti-clipboard-list" style={{ fontSize: 22 }}></i>
              <span>Voir le tableau de déshydratation</span>
              <i className="ti ti-chevron-right"></i>
            </button>
          </div>

          <div className="fluido-card">
            <div className="fluido-step-header">
              <span className="fluido-step-num">5</span>
              <span className="fluido-step-title">Pertes en cours</span>
              <span className="fluido-step-val">{pertes} ml</span>
            </div>
            <input
              type="range" min={0} max={1000} step={10}
              value={pertes}
              onChange={e => setPertes(Number(e.target.value))}
              className="fluido-slider"
            />
            <div className="fluido-slider-labels">
              <span>0 ml</span><span>500 ml</span><span>1000 ml</span>
            </div>
          </div>
        </div>

        {/* ÉTAPE 6 — Durée */}
        <div className="fluido-card">
          <div className="fluido-step-header">
            <span className="fluido-step-num">6</span>
            <span className="fluido-step-title">Temps pour remplacer la déshydratation et/ou les pertes en cours</span>
            <span className="fluido-step-val" style={{ whiteSpace: 'nowrap' }}>{duree} h</span>
          </div>
          <input
            type="range" min={1} max={24} step={1}
            value={duree}
            onChange={e => setDuree(Number(e.target.value))}
            className="fluido-slider"
          />
          <div className="fluido-slider-labels">
            <span>1 h</span><span>12 h</span><span>24 h</span>
          </div>
        </div>

        {/* BLOC DÉBIT INITIAL + MAINTENANCE */}
        {poidsKg > 0 && (deficitFluide > 0 || pertes > 0) && (
          <div className="fluido-card fluido-debit-resultat">
            <div className="fluido-debit-bloc">
              <p className="fluido-debit-etiquette">Débit initial</p>
              <p className="fluido-debit-valeur">{debitHoraire} ml/h <span className="fluido-debit-pendant">pendant {duree} h</span></p>
              <p className="fluido-debit-detail">
                Maintenance {maintenance} ml/h + remplacement du déficit et des pertes en cours sur {duree} h
              </p>
            </div>
            <div className="fluido-debit-separateur" />
            <div className="fluido-debit-bloc">
              <p className="fluido-debit-suite">Ensuite réduire au débit de maintenance</p>
              <p className="fluido-debit-valeur">{maintenance} ml/h</p>
            </div>
          </div>
        )}

        {/* RÉSULTATS */}
        <div className="fluido-resultats-section">
          <div className="fluido-resultats-grid">

            {/* GTTS/ML */}
            <div className="fluido-resultats-col">
              <div className="fluido-resultats-col-header">
                <i className="ti ti-droplets"></i>
                <span>CALCULATEUR GTTS/ML</span>
              </div>

              <div className="champ">
                <label>Débit</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={debitGttsManuel !== '' ? debitGttsManuel : debitHoraire || ''}
                    onChange={e => setDebitGttsManuel(e.target.value.replace(',', '.'))}
                    placeholder="ml/h"
                  />
                  <span className="unite-fixe">ml/h</span>
                </div>
              </div>

              <div className="champ">
                <label>Facteur de gtts/ml</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={facteurGtts}
                    onChange={e => { setFacteurGtts(Number(e.target.value)); setDebitGttsManuel(debitGttsManuel || String(debitHoraire)) }}
                  />
                  <span className="unite-fixe">gtts/ml</span>
                </div>
                <p className="range-hint">
                  Microgoutteur (60 gtt/ml)<br />si débit &lt; 100 ml/h<br />
                  Macrogoutteur (10 ou 15 gtt/ml)<br />si débit ≥ 100 ml/h
                </p>
              </div>

              <div className="champ">
                <label>Temps en minutes</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
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
                    <span>Gouttes / 15 sec</span>
                    <strong>{gttsPar15Sec} gtts</strong>
                  </div>
                  <div className="resultat-ligne">
                    <span>Gouttes / sec</span>
                    <strong>{gttsParSec} gtts</strong>
                  </div>
                </div>
              )}
            </div>

            {/* CRI */}
            <div className="fluido-resultats-col">
              <div className="fluido-resultats-col-header">
                <i className="ti ti-droplet"></i>
                <span>CRI</span>
              </div>

              <div className="champ">
                <label>Débit</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={debitCRIManuel !== '' ? debitCRIManuel : debitHoraire || ''}
                    onChange={e => setDebitCRIManuel(e.target.value.replace(',', '.'))}
                    placeholder="ml/h"
                  />
                  <span className="unite-fixe">ml/h</span>
                </div>
              </div>

              <div className="champ">
                <label>Volume du sac de fluide</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={volumeSac}
                    onChange={e => setVolumeSac(Number(e.target.value))}
                  />
                  <span className="unite-fixe">ml</span>
                </div>
                {dureeSac > 0 && (
                  <p className="range-hint" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                    Durée du sac : {dureeSac} hrs
                  </p>
                )}
              </div>

              <div className="champ">
                <label>Dose de charge (facultatif)</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={doseCharge}
                    onChange={e => setDoseCharge(e.target.value.replace(',', '.'))}
                    placeholder="0"
                  />
                  <span className="unite-fixe">mg/kg IV</span>
                </div>
              </div>

              <div className="champ">
                <label>Dosage du CRI</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={dosageCRI}
                    onChange={e => setDosageCRI(e.target.value.replace(',', '.'))}
                    placeholder="0"
                  />
                  <select className="cri-select" value={uniteDosageCRI} onChange={e => setUniteDosageCRI(e.target.value)}>
                    <option value="mg/kg/h">mg/kg/h</option>
                    <option value="mg/kg/jour">mg/kg/jour</option>
                  </select>
                </div>
              </div>

              <div className="champ">
                <label>Concentration</label>
                <div className="champ-input">
                  <input
                    type="text" inputMode="decimal"
                    value={concentrationCRI}
                    onChange={e => setConcentrationCRI(e.target.value.replace(',', '.'))}
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
                    <span>Dans le sac</span>
                    <strong>{mlDansSac} ml</strong>
                  </div>
                  <div className="fluido-instruction">
                    Retirer <strong>{mlDansSac} ml</strong> du sac et ajouter <strong>{mlDansSac} ml</strong> de médication.
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* AVERTISSEMENT */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec le vétérinaire responsable avant d'administrer. Ce calculateur est un outil d'aide, ton jugement clinique prime en tout temps.
        </div>

      </div>

      {/* POPUP TABLEAU DÉSHYDRATATION */}
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
