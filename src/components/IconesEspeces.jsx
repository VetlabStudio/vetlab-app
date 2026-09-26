export const ESPECES_CONFIG = {
  chien:      { icone: '/icone-chien.svg', label: 'Chien' },
  chat:       { icone: '/icone-chat.svg',  label: 'Chat'  },
  cheval:     { icone: '/icone-cheval.svg', label: 'Cheval' },
  vache:      { icone: '/icone-vache.svg', label: 'Vache' },
  mouton:     { icone: '/icone-mouton.svg', label: 'Mouton' },
  lama:       { icone: '/icone-lama.svg', label: 'Lama' },
  chevre:     { icone: '/icone-chevre.svg', label: 'Chèvre' },
  cochon:     { icone: '/icone-cochon.svg', label: 'Cochon' },
  lapin:      { icone: '/icone-lapin.svg', label: 'Lapin' },
  furet:      { icone: '/furet.svg', label: 'Furet', ratio: 38 / 30 },
  oiseau:     { icone: '/icone-oiseau.svg', label: 'Oiseau' },
  serpent:    { icone: '/icone-serpent.svg', label: 'Serpent' },
  lezard:     { icone: '/icone-lezard.svg', label: 'Lézard' },
  tortue:     { icone: '/icone-tortue.svg', label: 'Tortue' },
  poisson:    { icone: '/icone-poisson.svg', label: 'Poisson' },
  amphibien:  { icone: '/icone-grenouille.svg', label: 'Amphibien' },
  rongeur:    { icone: '/icone-rongeurs.svg', label: 'Rongeur' },
  chinchilla: { icone: '/icone-chinchilla.svg', label: 'Chinchilla' },
  cobaye:     { icone: '/icone-cobaye.svg', label: 'Cochon d\'Inde' },
  herisson:   { icone: '/icone-herisson.svg', label: 'Hérisson' },
}

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