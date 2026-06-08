import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const navigate = useNavigate()

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
      navigate('/accueil')
    }
    setChargement(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logoadjuvet-blanc.png" alt="Vetlab Studio" className="auth-logo" />
        <h1 className="auth-titre">Connexion</h1>

        <form onSubmit={handleConnexion} className="auth-form">
          <div className="champ">
            <label>Courriel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@courriel.com"
              required
            />
          </div>

          <div className="champ">
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {erreur && <p className="erreur">{erreur}</p>}

          <button type="submit" className="btn-primary" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-lien">
          Pas encore de compte ?{' '}
          <Link to="/inscription">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}