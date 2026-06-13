import { useState, useMemo } from 'react'

function arrondir(val, decimales = 2) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

export default function CRI() {
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [debit, setDebit] = useState('')
  const [uniteDebit, setUniteDebit] = useState('ml/kg/h')
  const [volumeSac, setVolumeSac] = useState(500)
  const [doseCharge, setDoseCharge] = useState('')
  const [dosageCRI, setDosageCRI] = useState('')
  const [uniteDosage, setUniteDosage] = useState('mg/kg/h')
  const [concentration, setConcentration] = useState('')

  // ─── CALCULS ─────────────────────────────────────────

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205) : p
  }, [poids, unitePoids])

  const debitMlH = useMemo(() => {
    const d = parseFloat(debit)
    if (!d) return 0
    if (uniteDebit === 'ml/h') return arrondir(d)
    if (!poidsKg) return 0
    return arrondir(d * poidsKg)
  }, [debit, poidsKg, uniteDebit])

  const dureeSac = useMemo(() => {
    if (!debitMlH || !volumeSac) return 0
    return arrondir(volumeSac / debitMlH, 1)
  }, [debitMlH, volumeSac])

  const doseChargeVal = parseFloat(doseCharge)
  const dosageCRIVal = parseFloat(dosageCRI)
  const concentrationVal = parseFloat(concentration)

  const mlDoseCharge = useMemo(() => {
    if (!doseChargeVal || !poidsKg || !concentrationVal) return 0
    return arrondir((doseChargeVal * poidsKg) / concentrationVal)
  }, [doseChargeVal, poidsKg, concentrationVal])

  const mlDansSac = useMemo(() => {
    if (!dosageCRIVal || !poidsKg || !volumeSac || !concentrationVal || !debitMlH) return 0
    const dosageHoraire = uniteDosage === 'mg/kg/jour' ? dosageCRIVal / 24 : dosageCRIVal
    return arrondir((dosageHoraire * poidsKg * volumeSac) / (concentrationVal * debitMlH))
  }, [dosageCRIVal, poidsKg, volumeSac, concentrationVal, debitMlH, uniteDosage])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

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
    onChange={e => setPoids(e.target.value.replace(',', '.'))}
    placeholder="Ex: 10"
  />
  <div className="radio-groupe">
    <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
    <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
  </div>
</div>
        </div>

        {/* DÉBIT */}
<div className="champ">
  <label>Débit</label>
<div className="champ-input">
  <div className="champ-icone-wrapper">
    <img src="/icone-debit.svg" alt="débit" />
  </div>
  <input
    type="text"
    inputMode="decimal"
    value={debit}
    onChange={e => setDebit(e.target.value.replace(',', '.'))}
    placeholder="Ex: 5"
  />
  <select className="cri-select" value={uniteDebit} onChange={e => setUniteDebit(e.target.value)}>
    <option value="ml/kg/h">ml/kg/h</option>
    <option value="ml/h">ml/h</option>
  </select>
</div>
  {debitMlH > 0 && uniteDebit === 'ml/kg/h' && (
    <p className="range-hint">Débit : <strong>{debitMlH} ml/h</strong></p>
  )}
</div>

        {/* ─── VOLUME SAC ─────────────────────── */}
        <div className="champ">
          <label>Volume du sac de fluide</label>
         <div className="champ-input">
  <div className="champ-icone-wrapper">
    <img src="/icone-sac.svg" alt="volume" />
  </div>
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

        {/* ─── DOSE DE CHARGE ─────────────────── */}
        <div className="champ">
          <label>Dose de charge (facultatif)</label>
         <div className="champ-input">
  <div className="champ-icone-wrapper">
    <img src="/icone-seringue.svg" alt="dose de charge" />
  </div>
  <input
    type="text"
    inputMode="decimal"
    value={doseCharge}
    onChange={e => setDoseCharge(e.target.value.replace(',', '.'))}
    placeholder="0"
  />
  <span className="unite-fixe">mg/kg IV</span>
</div>
        </div>

        {/* DOSAGE CRI */}
<div className="champ">
  <label>Dosage du CRI</label>
  <div className="champ-input">
  <div className="champ-icone-wrapper">
    <img src="/icone-dosage.svg" alt="dosage" />
  </div>
  <input
    type="text"
    inputMode="decimal"
    value={dosageCRI}
    onChange={e => setDosageCRI(e.target.value.replace(',', '.'))}
    placeholder="0"
  />
  <select className="cri-select" value={uniteDosage} onChange={e => setUniteDosage(e.target.value)}>
    <option value="mg/kg/h">mg/kg/h</option>
    <option value="mg/kg/jour">mg/kg/jour</option>
  </select>
</div>
</div>

        {/* ─── CONCENTRATION ──────────────────── */}
        <div className="champ">
          <label>Concentration</label>
          <div className="champ-input">
  <div className="champ-icone-wrapper">
    <img src="/icone-seringue.svg" alt="concentration" />
  </div>
  <input
    type="text"
    inputMode="decimal"
    value={concentration}
    onChange={e => setConcentration(e.target.value.replace(',', '.'))}
    placeholder="0"
  />
  <span className="unite-fixe">mg/ml</span>
</div>
        </div>

        {/* ─── RÉSULTATS ──────────────────────── */}
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

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec un vétérinaire responsable avant d'administrer. Ce calculateur est un outil d'aide, ton jugement clinique prime en tout temps.
        </div>

      </div>
    </div>
  )
}
