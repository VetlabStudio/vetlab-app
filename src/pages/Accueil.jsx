import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'
import { useProfil } from '../context/ProfilContext'

function ClocheMiniAccueil() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const { estEquipe } = useProfil()
  const navigate = useNavigate()

  function naviguerNotif(notif) {
    setOpen(false)
    if (notif.reference_type === 'babillard') navigate('/equipe?tab=babillard')
    else if (notif.reference_type === 'tache') navigate('/equipe?tab=taches')
  }

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
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setNotifs(data || [])
    setCount((data || []).filter(n => !n.lu).length)
  }

  async function marquerLues() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('notifications').update({ lu: true }).eq('user_id', user.id).eq('lu', false)
    setCount(0)
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  }

  if (!estEquipe) return null

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open && count > 0) marquerLues() }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
          color: 'var(--primary)', fontSize: 26, position: 'relative', display: 'flex',
        }}
      >
        <i className="ti ti-bell"></i>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0, background: 'var(--accent-red)',
            color: 'var(--primary)', borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 36, right: 0, zIndex: 100, width: 280,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notifications</p>
            </div>
            {notifs.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-hint)' }}>Aucune notification</p>
              </div>
            ) : (
              <div style={{ maxHeight: 320, overflow: 'auto' }}>
                {notifs.map(n => (
                  <div key={n.id}
                    onClick={() => naviguerNotif(n)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      background: n.lu ? 'transparent' : 'var(--bg-secondary)',
                      cursor: n.reference_type ? 'pointer' : 'default',
                    }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: '4px 0 0' }}>
                      {new Date(n.created_at).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const CALCULATEURS = [
  { id: 'fluido',      label: 'Fluido',              icone: '/icone-fluido.svg',      route: '/calculateurs/fluido' },
  { id: 'dextrose',    label: 'Dextrose',            icone: '/icone-dilution.svg',    route: '/calculateurs/dextrose' },
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
  { id: 'nutrition', label: 'Nutrition', icone: '/icone-nutrition.png', route: '/nutrition' },
]

export default function Accueil() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')
  const [nomClinique, setNomClinique] = useState('')
  const { estEquipe, teamId } = useProfil()

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
        <div className="accueil-v2-header-top">
          <img src="/logo-adjuvet.png" alt="Adjuvet" className="accueil-v2-logo-header" />
          <ClocheMiniAccueil />
        </div>
        <div className="accueil-v2-header-texte">
          {estEquipe && nomClinique && (
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginTop: 0 }}>{nomClinique}</p>
          )}
          
          <p className="accueil-v2-bonjour">Bonjour{prenom ? ` ${prenom}` : ''},</p>
          <p className="accueil-v2-subtitle">Accès rapide à tes outils cliniques.</p>
              {/* BOUTON PRÉCONSULTATION */}
        <button className="accueil-v2-preconsult-btn" onClick={() => navigate('/soins-generaux/examen-physique')}>
          <i className="ti ti-clipboard-heart"></i>
          <span>Démarrer un examen</span>
          <BadgePro />
        </button>
        </div>
        
      </div>

      {/* SECTION CALCULATEURS */}
      <section className="accueil-v2-section">
        
        <h2 className="accueil-v2-titre-section">Boîte à outils</h2>
      
        <div className="accueil-v2-calc-grid">
          {CALCULATEURS.map(c => (
            <button
              key={c.id}
              className="accueil-v2-calc-tuile"
              onClick={() => navigate(c.route)}
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
              onClick={() => navigate(r.route)}
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
    </div>
  )
}


