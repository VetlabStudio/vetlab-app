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
  const { estPro, estEquipe, teamId, roleEquipe } = useProfil()

  useEffect(() => {
    chargerDonnees()
    return () => setTitreCustom('')
  }, [categorieId])

  async function chargerDonnees() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: cat }, { data: protos }, { data: protosPersonnel }] = await Promise.all([
      supabase.from('labo_categories').select('*').eq('id', categorieId).single(),
      supabase.from('labo_protocoles').select('*').eq('categorie_id', categorieId).order('ordre'),
      // Protocoles personnels : créés par cet utilisateur, sans association à une équipe
      supabase.from('labo_protocoles_user').select('*').eq('user_id', user.id).is('equipe_id', null).eq('categorie_id', categorieId).order('ordre'),
    ])

    // Protocoles d'équipe : partagés avec toute l'équipe (visibles par tous les membres)
    let protosEquipe = []
    if (estEquipe && teamId) {
      const { data } = await supabase
        .from('labo_protocoles_user')
        .select('*')
        .eq('equipe_id', teamId)
        .eq('categorie_id', categorieId)
        .order('ordre')
      protosEquipe = data || []
    }

    setCategorie(cat)
    if (cat?.nom) setTitreCustom(cat.nom)
    setProtocoles([
      ...(protos || []).map(p => ({ ...p, type: 'base' })),
      ...(protosPersonnel || []).map(p => ({ ...p, type: 'user', badge: 'personnel' })),
      ...protosEquipe.map(p => ({ ...p, type: 'user', badge: 'equipe' })),
    ])
    setLoading(false)
  }

  // Seuls les admins/propriétaires peuvent créer des protocoles en mode équipe
  const peutAjouter = estEquipe
    ? (roleEquipe === 'admin' || roleEquipe === 'proprietaire')
    : estPro

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
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
          >
            <span style={{ textAlign: 'left' }}>{p.titre}</span>
            {p.badge === 'equipe' && (
              <span style={{
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                color: 'var(--primary)', background: 'rgba(37,77,86,0.1)',
                padding: '2px 8px', borderRadius: 999,
              }}>Équipe</span>
            )}
            {p.badge === 'personnel' && (
              <span style={{
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                color: 'var(--text-hint)', background: 'var(--bg-secondary)',
                padding: '2px 8px', borderRadius: 999,
              }}>Personnel</span>
            )}
          </button>
        ))}
        {protocoles.length === 0 && (
          <p className="admin-vide">Aucun protocole dans cette catégorie.</p>
        )}
      </div>

      {/* Bouton ajouter — visible seulement pour Pro solo ou admin/proprio équipe */}
      {peutAjouter && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="labo-btn-ajouter"
            style={{ width: '100%' }}
            onClick={() => navigate(`/labo/nouveau?categorie=${categorieId}`)}
          >
            <i className="ti ti-plus"></i> Ajouter un protocole
          </button>
        </div>
      )}

      {!peutAjouter && !estEquipe && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="labo-btn-ajouter"
            style={{ width: '100%' }}
            onClick={() => setShowProMsg(true)}
          >
            <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> Ajouter un protocole
          </button>
        </div>
      )}

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
                Passez au forfait Pro dans votre profil pour accéder à cette fonctionnalité.
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
