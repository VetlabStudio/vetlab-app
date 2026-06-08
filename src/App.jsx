import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, createContext, lazy, Suspense } from 'react'
import { supabase } from './lib/supabase'
import { ProfilProvider } from './context/ProfilContext'

const Connexion = lazy(() => import('./pages/Connexion'))
const Inscription = lazy(() => import('./pages/Inscription'))
const Accueil = lazy(() => import('./pages/Accueil'))
const Calculateurs = lazy(() => import('./pages/Calculateurs'))
const Profil = lazy(() => import('./pages/Profil'))
const DroguesAnesthesiques = lazy(() => import('./pages/DroguesAnesthesiques'))
const DroguesAntagonistes = lazy(() => import('./pages/DroguesAntagonistes'))
const DroguesAntibiotiques = lazy(() => import('./pages/DroguesAntibiotiques'))
const DroguesAntidiarrheiques = lazy(() => import('./pages/DroguesAntidiarrheiques'))
const DroguesAntiemetiques = lazy(() => import('./pages/DroguesAntiemetiques'))
const DroguesAntihistaminiques = lazy(() => import('./pages/DroguesAntihistaminiques'))
const DroguesCardiovasculaires = lazy(() => import('./pages/DroguesCardiovasculaires'))
const DroguesGastroprotecteurs = lazy(() => import('./pages/DroguesGastroprotecteurs'))
const DroguesNeurologiques = lazy(() => import('./pages/DroguesNeurologiques'))
const DroguesRespiratoires = lazy(() => import('./pages/DroguesRespiratoires'))
const DroguesUrgence = lazy(() => import('./pages/DroguesUrgence'))
const AdminMedicaments = lazy(() => import('./pages/AdminMedicaments'))
const AdminMedicamentForm = lazy(() => import('./pages/AdminMedicamentForm'))
const AdminAccueil = lazy(() => import('./pages/AdminAccueil'))
const AdminLaboProtocoles = lazy(() => import('./pages/AdminLaboProtocoles'))
const FicheMedicament = lazy(() => import('./pages/FicheMedicament'))
const Fluidotherapie = lazy(() => import('./pages/Fluidotherapie'))
const CRI = lazy(() => import('./pages/CRI'))
const Conversion = lazy(() => import('./pages/Conversion'))
const BesoinEnergetique = lazy(() => import('./pages/BesoinEnergetique'))
const Dilution = lazy(() => import('./pages/Dilution'))
const TransfusionSanguine = lazy(() => import('./pages/TransfusionSanguine'))
const DateMiseBas = lazy(() => import('./pages/DateMiseBas'))
const ToxiciteChocolat = lazy(() => import('./pages/ToxiciteChocolat'))
const RCR = lazy(() => import('./pages/RCR'))
const MesDrogues = lazy(() => import('./pages/MesDrogues'))
const LaboAccueil = lazy(() => import('./pages/LaboAccueil'))
const LaboProtocoles = lazy(() => import('./pages/LaboProtocoles'))
const LaboProtocoleDetail = lazy(() => import('./pages/LaboProtocoleDetail'))
const LaboNouveauProtocole = lazy(() => import('./pages/LaboNouveauProtocole'))
const LaboUrologie = lazy(() => import('./pages/LaboUrologie'))
const LaboUrologieValeurs = lazy(() => import('./pages/LaboUrologieValeurs'))
const LaboUrologieSediments = lazy(() => import('./pages/LaboUrologieSediments'))
const LaboParasitologie = lazy(() => import('./pages/LaboParasitologie'))
const LaboParasitologieOeufs = lazy(() => import('./pages/LaboParasitologieOeufs'))
const LaboParasitologieHotes = lazy(() => import('./pages/LaboParasitologieHotes'))
const LaBiochimie = lazy(() => import('./pages/LaBiochimie'))
const LaBiochimieTubes = lazy(() => import('./pages/LaBiochimieTubes'))
const LaBiochimieValeurs = lazy(() => import('./pages/LaBiochimieValeurs'))
const LaCytologie = lazy(() => import('./pages/LaCytologie'))
const LaCytologiePrelevement = lazy(() => import('./pages/LaCytologiePrelevement'))
const LaCytologieCellules = lazy(() => import('./pages/LaCytologieCellules'))
const LaMicrobiologie = lazy(() => import('./pages/LaMicrobiologie'))
const LaMicrobiologiePrelevement = lazy(() => import('./pages/LaMicrobiologiePrelevement'))
const LaMicrobiologieCultures = lazy(() => import('./pages/LaMicrobiologieCultures'))
const LaMicrobiologieAntibiogramme = lazy(() => import('./pages/LaMicrobiologieAntibiogramme'))
const LaMicrobiologieBacteries = lazy(() => import('./pages/LaMicrobiologieBacteries'))
const LaParasitologieExternes = lazy(() => import('./pages/LaParasitologieExternes'))
const MedicamentCustomForm = lazy(() => import('./pages/MedicamentCustomForm'))
const AjouterMedicament = lazy(() => import('./pages/AjouterMedicament'))
const LaboParasitologieDipylidium = lazy(() => import('./pages/LaboParasitologieDipylidium'))
const LaboParasitologiePuce = lazy(() => import('./pages/LaboParasitologiePuce'))
const LaBiochimieOrganes = lazy(() => import('./pages/LaBiochimieOrganes'))
const LaBiochimieImmuno = lazy(() => import('./pages/LaBiochimieImmuno'))
const LaMicrobiologieColonies = lazy(() => import('./pages/LaMicrobiologieColonies'))
const LaMicrobiologieLevures = lazy(() => import('./pages/LaMicrobiologieLevures'))
const Toxicologie = lazy(() => import('./pages/Toxicologie'))
const Notes = lazy(() => import('./pages/Notes'))
const NoteDetail = lazy(() => import('./pages/NoteDetail'))
const Chirurgie = lazy(() => import('./pages/Chirurgie'))
const ChirurgieInstruments = lazy(() => import('./pages/ChirurgieInstruments'))
const ChirurgieTubes = lazy(() => import('./pages/ChirurgieTubes'))
const ChirurgieMonitoring = lazy(() => import('./pages/ChirurgieMonitoring'))
const ChirurgieCapnographie = lazy(() => import('./pages/ChirurgieCapnographie'))
const ChirurgiePostOp = lazy(() => import('./pages/ChirurgiePostOp'))
const ChirurgieDouleur = lazy(() => import('./pages/ChirurgieDouleur'))

