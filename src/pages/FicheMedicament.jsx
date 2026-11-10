import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import IconesEspeces from '../components/IconesEspeces'
import { TitreContext } from '../context/NavigationContext'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'
import SignalerErreur from '../components/SignalerErreur'
import { lireNombrePositif } from '../lib/nombres'
import { arrondirDose, arrondirMcg, calculComprimes } from '../lib/doses'
import { ChoixForme, ChampTeneur, ResultatComprimes } from '../components/Comprimes'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/* Posologie en mg/kg ou en mcg/kg, au choix, pour les médicaments dosés
   dans l'une de ces deux unités. Valeur : facteur vers les mg/kg. */
const UNITES_POSO = { 'mg/kg': 1, 'mcg/kg': 0.001 }
// Concentration ramenée en mg/mL pour le calcul du volume.
const UNITES_CONC = { 'mg/mL': 1, 'mcg/mL': 0.001 }

// Sans bruit d'arrondi binaire (0.005 et non 0.0049999999).
const nombreNet = n => String(Number(n.toPrecision(6)))


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
          {resultat.etapes.map((etape, i) => (
            <div key={etape.titre} className="demarche-etape">
              <span className="demarche-num">{i + 3}</span>
              <div>
                <p className="demarche-titre">{etape.titre}</p>
                <p className="demarche-calcul">{etape.calcul}</p>
              </div>
            </div>
          ))}
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
  // Unité choisie pour la posologie (null : celle de la fiche).
  const [unitePoso, setUnitePoso] = useState(null)
  const [concentration, setConcentration] = useState('')
  // Liquide (volume en mL) ou comprimé (nombre de comprimés).
  const [forme, setForme] = useState('liquide')
  const [teneur, setTeneur] = useState('')
  const [uniteTeneur, setUniteTeneur] = useState('mg')
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
          setUnitePoso(null)
          setForme('liquide')
          setTeneur('')
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

  const poidsSaisi = lireNombrePositif(poids)
  const posoValide = lireNombrePositif(posologie)
  const concSaisie = lireNombrePositif(concentration)
  const teneurSaisie = lireNombrePositif(teneur)
  // Un champ rempli mais invalide (lettres, zéro) affiche son message ; vide, il attend.
  const invalide = (texte, valeur) => texte.trim() !== '' && valeur === null

  const uniteBase = medicament?.unite_dose || 'mg/kg'
  const uniteConc = medicament?.unite_concentration || 'mg/mL'
  // Le choix d'unité n'existe que si le calcul sait convertir la dose et la concentration.
  const uniteConvertible = uniteBase in UNITES_POSO && uniteConc in UNITES_CONC
  const uniteChoisie = uniteConvertible ? (unitePoso || uniteBase) : uniteBase
  /* Comprimés : dose en mg ou en mcg, et médicament donné par la bouche
     (ou voies non renseignées). Pas de comprimé pour un injectable. */
  const voies = medicament?.voies_admin || []
  const comprimePossible = uniteBase in UNITES_POSO && (voies.length === 0 || voies.some(v => /\bPO\b|per os|oral/i.test(v)))
  const enComprimes = comprimePossible && forme === 'comprime'
  // Valeur de la fiche (dans son unité) exprimée dans l'unité choisie.
  const versChoisie = v => (uniteConvertible ? nombreNet(v * UNITES_POSO[uniteBase] / UNITES_POSO[uniteChoisie]) : v)

  /* Changer d'unité convertit la valeur saisie : 5 mcg/kg devient
     0.005 mg/kg. Garder le chiffre tel quel multiplierait la dose par 1000. */
  function changerUnitePoso(nouvelle) {
    if (nouvelle === uniteChoisie) return
    const valeur = lireNombrePositif(posologie)
    if (valeur !== null) setPosologie(nombreNet(valeur * UNITES_POSO[uniteChoisie] / UNITES_POSO[nouvelle]))
    setUnitePoso(nouvelle)
  }

  // Calcul automatique, refait à chaque saisie.
  const { resultat, horsPlage } = useMemo(() => {
    /* L'avertissement ne dépend que de la posologie : il s'affiche dès
       qu'elle sort de la plage du médicament, même sans poids saisi.
       La comparaison se fait dans l'unité de la fiche. */
    const posoSaisie = parseFloat(posologie)
    const posoFiche = uniteConvertible ? posoSaisie * UNITES_POSO[uniteChoisie] / UNITES_POSO[uniteBase] : posoSaisie
    const marge = 1e-9
    const horsPlage = Boolean(posologie && medicament?.dose_min && medicament?.dose_max)
      && (posoFiche < medicament.dose_min * (1 - marge) || posoFiche > medicament.dose_max * (1 + marge))

    if (poidsSaisi === null || posoValide === null || (enComprimes ? teneurSaisie : concSaisie) === null || !medicament) {
      return { resultat: null, horsPlage }
    }

    const poidsKg = unitePoids === 'lb'
      ? Math.round((poidsSaisi / 2.205) * 100) / 100
      : poidsSaisi
    const kg = poidsKg.toFixed(2)
    const poso = posoValide
    const conc = concSaisie

    let doseTotale, etapeDose, etapeVolume, volume
    if (enComprimes) {
      const doseMg = poidsKg * poso * UNITES_POSO[uniteChoisie]
      const mg = arrondirDose(doseMg)
      const mcg = arrondirMcg(doseMg * 1000)
      const calcul = calculComprimes(doseMg, teneurSaisie, uniteTeneur)
      return { horsPlage, resultat: {
        poidsKg: kg,
        poso,
        uniteDose: uniteChoisie,
        doseTotale: uniteChoisie === 'mcg/kg' ? `${mg} mg (${mcg} mcg)` : `${mg} mg`,
        comprimes: calcul,
        etapes: [
          {
            titre: 'Dose totale = poids (kg) × posologie',
            calcul: uniteChoisie === 'mcg/kg' ? `${kg} kg × ${poso} mcg/kg = ${mcg} mcg = ${mg} mg` : `${kg} kg × ${poso} mg/kg = ${mg} mg`,
          },
          ...calcul.etapes,
        ],
      } }
    }
    if (uniteConvertible) {
      // Tout se calcule en mg, puis s'affiche dans les unités saisies.
      const doseMg = poidsKg * poso * UNITES_POSO[uniteChoisie]
      volume = doseMg / (conc * UNITES_CONC[uniteConc])
      const mg = arrondirDose(doseMg)
      const mcg = arrondirMcg(doseMg * 1000)
      doseTotale = uniteChoisie === 'mcg/kg' ? `${mg} mg (${mcg} mcg)` : `${mg} mg`
      etapeDose = uniteChoisie === 'mcg/kg'
        ? `${kg} kg × ${poso} mcg/kg = ${mcg} mcg = ${mg} mg`
        : `${kg} kg × ${poso} mg/kg = ${mg} mg`
      etapeVolume = uniteConc === 'mcg/mL'
        ? `${mcg} mcg ÷ ${conc} mcg/mL = ${volume.toFixed(2)} mL`
        : `${mg} mg ÷ ${conc} mg/mL = ${volume.toFixed(2)} mL`
    } else {
      // Autres unités (UI/kg, mL/kg, g/kg) : la dose reste dans l'unité de la fiche.
      const unite = uniteBase.split('/')[0]
      const dose = poidsKg * poso
      volume = dose / conc
      doseTotale = `${dose.toFixed(2)} ${unite}`
      etapeDose = `${kg} kg × ${poso} ${uniteBase} = ${dose.toFixed(2)} ${unite}`
      etapeVolume = `${dose.toFixed(2)} ${unite} ÷ ${conc} ${uniteConc} = ${volume.toFixed(2)} mL`
    }

    return { horsPlage, resultat: {
      poidsKg: kg,
      poso,
      uniteDose: uniteChoisie,
      doseTotale,
      volume: volume.toFixed(2),
      etapes: [
        { titre: 'Dose totale = poids (kg) × posologie', calcul: etapeDose },
        { titre: 'Volume = dose totale ÷ concentration', calcul: etapeVolume },
      ],
    } }
  }, [poidsSaisi, unitePoids, posologie, posoValide, concSaisie, teneurSaisie, uniteTeneur, enComprimes, medicament, uniteBase, uniteConc, uniteConvertible, uniteChoisie])

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
    ? `Recommandé : ${versChoisie(medicament.dose_min)} à ${versChoisie(medicament.dose_max)} ${uniteChoisie}`
    : medicament?.dose_min
    ? `Recommandé : ${versChoisie(medicament.dose_min)} ${uniteChoisie}`
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
  {invalide(poids, poidsSaisi) && (
    <p className="fluido-erreur">Poids invalide, entrez une valeur supérieure à 0.</p>
  )}
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
    {uniteConvertible ? (
      <div className="radio-groupe">
        {Object.keys(UNITES_POSO).map(u => (
          <button key={u} className={`radio-btn ${uniteChoisie === u ? 'active' : ''}`} onClick={() => changerUnitePoso(u)}>{u}</button>
        ))}
      </div>
    ) : (
      <span className="unite-fixe">{uniteBase}</span>
    )}
  </div>
  {invalide(posologie, posoValide) && (
    <p className="fluido-erreur">Posologie invalide, entrez une valeur supérieure à 0.</p>
  )}
  {plageTexte && <p className="range-hint">{plageTexte}</p>}
  {horsPlage && (
    <div className="avertissement-plage">
      <i className="ti ti-alert-triangle"></i>
      Dosage hors de la plage recommandée — veuillez confirmer avec le vétérinaire responsable.
    </div>
  )}
