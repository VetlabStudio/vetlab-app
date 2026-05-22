import { useState, useMemo } from 'react'

const INFO_GESTATION = {
  chien: {
    dureeMin: 57,
    dureeMax: 65,
    dureeMoyenne: 63,
    etapes: [
      { jours: '~15-18', texte: "Implantation des zygotes dans l'utérus" },
      { jours: '~21', texte: 'Palpation abdominale possible (ampoules fœtales)' },
      { jours: '~21-25', texte: 'Échographie recommandée pour confirmer la gestation (battements cardiaques visibles)' },
      { jours: '~21-25', texte: 'Dosage de la relaxine possible (attention aux faux négatifs avant 25 jours)' },
      { jours: '~28-35', texte: 'Meilleure fenêtre pour le dénombrement des fœtus par échographie' },
      { jours: '~36', texte: 'Palpation plus difficile — risque de confusion avec les viscères' },
      { jours: '~45', texte: 'Minéralisation du squelette visible à la radiographie' },
      { jours: '~50', texte: 'La palpation redevient possible' },
      { jours: '~50+', texte: 'Radiographie recommandée pour dénombrer les chiots avec précision (deux vues orthogonales)' },
      { jours: '~48-50+', texte: "Auscultation des bruits cardiaques fœtaux au stéthoscope possible" },
    ],
    note: "Le Doppler échographique permet de détecter le cœur des fœtus et de distinguer une gestation d'une distension abdominale d'autre cause.",
  },
  chat: {
    dureeMin: 60,
    dureeMax: 67,
    dureeMoyenne: 64,
    etapes: [
      { jours: '~14', texte: "Implantation des zygotes dans l'utérus" },
      { jours: '~21', texte: 'Palpation abdominale possible' },
      { jours: '~18-21', texte: 'Échographie recommandée pour confirmer la gestation' },
      { jours: '~28-35', texte: 'Meilleure fenêtre pour le dénombrement des fœtus par échographie' },
      { jours: 'Avant 21', texte: 'Risque de faux négatif à l\'échographie' },
      { jours: '~40', texte: 'Minéralisation du squelette visible à la radiographie' },
      { jours: '~40+', texte: 'Radiographie recommandée pour dénombrer les chatons avec précision' },
      { jours: '~48-50+', texte: "Auscultation des bruits cardiaques fœtaux au stéthoscope possible" },
    ],
    note: "Le Doppler échographique permet de détecter le cœur des fœtus et de distinguer une gestation d'une distension abdominale d'autre cause.",
  },
}

function ajouterJours(date, jours) {
  const d = new Date(date)
  d.setDate(d.getDate() + jours)
  return d
}

function formaterDate(date) {
  return date.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DateMiseBas() {
  const [espece, setEspece] = useState('chien')
  const [dateAccouplement, setDateAccouplement] = useState('')

  const info = INFO_GESTATION[espece]

  const dates = useMemo(() => {
    if (!dateAccouplement) return null
    const base = new Date(dateAccouplement)
    return {
      tot:     ajouterJours(base, info.dureeMin),
      moyenne: ajouterJours(base, info.dureeMoyenne),
      tard:    ajouterJours(base, info.dureeMax),
    }
  }, [dateAccouplement, espece, info])

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── ESPÈCE ─────────────────────────── */}
        <div className="champ">
          <label>Espèce</label>
          <div className="espece-toggle">
            <span className={`espece-label ${espece === 'chien' ? 'active' : ''}`}>
              <img src="/icone-chien.svg" alt="Chien" className="espece-icone" />
              Chien
            </span>
            <div
              className={`toggle-slider ${espece === 'chat' ? 'droite' : ''}`}
              onClick={() => setEspece(espece === 'chien' ? 'chat' : 'chien')}
            >
              <div className="toggle-thumb"></div>
            </div>
            <span className={`espece-label ${espece === 'chat' ? 'active' : ''}`}>
              <img src="/icone-chat.svg" alt="Chat" className="espece-icone" />
              Chat
            </span>
          </div>
          <p className="range-hint">
            Durée de gestation : <strong>{info.dureeMin}–{info.dureeMax} jours</strong>, en moyenne <strong>{info.dureeMoyenne} jours</strong>
          </p>
        </div>

        {/* ─── DATE ACCOUPLEMENT ───────────────── */}
        <div className="champ">
          <label>Date de l'accouplement</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-calendrier.svg" alt="calendrier" />
            </div>
            <input
              type="date"
              value={dateAccouplement}
              onChange={e => setDateAccouplement(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: '1rem', color: 'var(--text-primary)', padding: '8px 0' }}
            />
          </div>
        </div>

        {/* ─── RÉSULTATS ───────────────────────── */}
        {dates && (
          <div className="resultat-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="champ-icone-wrapper">
                <img src="/icone-calendrier.svg" alt="dates" />
              </div>
              Dates estimées de mise bas
            </h2>

            <div className="resultat-ligne">
  <span>🟢 Date précoce ({info.dureeMin} jours)</span>
  <strong style={{ fontSize: 13 }}>{formaterDate(dates.tot)}</strong>
</div>
<div className="resultat-ligne" style={{ background: 'rgba(37,77,86,0.06)', borderRadius: 8, padding: '10px 12px', margin: '4px 0' }}>
  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
  <img src="/icone-duree.svg" alt="durée" style={{ width: 18, height: 18 }} />
  Date moyenne ({info.dureeMoyenne} jours)
</span>
  <strong style={{ color: 'var(--primary)' }}>{formaterDate(dates.moyenne)}</strong>
</div>
<div className="resultat-ligne" style={{ borderBottom: 'none', paddingBottom: 0 }}>
  <span>🔴 Date tardive ({info.dureeMax} jours)</span>
  <strong style={{ fontSize: 13 }}>{formaterDate(dates.tard)}</strong>
</div>
          </div>
        )}

        {/* ─── ÉTAPES DE LA GESTATION ─────────── */}
        <div className="mise-bas-section">
          <h3 className="mise-bas-titre">Suivi de la gestation — {espece === 'chien' ? 'Chien' : 'Chat'}</h3>
          <div className="mise-bas-etapes">
            {info.etapes.map((e, i) => (
              <div key={i} className="mise-bas-etape">
                <span className="mise-bas-jours">{e.jours} j</span>
                <span className="mise-bas-texte">{e.texte}</span>
              </div>
            ))}
          </div>
          <p className="mise-bas-note">
            <i className="ti ti-info-circle"></i>
            {info.note}
          </p>
        </div>

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Ces dates sont des estimations basées sur la date d'accouplement. Un suivi vétérinaire régulier est indispensable pour une datation précise.
        </div>

      </div>
    </div>
  )
}
