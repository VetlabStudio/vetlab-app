import { useState, useMemo } from 'react'

function arrondir(val, decimales = 4) {
  if (!val || isNaN(val)) return ''
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

// ─── UNITÉS VOLUME ───────────────────────────────────────
const UNITES_VOLUME = [
  { id: 'ml',       label: 'ml',             facteur: 1 },
  { id: 'litre',    label: 'litre',          facteur: 1000 },
  { id: 'oz',       label: 'oz liq.',        facteur: 29.5735 },
  { id: 'tasse',    label: 'tasse',          facteur: 236.588 },
  { id: 'pinte',    label: 'pinte',          facteur: 946.353 },
  { id: 'gallon',   label: 'gallon',         facteur: 3785.41 },
  { id: 'c_the',    label: 'c. à thé',       facteur: 4.92892 },
  { id: 'c_soupe',  label: 'c. à soupe',     facteur: 14.7868 },
]

// ─── UNITÉS MASSE ────────────────────────────────────────
const UNITES_MASSE = [
  { id: 'kg',   label: 'kg',   facteur: 1000000 },
  { id: 'g',    label: 'g',    facteur: 1000 },
  { id: 'mg',   label: 'mg',   facteur: 1 },
  { id: 'mcg',  label: 'mcg',  facteur: 0.001 },
  { id: 'lb',   label: 'lb',   facteur: 453592 },
  { id: 'oz',   label: 'oz',   facteur: 28349.5 },
]

// ─── UNITÉS MESURE ───────────────────────────────────────
const UNITES_MESURE = [
  { id: 'mm',    label: 'mm',    facteur: 1 },
  { id: 'cm',    label: 'cm',    facteur: 10 },
  { id: 'm',     label: 'm',     facteur: 1000 },
  { id: 'pouce', label: 'pouce', facteur: 25.4 },
  { id: 'pied',  label: 'pied',  facteur: 304.8 },
]

// ─── MODES ───────────────────────────────────────────────
const MODES = [
  { id: 'poids', label: 'Poids', icone: 'ti-weight' },
  { id: 'temperature', label: 'Température', icone: 'ti-thermometer' },
  { id: 'volume', label: 'Volume', icone: 'ti-droplet' },
  { id: 'masse', label: 'Masse', icone: 'ti-scale' },
  { id: 'mesure', label: 'Mesures', icone: 'ti-ruler' },
]

function convertir(valeur, uniteSource, uniteCible, unites) {
  const val = parseFloat(valeur)
  if (!val || isNaN(val)) return ''
  const source = unites.find(u => u.id === uniteSource)
  const cible = unites.find(u => u.id === uniteCible)
  if (!source || !cible) return ''
  return arrondir((val * source.facteur) / cible.facteur)
}

export default function Conversion() {
  const [mode, setMode] = useState('poids')

  // ─── POIDS ──────────────────────────────────────
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('lb')

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  const poidsLb = useMemo(() => {
    const p = parseFloat(poids)
    if (!p) return 0
    return unitePoids === 'kg' ? arrondir(p * 2.205, 3) : p
  }, [poids, unitePoids])

  const bsaChien = useMemo(() => {
    if (!poidsKg) return 0
    return arrondir(0.101 * Math.pow(poidsKg, 0.667), 4)
  }, [poidsKg])

  const bsaChat = useMemo(() => {
    if (!poidsKg) return 0
    return arrondir(0.100 * Math.pow(poidsKg, 0.667), 4)
  }, [poidsKg])

  // ─── TEMPÉRATURE ────────────────────────────────
  const [temp, setTemp] = useState('')
  const [uniteTemp, setUniteTemp] = useState('C')

  const tempConvertie = useMemo(() => {
    const t = parseFloat(temp)
    if (isNaN(t) || temp === '') return ''
    if (uniteTemp === 'C') return arrondir((t * 9/5) + 32, 1)
    return arrondir((t - 32) * 5/9, 1)
  }, [temp, uniteTemp])

  // ─── VOLUME ─────────────────────────────────────
  const [volume1, setVolume1] = useState('')
  const [uniteVol1, setUniteVol1] = useState('ml')
  const [uniteVol2, setUniteVol2] = useState('oz')

  const volume2 = useMemo(() =>
    convertir(volume1, uniteVol1, uniteVol2, UNITES_VOLUME)
  , [volume1, uniteVol1, uniteVol2])

  // ─── MASSE ──────────────────────────────────────
  const [masse1, setMasse1] = useState('')
  const [uniteMasse1, setUniteMasse1] = useState('mg')
  const [uniteMasse2, setUniteMasse2] = useState('mcg')

  const masse2 = useMemo(() =>
    convertir(masse1, uniteMasse1, uniteMasse2, UNITES_MASSE)
  , [masse1, uniteMasse1, uniteMasse2])

  // ─── MESURES ────────────────────────────────────
  const [mesure1, setMesure1] = useState('')
  const [uniteMesure1, setUniteMesure1] = useState('cm')
  const [uniteMesure2, setUniteMesure2] = useState('pouce')

  const mesure2 = useMemo(() =>
    convertir(mesure1, uniteMesure1, uniteMesure2, UNITES_MESURE)
  , [mesure1, uniteMesure1, uniteMesure2])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── SÉLECTEUR DE TYPE ──────────────── */}
        <div className="conversion-modes">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`conversion-mode-btn ${mode === m.id ? 'actif' : ''}`}
              onClick={() => setMode(m.id)}
            >
              <i className={`ti ${m.icone}`}></i>
              <span className="conversion-mode-label">{m.label}</span>
            </button>
          ))}
        </div>

        {/* ─── POIDS ──────────────────────────── */}
        {mode === 'poids' && (
          <>
            <div className="champ">
              <label>Poids de l'animal et surface corporelle</label>
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

            <div className="resultat-card">
              <div className="resultat-ligne">
                <span>{unitePoids === 'lb' ? 'Kilogrammes' : 'Livres'}</span>
                <strong>{unitePoids === 'lb' ? `${poidsKg} kg` : `${poidsLb} lb`}</strong>
              </div>
              <div className="resultat-ligne" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Surface corporelle
                </span>
                <span></span>
              </div>
              <div className="resultat-ligne">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src="/icone-chien.svg" alt="chien" style={{ width: 24, height: 24 }} />
                  Chien
                </span>
                <strong>{bsaChien} m²</strong>
              </div>
              <div className="resultat-ligne" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src="/icone-chat.svg" alt="chat" style={{ width: 24, height: 24 }} />
                  Chat
                </span>
                <strong>{bsaChat} m²</strong>
              </div>
            </div>
          </>
        )}

        {/* ─── TEMPÉRATURE ────────────────────── */}
        {mode === 'temperature' && (
          <>
            <div className="champ">
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-thermo.svg" alt="température" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={temp}
                  onChange={e => setTemp(e.target.value.replace(',', '.'))}
                  placeholder={uniteTemp === 'C' ? 'Ex: 38.5' : 'Ex: 101.3'}
                />
                <div className="radio-groupe">
                  <button className={`radio-btn ${uniteTemp === 'C' ? 'active' : ''}`} onClick={() => setUniteTemp('C')}>°C</button>
                  <button className={`radio-btn ${uniteTemp === 'F' ? 'active' : ''}`} onClick={() => setUniteTemp('F')}>°F</button>
                </div>
              </div>
            </div>

            {tempConvertie !== '' && (
              <div className="resultat-card">
                <div className="resultat-ligne" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span>{uniteTemp === 'C' ? 'Fahrenheit' : 'Celsius'}</span>
                  <strong>{tempConvertie} {uniteTemp === 'C' ? '°F' : '°C'}</strong>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── VOLUME ─────────────────────────── */}
        {mode === 'volume' && (
          <div className="conversion-deux-colonnes">
            <div className="champ">
              <label>De</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-fluido.svg" alt="volume" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={volume1}
                  onChange={e => setVolume1(e.target.value.replace(',', '.'))}
                  placeholder="Ex: 100"
                />
              </div>
              <select className="conversion-select" value={uniteVol1} onChange={e => setUniteVol1(e.target.value)}>
                {UNITES_VOLUME.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
            <div className="champ">
              <label>Vers</label>
              <div className="champ-input">
                <span style={{ flex: 1, padding: '8px 8px', fontWeight: 700, color: volume2 ? 'var(--primary)' : 'var(--text-hint)' }}>
                  {volume2 || '—'}
                </span>
              </div>
              <select className="conversion-select" value={uniteVol2} onChange={e => setUniteVol2(e.target.value)}>
                {UNITES_VOLUME.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* ─── MASSE ──────────────────────────── */}
        {mode === 'masse' && (
          <div className="conversion-deux-colonnes">
            <div className="champ">
              <label>De</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-poids.svg" alt="masse" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={masse1}
                  onChange={e => setMasse1(e.target.value.replace(',', '.'))}
                  placeholder="Ex: 500"
                />
              </div>
              <select className="conversion-select" value={uniteMasse1} onChange={e => setUniteMasse1(e.target.value)}>
                {UNITES_MASSE.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
            <div className="champ">
              <label>Vers</label>
              <div className="champ-input">
                <span style={{ flex: 1, padding: '8px 8px', fontWeight: 700, color: masse2 ? 'var(--primary)' : 'var(--text-hint)' }}>
                  {masse2 || '—'}
                </span>
              </div>
              <select className="conversion-select" value={uniteMasse2} onChange={e => setUniteMasse2(e.target.value)}>
                {UNITES_MASSE.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* ─── MESURES ────────────────────────── */}
        {mode === 'mesure' && (
          <div className="conversion-deux-colonnes">
            <div className="champ">
              <label>De</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-regle.svg" alt="mesure" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={mesure1}
                  onChange={e => setMesure1(e.target.value.replace(',', '.'))}
                  placeholder="Ex: 30"
                />
              </div>
              <select className="conversion-select" value={uniteMesure1} onChange={e => setUniteMesure1(e.target.value)}>
                {UNITES_MESURE.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
            <div className="champ">
              <label>Vers</label>
              <div className="champ-input">
                <span style={{ flex: 1, padding: '8px 8px', fontWeight: 700, color: mesure2 ? 'var(--primary)' : 'var(--text-hint)' }}>
                  {mesure2 || '—'}
                </span>
              </div>
              <select className="conversion-select" value={uniteMesure2} onChange={e => setUniteMesure2(e.target.value)}>
                {UNITES_MESURE.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
