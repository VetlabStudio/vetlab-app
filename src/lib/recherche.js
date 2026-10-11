/* Clé de recherche permissive : sans accents, sans majuscules, sans
   espaces ni traits d'union. « melanie » trouve « Mélanie »,
   « jeanmax » trouve « Jean-Maxime », « cefalexine » trouve « Céfalexine ». */
export function cleRecherche(texte) {
  return (texte || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[\s'’-]/g, '')
}

// Vrai si `texte` contient `recherche` selon la clé permissive.
export function correspond(texte, recherche) {
  return cleRecherche(texte).includes(cleRecherche(recherche))
}
