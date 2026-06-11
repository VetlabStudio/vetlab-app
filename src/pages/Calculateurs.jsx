import { useState, useEffect } from 'react'

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

// ─── PAGE PRINCIPALE ──────────────────────────────────────
export default function Calculateurs() {
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [posologie, setPosologie] = useState('')
  const [uniteDose, setUniteDose] = useState('mg/kg')
  const [concentration, setConcentration] = useState('')
  const [uniteConc, setUniteConc] = useState('mg/mL')
  const [resultat, setResultat] = useState(null)

  // Calcul automatique
  useEffect(() => {
    if (!poids || !posologie || !concentration) {
      setResultat(null)
      return
    }

    const poidsKg = unitePoids === 'lb'
      ? Math.round((parseFloat(poids) / 2.205) * 100) / 100
      : parseFloat(poids)

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
    })
  }, [poids, unitePoids, posologie, uniteDose, concentration, uniteConc])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

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
              onChange={e => setPosologie(e.target.value)}
              placeholder="Ex: 0.05"
            />
            <div className="radio-groupe">
              <button className={`radio-btn ${uniteDose === 'mg/kg' ? 'active' : ''}`} onClick={() => setUniteDose('mg/kg')}>mg/kg</button>
              <button className={`radio-btn ${uniteDose === 'mcg/kg' ? 'active' : ''}`} onClick={() => setUniteDose('mcg/kg')}>mcg/kg</button>
            </div>
          </div>
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
            <div className="radio-groupe">
              <button className={`radio-btn ${uniteConc === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteConc('mg/mL')}>mg/mL</button>
              <button className={`radio-btn ${uniteConc === 'mcg/mL' ? 'active' : ''}`} onClick={() => setUniteConc('mcg/mL')}>mcg/mL</button>
            </div>
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
        </div>

        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec un vétérinaire avant d'administrer un médicament. Ce calculateur est un outil d'aide, ton jugement clinique prime en tout temps.
        </div>

        {/* Démarche */}
        {resultat && (
          <DemarcheCollapsible resultat={resultat} poids={poids} unitePoids={unitePoids} />
        )}

      </div>
    </div>
  )
}
