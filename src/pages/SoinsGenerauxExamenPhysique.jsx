import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SYSTEMES = [
  { id: 'tegumentaire', icone: '/examen-tegumentaire.png', titre: 'Tégumentaire', placeholder: 'Hydratation, alopécie, masses, parasites, lésions, rougeurs, démangeaisons...' },
  { id: 'respiratoire', icone: '/examen-respiratoire.png', titre: 'Respiratoire', placeholder: 'Fréquence, rythme, bruits anormaux, dyspnée, écoulement nasal...' },
  { id: 'cardiovasculaire', icone: '/examen-cardiovasculaire.png', titre: 'Système cardiovasculaire', placeholder: 'Fréquence cardiaque, qualité des battements, TRC, pouls...' },
  { id: 'digestif', icone: '/examen-digestif.png', titre: 'Système digestif', placeholder: 'Vomissements, diarrhée, douleur abdominale, signes d\'occlusion...' },
  { id: 'genito-urinaire', icone: '/examen-genito-urinaire.png', titre: 'Système génito-urinaire', placeholder: 'Testicules, écoulements, gestation, lactation, pertes vaginales...' },
  { id: 'musculosquelettique', icone: '/examen-musculosquelettique.png', titre: 'Système musculosquelettique', placeholder: 'Boiterie, démarche, douleur musculaire, inflammation, faiblesse...' },
  { id: 'nerveux', icone: '/examen-nerveux.png', titre: 'Système nerveux', placeholder: 'Tremblements, convulsions, mouvements anormaux, réflexes...' },
  { id: 'yeux', icone: '/examen-yeux.png', titre: 'Yeux', placeholder: 'Blessures, ulcères, écoulements, autres anomalies...' },
  { id: 'oreilles', icone: '/examen-oreilles.png', titre: 'Oreilles', placeholder: 'Douleur, parasites, odeur, ulcères, sécrétions...' },
  { id: 'muqueuses', icone: '/examen-muqueuses.png', titre: 'Muqueuses', placeholder: 'Couleur, odeur, état des tissus buccaux...' },
  { id: 'lymphatique', icone: '/examen-lymphatique.png', titre: 'Système lymphatique', placeholder: 'Taille, consistance, localisation des ganglions...' },
]

const ATTITUDE_OPTIONS = ['Alerte et réactif', 'Calme et réactif', 'Abattu (léthargique)', 'Obnubilé (stuporeux)']
const ENERGIE_OPTIONS = ['Normal', 'Diminué', 'Augmenté', 'Épuisement']
const CONDITION_OPTIONS = ['Maigre', 'Idéale', 'Surpoids', 'Obèse']
const COMPORTEMENT_OPTIONS = ['Calme', 'Craintif / anxieux', 'Agressif', 'Agité / excité']

function etatInitial() {
  return {
    animalNom: '',
    temperature: '',
    freqCardiaque: '',
    freqRespiratoire: '',
    attitude: '',
    niveauEnergie: '',
    conditionCorporelle: '',
    comportement: '',
    commentairesProprietaire: '',
    systemes: SYSTEMES.reduce((acc, s) => ({ ...acc, [s.id]: { normal: false, note: '' } }), {}),
  }
}

const MAX_HISTORIQUE = 30

