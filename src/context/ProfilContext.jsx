import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProfilContext = createContext({
  profil: null,
  estPro: false,
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

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfil(data)
    setChargement(false)
  }

  const estPro = profil?.plan === 'pro'

  return (
    <ProfilContext.Provider value={{ profil, estPro, chargement, chargerProfil }}>
      {children}
    </ProfilContext.Provider>
  )
}

export function useProfil() {
  return useContext(ProfilContext)
}
