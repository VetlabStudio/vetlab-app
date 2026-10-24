import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignalerErreur from './SignalerErreur'

/* ════════════════════════════════════════════════════════════
   GABARIT DES FICHES NUTRITION

   Pensé pour la tech qui conseille un client au comptoir ou en
   consultation. Ce qu'il faut dire reste visible et tient en peu
   d'écrans ; le reste se replie, avec le même accordéon que
   « Choix du tube » (une section ouverte à la fois).

   Visible :
   1. En-tête : espèces, objectif de l'alimentation, pour qui
   2. À dire au client : 3 messages clés, en mots simples
   3. À privilégier / À éviter : repères visuels pour le client
   4. Important : les erreurs à ne pas faire, en une carte
   (+ un outil de l'app, ex. le calculateur de ration, si la fiche en a un)

   Replié :
   5. Comment faire : transition et conseils pratiques
   6. Appeler la clinique et suivi
   7. Diètes à proposer
   8. Pour l'équipe : repères chiffrés, matière sèche

   Puis les sources. Une section sans contenu n'apparaît pas.
   ════════════════════════════════════════════════════════════ */

const VERT = '#2E7D62'
const ROUGE = 'var(--accent-red)'
const AMBRE = '#7A500A'
const ESPECES = {
  chien: { label: 'Chien', couleur: 'var(--primary)', fond: 'rgba(33,48,88,0.08)' },
  chat: { label: 'Chat', couleur: 'var(--accent-red)', fond: 'rgba(168,72,85,0.08)' },
}

const styleCarte = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }

// Espace insécable avant % ° : ; pour qu'ils ne se retrouvent jamais seuls en début de ligne,
// et liant invisible dans les intervalles (1-2) pour ne jamais les couper au trait d'union.
const insecable = texte => texte.replace(/ (?=[%°:;])/g, ' ').replace(/(\d)-(?=\d)/g, '$1-⁠')

function PastilleEspece({ espece }) {
  const e = ESPECES[espece]
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999, color: e.couleur, background: e.fond }}>
      {e.label}
    </span>
  )
}

// Liste à puces-icônes, réutilisée par plusieurs sections. Sans icône : une puce ronde.
function ListeIcones({ elements, icone, couleur, taille = 13 }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {elements.map(el => (
        <li key={el} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: taille, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {icone
            ? <i className={`ti ${icone}`} aria-hidden="true" style={{ color: couleur, fontSize: taille + 3, flexShrink: 0, marginTop: 1 }}></i>
            : <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: couleur, flexShrink: 0, marginTop: taille * 0.5, marginLeft: 4, marginRight: 4 }}></span>}
          <span>{insecable(el)}</span>
        </li>
      ))}
    </ul>
  )
}

function SousTitre({ children }) {
  return <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', margin: '0 0 6px' }}>{children}</p>
}

// Transition par quarts sur 7 jours (Wortinger et Burns, chap. 27 et 54).
const ETAPES_7_JOURS = [
  { jours: 'J 1-2', nouvelle: 25 },
  { jours: 'J 3-4', nouvelle: 50 },
  { jours: 'J 5-6', nouvelle: 75 },
  { jours: 'J 7', nouvelle: 100 },
]

