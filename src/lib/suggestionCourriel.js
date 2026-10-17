// Repère une faute de frappe dans le domaine d'un courriel courant
// (ex. nom@gmial.com) et propose la bonne adresse.

// Domaines courants au Québec. En cas d'égalité, le premier de la liste l'emporte.
const DOMAINES = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'hotmail.ca', 'live.ca', 'yahoo.ca',
  'yahoo.com', 'icloud.com', 'videotron.ca', 'live.com', 'msn.com', 'me.com',
  'mac.com', 'sympatico.ca', 'bell.net', 'cgocable.ca', 'globetrotter.net',
  'telus.net', 'rogers.com', 'shaw.ca', 'hotmail.fr', 'outlook.fr', 'live.fr',
  'yahoo.fr', 'protonmail.com', 'proton.me', 'aol.com', 'mail.com', 'email.com',
]

// Nombre de lettres à ajouter, retirer, remplacer ou inverser (deux voisines)
// pour passer d'un mot à l'autre.
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cout)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

/**
 * Retourne l'adresse corrigée (ex. « nom@gmail.com » pour « nom@gail.com »),
 * ou null si le domaine est déjà connu ou trop différent des domaines courants.
 */
export function suggererCourriel(courriel) {
  const texte = courriel.trim()
  const arobase = texte.lastIndexOf('@')
  if (arobase < 1 || texte.indexOf('@') !== arobase) return null
  const local = texte.slice(0, arobase)
  const domaine = texte.slice(arobase + 1).toLowerCase()
  if (!domaine || DOMAINES.includes(domaine)) return null

  let meilleur = null
  let ecart = Infinity
  for (const connu of DOMAINES) {
    // Domaine sans point (ex. « gmail », « gmal » ou « gmailcom ») : on compare
    // au nom seul et au domaine écrit sans son point.
    const d = domaine.includes('.')
      ? distance(domaine, connu)
      : Math.min(distance(domaine, connu.split('.')[0]), distance(domaine, connu.replace('.', '')))
    // Une seule faute permise pour les domaines courts, deux pour les longs :
    // évite de « corriger » un vrai domaine qui ressemble à un domaine court.
    const permis = domaine.includes('.') && connu.length >= 9 ? 2 : 1
    if (d <= permis && d < ecart) {
      meilleur = connu
      ecart = d
    }
  }
  return meilleur ? `${local}@${meilleur}` : null
}
