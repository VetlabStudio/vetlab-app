const SECTIONS = [
  {
    titre: 'Avant la saillie',
    principes: [
      'Reproducteurs en excellente condition physique, BCS (Body Condition Score) modéré (4–5/9), à jour dans les vaccins et vermifuges.',
      'Dépistage brucellose et herpèsvirus (chienne); dépistage FeLV/FIV (chatte).',
      'Chienne obèse : perte de poids recommandée avant la saillie. Chatte : ne pas reproduire si BCS ≤ 3/9 ou > 6/9.',
    ],
  },
  {
    titre: 'Gestation — chienne (~63 jours)',
    principes: [
      'Augmenter la portion de 15 % par semaine dès la 5e semaine jusqu\'à la mise bas (environ +60 % vs saillie).',
      'Fractionner en repas plus petits et fréquents en fin de gestation.',
      'Glucides : minimum 23 % MS (matière sèche) de glucides digestibles pour éviter la cétose.',
      'Calcium : Ca 1–1,7 % MS, P 0,7–1,3 % MS, ratio Ca:P 1,1:1 à 2:1 en fin de gestation.',
      'Ne PAS supplémenter en calcium — risque d\'hypocalcémie/éclampsie en lactation.',
    ],
  },
  {
    titre: 'Gestation — chatte (~63 jours)',
    principes: [
      'Augmenter la portion dès la 1re semaine de gestation; alimentation à volonté recommandée.',
      'Augmentation jusqu\'à 25–50 % de plus que l\'entretien en fin de gestation.',
      'BEQ : BEE × 1,6 à la saillie, augmentant graduellement à BEE × 2 à la mise bas.',
    ],
  },
  {
    titre: 'Lactation — chienne',
    principes: [
      'Alimentation à volonté ou repas très fréquents.',
      'BEQ : environ 1,9 × BEE + 25 % de BEQ additionnel par chiot; pic entre 3 et 5 semaines postpartum.',
      'Protéines : 25–35 % MS.',
      'Matières grasses : minimum 8,5 % MS, idéalement ≥ 20 % MS (portées nombreuses ou grandes races).',
      'Oméga-3/oméga-6 : ratio 5:1 à 10:1; DHA essentiel au développement neurologique du chiot, à fournir par supplémentation maternelle.',
      'Aucune supplémentation vitaminique/minérale si diète commerciale complète et équilibrée.',
    ],
  },
  {
    titre: 'Lactation — chatte',
    principes: [
      'Alimentation à volonté; besoins 2 à 3 × l\'entretien (1,5 × BEQ sem. 1 → 2,5–3 × BEQ sem. 4).',
      'Protéines : minimum 30 % MS (AAFCO), recommandé 35–50 % MS; sources animales privilégiées (taurine indispensable).',
      'Matières grasses : minimum 9 % MS (AAFCO), optimal 18–35 % MS; acide arachidonique essentiel (source animale uniquement).',
      'DHA + EPA : minimum 0,01 % MS, dont au moins 40 % sous forme de DHA (≥ 0,004 % MS).',
      'Calcium/phosphore : Ca 1,1–1,6 % MS, P 0,8–1,4 % MS, ratio 1:1 à 1,5:1.',
    ],
  },
  {
    titre: 'Eau et sevrage',
    principes: [
      'Eau fraîche à volonté en tout temps; aliment humide recommandé si hydratation insuffisante.',
      'Introduction de l\'alimentation solide entre 3 et 4 semaines; sevrage nutritionnel complet vers 6 semaines.',
      'Réduire progressivement les calories offertes à la mère au sevrage; retour au poids et aux apports préreproduction à 6–8 semaines.',
    ],
  },
]

export default function NutritionGestationLactation() {
  return (
    <div className="labo-detail-page">
      <div className="nutrition-note-ms">
  <i className="ti ti-info-circle"></i>
  <span><strong>MS</strong> = matière sèche, soit le % du nutriment calculé une fois l'eau retirée de l'aliment ; ne pas confondre avec aliment sec vs humide. Une conserve contient ~75–80 % d'eau alors qu'une croquette en contient ~10 %.</span>
</div>
      {SECTIONS.map((s, i) => (
        <div key={i} className="postop-section">
          <div className="postop-section-header">
            <div className="postop-section-icone" style={{ background: 'rgba(37,77,86,0.1)', color: 'var(--primary)' }}>
              <i className="ti ti-heart"></i>
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
