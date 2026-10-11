import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [confirmé, setConfirmé] = useState(false)
  const [voirMdp, setVoirMdp] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=signup') || hash.includes('type=email_change')) {
      setConfirmé(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleConnexion = async (e) => {
    e.preventDefault()
    setChargement(true)
    setErreur(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })

    if (error) {
      setErreur('Courriel ou mot de passe incorrect.')
    } else {
      navigate(redirectUrl || '/accueil')
    }
    setChargement(false)
  }

  return (
    <main className="auth2-page">

      <div className="auth2-contenu">
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">Copilote en santé animale</p>
        </div>

        <h1 className="auth2-section-titre">Connexion</h1>

        {confirmé && (
          <div className="auth2-confirme">
            <i className="ti ti-circle-check" style={{ fontSize: 20, flexShrink: 0 }}></i>
            <span>Adresse courriel confirmée ! Vous pouvez maintenant vous connecter.</span>
          </div>
        )}

        <form onSubmit={handleConnexion} className="auth2-form">
          <label className="auth2-flottant">
            <input
              type="email"
              className="auth2-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <span className="auth2-flottant-texte">Courriel</span>
          </label>
          <div className="auth2-input-wrap">
            <label className="auth2-flottant">
              <input
                type={voirMdp ? 'text' : 'password'}
                className="auth2-input"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder=" "
                required
              />
              <span className="auth2-flottant-texte">Mot de passe</span>
            </label>
            <button type="button" className="auth2-oeil" onClick={() => setVoirMdp(v => !v)} aria-label={voirMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <i className={`ti ${voirMdp ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
            </button>
          </div>
          {erreur && <p className="erreur" style={{ textAlign: 'center' }}>{erreur}</p>}
          <button type="submit" className="auth2-btn" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth2-lien">
          Pas encore de compte ?{' '}
          <Link to={redirectUrl ? `/inscription?redirect=${encodeURIComponent(redirectUrl)}` : '/inscription'}>
            Créer un compte
          </Link>
        </p>
      </div>

      <div className="auth2-photo">
        <img src="/Chien_10.png" alt="" />
      </div>
    </main>
  )
}
