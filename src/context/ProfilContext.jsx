import { createContext, useContext } from 'react'

export const ProfilContext = createContext({
  profil: null,
  estPro: false,
  estEquipe: false,
  roleEquipe: null,
  teamId: null,
  chargement: true,
  erreurReseau: false,
})

export function useProfil() {
  return useContext(ProfilContext)
}
