import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { TitreContext, NavGuardContext } from '../context/NavigationContext'
import { titrePage } from '../lib/titresPages'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { titreCustom } = useContext(TitreContext)
  const { demanderConfirmation } = useContext(NavGuardContext)

  if (location.pathname === '/accueil') return null

  const titre = titreCustom || titrePage(location.pathname)

  const pagesMenu = ['/sources-references', '/disclaimer', '/politique-confidentialite', '/termes-services', '/aide', '/profil', '/abonnement']
  const retour = () => {
    demanderConfirmation(() => {
      if (location.pathname === '/menu') navigate('/accueil')
      else if (pagesMenu.includes(location.pathname)) navigate('/menu')
      else navigate(-1)
    })
  }

  return (
    <header className="header">
      <button className="header-back" onClick={retour} aria-label="Retour">
        <i className="ti ti-arrow-left" aria-hidden="true"></i>
      </button>
      <h1 style={{ textAlign: 'center', maxWidth: 'calc(100% - 80px)', lineHeight: 1.3, margin: 0, fontSize: 20 }}>{titre}</h1>
    </header>
  )
}
