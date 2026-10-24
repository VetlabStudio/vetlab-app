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
        <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Mode">
          <button type="button" className={`admin-labo-cat-btn ${mode === 'un' ? 'actif' : ''}`} aria-pressed={mode === 'un'} onClick={() => setMode('un')}>
            Un compte
          </button>
          <button type="button" className={`admin-labo-cat-btn ${mode === 'lot' ? 'actif' : ''}`} aria-pressed={mode === 'lot'} onClick={() => setMode('lot')}>
            Plusieurs comptes
          </button>
        </div>

        <p style={styleNote}>
          {mode === 'un'
            ? "Cherchez un compte pour voir son état, l'aider ou le supprimer."
            : "Supprime une liste de comptes d'un coup (ex. les testeurs), avec le même nettoyage que le bouton « Supprimer le compte » du profil : abonnement Stripe annulé, clinique dissoute si le compte en est propriétaire, invitations en attente retirées."}
        </p>

        {/* Les deux restent montés : changer de mode n'interrompt rien et ne perd rien. */}
        <div hidden={mode !== 'un'}><UnCompte /></div>
        <div hidden={mode !== 'lot'}><PlusieursComptes /></div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   UN COMPTE

   La fiche répond d'abord à « pourquoi ce compte a-t-il accès,
   ou pas ? » (diagnostiquer), puis montre le compte, l'abonnement
   et la clinique. « Aider ce compte » regroupe les gestes de
   soutien ; la suppression est repliée au bas, en rouge.
   ════════════════════════════════════════════════════════════ */

const VERT = '#2E7D62'
const AMBRE = '#7A500A'
const TONS = {
  vert: { couleur: VERT, fond: 'rgba(46,125,98,0.08)', bord: 'rgba(46,125,98,0.3)' },
  ambre: { couleur: AMBRE, fond: 'rgba(148,100,31,0.08)', bord: 'rgba(122,80,10,0.3)' },
  rouge: { couleur: 'var(--accent-red)', fond: 'rgba(168,72,85,0.06)', bord: 'rgba(168,72,85,0.3)' },
  neutre: { couleur: 'var(--primary)', fond: 'var(--bg-secondary)', bord: 'var(--border)' },
}
const STATUTS_STRIPE = {
  active: { label: 'Actif', ton: 'vert' },
  trialing: { label: 'Essai en cours', ton: 'vert' },
  past_due: { label: 'Paiement en retard', ton: 'ambre' },
  unpaid: { label: 'Impayé', ton: 'rouge' },
  paused: { label: 'En pause', ton: 'ambre' },
  incomplete: { label: 'Premier paiement non complété', ton: 'ambre' },
  incomplete_expired: { label: 'Jamais démarré', ton: 'neutre' },
  canceled: { label: 'Terminé', ton: 'neutre' },
}
// Comme dans la gestion de l'équipe : une invitation vaut 7 jours.
const JOURS_VALIDITE_INVITATION = 7

