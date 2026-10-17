import { useState } from 'react'
import { suggererCourriel } from '../lib/suggestionCourriel'

/* La suggestion n'apparaît qu'une fois le champ quitté (rien pendant la
   première saisie), puis elle suit chaque frappe. */
export function useSuggestionCourriel(courriel) {
  const [actif, setActif] = useState(false)
  return {
    suggestion: actif ? suggererCourriel(courriel) : null,
    quitterChamp: () => { if (courriel.trim()) setActif(true) },
    reinitialiser: () => setActif(false),
  }
}
