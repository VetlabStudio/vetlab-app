import { supabase } from './supabase'

/* Mode hors ligne, côté app. Le service worker (src/sw.js) garde la
   dernière réponse de chaque lecture des tables de référence. Ici, on
   lit ces tables en entier à la connexion : le service worker peut
   ensuite reconstruire hors ligne une catégorie ou une fiche jamais
   ouverte. Lecture répétée au plus une fois par heure, pour que le
   contenu hors ligne suive de près les corrections. */

const CLE_PRECHARGEMENT = 'adjuvet-prechargement'
const INTERVALLE_MS = 60 * 60 * 1000
const TAILLE_PAGE = 1000

// Les tables personnelles ne renvoient que les lignes de la personne (et de sa clinique).
const TABLES = [
  'medicaments', 'medicaments_custom', 'favoris', 'sous_categories',
  'labo_categories', 'labo_protocoles', 'labo_protocoles_user',
  'labo_etapes', 'labo_etapes_user', 'labo_etapes_user_custom',
]

function lire(cle) {
  try { return JSON.parse(localStorage.getItem(cle)) } catch { return null }
}

// Les réponses ne sont gardées que si le service worker contrôle déjà la page.
async function serviceWorkerActif() {
  if (!('serviceWorker' in navigator)) return false
  await navigator.serviceWorker.ready
  if (navigator.serviceWorker.controller) return true
  await new Promise((resoudre) => navigator.serviceWorker.addEventListener('controllerchange', resoudre, { once: true }))
  return true
}

async function lireTable(table) {
  for (let debut = 0; ; debut += TAILLE_PAGE) {
    const { data, error } = await supabase.from(table).select('*').range(debut, debut + TAILLE_PAGE - 1)
    if (error) throw error
    if (!data || data.length < TAILLE_PAGE) return
  }
}

// Le profil (forfait, clinique) : les sections Pro restent ouvertes hors ligne.
async function lireProfil(userId) {
  const { error } = await supabase.from('profiles').select('*').eq('id', userId)
  if (error) throw error
}

export async function prechargerDonnees(userId) {
  const dernier = lire(CLE_PRECHARGEMENT)
  if (dernier?.userId === userId && Date.now() - dernier.date < INTERVALLE_MS) return
  if (!navigator.onLine || !(await serviceWorkerActif())) return
  const resultats = await Promise.allSettled([...TABLES.map(lireTable), lireProfil(userId)])
  // Réessayé à la prochaine ouverture si une table n'a pas pu être lue.
  if (resultats.every((r) => r.status === 'fulfilled')) {
    try { localStorage.setItem(CLE_PRECHARGEMENT, JSON.stringify({ userId, date: Date.now() })) } catch { /* stockage plein ou bloqué */ }
  }
}

/* À la déconnexion : les données de la personne ne restent pas sur
   l'appareil. Le code de l'app et les images restent en cache. */
export async function oublierDonnees() {
  try { localStorage.removeItem(CLE_PRECHARGEMENT) } catch { /* stockage bloqué */ }
  if ('caches' in window) await caches.delete('adjuvet-donnees')
}