</div>

          {comprimePossible && <ChoixForme forme={forme} onChange={setForme} />}

          {enComprimes ? (
            <ChampTeneur teneur={teneur} onTeneur={setTeneur} unite={uniteTeneur} onUnite={setUniteTeneur} />
          ) : (
          /* Concentration */
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
    <span className="unite-fixe">{uniteConc}</span>
  </div>
  {invalide(concentration, concSaisie) && (
    <p className="fluido-erreur">Concentration invalide, entrez une valeur supérieure à 0.</p>
  )}
</div>
          )}

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
    <strong>{resultat ? resultat.doseTotale : '—'}</strong>
  </div>
  {enComprimes ? (
    <ResultatComprimes resultat={resultat?.comprimes || null} />
  ) : (
  <div className="resultat-ligne">
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="champ-icone-wrapper">
        <img src="/icone-fluido.svg" alt="volume" />
      </div>
      Volume à administrer
    </span>
    <strong>{resultat ? `${resultat.volume} mL` : '—'}</strong>
  </div>
  )}
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

        {/* Seulement la fiche d'Adjuvet : pas une version personnalisée ni un médicament de clinique. */}
        {!estMedCustom && medicament.id === id && (
          <SignalerErreur categorie="Médicament" page={medicament.nom} icone="ti-pill" />
        )}

        <div style={{ height: 40 }} />

      </div>
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
    
  )
}
