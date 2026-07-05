import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Inscription() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  const [succes, setSucces] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [showAvertissement, setShowAvertissement] = useState(false)
  const [avertissementLu, setAvertissementLu] = useState(false)
  const navigate = useNavigate()

  const handleInscription = (e) => {
    e.preventDefault()
    setErreur(null)

    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }

    setShowAvertissement(true)
  }

  const handleScrollAvertissement = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop - clientHeight < 8) setAvertissementLu(true)
  }

  const confirmerInscription = async () => {
    setShowAvertissement(false)
    setChargement(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: { data: { nom: nom.trim() } },
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
            <label>Nom complet</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Prénom Nom"
              required
            />
          </div>

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

      {showAvertissement && (
        <div className="popup-overlay">
          <div className="avertissement-card">
            <h2 className="avertissement-titre">Avertissement et conditions d'utilisation</h2>
            <div className="avertissement-texte" onScroll={handleScrollAvertissement}>
              <p>Avant de continuer, merci de lire et d'accepter ce qui suit :</p>
              <p>Le contenu d'ADJUVET (calculateurs, fiches médicaments, protocoles, checklists, guides de référence, etc.) est fourni <strong>à titre informatif et éducatif seulement</strong>. Il ne constitue pas un avis médical, un diagnostic ou une recommandation de traitement, et ne remplace jamais le jugement professionnel d'un médecin vétérinaire.</p>
              <p>Toute décision clinique doit être validée par un professionnel qualifié, selon l'état particulier de chaque patient. Les calculateurs sont des outils d'aide au calcul — vérifie toujours les valeurs obtenues avant administration.</p>
              <p>Nous ne pouvons garantir l'exactitude, l'exhaustivité ou l'actualité complète du contenu. <strong>L'utilisateur assume l'entière responsabilité des décisions ou actions prises à partir des informations contenues dans ADJUVET.</strong> ADJUVET, Vetlab Studio et ses contributeurs déclinent toute responsabilité quant aux dommages résultant de l'utilisation de l'application, fournie « telle quelle », sans garantie d'aucune sorte.</p>
              <p>En cliquant sur « J'ai compris et j'accepte », tu confirmes avoir lu cet avertissement et tu consens à utiliser ADJUVET en toute connaissance de ces limites.</p>
            </div>
            <button className="btn-primary" disabled={!avertissementLu} onClick={confirmerInscription}>
              J'ai compris et j'accepte
            </button>
          </div>
        </div>
      )}
    </div>
  )
}