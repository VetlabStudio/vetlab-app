import { useState, useMemo } from 'react'

function arrondir(v) {
  return Math.round(v * 10) / 10
}

export default function Dextrose() {
  const [concDepart, setConcDepart] = useState('')
  const [concFinale, setConcFinale] = useState('')
  const [volumeSac, setVolumeSac] = useState('')

  // C1 × V1 = C2 × V2  →  V1 = (C2 × V2) / C1
  const resultat = useMemo(() => {
    const c1 = parseFloat(concDepart)
    const c2 = parseFloat(concFinale)
    const v2 = parseFloat(volumeSac)
    if (!c1 || !c2 || !v2 || c1 <= 0 || c2 <= 0 || v2 <= 0) return null
    if (c2 >= c1) return null
    const v1 = (c2 * v2) / c1
    return { v1: arrondir(v1), v2: arrondir(v2), c1, c2 }
  }, [concDepart, concFinale, volumeSac])

  const erreur = useMemo(() => {
    const c1 = parseFloat(concDepart)
    const c2 = parseFloat(concFinale)
    if (c1 && c2 && c2 >= c1) return 'La concentration finale doit être inférieure à la concentration de départ.'
    return null
  }, [concDepart, concFinale])

  return (
    <div className="calculateur-page">
      <div className="postop-intro">
        <i className="ti ti-droplet postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Calcule le volume de solution de dextrose à ajouter dans un sac de fluides pour obtenir la concentration souhaitée.
        </p>
      </div>

      <div className="champ">
        <label>Concentration de départ</label>
        <div className="champ-input">
          <div className="champ-icone-wrapper">
            <i className="ti ti-test-pipe" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={concDepart}
            onChange={e => setConcDepart(e.target.value.replace(',', '.'))}
            placeholder="Ex : 50"
          />
          <span className="unite-fixe">%</span>
        </div>
        <p className="champ-aide">Concentration de ta solution de dextrose (ex : D50 = 50 %)</p>
      </div>

      <div className="champ">
        <label>Concentration finale souhaitée</label>
        <div className="champ-input">
          <div className="champ-icone-wrapper">
            <i className="ti ti-target" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={concFinale}
            onChange={e => setConcFinale(e.target.value.replace(',', '.'))}
            placeholder="Ex : 2.5"
          />
          <span className="unite-fixe">%</span>
        </div>
        <p className="champ-aide">Concentration désirée dans le sac (ex : D2.5 = 2.5 %)</p>
      </div>

      <div className="champ">
        <label>Volume du sac de fluides</label>
        <div className="champ-input">
          <div className="champ-icone-wrapper">
            <i className="ti ti-flask" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={volumeSac}
            onChange={e => setVolumeSac(e.target.value.replace(',', '.'))}
            placeholder="Ex : 1000"
          />
          <span className="unite-fixe">mL</span>
        </div>
      </div>

      {erreur && (
        <div className="alerte-calcul" style={{ marginTop: 8 }}>
          <i className="ti ti-alert-triangle"></i> {erreur}
        </div>
      )}

      {resultat && (
        <div className="dilution-resultat" style={{ marginTop: 16 }}>
          <p className="dilution-resultat-valeur">
            <strong>{resultat.v1} mL</strong> de solution à {resultat.c1} %
          </p>
          <p className="dilution-resultat-texte" style={{ marginTop: 12, lineHeight: 1.7 }}>
            Retirer <strong>{resultat.v1} mL</strong> du sac de <strong>{resultat.v2} mL</strong>,
            puis ajouter <strong>{resultat.v1} mL</strong> de la solution de dextrose à <strong>{resultat.c1} %</strong>.
            Bien mélanger. La solution obtenue est à <strong>{resultat.c2} %</strong>.
          </p>
        </div>
      )}

      {!resultat && !erreur && (
        <div className="dilution-resultat" style={{ marginTop: 16, opacity: 0.5 }}>
          <p className="dilution-resultat-valeur"><strong>— mL</strong></p>
        </div>
      )}

      <p className="calc-disclaimer">
        Valide toujours tes calculs avec le vétérinaire responsable avant de préparer une solution.
      </p>
    </div>
  )
}
