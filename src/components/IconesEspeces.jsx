import { ESPECES_CONFIG } from '../data/especes'

export default function IconesEspeces({ especes = [], taille = 28 }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {especes?.map(esp => {
        const config = ESPECES_CONFIG[esp]
        if (!config) return null
if (config.icone) {
  const largeur = taille * (config.ratio || 1)
  const hauteur = taille
  return (
    <img
      key={esp}
      src={config.icone}
      alt={config.label}
      style={{ width: largeur, height: hauteur, objectFit: 'contain' }}
    />
  )
}
return (
  <span
    key={esp}
    title={config.label}
    style={{
      width: taille,
      height: taille,
      fontSize: taille * 0.45,
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-hint)',
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {config.label.slice(0, 2)}
  </span>
)
      })}
    </div>
  )
}