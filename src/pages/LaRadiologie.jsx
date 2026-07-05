import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'

const CATEGORIE_ID = 'af3ffd7b-ac2f-4e43-adf0-7108bf79099c'

const REFERENCES = [
  { id: 'notions-base', label: 'Notions de base : mA, kVp et distance', icone: 'ti-radioactive', route: '/labo/radiologie/notions-base', pro: true },
  { id: 'charte', label: 'Charte radiographique personnalisée', icone: 'ti-notebook', route: '/labo/radiologie/charte', pro: true },
]

export default function LaRadiologie() {
  const navigate = useNavigate()
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro, estEquipe, roleEquipe } = useProfil()
  const peutModifier = !estEquipe || roleEquipe === 'admin' || roleEquipe === 'proprietaire'

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
    const protosBaseIds = (protosUser || []).map(p => p.protocole_base_id).filter(Boolean)
    setProtocoles([
      ...(protos || []).filter(p => !protosBaseIds.includes(p.id)).map(p => ({ ...p, type: 'base' })),
      ...(protosUser || []).map(p => ({ ...p, type: 'user' })),
    ])
    setLoading(false)
  }

  return (
    <div className="drogues-page">

      <div className="labo-section-titre">Protocoles</div>
      <div className="labo-protocoles-grid">
        {loading ? <div className="admin-loading">Chargement...</div>
          : protocoles.length === 0 ? <p className="admin-vide">Aucun protocole dans cette catégorie.</p>
          : protocoles.map(p => (
            <button key={p.id} className="labo-protocole-btn" onClick={() => navigate(`/labo/protocole/${p.id}?type=${p.type}`)}>
              {p.titre}
            </button>
          ))}
      </div>

      {peutModifier && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="labo-btn-ajouter" style={{ width: '80%' }} onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${CATEGORIE_ID}`) : setShowProMsg(true)}>
            <i className="ti ti-plus"></i> Ajouter un protocole
          </button>
        </div>
      )}

      <div className="labo-section-titre" style={{ marginTop: 8 }}>Références & Interprétation</div>
      <div className="labo-protocoles-grid">
        {REFERENCES.map(r => (
          <button
            key={r.id}
            className="labo-protocole-btn"
            onClick={() => navigate(r.route)}
            style={{ position: 'relative' }}
          >
            {r.pro && <BadgePro />}
            <i className={`ti ${r.icone}`} style={{ fontSize: 20, marginBottom: 6, display: 'block' }}></i>
            {r.label}
          </button>
        ))}
      </div>

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
                Passe au forfait Pro dans ton profil pour accéder à cette fonctionnalité.
              </p>
            </div>
            <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>Compris</button>
          </div>
        </div>
      )}
    </div>
  )
}
