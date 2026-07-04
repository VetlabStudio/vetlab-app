import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

export default function LaboNouveauProtocole() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { estEquipe, roleEquipe } = useProfil()
  const peutModifier = !estEquipe || roleEquipe === 'admin' || roleEquipe === 'proprietaire'

  useEffect(() => {
    if (!peutModifier) navigate(-1)
  }, [peutModifier])
  const categorieId = searchParams.get('categorie')

  const [titre, setTitre] = useState('')
  const [materiel, setMateriel] = useState([''])
  const [etapes, setEtapes] = useState([
    { id: Date.now(), titre: 'Étape 1', description: '' },
  ])
  const [sauvegarde, setSauvegarde] = useState(false)

  // ─── MATÉRIEL ─────────────────────────────────
  function ajouterMateriel() {
    setMateriel(prev => [...prev, ''])
  }

  function modifierMateriel(index, valeur) {
    setMateriel(prev => prev.map((m, i) => i === index ? valeur : m))
  }

  function supprimerMateriel(index) {
    setMateriel(prev => prev.filter((_, i) => i !== index))
  }

  // ─── ÉTAPES ───────────────────────────────────
  function ajouterEtape() {
    setEtapes(prev => [...prev, {
      id: Date.now(),
      titre: `Étape ${prev.length + 1}`,
      description: '',
    }])
  }

  function supprimerEtape(id) {
    setEtapes(prev => prev.filter(e => e.id !== id))
  }

  function modifierEtape(id, champ, valeur) {
    setEtapes(prev => prev.map(e => e.id === id ? { ...e, [champ]: valeur } : e))
  }

  // ─── SAUVEGARDER ──────────────────────────────
  async function sauvegarder() {
    if (!titre.trim()) return
    setSauvegarde(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: proto } = await supabase
        .from('labo_protocoles_user')
        .insert({
          user_id: user.id,
          categorie_id: categorieId,
          titre: titre.trim(),
          description: materiel.filter(m => m.trim()).join('\n'),
        })
        .select()
        .single()

      if (proto) {
        for (let i = 0; i < etapes.length; i++) {
          await supabase.from('labo_etapes_user_custom').insert({
            protocole_user_id: proto.id,
            ordre: i,
            titre: etapes[i].titre,
            description: etapes[i].description,
            visible: true,
          })
        }
        navigate(`/labo/protocole/${proto.id}?type=user`, { replace: true })
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
    } finally {
      setSauvegarde(false)
    }
  }

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── TITRE ──────────────────────────── */}
        <div className="champ">
          <label>Titre du protocole</label>
          <div className="champ-input">
            <input
              type="text"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder="Ex: Coprologie par flottation"
            />
          </div>
        </div>

        {/* ─── MATÉRIEL ───────────────────────── */}
<div className="champ">
  <label>Liste de matériel</label>
  <div className="labo-materiel-liste">
    {materiel.map((item, index) => (
      <div key={index} className="labo-materiel-item">
        <span className="labo-materiel-puce">•</span>
        <input
          type="text"
          className="labo-materiel-input"
          value={item}
          onChange={e => modifierMateriel(index, e.target.value)}
          placeholder={`Item ${index + 1}`}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); ajouterMateriel() }
          }}
        />
        {materiel.length > 1 && (
          <button className="labo-btn-supprimer" onClick={() => supprimerMateriel(index)}>
            <i className="ti ti-trash"></i>
          </button>
        )}
      </div>
    ))}
  </div>
  <button className="labo-btn-ajouter-etape" onClick={ajouterMateriel}>
    <i className="ti ti-plus"></i> Ajouter un item
  </button>
</div>

        {/* ─── ÉTAPES ─────────────────────────── */}
        <div className="labo-nouveau-etapes">
          {etapes.map((etape, index) => (
            <div key={etape.id} className="labo-nouveau-etape">

              {/* Header */}
              <div className="labo-nouveau-etape-header">
                <span className="labo-nouveau-etape-num">Étape {index + 1}</span>
                {etapes.length > 1 && (
                  <button className="labo-btn-supprimer" onClick={() => supprimerEtape(etape.id)}>
                    <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>

              {/* Titre étape */}
              <div className="champ" style={{ padding: '0 14px' }}>
                <label>Titre</label>
                <div className="champ-input">
                  <input
                    type="text"
                    value={etape.titre}
                    onChange={e => modifierEtape(etape.id, 'titre', e.target.value)}
                    placeholder="Titre de l'étape"
                  />
                </div>
              </div>

              {/* Description étape */}
              <div className="champ" style={{ padding: '0 14px 14px' }}>
                <label>Description</label>
                <textarea
                  className="labo-etape-desc-input"
                  value={etape.description}
                  onChange={e => modifierEtape(etape.id, 'description', e.target.value)}
                  placeholder="Description de l'étape..."
                  rows={3}
                  style={{ width: '100%', margin: 0 }}
                />
              </div>

            </div>
          ))}
        </div>

        {/* Bouton ajouter étape */}
        <button className="labo-btn-ajouter-etape" onClick={ajouterEtape}>
          <i className="ti ti-plus"></i> Ajouter une étape
        </button>

        {/* Bouton sauvegarder */}
        <button
          className="labo-btn-primary"
          onClick={sauvegarder}
          disabled={sauvegarde || !titre.trim()}
          style={{ width: '100%', padding: '14px' }}
        >
          {sauvegarde ? 'Sauvegarde...' : 'Créer le protocole'}
        </button>

      </div>
    </div>
  )
}
