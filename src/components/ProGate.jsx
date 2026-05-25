import { useProfil } from '../context/ProfilContext'

export default function ProGate({ children }) {
  const { estPro, chargement } = useProfil()

  if (chargement) return <div className="admin-loading">Chargement...</div>

  if (!estPro) {
    return (
      <div className="drogues-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <i className="ti ti-lock" style={{ fontSize: 56, color: 'var(--accent-gold)', marginBottom: 16, display: 'block' }}></i>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            Contenu Pro
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
            Cette section est réservée au forfait <strong>Pro</strong>.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
            Le forfait Pro sera disponible prochainement. Reste à l'affût !
          </p>
        </div>
      </div>
    )
  }

  return children
}
