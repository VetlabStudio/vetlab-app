import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGES = [
  {
    fond:   '/fond-jaune.jpg',
    animal: '/Chat08.png',
    sections: [
      {
        titre: 'Acceptation des termes',
        texte: 'En créant un compte et en utilisant ADJUVET, vous acceptez les présentes conditions d\'utilisation. Ces conditions constituent un accord entre vous et VetLab Studio.',
      },
      {
        titre: 'Utilisation du service',
        texte: 'ADJUVET est destiné aux professionnels et étudiants du domaine vétérinaire à titre d\'outil de référence et de calcul. Le contenu est fourni sans garantie d\'exactitude complète. Vous êtes responsable de l\'usage que vous faites des informations fournies. La redistribution ou revente du contenu est interdite sans autorisation.',
      },
    ],
  },
  {
    fond:   '/fond-vert.jpg',
    animal: '/perroquet01.png',
    sections: [
      {
        titre: 'Abonnement et facturation',
        texte: 'Le forfait Pro est un abonnement payant - mensuel ou annuel - géré via Stripe. Vous pouvez gérer ou annuler votre abonnement à tout moment depuis la page Profil. Aucun remboursement n\'est offert pour les périodes partiellement utilisées.',
      },
    ],
  },
  {
    fond:   '/fond-gris.jpg',
    animal: '/Lapin01.png',
    sections: [
      {
        titre: 'Modifications',
        texte: 'Ces conditions peuvent être mises à jour à l\'occasion. Les changements importants vous seront communiqués via l\'application. En continuant à utiliser ADJUVET après une mise à jour, vous acceptez les nouvelles conditions.',
      },
      {
        titre: 'Contact',
        texte: 'Pour toute question concernant ces conditions, écrivez-nous à info@vetlabstudio.ca. Nous répondons généralement dans un délai de 2 à 3 jours ouvrables.',
      },
    ],
  },
]

export default function TermesServices() {
  const [page, setPage] = useState(0)
  const navigate = useNavigate()

  const handleValider = () => {
    if (page < PAGES.length - 1) {
      setPage(p => p + 1)
    } else {
      navigate('/accueil')
    }
  }

  const { fond, animal, sections } = PAGES[page]

  return (
    <div
      className="cgu-page"
      style={{ backgroundImage: `url('${fond}')` }}
    >
      <div className="cgu-contenu">
        <img src="/icone-logo-bleu.svg" alt="" className="cgu-icone" />

        <h1 className="cgu-titre">Conditions d'utilisations</h1>

        <div className="cgu-sections">
          {sections.map((s, i) => (
            <div key={i} className="cgu-section">
              <p className="cgu-section-titre">{s.titre}</p>
              <p className="cgu-section-texte">{s.texte}</p>
            </div>
          ))}
        </div>

        <button className="cgu-btn" onClick={handleValider}>
          Valider
        </button>

        <div className="cgu-dots">
          {PAGES.map((_, i) => (
            <button
              key={i}
              className={`cgu-dot${i === page ? ' actif' : ''}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="cgu-photo">
        <img src={animal} alt="" />
      </div>
    </div>
  )
}
