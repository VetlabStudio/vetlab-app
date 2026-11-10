/* Affichage des doses et calcul en comprimés, communs à la fiche
   médicament et au Calcul rapide. Les doses arrivent toujours en mg. */

// Petites doses : trois chiffres significatifs, sinon deux décimales.
export const arrondirDose = n => (n > 0 && n < 1 ? String(Number(n.toPrecision(3))) : n.toFixed(2))

// En mcg : sans décimales inutiles (50 mcg, 12.5 mcg).
export const arrondirMcg = n => (n > 0 && n < 1 ? String(Number(n.toPrecision(3))) : String(Number(n.toFixed(1))))

const FRACTIONS = ['', '¼', '½', '¾']

// 6 quarts → « 1 ½ ».
export function formaterQuarts(quarts) {
  const entiers = Math.floor(quarts / 4)
  const reste = quarts % 4
  if (!entiers) return FRACTIONS[reste]
  return reste ? `${entiers} ${FRACTIONS[reste]}` : String(entiers)
}

// En français, le pluriel commence à 2 : « 1 ½ comprimé », « 2 comprimés ».
const comprimes = n => (n >= 2 ? 'comprimés' : 'comprimé')

/* Nombre de comprimés pour une dose en mg, puis arrondi au quart de
   comprimé, la plus petite fraction qu'on coupe en pratique. L'écart
   entre la dose donnée et la dose calculée sert à avertir quand
   l'arrondi s'en éloigne trop. */
export function calculComprimes(doseMg, teneur, uniteTeneur) {
  const enMcg = uniteTeneur === 'mcg'
  const teneurMg = enMcg ? teneur / 1000 : teneur
  const exact = doseMg / teneurMg
  const dose = enMcg ? `${arrondirMcg(doseMg * 1000)} mcg` : `${arrondirDose(doseMg)} mg`
  const exactTexte = arrondirDose(exact)
  const etapes = [{
    titre: 'Comprimés = dose totale ÷ teneur du comprimé',
    calcul: `${dose} ÷ ${teneur} ${uniteTeneur} = ${exactTexte} ${comprimes(exact)}`,
  }]

  const quarts = Math.round(exact * 4)
  if (!quarts) return { comprimes: null, exact: exactTexte, etapes }

  const donnes = quarts / 4
  const doseDonneeMg = donnes * teneurMg
  const doseDonnee = enMcg ? `${arrondirMcg(doseDonneeMg * 1000)} mcg` : `${arrondirDose(doseDonneeMg)} mg`
  const aDonner = `${formaterQuarts(quarts)} ${comprimes(donnes)}`
  etapes.push({ titre: 'Arrondi au quart de comprimé', calcul: `${aDonner} = ${doseDonnee}` })
  return { comprimes: aDonner, exact: exactTexte, doseDonnee, ecart: (donnes - exact) / exact, etapes }
}

// Au-delà de 10 % d'écart, l'arrondi est signalé.
export const ECART_MAX_COMPRIMES = 0.1
