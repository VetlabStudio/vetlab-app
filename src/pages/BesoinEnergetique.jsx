import { useState, useMemo, useEffect } from 'react'

function arrondir(val, decimales = 1) {
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

function labelFacteur(f) {
  const suffixe = f.plus ? '+' : ''
  return f.facteurMax
    ? `× ${f.facteurMin} – ${f.facteurMax}${suffixe}`
    : `× ${f.facteurMin}`
}

const REPAS = [1, 2, 3, 4]

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
    { id: 'castre',           label: 'Adulte castré / stérilisé',        facteurMin: 1.4, facteurMax: 1.6 },
    { id: 'intact',           label: 'Adulte entier',                    facteurMin: 1.6, facteurMax: 1.8 },
    { id: 'inactif',          label: "Inactif / prédisposé à l'obésité", facteurMin: 1.0, facteurMax: 1.2 },
    { id: 'perte_poids',      label: 'Perte de poids',                   facteurMin: 1.0, facteurMax: null },
    { id: 'gestation',        label: 'Gestation (21 derniers jours)',    facteurMin: 3.0, facteurMax: null },
    { id: 'lactation',        label: 'Lactation',                        facteurMin: 3.0, facteurMax: 6.0, plus: true },
    { id: 'croissance_jeune', label: 'Croissance (< 4 mois)',            facteurMin: 3.0, facteurMax: null },
    { id: 'croissance_age',   label: 'Croissance (≥ 4 mois)',            facteurMin: 2.0, facteurMax: null },
    { id: 'travail_leger',    label: 'Travail léger',                    facteurMin: 1.6, facteurMax: 2.0 },
    { id: 'travail_modere',   label: 'Travail modéré',                   facteurMin: 2.0, facteurMax: 5.0 },
    { id: 'travail_lourd',    label: 'Travail lourd',                    facteurMin: 5.0, facteurMax: 11.0 },
  ],
}

