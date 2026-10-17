/* Propose de corriger une faute de frappe probable dans un courriel
   (ex. nom@gmial.com). Ce n'est qu'une suggestion : l'adresse tapée
   reste acceptée telle quelle.
   surFond : 'violet' pour les pages de connexion, sinon fond clair. */
export default function SuggestionCourriel({ id, suggestion, avant, onCorriger, surFond = 'clair' }) {
  if (!suggestion) return null
  const violet = surFond === 'violet'
  return (
    <p
      id={id}
      aria-live="polite"
      style={{
        margin: violet ? '-4px 8px 0' : '6px 0 0',
        textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45,
        color: violet ? '#FFFFFF' : 'var(--text-secondary)',
      }}
    >
      Voulez-vous dire <span style={{ textDecoration: 'underline' }}>{suggestion}</span>
      {avant && <> au lieu de {avant}</>} ?{' '}
      <button
        type="button"
        onClick={onCorriger}
        style={{
          background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 700,
          textDecoration: 'underline', cursor: 'pointer', color: violet ? '#213058' : 'var(--primary)',
        }}
      >
        Corriger
      </button>
    </p>
  )
}
