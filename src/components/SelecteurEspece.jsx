import { t } from '../lib/i18n'

/* Curseur à segments (Chien | Chat, ou plus).
   La pastille marine glisse sous le choix actif.
   options : ['chien', 'chat'] ou objets { id, label, actif, onClick }
   (ex. un segment « Autre espèce » qui ouvre une liste). */
const LIBELLES = { chien: 'Chien', chat: 'Chat' }

export default function SelecteurEspece({ valeur, onChange, options = ['chien', 'chat'], etiquette }) {
  const items = options.map(o => (typeof o === 'string'
    ? { id: o, label: t(LIBELLES[o] || o) }
    : o))
  const index = items.findIndex(o => (o.actif !== undefined ? o.actif : o.id === valeur))

  return (
    <div
      className="selecteur-segments"
      role="radiogroup"
      aria-label={etiquette || t('Espèce')}
      style={{ '--n': items.length, '--i': Math.max(index, 0) }}
      data-vide={index < 0 ? '' : undefined}
    >
      {items.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={i === index}
          className={`segment ${i === index ? 'actif' : ''}`}
          onClick={() => (o.onClick ? o.onClick() : onChange(o.id))}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
