import { useState, useEffect } from 'react'
import { isAuthRetryableFetchError } from '@supabase/supabase-js'
import { supabase, horsLigne } from '../lib/supabase'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import SuggestionCourriel from '../components/SuggestionCourriel'
import { useSuggestionCourriel } from '../hooks/useSuggestionCourriel'
import { t } from '../lib/i18n'
import BoutonLangue from '../components/BoutonLangue'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)
  // Adresse d'un compte pas encore confirmé, et état du renvoi du courriel.
  const [nonConfirme, setNonConfirme] = useState(null)
  const [renvoi, setRenvoi] = useState(null)
  /* Supabase refuse un nouvel envoi avant une minute. On garde l'heure de
     fin plutôt qu'un compte à rebours : la personne quitte souvent l'app
     pour lire ses courriels, et les minuteries y sont alors suspendues. */
  const [finAttente, setFinAttente] = useState(0)
  const [maintenant, setMaintenant] = useState(0)
  const attenteRenvoi = Math.max(0, Math.ceil((finAttente - maintenant) / 1000))
  // Retour du lien de confirmation (inscription ou nouveau courriel).
  const [confirmé] = useState(() => /type=(signup|email_change)/.test(window.location.hash))
  const [voirMdp, setVoirMdp] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { suggestion } = useSuggestionCourriel(email)

  useEffect(() => {
    if (confirmé) window.history.replaceState(null, '', window.location.pathname)
  }, [confirmé])

  useEffect(() => {
    if (!finAttente) return
    const minuterie = setInterval(() => {
      const ms = Date.now()
      setMaintenant(ms)
      if (ms >= finAttente) clearInterval(minuterie)
    }, 1000)
    return () => clearInterval(minuterie)
  }, [finAttente])

  const handleConnexion = async (e) => {
    e.preventDefault()
    setChargement(true)
    setErreur(null)
    setNonConfirme(null)
    setRenvoi(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })

    if (error) {
      // Sans réseau, le message « mot de passe incorrect » serait trompeur.
      // Supabase ne signale un courriel non confirmé qu'avec le bon mot de
      // passe : ce message ne révèle donc pas si un compte existe.
      const sansReseau = horsLigne() || isAuthRetryableFetchError(error)
      if (!sansReseau && error.code === 'email_not_confirmed') setNonConfirme(email.trim())
      setErreur(sansReseau
        ? t('Connexion internet requise pour vous connecter.')
        : error.code === 'email_not_confirmed'
          ? t('Votre adresse courriel n\'est pas encore confirmée. Ouvrez le lien reçu par courriel (vérifiez aussi les courriels indésirables), puis connectez-vous.')
          : error.status === 429 || error.code === 'over_request_rate_limit'
            ? t('Trop de tentatives. Réessayez dans quelques minutes.')
            : t('Courriel ou mot de passe incorrect.'))
    } else {
      navigate(redirectUrl || '/accueil')
    }
    setChargement(false)
  }

  // Renvoie le courriel de confirmation de l'inscription.
  const renvoyerConfirmation = async () => {
    setRenvoi('envoi')
    const { error } = await supabase.auth.resend({ type: 'signup', email: nonConfirme })
    if (!error) {
      setErreur(null)
      setRenvoi('envoye')
      const ms = Date.now()
      setMaintenant(ms)
      setFinAttente(ms + 60000)
      return
    }
    setRenvoi(null)
    if (horsLigne() || isAuthRetryableFetchError(error)) {
      setErreur(t('Connexion internet requise pour renvoyer le courriel.'))
    } else if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
      setErreur(t('Un courriel vient déjà d\'être envoyé. Attendez une minute avant d\'en demander un autre.'))
    } else {
      console.error('Renvoi du courriel de confirmation:', error)
      setErreur(t('Le courriel n\'a pas pu être envoyé. Réessayez dans quelques minutes.'))
    }
  }

  return (
    <main className="auth2-page">

      <div className="auth2-contenu">
        <BoutonLangue />
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">{t('Copilote en santé animale')}</p>
        </div>

        <h1 className="auth2-section-titre">{t('Connexion')}</h1>

        {confirmé && (
          <div className="auth2-confirme">
            <i className="ti ti-circle-check" style={{ fontSize: 20, flexShrink: 0 }}></i>
            <span>{t('Adresse courriel confirmée ! Vous pouvez maintenant vous connecter.')}</span>
          </div>
        )}

        <form onSubmit={handleConnexion} className="auth2-form">
          <label className="auth2-flottant">
            <input
              type="email"
              className="auth2-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder=" "
              required
              aria-describedby={suggestion ? 'suggestion-courriel' : undefined}
            />
            <span className="auth2-flottant-texte">{t('Courriel')}</span>
          </label>
          <SuggestionCourriel id="suggestion-courriel" suggestion={suggestion} onCorriger={() => setEmail(suggestion)} surFond="violet" />
          <div className="auth2-input-wrap">
            <label className="auth2-flottant">
              <input
                type={voirMdp ? 'text' : 'password'}
                className="auth2-input"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="current-password"
                placeholder=" "
                required
              />
              <span className="auth2-flottant-texte">{t('Mot de passe')}</span>
            </label>
            <button type="button" className="auth2-oeil" onClick={() => setVoirMdp(v => !v)} aria-label={voirMdp ? t('Masquer le mot de passe') : t('Afficher le mot de passe')}>
              <i className={`ti ${voirMdp ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
            </button>
          </div>
          <Link to="/mot-de-passe-oublie" className="auth2-oublie">{t('Mot de passe oublié ?')}</Link>
          {erreur && <p className="erreur" style={{ textAlign: 'center' }}>{erreur}</p>}
          {nonConfirme && renvoi !== 'envoye' && (
            <button
              type="button"
              onClick={renvoyerConfirmation}
              disabled={renvoi === 'envoi'}
              style={{ alignSelf: 'center', background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 600, color: '#213058', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {renvoi === 'envoi' ? t('Envoi...') : t('Renvoyer le courriel de confirmation')}
            </button>
          )}
          {/* Supabase crée un nouveau lien à chaque envoi : celui des courriels
              précédents ne fonctionne plus. Gmail et Outlook rangent souvent le
              nouveau courriel dans la conversation du premier (même sujet),
              d'où le rappel. */}
          {renvoi === 'envoye' && (
            <>
              <div className="auth2-confirme" role="status">
                <i className="ti ti-mail" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true"></i>
                <span>
                  {t('Courriel envoyé à {adresse}. Ouvrez le lien du courriel le plus récent : ceux des courriels précédents ne fonctionnent plus.', { adresse: nonConfirme })}
                  {' '}{t('Il peut prendre quelques minutes à arriver. Vérifiez aussi les courriels indésirables et la conversation du premier courriel, où Gmail et Outlook l\'ajoutent souvent.')}
                </span>
              </div>
              <button
                type="button"
                onClick={renvoyerConfirmation}
                disabled={attenteRenvoi > 0}
                style={{ alignSelf: 'center', background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 600, color: '#213058', textDecoration: attenteRenvoi > 0 ? 'none' : 'underline', opacity: attenteRenvoi > 0 ? 0.6 : 1, cursor: attenteRenvoi > 0 ? 'default' : 'pointer' }}
              >
                {attenteRenvoi > 0 ? t('Renvoyer de nouveau dans {n} s', { n: attenteRenvoi }) : t('Rien reçu ? Renvoyer de nouveau')}
              </button>
            </>
          )}
          <button type="submit" className="auth2-btn" disabled={chargement}>
            {chargement ? t('Connexion...') : t('Se connecter')}
          </button>
        </form>

        <p className="auth2-lien">
          {t('Pas encore de compte ?')}{' '}
          <Link to={redirectUrl ? `/inscription?redirect=${encodeURIComponent(redirectUrl)}` : '/inscription'}>
            {t('Créer un compte')}
          </Link>
        </p>
      </div>

      <div className="auth2-photo">
        <img src="/Chien_10.png" alt="" />
      </div>
    </main>
  )
}
