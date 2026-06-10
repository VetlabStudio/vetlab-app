import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LaboNouveauProtocole() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categorieId = searchParams.get('categorie')

  const [titre, setTitre] = useState('')
  const [materiel, setMateriel] = useState([''])
  const [etapes, setEtapes] = useState([
    { id: Date.now(), titre: 'Étape 1', description: '', photo_url: null },
  ])
  const [sauvegarde, setSauvegarde] = useState(false)
  const [uploadingEtape, setUploadingEtape] = useState(null)
  const [etapePhotoId, setEtapePhotoId] = useState(null)
  const [choixPhotoEtapeId, setChoixPhotoEtapeId] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

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
      photo_url: null,
    }])
  }

  function supprimerEtape(id) {
    setEtapes(prev => prev.filter(e => e.id !== id))
  }

  function modifierEtape(id, champ, valeur) {
    setEtapes(prev => prev.map(e => e.id === id ? { ...e, [champ]: valeur } : e))
  }

  // ─── UPLOAD PHOTO ─────────────────────────────
  async function uploaderPhoto(etapeId, fichier) {
    setUploadingEtape(etapeId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const ext = fichier.name.split('.').pop()
      const path = `${user.id}/nouveau/${etapeId}.${ext}`
      const { error } = await supabase.storage
        .from('labo-photos')
        .upload(path, fichier, { upsert: true })
      console.log('upload error:', error)
      if (!error) {
        const { data: urlData } = supabase.storage.from('labo-photos').getPublicUrl(path)
        modifierEtape(etapeId, 'photo_url', urlData.publicUrl)
      }
    } catch (err) {
      console.error('Erreur upload:', err)
    } finally {
      setUploadingEtape(null)
    }
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
            photo_url: etapes[i].photo_url,
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

              {/* Photo */}
              {etape.photo_url ? (
                <div className="labo-etape-photo-wrapper">
                  <img src={etape.photo_url} alt="" className="labo-etape-photo" />
                  <button
                    className="labo-photo-supprimer"
                    onClick={() => modifierEtape(etape.id, 'photo_url', null)}
                  >✕</button>
                </div>
              ) : (
                <button
                  className="labo-photo-ajouter"
                  onClick={() => setChoixPhotoEtapeId(etape.id)}
                >
                  {uploadingEtape === etape.id ? 'Upload en cours...' : (
                    <><i className="ti ti-camera"></i> Ajouter une photo (facultatif)</>
                  )}
                </button>
              )}

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

      {/* Input caméra caché */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files[0] && etapePhotoId) {
            uploaderPhoto(etapePhotoId, e.target.files[0])
            e.target.value = ''
          }
        }}
      />

      {choixPhotoEtapeId && (
        <div className="popup-overlay" onClick={() => setChoixPhotoEtapeId(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Ajouter une photo</span>
              <button className="popup-close" onClick={() => setChoixPhotoEtapeId(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0 4px' }}>
              <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => {
                setEtapePhotoId(choixPhotoEtapeId)
                setChoixPhotoEtapeId(null)
                cameraInputRef.current?.click()
              }}>
                <i className="ti ti-camera"></i> Prendre une photo
              </button>
              <button className="labo-btn-secondary" style={{ width: '100%' }} onClick={() => {
                setEtapePhotoId(choixPhotoEtapeId)
                setChoixPhotoEtapeId(null)
                fileInputRef.current?.click()
              }}>
                <i className="ti ti-photo"></i> Choisir depuis la galerie
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
