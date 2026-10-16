import { createContext } from 'react'

/* Contextes de la mise en page (App.jsx), lus par les pages : titre de
   l'en-tête, garde « quitter sans enregistrer » et sens de l'animation
   entre deux pages. */
export const TitreContext = createContext({ titreCustom: '', setTitreCustom: () => {} })
export const NavGuardContext = createContext({ navGuardActif: false, setNavGuardActif: () => {}, navGuardMessage: '', setNavGuardMessage: () => {}, demanderConfirmation: (action) => action() })
export const NavDirectionContext = createContext({ skipNextRef: { current: false } })