// Transition alimentaire en 4 étapes : la part de nouvelle nourriture grandit.
function Transition({ duree = '7 jours', etapes = ETAPES_7_JOURS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SousTitre>Transition sur {duree}</SousTitre>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${etapes.length}, 1fr)`, gap: 6 }}>
        {etapes.map(e => (
          <div key={e.jours} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <div style={{ width: '100%', height: 8, borderRadius: 999, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <div style={{ width: `${e.nouvelle}%`, height: '100%', background: VERT }}></div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{e.nouvelle} %</span>
            <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{e.jours}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: 0 }}>Part de nouvelle nourriture, mélangée à l'ancienne.</p>
    </div>
  )
}

function MatiereSeche() {
  const [ouverte, setOuverte] = useState(false)
  return (
    <div className={`nutri-ms-expand${ouverte ? ' ouvert' : ''}`}>
      <button className="nutri-ms-btn" onClick={() => setOuverte(v => !v)}>
        <i className="ti ti-info-circle" style={{ color: 'var(--text-hint)', fontSize: 15 }}></i>
        Comprendre la matière sèche (MS)
        <i className="ti ti-chevron-down nutri-ms-chevron"></i>
      </button>
      <div className="nutri-ms-detail">
        <p>
          La <strong>matière sèche (MS)</strong> permet de comparer les aliments sans tenir compte de leur eau.
          Une conserve contient environ 75 à 80 % d'eau, une croquette environ 10 %.
        </p>
        <div className="nutri-formule">
          <strong>Formule :</strong><br />
          % nutriment (MS) = % nutriment (tel quel) ÷ (100 - % humidité) × 100
        </div>
      </div>
    </div>
  )
}

export default function FicheNutrition({ fiche }) {
  const navigate = useNavigate()
  const [ouverte, setOuverte] = useState(null)

  // Sections repliées, dans l'ordre ; celles sans contenu sont retirées.
  const replis = [
    (fiche.transition || fiche.pratique?.length > 0) && {
      id: 'pratique',
      icone: 'ti-list-check',
      titre: 'Comment faire',
      contenu: (
        <>
          {fiche.transition && <Transition {...fiche.transition} />}
          {fiche.pratique?.length > 0 && <ListeIcones elements={fiche.pratique} couleur="var(--primary)" />}
        </>
      ),
    },
    (fiche.appeler?.length > 0 || fiche.suivi?.length > 0) && {
      id: 'appeler',
      icone: 'ti-phone-call',
      titre: 'Appeler la clinique et suivi',
      contenu: (
        <>
          {fiche.appeler?.length > 0 && (
            <div>
              <SousTitre>Appeler la clinique si</SousTitre>
              <ListeIcones elements={fiche.appeler} icone="ti-alert-circle" couleur={AMBRE} />
            </div>
          )}
          {fiche.suivi?.length > 0 && (
            <div>
              <SousTitre>Suivi</SousTitre>
              <ListeIcones elements={fiche.suivi} icone="ti-calendar-event" couleur="var(--primary)" />
            </div>
          )}
        </>
      ),
    },
    fiche.dietes?.length > 0 && {
      id: 'dietes',
      icone: 'ti-bowl',
      titre: 'Diètes à proposer',
      sansMarge: true,
      contenu: (
        <>
          {fiche.dietes.map(d => (
            <div key={d.nom} className="nutri-aliment-item">
              <img src={d.img} alt="" className="nutri-aliment-logo" />
              <span className="nutri-aliment-nom">{d.nom}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: 0, padding: '8px 14px 10px' }}>Sur recommandation du vétérinaire.</p>
        </>
      ),
    },
    fiche.equipe && {
      id: 'equipe',
      icone: 'ti-stethoscope',
      titre: "Pour l'équipe : repères chiffrés",
      contenu: (
        <>
          <div className="nutri-reperes-grille" style={Object.keys(fiche.equipe.reperes).length === 1 ? { gridTemplateColumns: '1fr' } : undefined}>
            {Object.entries(fiche.equipe.reperes).map(([espece, valeurs]) => (
              <div key={espece} className="nutri-repere-col">
                <div className="nutri-repere-en-tete">
                  <div className="nutri-repere-point" style={{ background: ESPECES[espece].couleur }}></div>
                  <span className="nutri-repere-titre" style={{ color: ESPECES[espece].couleur }}>{ESPECES[espece].label}</span>
                </div>
                <div className="nutri-repere-pilules">
                  {valeurs.map(v => <span key={v} className="nutri-repere-pilule">{insecable(v)}</span>)}
                </div>
              </div>
            ))}
          </div>
          {fiche.equipe.notes?.length > 0 && <ListeIcones elements={fiche.equipe.notes} icone="ti-info-circle" couleur="var(--primary)" />}
          <MatiereSeche />
        </>
      ),
    },
  ].filter(Boolean)

  return (
    <div className="labo-detail-page" style={{ gap: 14 }}>

      {/* ─── 1. EN-TÊTE ───────────────────────── */}
      <div style={{ ...styleCarte, padding: '12px 14px', background: 'rgba(187,230,213,0.3)', borderColor: 'rgba(46,125,98,0.25)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {fiche.especes.map(e => <PastilleEspece key={e} espece={e} />)}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, margin: 0 }}>{insecable(fiche.objectif)}</p>
        {fiche.pourQui && <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}><strong>Pour qui&nbsp;:</strong> {insecable(fiche.pourQui)}</p>}
      </div>

      {/* ─── 2. À DIRE AU CLIENT ──────────────── */}
      <section>
        <div className="nutri-sec-titre" style={{ marginBottom: 8 }}>À dire au client</div>
        <ol style={{ ...styleCarte, listStyle: 'none', margin: 0, padding: 0 }}>
          {fiche.messages.map((m, i) => (
            <li key={m.titre} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderTop: i ? '1px solid var(--border)' : 'none' }}>
              <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{insecable(m.titre)}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{insecable(m.texte)}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── 3. À PRIVILÉGIER / À ÉVITER ──────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { titre: 'À privilégier', icone: 'ti-circle-check', puce: 'ti-check', couleur: VERT, fond: 'rgba(46,125,98,0.07)', bord: 'rgba(46,125,98,0.25)', elements: fiche.privilegier },
          { titre: 'À éviter', icone: 'ti-circle-x', puce: 'ti-x', couleur: ROUGE, fond: 'rgba(168,72,85,0.06)', bord: 'rgba(168,72,85,0.25)', elements: fiche.eviter },
        ].map(col => (
          <div key={col.titre} style={{ borderRadius: 'var(--radius-lg)', border: `1px solid ${col.bord}`, background: col.fond, padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: col.couleur }}>
              <i className={`ti ${col.icone}`} aria-hidden="true" style={{ fontSize: 18 }}></i>
              {col.titre}
            </span>
            <ListeIcones elements={col.elements} icone={col.puce} couleur={col.couleur} />
          </div>
        ))}
      </div>

      {/* ─── 4. IMPORTANT, EN UNE CARTE ───────── */}
      {fiche.alertes?.length > 0 && (
        <div className="nutri-alerte nutri-alerte--rouge" style={{ flexDirection: 'column', gap: 6, padding: '10px 14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: ROUGE }}>
            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 17 }}></i>
            Important
          </span>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fiche.alertes.map(a => (
              <li key={a.titre} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{insecable(a.titre)}.</strong> {insecable(a.texte)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── OUTIL DE L'APP ───────────────────── */}
      {fiche.lien && (
        <button
          type="button"
          onClick={() => navigate(fiche.lien.route)}
          style={{ ...styleCarte, width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-secondary)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }}
        >
          <i className={`ti ${fiche.lien.icone || 'ti-calculator'}`} aria-hidden="true" style={{ fontSize: 20, color: 'var(--primary)' }}></i>
          <span style={{ flex: 1 }}>{fiche.lien.label}</span>
          <i className="ti ti-chevron-right" aria-hidden="true" style={{ fontSize: 16, color: 'var(--text-hint)' }}></i>
        </button>
      )}

      {/* ─── 5 À 8. SECTIONS REPLIÉES ─────────── */}
      <div className="labo-tubes-liste" style={{ gap: 8 }}>
        {replis.map(r => {
          const estOuverte = ouverte === r.id
          return (
            <div key={r.id} className="labo-tube-card">
              <button className={`labo-tube-header${estOuverte ? ' ouvert' : ''}`} onClick={() => setOuverte(estOuverte ? null : r.id)} aria-expanded={estOuverte}>
                <i className={`ti ${r.icone}`} aria-hidden="true" style={{ fontSize: 18, color: 'var(--primary)' }}></i>
                <span className="labo-tube-nom">{r.titre}</span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuverte ? ' ouvert' : ''}`}></i>
              </button>
              {estOuverte && (
                <div style={r.sansMarge ? undefined : { padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {r.contenu}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── SOURCES ──────────────────────────── */}
      {fiche.sources?.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text-hint)', lineHeight: 1.5, margin: 0 }}>
          <strong>Sources&nbsp;:</strong> {fiche.sources.join(' · ')}
        </p>
      )}

      <SignalerErreur categorie="Nutrition" icone="ti-bowl" />
    </div>
  )
}
