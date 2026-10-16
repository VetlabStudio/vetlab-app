import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'
import { TitreContext } from '../context/NavigationContext'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i


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
  const [estMedCustom, setEstMedCustom] = useState(false)
const { setTitreCustom } = useContext(TitreContext)
  // Calculateur
  const [poids, setPoids] = useState('')
  const [unitePoids, setUnitePoids] = useState('kg')
  const [posologie, setPosologie] = useState('')
  const [concentration, setConcentration] = useState('')
  const [showProMsg, setShowProMsg] = useState(false)
  const { estPro, roleEquipe } = useProfil()
  /* Pendant une transition de page, l'ancienne fiche reste montée
     sous la nouvelle route : useParams ne renvoie plus rien. On ne
     touche à rien pour que l'affichage reste intact le temps de
     l'animation, et on ne lance surtout pas de requête avec un
     identifiant indéfini. */
  const idValide = UUID.test(id || '')

  /* Rechargé quand le forfait est connu : un compte Pro voit alors sa
     version personnalisée même si la fiche s'ouvre avant le profil.
     « actif » écarte la réponse d'un chargement devenu périmé. */
  useEffect(() => {
    if (!idValide) return
    let actif = true
    async function chargerDonnees() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        const [{ data: medBase }, { data: medCustomParId }, { data: medCustomDirect }, { data: favData }] = await Promise.all([
          supabase.from('medicaments').select('*').eq('id', id).maybeSingle(),
          supabase.from('medicaments_custom').select('*').eq('user_id', user.id).eq('medicament_id', id).maybeSingle(),
          // Sans filtre sur l'auteur : un médicament de clinique créé par un admin
          // doit s'ouvrir pour toute l'équipe (les règles d'accès limitent déjà la lecture).
          supabase.from('medicaments_custom').select('*').eq('id', id).maybeSingle(),
          supabase.from('favoris').select('id').eq('user_id', user.id).or(`medicament_id.eq.${id},custom_medicament_id.eq.${id}`).limit(1),
        ])
        if (!actif) return

        const medCustom = medCustomParId || medCustomDirect
        const med = (estPro && medCustom) ? medCustom : (medBase || medCustomDirect)

        if (med) {
          setMedicament(med)
          setPosologie(med.dose_min?.toString() || '')
          setConcentration(med.concentration?.toString() || '')
        }
        setEstFavori(!!(favData && favData.length > 0))
        setEstMedCustom(!!medCustomDirect)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        if (actif) setLoading(false)
      }
    }
    chargerDonnees()
    return () => { actif = false }
  }, [id, idValide, estPro])

useEffect(() => {
  if (medicament?.nom) {
    document.title = medicament.nom
  }
}, [medicament])
  useEffect(() => {
  if (medicament?.nom) setTitreCustom(medicament.nom)
  return () => setTitreCustom('')
}, [medicament?.nom, setTitreCustom])

  // Calcul automatique, refait à chaque saisie.
  const { resultat, horsPlage } = useMemo(() => {
    /* L'avertissement ne dépend que de la posologie : il s'affiche dès
       qu'elle sort de la plage du médicament, même sans poids saisi. */
    const posoSaisie = parseFloat(posologie)
    const horsPlage = Boolean(posologie && medicament?.dose_min && medicament?.dose_max)
      && (posoSaisie < medicament.dose_min || posoSaisie > medicament.dose_max)

    if (!poids || !posologie || !concentration || !medicament) {
      return { resultat: null, horsPlage }
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

    /* Sans le else, une fiche sans dose maximale conservait
       l'avertissement du médicament consulté précédemment. */
    return { horsPlage, resultat: {
      poidsKg: poidsKg.toFixed(2),
      unitePoids: unitePoids === 'lb' ? `(${poids} lb → ${poidsKg.toFixed(2)} kg)` : '',
      poso,
      doseTotale: doseTotale.toFixed(2),
      volume: volume.toFixed(2),
      uniteDose,
      uniteConc,
      conc,
      etapeConversion,
    } }
  }, [poids, unitePoids, posologie, concentration, medicament])

  async function toggleFavori() {
    const { data: { user } } = await supabase.auth.getUser()
    if (estFavori) {
      await supabase.from('favoris').delete()
        .eq('user_id', user.id)
        .eq(estMedCustom ? 'custom_medicament_id' : 'medicament_id', id)
      setEstFavori(false)
    } else {
      await supabase.from('favoris').insert({
        user_id: user.id,
        ...(estMedCustom ? { custom_medicament_id: id } : { medicament_id: id }),
      })
      setEstFavori(true)
    }
  }

  const plageTexte = medicament?.dose_min && medicament?.dose_max
    ? `Recommandé : ${medicament.dose_min} à ${medicament.dose_max} ${medicament.unite_dose || 'mg/kg'}`
    : medicament?.dose_min
    ? `Recommandé : ${medicament.dose_min} ${medicament.unite_dose || 'mg/kg'}`
    : null

  if (idValide && loading) return <div className="admin-loading">Chargement...</div>
  if (!medicament) return <div className="admin-vide">Médicament introuvable</div>

  return (
    <div className="fiche-page">

      {/* TITRE + FAVORI + ESPÈCE */}
      <div className="fiche-top">
        <button
          className={`favori-btn-fiche ${estFavori ? 'actif' : ''}`}
          onClick={() => estPro ? toggleFavori() : setShowProMsg(true)}
        >
          {estFavori ? '★' : '☆'}
        </button>
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
        {/* Un médicament de la clinique ne se modifie que par le propriétaire et les admins. */}
        {!(estMedCustom && medicament?.equipe_id && roleEquipe !== 'admin' && roleEquipe !== 'proprietaire') && (
        <button className="labo-btn-secondary-medicament" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => estPro ? navigate(`/drogues/fiche/${id}/personnaliser`) : setShowProMsg(true)}>
  {!estPro ? <i className="ti ti-lock" style={{ color: 'var(--accent-gold)', marginRight: 4 }}></i> : <i className="ti ti-edit" style={{ marginRight: 4 }}></i>}Modifier
</button>
        )}
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
      onChange={e => setPosologie(e.target.value.replace(',', '.'))}
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
  Valide toujours le dosage avec un vétérinaire avant d'administrer un médicament. Ce calculateur est un outil d'aide, votre jugement clinique prime en tout temps.
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
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
    
  )
}
