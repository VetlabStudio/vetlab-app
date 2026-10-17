// Traduit en français les erreurs de Supabase (connexion, base de données,
// fichiers, fonctions) avant de les afficher. Supabase répond en anglais :
// son texte ne doit jamais apparaître tel quel à l'écran.

const RESEAU = 'Connexion internet requise. Vérifiez votre connexion et réessayez.'
const SESSION = 'Votre session a expiré. Reconnectez-vous, puis réessayez.'

// Codes des erreurs de connexion (Supabase Auth) et de la base (Postgres).
const PAR_CODE = {
  email_exists: 'Cette adresse courriel est déjà utilisée par un autre compte.',
  user_already_exists: 'Cette adresse courriel est déjà utilisée par un autre compte.',
  identity_already_exists: 'Cette adresse courriel est déjà utilisée par un autre compte.',
  email_address_invalid: "Cette adresse courriel n'est pas valide.",
  email_address_not_authorized: "Aucun courriel ne peut être envoyé à cette adresse. Essayez-en une autre.",
  email_not_confirmed: "Votre adresse courriel n'est pas encore confirmée. Ouvrez le lien reçu par courriel.",
  invalid_credentials: 'Courriel ou mot de passe incorrect.',
  same_password: "Le nouveau mot de passe doit être différent de l'ancien.",
  weak_password: 'Ce mot de passe est trop facile à deviner. Choisissez-en un plus long ou moins courant.',
  over_email_send_rate_limit: 'Trop de courriels envoyés en peu de temps. Réessayez dans quelques minutes.',
  over_request_rate_limit: 'Trop de tentatives. Réessayez dans quelques minutes.',
  reauthentication_needed: 'Pour votre sécurité, reconnectez-vous, puis réessayez.',
  session_not_found: SESSION,
  session_expired: SESSION,
  refresh_token_not_found: SESSION,
  refresh_token_already_used: SESSION,
  bad_jwt: SESSION,
  user_not_found: 'Compte introuvable.',
  user_banned: 'Ce compte est suspendu. Écrivez-nous pour en savoir plus.',
  otp_expired: 'Ce lien est expiré ou a déjà servi. Demandez-en un nouveau.',
  request_timeout: 'Le serveur a mis trop de temps à répondre. Réessayez.',
  PGRST301: SESSION,
  PGRST303: SESSION,
  PGRST116: 'Cet élément est introuvable. Il a peut-être été supprimé.',
  23505: 'Cet élément existe déjà.',
  23503: "Cet élément est lié à d'autres données : il ne peut pas être modifié ainsi.",
  23502: 'Un champ obligatoire est vide.',
  23514: "Une des valeurs entrées n'est pas acceptée.",
  22001: 'Un des textes est trop long.',
  '22P02': "Une des valeurs entrées n'a pas le bon format.",
  42501: "Vous n'avez pas l'autorisation de faire cette modification.",
}

function estErreurReseau(error) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true
  if (['AuthRetryableFetchError', 'FunctionsFetchError', 'FunctionsRelayError'].includes(error?.name)) return true
  return /failed to fetch|networkerror|load failed|network request failed/i.test(error?.message || '')
}

/**
 * Message français pour une erreur de Supabase.
 * defaut : message à afficher quand l'erreur n'a pas de traduction précise
 * (ex. « Le nom n'a pas pu être enregistré. »).
 */
export function traduireErreur(error, defaut = 'Une erreur est survenue. Réessayez dans quelques instants.') {
  if (!error) return defaut
  if (estErreurReseau(error)) return RESEAU

  const code = error.code ?? error.error_code
  if (code !== undefined && PAR_CODE[code]) return PAR_CODE[code]

  // Fichiers (photo, logo).
  const statut = Number(error.status ?? error.statusCode)
  if (statut === 413 || /exceeded the maximum allowed size|too large/i.test(error.message || '')) {
    return 'Ce fichier est trop lourd.'
  }
  if (statut === 415 || /mime type/i.test(error.message || '')) return "Ce format de fichier n'est pas accepté."
  if (statut === 429) return PAR_CODE.over_request_rate_limit
  if (statut === 401) return SESSION
  if (statut === 403 || /row-level security/i.test(error.message || '')) return PAR_CODE[42501]

  // Sans traduction précise : le détail reste dans la console pour le soutien.
  console.error('Erreur sans traduction :', error)
  return defaut
}
