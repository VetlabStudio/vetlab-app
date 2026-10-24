import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { traduireErreur } from '../lib/messagesErreur'

/* ════════════════════════════════════════════════════════════
   ADMIN - SIGNALEMENTS
   Les erreurs signalées par les utilisateurs au bas des fiches
   (components/SignalerErreur). Pour chacun : ouvrir la fiche,
   corriger, puis marquer « Corrigé » ou « Rejeter ». La personne
   peut être avisée par une notification, avec un mot facultatif.
   ════════════════════════════════════════════════════════════ */

const VERT = '#2E7D62'
const TYPES = {
  dose: { label: 'Dose', couleur: 'var(--accent-red)', fond: 'rgba(168,72,85,0.1)' },
  info: { label: 'Information', couleur: 'var(--primary)', fond: 'rgba(33,48,88,0.08)' },
  coquille: { label: 'Coquille', couleur: 'var(--text-secondary)', fond: 'var(--bg-secondary)' },
  autre: { label: 'Autre', couleur: 'var(--text-secondary)', fond: 'var(--bg-secondary)' },
}
const STATUTS = {
  corrige: { label: 'Corrigé', couleur: VERT, fond: 'rgba(46,125,98,0.1)' },
  rejete: { label: 'Rejeté', couleur: 'var(--text-secondary)', fond: 'var(--bg-secondary)' },
}
const ICONES = { 'Médicament': 'ti-pill', 'Protocole labo': 'ti-flask', 'Nutrition': 'ti-bowl', 'Toxicologie': 'ti-skull' }

const styleNote = { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }

async function lireErreur(error, defaut) {
  let corps
  try { corps = await error.context.json() } catch { corps = null }
  return corps?.message || traduireErreur(error, defaut)
}

// « Il y a 2 h », « Hier », sinon la date.
function quand(iso) {
  const ecart = (Date.now() - new Date(iso).getTime()) / 1000
  if (ecart < 3600) return `Il y a ${Math.max(1, Math.round(ecart / 60))} min`
  if (ecart < 86400) return `Il y a ${Math.round(ecart / 3600)} h`
  if (ecart < 172800) return 'Hier'
  return new Date(iso).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })
}

function Pastille({ style, children }) {
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: style.couleur, background: style.fond, whiteSpace: 'nowrap' }}>{children}</span>
}

