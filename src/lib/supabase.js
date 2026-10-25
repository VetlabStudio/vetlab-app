import { createClient, isAuthRetryableFetchError } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbvjruunwdrbrzipgezs.supabase.co'
const supabaseAnonKey = 'sb_publishable_0K2R-bz97kwtmvALb9cc6w_HkG6QUvn'

/* Lu avant createClient : le client efface le jeton de l'adresse en le
   traitant. Vrai quand la page s'ouvre depuis le lien « mot de passe
   oublié » reçu par courriel. */
export const ouvertDepuisLienRecuperation =
  typeof window !== 'undefined' && /type=recovery/.test(window.location.hash + window.location.search)

/* Changement de courriel : Supabase envoie un lien à l'ancienne adresse
   et un à la nouvelle, et l'adresse ne change qu'une fois les deux
   ouverts. Au premier, il revient avec ce message dans l'adresse
   (« Confirmation link accepted. Please proceed to confirm link sent
   to the other email »), que la redirection de l'app ferait perdre. */
export const premiereConfirmationCourriel =
  typeof window !== 'undefined' && /confirmation(\+|%20| )link(\+|%20| )accepted/i.test(window.location.hash + window.location.search)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ─── HORS LIGNE ──────────────────────────────────
   Sans réseau, le client Supabase tente de renouveler la session
   pendant environ 25 secondes, puis répond comme si personne n'était
   connecté : l'app renverrait vers la connexion et les pages
   attendraient. On lit donc directement la session enregistrée sur
   l'appareil. Le renouvellement reprend dès que le réseau revient, et
   les règles d'accès de la base restent le vrai contrôle : hors ligne,
   cette session n'ouvre que ce qui est déjà sur l'appareil. */
export function horsLigne() {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

export function sessionEnregistree() {
  try {
    const session = JSON.parse(localStorage.getItem(supabase.auth.storageKey))
    return session?.user ? session : null
  } catch {
    return null
  }
}

const getSessionReseau = supabase.auth.getSession.bind(supabase.auth)
const getUserReseau = supabase.auth.getUser.bind(supabase.auth)

supabase.auth.getSession = () => (horsLigne()
  ? Promise.resolve({ data: { session: sessionEnregistree() }, error: null })
  : getSessionReseau())

supabase.auth.getUser = async (jeton) => {
  if (!jeton && horsLigne()) return { data: { user: sessionEnregistree()?.user ?? null }, error: null }
  const resultat = await getUserReseau(jeton)
  // Réseau coupé sans que le navigateur l'ait encore remarqué : même repli.
  if (!jeton && !resultat.data?.user && isAuthRetryableFetchError(resultat.error)) {
    const user = sessionEnregistree()?.user
    if (user) return { data: { user }, error: null }
  }
  return resultat
}
