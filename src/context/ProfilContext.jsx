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
  const [membre, setMembre] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    let initialLoad = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (initialLoad) { initialLoad = false; return }
      if (session) chargerProfil()
      else {
        setProfil(null)
        setMembre(null)
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
      setMembre(null)
      setChargement(false)
      return
    }

    const { data: profilData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: membreData } = await supabase
      .from('team_members')
      .select('team_id, role')
      .eq('user_id', user.id)
      .single()

    setProfil(profilData)
    setMembre(membreData || null)
    setChargement(false)
  }

  const estPro = profil?.plan === 'pro' || profil?.plan === 'equipe'
  const estEquipe = profil?.plan === 'equipe'
  const roleEquipe = membre?.role || null
  const teamId = membre?.team_id || null

  return (
    <ProfilContext.Provider value={{ profil, estPro, estEquipe, roleEquipe, teamId, chargement, chargerProfil }}>
      {children}
    </ProfilContext.Provider>
  )
}

export function useProfil() {
  return useContext(ProfilContext)
}
