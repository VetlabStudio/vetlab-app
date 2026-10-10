import { useEffect, useState } from 'react'

const CLE_VU = 'adjuvet_installation_vue'

function dejaVu() {
  try {
    return localStorage.getItem(CLE_VU) === '1'
  } catch {
    // Stockage bloqué : on n'insiste pas à chaque ouverture.
    return true
  }
}

function marquerVu() {
  try { localStorage.setItem(CLE_VU, '1') } catch { /* stockage bloqué */ }
}

// 'ios' | 'android' | null (ordinateur, ou app déjà installée)
function detecterAppareil() {
  const installee = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  if (installee) return null
  const ua = navigator.userAgent
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (ios) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return null
}

const ETAPES = {
  ios: [
    { icone: 'ti-upload', titre: 'Appuyez sur le bouton Partager', detail: "En bas de l'écran dans Safari, en haut à droite dans Chrome." },
    { icone: 'ti-square-plus', titre: 'Choisissez « Sur l\'écran d\'accueil »', detail: 'Faites défiler la liste si vous ne le voyez pas.' },
    { icone: 'ti-check', titre: 'Appuyez sur « Ajouter »', detail: "L'icône Adjuvet apparaît sur votre écran d'accueil." },
  ],
  android: [
    { icone: 'ti-dots-vertical', titre: 'Ouvrez le menu du navigateur', detail: 'Les trois points en haut à droite.' },
    { icone: 'ti-download', titre: 'Choisissez « Installer l\'application »', detail: 'Ou « Ajouter à l\'écran d\'accueil », selon le navigateur.' },
    { icone: 'ti-check', titre: 'Confirmez', detail: "L'icône Adjuvet apparaît sur votre écran d'accueil." },
  ],
}

export default function ModalInstallation() {
  const [appareil] = useState(detecterAppareil)
  const [ouvert, setOuvert] = useState(false)
  // Capté tôt par le script de index.html : Chrome l'envoie avant que cette page existe.
  const [invite, setInvite] = useState(() => window.__adjuvetInstall || null)

  useEffect(() => {
    if (!appareil || dejaVu()) return
    const delai = setTimeout(() => setOuvert(true), 800)

    const capter = (e) => {
      e.preventDefault()
      window.__adjuvetInstall = e
      setInvite(e)
    }
    const installee = () => {
      marquerVu()
      setOuvert(false)
    }
    window.addEventListener('beforeinstallprompt', capter)
    window.addEventListener('appinstalled', installee)
    return () => {
      clearTimeout(delai)
      window.removeEventListener('beforeinstallprompt', capter)
      window.removeEventListener('appinstalled', installee)
    }
  }, [appareil])

  function fermer() {
    marquerVu()
    setOuvert(false)
  }

  async function installer() {
    invite.prompt()
    const { outcome } = await invite.userChoice
    window.__adjuvetInstall = null
    setInvite(null)
    if (outcome === 'accepted') fermer()
  }

  if (!ouvert) return null

  const installationDirecte = appareil === 'android' && invite

  return (
    <div className="popup-overlay" onClick={fermer}>
      <div className="popup-card" role="dialog" aria-modal="true" aria-label="Installer Adjuvet" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <span>Installer Adjuvet</span>
          <button className="popup-close" onClick={fermer} aria-label="Fermer">✕</button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img src="/icon-192.png" alt="" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 10 }} />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
            Ajoutez Adjuvet à votre écran d'accueil pour l'ouvrir comme une application :
            en plein écran, en un geste, sans passer par le navigateur.
          </p>
        </div>

        {installationDirecte ? (
          <button className="btn-sauvegarder" onClick={installer}>
            <i className="ti ti-download" style={{ marginRight: 6 }}></i>
            Installer l'application
          </button>
        ) : (
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ETAPES[appareil].map((etape, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${etape.icone}`} style={{ fontSize: 18 }}></i>
                </span>
                <span>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {i + 1}. {etape.titre}
                  </span>
                  <span style={{ display: 'block', fontSize: 12.5, color: 'var(--text-hint)', marginTop: 2 }}>
                    {etape.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}

        <button
          onClick={fermer}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
          }}
        >
          {installationDirecte ? 'Plus tard' : "J'ai compris"}
        </button>
      </div>
    </div>
  )
}
