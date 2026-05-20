const ESPECES_CONFIG = {
  chien: { icone: '/icone-chien.svg', label: 'Chien' },
  chat:  { icone: '/icone-chat.svg',  label: 'Chat'  },
}

export default function IconesEspeces({ especes = [], taille = 28 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {especes?.map(esp => {
        const config = ESPECES_CONFIG[esp]
        if (!config) return null
        return (
          <img
            key={esp}
            src={config.icone}
            alt={config.label}
            style={{ width: taille, height: taille, objectFit: 'contain' }}
          />
        )
      })}
    </div>
  )
}