import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'
import IndicateurMotDePasse from '../components/IndicateurMotDePasse'
import { verifierMotDePasse } from '../lib/motDePasse'

/* Page ouverte par le lien « mot de passe oublié ». Le client Supabase
   lit le jeton de l'adresse et ouvre une session temporaire : c'est
   elle qui autorise le changement de mot de passe. */
export default function NouveauMotDePasse() {
  const navigate = useNavigate()
  const [etat, setEtat] = useState('verification') // verification | pret | invalide | termine
  const [utilisateur, setUtilisateur] = useState(null)
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [voirMdp, setVoirMdp] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)

  useEffect(() => {
    let actif = true
    const appliquer = (session) => {
      if (!actif) return
      if (session?.user) {
        setUtilisateur(session.user)
        setEtat('pret')
      }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evenement, session) => appliquer(session))
    supabase.auth.getSession().then(({ data: { session } }) => {
      appliquer(session)
      // Pas de session après lecture du lien : il est expiré ou déjà utilisé.
      setTimeout(() => { if (actif) setEtat(e => (e === 'verification' ? 'invalide' : e)) }, 2500)
    })
    return () => { actif = false; subscription.unsubscribe() }
  }, [])

  async function enregistrer(e) {
    e.preventDefault()
    setErreur(null)
    const evaluation = await verifierMotDePasse(motDePasse, {
      email: utilisateur?.email,
      nom: utilisateur?.user_metadata?.nom,
    })
    if (!evaluation.valide) {
      setErreur(evaluation.message)
      return
    }
    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }
    setChargement(true)
    const { error } = await supabase.auth.updateUser({ password: motDePasse })
    setChargement(false)
    if (error) {
      setErreur(traduireErreur(error, "Le mot de passe n'a pas pu être changé. Redemandez un lien et réessayez."))
      return
    }
    setEtat('termine')
  }

  return (
    <main className="auth2-page">
      <div className="auth2-contenu">
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">Copilote en santé animale</p>
        </div>

        <h1 className="auth2-section-titre">Nouveau mot de passe</h1>

        {etat === 'verification' && <p className="auth2-aide">Vérification du lien...</p>}

        {etat === 'invalide' && (
          <>
            <p className="auth2-aide">
              Ce lien est expiré ou a déjà servi. Demandez-en un nouveau : il est valable une heure.
            </p>
            <Link to="/mot-de-passe-oublie" className="auth2-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Recevoir un nouveau lien
            </Link>
          </>
        )}

        {etat === 'termine' && (
          <>
            <div className="auth2-confirme" role="status">
              <i className="ti ti-circle-check" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true"></i>
              <span>Votre mot de passe est changé.</span>
            </div>
            <button type="button" className="auth2-btn" onClick={() => navigate('/accueil', { replace: true })}>
              Continuer
            </button>
          </>
        )}

        {etat === 'pret' && (
          <form onSubmit={enregistrer} className="auth2-form" noValidate>
            {/* Le courriel aide les gestionnaires de mots de passe à enregistrer le bon compte. */}
            <input type="email" value={utilisateur?.email || ''} autoComplete="username" readOnly hidden />
            <div className="auth2-input-wrap">
              <label className="auth2-flottant">
                <input
                  type={voirMdp ? 'text' : 'password'}
                  className="auth2-input"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  autoComplete="new-password"
                  placeholder=" "
                  required
                />
                <span className="auth2-flottant-texte">Nouveau mot de passe</span>
              </label>
              <button type="button" className="auth2-oeil" onClick={() => setVoirMdp(v => !v)} aria-label={voirMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                <i className={`ti ${voirMdp ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
              </button>
            </div>
            <IndicateurMotDePasse motDePasse={motDePasse} email={utilisateur?.email} nom={utilisateur?.user_metadata?.nom} />
            <label className="auth2-flottant">
              <input
                type={voirMdp ? 'text' : 'password'}
                className="auth2-input"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder=" "
                required
              />
              <span className="auth2-flottant-texte">Confirmer le mot de passe</span>
            </label>
            {erreur && <p className="erreur" style={{ textAlign: 'center', color: '#FFFFFF' }}>{erreur}</p>}
            <button type="submit" className="auth2-btn" disabled={chargement}>
              {chargement ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        )}
      </div>

      <div className="auth2-photo">
        <img src="/Chien_10.png" alt="" />
      </div>
    </main>
  )
}
