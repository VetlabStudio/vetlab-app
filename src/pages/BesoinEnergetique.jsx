import { useState, useMemo } from 'react'

function arrondir(val, decimales = 1) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

function labelFacteur(f) {
  const suffixe = f.plus ? '+' : ''
  return f.facteurMax
    ? `× ${f.facteurMin} – ${f.facteurMax}${suffixe}`
    : `× ${f.facteurMin}`
}

const FACTEURS = {
  chat: [
    { id: 'castre',      label: 'Adulte castré / stérilisé',          facteurMin: 1.2, facteurMax: 1.4 },
    { id: 'intact',      label: 'Adulte entier',                      facteurMin: 1.4, facteurMax: 1.6 },
    { id: 'inactif',     label: "Inactif / prédisposé à l'obésité",   facteurMin: 1.0, facteurMax: null },
    { id: 'perte_poids', label: 'Perte de poids',                     facteurMin: 0.8, facteurMax: null },
    { id: 'gestation',   label: 'Gestation',                          facteurMin: 1.6, facteurMax: 2.0 },
    { id: 'lactation',   label: 'Lactation',                          facteurMin: 2.0, facteurMax: 6.0 },
    { id: 'croissance',  label: 'Croissance (chaton)',                 facteurMin: 2.5, facteurMax: null },
  ],
  chien: [
    { id: 'castre',           label: 'Adulte castré / stérilisé',       facteurMin: 1.4, facteurMax: 1.6 },
    { id: 'intact',           label: 'Adulte entier',                   facteurMin: 1.6, facteurMax: 1.8 },
    { id: 'inactif',          label: "Inactif / prédisposé à l'obésité",facteurMin: 1.0, facteurMax: 1.2 },
    { id: 'perte_poids',      label: 'Perte de poids',                  facteurMin: 1.0, facteurMax: null },
    { id: 'gestation',        label: 'Gestation (21 derniers jours)',   facteurMin: 3.0, facteurMax: null },
    { id: 'lactation',        label: 'Lactation',                       facteurMin: 3.0, facteurMax: 6.0, plus: true },
    { id: 'croissance_jeune', label: 'Croissance (< 4 mois)',           facteurMin: 3.0, facteurMax: null },
    { id: 'croissance_age',   label: 'Croissance (≥ 4 mois)',           facteurMin: 2.0, facteurMax: null },
    { id: 'travail_leger',    label: 'Travail léger',                   facteurMin: 1.6, facteurMax: 2.0 },
    { id: 'travail_modere',   label: 'Travail modéré',                  facteurMin: 2.0, facteurMax: 5.0 },
    { id: 'travail_lourd',    label: 'Travail lourd',                   facteurMin: 5.0, facteurMax: 11.0 },
  ],
}

export default function BesoinEnergetique() {
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [conditionId, setConditionId] = useState('castre')
  const [kcalTasse, setKcalTasse] = useState('')

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  const bee = useMemo(() => {
    if (!poidsKg) return 0
    return arrondir((30 * poidsKg) + 70)
  }, [poidsKg])

  const facteurs = FACTEURS[espece]

  const conditionSelectionnee = useMemo(
    () => facteurs.find(f => f.id === conditionId) || facteurs[0],
    [facteurs, conditionId]
  )

  function beqRange(f) {
    if (!bee) return null
    const suffixe = f.plus ? '+' : ''
    const min = arrondir(bee * f.facteurMin)
    const max = f.facteurMax ? arrondir(bee * f.facteurMax) : null
    return max ? `${min} – ${max}${suffixe}` : `${min}`
  }

  const beqPrincipal = useMemo(() => {
    if (!bee) return null
    return arrondir(bee * conditionSelectionnee.facteurMin)
  }, [bee, conditionSelectionnee])

  const tassesParJour = useMemo(() => {
    const k = parseFloat(kcalTasse)
    if (!k || k <= 0 || !beqPrincipal) return null
    return arrondir(beqPrincipal / k, 2)
  }, [beqPrincipal, kcalTasse])

  function handleEspece(e) {
    const nouvelleEspece = e
    setEspece(nouvelleEspece)
    setConditionId(FACTEURS[nouvelleEspece][0].id)
  }

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
              onClick={() => handleEspece(espece === 'chien' ? 'chat' : 'chien')}
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
              onChange={e => setPoids(e.target.value.replace(',', '.'))}
              placeholder="Ex: 10"
            />
            <div className="radio-groupe">
              <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
              <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
            </div>
          </div>
        </div>

        {/* ─── BEE ────────────────────────────── */}
        <div className="bee-card">
          <p className="bee-titre">BEE — Besoin Énergétique d'Entretien</p>
          <p className="bee-formule">(30 × poids en kg) + 70 = kcal/jour</p>
          <p className="bee-resultat">{bee > 0 ? `${bee} kcal/jour` : '—'}</p>
        </div>

        {/* ─── CONDITION ──────────────────────── */}
        <div className="champ">
          <label>Condition / stade de vie</label>
          <select
            className="champ-select-native"
            value={conditionId}
            onChange={e => setConditionId(e.target.value)}
          >
            {facteurs.map(f => (
              <option key={f.id} value={f.id}>
                {f.label} — {labelFacteur(f)}
              </option>
            ))}
          </select>
        </div>

        {/* ─── RÉSULTAT BEQ ────────────────────── */}
        {bee > 0 && (
          <div className="bee-beq-card">
            <div className="bee-beq-top">
              <div>
                <p className="bee-beq-label">BEQ estimé</p>
                <p className="bee-beq-valeur">{beqPrincipal ? `${beqPrincipal}` : '—'} <span className="bee-beq-unit">kcal/jour</span></p>
              </div>
              <div className="bee-beq-facteur-badge">{labelFacteur(conditionSelectionnee)}</div>
            </div>
            {conditionSelectionnee.facteurMax && (
              <p className="bee-beq-fourchette">
                Fourchette : {arrondir(bee * conditionSelectionnee.facteurMin)} – {arrondir(bee * conditionSelectionnee.facteurMax)}{conditionSelectionnee.plus ? '+' : ''} kcal/jour
              </p>
            )}
          </div>
        )}

        {/* ─── KCAL PAR TASSE ──────────────────── */}
        <div className="champ">
          <label>Kcal par tasse (optionnel)</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-energie.svg" alt="kcal par tasse" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={kcalTasse}
              onChange={e => setKcalTasse(e.target.value.replace(',', '.'))}
              placeholder="Ex: 475"
            />
            <span className="unite-fixe">kcal/tasse</span>
          </div>
        </div>

        {/* ─── RÉSULTAT TASSES ─────────────────── */}
        {tassesParJour && (
          <div className="resultat-card">
            <div className="resultat-ligne" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <span>Quantité à donner</span>
              <strong>{tassesParJour} tasse{tassesParJour > 1 ? 's' : ''}/jour</strong>
            </div>
          </div>
        )}

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Ces valeurs sont des estimations théoriques. Ajuster selon l'évolution du poids corporel et de la condition corporelle (BCS).
        </div>

      </div>
    </div>
  )
}
