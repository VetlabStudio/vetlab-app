import useEnLigne from '../hooks/useEnLigne'
import { t } from '../lib/i18n'

// Affiché sous l'en-tête tant que l'appareil n'a pas de réseau.
export default function BandeauHorsLigne() {
  const enLigne = useEnLigne()
  if (enLigne) return null
  return (
    <div className="bandeau-hors-ligne" role="status">
      <i className="ti ti-wifi-off" aria-hidden="true"></i>
      <span>{t('Hors ligne : les outils de référence restent disponibles.')}</span>
    </div>
  )
}
