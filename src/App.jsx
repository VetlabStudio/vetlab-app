import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, createContext } from 'react'
import { supabase } from './lib/supabase'

import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Accueil from './pages/Accueil'
import Calculateurs from './pages/Calculateurs'
import Profil from './pages/Profil'
import DroguesAnesthesiques from './pages/DroguesAnesthesiques'
import DroguesAntagonistes from './pages/DroguesAntagonistes'
import DroguesAntibiotiques from './pages/DroguesAntibiotiques'
import DroguesAntidiarrheiques from './pages/DroguesAntidiarrheiques'
import DroguesAntiemetiques from './pages/DroguesAntiemetiques'
import DroguesAntihistaminiques from './pages/DroguesAntihistaminiques'
import DroguesCardiovasculaires from './pages/DroguesCardiovasculaires'
import DroguesGastroprotecteurs from './pages/DroguesGastroprotecteurs'
import DroguesNeurologiques from './pages/DroguesNeurologiques'
import DroguesRespiratoires from './pages/DroguesRespiratoires'
import DroguesUrgence from './pages/DroguesUrgence'
import AdminMedicaments from './pages/AdminMedicaments'
import AdminMedicamentForm from './pages/AdminMedicamentForm'
import AdminAccueil from './pages/AdminAccueil'
import AdminLaboProtocoles from './pages/AdminLaboProtocoles'
import FicheMedicament from './pages/FicheMedicament'
import Fluidotherapie from './pages/Fluidotherapie'
import CRI from './pages/CRI'
import Conversion from './pages/Conversion'
import BesoinEnergetique from './pages/BesoinEnergetique'
import Dilution from './pages/Dilution'
import TransfusionSanguine from './pages/TransfusionSanguine'
import DateMiseBas from './pages/DateMiseBas'
import ToxiciteChocolat from './pages/ToxiciteChocolat'
import RCR from './pages/RCR'
import MesDrogues from './pages/MesDrogues'
import LaboAccueil from './pages/LaboAccueil'
import LaboProtocoles from './pages/LaboProtocoles'
import LaboProtocoleDetail from './pages/LaboProtocoleDetail'
import LaboNouveauProtocole from './pages/LaboNouveauProtocole'

import Header from './components/Header'
import BottomNav from './components/BottomNav'
import BottomNavAdmin from './components/BottomNavAdmin'

export const TitreContext = createContext({ titreCustom: '', setTitreCustom: () => {} })

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function LayoutPrincipal({ children }) {
  const location = useLocation()
  const estAccueil = location.pathname === '/accueil'
  const [titreCustom, setTitreCustom] = useState('')

  return (
    <TitreContext.Provider value={{ titreCustom, setTitreCustom }}>
      <div className={`app-layout ${estAccueil ? 'app-layout-accueil' : ''}`}>
        <Header />
        <main className="contenu-principal">
          {children}
        </main>
        <BottomNav />
      </div>
    </TitreContext.Provider>
  )
}

function LayoutAdmin({ children }) {
  const [titreCustom, setTitreCustom] = useState('')
  return (
    <TitreContext.Provider value={{ titreCustom, setTitreCustom }}>
      <div className="app-layout">
        <Header />
        <main className="contenu-principal">
          {children}
        </main>
        <BottomNavAdmin />
      </div>
    </TitreContext.Provider>
  )
}

function RouteProtegee({ session, children }) {
  if (!session) return <Navigate to="/connexion" replace />
  return <LayoutPrincipal>{children}</LayoutPrincipal>
}

