import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { categorieDuSlug } from '../lib/especesExotiques'
import { useEspeceExotique } from '../lib/useEspeceExotique'
import DroguesCategorie from './DroguesCategorie'

/* Une catégorie de médicaments pour une espèce exotique (ex. Antibiotiques
   du lapin). Comme pour l'espèce, la catégorie est gardée pendant une
   transition de page, quand l'adresse ne la donne plus. */
export default function ExotiqueCategorie() {
  const { categorie: slugUrl } = useParams()
  const [slug, setSlug] = useState(slugUrl)
  if (slugUrl && slugUrl !== slug) setSlug(slugUrl)
  const categorie = slug ? categorieDuSlug(slug) : undefined
  const { espece, connue, inconnue } = useEspeceExotique(() => categorie || '', `/medicaments/${slug}`)
  if (inconnue) return <Navigate to="/exotiques" replace />
  if (!connue || !slug) return null
  if (!categorie) return <Navigate to={`/exotiques/${espece}/medicaments`} replace />
  return <DroguesCategorie espece={espece} categorie={categorie} />
}
