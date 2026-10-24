import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminAccueil() {
  const navigate = useNavigate()
  // Nombre de signalements à traiter ; sans réponse, la tuile s'affiche sans compteur.
  const [aTraiter, setATraiter] = useState(0)

  useEffect(() => {
    let actif = true
    supabase.functions.invoke('signalements', { body: { action: 'compter' } }).then(({ data }) => {
      if (actif && data?.aTraiter) setATraiter(data.aTraiter)
    })
    return () => { actif = false }
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-liste" style={{ padding: '0 1rem' }}>
        <button className="admin-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/signalements')}>
          <span className="admin-item-nom"><i className="ti ti-flag" style={{ marginRight: 8 }}></i>Signalements</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {aTraiter > 0 && (
              <span aria-label={`${aTraiter} à traiter`} style={{ minWidth: 22, height: 22, padding: '0 7px', borderRadius: 999, background: 'var(--accent-red)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {aTraiter}
              </span>
            )}
            <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
          </span>
        </button>
        <button className="admin-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/medicaments')}>
          <span className="admin-item-nom"><i className="ti ti-pill" style={{ marginRight: 8 }}></i>Médicaments</span>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
        </button>
        <button className="admin-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/labo')}>
          <span className="admin-item-nom"><i className="ti ti-flask" style={{ marginRight: 8 }}></i>Protocoles labo</span>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
        </button>
        <button className="admin-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/comptes')}>
          <span className="admin-item-nom"><i className="ti ti-users" style={{ marginRight: 8 }}></i>Comptes</span>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-hint)' }}></i>
        </button>
      </div>
    </div>
  )
}
