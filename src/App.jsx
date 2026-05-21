import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { useLocation } from 'react-router-dom'

import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Accueil from './pages/Accueil'
import Calculateurs from './pages/Calculateurs'
import Profil from './pages/Profil'
import DroguesAnesthesiques from './pages/DroguesAnesthesiques'
import AdminMedicaments from './pages/AdminMedicaments'
import AdminMedicamentForm from './pages/AdminMedicamentForm'
import FicheMedicament from './pages/FicheMedicament'
import Fluidotherapie from './pages/Fluidotherapie'
import CRI from './pages/CRI'

import Header from './components/Header'
import BottomNav from './components/BottomNav'

function LayoutPrincipal({ children }) {
  const location = useLocation()
  const estAccueil = location.pathname === '/accueil'

  return (
    <div className={`app-layout ${estAccueil ? 'app-layout-accueil' : ''}`}>
      <Header />
      <main className="contenu-principal">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

function RouteProtegee({ session, children }) {
  if (!session) return <Navigate to="/connexion" replace />
  return <LayoutPrincipal>{children}</LayoutPrincipal>
}

function RouteProtegeeAdmin({ session, children }) {
  if (!session) return <Navigate to="/connexion" replace />
  return children
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
      <Routes>

        {/* AUTH */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* APP PRINCIPALE */}
        <Route path="/accueil" element={
          <RouteProtegee session={session}><Accueil /></RouteProtegee>
        } />
        <Route path="/calculateurs" element={
          <RouteProtegee session={session}><Calculateurs /></RouteProtegee>
        } />
        <Route path="/profil" element={
          <RouteProtegee session={session}><Profil /></RouteProtegee>
        } />
        <Route path="/drogues/fiche/:id" element={
          <RouteProtegee session={session}><FicheMedicament /></RouteProtegee>
        } />
        <Route path="/calculateurs/fluido" element={
  <RouteProtegee session={session}><Fluidotherapie /></RouteProtegee>
} />
        <Route path="/calculateurs/cri" element={
  <RouteProtegee session={session}><CRI /></RouteProtegee>
} />

        {/* DROGUES */}
        <Route path="/drogues/anesthesiques" element={
          <RouteProtegee session={session}><DroguesAnesthesiques /></RouteProtegee>
        } />

        {/* ADMIN — pas de BottomNav */}
        <Route path="/admin/medicaments" element={
          <RouteProtegeeAdmin session={session}><AdminMedicaments /></RouteProtegeeAdmin>
        } />
        <Route path="/admin/medicaments/:id" element={
          <RouteProtegeeAdmin session={session}><AdminMedicamentForm /></RouteProtegeeAdmin>
        } />

        {/* FALLBACK */}
        <Route path="*" element={
          <Navigate to={session ? '/accueil' : '/connexion'} replace />
        } />

      </Routes>
    </BrowserRouter>
  )
}
