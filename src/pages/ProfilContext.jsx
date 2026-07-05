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

    let { data: profilData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const nomMeta = user.user_metadata?.nom
    if (!profilData && nomMeta) {
      const { data: inserted } = await supabase
        .from('profiles')
        .upsert({ id: user.id, nom: nomMeta }, { onConflict: 'id' })
        .select()
        .single()
      profilData = inserted
    } else if (profilData && !profilData.nom && nomMeta) {
      await supabase.from('profiles').update({ nom: nomMeta }).eq('id', user.id)
      profilData = { ...profilData, nom: nomMeta }
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
