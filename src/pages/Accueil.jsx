import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import PopupPro from '../components/PopupPro'
import { useProfil } from '../context/ProfilContext'

function ClocheMiniAccueil() {
  const [count, setCount] = useState(0)
  const { estEquipe } = useProfil()
  const navigate = useNavigate()

  useEffect(() => {
    if (!estEquipe) return
    charger()
    let active = true
    let channel = null
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active || !user) return
      const name = 'notifs-acc-' + user.id + '-' + Date.now()
      channel = supabase
        .channel(name)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => charger())
        .subscribe()
    })
    return () => { active = false; if (channel) supabase.removeChannel(channel) }
  }, [estEquipe])

  async function charger() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('notifications')
      .select('id, lu')
      .eq('user_id', user.id)
      .eq('lu', false)
    setCount((data || []).length)
  }

  if (!estEquipe) return null

  return (
    <button
      onClick={() => navigate('/notifications')}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
        color: '#fff', fontSize: 22, position: 'relative', display: 'flex',
      }}
    >
      <i className="ti ti-bell"></i>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: 0, right: 0, background: 'var(--accent-red)',
          color: '#fff', borderRadius: '50%', width: 16, height: 16,
          fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

const CALCULATEURS = [
  { id: 'fluido',      label: 'Fluido',              icone: '/icone-fluido.svg',      route: '/calculateurs/fluido' },
  { id: 'cri',         label: 'CRI',                 icone: '/icone-cri.svg',         route: '/calculateurs/cri' },
  { id: 'conversion',  label: 'Conversion',          icone: '/icone-conversion.svg',  route: '/calculateurs/conversion' },
  { id: 'dilution',    label: 'Dilution\nC1V1-C2V2', icone: '/icone-dilution.svg',    route: '/calculateurs/dilution' },
  { id: 'rcr',         label: 'RCR\nUrgence',        icone: '/icone-ecg.svg',         route: '/calculateurs/rcr' },
  { id: 'mise-bas',    label: 'Date de\nmise bas',   icone: '/icone-calendrier.svg',  route: '/calculateurs/mise-bas' },
  { id: 'besoin',      label: 'Besoin\nénergétique', icone: '/icone-energie.svg',     route: '/calculateurs/besoin' },
  { id: 'transfusion', label: 'Transfusion\nsanguine', icone: '/icone-sang.svg',      route: '/calculateurs/transfusion' },
  { id: 'toxicite',    label: 'Toxicité\nchocolat',  icone: '/icone-chocolat.svg',    route: '/calculateurs/toxicite' },
  { id: 'tempo',       label: 'Tap BPM',          icone: '/icone-tap.png',       route: '/calculateurs/tempo' },
  { id: 'douleur-aigue', label: 'Évaluation de la\ndouleur aiguë', icone: '/icone-douleur.png', route: '/calculateurs/douleur-aigue' },
  { id: 'monitoring',    label: 'Monitoring\nanesthésique',  icone: '/icone-monitoring.png',          route: '/chirurgie/monitoring', pro: true },
]


const REFERENCES = [
  { id: 'pharmacologie', label: 'Pharmacologie', icone: '/icone-pharmaco.svg', route: '/drogues' },
  { id: 'laboratoire', label: 'Laboratoire', icone: '/icone-laboratoire.svg', route: '/labo' },
  { id: 'chirurgie', label: 'Chirurgie', icone: '/icone-chirurgie-ref.svg', route: '/chirurgie' },
  { id: 'soins-generaux', label: 'Soins\ngénéraux', icone: '/icone-soins-generaux.svg', route: '/soins-generaux' },
  { id: 'toxicologie', label: 'Toxicologie', icone: '/toxico.svg', route: '/drogues/toxicologie', pro: true },
]

export default function Accueil() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [nomClinique, setNomClinique] = useState('')
  const [showProMsg, setShowProMsg] = useState(false)
  const { estEquipe, teamId, estPro } = useProfil()

  useEffect(() => {
    async function chargerProfil() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
      if (data?.nom) setPrenom(data.nom.split(' ')[0])
    }
    chargerProfil()
  }, [])

  useEffect(() => {
    if (!teamId) return
    supabase.from('equipes').select('nom').eq('id', teamId).single()
      .then(({ data }) => { if (data?.nom) setNomClinique(data.nom) })
  }, [teamId])

  return (
    <div className="accueil-v2">

      {/* HEADER */}
      <div className="accueil-v2-header">
        <div>
          <img src="/logoadjuvet-blanc.png" alt="Vetlab Studio" className="accueil-v2-logo" />
          {estEquipe && nomClinique && (
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, marginTop: 0 }}>{nomClinique}</p>
          )}
          <h1 className="accueil-v2-bonjour">Bonjour{prenom ? ` ${prenom}` : ''},</h1>
          <p className="accueil-v2-subtitle">Accès rapide à vos outils cliniques.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <ClocheMiniAccueil />
        </div>
      </div>

      {/* SECTION CALCULATEURS */}
      <section className="accueil-v2-section">
        {/* BOUTON PRÉCONSULTATION */}
        <button className="accueil-v2-preconsult-btn" onClick={() => estPro ? navigate('/soins-generaux/examen-physique') : setShowProMsg(true)}>
          <i className="ti ti-clipboard-heart"></i>
          <span>Démarrer un examen</span>
          <BadgePro />
        </button>

        <h2 className="accueil-v2-titre-section">Boîte à outils</h2>
        <div className="accueil-v2-calc-grid">
        {CALCULATEURS.map(c => (
            <button
              key={c.id}
              className="accueil-v2-calc-tuile"
              onClick={() => c.pro && !estPro ? setShowProMsg(true) : navigate(c.route)}
              style={{ position: 'relative' }}
            >
              <img src={c.icone} alt={c.label} className="accueil-v2-calc-icone" />
              <span className="accueil-v2-calc-label">{c.label}</span>
              {c.pro && <BadgePro />}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION RÉFÉRENCES */}
      <section className="accueil-v2-section">
        <h2 className="accueil-v2-titre-section">Références</h2>
        <div className="accueil-v2-calc-grid accueil-v2-calc-grid--2col">
          {REFERENCES.map(r => (
            <button
              key={r.id}
              className="accueil-v2-calc-tuile"
              onClick={() => r.pro && !estPro ? setShowProMsg(true) : navigate(r.route)}
              style={{ position: 'relative' }}
            >
              <img src={r.icone} alt={r.label} className="accueil-v2-calc-icone accueil-v2-calc-icone--ref" />
              <span className="accueil-v2-calc-label">{r.label}</span>
              {r.pro && <BadgePro />}
            </button>
          ))}
        </div>
      </section>

      <div style={{ height: 32 }} />
      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}


