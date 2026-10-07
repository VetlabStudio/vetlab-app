import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const CGU_PAGES = [
  {
    fond:   '/fond-jaune.jpg',
    animal: '/Chat08.png',
    sections: [
      {
        titre: 'Acceptation des termes',
        texte: 'En créant un compte et en utilisant ADJUVET, vous acceptez les présentes conditions d\'utilisation. Ces conditions constituent un accord entre vous et VetLab Studio.',
      },
    ],
  },
  {
    fond:   '/fond-vert.jpg',
    animal: '/perroquet01.png',
    sections: [
      {
        titre: 'Utilisation du service',
        texte: 'ADJUVET est fourni à titre informatif uniquement et ne remplace pas le jugement clinique d\'un vétérinaire. VetLab Studio décline toute responsabilité pour les décisions thérapeutiques prises à partir de l\'application.',
      },
    ],
  },
  {
    fond:   '/fond-gris.jpg',
    animal: '/Lapin01.png',
    sections: [
      {
        titre: 'Abonnement et facturation',
        texte: 'Le forfait Pro est un abonnement payant - mensuel ou annuel - géré via Stripe. Vous pouvez gérer ou annuler votre abonnement à tout moment depuis la page Profil. Aucun remboursement n\'est offert pour les périodes partiellement utilisées.',
      },
    ],
  },
  {
    fond:   '/fond-mauve.jpg',
    animal: '/cheval.png',
    sections: [
      {
        titre: 'Modifications',
        texte: 'Ces conditions peuvent être mises à jour à l\'occasion. Les changements importants vous seront communiqués par courriel. En continuant à utiliser ADJUVET après une mise à jour, vous acceptez les nouvelles conditions. Pour toute question, contactez-nous à info@vetlabstudio.ca.',
      },
    ],
  },
]

const MSG_COMPTE_EXISTANT = 'Un compte existe déjà avec ce courriel. Connectez-vous plutôt.'

