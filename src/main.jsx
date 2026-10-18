import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
// Lu par le filet de démarrage d'index.html.
window.__adjuvetDemarre = true

/* Garde l'app sur l'appareil pour l'usage hors ligne (voir src/sw.js).
   Pour retirer le mode hors ligne, mettre false et publier : chaque
   appareil désinstalle alors le service worker et efface ses copies
   à sa prochaine ouverture avec internet. */
const MODE_HORS_LIGNE = true

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      if (MODE_HORS_LIGNE) {
        await navigator.serviceWorker.register('/sw.js')
      } else {
        for (const inscription of await navigator.serviceWorker.getRegistrations()) await inscription.unregister()
        for (const nom of await caches.keys()) if (nom.startsWith('adjuvet-')) await caches.delete(nom)
      }
    } catch (erreur) {
      console.error('Service worker :', erreur)
    }
  })
}
