import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [confirmé, setConfirmé] = useState(false)
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
    <div className="auth2-page">

      <div className="auth2-contenu">
        <div className="auth2-logo-zone">
          <img src="/adjuvet-logo-anime.svg" alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">Copilote en santé animale</p>
        </div>

        <p className="auth2-section-titre">Connexion</p>

        {confirmé && (
          <div className="auth2-confirme">
            <i className="ti ti-circle-check" style={{ fontSize: 20, flexShrink: 0 }}></i>
            <span>Adresse courriel confirmée ! Vous pouvez maintenant vous connecter.</span>
          </div>
        )}

        <form onSubmit={handleConnexion} className="auth2-form">
          <input
            type="email"
            className="auth2-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Courriel"
            required
          />
          <input
            type="password"
            className="auth2-input"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Mot de passe"
            required
          />
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
    </div>
  )
}
