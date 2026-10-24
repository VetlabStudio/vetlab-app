import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'

/* ════════════════════════════════════════════════════════════
   ADMIN - COMPTES
   Chercher un compte par son adresse, voir ce que sa suppression
   entraînerait, puis le supprimer. Le nettoyage est le même que
   le bouton « Supprimer le compte » du profil (fonction
   admin-supprimer-compte).

   « Plusieurs comptes » fait la même chose pour une liste
   d'adresses collée d'un coup (ex. les testeurs à la fin des
   tests) : vérification de chaque adresse, bilan, puis
   suppression une à une.
   ════════════════════════════════════════════════════════════ */

const MESSAGES_SUPPRESSION = {
  stripe_indisponible: "Impossible de joindre Stripe en ce moment. Rien n'a été supprimé, réessayez dans quelques minutes.",
  annulation_impossible: "L'abonnement n'a pas pu être annulé. Rien n'a été supprimé, pour éviter que la facturation continue sans compte.",
  retrogradation_impossible: "Les membres de la clinique n'ont pas pu être rétrogradés. Rien n'a été supprimé.",
  donnees_personnelles_impossible: "Les examens et chartes personnels n'ont pas pu être supprimés. Le compte est intact, réessayez.",
  equipe_impossible: "La clinique n'a pas pu être supprimée. Le compte est intact, réessayez.",
}

const PLANS = { free: 'Gratuit', pro: 'Pro', equipe: 'Équipe' }
const ROLES = { proprietaire: 'Propriétaire', admin: 'Admin', membre: 'Membre' }

// Suppression en lot : au plus 50 adresses, vérifiées 3 à la fois.
const MAX_LOT = 50
const VERIFICATIONS_SIMULTANEES = 3

function pluriel(n, mot) {
  return `${n} ${mot}${n > 1 ? 's' : ''}`
}

async function lireErreur(error, defaut) {
  let corps
  try { corps = await error.context.json() } catch { corps = null }
  return MESSAGES_SUPPRESSION[corps?.error] || corps?.message || traduireErreur(error, defaut)
}

// « 1 abonnement annulé, 2 membres passés au forfait Gratuit. »
function detailsSuppression(data) {
  const details = []
  if (data?.abonnementsAnnules) details.push(`${pluriel(data.abonnementsAnnules, 'abonnement')} annulé${data.abonnementsAnnules > 1 ? 's' : ''}`)
  if (data?.membresRetrogrades) details.push(`${pluriel(data.membresRetrogrades, 'membre')} passé${data.membresRetrogrades > 1 ? 's' : ''} au forfait Gratuit`)
  if (data?.clientsStripeEffaces) details.push('historique Stripe effacé')
  const resume = details.join(', ')
  return resume ? `${resume.charAt(0).toUpperCase()}${resume.slice(1)}.` : ''
}

/* Toutes les adresses d'un texte collé : une par ligne, séparées
   par des virgules, ou la liste des destinataires d'un courriel
   (« Nom <adresse> »). Doublons retirés. */
function extraireAdresses(texte) {
  const trouvees = texte.match(/[^\s<>,;:"'()[\]]+@[^\s<>,;:"'()[\]]+\.[^\s<>,;:"'()[\]]+/g) || []
  return [...new Set(trouvees.map(a => a.toLowerCase().replace(/\.+$/, '')))]
}

const styleCarte = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}
const styleLigne = { display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }
const styleCle = { color: 'var(--text-secondary)' }
const styleValeur = { color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }
const styleNote = { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }
const styleColonne = { display: 'flex', flexDirection: 'column', gap: 16 }
const styleCase = { display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, cursor: 'pointer' }
const styleBoutonSecondaire = { background: 'var(--bg-card)', color: 'var(--primary)', border: '1px solid var(--border)' }

function styleBoutonRouge(actif) {
  return { marginTop: 4, opacity: actif ? 1 : 0.5, cursor: actif ? 'pointer' : 'not-allowed' }
}

