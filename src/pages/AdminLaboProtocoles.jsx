import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminLaboProtocoles() {
  const [categories, setCategories] = useState([])
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [categorieSelectee, setCategorieSelectee] = useState(null)
  const [showFormProto, setShowFormProto] = useState(false)
  const [protoEnEdition, setProtoEnEdition] = useState(null)
  const [titreProto, setTitreProto] = useState('')
  const [etapes, setEtapes] = useState([])
  const [materiel, setMateriel] = useState([''])
  const [showReorganiser, setShowReorganiser] = useState(false)

  useEffect(() => {
    chargerCategories()
  }, [])

  useEffect(() => {
    if (categorieSelectee) chargerProtocoles()
  }, [categorieSelectee])

  async function chargerCategories() {
    const { data } = await supabase.from('labo_categories').select('*').order('ordre')
    setCategories(data || [])
    if (data?.length > 0) setCategorieSelectee(data[0])
    setLoading(false)
  }

  async function chargerProtocoles() {
    const { data } = await supabase
      .from('labo_protocoles')
      .select('*')
      .eq('categorie_id', categorieSelectee.id)
      .order('ordre')
    setProtocoles(data || [])
  }

  async function chargerEtapes(protocoleId) {
    const { data } = await supabase
      .from('labo_etapes')
      .select('*')
      .eq('protocole_id', protocoleId)
      .order('ordre')
    setEtapes(data || [])
  }

  function ouvrirFormulaire(proto = null) {
    setProtoEnEdition(proto)
    setTitreProto(proto?.titre || '')
    setMateriel(proto?.description ? proto.description.split('\n').filter(m => m.trim()) : [''])
    if (proto) {
      chargerEtapes(proto.id)
    } else {
      setEtapes([{ id: `new-${Date.now()}`, titre: 'Étape 1', description: '', visible: true, ordre: 0 }])
    }
    setShowFormProto(true)
  }

  async function sauvegarder() {
    if (!titreProto.trim()) return

    let protocoleId = protoEnEdition?.id

    if (protoEnEdition) {
      await supabase.from('labo_protocoles').update({
        titre: titreProto.trim(),
        description: materiel.filter(m => m.trim()).join('\n'),
      }).eq('id', protocoleId)
    } else {
      const { data } = await supabase.from('labo_protocoles').insert({
        categorie_id: categorieSelectee.id,
        titre: titreProto.trim(),
        description: materiel.filter(m => m.trim()).join('\n'),
        ordre: protocoles.length,
      }).select().single()
      protocoleId = data?.id
    }

    if (protocoleId) {
      for (const etape of etapes) {
        if (etape.id?.toString().startsWith('new-')) {
          await supabase.from('labo_etapes').insert({
            protocole_id: protocoleId,
            ordre: etape.ordre,
            titre: etape.titre,
            description: etape.description,
            visible: true,
          })
        } else {
          await supabase.from('labo_etapes').update({
            ordre: etape.ordre,
            titre: etape.titre,
            description: etape.description,
            visible: etape.visible,
          }).eq('id', etape.id)
        }
      }
    }

    setShowFormProto(false)
    chargerProtocoles()
  }

  async function supprimerProtocole(id) {
    if (!confirm('Supprimer ce protocole et toutes ses étapes ?')) return
    await supabase.from('labo_etapes').delete().eq('protocole_id', id)
    await supabase.from('labo_protocoles').delete().eq('id', id)
    chargerProtocoles()
  }

  async function supprimerEtape(etapeId) {
    if (!etapeId.toString().startsWith('new-')) {
      await supabase.from('labo_etapes').delete().eq('id', etapeId)
    }
    setEtapes(prev => prev.filter(e => e.id !== etapeId))
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  if (showFormProto) {
    return (
      <div className="labo-detail-page">

        <div className="labo-actions">
          <button className="labo-btn-secondary" onClick={() => setShowFormProto(false)}>
            Annuler
          </button>
          {etapes.length > 1 && (
            <button className="labo-btn-reorganiser" onClick={() => setShowReorganiser(true)}>
              Réorganiser
            </button>
          )}
          <button className="labo-btn-primary" onClick={sauvegarder} disabled={!titreProto.trim()}>
            Enregistrer
          </button>
        </div>

        {/* Titre */}
        <div className="champ">
          <label>Titre</label>
          <div className="champ-input">
            <input
              type="text"
              value={titreProto}
              onChange={e => setTitreProto(e.target.value)}
              placeholder="Titre du protocole"
            />
          </div>
        </div>

        {/* Matériel */}
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
                  onChange={e => setMateriel(prev => prev.map((m, i) => i === index ? e.target.value : m))}
                  placeholder={`Item ${index + 1}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); setMateriel(prev => [...prev, '']) }
                  }}
                />
                {materiel.length > 1 && (
                  <button className="labo-btn-supprimer" onClick={() => setMateriel(prev => prev.filter((_, i) => i !== index))}>
                    <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="labo-btn-ajouter-etape" onClick={() => setMateriel(prev => [...prev, ''])}>
            <i className="ti ti-plus"></i> Ajouter un item
          </button>
        </div>

        {/* Étapes */}
        <label style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Étapes</label>
        <div className="labo-nouveau-etapes">
          {etapes.map((etape, index) => (
            <div key={etape.id} className={`labo-nouveau-etape ${etape.visible === false ? 'masquee' : ''}`}>
              <div className="labo-nouveau-etape-header">
                <span className="labo-nouveau-etape-num">Étape {index + 1}</span>
                {etapes.length > 1 && (
                  <button className="labo-btn-supprimer" onClick={() => supprimerEtape(etape.id)}>
                    <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>

              <div className="champ" style={{ padding: '0 14px' }}>
                <label>Titre</label>
                <div className="champ-input">
                  <input
                    type="text"
                    value={etape.titre}
                    onChange={e => setEtapes(prev => prev.map(et => et.id === etape.id ? { ...et, titre: e.target.value } : et))}
                    placeholder="Titre de l'étape"
                  />
                </div>
              </div>

              <div className="champ" style={{ padding: '0 14px 14px' }}>
                <label>Description</label>
                <textarea
                  className="labo-etape-desc-input"
                  value={etape.description || ''}
                  onChange={e => setEtapes(prev => prev.map(et => et.id === etape.id ? { ...et, description: e.target.value } : et))}
                  placeholder="Description..."
                  rows={3}
                  style={{ width: '100%', margin: 0 }}
                />
              </div>

              <div className="labo-etape-edit-actions">
                <label className="labo-etape-visible">
                  <input
                    type="checkbox"
                    checked={etape.visible !== false}
                    onChange={e => setEtapes(prev => prev.map(et =>
                      et.id === etape.id ? { ...et, visible: e.target.checked } : et
                    ))}
                  />
                  Visible
                </label>
              </div>
            </div>
          ))}
        </div>

        <button className="labo-btn-ajouter-etape" onClick={() => setEtapes(prev => [...prev, {
          id: `new-${Date.now()}`,
          titre: `Étape ${prev.length + 1}`,
          description: '',
          visible: true,
          ordre: prev.length,
        }])}>
          <i className="ti ti-plus"></i> Ajouter une étape
        </button>

        <div className="labo-actions">
          <button className="labo-btn-secondary" onClick={() => setShowFormProto(false)}>
            Annuler
          </button>
          <button className="labo-btn-primary" onClick={sauvegarder} disabled={!titreProto.trim()}>
            Enregistrer
          </button>
        </div>

        {showReorganiser && (
          <div className="popup-overlay">
            <div className="popup-card">
              <div className="popup-header">
                <span>Réorganiser les étapes</span>
                <button className="popup-close" onClick={() => setShowReorganiser(false)}>✕</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-hint)', marginBottom: 12 }}>
                Glisser pour réorganiser — cocher/décocher pour afficher/masquer
              </p>
              <div className="labo-reorganiser-liste">
                {etapes.map((etape, index) => (
                  <div
                    key={etape.id}
                    className="labo-reorganiser-item"
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault()
                      const from = parseInt(e.dataTransfer.getData('text/plain'))
                      const to = index
                      if (from === to) return
                      const nouvelles = [...etapes]
                      const [item] = nouvelles.splice(from, 1)
                      nouvelles.splice(to, 0, item)
                      setEtapes(nouvelles.map((e, i) => ({ ...e, ordre: i })))
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={etape.visible !== false}
                      onChange={e => setEtapes(prev => prev.map(et =>
                        et.id === etape.id ? { ...et, visible: e.target.checked } : et
                      ))}
                    />
                    <span className="labo-reorganiser-titre">{index + 1}. {etape.titre}</span>
                    <i className="ti ti-grip-vertical" style={{ color: 'var(--text-hint)', fontSize: 18, cursor: 'grab' }}></i>
                  </div>
                ))}
              </div>
              <button className="labo-btn-primary" style={{ marginTop: 16, width: '100%' }} onClick={() => setShowReorganiser(false)}>
                Confirmer
              </button>
            </div>
          </div>
        )}

      </div>
    )
  }

  return (
    <div className="admin-page">

      {/* ─── ONGLETS CATÉGORIES ─────────────── */}
      <div className="admin-labo-cats">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`admin-labo-cat-btn ${categorieSelectee?.id === cat.id ? 'actif' : ''}`}
            onClick={() => setCategorieSelectee(cat)}
          >
            {cat.nom}
          </button>
        ))}
      </div>

      {/* ─── LISTE PROTOCOLES ───────────────── */}
      <div className="admin-liste">
        {protocoles.map(p => (
          <div key={p.id} className="admin-item">
            <span className="admin-item-nom">{p.titre}</span>
            <div className="admin-item-actions">
              <button className="admin-btn-edit" onClick={() => ouvrirFormulaire(p)}>
                <i className="ti ti-edit"></i>
              </button>
              <button className="admin-btn-delete" onClick={() => supprimerProtocole(p.id)}>
                <i className="ti ti-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {protocoles.length === 0 && (
          <div className="admin-vide">Aucun protocole dans cette catégorie</div>
        )}
      </div>

      <button className="btn-fab" onClick={() => ouvrirFormulaire()}>+</button>

    </div>
  )
}
