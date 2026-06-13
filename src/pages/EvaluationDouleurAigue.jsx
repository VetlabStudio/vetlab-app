import { useNavigate } from 'react-router-dom'

const ESPECES = [
  { id: 'chien', label: 'Chien', icone: '/icone-chien.svg', route: '/calculateurs/douleur-aigue/chien', disponible: true },
  { id: 'chat', label: 'Chat', icone: '/icone-chat.svg', route: '/calculateurs/douleur-aigue/chat', disponible: false },
]

export default function EvaluationDouleurAigue() {
  const navigate = useNavigate()

  return (
    <div className="douleur-page">
      <div className="douleur-intro">
        <i className="ti ti-clipboard-heart douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          Choisis l'espèce pour accéder à la grille d'évaluation de la douleur aiguë correspondante.
        </p>
      </div>

      <div className="accueil-v2-calc-grid">
        {ESPECES.map(esp => (
          <button
            key={esp.id}
            className="accueil-v2-calc-tuile"
            onClick={() => esp.disponible && navigate(esp.route)}
            style={{ opacity: esp.disponible ? 1 : 0.5, position: 'relative' }}
          >
            <img src={esp.icone} alt={esp.label} className="accueil-v2-calc-icone" />
            <span className="accueil-v2-calc-label">{esp.label}</span>
            {!esp.disponible && (
              <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 10, fontWeight: 700, color: 'var(--text-hint)', background: 'rgba(0,0,0,0.05)', borderRadius: 6, padding: '2px 6px' }}>
                À venir
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
