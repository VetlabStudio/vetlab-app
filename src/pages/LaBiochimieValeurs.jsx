const SECTIONS = [
  {
    titre: 'Fonction rénale',
    parametres: [
      { nom: 'Créatinine', unite: 'mg/L', chien: '5,5–12,5', chat: '5,5–14' },
      { nom: 'Urée', unite: 'mmol/L', chien: '3,5–8,5', chat: '5–11' },
      { nom: 'Phosphore', unite: 'mmol/L', chien: '0,9–1,8', chat: '0,9–2,0' },
    ],
  },
  {
    titre: 'Fonction hépatique',
    parametres: [
      { nom: 'ALT (ALAT)', unite: 'UI/L', chien: '10–88', chat: '10–100' },
      { nom: 'PAL (phosphatases alcalines)', unite: 'UI/L', chien: '20–150', chat: '10–90' },
      { nom: 'GGT', unite: 'UI/L', chien: '0–11', chat: '0–8' },
      { nom: 'Bilirubine totale', unite: 'mg/L', chien: '1–6', chat: '1–3' },
      { nom: 'Acides biliaires (à jeun)', unite: 'µmol/L', chien: '< 10', chat: '< 10' },
      { nom: 'Albumine', unite: 'g/L', chien: '23–32', chat: '21–33' },
      { nom: 'Protéines totales', unite: 'g/L', chien: '55–75', chat: '60–80' },
    ],
  },
  {
    titre: 'Glycémie & Pancréas',
    parametres: [
      { nom: 'Glucose', unite: 'g/L', chien: '0,7–1,2', chat: '0,7–1,5' },
      { nom: 'Amylase', unite: 'UI/L', chien: '250–1300', chat: '250–800' },
      { nom: 'Lipase', unite: 'UI/L', chien: '< 200', chat: '< 200' },
    ],
  },
  {
    titre: 'Électrolytes',
    parametres: [
      { nom: 'Sodium (Na⁺)', unite: 'mEq/L', chien: '140–155', chat: '145–160' },
      { nom: 'Potassium (K⁺)', unite: 'mEq/L', chien: '3,5–5,8', chat: '3,5–5,5' },
      { nom: 'Chlorures (Cl⁻)', unite: 'mEq/L', chien: '105–120', chat: '115–130' },
      { nom: 'Calcium total', unite: 'mg/L', chien: '94–122', chat: '62–102' },
      { nom: 'Bicarbonates', unite: 'mEq/L', chien: '18–25', chat: '17–22' },
    ],
  },
  {
    titre: 'Lipides',
    parametres: [
      { nom: 'Cholestérol total', unite: 'g/L', chien: '1,2–3,5', chat: '0,7–2,5' },
      { nom: 'Triglycérides', unite: 'g/L', chien: '< 1,5', chat: '< 1,0' },
    ],
  },
  {
    titre: 'Marqueurs musculaires',
    parametres: [
      { nom: 'CK (créatine kinase)', unite: 'UI/L', chien: '10–200', chat: '10–130' },
      { nom: 'AST (ASAT)', unite: 'UI/L', chien: '10–50', chat: '10–45' },
    ],
  },
]

export default function LaBiochimieValeurs() {
  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        Valeurs indicatives; toujours se référer aux intervalles de référence de ton laboratoire.
      </p>

      {SECTIONS.map((section, i) => (
        <div key={i} className="labo-ref-section">
          <h2 className="labo-ref-titre">{section.titre}</h2>
          <div className="labo-ref-tableau">
            <div className="labo-ref-header">
              <span>Paramètre</span>
              <span>Chien</span>
              <span>Chat</span>
            </div>
            {section.parametres.map((p, j) => (
              <div key={j} className="labo-ref-ligne">
                <span>
                  {p.nom}
                  <br />
                  <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>{p.unite}</span>
                </span>
                <span className="labo-ref-normal">{p.chien}</span>
                <span className="labo-ref-normal">{p.chat}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
