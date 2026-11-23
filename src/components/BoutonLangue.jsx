import { langue, changerLangue } from '../lib/i18n'

/* Bouton des pages de connexion : passe à l'autre langue. Le libellé est
   dans la langue proposée, pour être compris par qui ne lit pas l'autre. */
export default function BoutonLangue() {
  const autre = langue === 'fr' ? { id: 'en', label: 'English' } : { id: 'fr', label: 'Français' }
  return (
    <button
      type="button"
      lang={autre.id}
      onClick={() => changerLangue(autre.id)}
      style={{
        display: 'flex', width: 'fit-content', marginLeft: 'auto', alignItems: 'center', gap: 6,
        background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 999, padding: '6px 14px', font: 'inherit', fontSize: 14, fontWeight: 600,
        color: '#213058', cursor: 'pointer',
      }}
    >
      <i className="ti ti-world" aria-hidden="true"></i>
      {autre.label}
    </button>
  )
}
