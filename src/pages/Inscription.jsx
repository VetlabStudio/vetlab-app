import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'
import { useNavigate, Link } from 'react-router-dom'
import PopupTexteLegal from '../components/PopupTexteLegal'
import IndicateurMotDePasse from '../components/IndicateurMotDePasse'
import { verifierMotDePasse } from '../lib/motDePasse'
import { useSuggestionCourriel } from '../hooks/useSuggestionCourriel'
import SuggestionCourriel from '../components/SuggestionCourriel'
import { CONDITIONS_COMPLETES_SECTIONS, CONFIDENTIALITE_SECTIONS } from '../data/textesLegaux'

const CGU_PAGES = [
  {
    fond:   '/fond-jaune.jpg',
    animal: '/Chat08.png',
    sections: [
      {
        titre: 'Acceptation des termes',
        texte: 'En créant un compte et en utilisant ADJUVET, vous acceptez les présentes conditions d\'utilisation. Ces conditions constituent un accord entre vous et ADJUVET.',
      },
    ],
  },
  {
    fond:   '/fond-vert.jpg',
    animal: '/perroquet01.png',
    sections: [
      {
        titre: 'Utilisation du service',
        texte: 'ADJUVET est fourni à titre informatif uniquement et ne remplace pas le jugement clinique d\'un vétérinaire. ADJUVET décline toute responsabilité pour les décisions thérapeutiques prises à partir de l\'application.',
      },
    ],
  },
  {
    fond:   '/fond-gris.jpg',
    animal: '/Lapin01.png',
    sections: [
      {
        titre: 'Responsabilité de l\'utilisateur',
        texte: 'Bien que le contenu d\'ADJUVET soit basé sur la littérature et la recherche vétérinaire, nous ne pouvons garantir son exactitude, son exhaustivité ou son actualité complètes. L\'utilisateur assume l\'entière responsabilité des décisions ou actions prises à partir des informations contenues dans ADJUVET.',
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

const TEXTES_LEGAUX = {
  conditions: { titre: "Conditions d'utilisation", sections: CONDITIONS_COMPLETES_SECTIONS },
  confidentialite: { titre: 'Politique de confidentialité', sections: CONFIDENTIALITE_SECTIONS },
}

const FORMAT_COURRIEL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i

const MSG_COMPTE_EXISTANT = 'Un compte existe déjà avec ce courriel. Connectez-vous plutôt.'

const LIEN_STYLE = {
  background: 'none', border: 'none', padding: 0, font: 'inherit',
  color: 'inherit', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer',
}

export default function Inscription() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  // Le format du courriel se vérifie dès qu'on quitte le champ, puis à chaque frappe.
  const [courrielVerifie, setCourrielVerifie] = useState(false)
  const [succes, setSucces] = useState(false)
  const [chargement, setChargement] = useState(false)
  // 'form' ou l'index de la page CGU affichée
  const [vue, setVue] = useState('form')
  const [transition, setTransition] = useState(null)
  const [texteLegal, setTexteLegal] = useState(null)
  const [voirMdp, setVoirMdp] = useState(false)
  const [voirConfirm, setVoirConfirm] = useState(false)
  const [logoSrc] = useState(() => `/adjuvet-logo-anime.svg?v=${Date.now()}`)
  const touchStartX = useRef(null)
  const navigate = useNavigate()

  const erreurCourriel = !courrielVerifie
    ? null
    : !email.trim()
      ? 'Veuillez entrer votre courriel.'
      : !FORMAT_COURRIEL.test(email.trim())
        ? 'Format de courriel invalide (ex. nom@domaine.com).'
        : null
  // Faute de frappe probable dans un domaine courant (ex. nom@gmial.com).
  const verifCourriel = useSuggestionCourriel(email)
  const suggestion = verifCourriel.suggestion

  const allerVue = (prochaine, direction) => {
    if (prochaine === vue) return
    setTransition({ depuis: vue, direction })
    setVue(prochaine)
  }

  const handleInscription = async (e) => {
    e.preventDefault()
    setErreur(null)
    if (!nom.trim()) {
      setErreur('Veuillez entrer votre nom.')
      return
    }
    if (!FORMAT_COURRIEL.test(email.trim())) {
      // Le message s'affiche sous le champ courriel.
      setCourrielVerifie(true)
      verifCourriel.afficher()
      return
    }
    // Faute de frappe probable pas encore vue : on la montre d'abord.
    if (verifCourriel.doitConfirmer()) return
    const evaluation = await verifierMotDePasse(motDePasse, { email, nom })
    if (!evaluation.valide) {
      setErreur(evaluation.message)
      return
    }
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
    if (touchStartX.current === null || vue === 'form' || texteLegal) return
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
      setErreur(dejaInscrit ? MSG_COMPTE_EXISTANT : traduireErreur(error, "L'inscription a échoué. Vérifiez votre courriel et réessayez."))
      allerVue('form', 'back')
      return
    }

    setSucces(true)
  }

  if (succes) {
    return (
      <main className="auth2-page">
        <div className="auth2-contenu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-circle-check" style={{ fontSize: 64, color: '#213058', marginBottom: 20 }}></i>
          <h1 className="auth2-section-titre" style={{ textAlign: 'center', fontSize: 22 }}>Vérifiez votre courriel</h1>
          <p style={{ fontSize: 15, color: '#213058', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
            Un lien de confirmation vous a été envoyé à <strong>{email.trim()}</strong>. Cliquez dessus pour activer votre compte.
          </p>
          <Link to="/connexion" className="auth2-btn" style={{ display: 'block', textDecoration: 'none' }}>
            Retour à la connexion
          </Link>
        </div>
      </main>
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
            <p style={{ fontSize: 14, color: '#213058', textAlign: 'center', lineHeight: 1.5, margin: '0 0 12px' }}>
              Lire les{' '}
              <button type="button" style={LIEN_STYLE} onClick={() => setTexteLegal('conditions')}>conditions complètes</button>
              {' '}et la{' '}
              <button type="button" style={LIEN_STYLE} onClick={() => setTexteLegal('confidentialite')}>politique de confidentialité</button>
            </p>
          )}
          {estDernier && (
            <div className="cgu-actions">
              {/* Annuler abandonne l'inscription : rien n'a encore été créé. */}
              <button className="cgu-btn-annuler" onClick={() => navigate('/connexion')} disabled={chargement}>
                Annuler
              </button>
              <button className="cgu-btn" onClick={handleAccepter} disabled={chargement}>
                {chargement ? 'Création...' : "J'accepte"}
              </button>
            </div>
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

        <h1 className="auth2-section-titre">Créer un compte</h1>

        <form onSubmit={handleInscription} className="auth2-form" noValidate>
          <label className="auth2-flottant">
            <input
              type="text"
              className="auth2-input"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoComplete="name"
              placeholder=" "
              required
            />
            <span className="auth2-flottant-texte">Nom complet</span>
          </label>
          <label className="auth2-flottant">
            <input
              type="email"
              className="auth2-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => { if (email.trim()) setCourrielVerifie(true) }}
              autoComplete="email"
              placeholder=" "
              required
              aria-invalid={erreurCourriel && !suggestion ? true : undefined}
              aria-describedby={suggestion || erreurCourriel ? 'erreur-courriel' : undefined}
            />
            <span className="auth2-flottant-texte">Courriel</span>
          </label>
          {/* Une faute de frappe probable passe avant le format : la correction proposée règle les deux. */}
          {suggestion ? (
            <SuggestionCourriel id="erreur-courriel" suggestion={suggestion} onCorriger={() => setEmail(suggestion)} avertie={verifCourriel.avertie} bouton="Créer mon compte" surFond="violet" />
          ) : erreurCourriel && (
            <p id="erreur-courriel" className="erreur" aria-live="polite" style={{ color: '#FFFFFF', textAlign: 'left', margin: '-4px 8px 0', fontWeight: 600 }}>
              {erreurCourriel}
            </p>
          )}
          <div className="auth2-input-wrap">
            <label className="auth2-flottant">
              <input
                type={voirMdp ? 'text' : 'password'}
                className="auth2-input"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                autoComplete="new-password"
                placeholder=" "
                minLength={12}
                required
              />
              <span className="auth2-flottant-texte">Mot de passe</span>
            </label>
            <button type="button" className="auth2-oeil" onClick={() => setVoirMdp(v => !v)} aria-label={voirMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <i className={`ti ${voirMdp ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
            </button>
          </div>
          <IndicateurMotDePasse motDePasse={motDePasse} email={email} nom={nom} />
          <div className="auth2-input-wrap">
            <label className="auth2-flottant">
              <input
                type={voirConfirm ? 'text' : 'password'}
                className="auth2-input"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder=" "
                required
              />
              <span className="auth2-flottant-texte">Confirmer le mot de passe</span>
            </label>
            <button type="button" className="auth2-oeil" onClick={() => setVoirConfirm(v => !v)} aria-label={voirConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}>
              <i className={`ti ${voirConfirm ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
            </button>
          </div>
          {erreur && <p className="erreur" style={{ textAlign: 'center', color: '#FFFFFF' }}>{erreur}</p>}
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
    <main
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
      {texteLegal && (
        <PopupTexteLegal
          titre={TEXTES_LEGAUX[texteLegal].titre}
          sections={TEXTES_LEGAUX[texteLegal].sections}
          onFermer={() => setTexteLegal(null)}
        />
      )}
    </main>
  )
}
