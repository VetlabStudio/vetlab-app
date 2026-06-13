import { useState, useMemo } from 'react'

function arrondir(val, decimales = 3) {
  if (!val || isNaN(val) || !isFinite(val)) return null
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

// ─── MODES ───────────────────────────────────────────────
const MODES = [
  {
    id: 'concentration',
    label: 'Concentration',
    description: 'Calculer une nouvelle concentration',
    formule: 'C1V1 = <span style="color: var(--accent-gold)">C2</span>V2',
    icone: 'ti-test-pipe',
  },
  {
    id: 'diluant',
    label: 'Diluant',
    description: 'Calculer le volume de diluant à ajouter',
    formule: 'V2 - V1',
    icone: 'ti-droplet',
  },
  {
    id: 'volume',
    label: 'Volume',
    description: 'Calculer le volume de départ',
    formule: 'C1<span style="color: var(--accent-gold)">V1</span> = C2V2',
    icone: 'ti-flask',
  },
]

export default function Dilution() {
  const [mode, setMode] = useState('concentration')
  const [uniteC1, setUniteC1] = useState('mg/mL')
  const [uniteC2, setUniteC2] = useState('mg/mL')

  // Champs partagés
  const [c1, setC1] = useState('')
  const [v1, setV1] = useState('')
  const [c2, setC2] = useState('')
  const [v2, setV2] = useState('')

  // ─── CALCULS ─────────────────────────────────────────
  // Convertir concentration selon unité (% → mg/mL : % × 10)
  function toMgMl(val, unite) {
    const v = parseFloat(val)
    if (!v) return null
    return unite === '%' ? v * 10 : v
  }

  // Mode Concentration : C2 = C1V1 / V2
  const resultatConcentration = useMemo(() => {
    const C1 = toMgMl(c1, uniteC1)
    const V1 = parseFloat(v1)
    const V2 = parseFloat(v2)
    if (!C1 || !V1 || !V2) return null
    const c2Val = (C1 * V1) / V2
    return uniteC2 === '%' ? arrondir(c2Val / 10) : arrondir(c2Val)
  }, [c1, v1, v2, uniteC1, uniteC2])

  // Mode Diluant : Vdiluant = V2 - V1, où V2 = C1V1/C2
  const resultatDiluant = useMemo(() => {
    const C1 = toMgMl(c1, uniteC1)
    const V1 = parseFloat(v1)
    const C2 = toMgMl(c2, uniteC2)
    if (!C1 || !V1 || !C2) return null
    const V2 = (C1 * V1) / C2
    const vDiluant = V2 - V1
    if (vDiluant < 0) return null
    return { vDiluant: arrondir(vDiluant), v2Total: arrondir(V2) }
  }, [c1, v1, c2, uniteC1, uniteC2])

  // Mode Volume : V1 = C2V2 / C1
  const resultatVolume = useMemo(() => {
    const C1 = toMgMl(c1, uniteC1)
    const C2 = toMgMl(c2, uniteC2)
    const V2 = parseFloat(v2)
    if (!C1 || !C2 || !V2) return null
    return arrondir((C2 * V2) / C1)
  }, [c1, c2, v2, uniteC1, uniteC2])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── SÉLECTEUR DE MODE ──────────────── */}
        <div className="dilution-modes">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`dilution-mode-btn ${mode === m.id ? 'actif' : ''}`}
              onClick={() => setMode(m.id)}
            >
              <i className={`ti ${m.icone}`}></i>
              <span className="dilution-mode-label">{m.label}</span>
              <span className="dilution-mode-desc">{m.description}</span>
              <span className="dilution-mode-formule" dangerouslySetInnerHTML={{ __html: m.formule }} />
            </button>
          ))}
        </div>

        {/* ─── MODE CONCENTRATION ─────────────── */}
        {mode === 'concentration' && (
          <>
            <div className="champ">
              <label>Concentration initiale (C1)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={c1} onChange={e => setC1(e.target.value.replace(',', '.'))} placeholder="Ex: 10" />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteC1 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC1('mg/mL')}>mg/mL</button>
                  <button className={`radio-btn ${uniteC1 === '%' ? 'active' : ''}`} onClick={() => setUniteC1('%')}>%</button>
                </div>
              </div>
            </div>

            <div className="champ">
              <label>Volume initial (V1)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-flask" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={v1} onChange={e => setV1(e.target.value.replace(',', '.'))} placeholder="Ex: 5" />
                <span className="unite-fixe">mL</span>
              </div>
            </div>

            <div className="champ">
              <label>Volume final (V2)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-flask" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={v2} onChange={e => setV2(e.target.value.replace(',', '.'))} placeholder="Ex: 50" />
                <span className="unite-fixe">mL</span>
              </div>
            </div>

            <div className="dilution-resultat">
              <p className="dilution-resultat-valeur">
                <strong>{resultatConcentration ?? '—'} {uniteC2}</strong> est la nouvelle concentration
              </p>
              <div className="radio-groupe" style={{ justifyContent: 'center', marginTop: 8 }}>
                <button className={`radio-btn ${uniteC2 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC2('mg/mL')}>mg/mL</button>
                <button className={`radio-btn ${uniteC2 === '%' ? 'active' : ''}`} onClick={() => setUniteC2('%')}>%</button>
              </div>
              {resultatConcentration && (
                <p className="dilution-resultat-texte">
                  {v1 || '0'} mL de la solution à {c1 || '0'} {uniteC1} + {arrondir((parseFloat(v2) || 0) - (parseFloat(v1) || 0))} mL de diluant = {v2 || '0'} mL à {resultatConcentration} {uniteC2}
                </p>
              )}
            </div>
          </>
        )}

        {/* ─── MODE DILUANT ───────────────────── */}
        {mode === 'diluant' && (
          <>
            <div className="champ">
              <label>Concentration initiale (C1)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={c1} onChange={e => setC1(e.target.value.replace(',', '.'))} placeholder="Ex: 10" />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteC1 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC1('mg/mL')}>mg/mL</button>
                  <button className={`radio-btn ${uniteC1 === '%' ? 'active' : ''}`} onClick={() => setUniteC1('%')}>%</button>
                </div>
              </div>
            </div>

            <div className="champ">
              <label>Volume initial (V1)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-flask" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={v1} onChange={e => setV1(e.target.value.replace(',', '.'))} placeholder="Ex: 5" />
                <span className="unite-fixe">mL</span>
              </div>
            </div>

            <div className="champ">
              <label>Concentration finale (C2)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={c2} onChange={e => setC2(e.target.value.replace(',', '.'))} placeholder="Ex: 1" />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteC2 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC2('mg/mL')}>mg/mL</button>
                  <button className={`radio-btn ${uniteC2 === '%' ? 'active' : ''}`} onClick={() => setUniteC2('%')}>%</button>
                </div>
              </div>
            </div>

            <div className="dilution-resultat">
              <p className="dilution-resultat-valeur">
                Ajouter <strong>{resultatDiluant?.vDiluant ?? '—'} mL</strong> de diluant
              </p>
              {resultatDiluant && (
                <p className="dilution-resultat-texte">
                  {v1 || '0'} mL de la solution à {c1 || '0'} {uniteC1} + {resultatDiluant.vDiluant} mL de diluant = {resultatDiluant.v2Total} mL à {c2 || '0'} {uniteC2}
                </p>
              )}
            </div>
          </>
        )}

        {/* ─── MODE VOLUME ────────────────────── */}
        {mode === 'volume' && (
          <>
            <div className="champ">
              <label>Concentration initiale (C1)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={c1} onChange={e => setC1(e.target.value.replace(',', '.'))} placeholder="Ex: 10" />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteC1 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC1('mg/mL')}>mg/mL</button>
                  <button className={`radio-btn ${uniteC1 === '%' ? 'active' : ''}`} onClick={() => setUniteC1('%')}>%</button>
                </div>
              </div>
            </div>

            <div className="champ">
              <label>Concentration finale (C2)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={c2} onChange={e => setC2(e.target.value.replace(',', '.'))} placeholder="Ex: 1" />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteC2 === 'mg/mL' ? 'active' : ''}`} onClick={() => setUniteC2('mg/mL')}>mg/mL</button>
                  <button className={`radio-btn ${uniteC2 === '%' ? 'active' : ''}`} onClick={() => setUniteC2('%')}>%</button>
                </div>
              </div>
            </div>

            <div className="champ">
              <label>Volume final (V2)</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-flask" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input type="text" inputMode="decimal" value={v2} onChange={e => setV2(e.target.value.replace(',', '.'))} placeholder="Ex: 50" />
                <span className="unite-fixe">mL</span>
              </div>
            </div>

            <div className="dilution-resultat">
              <p className="dilution-resultat-valeur">
                Prendre <strong>{resultatVolume ?? '—'} mL</strong> de la solution à {c1 || '0'} {uniteC1}
              </p>
              {resultatVolume && (
                <p className="dilution-resultat-texte">
                  {resultatVolume} mL de la solution à {c1 || '0'} {uniteC1} + {arrondir((parseFloat(v2) || 0) - resultatVolume)} mL de diluant = {v2 || '0'} mL à {c2 || '0'} {uniteC2}
                </p>
              )}
            </div>
          </>
        )}

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours tes calculs avec le vétérinaire responsable avant de préparer une solution.
        </div>

      </div>
    </div>
  )
}
