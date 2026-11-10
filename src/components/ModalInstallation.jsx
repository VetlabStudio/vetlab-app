import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { sessionEnregistree } from '../lib/supabase'

const CLE_VU = 'adjuvet_installation_vue'

/* Retenu par compte plutôt que par appareil : sur un téléphone ou une
   tablette partagés, ou avec un nouveau compte sur le même téléphone,
   chaque personne voit les instructions une fois. */
function cleVu() {
  const id = sessionEnregistree()?.user?.id
  return id ? `${CLE_VU}:${id}` : CLE_VU
}

function dejaVu() {
  try {
    return localStorage.getItem(cleVu()) === '1'
  } catch {
    // Stockage bloqué : on n'insiste pas à chaque ouverture.
    return true
  }
}

function marquerVu() {
  try { localStorage.setItem(cleVu(), '1') } catch { /* stockage bloqué */ }
}

/* 'ios' | 'ios-integre' | 'android' | null (ordinateur, ou app déjà installée).
   'ios-integre' : navigateur intégré d'une autre app (courriel, Facebook,
   Instagram, Google), qui n'offre pas « Sur l'écran d'accueil ». Safari,
   Chrome, Firefox et Edge mettent « Safari/ » dans leur signature, pas
   ces navigateurs-là. */
function detecterAppareil() {
  const installee = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  if (installee) return null
  const ua = navigator.userAgent
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (ios) return !/Safari\//.test(ua) || /FBAN|FBAV|Instagram|GSA\//.test(ua) ? 'ios-integre' : 'ios'
  if (/android/i.test(ua)) return 'android'
  return null
}

const ETAPES = {
  ios: [
    { icone: 'ti-upload', titre: 'Appuyez sur le bouton Partager', detail: "Dans Safari, il est en bas de l'écran ou, depuis iOS 26, dans le menu ⋯ à côté de l'adresse. Dans Chrome, il est en haut à droite." },
    { icone: 'ti-square-plus', titre: 'Choisissez « Sur l\'écran d\'accueil »', detail: "Faites défiler la liste. Si l'option n'y est pas, appuyez sur « Modifier les actions » au bas de la liste pour l'ajouter." },
    { icone: 'ti-check', titre: 'Appuyez sur « Ajouter »', detail: "Si une option d'app web est proposée, laissez-la activée. L'icône Adjuvet apparaît sur votre écran d'accueil." },
  ],
  'ios-integre': [
    { icone: 'ti-brand-safari', titre: 'Ouvrez Adjuvet dans Safari', detail: "Vous êtes dans le navigateur d'une autre app (courriel, Facebook…), qui ne permet pas l'installation. Choisissez « Ouvrir dans Safari » dans son menu, ou copiez le lien ci-dessous et collez-le dans Safari." },
    { icone: 'ti-square-plus', titre: 'Suivez ensuite les étapes', detail: "Dans Safari, cette fenêtre s'affichera de nouveau avec les étapes d'installation." },
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
  const [lienCopie, setLienCopie] = useState(false)

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

  // Le presse-papiers peut être refusé : l'adresse reste affichée sur le bouton.
  async function copierLien() {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setLienCopie(true)
    } catch { /* l'adresse reste lisible sur le bouton */ }
  }

  if (!ouvert) return null

  const installationDirecte = appareil === 'android' && invite

  /* Rendue dans <body> : affichée dans la page, la fenêtre restait sous la
     barre du bas, qui cachait le bouton « J'ai compris » sur un téléphone. */
  return createPortal(
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

        {appareil === 'ios-integre' && (
          <button className="btn-sauvegarder" onClick={copierLien}>
            <i className={`ti ${lienCopie ? 'ti-check' : 'ti-copy'}`} style={{ marginRight: 6 }}></i>
            {lienCopie ? 'Lien copié : collez-le dans Safari' : `Copier le lien ${window.location.host}`}
          </button>
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
    </div>,
    document.body,
  )
}
