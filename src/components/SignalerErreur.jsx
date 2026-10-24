import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'
import { titrePage } from '../lib/titresPages'

/* ════════════════════════════════════════════════════════════
   SIGNALER UNE ERREUR
   Lien discret au bas d'une fiche, qui ouvre une fenêtre pour
   décrire la correction. Le nom de la fiche et son adresse sont
   joints automatiquement ; les signalements arrivent dans
   Admin - Signalements (fonction signalements).

   page : le nom de la fiche ; sinon, le titre de l'en-tête.
   ════════════════════════════════════════════════════════════ */

const TYPES_ERREUR = [
  { id: 'dose', label: 'Dose ou concentration' },
  { id: 'info', label: 'Information inexacte' },
  { id: 'coquille', label: 'Faute ou coquille' },
  { id: 'autre', label: 'Autre' },
]

const styleChamp = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', fontFamily: 'inherit', fontSize: 14, color: 'var(--text-primary)' }

export default function SignalerErreur({ categorie, page, icone = 'ti-file-text' }) {
  const location = useLocation()
  const [ouvert, setOuvert] = useState(false)
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [source, setSource] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  const [envoye, setEnvoye] = useState(false)

  const nomPage = page || titrePage(location.pathname) || categorie

  function fermer() {
    if (envoi) return
    setOuvert(false)
    setErreur('')
    // Après un envoi réussi, la fenêtre suivante repart de zéro.
    if (envoye) {
      setType('')
      setMessage('')
      setSource('')
      setEnvoye(false)
    }
  }

  async function envoyer() {
    if (envoi || !message.trim()) return
    setEnvoi(true)
    setErreur('')
    const { error } = await supabase.functions.invoke('signalements', {
      body: {
        action: 'envoyer',
        type: type || 'autre',
        message,
        source,
        page: { categorie, nom: nomPage, route: location.pathname + location.search },
      },
    })
    setEnvoi(false)
    if (error) {
      let corps
      try { corps = await error.context.json() } catch { corps = null }
      return setErreur(corps?.message || traduireErreur(error, "Le signalement n'a pas pu être envoyé. Réessayez."))
    }
    setEnvoye(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '16px auto 0', padding: 8, background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-hint)', cursor: 'pointer' }}
      >
        <i className="ti ti-flag" aria-hidden="true" style={{ fontSize: 16 }}></i>
        Signaler une erreur sur cette fiche
      </button>

      {ouvert && (
        <div className="popup-overlay" onClick={fermer}>
          <div className="popup-card" role="dialog" aria-modal="true" aria-label="Signaler une erreur" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span style={{ fontSize: 16 }}>Signaler une erreur</span>
              <button className="popup-close" onClick={fermer} aria-label="Fermer">✕</button>
            </div>

            {envoye ? (
              <>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: 40, color: '#2E7D62', marginBottom: 12, display: 'block' }}></i>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Merci, c'est envoyé !</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Une notification vous avisera quand le signalement sera traité.
                  </p>
                </div>
                <button className="labo-btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14 }} onClick={fermer}>Fermer</button>
              </>
            ) : (
              <>
                <span style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 999 }}>
                  <i className={`ti ${icone}`} aria-hidden="true" style={{ fontSize: 14 }}></i>
                  {nomPage}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="form-label" id="signaler-type">Type d'erreur</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} role="group" aria-labelledby="signaler-type">
                    {TYPES_ERREUR.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`admin-labo-cat-btn ${type === t.id ? 'actif' : ''}`}
                        aria-pressed={type === t.id}
                        onClick={() => setType(type === t.id ? '' : t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="form-label" htmlFor="signaler-texte">Qu'est-ce qui devrait être corrigé ?</label>
                  <textarea
                    id="signaler-texte"
                    rows={4}
                    maxLength={2000}
                    style={{ ...styleChamp, resize: 'none' }}
                    placeholder="Ex. La dose maximale chez le chat devrait être..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="form-label" htmlFor="signaler-source">Source (facultatif)</label>
                  <input
                    id="signaler-source"
                    maxLength={300}
                    style={styleChamp}
                    placeholder="Ex. Plumb's, 10e éd."
                    value={source}
                    onChange={e => setSource(e.target.value)}
                  />
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.5, margin: 0 }}>
                  Le nom de la fiche est joint automatiquement. Vous recevrez une notification quand le signalement sera traité.
                </p>

                {erreur && <div className="form-erreur" role="alert">{erreur}</div>}

                <div className="popup-actions-centrees">
                  <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={fermer} disabled={envoi}>Annuler</button>
                  <button
                    style={{
                      flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)',
                      padding: '12px 0', fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                      cursor: message.trim() && !envoi ? 'pointer' : 'not-allowed', opacity: message.trim() && !envoi ? 1 : 0.5,
                    }}
                    onClick={envoyer}
                    disabled={!message.trim() || envoi}
                  >
                    {envoi ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
