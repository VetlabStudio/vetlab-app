import { useState, useMemo } from 'react'

function arrondir(val, decimales = 1) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

// ─── FACTEURS PAR ESPÈCE (WSAVA Global Nutrition Toolkit) ──
const FACTEURS = {
  chat: [
    { id: 'castre',     label: 'Adulte castré / stérilisé',           facteurMin: 1.2, facteurMax: 1.4 },
    { id: 'intact',     label: 'Adulte entier',                       facteurMin: 1.4, facteurMax: 1.6 },
    { id: 'inactif',    label: "Inactif / prédisposé à l'obésité",    facteurMin: 1.0, facteurMax: null },
    { id: 'perte_poids',label: 'Perte de poids',                      facteurMin: 0.8, facteurMax: null },
    { id: 'gestation',  label: 'Gestation',                           facteurMin: 1.6, facteurMax: 2.0 },
    { id: 'lactation',  label: 'Lactation',                           facteurMin: 2.0, facteurMax: 6.0 },
    { id: 'croissance', label: 'Croissance (chaton)',                 facteurMin: 2.5, facteurMax: null },
  ],
  chien: [
    { id: 'castre',         label: 'Adulte castré / stérilisé',         facteurMin: 1.4, facteurMax: 1.6 },
    { id: 'intact',         label: 'Adulte entier',                     facteurMin: 1.6, facteurMax: 1.8 },
    { id: 'inactif',        label: "Inactif / prédisposé à l'obésité",  facteurMin: 1.0, facteurMax: 1.2 },
    { id: 'perte_poids',    label: 'Perte de poids',                    facteurMin: 1.0, facteurMax: null },
    { id: 'gestation',      label: 'Gestation (21 derniers jours)',     facteurMin: 3.0, facteurMax: null },
    { id: 'lactation',      label: 'Lactation',                         facteurMin: 3.0, facteurMax: 6.0, plus: true },
    { id: 'croissance_jeune', label: 'Croissance (< 4 mois)',           facteurMin: 3.0, facteurMax: null },
    { id: 'croissance_age',   label: 'Croissance (≥ 4 mois)',           facteurMin: 2.0, facteurMax: null },
    { id: 'travail_leger',  label: 'Travail léger',                     facteurMin: 1.6, facteurMax: 2.0 },
    { id: 'travail_modere', label: 'Travail modéré',                    facteurMin: 2.0, facteurMax: 5.0 },
    { id: 'travail_lourd',  label: 'Travail lourd',                     facteurMin: 5.0, facteurMax: 11.0 },
  ],
}

export default function BesoinEnergetique() {
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [facteurCustom, setFacteurCustom] = useState('')
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

  function calculerBEQ(facteurMin, facteurMax) {
    if (!bee) return null
    const min = arrondir(bee * facteurMin)
    const max = facteurMax ? arrondir(bee * facteurMax) : null
    return { min, max }
  }

  const beqCustom = useMemo(() => {
    const f = parseFloat(facteurCustom)
    if (!f || !bee) return null
    return arrondir(bee * f)
  }, [bee, facteurCustom])

  const tassesParJour = useMemo(() => {
    const k = parseFloat(kcalTasse)
    if (!k || k <= 0 || !beqCustom) return null
    return arrondir(beqCustom / k, 2)
  }, [beqCustom, kcalTasse])

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
          <p className="bee-titre">Besoin Énergétique d'Entretien (BEE)</p>
          <p className="bee-formule">(30 × poids en kg) + 70 = kcal/jour</p>
          <p className="bee-resultat">{bee > 0 ? `${bee} kcal/jour` : '—'}</p>
        </div>

        {/* ─── FACTEUR PERSONNALISÉ ───────────── */}
        <div className="champ">
          <label>Facteur</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-energie.svg" alt="facteur" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={facteurCustom}
              onChange={e => setFacteurCustom(e.target.value.replace(',', '.'))}
              placeholder="Ex: 1.3"
            />
            <span className="unite-fixe">× BEE</span>
          </div>
        </div>

        {/* ─── KCAL PAR TASSE ──────────────────── */}
        <div className="champ">
          <label>Kcal par tasse de nourriture</label>
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

        {/* ─── RÉSULTAT BEQ ────────────────────── */}
        <div className="resultat-card">
          <h2>Besoin Énergétique Quotidien (BEQ)</h2>
          <div className="resultat-ligne">
            <span>BEQ</span>
            <strong>{beqCustom ? `${beqCustom} kcal/jour` : '—'}</strong>
          </div>
          <div className="resultat-ligne">
            <span>Quantité à donner</span>
            <strong>{tassesParJour ? `${tassesParJour} tasse/jour` : '—'}</strong>
          </div>
        </div>

        {/* ─── TABLEAU DES FACTEURS ───────────── */}
        <div className="bee-tableau">
          <div className="bee-tableau-header">
  <span>Condition</span>
  <span>BEQ (kcal/jour)</span>
</div>
          {FACTEURS[espece].map(f => {
            const beq = calculerBEQ(f.facteurMin, f.facteurMax)
            const suffixe = f.plus ? '+' : ''
            return (
              <div key={f.id} className="bee-tableau-ligne">
                <div className="bee-tableau-condition">
                  <span className="bee-tableau-label">{f.label}</span>
                  <span className="bee-tableau-facteur">
                    × {f.facteurMin}{f.facteurMax ? ` – ${f.facteurMax}${suffixe}` : ''}
                  </span>
                </div>
                <span className="bee-tableau-resultat">
                  {beq
                    ? beq.max
                      ? `${beq.min} – ${beq.max}${suffixe}`
                      : `${beq.min}`
                    : '—'}
                </span>
              </div>
            )
          })}
        </div>

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Ces valeurs sont des estimations théoriques. Consulte toujours le vétérinaire responsable pour adapter la ration aux besoins spécifiques de l'animal.
        </div>

      </div>
    </div>
  )
}
