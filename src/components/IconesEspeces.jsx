const ESPECES_CONFIG = {
  chien:      { icone: '/icone-chien.svg', label: 'Chien' },
  chat:       { icone: '/icone-chat.svg',  label: 'Chat'  },
  cheval:     { icone: '/icone-cheval.png', label: 'Cheval' },
  vache:      { icone: '/icone-vache.png', label: 'Vache' },
  mouton:     { icone: '/icone-mouton.png', label: 'Mouton' },
  lama:       { icone: '/icone-lama.png', label: 'Lama' },
  lapin:      { icone: null, label: 'Lapin' },
  furet:      { icone: null, label: 'Furet' },
  oiseau:     { icone: '/icone-oiseau.png', label: 'Oiseau' },
  serpent:    { icone: '/icone-serpent.png', label: 'Serpent' },
  lezard:     { icone: '/icone-lezard.png', label: 'Lézard' },
  tortue:     { icone: null, label: 'Tortue' },
  poisson:    { icone: null, label: 'Poisson' },
  amphibien:  { icone: '/icone-grenouille.png', label: 'Amphibien' },
  rongeur:    { icone: '/icone-rongeurs.png', label: 'Rongeur' },
  chinchilla: { icone: null, label: 'Chinchilla' },
  cobaye:     { icone: '/icone-cobaye.png', label: 'Cobaye' },
  herisson:   { icone: null, label: 'Hérisson' },
}

export default function IconesEspeces({ especes = [], taille = 28 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {especes?.map(esp => {
        const config = ESPECES_CONFIG[esp]
        if (!config) return null
if (config.icone) {
  return (
    <img
      key={esp}
      src={config.icone}
      alt={config.label}
      style={{ width: taille, height: taille, objectFit: 'contain' }}
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