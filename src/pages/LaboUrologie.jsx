import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

const CATEGORIE_ID = 'aeac9309-185f-4f2c-81b2-dfed3d4e55aa'

const REFERENCES = [
  { id: 'valeurs', label: 'Valeurs de référence', icone: 'ti-clipboard-list', route: '/labo/urologie/valeurs', pro: true },
  { id: 'sediments', label: 'Sédiments urinaires', icone: 'ti-microscope', route: '/labo/urologie/sediments', pro: true },
]

export default function LaboUrologie() {
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
        <button className="labo-btn-ajouter" style={{ width: '80%' }}onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${CATEGORIE_ID}`) : setShowProMsg(true)}>
          {!estPro ? <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> : <i className="ti ti-plus"></i>} Ajouter un protocole
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
