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
  '/labo/aeac9309-185f-4f2c-81b2-dfed3d4e55aa': 'Urologie',
  '/labo/urologie/valeurs': 'Valeurs de référence',
  '/labo/urologie/sediments': 'Sédiments urinaires',
  '/labo/2e0222f2-5733-4d01-bc99-8c380bec5abe': 'Parasitologie',
  '/labo/parasitologie/oeufs': 'Œufs de parasites',
  '/labo/parasitologie/hotes': 'Hôtes & espèces affectées',
  '/labo/4efe71ce-bfa9-4ea9-a8af-ecbd6dc97320': 'Biochimie',
  '/labo/biochimie/tubes': 'Choix du tube',
  '/labo/biochimie/valeurs': 'Valeurs normales',
  '/labo/173fb58a-988c-4202-8b14-bfcd15c4a16f': 'Cytologie',
  '/labo/cytologie/prelevement': 'Guide de prélèvement',
  '/labo/cytologie/cellules': 'Types cellulaires',
  '/labo/e216b2ee-59c8-4ea8-a06e-92c0f6f05ee5': 'Microbiologie',
  '/labo/microbiologie/prelevement': 'Guide de prélèvement',
  '/labo/microbiologie/cultures': 'Interprétation des cultures',
  '/labo/microbiologie/antibiogramme': 'Antibiogramme',
  '/labo/microbiologie/bacteries': 'Bactéries courantes',
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
