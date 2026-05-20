import { useNavigate } from 'react-router-dom'

const calculateurs = [
  { id: 'fluido',      label: 'Fluido' },
  { id: 'cri',         label: 'CRI' },
  { id: 'conversion',  label: 'Conversion' },
  { id: 'dilution',    label: 'Dilution\nC1V1-C2V2' },
  { id: 'rcr',         label: 'RCR\nUrgence' },
  { id: 'mise-bas',    label: 'Date de\nmise bas' },
  { id: 'besoin',      label: 'Besoin\nénergétique' },
  { id: 'transfusion', label: 'Transfusion\nsanguine' },
  { id: 'toxicite',    label: 'Toxicité\nchocolat' },
]

const drogues = [
  { id: 'anesthesiques',    label: 'Anesthésiques /\nAnalgésiques' },
  { id: 'antibiotiques',    label: 'Antibiotiques' },
  { id: 'antidiarrheiques', label: 'Antidiarrhéiques' },
  { id: 'antiemetiques',    label: 'Antiémétiques' },
  { id: 'antihistaminiques',label: 'Antihistaminiques' },
  { id: 'urgence',          label: 'Urgence' },
  { id: 'cardiovasculaires',label: 'Cardiovasculaires' },
  { id: 'gastroprotecteurs',label: 'Gastroprotecteurs' },
  { id: 'neurologiques',    label: 'Neurologiques' },
  { id: 'respiratoires',    label: 'Respiratoires' },
  { id: 'antagonistes',     label: 'Antagonistes' },
  { id: 'mes-drogues',      label: 'Mes drogues' },
]

const laboratoire = [
  { id: 'biochimie',      label: 'Biochimie' },
  { id: 'parasitologie',  label: 'Parasitologie' },
  { id: 'urologie',       label: 'Urologie' },
  { id: 'cytologie',      label: 'Cytologie' },
]

export default function Accueil() {
  const navigate = useNavigate()

  return (
    <div className="accueil">
      {/* CALCULATEURS — petites tuiles compactes */}
      <section className="accueil-section">
        <h2 className="section-titre">Calculateurs</h2>
        <div className="tuiles-grid tuiles-grid--calc">
          {calculateurs.map(c => (
            <button
              key={c.id}
              className="tuile tuile--calc"
              onClick={() => navigate(`/calculateurs/${c.id}`)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* DROGUES — tuiles larges 2 colonnes */}
      <section className="accueil-section">
        <h2 className="section-titre">Drogues</h2>
        <div className="tuiles-grid tuiles-grid--large">
          {drogues.map(d => (
            <button
              key={d.id}
              className="tuile tuile--large"
              onClick={() => navigate(`/drogues/${d.id}`)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

    
    </div>
  )
}
