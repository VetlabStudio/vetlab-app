import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, createContext } from 'react'
import { supabase } from './lib/supabase'
import { ProfilProvider } from './context/ProfilContext'


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
import LaboUrologie from './pages/LaboUrologie'
import LaboUrologieValeurs from './pages/LaboUrologieValeurs'
import LaboUrologieSediments from './pages/LaboUrologieSediments'
import LaboParasitologie from './pages/LaboParasitologie'
import LaboParasitologieOeufs from './pages/LaboParasitologieOeufs'
import LaboParasitologieHotes from './pages/LaboParasitologieHotes'
import LaBiochimie from './pages/LaBiochimie'
import LaBiochimieTubes from './pages/LaBiochimieTubes'
import LaBiochimieValeurs from './pages/LaBiochimieValeurs'
import LaCytologie from './pages/LaCytologie'
import LaCytologiePrelevement from './pages/LaCytologiePrelevement'
import LaCytologieCellules from './pages/LaCytologieCellules'
import LaMicrobiologie from './pages/LaMicrobiologie'
import LaMicrobiologiePrelevement from './pages/LaMicrobiologiePrelevement'
import LaMicrobiologieCultures from './pages/LaMicrobiologieCultures'
import LaMicrobiologieAntibiogramme from './pages/LaMicrobiologieAntibiogramme'
import LaMicrobiologieBacteries from './pages/LaMicrobiologieBacteries'
import LaParasitologieExternes from './pages/LaParasitologieExternes'
import MedicamentCustomForm from './pages/MedicamentCustomForm'
import AjouterMedicament from './pages/AjouterMedicament'
import LaboParasitologieDipylidium from './pages/LaboParasitologieDipylidium'
import LaboParasitologiePuce from './pages/LaboParasitologiePuce'
import ProGate from './components/ProGate'
import LaBiochimieOrganes from './pages/LaBiochimieOrganes'
import LaBiochimieImmuno from './pages/LaBiochimieImmuno'
import LaMicrobiologieColonies from './pages/LaMicrobiologieColonies'
import LaMicrobiologieLevures from './pages/LaMicrobiologieLevures'
import Toxicologie from './pages/Toxicologie'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'
import Chirurgie from './pages/Chirurgie'
import ChirurgieInstruments from './pages/ChirurgieInstruments'
import ChirurgieTubes from './pages/ChirurgieTubes'
import ChirurgieMonitoring from './pages/ChirurgieMonitoring'

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
    <ProfilProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* AUTH */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* ACCUEIL */}
          <Route path="/accueil" element={<RouteProtegee session={session}><Accueil /></RouteProtegee>} />
          <Route path="/notes" element={<RouteProtegee session={session}><Notes /></RouteProtegee>} />
          <Route path="/notes/:id" element={<RouteProtegee session={session}><NoteDetail /></RouteProtegee>} />

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
        <Route path="/drogues/ajouter" element={<RouteProtegee session={session}><AjouterMedicament /></RouteProtegee>} />
        <Route path="/drogues/fiche/:id" element={<RouteProtegee session={session}><FicheMedicament /></RouteProtegee>} />
        <Route path="/drogues/toxicologie" element={<RouteProtegee session={session}><ProGate><Toxicologie /></ProGate></RouteProtegee>} />
        <Route path="/drogues/fiche/:id/personnaliser" element={<RouteProtegee session={session}><MedicamentCustomForm /></RouteProtegee>} />

        {/* LABO */}
        <Route path="/labo" element={<RouteProtegee session={session}><LaboAccueil /></RouteProtegee>} />
        <Route path="/labo/nouveau" element={<RouteProtegee session={session}><LaboNouveauProtocole /></RouteProtegee>} />
        <Route path="/labo/protocole/:protocoleId" element={<RouteProtegee session={session}><LaboProtocoleDetail /></RouteProtegee>} />
        <Route path="/labo/aeac9309-185f-4f2c-81b2-dfed3d4e55aa" element={<RouteProtegee session={session}><LaboUrologie /></RouteProtegee>} />
        <Route path="/labo/urologie/valeurs" element={<RouteProtegee session={session}><LaboUrologieValeurs /></RouteProtegee>} />
        <Route path="/labo/urologie/sediments" element={<RouteProtegee session={session}><ProGate><LaboUrologieSediments /></ProGate></RouteProtegee>} />
        <Route path="/labo/2e0222f2-5733-4d01-bc99-8c380bec5abe" element={<RouteProtegee session={session}><LaboParasitologie /></RouteProtegee>} />
        <Route path="/labo/parasitologie/oeufs" element={<RouteProtegee session={session}><LaboParasitologieOeufs /></RouteProtegee>} />
        <Route path="/labo/parasitologie/hotes" element={<RouteProtegee session={session}><LaboParasitologieHotes /></RouteProtegee>} />
        <Route path="/labo/4efe71ce-bfa9-4ea9-a8af-ecbd6dc97320" element={<RouteProtegee session={session}><LaBiochimie /></RouteProtegee>} />
        <Route path="/labo/biochimie/tubes" element={<RouteProtegee session={session}><LaBiochimieTubes /></RouteProtegee>} />
        <Route path="/labo/biochimie/valeurs" element={<RouteProtegee session={session}><LaBiochimieValeurs /></RouteProtegee>} />
        <Route path="/labo/173fb58a-988c-4202-8b14-bfcd15c4a16f" element={<RouteProtegee session={session}><LaCytologie /></RouteProtegee>} />
        <Route path="/labo/cytologie/prelevement" element={<RouteProtegee session={session}><LaCytologiePrelevement /></RouteProtegee>} />
        <Route path="/labo/cytologie/cellules" element={<RouteProtegee session={session}><LaCytologieCellules /></RouteProtegee>} />
        <Route path="/labo/parasitologie/oeufs" element={<RouteProtegee session={session}><LaboParasitologieOeufs /></RouteProtegee>} />
        <Route path="/labo/parasitologie/hotes" element={<RouteProtegee session={session}><LaboParasitologieHotes /></RouteProtegee>} />
        <Route path="/labo/e216b2ee-59c8-4ea8-a06e-92c0f6f05ee5" element={<RouteProtegee session={session}><LaMicrobiologie /></RouteProtegee>} />
        <Route path="/labo/microbiologie/prelevement" element={<RouteProtegee session={session}><LaMicrobiologiePrelevement /></RouteProtegee>} />
        <Route path="/labo/microbiologie/cultures" element={<RouteProtegee session={session}><LaMicrobiologieCultures /></RouteProtegee>} />
        <Route path="/labo/microbiologie/antibiogramme" element={<RouteProtegee session={session}><LaMicrobiologieAntibiogramme /></RouteProtegee>} />
        <Route path="/labo/parasitologie/externes" element={<RouteProtegee session={session}><LaParasitologieExternes /></RouteProtegee>} />
        <Route path="/labo/microbiologie/bacteries" element={<RouteProtegee session={session}><LaMicrobiologieBacteries /></RouteProtegee>} />
        <Route path="/labo/parasitologie/dipylidium" element={<RouteProtegee session={session}><ProGate><LaboParasitologieDipylidium /></ProGate></RouteProtegee>} />
        <Route path="/labo/parasitologie/puce" element={<RouteProtegee session={session}><ProGate><LaboParasitologiePuce /></ProGate></RouteProtegee>} />
        <Route path="/labo/biochimie/immuno" element={<RouteProtegee session={session}><ProGate><LaBiochimieImmuno /></ProGate></RouteProtegee>} />
        <Route path="/labo/biochimie/organes" element={<RouteProtegee session={session}><ProGate><LaBiochimieOrganes /></ProGate></RouteProtegee>} />
        <Route path="/labo/microbiologie/colonies" element={<RouteProtegee session={session}><ProGate><LaMicrobiologieColonies /></ProGate></RouteProtegee>} /> 
        <Route path="/labo/microbiologie/levures" element={<RouteProtegee session={session}><ProGate><LaMicrobiologieLevures /></ProGate></RouteProtegee>} />  
        <Route path="/labo/:categorieId" element={<RouteProtegee session={session}><LaboProtocoles /></RouteProtegee>} />
          
        {/* CHIRURGIE */}
        <Route path="/chirurgie/instruments" element={<RouteProtegee session={session}><ProGate><ChirurgieInstruments /></ProGate></RouteProtegee>} />
        <Route path="/chirurgie/tubes" element={<RouteProtegee session={session}><ProGate><ChirurgieTubes /></ProGate></RouteProtegee>} />
        <Route path="/chirurgie/monitoring" element={<RouteProtegee session={session}><ProGate><ChirurgieMonitoring /></ProGate></RouteProtegee>} />
          

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
     </ProfilProvider> 
  )
}
