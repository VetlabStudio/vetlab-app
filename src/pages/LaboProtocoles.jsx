import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useContext } from 'react'
import { TitreContext } from '../App'

export default function LaboProtocoles() {
  const navigate = useNavigate()
  const { categorieId } = useParams()
  const [categorie, setCategorie] = useState(null)
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const { setTitreCustom } = useContext(TitreContext)

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
    <div className="page-calculateurs">
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
      <button
        className="labo-btn-ajouter"
        onClick={() => navigate(`/labo/nouveau?categorie=${categorieId}`)}
      >
        <i className="ti ti-plus"></i> Ajouter un protocole
      </button>
    </div>
  )
}