export default function SoinsGenerauxExamenPhysique() {
  const [vue, setVue] = useState('liste') // 'liste' | 'formulaire'
  const [form, setForm] = useState(etatInitial())
  const [currentId, setCurrentId] = useState(null)
  const [historique, setHistorique] = useState([])
  const [itemConsulte, setItemConsulte] = useState(null)
  const [showResume, setShowResume] = useState(null)
  const [showIncomplet, setShowIncomplet] = useState(false)
  const [showReinit, setShowReinit] = useState(false)
  const [showConfirmSupprimer, setShowConfirmSupprimer] = useState(null)
  const [copie, setCopie] = useState(false)

  const date = new Date()
  const dateAffichee = date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    chargerHistorique()
  }, [])

  async function chargerHistorique() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('examens_physiques')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setHistorique(data || [])
  }

  function modifierChamp(champ, valeur) {
    setForm(prev => ({ ...prev, [champ]: valeur }))
  }

  function toggleNormal(systemeId) {
    setForm(prev => ({
      ...prev,
      systemes: {
        ...prev.systemes,
        [systemeId]: { ...prev.systemes[systemeId], normal: !prev.systemes[systemeId].normal },
      },
    }))
  }

  function modifierNote(systemeId, note) {
    setForm(prev => ({
      ...prev,
      systemes: {
        ...prev.systemes,
        [systemeId]: { ...prev.systemes[systemeId], note },
      },
    }))
  }

  function commencerNouvelExamen() {
    setForm(etatInitial())
    setCurrentId(null)
    setVue('formulaire')
  }

  function formulaireIncomplet() {
    if (!form.animalNom.trim()) return true
    if (!form.temperature || !form.freqCardiaque || !form.freqRespiratoire) return true
    if (!form.attitude.trim() || !form.niveauEnergie.trim() || !form.conditionCorporelle.trim() || !form.comportement.trim()) return true
    return SYSTEMES.some(s => !form.systemes[s.id].normal && !form.systemes[s.id].note.trim())
  }

  function genererResume() {
    const lignes = []
    lignes.push('EXAMEN PHYSIQUE - PRÉCONSULTATION')
    lignes.push(`Animal : ${form.animalNom || '—'}`)
    lignes.push(`Date : ${dateAffichee}`)
    lignes.push('')
    lignes.push('Paramètres vitaux :')
    lignes.push(`- Température : ${form.temperature ? form.temperature + ' °C' : '—'}`)
    lignes.push(`- Fréquence cardiaque : ${form.freqCardiaque ? form.freqCardiaque + ' bpm' : '—'}`)
    lignes.push(`- Fréquence respiratoire : ${form.freqRespiratoire ? form.freqRespiratoire + ' rpm' : '—'}`)
    lignes.push('')
    lignes.push('État général :')
    lignes.push(`- Attitude générale : ${form.attitude || '—'}`)
    lignes.push(`- Niveau d'énergie : ${form.niveauEnergie || '—'}`)
    lignes.push(`- Condition corporelle : ${form.conditionCorporelle || '—'}`)
    lignes.push(`- Comportement : ${form.comportement || '—'}`)
    lignes.push('')
    lignes.push('Observation par système :')
    SYSTEMES.forEach(s => {
      const { normal, note } = form.systemes[s.id]
      if (normal && !note.trim()) {
        lignes.push(`- ${s.titre} : Normal`)
      } else if (note.trim()) {
        lignes.push(`- ${s.titre} : ${note.trim()}`)
      } else {
        lignes.push(`- ${s.titre} : Anormal - voir note`)
      }
    })
    if (form.commentairesProprietaire.trim()) {
      lignes.push('')
      lignes.push('Commentaires du propriétaire :')
      lignes.push(form.commentairesProprietaire.trim())
    }
    return lignes.join('\n')
  }

  function handleTermine() {
    if (formulaireIncomplet()) {
      setShowIncomplet(true)
      return
    }
    finaliserExamen()
  }

  async function finaliserExamen() {
    setShowIncomplet(false)
    const texte = genererResume()
    await sauvegarder(texte)
    setShowResume(texte)
  }

  async function sauvegarder(texte) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (currentId) {
      await supabase
        .from('examens_physiques')
        .update({ animal_nom: form.animalNom || 'Sans nom', resume: texte, donnees: form, updated_at: new Date().toISOString() })
        .eq('id', currentId)
    } else {
      if (historique.length >= MAX_HISTORIQUE) {
        const aSupprimer = [...historique]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .slice(0, historique.length - MAX_HISTORIQUE + 1)
        for (const item of aSupprimer) {
          await supabase.from('examens_physiques').delete().eq('id', item.id)
        }
      }
      const { data } = await supabase
        .from('examens_physiques')
        .insert({ user_id: user.id, animal_nom: form.animalNom || 'Sans nom', resume: texte, donnees: form })
        .select()
        .single()
      if (data) setCurrentId(data.id)
    }
    chargerHistorique()
  }

  function fermerResume() {
    setShowResume(null)
    setVue('liste')
    setItemConsulte(null)
  }

  function reinitialiser() {
    setForm(etatInitial())
    setShowReinit(false)
  }

  function consulter(item) {
    setItemConsulte(item)
  }

  function modifier(item) {
    setForm(item.donnees || etatInitial())
    setCurrentId(item.id)
    setItemConsulte(null)
    setVue('formulaire')
  }

  async function supprimerHistorique(id) {
    await supabase.from('examens_physiques').delete().eq('id', id)
    setHistorique(prev => prev.filter(h => h.id !== id))
    setShowConfirmSupprimer(null)
    setItemConsulte(null)
  }

  function copierResume(texte) {
    navigator.clipboard.writeText(texte)
    setCopie(true)
    setTimeout(() => setCopie(false), 1500)
  }

  function formaterDate(d) {
    return new Date(d).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // ─── VUE LISTE ─────────────────────────────────
  if (vue === 'liste') {
    return (
      <div className="labo-detail-page">

        <div className="postop-intro">
          <i className="ti ti-clipboard-check postop-intro-icone"></i>
          <p className="postop-intro-texte">
            Checklist d'examen physique en préconsultation. Consulte tes anciens examens ou commence-en un nouveau.
          </p>
        </div>

        <button className="labo-btn-primary" style={{ width: '100%', margin: '0 0 16px' }} onClick={commencerNouvelExamen}>
          <i className="ti ti-plus"></i> Commencer un nouvel examen
        </button>

        <div className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-history"></i>
            </div>
            <h2 className="postop-section-titre">Historique ({historique.length}/{MAX_HISTORIQUE})</h2>
          </div>
          {historique.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--text-hint)', padding: '0 16px 16px' }}>
              Aucun examen enregistré pour le moment.
            </p>
          ) : (
            <div className="notes-grille" style={{ padding: '0 16px 16px' }}>
              {historique.map(item => (
                <div
                  key={item.id}
                  className="note-tuile"
                  style={{ background: '#FFF9C4' }}
                  onClick={() => consulter(item)}
                >
                  <div className="note-tuile-header">
                    <h3 className="note-tuile-titre">{item.animal_nom}</h3>
                    <button
                      className="note-tuile-supprimer"
                      onClick={e => { e.stopPropagation(); setShowConfirmSupprimer(item) }}
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                  <p className="note-tuile-date">{formaterDate(item.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popup consultation */}
        {itemConsulte && (
          <div className="popup-overlay" onClick={() => setItemConsulte(null)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>{itemConsulte.animal_nom}</span>
                <button className="popup-close" onClick={() => setItemConsulte(null)}>✕</button>
              </div>
              <textarea
                className="form-textarea"
                style={{ width: '100%', minHeight: 320, fontFamily: 'monospace', fontSize: 12 }}
                value={itemConsulte.resume}
                readOnly
              />
              <div className="popup-actions-centrees" style={{ marginTop: 12 }}>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => copierResume(itemConsulte.resume)}>
                  {copie ? 'Copié !' : 'Copier'}
                </button>
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => modifier(itemConsulte)}>
                  Modifier
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(itemConsulte)}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup confirmation suppression historique */}
        {showConfirmSupprimer && (
          <div className="popup-overlay" onClick={() => setShowConfirmSupprimer(null)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <span>Supprimer cet examen</span>
                <button className="popup-close" onClick={() => setShowConfirmSupprimer(null)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  As-tu bien noté ces informations dans le dossier de <strong>{showConfirmSupprimer.animal_nom}</strong> avant de supprimer ?
                </p>
              </div>
              <div className="popup-actions-centrees">
                <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSupprimer(null)}>
                  Annuler
                </button>
                <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={() => supprimerHistorique(showConfirmSupprimer.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // ─── VUE FORMULAIRE ─────────────────────────────────
  return (
    <div className="labo-detail-page">

      <button className="labo-btn-secondary" style={{ marginBottom: 12 }} onClick={() => setVue('liste')}>
        <i className="ti ti-arrow-left"></i> Retour à l'historique
      </button>

      <div className="postop-intro">
        <i className="ti ti-clipboard-check postop-intro-icone"></i>
        <p className="postop-intro-texte">
          Coche les systèmes normaux et ajoute des notes pour les anomalies observées.
        </p>
      </div>

      {/* Identification */}
      <div className="postop-section">
        <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
          <div className="form-groupe">
            <label className="form-label">Nom de l'animal</label>
            <input
              type="text"
              className="form-input"
              value={form.animalNom}
              onChange={e => modifierChamp('animalNom', e.target.value)}
              placeholder="Ex. : Charlie"
            />
          </div>
          <div className="form-groupe">
            <label className="form-label">Date</label>
            <div className="form-input" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>{dateAffichee}</div>
          </div>
        </div>
      </div>

      {/* Paramètres vitaux */}
      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-heartbeat"></i>
          </div>
          <h2 className="postop-section-titre">Paramètres vitaux</h2>
        </div>
        <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
          <div className="form-groupe">
            <label className="form-label">Température corporelle (°C)</label>
            <input type="number" inputMode="decimal" className="form-input" value={form.temperature} onChange={e => modifierChamp('temperature', e.target.value)} placeholder="Ex. : 38.5" />
          </div>
          <div className="form-groupe">
            <label className="form-label">Fréquence cardiaque (bpm)</label>
            <input type="number" inputMode="numeric" className="form-input" value={form.freqCardiaque} onChange={e => modifierChamp('freqCardiaque', e.target.value)} placeholder="Ex. : 100" />
          </div>
          <div className="form-groupe">
            <label className="form-label">Fréquence respiratoire (rpm)</label>
            <input type="number" inputMode="numeric" className="form-input" value={form.freqRespiratoire} onChange={e => modifierChamp('freqRespiratoire', e.target.value)} placeholder="Ex. : 24" />
          </div>
        </div>
      </div>

      {/* État général */}
      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-paw"></i>
          </div>
          <h2 className="postop-section-titre">État général</h2>
        </div>
        <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
          <div className="form-groupe">
            <label className="form-label">Attitude générale</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {ATTITUDE_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.attitude === opt ? 'actif' : ''}`} onClick={() => modifierChamp('attitude', opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="form-groupe">
            <label className="form-label">Niveau d'énergie</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {ENERGIE_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.niveauEnergie === opt ? 'actif' : ''}`} onClick={() => modifierChamp('niveauEnergie', opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="form-groupe">
            <label className="form-label">Condition corporelle</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {CONDITION_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.conditionCorporelle === opt ? 'actif' : ''}`} onClick={() => modifierChamp('conditionCorporelle', opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="form-groupe">
            <label className="form-label">Comportement</label>
            <div className="toggle-groupe" style={{ flexWrap: 'wrap' }}>
              {COMPORTEMENT_OPTIONS.map(opt => (
                <button key={opt} type="button" className={`toggle-btn ${form.comportement === opt ? 'actif' : ''}`} onClick={() => modifierChamp('comportement', opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Observation par système */}
      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-stethoscope"></i>
          </div>
          <h2 className="postop-section-titre">Observation par système corporel</h2>
        </div>
        <div className="form-scroll" style={{ padding: 16, gap: 16 }}>
          {SYSTEMES.map(s => (
            <div key={s.id} className="examen-systeme">
              <div className="examen-systeme-header">
                <img src={s.icone} alt="" className="examen-systeme-icone" />
                <span className="examen-systeme-titre">{s.titre}</span>
                <button
                  className={`examen-checkbox ${form.systemes[s.id].normal ? 'selectionne' : ''}`}
                  onClick={() => toggleNormal(s.id)}
                  type="button"
                >
                  {form.systemes[s.id].normal && <i className="ti ti-check"></i>}
                </button>
                <span className="examen-checkbox-label">Normal</span>
              </div>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder={s.placeholder}
                value={form.systemes[s.id].note}
                onChange={e => modifierNote(s.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Commentaires du propriétaire */}
      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-message-circle"></i>
          </div>
          <h2 className="postop-section-titre">Commentaires du propriétaire</h2>
        </div>
        <div className="form-scroll" style={{ padding: 16, gap: 12 }}>
          <div className="form-groupe">
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Ex. : Le propriétaire mentionne que l'animal a moins d'appétit depuis 2 jours..."
              value={form.commentairesProprietaire}
              onChange={e => modifierChamp('commentairesProprietaire', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="labo-actions" style={{ padding: '0 16px 16px' }}>
        <button className="labo-btn-secondary" onClick={() => setShowReinit(true)}>
          Réinitialiser
        </button>
        <button className="labo-btn-primary" onClick={handleTermine}>
          Terminé
        </button>
      </div>

      {/* Popup résumé */}
      {showResume && (
        <div className="popup-overlay" onClick={fermerResume}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Résumé de l'examen</span>
              <button className="popup-close" onClick={fermerResume}>✕</button>
            </div>
            <textarea
              className="form-textarea"
              style={{ width: '100%', minHeight: 320, fontFamily: 'monospace', fontSize: 12 }}
              value={showResume}
              readOnly
            />
            <div className="popup-actions-centrees" style={{ marginTop: 12 }}>
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => copierResume(showResume)}>
                {copie ? 'Copié !' : 'Copier'}
              </button>
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={fermerResume}>
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup formulaire incomplet */}
      {showIncomplet && (
        <div className="popup-overlay" onClick={() => setShowIncomplet(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Formulaire incomplet</span>
              <button className="popup-close" onClick={() => setShowIncomplet(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-alert-triangle" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Certaines sections n'ont pas été remplies. Veux-tu revenir compléter le formulaire ou poursuivre quand même ?
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowIncomplet(false)}>
                Revenir
              </button>
              <button className="labo-btn-primary" style={{ flex: 1 }} onClick={finaliserExamen}>
                Poursuivre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup confirmation réinitialisation */}
      {showReinit && (
        <div className="popup-overlay" onClick={() => setShowReinit(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Réinitialiser le formulaire</span>
              <button className="popup-close" onClick={() => setShowReinit(false)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <i className="ti ti-refresh" style={{ fontSize: 40, color: 'var(--accent-red)', marginBottom: 12, display: 'block' }}></i>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Toutes les informations saisies seront effacées. Continuer ?
              </p>
            </div>
            <div className="popup-actions-centrees">
              <button className="labo-btn-secondary" style={{ flex: 1 }} onClick={() => setShowReinit(false)}>
                Annuler
              </button>
              <button className="btn-supprimer-medicament" style={{ flex: 1 }} onClick={reinitialiser}>
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
