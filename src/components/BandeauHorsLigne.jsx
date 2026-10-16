import useEnLigne from '../hooks/useEnLigne'

// Affiché sous l'en-tête tant que l'appareil n'a pas de réseau.
export default function BandeauHorsLigne() {
  const enLigne = useEnLigne()
  if (enLigne) return null
  return (
    <div className="bandeau-hors-ligne" role="status">
      <i className="ti ti-wifi-off" aria-hidden="true"></i>
      <span>Hors ligne : les outils de référence restent disponibles.</span>
    </div>
  )
}
