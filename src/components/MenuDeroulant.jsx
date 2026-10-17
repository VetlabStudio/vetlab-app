import { useEffect, useRef, useState } from 'react'

/* Menu déroulant aux coins arrondis, au même style que la liste de
   recherche des médicaments. Il remplace le <select> natif, dont la
   liste est dessinée par le téléphone et ne suit pas le style de l'app.
   options : [{ valeur, libelle }]
   icone : élément affiché à gauche dans le champ (facultatif). */
export default function MenuDeroulant({ valeur, options, onChange, icone, etiquette }) {
  const [ouvert, setOuvert] = useState(false)
  const zone = useRef(null)
  const declencheur = useRef(null)
  const choisie = options.find(o => o.valeur === valeur) || options[0]

  // Un appui ailleurs ou la touche Échap ferment la liste.
  useEffect(() => {
    if (!ouvert) return
    const dehors = (e) => { if (!zone.current?.contains(e.target)) setOuvert(false) }
    const touche = (e) => {
      if (e.key !== 'Escape') return
      setOuvert(false)
      declencheur.current?.focus()
    }
    document.addEventListener('pointerdown', dehors)
    document.addEventListener('keydown', touche)
    return () => {
      document.removeEventListener('pointerdown', dehors)
      document.removeEventListener('keydown', touche)
    }
  }, [ouvert])

  function choisir(nouvelle) {
    onChange(nouvelle)
    setOuvert(false)
    declencheur.current?.focus()
  }

  return (
    <div ref={zone} style={{ position: 'relative' }}>
      <button
        ref={declencheur}
        type="button"
        className="champ-input"
        aria-expanded={ouvert}
        aria-label={etiquette ? `${etiquette} : ${choisie?.libelle}` : undefined}
        onClick={() => setOuvert(o => !o)}
        style={{ font: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left' }}
      >
        {icone}
        <span style={{ flex: 1, minWidth: 0, padding: '8px 0', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {choisie?.libelle}
        </span>
        <i className={`ti ${ouvert ? 'ti-chevron-up' : 'ti-chevron-down'}`} aria-hidden="true" style={{ color: 'var(--text-hint)', fontSize: 16, flexShrink: 0 }} />
      </button>

      {ouvert && (
        <div className="recherche-dropdown">
          {options.map(o => {
            const actif = o.valeur === valeur
            return (
              <div
                key={o.valeur}
                className="recherche-item"
                role="button"
                tabIndex={0}
                aria-current={actif ? 'true' : undefined}
                onClick={() => choisir(o.valeur)}
                onKeyDown={e => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  choisir(o.valeur)
                }}
              >
                <span style={{ color: actif ? 'var(--primary)' : 'var(--text-primary)', fontWeight: actif ? 700 : 400 }}>
                  {o.libelle}
                </span>
                {actif && <i className="ti ti-check" aria-hidden="true" style={{ color: 'var(--primary)', fontSize: 16 }} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