export default function Inscription() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  const [succes, setSucces] = useState(false)
  const [chargement, setChargement] = useState(false)
  // 'form' ou l'index de la page CGU affichée
  const [vue, setVue] = useState('form')
  const [transition, setTransition] = useState(null)
  const [voirMdp, setVoirMdp] = useState(false)
  const [voirConfirm, setVoirConfirm] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)
  const touchStartX = useRef(null)
  const navigate = useNavigate()

  const allerVue = (prochaine, direction) => {
    if (prochaine === vue) return
    setTransition({ depuis: vue, direction })
    setVue(prochaine)
  }

  const handleInscription = async (e) => {
    e.preventDefault()
    setErreur(null)
    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }

    setChargement(true)
    const { data: existe, error } = await supabase.rpc('email_existe', { p_email: email.trim() })
    setChargement(false)

    if (error) console.error('Vérification du courriel impossible:', error)
    if (existe === true) {
      setErreur(MSG_COMPTE_EXISTANT)
      return
    }

    allerVue(0, 'forward')
  }

  const handleSwipeStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleSwipeEnd = (e) => {
    if (touchStartX.current === null || vue === 'form') return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50 && vue < CGU_PAGES.length - 1) {
      allerVue(vue + 1, 'forward')
    } else if (delta > 50 && vue > 0) {
      allerVue(vue - 1, 'back')
    }
  }

  const handleAccepter = async () => {
    setChargement(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: motDePasse,
      options: { data: { nom: nom.trim() } },
    })
    setChargement(false)

    const dejaInscrit = error
      ? /already|registered|exists/i.test(error.message || '')
      : data?.user?.identities?.length === 0

    if (error || dejaInscrit) {
      setErreur(dejaInscrit ? MSG_COMPTE_EXISTANT : "Erreur lors de l'inscription. Vérifiez votre courriel.")
      allerVue('form', 'back')
      return
    }

    setSucces(true)
  }

  if (succes) {
    return (
      <div className="auth2-page">
        <div className="auth2-contenu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-circle-check" style={{ fontSize: 64, color: '#213058', marginBottom: 20 }}></i>
          <p className="auth2-section-titre" style={{ textAlign: 'center', fontSize: 22 }}>Vérifiez votre courriel</p>
          <p style={{ fontSize: 15, color: '#213058', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
            Un lien de confirmation vous a été envoyé. Cliquez dessus pour activer votre compte.
          </p>
          <Link to="/connexion" className="auth2-btn" style={{ display: 'block', textDecoration: 'none' }}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  const renderCgu = (index) => {
    const { fond, animal, sections } = CGU_PAGES[index]
    const estDernier = index === CGU_PAGES.length - 1
    return (
      <div className="cgu-page" style={{ backgroundImage: `url('${fond}')` }}>
        <div className="cgu-contenu">
          <img src="/icone-logo-bleu.svg" alt="" className="cgu-icone" />
          <h1 className="cgu-titre">Conditions d'utilisations</h1>
          <div className="cgu-sections">
            {sections.map((s, i) => (
              <div key={i} className="cgu-section">
                <p className="cgu-section-titre">{s.titre}</p>
                <p className="cgu-section-texte">{s.texte}</p>
              </div>
            ))}
          </div>
          {estDernier && (
            <button className="cgu-btn" onClick={handleAccepter} disabled={chargement}>
              {chargement ? 'Création...' : "J'accepte"}
            </button>
          )}
          <div className="cgu-dots">
            {CGU_PAGES.map((_, i) => (
              <button
                key={i}
                className={`cgu-dot${i === index ? ' actif' : ''}`}
                onClick={() => allerVue(i, i > index ? 'forward' : 'back')}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="cgu-photo">
          <img src={animal} alt="" />
        </div>
      </div>
    )
  }

  const renderFormulaire = () => (
    <div className="auth2-page">
      <div className="auth2-contenu">
        <div className="auth2-logo-zone">
          <img src={logoSrc} alt="adjuvet" className="auth2-logo" />
          <p className="auth2-tagline">Copilote en santé animale</p>
        </div>

        <p className="auth2-section-titre">Créer un compte</p>

        <form onSubmit={handleInscription} className="auth2-form">
          <input
            type="text"
            className="auth2-input"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom complet"
            required
          />
          <input
            type="email"
            className="auth2-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Courriel"
            required
          />
          <div className="auth2-input-wrap">
            <input
              type={voirMdp ? 'text' : 'password'}
              className="auth2-input"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Mot de passe"
              minLength={6}
              required
            />
            <button type="button" className="auth2-oeil" onClick={() => setVoirMdp(v => !v)}>
              <i className={`ti ${voirMdp ? 'ti-eye-off' : 'ti-eye'}`}></i>
            </button>
          </div>
          <div className="auth2-input-wrap">
            <input
              type={voirConfirm ? 'text' : 'password'}
              className="auth2-input"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
            />
            <button type="button" className="auth2-oeil" onClick={() => setVoirConfirm(v => !v)}>
              <i className={`ti ${voirConfirm ? 'ti-eye-off' : 'ti-eye'}`}></i>
            </button>
          </div>
          {erreur && <p className="erreur" style={{ textAlign: 'center' }}>{erreur}</p>}
          <button type="submit" className="auth2-btn" disabled={chargement}>
            {chargement ? 'Vérification...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth2-lien">
          Déjà un compte ?{' '}
          <Link to="/connexion">Se connecter</Link>
        </p>
      </div>
    </div>
  )

  const renderVue = (v) => (v === 'form' ? renderFormulaire() : renderCgu(v))

  // Même mécanique que les pages intérieures (App.jsx) : la page sortante
  // reste affichée dessous pendant que la nouvelle glisse par-dessus.
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
    >
      {transition && (
        <div
          className={`page-exit-${transition.direction}`}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          aria-hidden="true"
        >
          {renderVue(transition.depuis)}
        </div>
      )}
      <div
        key={String(vue)}
        className={transition ? `page-enter-${transition.direction}` : undefined}
        style={{ position: 'relative', zIndex: 2 }}
        onAnimationEnd={(e) => { if (e.target === e.currentTarget) setTransition(null) }}
      >
        {renderVue(vue)}
      </div>
    </div>
  )
}