// Une date Stripe (secondes) ou de la base (texte ISO), en toutes lettres.
function dateLongue(valeur) {
  if (!valeur) return null
  const date = typeof valeur === 'number' ? new Date(valeur * 1000) : new Date(valeur)
  return date.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

function invitationExpiree(envoyeeLe) {
  return Date.now() - new Date(envoyeeLe).getTime() > JOURS_VALIDITE_INVITATION * 86400000
}

const CONSEIL_CARTE = 'mettre à jour la carte dans la page Abonnement, bouton « Gérer la facturation ».'

/* Pourquoi ce compte a accès, ou pas : la première règle qui s'applique. */
function diagnostiquer(fiche) {
  const { compte, connexion, clinique } = fiche
  const a = fiche.abonnement
  const plan = PLANS[compte.plan] || compte.plan

  if (connexion && !connexion.confirme) {
    return {
      ton: 'ambre', icone: 'ti-mail-off', titre: 'Courriel jamais confirmé',
      texte: "Ce compte ne peut pas se connecter tant que le lien reçu à l'inscription n'a pas été cliqué.",
      conseil: 'vérifier les courriels indésirables, ou renvoyer le lien de confirmation ci-dessous.',
    }
  }

  // Un membre a accès par l'abonnement de sa clinique, pas par le sien.
  if (compte.clinique && compte.clinique.role !== 'proprietaire') {
    const nom = compte.clinique.nom || 'sa clinique'
    if (compte.plan === 'equipe') {
      return { ton: 'vert', icone: 'ti-circle-check', titre: 'Accès Équipe actif', texte: `Accès fourni par la clinique ${nom}.` }
    }
    const proprietaire = clinique?.proprietaire?.email
    return {
      ton: 'rouge', icone: 'ti-building-hospital', titre: 'Clinique sans abonnement actif',
      texte: `Ce compte est membre de ${nom}, mais la clinique n'a plus d'abonnement : il est revenu au forfait Gratuit.`,
      conseil: proprietaire
        ? `le propriétaire de la clinique (${proprietaire}) doit renouveler l'abonnement.`
        : "le propriétaire de la clinique doit renouveler l'abonnement.",
    }
  }

  if (fiche.stripeInjoignable) {
    return { ton: 'neutre', icone: 'ti-cloud-off', titre: 'Stripe injoignable', texte: "L'état de l'abonnement n'a pas pu être vérifié. Cherchez de nouveau dans quelques minutes." }
  }

  const statut = a?.statut
  if ((statut === 'active' || statut === 'trialing') && a.forfait && a.forfait !== compte.plan) {
    return {
      ton: 'rouge', icone: 'ti-arrows-diff', titre: 'Forfait différent de Stripe',
      texte: `Stripe indique un abonnement ${PLANS[a.forfait]} en cours, mais le compte est au forfait ${plan} dans l'app.`,
      conseil: 'un événement Stripe a sans doute été manqué : dans Stripe, renvoyer au webhook le dernier événement de ce client.',
    }
  }
  if (statut === 'trialing') {
    return {
      ton: 'vert', icone: 'ti-circle-check', titre: 'Essai gratuit en cours',
      texte: a.finProgrammee
        ? `L'essai se termine le ${dateLongue(a.finEssai)}. L'abonnement est déjà annulé : le compte passera ensuite au forfait Gratuit.`
        : `L'essai se termine le ${dateLongue(a.finEssai)}, puis le premier paiement sera prélevé.`,
    }
  }
  if (statut === 'active') {
    return a.finProgrammee
      ? { ton: 'ambre', icone: 'ti-calendar-x', titre: 'Abonnement annulé', texte: `L'accès reste ouvert jusqu'au ${dateLongue(a.finProgrammee)}, puis le compte passera au forfait Gratuit.` }
      : { ton: 'vert', icone: 'ti-circle-check', titre: `Accès ${PLANS[a.forfait] || plan} actif`, texte: `Prochain renouvellement le ${dateLongue(a.finPeriode)}.` }
  }
  if (statut === 'past_due') {
    const enGrace = a.finGrace && a.finGrace * 1000 > Date.now() && compte.plan !== 'free'
    return enGrace
      ? {
        ton: 'ambre', icone: 'ti-credit-card-off', titre: 'Paiement refusé',
        texte: `Le paiement de l'échéance du ${dateLongue(a.echeance)} a été refusé. L'accès reste ouvert pendant que Stripe réessaie, au plus tard jusqu'au ${dateLongue(a.finGrace)}.`,
        conseil: CONSEIL_CARTE,
      }
      : {
        ton: 'rouge', icone: 'ti-credit-card-off', titre: 'Paiement refusé : accès suspendu',
        texte: `Le paiement de l'échéance du ${dateLongue(a.echeance)} a été refusé.`,
        conseil: CONSEIL_CARTE,
      }
  }
  if (statut === 'unpaid' || statut === 'paused') {
    return { ton: 'rouge', icone: 'ti-credit-card-off', titre: 'Abonnement impayé : accès suspendu', texte: 'Stripe a cessé de tenter le paiement.', conseil: CONSEIL_CARTE }
  }
  if (statut === 'incomplete') {
    return {
      ton: 'ambre', icone: 'ti-credit-card-off', titre: 'Premier paiement non complété',
      texte: "L'abonnement n'a jamais démarré : le premier paiement a échoué ou attend une confirmation de la banque.",
      conseil: "refaire l'abonnement depuis la page Abonnement.",
    }
  }
  if (compte.plan !== 'free') {
    return { ton: 'neutre', icone: 'ti-info-circle', titre: `Forfait ${plan} sans abonnement Stripe`, texte: "Aucun abonnement en cours ne paie ce forfait : il a sans doute été accordé à la main." }
  }
  if (statut) {
    return { ton: 'neutre', icone: 'ti-info-circle', titre: 'Abonnement terminé', texte: a.termineLe ? `Terminé le ${dateLongue(a.termineLe)}. Le compte est au forfait Gratuit.` : 'Le compte est au forfait Gratuit.' }
  }
  return { ton: 'neutre', icone: 'ti-info-circle', titre: 'Forfait Gratuit', texte: 'Aucun abonnement payé avec ce compte.' }
}

function Diagnostic({ fiche }) {
  const d = diagnostiquer(fiche)
  const ton = TONS[d.ton]
  return (
    <div role="status" style={{ borderRadius: 'var(--radius-lg)', border: `1px solid ${ton.bord}`, background: ton.fond, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: ton.couleur }}>
        <i className={`ti ${d.icone}`} aria-hidden="true" style={{ fontSize: 19 }}></i>
        {d.titre}
      </span>
      <p style={{ ...styleNote, color: 'var(--text-primary)' }}>{d.texte}</p>
      {d.conseil && <p style={{ ...styleNote, fontSize: 12 }}><strong>À suggérer :</strong> {d.conseil}</p>}
    </div>
  )
}

function TitreCarte({ icone, children }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
      <i className={`ti ${icone}`} aria-hidden="true" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
      {children}
    </span>
  )
}

