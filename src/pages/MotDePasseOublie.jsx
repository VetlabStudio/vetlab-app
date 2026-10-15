import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const FORMAT_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState(null)
  const [envoye, setEnvoye] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)

  async function envoyer(e) {
    e.preventDefault()
    setErreur(null)
    if (!FORMAT_COURRIEL.test(email.trim())) {
      setErreur('Format de courriel invalide (ex. nom@domaine.com).')
      return
    }
    setChargement(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    })
    setChargement(false)
    /* Le même message que le compte existe ou non : la page ne doit
       pas révéler quelles adresses ont un compte. Seule une limite
       d'envoi atteinte est signalée. */
    if (error && error.status === 429) {
      setErreur('Trop de demandes. Réessayez dans quelques minutes.')
      return
    }
    if (error) console.error('Envoi du lien de réinitialisation:', error)
    setEnvoye(true)
  }

  return (
    <main className="auth2-page">
      <div className="auth2-contenu">
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">Copilote en santé animale</p>
        </div>

        <h1 className="auth2-section-titre">Mot de passe oublié</h1>

        {envoye ? (
          <div className="auth2-confirme" role="status">
            <i className="ti ti-mail" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true"></i>
            <span>
              Si un compte existe pour cette adresse, un courriel vient de vous être envoyé.
              Ouvrez le lien qu'il contient pour choisir un nouveau mot de passe.
            </span>
          </div>
        ) : (
          <form onSubmit={envoyer} className="auth2-form" noValidate>
            <p className="auth2-aide">
              Entrez l'adresse de votre compte. Vous recevrez un lien pour choisir un nouveau mot de passe.
            </p>
            <label className="auth2-flottant">
              <input
                type="email"
                className="auth2-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder=" "
                required
              />
              <span className="auth2-flottant-texte">Courriel</span>
            </label>
            {erreur && <p className="erreur" style={{ textAlign: 'center', color: '#FFFFFF' }}>{erreur}</p>}
            <button type="submit" className="auth2-btn" disabled={chargement}>
              {chargement ? 'Envoi...' : 'Recevoir le lien'}
            </button>
          </form>
        )}

        <p className="auth2-lien">
          <Link to="/connexion">Retour à la connexion</Link>
        </p>
      </div>

      <div className="auth2-photo">
        <img src="/Chien_10.png" alt="" />
      </div>
    </main>
  )
}
