import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useContext } from 'react'
import { TitreContext } from '../App'
import { useProfil } from '../context/ProfilContext'

export default function LaboProtocoles() {
  const navigate = useNavigate()
  const { categorieId } = useParams()
  const [categorie, setCategorie] = useState(null)
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const { setTitreCustom } = useContext(TitreContext)
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro } = useProfil()
  console.log('estPro labo:', estPro)

  useEffect(() => {
  chargerDonnees()
  return () => setTitreCustom('')
  }, [categorieId])

  async function chargerDonnees() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: cat }, { data: protos }, { data: protosUser }] = await Promise.all([
      supabase.from('labo_categories').select('*').eq('id', categorieId).single(),
      supabase.from('labo_protocoles').select('*').eq('categorie_id', categorieId).order('ordre'),
      supabase.from('labo_protocoles_user').select('*').eq('user_id', user.id).eq('categorie_id', categorieId).order('ordre'),
    ])

    setCategorie(cat)
    if (cat?.nom) setTitreCustom(cat.nom)
    setProtocoles([
      ...(protos || []).map(p => ({ ...p, type: 'base' })),
      ...(protosUser || []).map(p => ({ ...p, type: 'user' })),
    ])
    setLoading(false)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="drogues-page">
      <div className="labo-section-titre">Procédures d'analyse</div>

      <div className="labo-protocoles-grid">
        {protocoles.map(p => (
          <button
            key={p.id}
            className="labo-protocole-btn"
            onClick={() => navigate(`/labo/protocole/${p.id}?type=${p.type}`)}
          >
            {p.titre}
          </button>
        ))}
        {protocoles.length === 0 && (
          <p className="admin-vide">Aucun protocole dans cette catégorie.</p>
        )}
      </div>

      {/* Bouton ajouter */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <button
    className="labo-btn-ajouter"
    style={{ width: '100%' }}
    onClick={() => estPro ? navigate(`/labo/nouveau?categorie=${categorieId}`) : setShowProMsg(true)}
  >
    {!estPro
      ? <><i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> Ajouter un protocole</>
      : <><i className="ti ti-plus"></i> Ajouter un protocole</>
    }
  </button>
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
      <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>
        Compris
      </button>
    </div>
  </div>
)}
    </div>
    
  )
  
}
