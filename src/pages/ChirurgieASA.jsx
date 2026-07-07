const ASA = [
  {
    classe: 'I',
    risque: 'Minimal',
    couleur: '#4CAF50',
    description: 'Patient sain, sans maladie systémique.',
    exemples: ['Chirurgie élective chez un animal en bonne santé', 'Ovariohystérectomie', 'Castration', 'Dégriffage'],
  },
  {
    classe: 'II',
    risque: 'Faible',
    couleur: '#8BC34A',
    description: 'Maladie systémique légère, sans limitation fonctionnelle significative.',
    exemples: ['Obésité légère à modérée', 'Déshydratation légère', 'Souffle cardiaque de bas grade', 'Jeune animal (< 3 mois) ou gériatrique'],
  },
  {
    classe: 'III',
    risque: 'Modéré',
    couleur: '#FFC107',
    description: 'Maladie systémique sévère avec limitation fonctionnelle.',
    exemples: ['Anémie', 'Déshydratation modérée', 'Maladie cardiaque compensée', 'Insuffisance rénale chronique légère', 'Fièvre'],
  },
  {
    classe: 'IV',
    risque: 'Élevé',
    couleur: '#FF5722',
    description: 'Maladie systémique sévère représentant une menace constante pour la vie.',
    exemples: ['Rupture de vessie', 'Hémorragie interne', 'Pneumothorax', 'Pyomètre avec sepsis', 'Insuffisance rénale aiguë'],
  },
  {
    classe: 'V',
    risque: 'Extrême',
    couleur: '#9C27B0',
    description: 'Patient moribond dont la survie est peu probable sans chirurgie d\'urgence.',
    exemples: ['Traumatisme crânien sévère', 'Embolie pulmonaire massive', 'Dilatation-torsion de l\'estomac (GDV)', 'Défaillance multi-organique'],
  },
  {
    classe: 'E',
    risque: 'Urgence',
    couleur: '#702F3A',
    description: 'Modificateur appliqué à toute classe lorsque la chirurgie est pratiquée en urgence (ex. : III E). Augmente significativement le risque.',
    exemples: ['Toute procédure ne pouvant être reportée sans risque vital'],
  },
]

export default function ChirurgieASA() {
  return (
    <div className="labo-detail-page">

      <div className="asa-tableau">
        <div className="asa-tableau-header">
          <span>Classe</span>
          <span>Description et exemples</span>
        </div>

        {ASA.map(row => (
          <div key={row.classe} className="asa-row">
            <div className="asa-row-gauche">
              <span className="asa-classe" style={{ background: row.couleur }}>{row.classe}</span>
              <span className="asa-risque">{row.risque}</span>
            </div>
            <div className="asa-row-droite">
              <p className="asa-description">{row.description}</p>
              <ul className="asa-exemples">
                {row.exemples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p className="asa-source">Source : American Society of Anesthesiologists Physical Status Classifications, adapté à la médecine vétérinaire (Murrell & al.)</p>
    </div>
  )
}