export default function AdminComptes() {
  const [mode, setMode] = useState('un')

  return (
    <div className="admin-page">
      <div style={{ ...styleColonne, padding: 16, paddingBottom: 40 }}>
        <p style={styleNote}>
          Supprime un compte et tout ce qui s'y rattache, comme le bouton « Supprimer le compte » du profil :
          abonnement Stripe annulé, clinique dissoute si le compte en est propriétaire, invitations en attente retirées.
        </p>

        <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Mode de suppression">
          <button type="button" className={`admin-labo-cat-btn ${mode === 'un' ? 'actif' : ''}`} aria-pressed={mode === 'un'} onClick={() => setMode('un')}>
            Un compte
          </button>
          <button type="button" className={`admin-labo-cat-btn ${mode === 'lot' ? 'actif' : ''}`} aria-pressed={mode === 'lot'} onClick={() => setMode('lot')}>
            Plusieurs comptes
          </button>
        </div>

        {/* Les deux restent montés : changer de mode n'interrompt rien et ne perd rien. */}
        <div hidden={mode !== 'un'}><UnCompte /></div>
        <div hidden={mode !== 'lot'}><PlusieursComptes /></div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   UN COMPTE
   ════════════════════════════════════════════════════════════ */

function UnCompte() {
  const [adresse, setAdresse] = useState('')
  const [recherche, setRecherche] = useState(null)
  const [enCours, setEnCours] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [effacerStripe, setEffacerStripe] = useState(false)

  function changerAdresse(valeur) {
    setAdresse(valeur)
    // La fiche affichée doit toujours correspondre à l'adresse du champ.
    setRecherche(null)
    setErreur('')
  }

  async function chercher(e) {
    e.preventDefault()
    if (enCours || !adresse.trim()) return
    setEnCours('chercher')
    setErreur('')
    setSucces('')
    setRecherche(null)
    setConfirmation('')
    setEffacerStripe(false)
    const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
      body: { action: 'chercher', email: adresse },
    })
    setEnCours('')
    if (error) return setErreur(await lireErreur(error, "La recherche n'a pas pu se faire. Réessayez."))
    setRecherche(data)
  }

  async function supprimer() {
    if (enCours || !recherche?.trouve) return
    setEnCours('supprimer')
    setErreur('')
    const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
      body: { action: 'supprimer', email: recherche.email, effacerStripe },
    })
    setEnCours('')
    if (error) return setErreur(await lireErreur(error, "La suppression n'a pas pu se terminer. Réessayez dans quelques minutes."))

    let message = `Le compte ${recherche.email} a été supprimé.`
    const details = detailsSuppression(data)
    if (details) message += ` ${details}`
    if (data?.avertissement === 'stripe_incomplet') {
      message += " L'historique Stripe n'a pas pu être effacé au complet : cherchez l'adresse de nouveau pour terminer."
    }
    setSucces(message)
    setRecherche(null)
    setAdresse('')
    setConfirmation('')
    setEffacerStripe(false)
  }

  async function effacerHistoriqueStripe() {
    if (enCours || !recherche || recherche.trouve) return
    setEnCours('stripe')
    setErreur('')
    const { error } = await supabase.functions.invoke('admin-supprimer-compte', {
      body: { action: 'effacer-stripe', email: recherche.email },
    })
    setEnCours('')
    if (error) return setErreur(await lireErreur(error, "L'historique Stripe n'a pas pu être effacé. Réessayez."))
    setSucces(`L'historique Stripe de ${recherche.email} a été effacé. Cette adresse peut refaire un essai gratuit.`)
    setRecherche(null)
    setAdresse('')
  }

  const compte = recherche?.compte
  const apercu = recherche?.apercu
  const bloque = recherche?.estVous || recherche?.estAdmin
  const confirme = confirmation.trim().toLowerCase() === recherche?.email

  return (
    <div style={styleColonne}>
      <form onSubmit={chercher} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="form-groupe">
          <label className="form-label" htmlFor="admin-compte-courriel">Adresse courriel du compte</label>
          <input
            id="admin-compte-courriel"
            className="form-input"
            type="email"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="ex. nom@clinique.ca"
            value={adresse}
            onChange={e => changerAdresse(e.target.value)}
          />
        </div>
        <button className="btn-sauvegarder" type="submit" disabled={Boolean(enCours) || !adresse.trim()}>
          {enCours === 'chercher' ? 'Recherche...' : 'Chercher'}
        </button>
      </form>

      {erreur && <div className="form-erreur" role="alert">{erreur}</div>}
      {succes && <div className="profil-succes" role="status">{succes}</div>}

      {/* ─── AUCUN COMPTE ─────────────────────── */}
      {recherche && !recherche.trouve && (
        <div style={styleCarte}>
          <p style={{ ...styleNote, color: 'var(--text-primary)', fontWeight: 600 }}>
            Aucun compte avec l'adresse {recherche.email}.
          </p>
          {recherche.essaiUtilise && (
            <>
              <p style={styleNote}>
                Cette adresse a déjà eu un abonnement chez Stripe : un nouveau compte créé avec elle n'aura pas d'essai gratuit.
              </p>
              {recherche.modeTestStripe ? (
                <button className="btn-supprimer-medicament" style={{ marginTop: 4 }} onClick={effacerHistoriqueStripe} disabled={Boolean(enCours)}>
                  {enCours === 'stripe' ? 'Effacement...' : "Effacer l'historique Stripe (mode test)"}
                </button>
              ) : (
                <p style={{ ...styleNote, color: 'var(--text-hint)' }}>
                  En mode réel, l'historique Stripe est conservé pour la comptabilité.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── FICHE DU COMPTE ──────────────────── */}
      {recherche?.trouve && (
        <>
          <div style={styleCarte}>
            <div style={styleLigne}><span style={styleCle}>Courriel</span><span style={styleValeur}>{recherche.email}</span></div>
            <div style={styleLigne}><span style={styleCle}>Nom</span><span style={styleValeur}>{compte?.nom || '-'}</span></div>
            <div style={styleLigne}><span style={styleCle}>Forfait</span><span style={styleValeur}>{PLANS[compte?.plan] || compte?.plan}</span></div>
            {compte?.cree_le && (
              <div style={styleLigne}>
                <span style={styleCle}>Créé le</span>
                <span style={styleValeur}>{new Date(compte.cree_le).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            <div style={styleLigne}>
              <span style={styleCle}>Clinique</span>
              <span style={styleValeur}>
                {compte?.clinique ? `${compte.clinique.nom || 'Sans nom'} (${ROLES[compte.clinique.role] || compte.clinique.role})` : '-'}
              </span>
            </div>
            <div style={styleLigne}>
              <span style={styleCle}>Essai gratuit</span>
              <span style={styleValeur}>
                {recherche.essaiUtilise === null ? 'Stripe injoignable' : recherche.essaiUtilise ? 'Déjà utilisé' : 'Disponible'}
              </span>
            </div>
          </div>

          {bloque ? (
            <div className="form-erreur">
              {recherche.estVous
                ? 'C\'est votre propre compte : supprimez-le depuis votre profil.'
                : "Ce compte fait partie de l'administration : il ne peut pas être supprimé ici."}
            </div>
          ) : (
            <div style={styleCarte}>
              <span className="form-label">Ce qui sera supprimé</span>
              <ul style={{ ...styleNote, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Le compte, son profil, ses favoris, ses notes et ses examens et chartes personnels.</li>
                {apercu?.possedeEquipe && (
                  <li>
                    La clinique <strong>{apercu.nomEquipe || 'sans nom'}</strong>, dont ce compte est propriétaire
                    {apercu.nbMembres > 0
                      ? ` : ${pluriel(apercu.nbMembres, 'membre')} passer${apercu.nbMembres > 1 ? 'ont' : 'a'} au forfait Gratuit.`
                      : '.'}
                  </li>
                )}
                {apercu?.nbAbonnements > 0 && (
                  <li>{pluriel(apercu.nbAbonnements, 'abonnement')} Stripe, annulé{apercu.nbAbonnements > 1 ? 's' : ''} immédiatement.</li>
                )}
                {apercu?.nbInvitations > 0 && (
                  <li>{pluriel(apercu.nbInvitations, 'invitation')} en attente à cette adresse.</li>
                )}
              </ul>
              {!apercu && (
                <p style={{ ...styleNote, color: 'var(--text-hint)' }}>
                  L'aperçu détaillé n'a pas pu être chargé. La suppression fera quand même le nettoyage complet.
                </p>
              )}

              {recherche.modeTestStripe ? (
                <label style={styleCase}>
                  <input
                    type="checkbox"
                    checked={effacerStripe}
                    onChange={e => setEffacerStripe(e.target.checked)}
                    style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                  />
                  <span>
                    Effacer aussi l'historique Stripe (mode test)
                    <span style={{ display: 'block', color: 'var(--text-secondary)' }}>
                      La personne pourra refaire un essai gratuit avec cette adresse.
                    </span>
                  </span>
                </label>
              ) : (
                <p style={{ ...styleNote, color: 'var(--text-hint)' }}>
                  L'historique Stripe est conservé pour la comptabilité : un nouveau compte avec cette adresse n'aura pas d'essai gratuit.
                </p>
              )}

              <div className="form-groupe">
                <label className="form-label" htmlFor="admin-compte-confirmation">
                  Pour confirmer, entrez l'adresse du compte
                </label>
                <input
                  id="admin-compte-confirmation"
                  className="form-input"
                  type="email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={recherche.email}
                  value={confirmation}
                  onChange={e => setConfirmation(e.target.value)}
                />
              </div>

              <button
                className="btn-supprimer-medicament"
                style={styleBoutonRouge(!enCours && confirme)}
                onClick={supprimer}
                disabled={Boolean(enCours) || !confirme}
              >
                {enCours === 'supprimer' ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   PLUSIEURS COMPTES

   1. saisie : la liste collée ;
   2. verification : chaque adresse passe par « chercher » ;
   3. bilan : ce qui sera fait, ligne par ligne, avec une case
      pour garder un compte ;
   4. suppression : une adresse à la fois, dans l'ordre. Une à
      la fois, car deux comptes de la même clinique (propriétaire
      et membre) ne doivent pas être défaits en même temps ;
   5. termine : le résultat de chaque ligne.
   ════════════════════════════════════════════════════════════ */

// L'action qu'une ligne du bilan déclenchera, ou null.
function actionPossible(ligne, effacerStripe) {
  if (ligne.etat === 'a_supprimer') return 'supprimer'
  if (ligne.etat === 'absent' && effacerStripe && ligne.fiche?.essaiUtilise && ligne.fiche?.modeTestStripe) return 'effacer-stripe'
  return null
}

function descriptionLigne(ligne, effacerStripe) {
  const f = ligne.fiche
  if (ligne.message) return ligne.message
  if (ligne.etat === 'protege') {
    return f?.estVous ? 'Votre propre compte : supprimez-le depuis votre profil.' : "Compte de l'administration : il ne peut pas être supprimé ici."
  }
  if (ligne.etat === 'absent') {
    if (!f?.essaiUtilise) return 'Aucun compte avec cette adresse.'
    if (!f.modeTestStripe) return 'Aucun compte. Essai déjà utilisé, historique Stripe conservé (mode réel).'
    return effacerStripe
      ? "Aucun compte. Son historique Stripe sera effacé : l'adresse pourra refaire un essai."
      : 'Aucun compte. Essai déjà utilisé (historique Stripe gardé).'
  }
  if (!f?.compte) return ''
  const parties = [f.compte.nom, PLANS[f.compte.plan] || f.compte.plan]
  const a = f.apercu
  if (a?.possedeEquipe) {
    parties.push(`propriétaire de ${a.nomEquipe || 'sa clinique'}${a.nbMembres > 0 ? ` (${pluriel(a.nbMembres, 'membre')} au forfait Gratuit)` : ''}`)
  } else if (f.compte.clinique) {
    parties.push(`${(ROLES[f.compte.clinique.role] || 'membre').toLowerCase()} de ${f.compte.clinique.nom || 'une clinique'}`)
  }
  if (a?.nbAbonnements > 0) parties.push(`${pluriel(a.nbAbonnements, 'abonnement')} annulé${a.nbAbonnements > 1 ? 's' : ''}`)
  return parties.filter(Boolean).join(' · ')
}

function PlusieursComptes() {
  const [texte, setTexte] = useState('')
  const [etape, setEtape] = useState('saisie')
  const [lignes, setLignes] = useState([])
  const [effacerStripe, setEffacerStripe] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const arretDemande = useRef(false)

  const adresses = extraireAdresses(texte)
  const tropDAdresses = adresses.length > MAX_LOT

  function majLigne(email, changements) {
    setLignes(ls => ls.map(l => (l.email === email ? { ...l, ...changements } : l)))
  }

  async function verifier() {
    if (!adresses.length || tropDAdresses) return
    const file = [...adresses]
    setLignes(adresses.map(email => ({ email, etat: 'verification', garder: false })))
    setEffacerStripe(false)
    setConfirmation('')
    setEtape('verification')

    async function travailleur() {
      while (file.length) {
        const email = file.shift()
        const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
          body: { action: 'chercher', email },
        })
        if (error) {
          majLigne(email, { etat: 'erreur', message: await lireErreur(error, 'La vérification a échoué.') })
        } else {
          const etat = !data.trouve ? 'absent' : (data.estVous || data.estAdmin) ? 'protege' : 'a_supprimer'
          majLigne(email, { etat, fiche: data })
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(VERIFICATIONS_SIMULTANEES, file.length) }, travailleur))
    setEtape('bilan')
  }

  async function lancer() {
    const aFaire = lignes
      .filter(l => !l.garder)
      .map(l => ({ email: l.email, action: actionPossible(l, effacerStripe) }))
      .filter(x => x.action)
    if (!aFaire.length) return
    arretDemande.current = false
    const prevues = new Set(aFaire.map(x => x.email))
    setLignes(ls => ls.map(l => ({ ...l, prevue: prevues.has(l.email) })))
    setEtape('suppression')

    for (const { email, action } of aFaire) {
      if (arretDemande.current) break
      majLigne(email, { etat: 'en_cours' })
      const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
        body: { action, email, effacerStripe },
      })
      if (error) {
        majLigne(email, { etat: 'echec', message: await lireErreur(error, "La suppression n'a pas pu se terminer.") })
      } else if (action === 'effacer-stripe') {
        majLigne(email, { etat: 'fait', message: "Historique Stripe effacé : l'adresse peut refaire un essai." })
      } else {
        let message = detailsSuppression(data) || 'Compte supprimé.'
        if (data?.avertissement === 'stripe_incomplet') message += " L'historique Stripe n'a pas pu être effacé au complet."
        majLigne(email, { etat: 'fait', message })
      }
    }
    setEtape('termine')
  }

  // Retour à la saisie, avec la liste voulue dans le champ.
  function recommencer(adressesGardees) {
    setTexte(adressesGardees.map(l => l.email).join('\n'))
    setLignes([])
    setConfirmation('')
    setEtape('saisie')
  }

  // ─── CHIFFRES DU BILAN ───────────────────────
  const aTraiter = lignes.filter(l => !l.garder && actionPossible(l, effacerStripe))
  const nbATraiter = aTraiter.length
  const nbComptes = aTraiter.filter(l => l.etat === 'a_supprimer').length
  const nbStripe = nbATraiter - nbComptes
  const cliniques = aTraiter.filter(l => l.fiche?.apercu?.possedeEquipe)
  const modeTest = lignes.some(l => l.fiche?.modeTestStripe)
  const stripeAEffacer = lignes.some(l => l.fiche?.essaiUtilise)
  const confirme = nbATraiter > 0 && confirmation.trim() === String(nbATraiter)

  const prevues = lignes.filter(l => l.prevue)
  const nbFaits = prevues.filter(l => l.etat === 'fait').length
  const nbEchecs = prevues.filter(l => l.etat === 'echec').length
  const nbVerifiees = lignes.filter(l => l.etat !== 'verification').length
  // Échecs, erreurs de vérification et lignes laissées par un arrêt.
  const aReprendre = lignes.filter(l => ['echec', 'erreur'].includes(l.etat) || (l.prevue && !['fait', 'echec'].includes(l.etat)))

  function badge(ligne) {
    const action = actionPossible(ligne, effacerStripe)
    if (ligne.etat === 'verification') return ['Vérification...', 'var(--text-hint)']
    if (ligne.etat === 'erreur') return ['Erreur', 'var(--accent-red)']
    if (ligne.etat === 'en_cours') return ['En cours...', 'var(--text-secondary)']
    if (ligne.etat === 'fait') return [ligne.fiche?.trouve ? 'Supprimé' : 'Stripe effacé', 'var(--primary)']
    if (ligne.etat === 'echec') return ['Échec', 'var(--accent-red)']
    if (ligne.etat === 'protege') return ['Protégé', 'var(--text-hint)']
    if (etape === 'termine' && ligne.prevue) return ['Non traité', 'var(--text-hint)']
    if (action && ligne.garder) return ['Gardé', 'var(--text-hint)']
    if (action === 'supprimer') return ['À supprimer', 'var(--accent-red)']
    if (action === 'effacer-stripe') return ['Stripe à effacer', 'var(--accent-red)']
    return ['Rien à faire', 'var(--text-hint)']
  }

  // ─── 1. SAISIE ───────────────────────────────
  if (etape === 'saisie') {
    return (
      <div style={styleColonne}>
        <div className="form-groupe">
          <label className="form-label" htmlFor="admin-comptes-liste">Adresses des comptes</label>
          <textarea
            id="admin-comptes-liste"
            className="form-textarea"
            rows={8}
            autoCapitalize="none"
            spellCheck={false}
            placeholder={'testeur1@exemple.com\ntesteur2@exemple.com'}
            value={texte}
            onChange={e => setTexte(e.target.value)}
          />
          <p style={{ ...styleNote, fontSize: 12 }}>
            Une adresse par ligne, ou séparées par des virgules. Vous pouvez aussi coller la liste des destinataires d'un courriel.
          </p>
        </div>
        {tropDAdresses && (
          <div className="form-erreur" role="alert">
            {adresses.length} adresses détectées : {MAX_LOT} au maximum à la fois. Séparez la liste en plusieurs fois.
          </div>
        )}
        <button className="btn-sauvegarder" onClick={verifier} disabled={!adresses.length || tropDAdresses}>
          {adresses.length ? `Vérifier ${pluriel(adresses.length, 'adresse')}` : 'Vérifier'}
        </button>
        <p style={{ ...styleNote, fontSize: 12 }}>
          Rien n'est supprimé à cette étape : vous verrez d'abord le bilan de chaque adresse.
        </p>
      </div>
    )
  }

  // ─── 2 à 5. LISTE ────────────────────────────
  return (
    <div style={styleColonne}>
      {etape === 'verification' && (
        <p style={{ ...styleNote, fontWeight: 600, color: 'var(--text-primary)' }} role="status">
          Vérification : {nbVerifiees} / {lignes.length}
        </p>
      )}
      {etape === 'suppression' && (
        <p style={{ ...styleNote, fontWeight: 600, color: 'var(--text-primary)' }} role="status">
          Suppression : {nbFaits + nbEchecs} / {prevues.length}. Gardez cette page ouverte jusqu'à la fin.
        </p>
      )}
      {etape === 'termine' && (
        <div className={nbEchecs ? 'form-erreur' : 'profil-succes'} role="status">
          Terminé : {nbFaits} sur {prevues.length} traité{prevues.length > 1 ? 's' : ''}
          {nbEchecs ? `, ${pluriel(nbEchecs, 'échec')}` : ''}
          {nbFaits + nbEchecs < prevues.length ? `, ${prevues.length - nbFaits - nbEchecs} non traité${prevues.length - nbFaits - nbEchecs > 1 ? 's' : ''} (arrêt demandé)` : ''}.
        </div>
      )}

      <div style={{ ...styleCarte, padding: 0, gap: 0 }}>
        {lignes.map((ligne, i) => {
          const [texteBadge, couleur] = badge(ligne)
          const cochable = etape === 'bilan' && actionPossible(ligne, effacerStripe)
          return (
            <div key={ligne.email} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
              {cochable && (
                <input
                  type="checkbox"
                  checked={!ligne.garder}
                  onChange={e => majLigne(ligne.email, { garder: !e.target.checked })}
                  aria-label={`Traiter ${ligne.email}`}
                  style={{ marginTop: 3, accentColor: 'var(--accent-red)' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{ligne.email}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: couleur, whiteSpace: 'nowrap' }}>{texteBadge}</span>
                </div>
                {descriptionLigne(ligne, effacerStripe) && (
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{descriptionLigne(ligne, effacerStripe)}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── 3. BILAN ET CONFIRMATION ─────────── */}
      {etape === 'bilan' && (
        <div style={styleCarte}>
          <span className="form-label">
            {nbATraiter
              ? `${pluriel(nbComptes, 'compte')} à supprimer${nbStripe ? `, ${pluriel(nbStripe, 'historique')} Stripe à effacer` : ''}`
              : 'Rien à supprimer dans cette liste.'}
          </span>
          {cliniques.length > 0 && (
            <p style={styleNote}>
              {cliniques.length > 1 ? `${cliniques.length} cliniques seront dissoutes` : 'Une clinique sera dissoute'} : leurs membres
              qui ne sont pas dans cette liste passeront au forfait Gratuit.
            </p>
          )}

          {modeTest && stripeAEffacer && (
            <label style={styleCase}>
              <input
                type="checkbox"
                checked={effacerStripe}
                onChange={e => { setEffacerStripe(e.target.checked); setConfirmation('') }}
                style={{ marginTop: 3, accentColor: 'var(--primary)' }}
              />
              <span>
                Effacer aussi l'historique Stripe (mode test)
                <span style={{ display: 'block', color: 'var(--text-secondary)' }}>
                  Ces adresses pourront refaire un essai gratuit.
                </span>
              </span>
            </label>
          )}

          {nbATraiter > 0 && (
            <>
              <div className="form-groupe">
                <label className="form-label" htmlFor="admin-comptes-confirmation">
                  Pour confirmer, entrez le nombre d'adresses à traiter : {nbATraiter}
                </label>
                <input
                  id="admin-comptes-confirmation"
                  className="form-input"
                  inputMode="numeric"
                  autoComplete="off"
                  value={confirmation}
                  onChange={e => setConfirmation(e.target.value)}
                />
              </div>
              <button className="btn-supprimer-medicament" style={styleBoutonRouge(confirme)} onClick={lancer} disabled={!confirme}>
                Supprimer définitivement ({nbATraiter})
              </button>
            </>
          )}
          <button className="btn-sauvegarder" style={styleBoutonSecondaire} onClick={() => recommencer(lignes)}>
            Modifier la liste
          </button>
        </div>
      )}

      {etape === 'suppression' && (
        <button className="btn-sauvegarder" style={styleBoutonSecondaire} onClick={() => { arretDemande.current = true }}>
          Arrêter après le compte en cours
        </button>
      )}

      {etape === 'termine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {aReprendre.length > 0 && (
            <button className="btn-sauvegarder" onClick={() => recommencer(aReprendre)}>
              Reprendre les adresses non terminées ({aReprendre.length})
            </button>
          )}
          <button className="btn-sauvegarder" style={styleBoutonSecondaire} onClick={() => recommencer([])}>
            Nouvelle liste
          </button>
        </div>
      )}
    </div>
  )
}
