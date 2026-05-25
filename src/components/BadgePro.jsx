import { useProfil } from '../context/ProfilContext'

export default function BadgePro() {
  const { estPro } = useProfil()
  if (estPro) return null

  return (
  <span style={{
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'var(--accent-gold)',
    flexShrink: 0,
  }}>
      <i className="ti ti-lock" style={{ fontSize: 16, color: 'white' }}></i>
    </span>
  )
}