function Ligne({ cle, children }) {
  return <div style={{ ...styleLigne, alignItems: 'center' }}><span style={styleCle}>{cle}</span><span style={styleValeur}>{children}</span></div>
}

function Pastille({ ton, children }) {
  const t = TONS[ton] || TONS.neutre
  return <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999, color: t.couleur, background: t.fond }}>{children}</span>
}

function Action({ icone, titre, detail, onClick, desactive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 0', background: 'none', border: 'none', borderTop: '1px solid var(--border)', fontFamily: 'inherit', textAlign: 'left', cursor: desactive ? 'not-allowed' : 'pointer', opacity: desactive ? 0.5 : 1 }}
    >
      <i className={`ti ${icone}`} aria-hidden="true" style={{ fontSize: 20, color: 'var(--primary)' }}></i>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{titre}</span>
        {detail && <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>{detail}</span>}
      </span>
      <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--text-hint)' }}></i>
    </button>
  )
}

function detailInvitation(inv) {
  return `Envoyée le ${dateLongue(inv.envoyee_le)}${invitationExpiree(inv.envoyee_le) ? ' · expirée' : ''} · nouveau lien valide 7 jours`
}

/* Gestes de soutien : lien de mot de passe ou de confirmation,
   invitations à renvoyer. Le retour s'affiche dans la carte même. */
