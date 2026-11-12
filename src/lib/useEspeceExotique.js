import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { TitreContext } from '../context/NavigationContext'
import { ESPECES_EXOTIQUES } from './especesExotiques'

/* Espèce de l'adresse (/exotiques/:espece/...) et titre de la page.

   Pendant une transition de page, l'ancienne page reste montée sous la
   nouvelle route : useParams ne renvoie plus rien. On garde alors la
   dernière espèce, sans quoi la page redirigerait vers le choix de
   l'espèce au lieu de laisser s'ouvrir la page demandée.

   La page sortante est aussi recréée sous la nouvelle adresse, avec
   l'espèce de cette adresse : elle ne pose le titre que si l'adresse est
   bien la sienne (sousChemin : « /medicaments », « /valeurs »), sinon
   elle remplacerait le titre de la page qui arrive.

   « inconnue » n'est vrai que pour une adresse réelle qui ne correspond
   à aucune espèce : la page renvoie alors vers le choix de l'espèce. */
export function useEspeceExotique(titrePour, sousChemin = '') {
  const { espece: especeUrl } = useParams()
  const { pathname } = useLocation()
  const { setTitreCustom } = useContext(TitreContext)
  const [espece, setEspece] = useState(especeUrl)
  if (especeUrl && especeUrl !== espece) setEspece(especeUrl)
  const connue = ESPECES_EXOTIQUES.includes(espece)
  const surSaPage = pathname.replace(/\/$/, '') === `/exotiques/${espece}${sousChemin}`
  const titre = connue && surSaPage ? titrePour(espece) : ''

  useEffect(() => {
    if (!titre) return
    setTitreCustom(titre)
    // Ne pas effacer le titre que la page suivante a peut-être déjà posé.
    return () => setTitreCustom(t => (t === titre ? '' : t))
  }, [titre, setTitreCustom])

  return { espece, connue, inconnue: !connue && Boolean(especeUrl) }
}
