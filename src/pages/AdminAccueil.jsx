import { useNavigate } from 'react-router-dom'

export default function AdminAccueil() {
  const navigate = useNavigate()

  return (
    <div className="admin-page">
      <div className="admin-liste" style={{ padding: '0 1rem' }}>
        <button className="admin-item" style={{ cursor: 'pointer', width: '100%' }} onClick={() => navigate('/admin/medicaments')}>
          <span className="admin-item-nom"><i className="ti ti-pill" style={{ marginRight: 8 }}></i>Médicaments</span>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
        </button>
        <button className="admin-item" style={{ cursor: 'pointer', width: '100%' }} onClick={() => navigate('/admin/labo')}>
          <span className="admin-item-nom"><i className="ti ti-flask" style={{ marginRight: 8 }}></i>Protocoles labo</span>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
        </button>
      </div>
    </div>
  )
}