export default function AdminSignalements() {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState('a_traiter')
  const [liste, setListe] = useState(null)
  const [aTraiter, setATraiter] = useState(null)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [ouvert, setOuvert] = useState(null)
  // Mot et case « Avertir » propres à chaque signalement ouvert.
  const [reponses, setReponses] = useState({})
  const [avertir, setAvertir] = useState({})
  const [enCours, setEnCours] = useState('')

  useEffect(() => {
    let actif = true
    supabase.functions.invoke('signalements', { body: { action: 'lister', statut: onglet } }).then(async ({ data, error }) => {
      if (!actif) return
      if (error) {
        setErreur(await lireErreur(error, "Les signalements n'ont pas pu être chargés. Réessayez."))
        setListe([])
        return
      }
      setListe(data.signalements)
      setATraiter(data.aTraiter)
    })
    return () => { actif = false }
  }, [onglet])

  function changerOnglet(id) {
    if (id === onglet) return
    setOnglet(id)
    setListe(null)
    setOuvert(null)
    setErreur('')
    setSucces('')
  }

  async function traiter(s, decision) {
    if (enCours) return
    setEnCours(s.id)
    setErreur('')
    setSucces('')
    const doitAvertir = avertir[s.id] !== false && Boolean(s.user_id)
    const { data, error } = await supabase.functions.invoke('signalements', {
      body: { action: 'traiter', id: s.id, decision, reponse: reponses[s.id] || '', avertir: doitAvertir },
    })
    setEnCours('')
    if (error) return setErreur(await lireErreur(error, "Le signalement n'a pas pu être mis à jour. Réessayez."))

    let message = decision === 'corrige' ? 'Signalement marqué corrigé.' : 'Signalement rejeté.'
    if (doitAvertir) message += data?.notifie ? ' La personne a été avisée.' : " La notification n'a pas pu être envoyée."
    setSucces(message)
    setListe(l => l.filter(x => x.id !== s.id))
    setATraiter(n => (n ? n - 1 : n))
    setOuvert(null)
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, paddingBottom: 40 }}>
        <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Signalements à afficher">
          <button type="button" className={`admin-labo-cat-btn ${onglet === 'a_traiter' ? 'actif' : ''}`} aria-pressed={onglet === 'a_traiter'} onClick={() => changerOnglet('a_traiter')}>
            À traiter{aTraiter ? ` (${aTraiter})` : ''}
          </button>
          <button type="button" className={`admin-labo-cat-btn ${onglet === 'traites' ? 'actif' : ''}`} aria-pressed={onglet === 'traites'} onClick={() => changerOnglet('traites')}>
            Traités
          </button>
        </div>

        {erreur && <div className="form-erreur" role="alert">{erreur}</div>}
        {succes && <div className="profil-succes" role="status">{succes}</div>}

        {liste === null && <div className="admin-loading">Chargement...</div>}
        {liste?.length === 0 && !erreur && (
          <p style={{ ...styleNote, textAlign: 'center', padding: '24px 0' }}>
            {onglet === 'a_traiter' ? 'Aucun signalement à traiter.' : 'Aucun signalement traité pour le moment.'}
          </p>
        )}

        {liste?.length > 0 && (
          <div className="labo-tubes-liste" style={{ gap: 8 }}>
            {liste.map(s => {
              const estOuvert = ouvert === s.id
              const type = TYPES[s.type] || TYPES.autre
              return (
                <div key={s.id} className="labo-tube-card">
                  <button type="button" className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`} onClick={() => setOuvert(estOuvert ? null : s.id)} aria-expanded={estOuvert} style={{ alignItems: 'flex-start' }}>
                    <i className={`ti ${ICONES[s.categorie] || 'ti-file-text'}`} aria-hidden="true" style={{ fontSize: 18, color: 'var(--primary)', marginTop: 2 }}></i>
                    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                      <span className="labo-tube-nom">{s.page_nom}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <Pastille style={type}>{type.label}</Pastille>
                        {STATUTS[s.statut] && <Pastille style={STATUTS[s.statut]}>{STATUTS[s.statut].label}</Pastille>}
                        <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{s.categorie} · {quand(s.traite_le || s.created_at)}</span>
                      </span>
                    </span>
                    <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`} style={{ marginTop: 2 }}></i>
                  </button>

                  {estOuvert && (
                    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{s.message}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}>
                        {s.source && <span><strong>Source :</strong> {s.source}</span>}
                        <span><strong>Envoyé par :</strong> {s.auteur ? (s.auteur.email || s.auteur.nom) : 'compte supprimé'}</span>
                        <span><strong>Reçu le :</strong> {new Date(s.created_at).toLocaleString('fr-CA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                        {s.reponse && <span><strong>Mot envoyé :</strong> {s.reponse}</span>}
                      </div>

                      <button type="button" className="labo-btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => navigate(s.route)}>
                        <i className="ti ti-external-link" aria-hidden="true"></i>
                        Ouvrir la fiche
                      </button>

                      {s.statut === 'a_traiter' && (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label className="form-label" htmlFor={`reponse-${s.id}`}>Mot pour la personne (facultatif)</label>
                            <textarea
                              id={`reponse-${s.id}`}
                              className="form-textarea"
                              rows={2}
                              maxLength={1000}
                              placeholder="Ex. Merci ! C'est corrigé."
                              value={reponses[s.id] || ''}
                              onChange={e => setReponses(r => ({ ...r, [s.id]: e.target.value }))}
                            />
                            {s.user_id && (
                              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={avertir[s.id] !== false}
                                  onChange={e => setAvertir(a => ({ ...a, [s.id]: e.target.checked }))}
                                  style={{ accentColor: 'var(--primary)' }}
                                />
                                Avertir la personne par notification
                              </label>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8 }}>
                            <button type="button" className="labo-btn-secondary" style={{ flex: 1 }} disabled={Boolean(enCours)} onClick={() => traiter(s, 'rejete')}>
                              Rejeter
                            </button>
                            <button
                              type="button"
                              disabled={Boolean(enCours)}
                              onClick={() => traiter(s, 'corrige')}
                              style={{ flex: 1, background: VERT, color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 0', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: enCours ? 'not-allowed' : 'pointer', opacity: enCours ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                              <i className="ti ti-check" aria-hidden="true"></i>
                              {enCours === s.id ? 'Enregistrement...' : 'Corrigé'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
