import EN from '../i18n/en'

/* Langue de l'app : français (langue d'origine) ou anglais.
   Le texte français sert de clé : t('Profil') renvoie « Profile » en
   anglais, et le texte français tel quel s'il n'a pas encore de
   traduction. La langue est fixée au chargement de la page ; la changer
   recharge l'app, ce qui permet d'utiliser t() partout, même dans les
   listes définies hors des composants.
   Variables : t('Bonjour {nom}', { nom }) remplace {nom}. */

const CLE = 'adjuvet_langue'

export const LANGUES = [
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' },
]

function langueInitiale() {
  try {
    const v = localStorage.getItem(CLE)
    if (v === 'fr' || v === 'en') return v
  } catch { /* stockage indisponible */ }
  if (typeof navigator === 'undefined') return 'fr'
  const nav = String(navigator.languages?.[0] || navigator.language || 'fr').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

export const langue = langueInitiale()
export const enAnglais = langue === 'en'
// Pour les dates et les nombres (toLocaleDateString, Intl...).
export const locale = enAnglais ? 'en-CA' : 'fr-CA'

if (typeof document !== 'undefined') document.documentElement.lang = langue

const manquants = new Set()

export function t(texte, vars) {
  let s = texte
  if (enAnglais) {
    const trad = EN[texte]
    if (trad !== undefined) s = trad
    else if (import.meta.env.DEV && texte && !manquants.has(texte)) {
      manquants.add(texte)
      console.debug('[i18n] à traduire :', texte)
    }
  }
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m))
  return s
}

/* Accord simple : tn(n, 'valeur', 'valeurs') ou avec des textes à
   variables, ex. tn(n, '{n} jour', '{n} jours'). */
export function tn(n, singulier, pluriel, vars) {
  return t(n > 1 || (enAnglais && n === 0) ? pluriel : singulier, { n, ...vars })
}

/* Séparateur décimal de la langue : « 2,5 » en français, « 2.5 » en anglais. */
export function decimal(valeur) {
  const texte = String(valeur)
  return enAnglais ? texte : texte.replace('.', ',')
}

/* Montant en dollars : « 7,99 $ » en français, « $7.99 » en anglais.
   Les montants entiers restent sans décimales (« 59 $ », « $59 »). */
export function prix(montant) {
  const texte = Number.isInteger(montant) ? String(montant) : montant.toFixed(2)
  return enAnglais ? `$${texte}` : `${texte.replace('.', ',')} $`
}

/* Valeurs de référence écrites à la française (« 5,5–12,5 », « UI/L ») :
   en anglais, virgule décimale → point et UI → U. */
export function chiffres(texte) {
  if (!enAnglais || typeof texte !== 'string') return texte
  return texte.replace(/(\d),(\d)/g, '$1.$2').replace(/\bUI\b/g, 'U')
}

/* Ligne venant de la base avec des colonnes anglaises (titre_en,
   description_en...) : en anglais, remplace chaque champ par sa version
   anglaise quand elle existe ; sinon garde le français. */
export function enLangue(ligne, champs) {
  if (!enAnglais || !ligne) return ligne
  const copie = { ...ligne }
  for (const c of champs) if (ligne[c + '_en']) copie[c] = ligne[c + '_en']
  return copie
}

export function changerLangue(id) {
  if (id === langue) return
  try { localStorage.setItem(CLE, id) } catch { /* stockage indisponible */ }
  window.location.reload()
}
