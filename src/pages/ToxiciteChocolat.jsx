import { useState, useMemo } from 'react'

function arrondir(val, decimales = 1) {
  if (!val || isNaN(val) || !isFinite(val)) return null
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

const TYPES_CHOCOLAT = [
  { id: 'blanc',        label: 'Chocolat blanc',                              theobromine: 0,    description: '~0 mg/g',      danger: null },
  { id: 'lait',         label: 'Chocolat au lait',                            theobromine: 2.5,  description: '~2.5 mg/g',   danger: null },
  { id: 'noir',         label: 'Chocolat noir mi-sucré (50-70%)',             theobromine: 5.3,  description: '~5.3 mg/g',   danger: null },
  { id: 'noir_intense', label: 'Chocolat noir intense / à cuire',             theobromine: 14,   description: '~14 mg/g',    danger: 'attention' },
  { id: 'cacao_inst',   label: 'Cacao instantané (Nesquik, chocolat chaud)', theobromine: 4.8,  description: '~4.8 mg/g',   danger: null },
  { id: 'cacao',        label: 'Cacao pur non sucré (poudre à pâtisserie)',  theobromine: 26,   description: '~26 mg/g',    danger: 'critique' },
]

const COULEUR_DANGER = {
  attention: '#D7A35C',
  critique:  '#702F3A',
}

const SEUILS = [
  { label: 'Premiers symptômes',     min: 20,  max: 40,  couleur: '#D2CA5F' },
  { label: 'Symptômes graves',       min: 40,  max: 80,  couleur: '#D7A35C' },
  { label: 'Potentiellement mortel', min: 80,  max: null, couleur: '#702F3A' },
]

function getNiveau(doseKg) {
  if (doseKg < 20) return null
  if (doseKg < 40) return 'attention'
  if (doseKg < 80) return 'danger'
  return 'critique'
}

export default function ToxiciteChocolat() {
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [typeChocolat, setTypeChocolat] = useState('lait')
  const [quantite, setQuantite] = useState('')
  const [dropdownOuvert, setDropdownOuvert] = useState(false)

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  const chocolat = TYPES_CHOCOLAT.find(t => t.id === typeChocolat)

  const resultat = useMemo(() => {
    const q = parseFloat(quantite)
    if (!q || !poidsKg || !chocolat) return null
    const theobromine = q * chocolat.theobromine
    const doseKg = poidsKg > 0 ? theobromine / poidsKg : 0
    return {
      theobromine: arrondir(theobromine) ?? 0,
      doseKg: arrondir(doseKg, 1) ?? 0,
      niveau: getNiveau(doseKg),
    }
  }, [quantite, poidsKg, chocolat])

  const niveauConfig = {
    attention: { couleur: '#7a6500', bg: '#fff9e0', border: '#D2CA5F', icone: '/icone-avertissement.svg', texte: 'Attention - Symptômes possibles', conseil: "La dose ingérée peut entraîner des symptômes légers (vomissements, diarrhée, agitation). Un suivi clinique est recommandé et une décontamination peut être envisagée si l'ingestion est récente." },
    danger:    { couleur: '#7a4000', bg: '#fff3e0', border: '#D7A35C', icone: '/icone-urgence.svg',       texte: 'Danger - Symptômes graves probables', conseil: 'Dose associée à des symptômes graves (tachycardie, tremblements, convulsions). Une décontamination immédiate et une prise en charge symptomatique sont indiquées. Contacter le centre antipoison vétérinaire au besoin.' },
    critique:  { couleur: '#702F3A', bg: '#ffeaea', border: '#702F3A', icone: '/icone-poison.svg',        texte: 'Dose supérieure à la dose létale minimale connue (80 mg/kg). Prise en charge d\'urgence requise. Si ingestion < 2h : induction des vomissements et charbon activé. Il n\'existe pas d\'antidote : traitement symptomatique uniquement.' },
  }

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Les concentrations en théobromine sont des estimations moyennes, elles varient selon la marque et le pourcentage de cacao. En cas de doute sur la quantité ingérée, utiliser la valeur la plus élevée pour le type de chocolat concerné.
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
              <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => {
                if (unitePoids === 'lb') {
                  const v = parseFloat(poids)
                  if (v > 0) setPoids(String(arrondir(v / 2.205, 2)))
                }
                setUnitePoids('kg')
              }}>kg</button>
              <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => {
                if (unitePoids === 'kg') {
                  const v = parseFloat(poids)
                  if (v > 0) setPoids(String(arrondir(v * 2.205, 1)))
                }
                setUnitePoids('lb')
              }}>lb</button>
            </div>
          </div>
        </div>

        {/* ─── TYPE DE CHOCOLAT — DROPDOWN ────── */}
        <div className="champ">
          <label>Type de chocolat</label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOuvert(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 15, textAlign: 'left', gap: 8,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                {chocolat?.danger && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: COULEUR_DANGER[chocolat.danger],
                  }} />
                )}
                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {chocolat?.label}
                </span>
                <span style={{ color: 'var(--text-hint)', fontSize: 13, flexShrink: 0 }}>
                  {chocolat?.description}
                </span>
              </span>
              <i className={`ti ${dropdownOuvert ? 'ti-chevron-up' : 'ti-chevron-down'}`}
                style={{ color: 'var(--text-hint)', fontSize: 16, flexShrink: 0 }} />
            </button>

            {dropdownOuvert && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10,
                background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              }}>
                {TYPES_CHOCOLAT.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setTypeChocolat(t.id); setDropdownOuvert(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px', background: typeChocolat === t.id ? 'var(--primary)' : 'transparent',
                      color: typeChocolat === t.id ? '#fff' : 'var(--text-primary)',
                      border: 'none', borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer', textAlign: 'left', fontSize: 14,
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: t.danger
                        ? COULEUR_DANGER[t.danger]
                        : typeChocolat === t.id ? 'rgba(255,255,255,0.4)' : 'var(--border)',
                    }} />
                    <span style={{ flex: 1 }}>{t.label}</span>
                    <span style={{
                      fontSize: 12, flexShrink: 0,
                      color: typeChocolat === t.id ? 'rgba(255,255,255,0.7)' : 'var(--text-hint)',
                    }}>
                      {t.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── QUANTITÉ INGÉRÉE ───────────────── */}
        <div className="champ">
          <label>Quantité ingérée en gramme</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-chocolat.svg" alt="chocolat" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={quantite}
              onChange={e => setQuantite(e.target.value.replace(',', '.'))}
              placeholder="Ex: 50"
            />
            <span className="unite-fixe">g</span>
          </div>
        </div>

        {/* ─── RÉSULTATS ───────────────────────── */}
        {resultat && (
          <>
            <div className="resultat-card">
              <h2 style={{ marginBottom: 8 }}>Résultats</h2>
              <div className="resultat-ligne">
                <span>Théobromine ingérée</span>
                <strong>{resultat.theobromine} mg</strong>
              </div>
              <div className="resultat-ligne" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span>Dose par kg de poids</span>
                <strong>{resultat.doseKg} mg/kg</strong>
              </div>
            </div>

            {resultat.niveau ? (
              <div className="choco-alerte" style={{
                background: niveauConfig[resultat.niveau].bg,
                border: `1.5px solid ${niveauConfig[resultat.niveau].border}`,
                color: niveauConfig[resultat.niveau].couleur,
              }}>
                <p className="choco-alerte-titre">
                  <img src={niveauConfig[resultat.niveau].icone}
                    className={`choco-icone-${resultat.niveau}`}
                    style={{ width: 28, height: 28, verticalAlign: 'middle', marginRight: 6 }} />
                  {niveauConfig[resultat.niveau].texte}
                </p>
                <p className="choco-alerte-conseil">{niveauConfig[resultat.niveau].conseil}</p>
              </div>
            ) : (
              <div className="choco-alerte" style={{ background: '#e8f5e9', border: '1.5px solid #81c784', color: '#2e7d32' }}>
                <p className="choco-alerte-titre">
                  <img src="/icone-check.svg" className="choco-icone-check"
                    style={{ width: 18, height: 18, verticalAlign: 'middle', marginRight: 6 }} />
                  Dose sous le seuil de toxicité
                </p>
                <p className="choco-alerte-conseil">La dose calculée est en deçà du seuil clinique. Surveiller l'animal et réévaluer si la quantité réelle ingérée est incertaine.</p>
              </div>
            )}
          </>
        )}

        {/* ─── TABLEAU DE RÉFÉRENCE ───────────── */}
        <div className="choco-tableau">
          <p className="choco-tableau-titre">Seuils de toxicité (théobromine)</p>
          {SEUILS.map((s, i) => (
            <div key={i} className="choco-seuil">
              <span className="choco-seuil-dot" style={{ background: s.couleur }}></span>
              <span className="choco-seuil-label">{s.label}</span>
              <span className="choco-seuil-dose">
                {s.max ? `${s.min}-${s.max} mg/kg` : `> ${s.min} mg/kg`}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
