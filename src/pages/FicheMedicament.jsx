import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'
import { TitreContext } from '../App'
import { useProfil } from '../context/ProfilContext'


// ─── DÉMARCHE DE CALCUL ───────────────────────────────────
function DemarcheCollapsible({ resultat, poids, unitePoids }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <div className="demarche-card">
      <button className="demarche-header" onClick={() => setOuvert(!ouvert)}>
        <h2>Démarche de calcul</h2>
        <i className={`ti ${ouvert ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
      </button>
      {ouvert && (
        <div className="demarche-contenu">
          <div className="demarche-etape">
            <span className="demarche-num">1</span>
            <div>
              <p className="demarche-titre">Poids converti en kg</p>
              <p className="demarche-calcul">
                {unitePoids === 'lb'
                  ? `${poids} lb ÷ 2,205 = ${resultat.poidsKg} kg`
                  : `${resultat.poidsKg} kg`}
              </p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">2</span>
            <div>
              <p className="demarche-titre">Dose sélectionnée</p>
              <p className="demarche-calcul">{resultat.poso} {resultat.uniteDose}</p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">3</span>
            <div>
              <p className="demarche-titre">Dose totale = poids (kg) × posologie</p>
              <p className="demarche-calcul">
                {resultat.etapeConversion ||
                  `${resultat.poidsKg} kg × ${resultat.poso} ${resultat.uniteDose} = ${resultat.doseTotale} mg`}
              </p>
            </div>
          </div>
          <div className="demarche-etape">
            <span className="demarche-num">4</span>
            <div>
              <p className="demarche-titre">Volume = dose totale ÷ concentration</p>
              <p className="demarche-calcul">
                {resultat.doseTotale} mg ÷ {resultat.conc} {resultat.uniteConc} = {resultat.volume} mL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SECTION COLLAPSIBLE ──────────────────────────────────
function SectionCollapsible({ titre, icone, contenu }) {
  const [ouvert, setOuvert] = useState(false)
  if (!contenu) return null
  return (
    <div className="demarche-card">
      <button className="demarche-header" onClick={() => setOuvert(!ouvert)}>
        <h2><i className={`ti ${icone}`} style={{ marginRight: '0.5rem' }}></i>{titre}</h2>
        <i className={`ti ${ouvert ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
      </button>
      {ouvert && (
        <div className="demarche-contenu">
          <p className="section-contenu" style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{contenu}</p>
        </div>
      )}
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────
export default function FicheMedicament() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [medicament, setMedicament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [estFavori, setEstFavori] = useState(false)
  const [estAdmin, setEstAdmin] = useState(false)
const { setTitreCustom } = useContext(TitreContext)
  // Calculateur
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [posologie, setPosologie] = useState('')
  const [concentration, setConcentration] = useState('')
  const [resultat, setResultat] = useState(null)
  const [horsPlage, setHorsPlage] = useState(false)
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro } = useProfil()
const estProRef = useRef(estPro)
estProRef.current = estPro

useEffect(() => {
  chargerDonnees()
}, [id])

useEffect(() => {
  if (medicament?.nom) {
    document.title = medicament.nom
  }
}, [medicament])
  useEffect(() => {
  if (medicament?.nom) setTitreCustom(medicament.nom)
  return () => setTitreCustom('')
}, [medicament])

  // Calcul automatique
  useEffect(() => {
    if (!poids || !posologie || !concentration || !medicament) {
      setResultat(null)
      return
    }

    const poidsKg = unitePoids === 'lb'
      ? Math.round((parseFloat(poids) / 2.205) * 100) / 100
      : parseFloat(poids)

    const uniteDose = medicament.unite_dose || 'mg/kg'
    const uniteConc = medicament.unite_concentration || 'mg/mL'
    const poso = parseFloat(posologie)
    const conc = parseFloat(concentration)

    let doseTotale
    let etapeConversion = null

    if (uniteDose === 'mcg/kg' && uniteConc === 'mg/mL') {
      doseTotale = (poidsKg * poso) / 1000
      etapeConversion = `${poidsKg} kg × ${poso} mcg/kg ÷ 1000 = ${doseTotale.toFixed(2)} mg`
    } else if (uniteDose === 'mg/kg' && uniteConc === 'mcg/mL') {
      doseTotale = poidsKg * poso * 1000
      etapeConversion = `${poidsKg} kg × ${poso} mg/kg × 1000 = ${doseTotale.toFixed(2)} mcg`
    } else {
      doseTotale = poidsKg * poso
    }

    const volume = doseTotale / conc

    // Vérifier hors plage
    if (medicament.dose_min && medicament.dose_max) {
      setHorsPlage(poso < medicament.dose_min || poso > medicament.dose_max)
    }

    setResultat({
      poidsKg: poidsKg.toFixed(2),
      unitePoids: unitePoids === 'lb' ? `(${poids} lb → ${poidsKg.toFixed(2)} kg)` : '',
      poso,
      doseTotale: doseTotale.toFixed(2),
      volume: volume.toFixed(2),
      uniteDose,
      uniteConc,
      conc,
      etapeConversion,
    })
  }, [poids, unitePoids, posologie, concentration, medicament])

  async function chargerDonnees() {
  setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: medBase }, { data: medCustomParId }, { data: medCustomDirect }, { data: fav }, { data: profil }] = await Promise.all([
  supabase.from('medicaments').select('*').eq('id', id).maybeSingle(),
  supabase.from('medicaments_custom').select('*').eq('user_id', user.id).eq('medicament_id', id).maybeSingle(),
  supabase.from('medicaments_custom').select('*').eq('user_id', user.id).eq('id', id).maybeSingle(),
  supabase.from('favoris').select('id').eq('user_id', user.id).eq('medicament_id', id).maybeSingle(),
  supabase.from('profiles').select('role').eq('id', user.id).single(),
])

const medCustom = medCustomParId || medCustomDirect
const med = (estProRef.current && medCustom) ? medCustom : (medBase || medCustomDirect)

      if (med) {
        setMedicament(med)
        console.log('especes:', med.especes)
        setPosologie(med.dose_min?.toString() || '')
        setConcentration(med.concentration?.toString() || '')
      }
      setEstFavori(!!fav)
      setEstAdmin(profil?.role === 'admin')
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleFavori() {
    const { data: { user } } = await supabase.auth.getUser()
    if (estFavori) {
      await supabase.from('favoris').delete()
        .eq('user_id', user.id).eq('medicament_id', id)
      setEstFavori(false)
    } else {
      await supabase.from('favoris').insert({ user_id: user.id, medicament_id: id })
      setEstFavori(true)
    }
  }

  const plageTexte = medicament?.dose_min && medicament?.dose_max
    ? `Recommandé : ${medicament.dose_min} à ${medicament.dose_max} ${medicament.unite_dose || 'mg/kg'}`
    : medicament?.dose_min
    ? `Recommandé : ${medicament.dose_min} ${medicament.unite_dose || 'mg/kg'}`
    : null

  if (loading) return <div className="admin-loading">Chargement...</div>
  if (!medicament) return <div className="admin-vide">Médicament introuvable</div>

  return (
    <div className="fiche-page">

      {/* TITRE + FAVORI + ESPÈCE */}
      <div className="fiche-top">
        <button
          className={`favori-btn-fiche ${estFavori ? 'actif' : ''}`}
          onClick={toggleFavori}
        >
          {estFavori ? '★' : '☆'}
        </button>
        <h1 className="fiche-nom">{medicament.nom}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
           <IconesEspeces especes={medicament.especes} taille={40} />
     <span className="fiche-espece-label">
  {medicament.especes?.length > 0
    ? medicament.especes.map(e => {
        const labels = {
          chien: 'Chien', chat: 'Chat', cheval: 'Cheval', vache: 'Vache',
          mouton: 'Mouton', lama: 'Lama', lapin: 'Lapin', furet: 'Furet',
          oiseau: 'Oiseau', serpent: 'Serpent', lezard: 'Lézard', tortue: 'Tortue',
          poisson: 'Poisson', amphibien: 'Amphibien', rongeur: 'Rongeur',
          chinchilla: 'Chinchilla', cobaye: 'Cochon d\'Inde', herisson: 'Hérisson',
        }
        return labels[e] || e
      }).join(', ')
    : ''}
</span></div>
        <button className="labo-btn-secondary-medicament" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => estPro ? navigate(`/drogues/fiche/${id}/personnaliser`) : setShowProMsg(true)}>
  <i className="ti ti-edit" style={{ marginRight: 4 }}></i>Modifier
</button>
      </div>

      <div className="fiche-scroll">

        {/* CALCULATEUR */}
        <div className="calc-form">

          {/* Poids */}
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
      placeholder="Ex: 5.2"
    />
    <div className="radio-groupe">
      <button className={`radio-btn ${unitePoids === 'kg' ? 'active' : ''}`} onClick={() => setUnitePoids('kg')}>kg</button>
      <button className={`radio-btn ${unitePoids === 'lb' ? 'active' : ''}`} onClick={() => setUnitePoids('lb')}>lb</button>
    </div>
  </div>
</div>

          {/* Posologie */}
          <div className="champ">
  <label>Posologie</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-seringue.svg" alt="posologie" />
    </div>
    <input
      type="text"
      inputMode="decimal"
      value={posologie}
      onChange={e => { setPosologie(e.target.value.replace(',', '.')); setHorsPlage(false) }}
      placeholder="Ex: 0.05"
    />
    <span className="unite-fixe">{medicament.unite_dose || 'mg/kg'}</span>
  </div>
  {plageTexte && <p className="range-hint">{plageTexte}</p>}
  {horsPlage && (
    <div className="avertissement-plage">
      <i className="ti ti-alert-triangle"></i>
      Dosage hors de la plage recommandée — veuillez confirmer avec le vétérinaire responsable.
    </div>
  )}
</div>

          {/* Concentration */}
          <div className="champ">
  <label>Concentration</label>
  <div className="champ-input">
    <div className="champ-icone-wrapper">
      <img src="/icone-fluido.svg" alt="concentration" />
    </div>
    <input
      type="text"
      inputMode="decimal"
      value={concentration}
      onChange={e => setConcentration(e.target.value.replace(',', '.'))}
      placeholder="Ex: 10"
    />
    <span className="unite-fixe">{medicament.unite_concentration || 'mg/mL'}</span>
  </div>
</div>

          {/* Résultats */}
          <div className="resultat-card">
  <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div className="champ-icone-wrapper">
      <img src="/icone-calc.svg" alt="résultats" />
    </div>
    Résultats
  </h2>
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-seringue.svg" alt="dose" />
      </div>
      Dose totale
    </span>
    <strong>{resultat ? `${resultat.doseTotale} mg` : '—'}</strong>
  </div>
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-fluido.svg" alt="volume" />
      </div>
      Volume à administrer
    </span>
    <strong>{resultat ? `${resultat.volume} mL` : '—'}</strong>
  </div>
  <div className="resultat-ligne">
    <span>Voies</span>
    <strong>{medicament.voies_admin?.join(', ') || '—'}</strong>
  </div>
</div>
          <div className="calc-avertissement">
  <i className="ti ti-alert-circle"></i>
  Valide toujours le dosage avec un vétérinaire avant d'administrer un médicament. Ce calculateur est un outil d'aide, ton jugement clinique prime en tout temps.
</div>

          {/* Démarche */}
          {resultat && (
            <DemarcheCollapsible resultat={resultat} poids={poids} unitePoids={unitePoids} />
          )}

        </div>

        {/* INFOS MÉDICAMENT */}
        <SectionCollapsible
          titre="Indication"
          icone="ti-stethoscope"
          contenu={medicament.indication}
        />
        <SectionCollapsible
          titre="Interactions médicamenteuses"
          icone="ti-alert-circle"
          contenu={medicament.interactions}
        />
        <SectionCollapsible
          titre="Effets secondaires"
          icone="ti-heart-rate-monitor"
          contenu={medicament.effets_secondaires}
        />
        <SectionCollapsible
          titre="Contre indications et précautions"
          icone="ti-ban"
          contenu={medicament.contre_indications}
        />
        <SectionCollapsible
          titre="Notes"
          icone="ti-notes"
          contenu={medicament.notes}
        />



        <div style={{ height: 40 }} />

      </div>
      {showProMsg && (
  <div className="popup-overlay" onClick={() => setShowProMsg(false)}>
    <div className="popup-card" onClick={e => e.stopPropagation()}>
      <div className="popup-header">
        <span>Fonctionnalité Pro</span>
        <button className="popup-close" onClick={() => setShowProMsg(false)}>✕</button>
      </div>
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-gold)', marginBottom: 12, display: 'block' }}></i>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
          La personnalisation des fiches médicaments est réservée au forfait <strong>Pro</strong>.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-hint)', lineHeight: 1.5 }}>
          Le forfait Pro sera disponible prochainement. Reste à l'affût !
        </p>
      </div>
      <button className="labo-btn-primary" style={{ width: '100%' }} onClick={() => setShowProMsg(false)}>
        Compris
      </button>
    </div>
  </div>
)}
    </div>
    
  )
}
