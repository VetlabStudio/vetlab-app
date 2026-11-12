import { useNavigate } from 'react-router-dom'
import { ESPECES_CONFIG } from '../data/especes'
import { GROUPES_EXOTIQUES } from '../lib/especesExotiques'

// Version carrée et bleu marine du furet, assortie aux autres icônes de la grille.
const ICONES_GRILLE = { furet: '/icone-furet.svg' }

// Porte d'entrée de la section : on choisit l'espèce, le reste s'ajuste à elle.
export default function Exotiques() {
  const navigate = useNavigate()

  return (
    <div className="exotiques-page">
      <p className="exotiques-intro">
        Choisissez l'espèce : les médicaments et les doses s'ajustent à elle.
      </p>

      {GROUPES_EXOTIQUES.map(groupe => (
        <section key={groupe.titre} className="exotiques-groupe">
          <h2 className="exotiques-groupe-titre">{groupe.titre}</h2>
          <div className={`exotiques-grille ${groupe.especes.length === 4 ? 'exotiques-grille--4' : ''}`}>
            {groupe.especes.map(id => (
              <button key={id} className="exotiques-tuile" onClick={() => navigate(`/exotiques/${id}`)}>
                <img src={ICONES_GRILLE[id] || ESPECES_CONFIG[id].icone} alt="" className="exotiques-tuile-icone" />
                <span>{ESPECES_CONFIG[id].label}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
