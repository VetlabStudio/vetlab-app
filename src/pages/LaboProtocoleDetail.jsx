import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useContext } from 'react'
import { TitreContext } from '../App'

export default function LaboProtocoleDetail() {
  const navigate = useNavigate()
  const { protocoleId } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'base'

  const [protocole, setProtocole] = useState(null)
  const [etapes, setEtapes] = useState([])
  const [materiel, setMateriel] = useState([])
  const [loading, setLoading] = useState(true)
  const [modeEdit, setModeEdit] = useState(false)
  const [showReorganiser, setShowReorganiser] = useState(false)
  const [uploadingEtape, setUploadingEtape] = useState(null)
  const fileInputRef = useRef(null)
  const [etapePhotoId, setEtapePhotoId] = useState(null)
  const { setTitreCustom } = useContext(TitreContext)
  const [showProMsg, setShowProMsg] = useState(false)

  useEffect(() => {
  chargerDonnees()
  return () => setTitreCustom('')
}, [protocoleId])

  async function chargerDonnees() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (type === 'user') {
      const [{ data: proto }, { data: etapesData }] = await Promise.all([
        supabase.from('labo_protocoles_user').select('*').eq('id', protocoleId).single(),
        supabase.from('labo_etapes_user_custom').select('*').eq('protocole_user_id', protocoleId).order('ordre'),
      ])
      setProtocole(proto)
      setEtapes(etapesData || [])
      if (proto?.titre) setTitreCustom(proto.titre)
      // Charger le matériel depuis description
      if (proto?.description) {
        setMateriel(proto.description.split('\n').filter(m => m.trim()))
      } else {
        setMateriel([''])
      }
    } else {
      const { data: proto } = await supabase
        .from('labo_protocoles').select('*').eq('id', protocoleId).single()

      const { data: etapesBase } = await supabase
        .from('labo_etapes').select('*').eq('protocole_id', protocoleId).order('ordre')

      const { data: userMods } = await supabase
        .from('labo_etapes_user')
        .select('*')
        .eq('user_id', user.id)
        .eq('protocole_id', protocoleId)

      const etapesFusionnees = (etapesBase || []).map(e => {
        const mod = (userMods || []).find(m => m.etape_id === e.id)
        return {
          ...e,
          visible: mod ? mod.visible : e.visible,
          ordre: mod ? mod.ordre : e.ordre,
          photo_url: mod?.photo_url || e.photo_url,
          description: mod?.description || e.description,
          mod_id: mod?.id,
        }
      }).sort((a, b) => a.ordre - b.ordre)

      setProtocole(proto)
      if (proto?.titre) setTitreCustom(proto.titre)
      setEtapes(etapesFusionnees)
      if (proto?.description) {
        setMateriel(proto.description.split('\n').filter(m => m.trim()))
      } else {
        setMateriel([''])
      }
    }
    setLoading(false)
  }

  async function sauvegarderModifications() {
  const { data: { user } } = await supabase.auth.getUser()

  if (type === 'base') {
    // Créer une copie personnelle
    const { data: protoUser } = await supabase
      .from('labo_protocoles_user')
      .insert({
        user_id: user.id,
        categorie_id: protocole.categorie_id,
        titre: protocole.titre,
        description: materiel.filter(m => m.trim()).join('\n'),
      })
      .select()
      .single()

    if (protoUser) {
      for (const etape of etapes) {
        await supabase.from('labo_etapes_user_custom').insert({
          protocole_user_id: protoUser.id,
          ordre: etape.ordre,
          titre: etape.titre,
          description: etape.description,
          photo_url: etape.photo_url,
          visible: etape.visible ?? true,
        })
      }
      setModeEdit(false)
      navigate(`/labo/protocole/${protoUser.id}?type=user`, { replace: true })
      return
    }
  } else {
    await supabase.from('labo_protocoles_user').update({
      titre: protocole.titre,
      description: materiel.filter(m => m.trim()).join('\n')
    }).eq('id', protocoleId)

    for (const etape of etapes) {
      if (etape.id?.toString().startsWith('new-')) {
        await supabase.from('labo_etapes_user_custom').insert({
          protocole_user_id: protocoleId,
          ordre: etape.ordre,
          titre: etape.titre,
          description: etape.description,
          photo_url: etape.photo_url,
          visible: etape.visible ?? true,
        })
      } else {
        await supabase.from('labo_etapes_user_custom').update({
          ordre: etape.ordre,
          titre: etape.titre,
          description: etape.description,
          photo_url: etape.photo_url,
          visible: etape.visible ?? true,
        }).eq('id', etape.id)
      }
    }
  }

  setModeEdit(false)
  chargerDonnees()
}

  async function uploaderPhoto(etapeId, fichier) {
    setUploadingEtape(etapeId)
    const { data: { user } } = await supabase.auth.getUser()
    const ext = fichier.name.split('.').pop()
    const path = `${user.id}/${protocoleId}/${etapeId}.${ext}`
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

  function deplacerEtape(index, direction) {
    const nouvelles = [...etapes]
    const cible = index + direction
    if (cible < 0 || cible >= nouvelles.length) return
    ;[nouvelles[index], nouvelles[cible]] = [nouvelles[cible], nouvelles[index]]
    setEtapes(nouvelles.map((e, i) => ({ ...e, ordre: i })))
  }

  function ajouterEtape() {
    setEtapes(prev => [...prev, {
      id: `new-${Date.now()}`,
      titre: `Étape ${prev.length + 1}`,
      description: '',
      photo_url: null,
      visible: true,
      ordre: prev.length,
      isNew: true,
    }])
  }

  async function supprimerEtape(etapeId) {
    if (type === 'user') {
      await supabase.from('labo_etapes_user_custom').delete().eq('id', etapeId)
    }
    setEtapes(prev => prev.filter(e => e.id !== etapeId))
  }

  if (loading) return <div className="admin-loading">Chargement...</div>
  if (!protocole) return <div className="admin-vide">Protocole introuvable</div>

  const etapesVisibles = modeEdit ? etapes : etapes.filter(e => e.visible !== false)
  const materielAffiche = materiel.filter(m => m.trim())

  return (
    <div className="labo-detail-page">

      {/* ─── ACTIONS ────────────────────────── */}
      <div className="labo-actions">
        {modeEdit ? (
          <>
            <button className="labo-btn-secondary" onClick={() => { setModeEdit(false); chargerDonnees() }}>
              Annuler
            </button>
            <button className="labo-btn-reorganiser" onClick={() => setShowReorganiser(true)}>
              Réorganiser
            </button>
            <button className="labo-btn-primary" onClick={sauvegarderModifications}>
              Enregistrer
            </button>
          </>
        ) : (
          <button className="labo-btn-secondary" onClick={() => {
  if (type === 'base') {
    setShowProMsg(true)
  } else {
    setModeEdit(true)
  }
}}>
  {type === 'base' ? 'Personnaliser ce protocole' : 'Modifier le protocole'}
</button>
        )}
      </div>

      {/* ─── TITRE ──────────────────────────── */}
{modeEdit && (
  <div className="champ">
    <label>Titre du protocole</label>
    <div className="champ-input">
      <input
        type="text"
        value={protocole?.titre || ''}
        onChange={e => setProtocole(prev => ({ ...prev, titre: e.target.value }))}
        placeholder="Titre du protocole"
      />
    </div>
  </div>
)}

      {/* ─── MATÉRIEL ───────────────────────── */}
      {(modeEdit || materielAffiche.length > 0) && (
        <div className="labo-etape-card" style={{ padding: 14 }}>
          <h3 className="labo-etape-titre" style={{ margin: '0 0 12px 0' }}>Liste de matériel</h3>
          {modeEdit ? (
            <>
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
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setMateriel(prev => [...prev, ''])
                        }
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
              <button className="labo-btn-ajouter-etape" style={{ marginTop: 8 }} onClick={() => setMateriel(prev => [...prev, ''])}>
                <i className="ti ti-plus"></i> Ajouter un item
              </button>
            </>
          ) : (
            <ul className="labo-materiel-affichage">
              {materielAffiche.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ─── ÉTAPES ─────────────────────────── */}
      <div className="labo-etapes">
        {etapesVisibles.map((etape, index) => (
          <div key={etape.id} className={`labo-etape-card ${!etape.visible ? 'masquee' : ''}`}>

            {/* Photo */}
            {etape.photo_url ? (
              <div className="labo-etape-photo-wrapper">
                <img src={etape.photo_url} alt={etape.titre} className="labo-etape-photo" />
                {modeEdit && (
                  <button className="labo-photo-supprimer" onClick={() =>
                    setEtapes(prev => prev.map(e => e.id === etape.id ? { ...e, photo_url: null } : e))
                  }>✕</button>
                )}
              </div>
            ) : modeEdit ? (
              <button
                className="labo-photo-ajouter"
                onClick={() => {
                  setEtapePhotoId(etape.id)
                  fileInputRef.current?.click()
                }}
              >
                {uploadingEtape === etape.id ? 'Upload...' : (
                  <><i className="ti ti-camera"></i> Ajouter une photo (facultatif)</>
                )}
              </button>
            ) : null}

            {/* Titre */}
            {modeEdit ? (
              <input
                className="labo-etape-titre-input"
                value={etape.titre}
                onChange={e => setEtapes(prev => prev.map(et =>
                  et.id === etape.id ? { ...et, titre: e.target.value } : et
                ))}
              />
            ) : (
              <h3 className="labo-etape-titre">{etape.titre}</h3>
            )}

            {/* Description */}
            {modeEdit ? (
              <textarea
                className="labo-etape-desc-input"
                value={etape.description || ''}
                onChange={e => setEtapes(prev => prev.map(et =>
                  et.id === etape.id ? { ...et, description: e.target.value } : et
                ))}
                placeholder="Description de l'étape..."
                rows={3}
              />
            ) : (
              etape.description && <p className="labo-etape-desc">{etape.description}</p>
            )}

            {/* Actions edit */}
            {modeEdit && (
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
                <button className="labo-btn-supprimer" onClick={() => supprimerEtape(etape.id)}>
  <i className="ti ti-trash"></i>
</button>
              </div>
            )}
          </div>
        ))}

        {/* Bouton ajouter étape en mode edit */}
        {modeEdit && (
  <button className="labo-btn-ajouter-etape" onClick={ajouterEtape}>
    <i className="ti ti-plus"></i> Ajouter une étape
  </button>
)}
      </div>
      {/* ─── BOUTON ENREGISTRER BAS ─────────── */}
{modeEdit && (
  <div className="labo-actions">
    <button className="labo-btn-secondary" onClick={() => { setModeEdit(false); chargerDonnees() }}>
      Annuler
    </button>
    <button className="labo-btn-primary" onClick={sauvegarderModifications}>
      Enregistrer
    </button>
  </div>
)}

      {/* Input fichier caché */}
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

      {/* ─── MODAL RÉORGANISER ──────────────── */}
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
            <span className="labo-reorganiser-titre">{etape.titre}</span>
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
          La personnalisation des protocoles est réservée au forfait <strong>Pro</strong>.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
          Le forfait Pro sera disponible prochainement. Reste à l'affût !
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
