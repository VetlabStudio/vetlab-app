/* Lit un nombre tapé dans un champ, avec une virgule ou un point.
   Retourne null si le texte n'est pas un nombre plus grand que 0
   (lettres, zéro, valeur négative) : le calcul attend alors une
   valeur valide au lieu d'afficher « NaN ». */
export function lireNombrePositif(texte) {
  const nombre = Number(String(texte).trim().replace(',', '.'))
  return Number.isFinite(nombre) && nombre > 0 ? nombre : null
}