export default function BesoinEnergetique() {
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [conditionId, setConditionId] = useState('castre')
  const [uniteNourriture, setUniteNourriture] = useState('kg')
  const [kcalNourriture, setKcalNourriture] = useState('')
  const [facteurPerso, setFacteurPerso] = useState(false)
  const [facteurCustom, setFacteurCustom] = useState('')
  const [nbRepas, setNbRepas] = useState(2)
  const [copie, setCopie] = useState(false)

  /* Hauteur réelle de la barre de navigation, pour que la barre
     de résultat se pose juste au-dessus sur tous les appareils. */
  useEffect(() => {
    const nav = document.querySelector('.bottom-nav-v2')
    if (!nav) return
    const appliquer = () => {
      document.documentElement.style.setProperty('--calc-nav-h', `${nav.offsetHeight}px`)
    }
    appliquer()
    const ro = new ResizeObserver(appliquer)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [])

  // ─── CALCULS ─────────────────────────────────────────

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  /* BEE arrondi à l'unité : la chaîne BEE → BEQ reste vérifiable
     à la main par les étudiants, sans décimales fantômes. */
  const bee = useMemo(() => {
    if (!poidsKg) return 0
    return Math.round((30 * poidsKg) + 70)
  }, [poidsKg])

  const facteurs = FACTEURS[espece]

  const conditionSelectionnee = useMemo(
    () => facteurs.find(f => f.id === conditionId) || facteurs[0],
    [facteurs, conditionId]
  )

  const facteurActif = useMemo(() => {
    if (facteurPerso) {
      const custom = parseFloat(facteurCustom)
      return custom > 0 ? { facteurMin: custom, facteurMax: null, plus: false } : null
    }
    return conditionSelectionnee
  }, [facteurPerso, facteurCustom, conditionSelectionnee])

  const beqMin = useMemo(() => {
    if (!bee || !facteurActif?.facteurMin) return null
    return Math.round(bee * facteurActif.facteurMin)
  }, [bee, facteurActif])

  const beqMax = useMemo(() => {
    if (!bee || !facteurActif?.facteurMax) return null
    return Math.round(bee * facteurActif.facteurMax)
  }, [bee, facteurActif])

  const portion = useMemo(() => {
    const k = parseFloat(kcalNourriture)
    if (!k || k <= 0 || !beqMin) return null
    if (uniteNourriture === 'kg') {
      return {
        type: 'g',
        min: Math.round(beqMin / k * 1000),
        max: beqMax ? Math.round(beqMax / k * 1000) : null,
      }
    }
    return {
      type: 'tasse',
      min: arrondir(beqMin / k, 2),
      max: beqMax ? arrondir(beqMax / k, 2) : null,
    }
  }, [beqMin, beqMax, kcalNourriture, uniteNourriture])

  const parRepas = useMemo(() => {
    if (!portion) return null
    const diviser = v => portion.type === 'g' ? Math.round(v / nbRepas) : arrondir(v / nbRepas, 2)
    return { min: diviser(portion.min), max: portion.max ? diviser(portion.max) : null }
  }, [portion, nbRepas])

  // ─── TEXTES ──────────────────────────────────────────

  const suffixePlus = facteurActif?.plus ? '+' : ''

  const beqValeur = beqMin
    ? (beqMax ? `${beqMin} – ${beqMax}${suffixePlus}` : `${beqMin}${suffixePlus}`)
    : null

  const traceFacteur = facteurPerso
    ? `Facteur personnalisé · ${bee} × ${parseFloat(facteurCustom)}`
    : `${conditionSelectionnee.label} · ${bee} ${labelFacteur(conditionSelectionnee)}`

  function uniteJour(p, valeur) {
    if (p.type === 'g') return 'g/jour'
    return valeur <= 1 ? 'tasse/jour' : 'tasses/jour'
  }

  function uniteRepas(p, valeur) {
    if (p.type === 'g') return 'g'
    return valeur <= 1 ? 'tasse' : 'tasses'
  }

  const portionValeur = portion
    ? (portion.max ? `${portion.min} – ${portion.max}` : `${portion.min}`)
    : null
  const portionUnite = portion ? uniteJour(portion, portion.max ?? portion.min) : null

  const repasTexte = parRepas
    ? `${parRepas.max ? `${parRepas.min} – ${parRepas.max}` : parRepas.min} ${uniteRepas(portion, parRepas.max ?? parRepas.min)}`
    : null

  const barre = useMemo(() => {
    if (portionValeur) return { cle: 'Quantité à donner', valeur: `${portionValeur} ${portionUnite}` }
    if (beqValeur) return { cle: 'BEQ estimé', valeur: `${beqValeur} kcal/jour` }
    if (bee > 0) return { cle: 'Besoin d\'entretien', valeur: `${bee} kcal/jour` }
    return null
  }, [portionValeur, portionUnite, beqValeur, bee])

  // ─── ACTIONS ─────────────────────────────────────────

  function handleEspece(e) {
    setEspece(e)
    setConditionId(prev => FACTEURS[e].some(f => f.id === prev) ? prev : FACTEURS[e][0].id)
  }

  function activerFacteurPerso() {
    setFacteurPerso(true)
    setFacteurCustom('')
  }

  function retourAuTableau() {
    setFacteurPerso(false)
    setFacteurCustom('')
  }

  async function copier() {
    const lignes = [
      `${espece === 'chien' ? 'Chien' : 'Chat'} ${arrondir(poidsKg, 2)} kg`,
      `BEE ${bee} kcal/jour`,
    ]
    if (beqValeur) lignes.push(`BEQ ${beqValeur} kcal/jour (${traceFacteur.split(' · ')[0]})`)
    if (portionValeur) {
      lignes.push(`Quantité ${portionValeur} ${portionUnite}`)
      if (repasTexte && nbRepas > 1) lignes.push(`${nbRepas} repas : ${repasTexte} par repas`)
    }
    try {
      await navigator.clipboard.writeText(lignes.join(' · '))
      setCopie(true)
      setTimeout(() => setCopie(false), 1800)
    } catch {
      /* presse-papiers refusé : on ne bloque rien */
    }
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

        {/* ─── BEE (niveau 2 : étape de calcul) ── */}
        <div className={`res-etape ${bee > 0 ? '' : 'vide'}`}>
          <span className="res-etape-cle">BEE, besoin énergétique d'entretien</span>
          <span className="res-etape-valeur">
            {bee > 0 ? bee : '—'}
            {bee > 0 && <span className="res-unite">kcal/jour</span>}
          </span>
          <span className="res-etape-trace">
            {bee > 0 ? `(30 × ${arrondir(poidsKg, 2)}) + 70` : '(30 × poids en kg) + 70'}
          </span>
        </div>

        {/* ─── CONDITION ──────────────────────── */}
        <div className="champ">
          <label>Condition / stade de vie</label>

          {!facteurPerso ? (
            <>
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
              <button type="button" className="res-lien" onClick={activerFacteurPerso}>
                <i className="ti ti-math-function"></i>
                Utiliser un facteur personnalisé
              </button>
            </>
          ) : (
            <>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <i className="ti ti-math-function" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={facteurCustom}
                  onChange={e => setFacteurCustom(e.target.value.replace(',', '.'))}
                  placeholder="Ex : 1.8"
                  autoFocus
                />
                <span className="unite-fixe">× BEE</span>
              </div>
              <button type="button" className="res-lien" onClick={retourAuTableau}>
                <i className="ti ti-arrow-back-up"></i>
                Revenir aux facteurs du tableau
              </button>
            </>
          )}
        </div>

        {/* ─── BEQ (niveau 2 accentué) ────────── */}
        {bee > 0 && beqValeur && (
          <div className="res-etape fort">
            <span className="res-etape-cle">BEQ, besoin quotidien estimé</span>
            <span className="res-etape-valeur">
              {beqValeur}
              <span className="res-unite">kcal/jour</span>
            </span>
            <span className="res-etape-trace">{traceFacteur}</span>
          </div>
        )}

        {/* ─── DENSITÉ CALORIQUE ──────────────── */}
        <div className="champ">
          <label>Densité calorique de l'aliment (optionnel)</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-energie.svg" alt="kcal" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={kcalNourriture}
              onChange={e => setKcalNourriture(e.target.value.replace(',', '.'))}
              placeholder={uniteNourriture === 'kg' ? 'Ex: 3800' : 'Ex: 475'}
            />
            <div className="radio-groupe">
              <button
                className={`radio-btn ${uniteNourriture === 'kg' ? 'active' : ''}`}
                onClick={() => { setUniteNourriture('kg'); setKcalNourriture('') }}
              >kcal/kg</button>
              <button
                className={`radio-btn ${uniteNourriture === 'tasse' ? 'active' : ''}`}
                onClick={() => { setUniteNourriture('tasse'); setKcalNourriture('') }}
              >kcal/tasse</button>
            </div>
          </div>
        </div>

        {/* ─── QUANTITÉ (niveau 1 : la réponse) ── */}
        {portion && (
          <div className="res-primaire">
            <span className="res-primaire-cle">Quantité à donner</span>
            <p className="res-primaire-valeur">
              {portionValeur}
              <span className="res-unite">{portionUnite}</span>
            </p>
            <div className="res-primaire-sep"></div>
            <div className="res-primaire-repas">
              {REPAS.map(n => (
                <button
                  key={n}
                  type="button"
                  className={n === nbRepas ? 'actif' : ''}
                  onClick={() => setNbRepas(n)}
                >
                  {n} repas
                </button>
              ))}
            </div>
            {nbRepas > 1 && repasTexte && (
              <p className="res-primaire-note">≈ {repasTexte} par repas</p>
            )}
          </div>
        )}

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Ces valeurs sont des estimations théoriques. Ajuster selon l'évolution du poids corporel et de la condition corporelle (BCS).
        </div>

        {barre && <div className="res-barre-espace"></div>}

      </div>

      

    </div>
  )
}
