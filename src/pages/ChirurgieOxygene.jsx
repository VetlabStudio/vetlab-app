const SECTIONS = [
  {
    titre: 'Petits animaux < 150 kg',
    couleur: 'var(--primary)',
    groupes: [
      {
        titre: 'Induction par chambre ou masque',
        items: [
          { phase: 'Chambre', valeur: '5 L/min', note: null },
          { phase: 'Masque — patient ≤ 10 kg', valeur: '1–3 L/min', note: null },
          { phase: 'Masque — patient > 10 kg', valeur: '3–5 L/min', note: null },
        ],
      },
      {
        titre: 'Circuit avec réinhalation',
        items: [
          { phase: 'Après induction, changement de profondeur ou réveil', valeur: '50–100 mL/kg/min', note: 'Max 5 L/min' },
          { phase: 'Entretien partiel (low flow)', valeur: '20–40 mL/kg/min', note: 'Min 500 mL/min' },
          { phase: 'Entretien minimal', valeur: '200–300 mL/kg/min', note: 'Max 5 L/min — se comporte comme circuit sans réinhalation' },
          { phase: 'Entretien complet (high flow)', valeur: '5–10 mL/kg/min', note: 'Débit < 0,5 L/min peut affecter la précision du vaporisateur' },
        ],
      },
      {
        titre: 'Circuit sans réinhalation — patients ≤ 7 kg uniquement',
        items: [
          { phase: 'Mapleson A et A modifié (Lack)', valeur: '0,5–1,5 L/min', note: '~100–200 mL/kg/min ≈ 0,75–1× VRM' },
          { phase: 'Mapleson D (Bain coaxial), E (Ayre) et F (Jackson-Rees)', valeur: '1–3 L/min', note: '~200–400 mL/kg/min ≈ 2–3× VRM' },
        ],
      },
    ],
  },
  {
    titre: 'Grands animaux ≥ 150 kg',
    couleur: '#f59e0b',
    note: 'Circuit avec réinhalation uniquement',
    groupes: [
      {
        titre: 'Circuit avec réinhalation',
        items: [
          { phase: 'Après induction, changement de profondeur ou réveil', valeur: '8–10 L/min', note: '≈ 20 mL/kg/min, max 10 L/min' },
          { phase: 'Entretien partiel', valeur: '3–5 L/min', note: '≈ 10 mL/kg/min, max 5 L/min' },
          { phase: 'Entretien complet', valeur: '1–2,5 L/min', note: '≈ 3–5 mL/kg/min' },
        ],
      },
    ],
  },
]

export default function ChirurgieOxygene() {
  return (
    <div className="labo-detail-page">
      <div className="fluido-info-banner" style={{ marginBottom: 16 }}>
        <i className="ti ti-info-circle" />
        <span>VRM = volume respiratoire minute. Les débits en mL/kg/min s'appliquent au poids corporel total.</span>
      </div>

      {SECTIONS.map((section, si) => (
        <div key={si} style={{ marginBottom: 24 }}>
          <div className="oxygene-section-titre" style={{ borderLeftColor: section.couleur }}>
            <span>{section.titre}</span>
            {section.note && <span className="oxygene-section-note">{section.note}</span>}
          </div>
          {section.groupes.map((groupe, gi) => (
            <div key={gi} className="oxygene-groupe">
              <div className="oxygene-groupe-titre">{groupe.titre}</div>
              {groupe.items.map((item, ii) => (
                <div key={ii} className="oxygene-item">
                  <div className="oxygene-item-phase">{item.phase}</div>
                  <div className="oxygene-item-droite">
                    <div className="oxygene-item-valeur">{item.valeur}</div>
                    {item.note && <div className="oxygene-item-note">{item.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