import Header from './components/Header'
import BottomNav from './components/BottomNav'
import BottomNavAdmin from './components/BottomNavAdmin'
import ProGate from './components/ProGate'

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
          <Suspense fallback={<div className="admin-loading">Chargement...</div>}>
            {children}
          </Suspense>
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
          <Suspense fallback={<div className="admin-loading">Chargement...</div>}>
            {children}
          </Suspense>
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
        <Route path="/connexion" element={<Suspense fallback={null}><Connexion /></Suspense>} />
        <Route path="/inscription" element={<Suspense fallback={null}><Inscription /></Suspense>} />

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
        <Route path="/labo/cytologie/cellules" element={<RouteProtegee session={session}><ProGate><LaCytologieCellules /></ProGate></RouteProtegee>} />
        <Route path="/labo/e216b2ee-59c8-4ea8-a06e-92c0f6f05ee5" element={<RouteProtegee session={session}><LaMicrobiologie /></RouteProtegee>} />
        <Route path="/labo/microbiologie/prelevement" element={<RouteProtegee session={session}><LaMicrobiologiePrelevement /></RouteProtegee>} />
        <Route path="/labo/microbiologie/cultures" element={<RouteProtegee session={session}><ProGate><LaMicrobiologieCultures /></ProGate></RouteProtegee>} />
        <Route path="/labo/microbiologie/antibiogramme" element={<RouteProtegee session={session}><ProGate><LaMicrobiologieAntibiogramme /></ProGate></RouteProtegee>} />
        <Route path="/labo/microbiologie/bacteries" element={<RouteProtegee session={session}><ProGate><LaMicrobiologieBacteries /></ProGate></RouteProtegee>} />
        <Route path="/labo/parasitologie/externes" element={<RouteProtegee session={session}><LaParasitologieExternes /></RouteProtegee>} />
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
        <Route path="/chirurgie/capnographie" element={<RouteProtegee session={session}><ProGate><ChirurgieCapnographie /></ProGate></RouteProtegee>} />
        <Route path="/chirurgie/post-op" element={<RouteProtegee session={session}><ProGate><ChirurgiePostOp /></ProGate></RouteProtegee>} />
        <Route path="/chirurgie/douleur" element={<RouteProtegee session={session}><ChirurgieDouleur /></RouteProtegee>} />

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
