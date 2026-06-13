import { useState, useMemo } from 'react'

function arrondir(val, decimales = 1) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

const FACTEURS = [
  { id: 'adulte_entier',  label: 'Adulte entier sédentaire',     facteurMin: 1.2,  facteurMax: null },
  { id: 'adulte_castre',  label: 'Adulte castré / stérilisé',    facteurMin: 1.0,  facteurMax: null },
  { id: 'activite_mod',   label: 'Activité modérée',             facteurMin: 1.4,  facteurMax: null },
  { id: 'tres_actif',     label: 'Très actif / travail intense', facteurMin: 1.6,  facteurMax: 2.0  },
  { id: 'croissance',     label: 'Croissance (chiot / chaton)',  facteurMin: 1.5,  facteurMax: 2.0  },
  { id: 'gestation',      label: 'Gestation (2e moitié)',        facteurMin: 1.6,  facteurMax: 2.0  },
  { id: 'lactation',      label: 'Lactation',                    facteurMin: 2.0,  facteurMax: 6.0  },
  { id: 'perte_poids',    label: 'Perte de poids',               facteurMin: 0.8,  facteurMax: null },,
  { id: 'post_op',        label: 'Post-opératoire',              facteurMin: 1.0,  facteurMax: 1.2  },
  { id: 'infection',      label: 'Infection majeure / sepsis',   facteurMin: 1.2,  facteurMax: 1.5  },
  { id: 'brulures',       label: 'Brûlures sévères',             facteurMin: 1.5,  facteurMax: 2.0  },
  { id: 'senior',         label: 'Senior',                       facteurMin: 0.8,  facteurMax: 0.9  },
]

export default function BesoinEnergetique() {
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [facteurCustom, setFacteurCustom] = useState('')

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

        {/* ─── BEE ────────────────────────────── */}
        <div className="bee-card">
          <p className="bee-titre">Besoin Énergétique d'Entretien (BEE)</p>
          <p className="bee-formule">(30 × poids en kg) + 70 = kcal/jour</p>
          <p className="bee-resultat">{bee > 0 ? `${bee} kcal/jour` : '—'}</p>
        </div>

        {/* ─── FACTEUR PERSONNALISÉ ───────────── */}
        <div className="champ">
          <label>Facteur personnalisé</label>
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
          {beqCustom && (
            <p className="range-hint">BEQ = <strong>{beqCustom} kcal/jour</strong></p>
          )}
        </div>

        {/* ─── TABLEAU DES FACTEURS ───────────── */}
        <div className="bee-tableau">
          <div className="bee-tableau-header">
  <span>Condition</span>
  <span>BEQ (kcal/jour)</span>
</div>
          {FACTEURS.map(f => {
            const beq = calculerBEQ(f.facteurMin, f.facteurMax)
            return (
              <div key={f.id} className="bee-tableau-ligne">
                <div className="bee-tableau-condition">
                  <span className="bee-tableau-label">{f.label}</span>
                  <span className="bee-tableau-facteur">
                    × {f.facteurMin}{f.facteurMax ? ` – ${f.facteurMax}` : ''}
                  </span>
                </div>
                <span className="bee-tableau-resultat">
                  {beq
                    ? beq.max
                      ? `${beq.min} – ${beq.max}`
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
