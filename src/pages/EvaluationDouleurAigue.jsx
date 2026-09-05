const CHIEN = [
  {
    id: 'csu',
    nom: 'CSU Canine Acute Pain Scale',
    desc: 'Grille d\'évaluation aigue 0-4 - Colorado State University',
    url: 'https://vetmedbiosci.colostate.edu/vth/wp-content/uploads/sites/7/2020/12/canine-pain-scale.pdf',
  },
  {
    id: 'hcpi',
    nom: 'Helsinki Chronic Pain Index',
    desc: 'Questionnaire douleur chronique basé sur 11 comportements',
    url: 'https://www.fourleg.com/media/Helsinki%20Chronic%20Pain%20Index.pdf',
  },
]

const CHAT = [
  {
    id: 'glasgow',
    nom: 'Glasgow CMPS-Feline',
    desc: 'Composite Measure Pain Scale - WSAVA',
    url: 'https://wsava.org/wp-content/uploads/2020/01/Feline-CMPS-SF.pdf',
  },
  {
    id: 'fgs',
    nom: 'Feline Grimace Scale',
    desc: 'Évaluation par expressions faciales',
    url: 'https://www.felinegrimacescale.com/',
  },
  {
    id: 'fmpi',
    nom: 'Feline Musculoskeletal Pain Index',
    desc: 'Douleur musculosquelettique chronique - NC State',
    url: 'https://cvm.ncsu.edu/fmpi/',
  },
  {
    id: 'cmi',
    nom: 'Clinical Metrology Instruments',
    desc: 'Outils cliniques validés - NC State TRiP',
    url: 'https://cvm.ncsu.edu/translational-research-in-pain/clinical-metrology-instruments/',
  },
]

function SectionEspece({ label, icone, outils }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <img src={icone} alt={label} style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
      </div>
      <div className="menu-page-section-liste">
        {outils.map((outil, idx) => (
          <a
            key={outil.id}
            href={outil.url}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-page-item"
            style={{
              borderBottom: idx < outils.length - 1 ? '1px solid var(--border)' : 'none',
              textDecoration: 'none',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              paddingTop: 14,
              paddingBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span className="menu-page-item-label" style={{ fontWeight: 600 }}>{outil.nom}</span>
              <i className="ti ti-external-link" style={{ fontSize: 16, color: 'var(--text-hint)', flexShrink: 0, marginLeft: 8 }}></i>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-hint)', lineHeight: 1.4 }}>{outil.desc}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function EvaluationDouleurAigue() {
  return (
    <div className="douleur-page">
      <div className="douleur-intro">
        <i className="ti ti-clipboard-heart douleur-intro-icone"></i>
        <p className="douleur-intro-texte">
          Accède aux ressources officielles d'évaluation de la douleur par espèce. Chaque lien ouvre l'outil ou le document original.
        </p>
      </div>

      <SectionEspece label="Chien" icone="/icone-chien.svg" outils={CHIEN} />
      <SectionEspece label="Chat" icone="/icone-chat.svg" outils={CHAT} />
    </div>
  )
}