function RouteProtegeeAdmin({ session, children }) {
  if (!session) return <Navigate to="/connexion" replace />
  return <LayoutAdmin>{children}</LayoutAdmin>
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* AUTH */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* ACCUEIL */}
        <Route path="/accueil" element={<RouteProtegee session={session}><Accueil /></RouteProtegee>} />

        {/* CALCULATEURS */}
        <Route path="/calculateurs" element={<RouteProtegee session={session}><Calculateurs /></RouteProtegee>} />
        <Route path="/calculateurs/fluido" element={<RouteProtegee session={session}><Fluidotherapie /></RouteProtegee>} />
        <Route path="/calculateurs/cri" element={<RouteProtegee session={session}><CRI /></RouteProtegee>} />
        <Route path="/calculateurs/conversion" element={<RouteProtegee session={session}><Conversion /></RouteProtegee>} />
        <Route path="/calculateurs/besoin" element={<RouteProtegee session={session}><BesoinEnergetique /></RouteProtegee>} />
        <Route path="/calculateurs/dilution" element={<RouteProtegee session={session}><Dilution /></RouteProtegee>} />
        <Route path="/calculateurs/transfusion" element={<RouteProtegee session={session}><TransfusionSanguine /></RouteProtegee>} />
        <Route path="/calculateurs/mise-bas" element={<RouteProtegee session={session}><DateMiseBas /></RouteProtegee>} />
        <Route path="/calculateurs/toxicite" element={<RouteProtegee session={session}><ToxiciteChocolat /></RouteProtegee>} />
        <Route path="/calculateurs/rcr" element={<RouteProtegee session={session}><RCR /></RouteProtegee>} />

        {/* DROGUES */}
        <Route path="/drogues/anesthesiques" element={<RouteProtegee session={session}><DroguesAnesthesiques /></RouteProtegee>} />
        <Route path="/drogues/antagonistes" element={<RouteProtegee session={session}><DroguesAntagonistes /></RouteProtegee>} />
        <Route path="/drogues/antibiotiques" element={<RouteProtegee session={session}><DroguesAntibiotiques /></RouteProtegee>} />
        <Route path="/drogues/antidiarrheiques" element={<RouteProtegee session={session}><DroguesAntidiarrheiques /></RouteProtegee>} />
        <Route path="/drogues/antiemetiques" element={<RouteProtegee session={session}><DroguesAntiemetiques /></RouteProtegee>} />
        <Route path="/drogues/antihistaminiques" element={<RouteProtegee session={session}><DroguesAntihistaminiques /></RouteProtegee>} />
        <Route path="/drogues/cardiovasculaires" element={<RouteProtegee session={session}><DroguesCardiovasculaires /></RouteProtegee>} />
        <Route path="/drogues/gastroprotecteurs" element={<RouteProtegee session={session}><DroguesGastroprotecteurs /></RouteProtegee>} />
        <Route path="/drogues/neurologiques" element={<RouteProtegee session={session}><DroguesNeurologiques /></RouteProtegee>} />
        <Route path="/drogues/respiratoires" element={<RouteProtegee session={session}><DroguesRespiratoires /></RouteProtegee>} />
        <Route path="/drogues/urgence" element={<RouteProtegee session={session}><DroguesUrgence /></RouteProtegee>} />
        <Route path="/drogues/mes-drogues" element={<RouteProtegee session={session}><MesDrogues /></RouteProtegee>} />
        <Route path="/drogues/fiche/:id" element={<RouteProtegee session={session}><FicheMedicament /></RouteProtegee>} />

        {/* LABO */}
        <Route path="/labo" element={<RouteProtegee session={session}><LaboAccueil /></RouteProtegee>} />
        <Route path="/labo/nouveau" element={<RouteProtegee session={session}><LaboNouveauProtocole /></RouteProtegee>} />
        <Route path="/labo/protocole/:protocoleId" element={<RouteProtegee session={session}><LaboProtocoleDetail /></RouteProtegee>} />
        <Route path="/labo/:categorieId" element={<RouteProtegee session={session}><LaboProtocoles /></RouteProtegee>} />

        {/* PROFIL */}
        <Route path="/profil" element={<RouteProtegee session={session}><Profil /></RouteProtegee>} />

        {/* ADMIN */}
        <Route path="/admin" element={<RouteProtegeeAdmin session={session}><AdminAccueil /></RouteProtegeeAdmin>} />
        <Route path="/admin/medicaments" element={<RouteProtegeeAdmin session={session}><AdminMedicaments /></RouteProtegeeAdmin>} />
        <Route path="/admin/medicaments/:id" element={<RouteProtegeeAdmin session={session}><AdminMedicamentForm /></RouteProtegeeAdmin>} />
        <Route path="/admin/labo" element={<RouteProtegeeAdmin session={session}><AdminLaboProtocoles /></RouteProtegeeAdmin>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to={session ? '/accueil' : '/connexion'} replace />} />

      </Routes>
    </BrowserRouter>
  )
}
