import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProfilContext = createContext({
  profil: null,
  estPro: false,
  estEquipe: false,
  roleEquipe: null,
  teamId: null,
  chargement: true,
})

export function ProfilProvider({ children }) {
  const [profil, setProfil] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    let initialLoad = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (initialLoad) { initialLoad = false; return }
      if (session) chargerProfil()
      else {
        setProfil(null)
        setChargement(false)
      }
    })
    chargerProfil()

    return () => subscription.unsubscribe()
  }, [])

  async function chargerProfil() {
    setChargement(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setProfil(null)
      setChargement(false)
      return
    }

    let { data: profilData, error: profilError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profilError && profilError.code !== 'PGRST116') {
      // Erreur réseau ou RLS - ne pas toucher au profil existant
      setChargement(false)
      return
    }

    if (!profilData) {
      // Profil vraiment absent - création initiale seulement
      const { data: nouveauProfil } = await supabase
        .from('profiles')
        .insert({ id: user.id, plan: 'free', email: user.email })
        .select('*')
        .single()
      profilData = nouveauProfil
    } else if (!profilData.email && user.email) {
      await supabase.from('profiles').update({ email: user.email }).eq('id', user.id)
      profilData = { ...profilData, email: user.email }
    }

    setProfil(profilData)
    setChargement(false)
  }

  const estPro = profil?.plan === 'pro' || profil?.plan === 'equipe'
  const estEquipe = profil?.plan === 'equipe'
  const roleEquipe = profil?.role || null
  const teamId = profil?.equipe_id || null

  return (
    <ProfilContext.Provider value={{ profil, estPro, estEquipe, roleEquipe, teamId, chargement, chargerProfil }}>
      {children}
    </ProfilContext.Provider>
  )
}

export function useProfil() {
  return useContext(ProfilContext)
}
