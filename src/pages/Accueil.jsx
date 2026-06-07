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
]

const DROGUES = [
  { id: 'anesthesiques',     label: 'Anesthésiques /\nAnalgésiques', route: '/drogues/anesthesiques', accent: false },
  { id: 'antibiotiques',     label: 'Antibiotiques',                  route: '/drogues/antibiotiques',  accent: false },
  { id: 'antidiarrheiques',  label: 'Antidiarrhéiques',               route: '/drogues/antidiarrheiques', accent: false },
  { id: 'antiemetiques',     label: 'Antiémétiques',                  route: '/drogues/antiemetiques',  accent: false },
  { id: 'antihistaminiques', label: 'Antihistaminiques',              route: '/drogues/antihistaminiques', accent: false },
  { id: 'urgence',           label: 'Urgence',                        route: '/drogues/urgence',        accent: true },
  { id: 'cardiovasculaires', label: 'Cardiovasculaires',              route: '/drogues/cardiovasculaires', accent: false },
  { id: 'gastroprotecteurs', label: 'Gastroprotecteurs',              route: '/drogues/gastroprotecteurs', accent: false },
  { id: 'neurologiques',     label: 'Neurologiques',                  route: '/drogues/neurologiques',  accent: false },
  { id: 'respiratoires',     label: 'Respiratoires',                  route: '/drogues/respiratoires',  accent: false },
  { id: 'antagonistes',      label: 'Antagonistes',                   route: '/drogues/antagonistes',   accent: false },
  { id: 'mes-drogues', label: 'Médicaments favoris', route: '/drogues/mes-drogues', accent: false, favori: true },
  { id: 'toxicologie', label: 'Toxicologie', route: '/drogues/toxicologie', accent: false, pro: true },
]
const LABO = [
  { id: 'biochimie',     label: 'Biochimie',     route: '/labo/4efe71ce-bfa9-4ea9-a8af-ecbd6dc97320' },
  { id: 'parasitologie', label: 'Parasitologie',  route: '/labo/2e0222f2-5733-4d01-bc99-8c380bec5abe' },
  { id: 'urologie',      label: 'Urologie',       route: '/labo/aeac9309-185f-4f2c-81b2-dfed3d4e55aa' },
  { id: 'cytologie',     label: 'Cytologie',      route: '/labo/173fb58a-988c-4202-8b14-bfcd15c4a16f' },
  { id: 'microbiologie', label: 'Microbiologie', route: '/labo/e216b2ee-59c8-4ea8-a06e-92c0f6f05ee5' },
]
const CHIRURGIE = [
  { id: 'instruments', label: 'Instruments de chirurgie', route: '/chirurgie/instruments', pro: true },
  { id: 'tubes', label: 'Tubes endotrachéaux', route: '/chirurgie/tubes', pro: true },
  { id: 'monitoring', label: 'Monitoring anesthésique', route: '/chirurgie/monitoring', pro: true },
  { id: 'capnographie', label: 'Interprétation de la capnographie', route: '/chirurgie/capnographie', pro: true },
  { id: 'post-op', label: 'Soins post-opératoires', route: '/chirurgie/post-op', pro: true },
  { id: 'douleur', label: 'Évaluation de la douleur', route: '/chirurgie/douleur' },
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
        <h2 className="accueil-v2-titre-section">Calculateurs</h2>
        <div className="accueil-v2-calc-grid">
          {CALCULATEURS.map(c => (
            <button
              key={c.id}
              className="accueil-v2-calc-tuile"
              onClick={() => navigate(c.route)}
            >
              <img src={c.icone} alt={c.label} className="accueil-v2-calc-icone" />
              <span className="accueil-v2-calc-label">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION DROGUES */}
      <section className="accueil-v2-section">
        <h2 className="accueil-v2-titre-section">Pharmacologie</h2>
        <div className="accueil-v2-drogues-grid">
          {DROGUES.map(d => (
            <button
  key={d.id}
  className={`accueil-v2-drogue-item ${d.accent ? 'accent' : ''} ${d.favori ? 'favori' : ''}`}
  onClick={() => navigate(d.route)}
  style={{ position: 'relative' }}
>
  {d.favori && <i className="ti ti-star" style={{ fontSize: 13, marginRight: 4 }}></i>}
  {d.accent && <i className="ti ti-alert-triangle" style={{ fontSize: 13, marginRight: 4 }}></i>}
  <span>{d.label}</span>
  <i className="ti ti-chevron-right accueil-v2-chevron"></i>
  {d.pro && <BadgePro />}
</button>
          ))}
        </div>
      </section>
      {/* SECTION LABORATOIRE */}
<section className="accueil-v2-section">
  <h2 className="accueil-v2-titre-section">Laboratoire</h2>
  <div className="accueil-v2-drogues-grid">
    {LABO.map(l => (
      <button
        key={l.id}
        className="accueil-v2-drogue-item"
        onClick={() => navigate(l.route)}
      >
        <span>{l.label}</span>
        <i className="ti ti-chevron-right accueil-v2-chevron"></i>
      </button>
    ))}
  </div>
      </section>
      {/* SECTION CHIRURGIE */}
<section className="accueil-v2-section">
  <h2 className="accueil-v2-titre-section">Chirurgie</h2>
  <div className="accueil-v2-drogues-grid">
    {CHIRURGIE.map(c => (
  <button
    key={c.id}
    className="accueil-v2-drogue-item"
    onClick={() => navigate(c.route)}
    style={{ position: 'relative' }}
  >
    <span>{c.label}</span>
    <i className="ti ti-chevron-right accueil-v2-chevron"></i>
    {c.pro && <BadgePro />}
  </button>
))}
  </div>
</section>
  <div style={{ height: 32 }} />
    </div>
  )
}


