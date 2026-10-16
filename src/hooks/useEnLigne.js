import { useSyncExternalStore } from 'react'

function abonner(rappel) {
  window.addEventListener('online', rappel)
  window.addEventListener('offline', rappel)
  return () => {
    window.removeEventListener('online', rappel)
    window.removeEventListener('offline', rappel)
  }
}

// Vrai tant que le navigateur se dit connecté ; se met à jour quand le réseau change.
export default function useEnLigne() {
  return useSyncExternalStore(abonner, () => navigator.onLine, () => true)
}
