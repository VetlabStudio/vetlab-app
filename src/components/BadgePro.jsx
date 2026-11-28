import { useProfil } from '../context/ProfilContext'

/* Pastille jaune « Pro » sur ce qui demande le forfait Pro.
   Par défaut : dans le coin d'une tuile (position absolue).
   enLigne : dans le texte d'un bouton.
   surBouton : sur le coin du bouton rond « + ».
   toujours : affichée même pour un compte Pro (ex. popup Pro). */
export default function BadgePro({ enLigne = false, grand = false, surBouton = false, toujours = false }) {
  const { estPro } = useProfil()
  if (estPro && !toujours) return null

  const classes = ['badge-pro']
  if (enLigne) classes.push('badge-pro--ligne')
  if (grand) classes.push('badge-pro--grand')
  if (surBouton) classes.push('badge-pro--bouton')
  return <span className={classes.join(' ')}>Pro</span>
}
