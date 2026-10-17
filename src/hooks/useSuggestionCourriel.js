import { useEffect, useState } from 'react'
import { suggererCourriel } from '../lib/suggestionCourriel'

// Pause de frappe après laquelle la suggestion s'affiche.
const PAUSE = 700

const aUneSuggestion = (s) => (Array.isArray(s) ? s.length > 0 : Boolean(s))

/* Faute de frappe probable dans un courriel (ex. nom@gmial.com).
   La suggestion s'affiche dès une courte pause dans la frappe, jamais
   en pleine saisie. Avant l'envoi, doitConfirmer() la montre si la
   personne ne l'a pas encore vue : un deuxième envoi garde alors
   l'adresse telle quelle.
   Rien ne s'affiche en quittant le champ : la ligne ajoutée déplacerait
   le bouton sur lequel on appuie, et le clic se perdrait.
   calculer : pour un champ à plusieurs adresses, retourne une liste. */
export function useSuggestionCourriel(texte, calculer = suggererCourriel) {
  // Texte « posé » : après une pause dans la frappe, ou à l'envoi.
  const [pose, setPose] = useState(null)
  // Texte que la personne a choisi de garder malgré la suggestion.
  const [garde, setGarde] = useState(null)

  useEffect(() => {
    const minuterie = setTimeout(() => setPose(texte), PAUSE)
    return () => clearTimeout(minuterie)
  }, [texte])

  const suggestion = pose === texte ? calculer(texte) : null
  return {
    suggestion,
    // Envoi bloqué une fois : on rappelle qu'un deuxième envoi garde l'adresse.
    avertie: garde === texte && aUneSuggestion(suggestion),
    // Montre la suggestion tout de suite (ex. à l'envoi d'une adresse mal formée).
    afficher: () => setPose(texte),
    reinitialiser: () => { setPose(null); setGarde(null) },
    doitConfirmer: () => {
      if (garde === texte || !aUneSuggestion(calculer(texte))) return false
      setPose(texte)
      setGarde(texte)
      return true
    },
  }
}
