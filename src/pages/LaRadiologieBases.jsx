const FACTEURS = [
  {
    titre: 'Milliampérage (mA)',
    points: [
      "Contrôle la quantité de rayons X produits (le nombre de photons), pas leur énergie.",
      "mA augmenté = plus d'électrons projetés sur l'anode = plus de rayons X produits.",
      "Un mA élevé permet d'utiliser des temps d'exposition plus courts (utile pour réduire le flou de mouvement).",
    ],
  },
  {
    titre: 'Kilovoltage crête (kVp)',
    points: [
      "Détermine le pouvoir de pénétration du faisceau (son énergie), pas sa quantité.",
      "kVp augmenté = électrons accélérés plus rapidement vers l'anode = rayons X plus énergétiques, donc plus pénétrants.",
      "Le kVp et le mAs ont une relation inverse : pour conserver une même densité radiographique, augmenter l'un permet de diminuer l'autre.",
    ],
  },
  {
    titre: 'Distance foyer-image (DFI / SID)',
    points: [
      "Distance entre la source de rayons X et le récepteur d'image; elle doit demeurer constante d'un examen à l'autre (environ 100 cm / 40 pouces).",
      "Loi du carré inverse : l'intensité du faisceau varie inversement au carré de la distance. Plus le faisceau s'éloigne de la source, plus son intensité diminue rapidement.",
    ],
  },
]

const FORMULE_MAS = [
  { exemple: '20 mA × 1/2 seconde', resultat: '10 mAs' },
  { exemple: '300 mA × 1/30 seconde', resultat: '10 mAs' },
]

export default function LaRadiologieBases() {
  return (
    <div className="labo-detail-page">

      {FACTEURS.map((f, i) => (
        <div key={i} className="labo-ref-section">
          <h2 className="labo-ref-titre">{f.titre}</h2>
          <div className="labo-etape-card">
            {f.points.map((p, j) => (
              <div key={j} className="labo-materiel-item" style={{ borderBottom: j < f.points.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <i className="ti ti-point-filled" style={{ color: 'var(--primary)', flexShrink: 0 }}></i>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Calcul des mAs (mA × temps d'exposition)</h2>
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <span>mA × temps</span>
            <span>mAs</span>
          </div>
          {FORMULE_MAS.map((row, i) => (
            <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
              <span style={{ fontFamily: 'monospace' }}>{row.exemple}</span>
              <span className="labo-ref-normal">{row.resultat}</span>
            </div>
          ))}
        </div>
        <p className="labo-ref-note">Le mAs (milliampères-secondes) est le produit du mA et du temps d'exposition. Des combinaisons mA/temps différentes peuvent donner le même mAs, donc la même quantité de rayons X.</p>
      </div>

    </div>
  )
}
