import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

const CATEGORIE_ID = '173fb58a-988c-4202-8b14-bfcd15c4a16f'

const REFERENCES = [
  { id: 'prelevement', label: 'Guide de prélèvement', svg: '/lame-microscope.svg', route: '/labo/cytologie/prelevement', pro: true },
  { id: 'cellules', label: 'Types cellulaires', svg: '/icone-microscope.svg', route: '/labo/cytologie/cellules' },
]

const SVG_MASK_STYLE = (src) => ({
  display: 'inline-block',
  width: 22,
  height: 22,
  backgroundColor: '#2a3357',
  WebkitMaskImage: `url('${src}')`,
  maskImage: `url('${src}')`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  flexShrink: 0,
})

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
              <span style={{ flex: 1 }}>{p.titre}</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 14, color: 'var(--text-hint)', flexShrink: 0 }}></i>
            </button>
          ))
        )}
      </div>

      <button className="labo-btn-ajouter" onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${CATEGORIE_ID}`) : setShowProMsg(true)}>
        {!estPro ? <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> : <i className="ti ti-plus"></i>} Ajouter un protocole
      </button>

      {/* ─── RÉFÉRENCES ─────────────────────── */}
      <div className="labo-section-titre" style={{ marginTop: 8 }}>Références & Interprétation</div>

      <div className="labo-protocoles-grid">
        {REFERENCES.map(r => (
          <button
            key={r.id}
            className="labo-protocole-btn"
            onClick={() => navigate(r.route)}
            style={{ position: 'relative' }}
          >
            <span style={SVG_MASK_STYLE(r.svg)}></span>
            <span style={{ flex: 1 }}>{r.label}</span>
            {(r.id === 'cellules' || r.pro) && <BadgePro />}
          </button>
        ))}
      </div>

      {/* ─── MODAL PRO ──────────────────────── */}
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}

    </div>
  )
}
