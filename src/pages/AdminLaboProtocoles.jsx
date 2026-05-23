import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLaboProtocoles() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [protocoles, setProtocoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [categorieSelectee, setCategorieSelectee] = useState(null)
  const [showFormProto, setShowFormProto] = useState(false)
  const [protoEnEdition, setProtoEnEdition] = useState(null)
  const [titreProto, setTitreProto] = useState('')
  const [etapes, setEtapes] = useState([])
  const [materiel, setMateriel] = useState([''])
  const [uploadingEtape, setUploadingEtape] = useState(null)
  const [etapePhotoId, setEtapePhotoId] = useState(null)
  const fileInputRef = useRef(null)

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
      setEtapes([{ id: `new-${Date.now()}`, titre: 'Étape 1', description: '', photo_url: null, visible: true, ordre: 0 }])
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
            photo_url: etape.photo_url,
            visible: true,
          })
        } else {
          await supabase.from('labo_etapes').update({
            ordre: etape.ordre,
            titre: etape.titre,
            description: etape.description,
            photo_url: etape.photo_url,
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

  async function uploaderPhoto(etapeId, fichier) {
    setUploadingEtape(etapeId)
    const ext = fichier.name.split('.').pop()
    const path = `base/${etapeId}.${ext}`
    const { error } = await supabase.storage
      .from('labo-photos')
      .upload(path, fichier, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('labo-photos').getPublicUrl(path)
      setEtapes(prev => prev.map(e =>
        e.id === etapeId ? { ...e, photo_url: urlData.publicUrl } : e
      ))
    }
    setUploadingEtape(null)
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

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

      {/* ─── FORMULAIRE ─────────────────────── */}
      {showFormProto && (
        <div className="popup-overlay">
          <div className="popup-card popup-large" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="popup-header">
              <span>{protoEnEdition ? 'Modifier' : 'Nouveau'} protocole</span>
              <button className="popup-close" onClick={() => setShowFormProto(false)}>✕</button>
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
                <div key={etape.id} className="labo-nouveau-etape">
                  <div className="labo-nouveau-etape-header">
                    <span className="labo-nouveau-etape-num">Étape {index + 1}</span>
                    {etapes.length > 1 && (
                      <button className="labo-btn-supprimer" onClick={() => supprimerEtape(etape.id)}>
                        <i className="ti ti-trash"></i>
                      </button>
                    )}
                  </div>

                  {etape.photo_url ? (
                    <div className="labo-etape-photo-wrapper">
                      <img src={etape.photo_url} alt="" className="labo-etape-photo" />
                      <button className="labo-photo-supprimer" onClick={() =>
                        setEtapes(prev => prev.map(e => e.id === etape.id ? { ...e, photo_url: null } : e))
                      }>✕</button>
                    </div>
                  ) : (
                    <button className="labo-photo-ajouter" onClick={() => {
                      setEtapePhotoId(etape.id)
                      fileInputRef.current?.click()
                    }}>
                      {uploadingEtape === etape.id ? 'Upload...' : <><i className="ti ti-camera"></i> Ajouter une photo</>}
                    </button>
                  )}

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
                </div>
              ))}
            </div>

            <button className="labo-btn-ajouter-etape" onClick={() => setEtapes(prev => [...prev, {
              id: `new-${Date.now()}`,
              titre: `Étape ${prev.length + 1}`,
              description: '',
              photo_url: null,
              visible: true,
              ordre: prev.length,
            }])}>
              <i className="ti ti-plus"></i> Ajouter une étape
            </button>

            <button
              className="labo-btn-primary"
              onClick={sauvegarder}
              disabled={!titreProto.trim()}
              style={{ width: '100%', padding: '14px', marginTop: 16 }}
            >
              Enregistrer
            </button>

          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files[0] && etapePhotoId) {
            uploaderPhoto(etapePhotoId, e.target.files[0])
            e.target.value = ''
          }
        }}
      />

    </div>
  )
}
