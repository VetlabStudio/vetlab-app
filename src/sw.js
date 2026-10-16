/* Service worker d'Adjuvet : garde l'app sur l'appareil pour qu'elle
   s'ouvre et reste utile sans internet.

   Ce fichier n'est pas importé par l'app. Au build, vite.config.js le
   copie dans dist/sw.js en remplaçant VERSION et FICHIERS par la liste
   des fichiers à enregistrer dès l'installation.

   - Code, styles, polices et petites images : enregistrés à
     l'installation, servis depuis l'appareil.
   - Autres images : enregistrées la première fois qu'elles s'affichent.
   - Données de référence (médicaments, protocoles du labo, favoris,
     profil) : lues sur le réseau, la dernière réponse est gardée pour
     servir hors ligne.
   - Tout le reste (équipe, notes, notifications, paiements) passe
     directement par le réseau. */

const VERSION = 'dev'
const FICHIERS = []

const CACHE_APP = `adjuvet-app-${VERSION}`
const CACHE_FICHIERS = 'adjuvet-fichiers'
const CACHE_DONNEES = 'adjuvet-donnees'
const CACHE_META = 'adjuvet-meta'

// Même adresse que src/lib/supabase.js.
const SUPABASE = 'https://jbvjruunwdrbrzipgezs.supabase.co'
const ICONES = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css'

// Tables lues hors ligne. Les autres demandent internet.
const TABLES_HORS_LIGNE = new Set([
  'medicaments', 'medicaments_custom', 'favoris', 'sous_categories',
  'labo_categories', 'labo_protocoles', 'labo_protocoles_user',
  'labo_etapes', 'labo_etapes_user', 'labo_etapes_user_custom',
  'chartes_radio', 'profiles', 'equipes',
])

// Au-delà de ce délai, la page enregistrée est servie (réseau très lent).
const DELAI_PAGE_MS = 3000

const fichiersApp = new Set(FICHIERS)

function avecDelai(promesse, ms) {
  return new Promise((resoudre, rejeter) => {
    const minuterie = setTimeout(() => rejeter(new Error('delai')), ms)
    promesse.then(
      (valeur) => { clearTimeout(minuterie); resoudre(valeur) },
      (erreur) => { clearTimeout(minuterie); rejeter(erreur) },
    )
  })
}

// ─── INSTALLATION ─────────────────────────────────

async function enregistrerIcones() {
  const cache = await caches.open(CACHE_FICHIERS)
  const css = await fetch(ICONES, { mode: 'cors' })
  if (!css.ok) return
  await cache.put(ICONES, css.clone())
  // La police d'icônes est indiquée dans la feuille de style.
  const texte = await css.text()
  const police = texte.match(/url\(["']?([^"')]+\.woff2[^"')]*)["']?\)/)
  if (!police) return
  const adresse = new URL(police[1], css.url || ICONES).href
  const fichier = await fetch(adresse, { mode: 'cors' })
  if (fichier.ok) await cache.put(adresse, fichier)
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_APP)
    await cache.addAll(FICHIERS.map((chemin) => new Request(chemin, { cache: 'reload' })))
    // Les icônes viennent d'un autre site : sans elles, l'app reste utilisable.
    try { await enregistrerIcones() } catch { /* réessayé à la prochaine visite */ }
    await self.skipWaiting()
  })())
})

/* On garde la version précédente de l'app : un onglet resté ouvert
   sur l'ancienne version peut encore avoir besoin de ses fichiers. */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const meta = await caches.open(CACHE_META)
    const enregistre = await meta.match('/versions')
    const versions = enregistre ? await enregistre.json() : []
    const gardees = [...versions.filter((v) => v !== VERSION), VERSION].slice(-2)
    await meta.put('/versions', new Response(JSON.stringify(gardees)))
    const noms = await caches.keys()
    await Promise.all(noms
      .filter((nom) => nom.startsWith('adjuvet-app-') && !gardees.includes(nom.slice('adjuvet-app-'.length)))
      .map((nom) => caches.delete(nom)))
    await self.clients.claim()
  })())
})

