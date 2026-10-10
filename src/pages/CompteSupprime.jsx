import { Link, useLocation } from 'react-router-dom'

export default function CompteSupprime() {
  const { state } = useLocation()
  const abonnementsAnnules = state?.abonnementsAnnules || 0

  return (
    <div className="auth2-page">
      <div className="auth2-contenu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-circle-check" style={{ fontSize: 64, color: '#213058', marginBottom: 20 }}></i>
        <p className="auth2-section-titre" style={{ textAlign: 'center', fontSize: 22 }}>Votre compte a été supprimé</p>
        <p style={{ fontSize: 15, color: '#213058', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
          Vos données personnelles ont été effacées.
          {abonnementsAnnules > 0 && ' Votre abonnement a été annulé et ne sera plus facturé.'}
          {' '}Merci d'avoir utilisé ADJUVET.
        </p>
        <Link to="/connexion" replace className="auth2-btn" style={{ display: 'block', textDecoration: 'none' }}>
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
