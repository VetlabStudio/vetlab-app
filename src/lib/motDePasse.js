// Règles pour un nouveau mot de passe, selon les recommandations actuelles
// (NIST SP 800-63B rév. 4, OWASP ASVS 5) : la longueur compte plus que la
// complexité, aucune règle de composition, et on refuse les mots de passe
// courants, prévisibles ou personnels. La longueur minimale doit aussi être
// réglée dans Supabase (Authentication > Providers > Email) pour que le
// serveur l'applique.
export const LONGUEUR_MIN = 12
// Supabase refuse les mots de passe de plus de 72 caractères.
export const LONGUEUR_MAX = 72

export const ASTUCE_MOT_DE_PASSE = `${LONGUEUR_MIN} caractères minimum. Astuce : une courte phrase est facile à retenir, par exemple « mon chien mange des carottes ».`

// Les listes pèsent environ 90 ko : on ne les charge qu'au besoin.
let listes = null
let chargement = null

export function chargerListes() {
  if (listes) return Promise.resolve(listes)
  if (!chargement) {
    chargement = import('../data/motsDePasseCourants')
      .then((m) => {
        listes = {
          complets: new Set(m.MOTS_DE_PASSE_COURANTS.split('\n')),
          mots: new Set(m.MOTS_COURANTS.split('\n')),
        }
        return listes
      })
      .catch((err) => {
        console.error('Liste des mots de passe courants introuvable:', err)
        chargement = null
        return null
      })
  }
  return chargement
}

export const listesChargees = () => listes

const SUITES = [
  '01234567890',
  'abcdefghijklmnopqrstuvwxyz',
  'azertyuiopqsdfghjklmwxcvbn',
  'qwertyuiopasdfghjklzxcvbnm',
]

function estSuiteOuRepetition(mdp) {
  const s = mdp.toLowerCase().replace(/[\s._-]/g, '')
  if (new Set(s).size < 4) return true
  if (/^(.{1,6})\1+$/.test(s)) return true
  return SUITES.some((suite) => {
    const double = suite + suite
    const inverse = [...double].reverse().join('')
    return double.includes(s) || inverse.includes(s)
  })
}

// Morceaux du nom et du courriel assez longs pour être significatifs.
function morceauxPersonnels({ email = '', nom = '' }) {
  const locale = email.split('@')[0] || ''
  return [...locale.split(/[^a-zà-ÿ]+/i), ...nom.split(/[^a-zà-ÿ]+/i), 'adjuvet', 'vetlab']
    .map((m) => m.toLowerCase())
    .filter((m) => m.length >= 4)
}

/* Évalue un mot de passe.
   niveau : 0 vide, 1 faible (refusé), 2 correct, 3 fort.
   message : explication à afficher sous le champ. */
export function evaluerMotDePasse(mdp, infos = {}) {
  if (!mdp) return { niveau: 0, valide: false, message: ASTUCE_MOT_DE_PASSE }

  if (mdp.length < LONGUEUR_MIN) {
    const reste = LONGUEUR_MIN - mdp.length
    return { niveau: 1, valide: false, message: `Encore ${reste} caractère${reste > 1 ? 's' : ''} (${LONGUEUR_MIN} minimum).` }
  }
  if (mdp.length > LONGUEUR_MAX) {
    return { niveau: 1, valide: false, message: `${LONGUEUR_MAX} caractères maximum.` }
  }

  const minuscule = mdp.toLowerCase()
  if (estSuiteOuRepetition(mdp)) {
    return { niveau: 1, valide: false, message: 'Évitez les répétitions et les suites (aaaa, 1234, azerty).' }
  }
  if (morceauxPersonnels(infos).some((m) => minuscule.includes(m))) {
    return { niveau: 1, valide: false, message: "Évitez d'utiliser votre nom, votre courriel ou le nom de l'app." }
  }
  if (listes) {
    if (listes.complets.has(minuscule)) {
      return { niveau: 1, valide: false, message: 'Ce mot de passe est trop courant. Choisissez-en un autre.' }
    }
    // « Soleil2026!!! » : un mot courant, éventuellement répété, plus des chiffres ou symboles.
    const lettres = minuscule.replace(/[^a-z]/g, '')
    const base = lettres.match(/^(.+?)\1*$/)?.[1] || lettres
    if (lettres.length < 4 || listes.mots.has(base)) {
      return { niveau: 1, valide: false, message: 'Trop prévisible : un mot courant avec des chiffres ou des symboles.' }
    }
  }

  const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) => r.test(mdp)).length
  if (mdp.length >= 16 || (mdp.length >= 14 && types >= 3)) {
    return { niveau: 3, valide: true, message: 'Très difficile à deviner.' }
  }
  return { niveau: 2, valide: true, message: 'Quelques caractères de plus le rendraient encore plus solide.' }
}

// Pour la validation à l'envoi du formulaire : s'assure que les listes sont chargées.
export async function verifierMotDePasse(mdp, infos) {
  await chargerListes()
  return evaluerMotDePasse(mdp, infos)
}
