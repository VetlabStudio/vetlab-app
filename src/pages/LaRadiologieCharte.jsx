import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useCharteRadio from '../hooks/useCharteRadio'
import { qualiteOptions } from '../data/charteRadioOptions'
import { ESPECES_CONFIG } from '../components/IconesEspeces'

const QUALITE_LABEL = Object.fromEntries(qualiteOptions.map(q => [q.value, q.label]))

export default function LaRadiologieCharte() {
  const navigate = useNavigate()
  const { entrees, loading, supprimerEntree } = useCharteRadio()
  const [rechercheEspece, setRechercheEspece] = useState('toutes')
  const [rechercheRegion, setRechercheRegion] = useState('toutes')

  const especesPresentes = useMemo(() => (
    [...new Set(entrees.map(e => e.espece))].filter(Boolean)
  ), [entrees])

  const regionsPresentes = useMemo(() => (
    [...new Set(entrees.map(e => e.region))].filter(Boolean).sort()
  ), [entrees])

  const entreesFiltrees = useMemo(() => {
    return entrees.filter(e => {
      const matchEspece = rechercheEspece === 'toutes' || e.espece === rechercheEspece
      const matchRegion = rechercheRegion === 'toutes' || e.region === rechercheRegion
      return matchEspece && matchRegion
    })
  }, [entrees, rechercheEspece, rechercheRegion])

  const [aSupprimer, setASupprimer] = useState(null)

  async function supprimer() {
    await supprimerEntree(aSupprimer.id)
    setASupprimer(null)
  }

  return (
    <div className="admin-page">

      <div className="admin-filtres">
        <select className="admin-select" value={rechercheEspece} onChange={e => setRechercheEspece(e.target.value)}>
          <option value="toutes">Toutes les espèces</option>
          {especesPresentes.map(id => <option key={id} value={id}>{ESPECES_CONFIG[id]?.label || id}</option>)}
        </select>
        <select className="admin-select" value={rechercheRegion} onChange={e => setRechercheRegion(e.target.value)}>
          <option value="toutes">Toutes les régions</option>
          {regionsPresentes.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : (
        <div className="admin-liste">
          {entreesFiltrees.length === 0 ? (
            <div className="admin-vide">
              {entrees.length === 0
                ? 'Crée ta propre charte radiographique selon les spécifications de la machine à ta clinique.'
                : 'Aucune entrée ne correspond à ce filtre.'}
            </div>
          ) : (
            entreesFiltrees.map(e => (
              <div key={e.id} className="charte-item">
                <div className="charte-item-haut">
                  <div className="charte-item-titre">
                    <span className="admin-item-nom">{e.region}</span>
                    <span className="admin-item-categorie">{ESPECES_CONFIG[e.espece]?.label || e.espece}</span>
                  </div>
                  {e.qualite && (
                    <span className={`charte-badge charte-badge-${e.qualite}`}>{QUALITE_LABEL[e.qualite]}</span>
                  )}
                </div>

                <div className="charte-item-meta">
                  {(e.epaisseur_min || e.epaisseur_max) && (
                    <span>Épaisseur : {e.epaisseur_min ?? '?'}{e.epaisseur_max ? ` à ${e.epaisseur_max}` : ''} cm</span>
                  )}
                  <span>{e.kv} kV</span>
                  <span>{e.mas} mAs</span>
                  <span>DFF {e.dff} cm</span>
                  <span>{e.grille ? 'Grille' : 'Sans grille'}</span>
                </div>

                {e.notes && <p className="charte-item-notes">{e.notes}</p>}

                <div className="admin-item-actions">
                  <button className="btn-edit" onClick={() => navigate(`/labo/radiologie/charte/${e.id}/modifier`)}><i className="ti ti-edit"></i></button>
                  <button className="btn-delete" onClick={() => setASupprimer({ id: e.id, region: e.region, espece: ESPECES_CONFIG[e.espece]?.label || e.espece })}><i className="ti ti-trash"></i></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button className="btn-fab" onClick={() => navigate('/labo/radiologie/charte/nouvelle')}>+</button>

      {aSupprimer && (
        <div className="popup-overlay" onClick={() => setASupprimer(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Supprimer l'entrée</span>
              <button className="popup-close" onClick={() => setASupprimer(null)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-trash" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Supprimer l'entrée « {aSupprimer.region} / {aSupprimer.espece} » ? Cette action est irréversible.
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setASupprimer(null)}>
                Annuler
              </button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={supprimer}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
