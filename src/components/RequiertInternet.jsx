import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useEnLigne from '../hooks/useEnLigne'

/* Section qui a besoin d'internet (équipe, notes, profil, ajouts...).
   Ouverte hors ligne, elle affiche un message et s'ouvre d'elle-même
   quand le réseau revient. Une section déjà ouverte reste affichée si
   le réseau tombe : rien n'est perdu en cours de saisie. */
export default function RequiertInternet({ children }) {
  const enLigne = useEnLigne()
  const { key } = useLocation()
  const [ouverture, setOuverture] = useState({ cle: key, bloquee: !enLigne })

  let bloquee = ouverture.bloquee
  if (ouverture.cle !== key || (bloquee && enLigne)) {
    bloquee = ouverture.cle !== key ? !enLigne : false
    setOuverture({ cle: key, bloquee })
  }

  if (!bloquee) return children
  return (
    <div className="page-hors-ligne" role="status">
      <i className="ti ti-wifi-off" aria-hidden="true"></i>
      <h2>Connexion internet requise</h2>
      <p>Cette section a besoin d'internet. Elle s'ouvrira dès que la connexion reviendra.</p>
      <p className="page-hors-ligne-aide">
        Sans internet, les calculateurs, la pharmacologie, le laboratoire et les autres sections de référence restent disponibles.
      </p>
    </div>
  )
}