// ─── REQUÊTES ─────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const requete = event.request
  const url = new URL(requete.url)

  if (url.origin === SUPABASE && url.pathname.startsWith('/rest/v1/')) {
    if (requete.method === 'GET' && TABLES_HORS_LIGNE.has(url.pathname.slice('/rest/v1/'.length))) {
      event.respondWith(donnees(event, requete))
    } else if (requete.method === 'GET' || requete.method === 'HEAD') {
      event.respondWith(fetch(requete).catch((erreur) => {
        if (self.navigator.onLine === false) return reponseHorsLigne()
        throw erreur
      }))
    }
    return
  }

  if (requete.method !== 'GET') return

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/_vercel/')) return
    if (requete.mode === 'navigate') event.respondWith(page(requete))
    else event.respondWith(fichier(event, requete))
    return
  }

  if (url.origin === SUPABASE && url.pathname.startsWith('/storage/v1/object/public/')) {
    event.respondWith(enCacheDabord(event, requete, CACHE_DONNEES, requete.url))
    return
  }

  if (url.origin === 'https://cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@tabler/icons-webfont')) {
    event.respondWith(enCacheDabord(event, new Request(requete.url, { mode: 'cors' }), CACHE_FICHIERS, requete.url))
  }
})

/* Pages : le réseau d'abord, pour recevoir la dernière version de
   l'app. Sans réseau, la page enregistrée avec cette version, dont
   tous les fichiers sont déjà sur l'appareil. */
async function page(requete) {
  try {
    return await avecDelai(fetch(requete), DELAI_PAGE_MS)
  } catch {
    return (await caches.match('/index.html', { cacheName: CACHE_APP })) || Response.error()
  }
}

/* Fichiers de l'app. Ceux du build ne changent jamais sous le même nom.
   Les autres (images) sont servis depuis l'appareil et rafraîchis en
   arrière-plan. Le paramètre ?v= du logo animé est ignoré. */
async function fichier(event, requete) {
  const url = new URL(requete.url)
  const cle = url.origin + url.pathname
  if (url.pathname.startsWith('/assets/') || fichiersApp.has(url.pathname)) {
    const enCache = await caches.match(cle)
    if (enCache) return enCache
  }
  return enCacheDabord(event, requete, CACHE_FICHIERS, cle)
}

// Sert la copie enregistrée tout de suite et la met à jour en arrière-plan.
async function enCacheDabord(event, requete, nomCache, cle) {
  const cache = await caches.open(nomCache)
  const enCache = await cache.match(cle)
  const reseau = fetch(requete).then((reponse) => {
    if (reponse.ok) {
      const copie = reponse.clone()
      event.waitUntil(cache.put(cle, copie))
    }
    return reponse
  })
  if (enCache) {
    event.waitUntil(reseau.catch(() => {}))
    return enCache
  }
  return reseau
}

// ─── DONNÉES SUPABASE ─────────────────────────────

/* Sans réseau, le client Supabase réessaie trois fois (7 secondes)
   avant d'abandonner. Une réponse d'erreur immédiate lui évite
   d'attendre : la page s'affiche avec ce qui est sur l'appareil. */
