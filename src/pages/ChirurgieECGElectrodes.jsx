import { useState } from 'react'
import { t } from '../lib/i18n'

/* Couleurs des électrodes selon la norme de l'appareil : AHA en Amérique du
   Nord, IEC en Europe. Le placement est le même ; seules les couleurs
   changent. Les lettres des fiches sont les mêmes partout. */
const COULEURS = {
  blanche: { nom: t('Blanche'), hex: '#ffffff' },
  noire: { nom: t('Noire'), hex: '#1a1a1a' },
  verte: { nom: t('Verte'), hex: '#0a8a4a' },
  rouge: { nom: t('Rouge'), hex: '#c0172d' },
  jaune: { nom: t('Jaune'), hex: '#f2c200' },
}

const NORMES = [
  { id: 'aha', label: t('Amérique du Nord'), norme: t('Norme AHA') },
  { id: 'iec', label: t('Europe'), norme: t('Norme IEC') },
]

// x, y : centre du point sur l'image chien-electrodes.png (1019 × 587).
const ELECTRODES = [
  { electrode: t('Membre antérieur droit'), lettres: t('RA (ou R)'), aha: 'blanche', iec: 'rouge', position: t('Partie distale (près du coude ou carpe)'), x: 307, y: 348 },
  { electrode: t('Membre antérieur gauche'), lettres: t('LA (ou L)'), aha: 'noire', iec: 'jaune', position: t('Partie distale (près du coude ou carpe)'), x: 415, y: 359 },
  { electrode: t('Membre postérieur droit'), lettres: t('RL (ou N)'), aha: 'verte', iec: 'noire', position: t('Partie distale (près du tarse ou jarret)'), x: 595, y: 359 },
  { electrode: t('Membre postérieur gauche'), lettres: t('LL (ou F)'), aha: 'rouge', iec: 'verte', position: t('Partie distale (près du tarse ou jarret)'), x: 667, y: 348 },
]

const CONSEILS = [
  t('L\'animal doit être en décubitus latéral droit (couché sur le côté droit).'),
  t('Assurer un bon contact peau-électrode : utiliser de l\'alcool ou un gel conducteur.'),
  t('Garder l\'animal calme et immobile pour éviter les interférences.'),
]

const CLE_NORME = 'vetlab_ecg_norme'

function normeMemorisee() {
  try {
    const v = localStorage.getItem(CLE_NORME)
    return NORMES.some(n => n.id === v) ? v : 'aha'
  } catch {
    return 'aha'
  }
}

export default function ChirurgieECGElectrodes() {
  const [norme, setNorme] = useState(normeMemorisee)

  function choisir(id) {
    setNorme(id)
    try { localStorage.setItem(CLE_NORME, id) } catch { /* stockage indisponible */ }
  }

  return (
    <div className="labo-detail-page">

      <div className="drogues-filtres" style={{ padding: 0, justifyContent: 'center' }} role="group" aria-label={t('Norme des couleurs')}>
        {NORMES.map(n => (
          <button
            key={n.id}
            className={`drogues-filtre-btn ${norme === n.id ? 'actif' : ''}`}
            aria-pressed={norme === n.id}
            onClick={() => choisir(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '80%', maxWidth: 420, margin: '0 auto' }}>
        <img src="/chien-electrodes.png" alt={t('Positionnement des électrodes ECG')} style={{ display: 'block', width: '100%', borderRadius: 'var(--radius-md)' }} />
        {/* Points redessinés par-dessus l'image, aux couleurs de la norme choisie. */}
        <svg viewBox="0 0 1019 587" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {ELECTRODES.map(e => {
            const c = COULEURS[e[norme]]
            return <circle key={e.electrode} cx={e.x} cy={e.y} r="14" fill={c.hex} stroke="#1a1a1a" strokeWidth="3" />
          })}
        </svg>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--gauche">
            <span>{t('Électrode')}</span>
            <span>{t('Couleur')}</span>
            <span>{t('Position recommandée')}</span>
          </div>
          {ELECTRODES.map(e => {
            const c = COULEURS[e[norme]]
            return (
              <div key={e.electrode} className="labo-ref-ligne">
                <span>
                  {e.electrode}
                  <span style={{ display: 'block', marginTop: 2, fontSize: 11, color: 'var(--text-hint)' }}>{e.lettres}</span>
                </span>
                <span className="labo-ref-normal" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, flexShrink: 0, borderRadius: '50%', background: c.hex, border: '1.5px solid #1a1a1a' }} aria-hidden="true"></span>
                  {c.nom}
                </span>
                <span>{e.position}</span>
              </div>
            )
          })}
        </div>
        <p style={{ display: 'flex', gap: 6, margin: '8px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--text-hint)' }}>
          <i className="ti ti-info-circle" aria-hidden="true" style={{ marginTop: 2, flexShrink: 0 }}></i>
          <span>
            {NORMES.find(n => n.id === norme).norme}. {t('Vérifiez la norme de votre appareil : les lettres sur les fiches (RA, LA, RL, LL ou R, L, N, F) sont les mêmes partout, mais pas les couleurs.')}
          </span>
        </p>
      </div>

      <div className="postop-section">
        <div className="postop-section-header">
          <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
            <i className="ti ti-circle-check"></i>
          </div>
          <h2 className="postop-section-titre">{t('Conseils pratiques')}</h2>
        </div>
        <ul className="postop-alerte-liste">
          {CONSEILS.map((c, i) => (
            <li key={i} className="postop-alerte-item">
              <i className="ti ti-paw postop-alerte-puce"></i>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
