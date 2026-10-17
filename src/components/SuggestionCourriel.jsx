/* Propose de corriger une faute de frappe probable dans un courriel
   (ex. nom@gmial.com). Ce n'est qu'une suggestion : l'adresse tapée
   reste acceptée telle quelle.
   bouton : texte du bouton d'envoi, rappelé quand l'envoi a été retenu.
   surFond : 'violet' pour les pages de connexion, sinon fond clair. */
export default function SuggestionCourriel({ id, suggestion, avant, onCorriger, avertie, bouton, surFond = 'clair' }) {
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
      {avertie && bouton && (
        <span style={{ display: 'block', fontWeight: 400, marginTop: 2 }}>
          Pour garder l'adresse telle quelle, appuyez de nouveau sur « {bouton} ».
        </span>
      )}
    </p>
  )
}
