import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'
import BadgePro from '../components/BadgePro'
import PopupPro from '../components/PopupPro'

const CATEGORIE_ID = '2e0222f2-5733-4d01-bc99-8c380bec5abe'

const REFERENCES = [
  { id: 'oeufs', label: 'Œufs de parasites', icone: 'ti-egg', route: '/labo/parasitologie/oeufs', pro: true },
  { id: 'hotes', label: 'Hôtes & espèces affectées', icone: 'ti-paw', route: '/labo/parasitologie/hotes', pro: true },
]

export default function LaboParasitologie() {
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
          {!estPro ? <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> : <i className="ti ti-plus"></i>} Ajouter un protocole
        </button>
      </div>

      {/* ─── RÉFÉRENCES ─────────────────────── */}
      <div className="labo-section-titre" style={{ marginTop: 8 }}>Références & Identification</div>

      <div className="labo-protocoles-grid">
        {REFERENCES.map(r => (
          <button
  key={r.id}
  className="labo-protocole-btn"
  onClick={() => navigate(r.route)}
  style={{ position: 'relative' }}
>
            <i className={`ti ${r.icone}`} style={{ fontSize: 20, marginBottom: 6, display: 'block' }}></i>
            {r.label}
            {r.pro && <BadgePro />}
          </button>
        ))}
      </div>

      {/* ─── MODAL PRO ──────────────────────── */}
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}

    </div>
  )
}