function reponseHorsLigne() {
  return new Response(JSON.stringify({
    code: 'HORS_LIGNE',
    message: "Hors ligne : cette donnée n'est pas enregistrée sur l'appareil.",
    details: null,
    hint: null,
  }), { status: 504, headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}

/* Une même adresse peut répondre une liste ou un seul objet selon
   l'en-tête Accept (.single()) : les deux sont gardés séparément. */
function cleDonnees(requete) {
  const objet = (requete.headers.get('Accept') || '').includes('vnd.pgrst.object')
  if (!objet) return requete.url
  return requete.url + (requete.url.includes('?') ? '&' : '?') + 'sw-format=objet'
}

/* Avec réseau, la réponse vient toujours du serveur, même lente : la
   copie de l'appareil ne sert que si le serveur ne répond pas du tout.
   Ce qui s'affiche en ligne est donc toujours à jour. */
async function donnees(event, requete) {
  const cache = await caches.open(CACHE_DONNEES)
  const cle = cleDonnees(requete)
  try {
    const reponse = await fetch(requete)
    if (reponse.ok) {
      const copie = reponse.clone()
      event.waitUntil(cache.put(cle, copie))
    }
    return reponse
  } catch (erreur) {
    const enCache = await cache.match(cle, { ignoreVary: true })
    if (enCache) return enCache
    const reconstruite = await reconstruire(cache, requete)
    if (reconstruite) return reconstruite
    if (self.navigator.onLine === false) return reponseHorsLigne()
    throw erreur
  }
}

/* Hors ligne, une requête jamais faite peut souvent être reconstruite
   avec les lignes déjà enregistrées : une fiche à partir de la liste
   qui la contient, une catégorie à partir de la table complète
   enregistrée à la connexion (src/lib/horsLigne.js). Seuls les filtres
   simples sont reconnus ; sinon, pas de réponse. */
const PARAMETRES_SANS_FILTRE = new Set(['select', 'order', 'limit', 'offset', 'sw-format'])

function lireFiltre(valeur) {
  if (valeur.startsWith('eq.')) { const v = valeur.slice(3); return (x) => String(x) === v }
  if (valeur.startsWith('neq.')) { const v = valeur.slice(4); return (x) => String(x) !== v }
  if (valeur === 'is.null') return (x) => x === null || x === undefined
  if (valeur === 'not.is.null') return (x) => x !== null && x !== undefined
  if (valeur === 'is.true') return (x) => x === true
  if (valeur === 'is.false') return (x) => x === false
  if (valeur.startsWith('in.(') && valeur.endsWith(')')) {
    const liste = new Set(valeur.slice(4, -1).split(',').map((v) => v.replace(/^"|"$/g, '')))
    return (x) => liste.has(String(x))
  }
  return null
}

function comparer(ordre) {
  const termes = ordre.split(',').map((terme) => {
    const [colonne, sens = 'asc', nulls] = terme.split('.')
    const descendant = sens === 'desc'
    return { colonne, descendant, nullsDabord: nulls ? nulls === 'nullsfirst' : descendant }
  })
  return (a, b) => {
    for (const { colonne, descendant, nullsDabord } of termes) {
      const x = a[colonne]; const y = b[colonne]
      if (x == null || y == null) {
        if (x == null && y == null) continue
        return (x == null) === nullsDabord ? -1 : 1
      }
      const resultat = typeof x === 'string' ? x.localeCompare(y, 'fr') : (x < y ? -1 : x > y ? 1 : 0)
      if (resultat !== 0) return descendant ? -resultat : resultat
    }
    return 0
  }
}

async function reconstruire(cache, requete) {
  const url = new URL(requete.url)
  const select = url.searchParams.get('select') || '*'
  // Colonnes simples seulement : pas de jointure ni de renommage.
  if (select !== '*' && !/^[a-z0-9_]+(,[a-z0-9_]+)*$/.test(select)) return null

  const filtres = []
  for (const [nom, valeur] of url.searchParams) {
    if (PARAMETRES_SANS_FILTRE.has(nom)) continue
    const test = lireFiltre(valeur)
    if (!test) return null
    filtres.push([nom, test])
  }
  const parId = filtres.length === 1 && url.searchParams.has('id') && url.searchParams.get('id').startsWith('eq.')

  /* Pour une fiche par identifiant, toute réponse complète (select=*)
     de la table convient. Pour une liste, il faut la table entière,
     sans filtre, sinon la liste serait incomplète. */
  const lignes = new Map()
  let tableComplete = false
  for (const enregistree of await cache.keys()) {
    const source = new URL(enregistree.url)
    if (source.pathname !== url.pathname || source.searchParams.get('select') !== '*') continue
    const complete = [...source.searchParams.keys()].every((nom) => PARAMETRES_SANS_FILTRE.has(nom))
    if (!complete && !parId) continue
    if (complete) tableComplete = true
    const reponse = await cache.match(enregistree)
    let contenu
    try { contenu = await reponse.json() } catch { continue }
    for (const ligne of Array.isArray(contenu) ? contenu : [contenu]) {
      if (ligne && ligne.id != null) lignes.set(String(ligne.id), ligne)
    }
  }
  if (!parId && !tableComplete) return null

  let resultat = [...lignes.values()].filter((ligne) => filtres.every(([colonne, test]) => test(ligne[colonne])))
  if (url.searchParams.has('order')) resultat.sort(comparer(url.searchParams.get('order')))
  const debut = Number(url.searchParams.get('offset')) || 0
  const limite = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : Infinity
  resultat = resultat.slice(debut, debut + limite)
  if (select !== '*') {
    const colonnes = select.split(',')
    resultat = resultat.map((ligne) => Object.fromEntries(colonnes.map((c) => [c, ligne[c] ?? null])))
  }

  const objet = (requete.headers.get('Accept') || '').includes('vnd.pgrst.object')
  if (objet && resultat.length !== 1) return null
  return new Response(JSON.stringify(objet ? resultat[0] : resultat), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
