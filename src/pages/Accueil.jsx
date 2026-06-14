import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BadgePro from '../components/BadgePro'

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
  { id: 'tempo',       label: 'Tap\ntempo',          icone: '/icone-duree.svg',       route: '/calculateurs/tempo' },
  { id: 'douleur-aigue', label: 'Évaluation de la\ndouleur aiguë', icone: '/icone-chien.svg', route: '/calculateurs/douleur-aigue' },
  { id: 'monitoring',    label: 'Monitoring\nanesthésique',  icone: '/icone-monitoring.png',          route: '/chirurgie/monitoring', pro: true },
]


const REFERENCES = [
  { id: 'pharmacologie', label: 'Pharmacologie', icone: '/icone-pharmaco.svg', route: '/drogues' },
  { id: 'laboratoire', label: 'Laboratoire', icone: '/icone-laboratoire.svg', route: '/labo' },
  { id: 'chirurgie', label: 'Chirurgie', icone: '/icone-chirurgie-ref.svg', route: '/chirurgie' },
  { id: 'soins-generaux', label: 'Soins\ngénéraux', icone: '/icone-soins-generaux.svg', route: '/soins-generaux' },
]

export default function Accueil() {
  const navigate = useNavigate()
  const [prenom, setPrenom] = useState('')

  useEffect(() => {
    async function chargerProfil() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
      if (data?.nom) setPrenom(data.nom.split(' ')[0])
    }
    chargerProfil()
  }, [])

  return (
    <div className="accueil-v2">

      {/* HEADER */}
      <div className="accueil-v2-header">
        <div>
    <h1 className="accueil-v2-accueil">Accueil</h1>
    <p className="accueil-v2-bonjour">Bonjour{prenom ? ` ${prenom}` : ''},</p>
    <p className="accueil-v2-subtitle">Accès rapide à tes outils cliniques.</p>
  </div>
  <img src="/logoadjuvet-blanc.png" alt="Vetlab Studio" className="accueil-v2-logo" />
</div>

      {/* SECTION CALCULATEURS */}
      <section className="accueil-v2-section">
        {/* BOUTON PRÉCONSULTATION */}
        <button className="accueil-v2-preconsult-btn" onClick={() => navigate('/soins-generaux/examen-physique')}>
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
            >
              <img src={r.icone} alt={r.label} className="accueil-v2-calc-icone accueil-v2-calc-icone--ref" />
              <span className="accueil-v2-calc-label">{r.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ height: 32 }} />
    </div>
  )
}


