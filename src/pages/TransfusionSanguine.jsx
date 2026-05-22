import { useState, useMemo } from 'react'

function arrondir(val, decimales = 1) {
  if (!val || isNaN(val) || !isFinite(val)) return null
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

// Volume sanguin selon espèce (mL/kg)
const VOLUME_SANGUIN = { chien: 90, chat: 60 }

export default function TransfusionSanguine() {
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [pcvActuel, setPcvActuel] = useState('')
  const [pcvSouhaite, setPcvSouhaite] = useState('')
  const [pcvDonneur, setPcvDonneur] = useState('')

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  const volumeTransfusion = useMemo(() => {
    const pcvA = parseFloat(pcvActuel)
    const pcvS = parseFloat(pcvSouhaite)
    const pcvD = parseFloat(pcvDonneur)
    if (!poidsKg || !pcvA || !pcvS || !pcvD) return null
    if (pcvS <= pcvA) return null
    const volSanguin = VOLUME_SANGUIN[espece]
    return arrondir(((pcvS - pcvA) / pcvD) * volSanguin * poidsKg)
  }, [poidsKg, pcvActuel, pcvSouhaite, pcvDonneur, espece])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── ESPÈCE ─────────────────────────── */}
        <div className="champ">
          <label>Espèce</label>
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
          <p className="range-hint">
            Volume sanguin utilisé : <strong>{VOLUME_SANGUIN[espece]} mL/kg</strong>
          </p>
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

        {/* ─── PCV ACTUEL ET SOUHAITÉ ──────────── */}
        <div className="conversion-deux-colonnes">
          <div className="champ">
            <label>Hématocrite actuel du patient (Ht)</label>
            <div className="champ-input">
              <div className="champ-icone-wrapper">
                <img src="/icone-sang.svg" alt="PCV actuel" />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={pcvActuel}
                onChange={e => setPcvActuel(e.target.value)}
                placeholder="Ex: 15"
              />
              <span className="unite-fixe">%</span>
            </div>
          </div>
          <div className="champ">
            <label>Hématocrite souhaité (Ht)</label>
            <div className="champ-input">
              <div className="champ-icone-wrapper">
                <img src="/icone-sang.svg" alt="PCV souhaité" />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={pcvSouhaite}
                onChange={e => setPcvSouhaite(e.target.value)}
                placeholder="Ex: 25"
              />
              <span className="unite-fixe">%</span>
            </div>
          </div>
        </div>

        {/* ─── PCV DONNEUR ────────────────────── */}
        <div className="champ">
          <label>Hématocrite du donneur (Ht)</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-sang.svg" alt="PCV donneur" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={pcvDonneur}
              onChange={e => setPcvDonneur(e.target.value)}
              placeholder="Ex: 45"
            />
            <span className="unite-fixe">%</span>
          </div>
        </div>

        {/* ─── RÉSULTAT ───────────────────────── */}
        <div className="fluido-resultat-principal">
          <p className="fluido-resultat-label">Volume à transfuser :</p>
          <p className="fluido-resultat-desc">
  (Ht souhaité – Ht actuel) / Ht donneur × {VOLUME_SANGUIN[espece]} mL/kg × poids
</p>
          <p className="fluido-resultat-valeur">
            {volumeTransfusion !== null ? `${volumeTransfusion} mL` : '—'}
          </p>
        </div>

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours avec le vétérinaire responsable avant d'administrer. Surveiller attentivement les réactions transfusionnelles durant toute la procédure.
        </div>

      </div>
    </div>
  )
}