function AiderCompte({ email, confirme, invitations, onInvitationRenouvelee }) {
  const [enCours, setEnCours] = useState('')
  const [retour, setRetour] = useState(null)

  // geste() rend null si tout va bien, sinon le message d'erreur à afficher.
  async function executer(cle, geste, reussite) {
    if (enCours) return
    setEnCours(cle)
    setRetour(null)
    const echec = await geste()
    setEnCours('')
    setRetour(echec ? { erreur: true, texte: echec } : { erreur: false, texte: reussite })
  }

  const envoyerLienMotDePasse = () => executer(
    'mdp',
    async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/nouveau-mot-de-passe` })
      return error ? traduireErreur(error, "Le lien n'a pas pu être envoyé. Réessayez dans une minute.") : null
    },
    `Lien de nouveau mot de passe envoyé à ${email}.`,
  )

  const renvoyerConfirmation = () => executer(
    'confirmation',
    async () => {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      return error ? traduireErreur(error, "Le lien n'a pas pu être renvoyé. Réessayez dans une minute.") : null
    },
    `Lien de confirmation renvoyé à ${email}.`,
  )

  // Une invitation neuve remplace l'ancienne (nouveau lien), puis le courriel part.
  const renvoyerInvitation = inv => executer(
    inv.id,
    async () => {
      const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
        body: { action: 'renouveler-invitation', invitationId: inv.id },
      })
      if (error) return lireErreur(error, "L'invitation n'a pas pu être renouvelée. Réessayez.")
      onInvitationRenouvelee(inv.id, data.invitationId)
      const { error: erreurCourriel } = await supabase.functions.invoke('send-invitation', { body: { invitationId: data.invitationId } })
      // L'invitation neuve existe : seul le courriel a échoué, on peut réessayer.
      return erreurCourriel ? "L'invitation a été renouvelée, mais le courriel n'a pas pu partir. Réessayez." : null
    },
    `Invitation renvoyée à ${inv.email}.`,
  )

  return (
    <div style={{ ...styleCarte, gap: 0, paddingBottom: 4 }}>
      <div style={{ paddingBottom: 10 }}><TitreCarte icone="ti-lifebuoy">Aider ce compte</TitreCarte></div>
      {confirme === false && (
        <Action icone="ti-mail-forward" titre="Renvoyer le lien de confirmation" detail="Le courriel reçu à l'inscription" onClick={renvoyerConfirmation} desactive={Boolean(enCours)} />
      )}
      {confirme === true && (
        <Action icone="ti-key" titre="Envoyer un lien de nouveau mot de passe" detail="Par courriel, comme « Mot de passe oublié »" onClick={envoyerLienMotDePasse} desactive={Boolean(enCours)} />
      )}
      {invitations.map(inv => (
        <Action
          key={inv.id}
          icone="ti-mail-forward"
          titre={inv.clinique !== undefined ? `Renvoyer l'invitation de ${inv.clinique || 'la clinique'}` : `Renvoyer l'invitation à ${inv.email}`}
          detail={enCours === inv.id ? 'Envoi...' : detailInvitation(inv)}
          onClick={() => renvoyerInvitation(inv)}
          desactive={Boolean(enCours)}
        />
      ))}
      {retour && (
        <div className={retour.erreur ? 'form-erreur' : 'profil-succes'} role={retour.erreur ? 'alert' : 'status'} style={{ margin: '4px 0 12px' }}>
          {retour.texte}
        </div>
      )}
    </div>
  )
}

function UnCompte() {
  const [adresse, setAdresse] = useState('')
  const [recherche, setRecherche] = useState(null)
  const [enCours, setEnCours] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [effacerStripe, setEffacerStripe] = useState(false)
  const [suppressionOuverte, setSuppressionOuverte] = useState(false)

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
    setSuppressionOuverte(false)
    const { data, error } = await supabase.functions.invoke('admin-supprimer-compte', {
      body: { action: 'chercher', email: adresse, detail: true },
    })
    setEnCours('')
    if (error) return setErreur(await lireErreur(error, "La recherche n'a pas pu se faire. Réessayez."))
    setRecherche(data)
  }

  // L'invitation renouvelée a un nouvel identifiant et une nouvelle date.
  function invitationRenouvelee(ancienId, nouvelId) {
    const maj = inv => (inv.id === ancienId ? { ...inv, id: nouvelId, envoyee_le: new Date().toISOString() } : inv)
    setRecherche(r => ({
      ...r,
      invitationsRecues: r.invitationsRecues?.map(maj),
      clinique: r.clinique ? { ...r.clinique, invitationsEnvoyees: r.clinique.invitationsEnvoyees.map(maj) } : r.clinique,
    }))
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
  const abonnement = recherche?.abonnement
  const clinique = recherche?.clinique
  const bloque = recherche?.estVous || recherche?.estAdmin
  const confirme = confirmation.trim().toLowerCase() === recherche?.email
  const recues = (recherche?.invitationsRecues || []).map(inv => ({ ...inv, email: recherche.email }))
  // Le propriétaire et les admins de la clinique gèrent ses invitations ; on peut les renvoyer pour eux.
  const envoyees = compte?.clinique && compte.clinique.role !== 'membre' ? clinique?.invitationsEnvoyees || [] : []
  const statutStripe = abonnement?.statut ? STATUTS_STRIPE[abonnement.statut] || { label: abonnement.statut, ton: 'neutre' } : null

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
        <>
          <div style={styleCarte}>
            <p style={{ ...styleNote, color: 'var(--text-primary)', fontWeight: 600 }}>
              Aucun compte avec l'adresse {recherche.email}.
            </p>
            {recues.length > 0 && (
              <p style={styleNote}>
                Une invitation attend cette adresse : la personne crée son compte en cliquant le lien du courriel.
              </p>
            )}
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
          {recues.length > 0 && <AiderCompte email={recherche.email} invitations={recues} onInvitationRenouvelee={invitationRenouvelee} />}
        </>
      )}

      {/* ─── FICHE DU COMPTE ──────────────────── */}
      {recherche?.trouve && (
        <>
          <Diagnostic fiche={recherche} />

          <div style={styleCarte}>
            <TitreCarte icone="ti-user">Compte</TitreCarte>
            <Ligne cle="Nom">{compte?.nom || '-'}</Ligne>
            <Ligne cle="Courriel">{recherche.email}</Ligne>
            {compte?.cree_le && <Ligne cle="Inscrit le">{dateLongue(compte.cree_le)}</Ligne>}
            {recherche.connexion && (
              <>
                <Ligne cle="Dernière ouverture de session">{dateLongue(recherche.connexion.derniere) || 'Jamais'}</Ligne>
                <Ligne cle="Courriel confirmé">{recherche.connexion.confirme ? 'Oui' : 'Non'}</Ligne>
              </>
            )}
          </div>

          <div style={styleCarte}>
            <TitreCarte icone="ti-receipt">Abonnement</TitreCarte>
            <Ligne cle="Forfait dans l'app"><Pastille ton="neutre">{PLANS[compte?.plan] || compte?.plan}</Pastille></Ligne>
            <Ligne cle="Statut Stripe">
              {recherche.stripeInjoignable
                ? 'Stripe injoignable'
                : statutStripe ? <Pastille ton={statutStripe.ton}>{statutStripe.label}</Pastille> : abonnement ? 'Aucun abonnement' : 'Jamais abonné'}
            </Ligne>
            {abonnement?.debut && <Ligne cle="Abonnement depuis le">{dateLongue(abonnement.debut)}</Ligne>}
            {abonnement?.forfait === 'equipe' && abonnement.sieges && <Ligne cle="Sièges payés">{abonnement.sieges}</Ligne>}
            <Ligne cle="Essai gratuit">
              {recherche.essaiUtilise === null ? 'Stripe injoignable' : recherche.essaiUtilise ? 'Déjà utilisé' : 'Disponible'}
            </Ligne>
            {abonnement?.lienStripe && (
              <a
                href={abonnement.lienStripe}
                target="_blank"
                rel="noreferrer"
                className="labo-btn-secondary"
                style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}
              >
                <i className="ti ti-external-link" aria-hidden="true"></i>
                Ouvrir dans Stripe
              </a>
            )}
          </div>

          {compte?.clinique && (
            <div style={styleCarte}>
              <TitreCarte icone="ti-building-hospital">Clinique</TitreCarte>
              <Ligne cle="Nom">{compte.clinique.nom || 'Sans nom'}</Ligne>
              <Ligne cle="Rôle">{ROLES[compte.clinique.role] || compte.clinique.role}</Ligne>
              {clinique?.membres != null && (
                <Ligne cle="Membres">{clinique.membres}{clinique.sieges ? ` sur ${clinique.sieges} places` : ''}</Ligne>
              )}
              {clinique?.proprietaire && (
                <Ligne cle="Propriétaire">{clinique.proprietaire.email || clinique.proprietaire.nom}</Ligne>
              )}
              {clinique?.invitationsEnvoyees?.length > 0 && (
                <Ligne cle="Invitations en attente">{clinique.invitationsEnvoyees.length}</Ligne>
              )}
            </div>
          )}

          <AiderCompte
            email={recherche.email}
            confirme={recherche.connexion?.confirme}
            invitations={[...recues, ...envoyees]}
            onInvitationRenouvelee={invitationRenouvelee}
          />

          {bloque ? (
            <div className="form-erreur">
              {recherche.estVous
                ? 'C\'est votre propre compte : supprimez-le depuis votre profil.'
                : "Ce compte fait partie de l'administration : il ne peut pas être supprimé ici."}
            </div>
          ) : (
            <div className="labo-tube-card">
              <button
                type="button"
                className={`labo-tube-header${suppressionOuverte ? ' ouvert' : ''}`}
                onClick={() => setSuppressionOuverte(v => !v)}
                aria-expanded={suppressionOuverte}
              >
                <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 18, color: 'var(--accent-red)' }}></i>
                <span className="labo-tube-nom" style={{ color: 'var(--accent-red)' }}>Supprimer ce compte</span>
                <i className={`ti ti-chevron-down labo-tube-chevron${suppressionOuverte ? ' ouvert' : ''}`}></i>
              </button>
              {suppressionOuverte && (
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={styleNote}>Le même nettoyage que le bouton « Supprimer le compte » du profil.</p>
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
