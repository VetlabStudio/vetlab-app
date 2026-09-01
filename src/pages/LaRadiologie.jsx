import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

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

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="labo-btn-ajouter" style={{ width: '80%' }} onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${CATEGORIE_ID}`) : setShowProMsg(true)}>
          {!estPro ? <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> : <i className="ti ti-plus"></i>} Ajouter un protocole
        </button>
      </div>

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

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
