const ELECTRODES = [
  { electrode: 'Membre antérieur droit', couleur: 'Blanche', position: 'Partie distale (près du coude ou carpe)' },
  { electrode: 'Membre antérieur gauche', couleur: 'Noire', position: 'Partie distale (près du coude ou carpe)' },
  { electrode: 'Membre postérieur droit', couleur: 'Verte', position: 'Partie distale (près du tarse ou jarret)' },
  { electrode: 'Membre postérieur gauche', couleur: 'Rouge', position: 'Partie distale (près du tarse ou jarret)' },
]

const CONSEILS = [
  'L\'animal doit être en décubitus latéral droit (couché sur le côté droit).',
  'Assurer un bon contact peau-électrode : utiliser de l\'alcool ou un gel conducteur.',
  'Garder l\'animal calme et immobile pour éviter les interférences.',
]

export default function ChirurgieECGElectrodes() {
  return (
    <div className="labo-detail-page">

      <img src="/chien-electrodes.png" alt="Positionnement des électrodes ECG" style={{ width: '80%', display: 'block', margin: '0 auto 16px', borderRadius: 'var(--radius-md)' }} />

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--gauche">
            <span>Électrode</span>
            <span>Couleur</span>
            <span>Position recommandée</span>
          </div>
          {ELECTRODES.map((e, i) => (
            <div key={i} className="labo-ref-ligne">
              <span>{e.electrode}</span>
              <span className="labo-ref-normal">{e.couleur}</span>
              <span>{e.position}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-circle-check"></i>
          </div>
          <h2 className="postop-section-titre">Conseils pratiques</h2>
        </div>
        <ul className="postop-alerte-liste">
          {CONSEILS.map((c, i) => (
            <li key={i} className="postop-alerte-item">
              <i className="ti ti-paw postop-alerte-puce"></i>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
