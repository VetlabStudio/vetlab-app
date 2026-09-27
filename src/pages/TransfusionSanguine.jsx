import { useState, useMemo } from 'react'

/* ════════════════════════════════════════════════════════════
   TRANSFUSION SANGUINE

   Volumes et formules : table de référence des produits
   sanguins (WB 2 mL/kg par point d'hématocrite, pRBC formule
   à fraction, plasma 10 à 20 mL/kg).
   Typage et épreuve croisée : MSD Veterinary Manual.
   Protocole d'administration et procédure : manuel de
   techniques, section Transfusions.
   ════════════════════════════════════════════════════════════ */

// Volume sanguin selon l'espèce (mL/kg)
const VOLUME_SANGUIN = { chien: 90, chat: 60 }

/* Plages de dose usuelles, servent de garde-fou au résultat.
   Au-delà, la page avertit plutôt que de bloquer. */
const PRODUITS = {
  complet: {
    id: 'complet',
    label: 'Sang complet',
    court: 'Sang complet',
    avecHematocrite: true,
    exempleHt: '45',
    indiceHt: 'Donneur, généralement entre 40 et 50 %',
    libelleHt: 'Hématocrite du donneur',
    plageMax: 20,
  },
  culot: {
    id: 'culot',
    label: 'Culot globulaire',
    court: 'Culot',
    avecHematocrite: true,
    exempleHt: '70',
    indiceHt: 'Poche, généralement entre 60 et 80 %',
    libelleHt: 'Hématocrite de la poche',
    plageMax: 10,
  },
  plasma: {
    id: 'plasma',
    label: 'Plasma frais congelé',
    court: 'Plasma',
    avecHematocrite: false,
    doses: [10, 15, 20],
    plageMax: 20,
  },
}

const DUREE_MAX_HEURES = 4       // au-delà, risque de croissance bactérienne
const DEBIT_DEPART = 0.5         // mL/kg/h pendant 10 à 15 min

const TYPAGE = {
  chien: [
    'Typage DEA 1 fortement recommandé avant la première transfusion.',
    'Épreuve croisée majeure requise plus de 4 jours après toute transfusion antérieure.',
  ],
  chat: [
    'Typage AB essentiel avant toute transfusion : les chats ont des anticorps naturels.',
    'Épreuve croisée recommandée peu importe l’historique, dès 2 jours après une transfusion antérieure.',
  ],
}

const MATERIEL_COMMUN = [
  'Produit sanguin',
  'Feuille de suivi',
]

const MATERIEL_GROS = [
  'Tubulure d’administration avec filtre intégré',
]

const MATERIEL_PETIT = [
  'Perforateur à filtre 18 microns',
  'Filtre 18 microns',
  'Seringue de taille appropriée',
  'Rallonge, pas de microbore',
]

const ETAPES = [
  'Mettre des gants d’examen.',
  'Gros volumes : perforer la poche avec la tubulure munie du filtre intégré. Petits volumes : perforer avec un perforateur à filtre ou un connecteur Clave, et utiliser une aiguille de gros calibre s’il n’y a pas de valve à déplacement négatif. Prélever le volume voulu dans une seringue, puis monter la rallonge et le filtre. L’ordre entre la seringue et le bout de la rallonge n’a pas d’importance.',
  'Purger la tubulure ou la rallonge, filtre inclus.',
  'Raccorder au cathéter intraveineux du patient.',
  'Régler la pompe, ou le débit manuel, au débit de départ.',
  'Augmenter le débit aux 10 à 15 minutes en l’absence de réaction. Prendre et noter les signes vitaux avant chaque augmentation.',
  'Une fois le débit maximal atteint, prendre et noter les signes vitaux à chaque heure.',
  'À la fin, rincer la tubulure au salin.',
  'Vérifier l’hématocrite et les protéines totales 1 à 2 heures après la transfusion.',
  'Surveiller les réactions transfusionnelles retardées dans les jours suivants.',
]

