import { useNavigate } from 'react-router-dom'
import { t, enAnglais } from '../lib/i18n'

export default function PopupPro({ onClose }) {
  const navigate = useNavigate()

  function allerAuProfil() {
    onClose()
    navigate('/abonnement')
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <span>{t('Fonctionnalité Pro')}</span>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
            {enAnglais
              ? <>This feature is available <br /> with the <strong>Pro</strong> plan.</>
              : <>Cette fonctionnalité est réservée <br /> au forfait <strong>Pro</strong>.</>}
          </p>
        </div>
        <button className="labo-btn-primary" style={{ width: '100%' }} onClick={allerAuProfil}>
          {t('Abonnez-vous au forfait Pro maintenant!')}
        </button>
      </div>
    </div>
  )
}
