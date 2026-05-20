import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Inscription() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  const [succes, setSucces] = useState(false)
  const [chargement, setChargement] = useState(false)
  const navigate = useNavigate()

  const handleInscription = async (e) => {
    e.preventDefault()
    setErreur(null)

    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }

    setChargement(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    })

    if (error) {
      setErreur("Erreur lors de l'inscription. Vérifie ton courriel.")
    } else {
      setSucces(true)
    }
    setChargement(false)
  }

  if (succes) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="succes-icone">
            <i className="ti ti-circle-check"></i>
          </div>
          <h1 className="auth-titre">Vérifie ton courriel</h1>
          <p className="auth-description">
            Un lien de confirmation t'a été envoyé. Clique dessus pour activer ton compte.
          </p>
          <Link to="/connexion" className="btn-primary" style={{display:'block', textAlign:'center'}}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logo.png" alt="Vetlab Studio" className="auth-logo" />
        <h1 className="auth-titre">Créer un compte</h1>

        <form onSubmit={handleInscription} className="auth-form">
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
              minLength={6}
              required
            />
          </div>

          <div className="champ">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {erreur && <p className="erreur">{erreur}</p>}

          <button type="submit" className="btn-primary" disabled={chargement}>
            {chargement ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-lien">
          Déjà un compte ?{' '}
          <Link to="/connexion">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}