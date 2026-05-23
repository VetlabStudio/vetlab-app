import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { TitreContext } from '../App'

const titres = {
  '/calculateurs': 'Calculateur de dosage',
  '/calculateurs/cri': 'CRI',
  '/calculateurs/fluido': 'Fluidothérapie',
  '/calculateurs/conversion': 'Conversion',
  '/calculateurs/besoin': 'Besoin énergétique',
  '/calculateurs/dilution': 'Dilution C1V1-C2V2',
  '/calculateurs/transfusion': 'Transfusion sanguine',
  '/calculateurs/mise-bas': 'Date de mise bas',
  '/calculateurs/toxicite': 'Toxicité chocolat',
  '/calculateurs/rcr': 'RCR Urgence',
  '/drogues/anesthesiques': 'Anesthésiques / Analgésiques',
  '/drogues/antagonistes': 'Antagonistes',
  '/drogues/antibiotiques': 'Antibiotiques',
  '/drogues/antidiarrheiques': 'Antidiarrhéiques',
  '/drogues/antiemetiques': 'Antiémétiques',
  '/drogues/antihistaminiques': 'Antihistaminiques',
  '/drogues/cardiovasculaires': 'Cardiovasculaires',
  '/drogues/gastroprotecteurs': 'Gastroprotecteurs',
  '/drogues/neurologiques': 'Neurologiques',
  '/drogues/respiratoires': 'Respiratoires',
  '/drogues/urgence': 'Urgence',
  '/admin/medicaments': 'Admin — Médicaments',
  '/profil': 'Profil',
  '/drogues/mes-drogues': 'Médicaments favoris',
  '/labo': 'Laboratoire',
  '/labo/nouveau': 'Nouveau protocole',
  '/admin': 'Panneau admin',
  '/admin/labo': 'Admin — Laboratoire',
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { titreCustom } = useContext(TitreContext)

  if (location.pathname === '/accueil') return null

  const titre = titreCustom ||
    titres[location.pathname] ||
    Object.entries(titres)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([key]) => location.pathname.startsWith(key))?.[1] ||
    null

  return (
    <div className="header">
      <button className="header-back" onClick={() => navigate(-1)}>
        <i className="ti ti-arrow-left"></i>
      </button>
      <span>{titre}</span>
    </div>
  )
}