const SURVEILLANCE = [
  'Signes vitaux avant chaque augmentation de débit, soit aux 10 à 15 minutes au début.',
  'Signes vitaux à chaque heure une fois le débit maximal atteint.',
  'Hématocrite et protéines totales 1 à 2 heures après la fin.',
  'Contrôle 24 heures après, puis surveillance des réactions retardées.',
]

// ─── OUTILS ──────────────────────────────────────────────────

function arrondir(val, decimales = 1) {
  if (!val || isNaN(val) || !isFinite(val)) return null
  return Math.round(val * Math.pow(10, decimales)) / Math.pow(10, decimales)
}

function formaterNombre(v) {
  if (v === null || !isFinite(v)) return '—'
  if (v >= 100) return String(Math.round(v))
  if (v < 0.1) return String(arrondir(v, 3))
  return String(arrondir(v, 2))
}

function nombreValide(texte) {
  const n = parseFloat(texte)
  return isFinite(n) ? n : null
}

// ─── COMPOSANT ───────────────────────────────────────────────

export default function TransfusionSanguine() {
  const [produitId, setProduitId] = useState('culot')
  const [espece, setEspece] = useState('chien')
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [htActuel, setHtActuel] = useState('')
  const [htSouhaite, setHtSouhaite] = useState('')
  const [htProduit, setHtProduit] = useState('')
  const [dosePlasma, setDosePlasma] = useState(15)
  const [blocsOuverts, setBlocsOuverts] = useState([])

  const produit = PRODUITS[produitId]

  const poidsKg = useMemo(() => {
    const p = parseFloat(poids)
    if (!p || p <= 0) return 0
    return unitePoids === 'lb' ? arrondir(p / 2.205, 3) : p
  }, [poids, unitePoids])

  // ─── CALCUL ────────────────────────────────────────────────

  const calcul = useMemo(() => {
    if (!poidsKg) return { volume: null, message: null }

    if (!produit.avecHematocrite) {
      const brut = dosePlasma * poidsKg
      return { volume: arrondir(brut), volumeBrut: brut, message: null }
    }

    const a = nombreValide(htActuel)
    const s = nombreValide(htSouhaite)
    const d = nombreValide(htProduit)
    if (a === null || s === null || d === null) return { volume: null, message: null }

    for (const v of [a, s, d]) {
      if (v <= 0 || v > 100) {
        return { volume: null, message: 'Un hématocrite doit se situer entre 1 et 100 %.' }
      }
    }
    if (s <= a) {
      return {
        volume: null,
        message: 'L’hématocrite souhaité doit être supérieur à l’hématocrite actuel.',
      }
    }

    const brut = ((s - a) / d) * VOLUME_SANGUIN[espece] * poidsKg
    return { volume: arrondir(brut), volumeBrut: brut, message: null, hausse: s - a }
  }, [poidsKg, produit, dosePlasma, htActuel, htSouhaite, htProduit, espece])

  const volume = calcul.volume

  /* Rapport calculé sur le volume non arrondi : sinon le double
     arrondi du poids en livres puis du volume suffit à faire
     franchir la borne de quelques millièmes. */
  const mlParKg = calcul.volumeBrut && poidsKg ? calcul.volumeBrut / poidsKg : null

  /* Le garde-fou ne vaut que pour un volume déduit des
     hématocrites. Pour le plasma, la dose est choisie dans une
     liste qui est déjà la plage : avertir serait reprocher à
     l'utilisateur un choix que la page lui a offert. */
  const horsPlage = produit.avecHematocrite
    && mlParKg !== null
    && mlParKg > produit.plageMax

  const debitDepart = poidsKg ? DEBIT_DEPART * poidsKg : null
  const debitMoyen = volume ? volume / DUREE_MAX_HEURES : null

  // ─── ACTIONS ───────────────────────────────────────────────

  function basculerBloc(id) {
    setBlocsOuverts(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  function changerProduit(id) {
    setProduitId(id)
    if (!PRODUITS[id].avecHematocrite) return
    setHtProduit('')
  }

  function blocReplie(id, icone, titre, contenu) {
    const ouvert = blocsOuverts.includes(id)
    return (
      <div className="bloc-repli" key={id}>
        <button
          type="button"
          className={`bloc-repli-entete ${ouvert ? 'ouvert' : ''}`}
          onClick={() => basculerBloc(id)}
          aria-expanded={ouvert}
        >
          <i className={`ti ${icone} bloc-repli-icone`}></i>
          <span className="bloc-repli-label">{titre}</span>
          <i className={`ti ti-chevron-${ouvert ? 'up' : 'down'}`}></i>
        </button>
        {ouvert && <div className="bloc-repli-contenu">{contenu}</div>}
      </div>
    )
  }

  return (
    <div className="page-calculateurs">
      <div className="calc-form">

        {/* ─── PRODUIT ────────────────────────── */}
        <div className="champ">
          <label>Produit sanguin</label>
          <div className="fluido-valeurs">
            {Object.values(PRODUITS).map(p => (
              <button
                key={p.id}
                type="button"
                className={`fluido-valeur-btn ${produitId === p.id ? 'actif' : ''}`}
                onClick={() => changerProduit(p.id)}
              >
                {p.court}
              </button>
            ))}
          </div>
        </div>

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
          {produit.avecHematocrite && (
            <p className="range-hint">
              Volume sanguin utilisé : <strong>{VOLUME_SANGUIN[espece]} mL/kg</strong>
            </p>
          )}
        </div>

        {/* ─── POIDS ──────────────────────────── */}
        <div className="champ">
          <label>Poids de l'animal</label>
          <div className="champ-input">
            <div className="champ-icone-wrapper">
              <img src="/icone-poids.svg" alt="poids" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={poids}
              onChange={e => setPoids(e.target.value.replace(',', '.'))}
              placeholder="Ex: 10"
            />
            <div className="radio-groupe">
              <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
              <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
            </div>
          </div>
        </div>

        {/* ─── HÉMATOCRITES, SANG COMPLET ET CULOT ─ */}
        {produit.avecHematocrite ? (
          <>
            <div className="conversion-deux-colonnes">
              <div className="champ">
                <label>Hématocrite actuel</label>
                <div className="champ-input">
                  <div className="champ-icone-wrapper">
                    <img src="/icone-sang.svg" alt="hématocrite actuel" style={{ width: 30, height: 30 }} />
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={htActuel}
                    onChange={e => setHtActuel(e.target.value.replace(',', '.'))}
                    placeholder="Ex: 15"
                  />
                  <span className="unite-fixe">%</span>
                </div>
              </div>
              <div className="champ">
                <label>Hématocrite souhaité</label>
                <div className="champ-input">
                  <div className="champ-icone-wrapper">
                    <img src="/icone-sang.svg" alt="hématocrite souhaité" style={{ width: 30, height: 30 }}/>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={htSouhaite}
                    onChange={e => setHtSouhaite(e.target.value.replace(',', '.'))}
                    placeholder="Ex: 25"
                  />
                  <span className="unite-fixe">%</span>
                </div>
              </div>
            </div>

            <div className="champ">
              <label>{produit.libelleHt}</label>
              <div className="champ-input">
                <div className="champ-icone-wrapper">
                  <img src="/icone-sang.svg" alt={produit.libelleHt}style={{ width: 30, height: 30 }} />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={htProduit}
                  onChange={e => setHtProduit(e.target.value.replace(',', '.'))}
                  placeholder={`Ex: ${produit.exempleHt}`}
                />
                <span className="unite-fixe">%</span>
              </div>
              <p className="range-hint">{produit.indiceHt}</p>
            </div>
          </>
        ) : (
          /* ─── DOSE, PLASMA ─────────────────── */
          <div className="champ">
            <label>Dose</label>
            <div className="fluido-valeurs">
              {produit.doses.map(d => (
                <button
                  key={d}
                  type="button"
                  className={`fluido-valeur-btn ${dosePlasma === d ? 'actif' : ''}`}
                  onClick={() => setDosePlasma(d)}
                >
                  {d} mL/kg
                </button>
              ))}
            </div>
            <p className="range-hint">
              Le plasma se dose au poids. L'hématocrite n'entre pas dans le calcul.
            </p>
          </div>
        )}

        {/* ─── MESSAGE DE SAISIE ──────────────── */}
        {calcul.message && (
          <p className="range-hint" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
            <i className="ti ti-alert-circle" style={{ marginRight: 4 }}></i>
            {calcul.message}
          </p>
        )}

        {/* ─── RÉSULTAT ───────────────────────── */}
        <div className="res-primaire">
          <span className="res-primaire-cle">Volume à transfuser</span>
          <p className="res-primaire-valeur">
            {volume !== null ? formaterNombre(volume) : '—'}
            <span className="res-unite">mL</span>
          </p>
          {volume !== null && produit.avecHematocrite && (
            <>
              <div className="res-primaire-sep"></div>
              <p className="res-primaire-note">
                {formaterNombre(mlParKg)} mL/kg · plage usuelle jusqu'à {produit.plageMax} mL/kg
              </p>
            </>
          )}
        </div>

        {horsPlage && (
          <div className="transf-alerte">
            <i className="ti ti-alert-triangle"></i>
            {formaterNombre(mlParKg)} mL/kg dépasse la plage usuelle de {produit.plageMax} mL/kg
            pour ce produit. Soit la cible d'hématocrite est ambitieuse et demandera plus d'une
            administration, soit une valeur est mal saisie.
          </div>
        )}

        {/* ─── ADMINISTRATION ─────────────────── */}
        {volume !== null && (
          <div className="res-etape fort">
            <span className="res-etape-cle">Administration</span>
            <span className="res-etape-valeur">
              {formaterNombre(debitDepart)}
              <span className="res-unite">mL/h au départ</span>
            </span>
            <span className="res-etape-trace">
              {DEBIT_DEPART} mL/kg/h pendant les 10 à 15 premières minutes, puis augmenter
              par paliers aux 10 à 15 minutes en l'absence de réaction.
            </span>
            <span className="res-etape-trace">
              Pour terminer en {DUREE_MAX_HEURES} heures, viser une moyenne de{' '}
              <strong>{formaterNombre(debitMoyen)} mL/h</strong>. Ne pas dépasser cette durée
              pour une même poche.
            </span>
          </div>
        )}

        {/* ─── TYPAGE ─────────────────────────── */}
        <div className="transf-typage">
          <div className="transf-typage-titre">
            <i className="ti ti-test-pipe"></i>
            Avant de transfuser
          </div>
          {TYPAGE[espece].map((ligne, i) => (
            <p key={i}>{ligne}</p>
          ))}
        </div>

        {/* ─── BLOCS REPLIÉS ──────────────────── */}
        {blocReplie('materiel', 'ti-box', 'Matériel', (
          <>
            <ul className="transf-liste">
              {MATERIEL_COMMUN.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
            <p className="transf-sous-titre">Gros volumes</p>
            <ul className="transf-liste">
              {MATERIEL_GROS.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
            <p className="transf-sous-titre">Petits volumes</p>
            <ul className="transf-liste">
              {MATERIEL_PETIT.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </>
        ))}

        {blocReplie('procedure', 'ti-list-numbers', 'Procédure', (
          <>
            <ol className="transf-etapes">
              {ETAPES.map((e, i) => <li key={i}>{e}</li>)}
            </ol>
            <div className="transf-astuce">
              <i className="ti ti-bulb"></i>
              Chez un petit patient à débit lent, purger aussi le prolongateur en T, sinon
              le produit n'atteindra pas l'animal durant le premier palier.
            </div>
          </>
        ))}

        {blocReplie('surveillance', 'ti-stethoscope', 'Surveillance', (
          <ul className="transf-liste">
            {SURVEILLANCE.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        ))}

        {/* ─── AVERTISSEMENT ──────────────────── */}
        <div className="calc-avertissement">
          <i className="ti ti-alert-circle"></i>
          Valide toujours avec le vétérinaire responsable avant d'administrer. Surveiller
          attentivement les réactions transfusionnelles durant toute la procédure et dans
          les jours qui suivent.
        </div>

      </div>
    </div>
  )
}
