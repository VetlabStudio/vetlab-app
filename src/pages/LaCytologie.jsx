import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'

const CATEGORIE_ID = '173fb58a-988c-4202-8b14-bfcd15c4a16f'

const REFERENCES = [
  { id: 'prelevement', label: 'Guide de prélèvement', icone: 'ti-needle', route: '/labo/cytologie/prelevement' },
  { id: 'cellules', label: 'Types cellulaires', icone: 'ti-microscope', route: '/labo/cytologie/cellules' },
]

export default function LaCytologie() {
  const navigate = useNavigate()
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro } = useProfil()

  useEffect(() => {
    chargerProtocoles()
  }, [])

  async function chargerProtocoles() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: protos }, { data: protosUser }] = await Promise.all([
      supabase.from('labo_protocoles').select('*').eq('categorie_id', CATEGORIE_ID).order('ordre'),
      supabase.from('labo_protocoles_user').select('*').eq('user_id', user.id).eq('categorie_id', CATEGORIE_ID).order('ordre'),
    ])

    setProtocoles([
      ...(protos || []).map(p => ({ ...p, type: 'base' })),
      ...(protosUser || []).map(p => ({ ...p, type: 'user' })),
    ])
    setLoading(false)
  }

  return (
    <div className="drogues-page">

      {/* ─── PROTOCOLES ─────────────────────── */}
      <div className="labo-section-titre">Procédures d'analyse</div>

      <div className="labo-protocoles-grid">
        {loading ? (
          <div className="admin-loading">Chargement...</div>
        ) : protocoles.length === 0 ? (
          <p className="admin-vide">Aucun protocole dans cette catégorie.</p>
        ) : (
          protocoles.map(p => (
            <button
              key={p.id}
              className="labo-protocole-btn"
              onClick={() => navigate(`/labo/protocole/${p.id}?type=${p.type}`)}
            >
              {p.titre}
            </button>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="labo-btn-ajouter" style={{ width: '80%' }} onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${CATEGORIE_ID}`) : setShowProMsg(true)}>
          <i className="ti ti-plus"></i> Ajouter un protocole
        </button>
      </div>

      {/* ─── RÉFÉRENCES ─────────────────────── */}
      <div className="labo-section-titre" style={{ marginTop: 8 }}>Références & Interprétation</div>

      <div className="labo-protocoles-grid">
        {REFERENCES.map(r => (
          <button
  key={r.id}
  className="labo-protocole-btn"
  onClick={() => navigate(r.route)}
>
  <i className={`ti ${r.icone}`} style={{ fontSize: 20, marginBottom: 6, display: 'block' }}></i>
  {r.label}
</button>
        ))}
      </div>

      {/* ─── MODAL PRO ──────────────────────── */}
      {showProMsg && (
        <div className="popup-overlay" onClick={() => setShowProMsg(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Fonctionnalité Pro</span>
              <button className="popup-close" onClick={() => setShowProMsg(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                L'ajout de protocoles personnalisés est réservé au forfait <strong>Pro</strong>.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
                Le forfait Pro sera disponible prochainement. Reste à l'affût !
              </p>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>
              Compris
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
