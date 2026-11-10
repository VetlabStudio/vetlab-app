import { useState, useMemo } from 'react'
import LienFavoris from '../components/LienFavoris'
import { lireNombrePositif } from '../lib/nombres'
import { arrondirDose, arrondirMcg, calculComprimes } from '../lib/doses'
import { ChoixForme, ChampTeneur, ResultatComprimes } from '../components/Comprimes'

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
          {resultat.etapes.map((etape, i) => (
            <div key={etape.titre} className="demarche-etape">
              <span className="demarche-num">{i + 3}</span>
              <div>
                <p className="demarche-titre">{etape.titre}</p>
                <p className="demarche-calcul">{etape.calcul}</p>
              </div>
            </div>
          ))}
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
  // Liquide (volume en mL) ou comprimé (nombre de comprimés).
  const [forme, setForme] = useState('liquide')
  const [teneur, setTeneur] = useState('')
  const [uniteTeneur, setUniteTeneur] = useState('mg')

  const poidsSaisi = lireNombrePositif(poids)
  const posoSaisie = lireNombrePositif(posologie)
  const concSaisie = lireNombrePositif(concentration)
  const teneurSaisie = lireNombrePositif(teneur)
  // Un champ rempli mais invalide (lettres, zéro) affiche son message ; vide, il attend.
  const invalide = (texte, valeur) => texte.trim() !== '' && valeur === null

  // Calcul automatique, refait à chaque saisie. Tout se calcule en mg.
  const resultat = useMemo(() => {
    const enComprimes = forme === 'comprime'
    if (poidsSaisi === null || posoSaisie === null || (enComprimes ? teneurSaisie : concSaisie) === null) return null

    const poidsKg = unitePoids === 'lb'
      ? Math.round((poidsSaisi / 2.205) * 100) / 100
      : poidsSaisi
    const kg = poidsKg.toFixed(2)
    const poso = posoSaisie

    const doseMg = poidsKg * poso * (uniteDose === 'mcg/kg' ? 0.001 : 1)
    const mg = arrondirDose(doseMg)
    const mcg = arrondirMcg(doseMg * 1000)
    const etapeDose = {
      titre: 'Dose totale = poids (kg) × posologie',
      calcul: uniteDose === 'mcg/kg' ? `${kg} kg × ${poso} mcg/kg = ${mcg} mcg = ${mg} mg` : `${kg} kg × ${poso} mg/kg = ${mg} mg`,
    }
    const base = {
      poidsKg: kg,
      poso,
      uniteDose,
      doseTotale: uniteDose === 'mcg/kg' ? `${mg} mg (${mcg} mcg)` : `${mg} mg`,
    }

    if (enComprimes) {
      const calcul = calculComprimes(doseMg, teneurSaisie, uniteTeneur)
      return { ...base, comprimes: calcul, etapes: [etapeDose, ...calcul.etapes] }
    }

    const conc = concSaisie
    const volume = doseMg / (uniteConc === 'mcg/mL' ? conc / 1000 : conc)
    return {
      ...base,
      volume: volume.toFixed(2),
      etapes: [etapeDose, {
        titre: 'Volume = dose totale ÷ concentration',
        calcul: uniteConc === 'mcg/mL'
          ? `${mcg} mcg ÷ ${conc} mcg/mL = ${volume.toFixed(2)} mL`
          : `${mg} mg ÷ ${conc} mg/mL = ${volume.toFixed(2)} mL`,
      }],
    }
  }, [poidsSaisi, unitePoids, posoSaisie, uniteDose, concSaisie, uniteConc, forme, teneurSaisie, uniteTeneur])

  return (
    <div className="page-calculateurs">
      <LienFavoris />

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
          {invalide(poids, poidsSaisi) && (
            <p className="fluido-erreur">Poids invalide, entrez une valeur supérieure à 0.</p>
          )}
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
          {invalide(posologie, posoSaisie) && (
            <p className="fluido-erreur">Posologie invalide, entrez une valeur supérieure à 0.</p>
          )}
        </div>

        <ChoixForme forme={forme} onChange={setForme} />

        {forme === 'comprime' ? (
          <ChampTeneur teneur={teneur} onTeneur={setTeneur} unite={uniteTeneur} onUnite={setUniteTeneur} />
        ) : (
        /* Concentration */
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
          {invalide(concentration, concSaisie) && (
            <p className="fluido-erreur">Concentration invalide, entrez une valeur supérieure à 0.</p>
          )}
        </div>
        )}

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
                <img src="/icone-seringue.svg" alt="dose" />
              </div>
              Dose totale
            </span>
            <strong>{resultat ? resultat.doseTotale : '—'}</strong>
          </div>
          {forme === 'comprime' ? (
            <ResultatComprimes resultat={resultat?.comprimes || null} />
          ) : (
          <div className="resultat-ligne">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="champ-icone-wrapper">
                <img src="/icone-fluido.svg" alt="volume" />
              </div>
              Volume à administrer
            </span>
            <strong>{resultat ? `${resultat.volume} mL` : '—'}</strong>
          </div>
          )}
        </div>

        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours le dosage avec un vétérinaire avant d'administrer un médicament. Ce calculateur est un outil d'aide, votre jugement clinique prime en tout temps.
        </div>

        {/* Démarche */}
        {resultat && (
          <DemarcheCollapsible resultat={resultat} poids={poids} unitePoids={unitePoids} />
        )}

      </div>
    </div>
  )
}
