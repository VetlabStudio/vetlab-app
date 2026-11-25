import { supabase } from './supabase'

/* Signalements d'erreurs en attente de traitement, pour l'administration.
   Même règle d'accès que RouteProtegeeAdmin (App.jsx) ; le serveur
   revérifie avec la table admins_app. Les autres comptes n'appellent
   pas la fonction. En cas d'échec, on affiche simplement 0. */
const COURRIEL_ADMIN = 'info@vetlabstudio.ca'

export async function compterSignalementsEnAttente(user) {
  if (user?.email !== COURRIEL_ADMIN) return 0
  try {
    const { data } = await supabase.functions.invoke('signalements', { body: { action: 'compter' } })
    return data?.aTraiter || 0
  } catch {
    return 0
  }
}
