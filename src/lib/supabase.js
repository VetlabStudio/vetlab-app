import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbvjruunwdrbrzipgezs.supabase.co'
const supabaseAnonKey = 'sb_publishable_0K2R-bz97kwtmvALb9cc6w_HkG6QUvn'

/* Lu avant createClient : le client efface le jeton de l'adresse en le
   traitant. Vrai quand la page s'ouvre depuis le lien « mot de passe
   oublié » reçu par courriel. */
export const ouvertDepuisLienRecuperation =
  typeof window !== 'undefined' && /type=recovery/.test(window.location.hash + window.location.search)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)