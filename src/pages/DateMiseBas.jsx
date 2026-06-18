import { useState, useMemo } from 'react'

const ESPECES = [
  { id: 'chien',   label: 'Chien',   icone: '/icone-chien.svg' },
  { id: 'chat',    label: 'Chat',    icone: '/icone-chat.svg' },
  { id: 'lapin',   label: 'Lapin',   icone: '/icone-lapin.png' },
  { id: 'cheval',  label: 'Cheval',  icone: '/icone-cheval.png' },
  { id: 'vache',   label: 'Vache',   icone: '/icone-vache.png' },
  { id: 'mouton',  label: 'Mouton',  icone: '/icone-mouton.png' },
  { id: 'chevre',  label: 'Chèvre',  icone: '/icone-chevre.png' },
  { id: 'lama',    label: 'Lama',    icone: '/icone-lama.png' },
  { id: 'cochon',  label: 'Cochon',  icone: '/icone-cochon.png' },
  { id: 'furet',   label: 'Furet',   icone: '/icone-furet.png' },
  { id: 'rat',     label: 'Rat',     icone: '/icone-rongeurs.png' },
  { id: 'souris',  label: 'Souris',  icone: '/icone-rongeurs.png' },
  { id: 'hamster', label: 'Hamster', icone: '/icone-rongeurs.png' },
]

const INFO_GESTATION = {
  chien: {
    dureeMin: 58, dureeMax: 68, dureeMoyenne: 63,
    cycle: "Pas de véritable cycle œstral continu : la chienne cycle environ deux fois par an (polyoestrus saisonnier non strict). L'ovulation survient peu après le pic de LH, généralement 1 à 2 jours après le début des chaleurs comportementales.",
  },
  chat: {
    dureeMin: 60, dureeMax: 69, dureeMoyenne: 63,
    cycle: "Polyoestrus saisonnier avec ovulation induite par l'accouplement. En l'absence de saillie, la chatte revient en chaleurs tous les 14 à 21 jours durant la saison de reproduction.",
  },
  lapin: {
    dureeMin: 30, dureeMax: 32, dureeMoyenne: 31,
    cycle: "Polyoestrus avec ovulation induite par l'accouplement (pas de cycle œstral fixe). La lapine peut être réceptive presque en continu et ovule environ 10 heures après la saillie.",
  },
  cheval: {
    dureeMin: 320, dureeMax: 346, dureeMoyenne: 335,
    cycle: "Polyoestrus saisonnier (saison de reproduction au printemps/été selon la photopériode). Cycle œstral d'environ 21 jours, avec des chaleurs durant 5 à 7 jours.",
  },
  vache: {
    dureeMin: 271, dureeMax: 291, dureeMoyenne: 280,
    cycle: "Polyoestrus non saisonnier. Cycle œstral d'environ 21 jours (18 à 24 jours), avec des chaleurs durant 12 à 18 heures.",
  },
  mouton: {
    dureeMin: 143, dureeMax: 151, dureeMoyenne: 147,
    cycle: "Polyoestrus saisonnier (jours courts à l'automne). Cycle œstral d'environ 17 jours, avec des chaleurs durant 24 à 36 heures.",
  },
  chevre: {
    dureeMin: 145, dureeMax: 155, dureeMoyenne: 149,
    cycle: "Polyoestrus saisonnier (jours courts à l'automne). Cycle œstral d'environ 21 jours, avec des chaleurs durant 24 à 48 heures.",
  },
  lama: {
    dureeMin: 335, dureeMax: 365, dureeMoyenne: 350,
    cycle: "Polyoestrus avec ovulation induite par l'accouplement. Pas de cycle œstral fixe : la femelle peut être réceptive presque en permanence, avec un nouveau follicule dominant environ tous les 8 à 12 jours.",
  },
  cochon: {
    dureeMin: 112, dureeMax: 115, dureeMoyenne: 114,
    cycle: "Polyoestrus non saisonnier (« 3 mois, 3 semaines et 3 jours »). Cycle œstral d'environ 21 jours, avec des chaleurs durant 2 à 3 jours.",
  },
  furet: {
    dureeMin: 41, dureeMax: 43, dureeMoyenne: 42,
    cycle: "Polyoestrus saisonnier avec ovulation induite par l'accouplement. En l'absence de saillie, la femelle peut rester en chaleurs prolongées, ce qui comporte un risque d'aplasie médullaire liée à l'œstrogène.",
  },
  rat: {
    dureeMin: 21, dureeMax: 23, dureeMoyenne: 22,
    cycle: "Polyoestrus non saisonnier. Cycle œstral très court, d'environ 4 à 5 jours.",
  },
  souris: {
    dureeMin: 19, dureeMax: 21, dureeMoyenne: 20,
    cycle: "Polyoestrus non saisonnier. Cycle œstral très court, d'environ 4 à 5 jours.",
  },
  hamster: {
    dureeMin: 16, dureeMax: 18, dureeMoyenne: 17,
    cycle: "Polyoestrus non saisonnier. Cycle œstral très court et régulier, d'environ 4 jours.",
  },
}

function ajouterJours(date, jours) {
  const [annee, mois, jour] = typeof date === 'string'
    ? date.split('-').map(Number)
    : [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  const d = new Date(annee, mois - 1, jour)
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
  const [popupEspece, setPopupEspece] = useState(false)

  const info = INFO_GESTATION[espece]
  const especeChoisie = ESPECES.find(e => e.id === espece)

  const dates = useMemo(() => {
    if (!dateAccouplement) return null
    const [a, m, j] = dateAccouplement.split('-').map(Number)
    const base = new Date(a, m - 1, j)
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
        <div className="form-groupe">
          <label className="form-label">Espèce</label>
          <div className="espece-choisir">
            <span className="espece-choisie-texte" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={especeChoisie.icone} alt="" className="espece-icone-popup" style={{ width: 24, height: 24 }} />
              {especeChoisie.label}
            </span>
            <button type="button" className="btn-choisir-espece" onClick={() => setPopupEspece(true)}>
              Choisir
            </button>
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

        {/* ─── CYCLE / ŒSTRUS ───────────────────── */}
        <div className="mise-bas-section">
          <h3 className="mise-bas-titre">Cycle et œstrus — {especeChoisie.label}</h3>
          <p className="mise-bas-note">
            <i className="ti ti-info-circle"></i>
            {info.cycle}
          </p>
        </div>

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Ces dates sont des estimations basées sur la date d'accouplement. Un suivi vétérinaire régulier est indispensable pour une datation précise.
        </div>

      </div>

      {popupEspece && (
        <div className="popup-overlay" onClick={() => setPopupEspece(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Choisir une espèce</span>
              <button className="popup-close" onClick={() => setPopupEspece(false)}>✕</button>
            </div>
            <div className="popup-especes">
              {ESPECES.map(esp => (
                <label key={esp.id} className="popup-espece-item">
                  <input type="radio" checked={espece === esp.id} onChange={() => { setEspece(esp.id); setPopupEspece(false) }} />
                  <img src={esp.icone} alt={esp.label} className="espece-icone-popup" />
                  <span>{esp.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
