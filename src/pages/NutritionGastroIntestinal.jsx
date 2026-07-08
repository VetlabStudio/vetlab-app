const SECTIONS = [
  {
    titre: 'Principes généraux',
    principes: [
      'Privilégier les aliments hautement digestibles et pauvres en graisses lors de troubles aigus.',
      'Fractionner les repas en 3–4 petites portions par jour pour réduire la charge gastrique.',
      'Réintroduire l\'alimentation progressivement après une période de jeûne thérapeutique (max 24–48 h).',
      'Éviter les changements brusques d\'alimentation — toute transition doit se faire sur 7–10 jours.',
    ],
  },
  {
    titre: 'Gastroentérite et diarrhée',
    principes: [
      'Aliment digestible (poulet bouilli, riz blanc) en phase aiguë.',
      'Fibres solubles (psyllium, courge) pour normaliser la consistance des selles.',
      'Probiotiques pour restaurer le microbiote intestinal.',
      'Éviter les aliments riches en graisses, les produits laitiers et les aliments épicés.',
      'Assurer une bonne hydratation — eau fraîche disponible en permanence.',
    ],
  },
  {
    titre: 'Maladies inflammatoires (MICI)',
    principes: [
      'Régime d\'élimination avec une source de protéine nouvelle (hydrolysat ou protéine inédite).',
      'Acides gras oméga-3 (EPA/DHA) — effets anti-inflammatoires sur la muqueuse intestinale.',
      'Fibres fermentescibles (prébiotiques) pour soutenir la santé du microbiote.',
      'Éviter les additifs, colorants et conservateurs susceptibles d\'aggraver l\'inflammation.',
      'Surveiller la B12 et le folate — leur absorption peut être compromise.',
    ],
  },
  {
    titre: 'Pancréatite',
    principes: [
      'Régime strictement pauvre en graisses (< 10 % MS chez le chien) en phase de convalescence.',
      'Fractionner les repas pour éviter les pics de sécrétion pancréatique.',
      'Éviter à vie les aliments très gras chez les animaux à pancréatite chronique.',
      'Supplémentation en enzymes pancréatiques si insuffisance pancréatique exocrine (IPE).',
    ],
  },
]

export default function NutritionGastroIntestinal() {
  return (
    <div className="labo-detail-page">
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-gut"></i>
            </div>
            <h2 className="postop-section-titre">{s.titre}</h2>
          </div>
          <ul className="nutrition-principes">
            {s.principes.map((p, j) => (
              <li key={j} className="nutrition-principe-item">{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
