import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SuggestionCourriel from '../components/SuggestionCourriel'
import { useSuggestionCourriel } from '../hooks/useSuggestionCourriel'
import { t } from '../lib/i18n'
import BoutonLangue from '../components/BoutonLangue'

const FORMAT_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState(null)
  const [envoye, setEnvoye] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)
  const { suggestion, avertie, doitConfirmer } = useSuggestionCourriel(email)

  async function envoyer(e) {
    e.preventDefault()
    setErreur(null)
    if (!FORMAT_COURRIEL.test(email.trim())) {
      setErreur(t('Format de courriel invalide (ex. nom@domaine.com).'))
      return
    }
    // Faute de frappe probable pas encore vue : on la montre d'abord.
    if (doitConfirmer()) return
    setChargement(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    })
    setChargement(false)
    /* Le même message que le compte existe ou non : la page ne doit
       pas révéler quelles adresses ont un compte. Seule une limite
       d'envoi atteinte est signalée. */
    if (error && error.status === 429) {
      setErreur(t('Trop de demandes. Réessayez dans quelques minutes.'))
      return
    }
    if (error) console.error('Envoi du lien de réinitialisation:', error)
    setEnvoye(true)
  }

  return (
    <main className="auth2-page">
      <div className="auth2-contenu">
        <BoutonLangue />
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">{t('Copilote en santé animale')}</p>
        </div>

        <h1 className="auth2-section-titre">{t('Mot de passe oublié')}</h1>

        {envoye ? (
          <div className="auth2-confirme" role="status">
            <i className="ti ti-mail" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true"></i>
            <span>
              {t('Si un compte existe pour cette adresse, un courriel vient de vous être envoyé.')}
              {' '}{t('Ouvrez le lien qu\'il contient pour choisir un nouveau mot de passe.')}
            </span>
          </div>
        ) : (
          <form onSubmit={envoyer} className="auth2-form" noValidate>
            <p className="auth2-aide">
              {t('Entrez l\'adresse de votre compte. Vous recevrez un lien pour choisir un nouveau mot de passe.')}
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
                aria-describedby={suggestion ? 'suggestion-courriel' : undefined}
              />
              <span className="auth2-flottant-texte">{t('Courriel')}</span>
            </label>
            <SuggestionCourriel id="suggestion-courriel" suggestion={suggestion} onCorriger={() => setEmail(suggestion)} avertie={avertie} bouton={t('Recevoir le lien')} surFond="violet" />
            {erreur && <p className="erreur" style={{ textAlign: 'center', color: '#FFFFFF' }}>{erreur}</p>}
            <button type="submit" className="auth2-btn" disabled={chargement}>
              {chargement ? t('Envoi...') : t('Recevoir le lien')}
            </button>
          </form>
        )}

        <p className="auth2-lien">
          <Link to="/connexion">{t('Retour à la connexion')}</Link>
        </p>
      </div>

      <div className="auth2-photo">
        <img src="/Chien_10.png" alt="" />
      </div>
    </main>
  )
}
