import { useState } from 'react'

const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Organes'

const ORGANES = [
  {
    id: 'foie',
    nom: 'Foie',
    image: `${BASE_URL}/foie.png`,
    tests: [
      { abrev: 'ALT', nom: 'Alanine aminotransférase', mesure: 'Enzyme hépatique spécifique, indicateur de lésion des hépatocytes.', ref: { chien: '10–100 U/L', chat: '10–100 U/L' }, eleve: 'Hépatite, nécrose hépatique, lipidose (chat), toxicité médicamenteuse.', bas: 'Peu significatif cliniquement.' },
      { abrev: 'ALP', nom: 'Phosphatase alcaline', mesure: 'Enzyme produite par le foie, les os et les corticosurrénales.', ref: { chien: '20–150 U/L', chat: '10–90 U/L' }, eleve: 'Cholestase, hyperadrénocorticisme (chien), induction médicamenteuse (cortico, phénobarbital).', bas: 'Peu significatif.' },
      { abrev: 'GGT', nom: 'Gamma-glutamyltransférase', mesure: 'Enzyme de cholestase, plus spécifique que l\'ALP chez le chat.', ref: { chien: '0–11 U/L', chat: '0–4 U/L' }, eleve: 'Cholestase, lipidose hépatique (chat), hyperadrénocorticisme.', bas: 'Non significatif.' },
      { abrev: 'AST', nom: 'Aspartate aminotransférase', mesure: 'Enzyme hépatique et musculaire, moins spécifique qu\'ALT.', ref: { chien: '15–55 U/L', chat: '15–55 U/L' }, eleve: 'Lésion hépatique ou musculaire; toujours interpréter avec CK.', bas: 'Non significatif.' },
      { abrev: 'TBIL', nom: 'Bilirubine totale', mesure: 'Produit de dégradation de l\'hémoglobine, marqueur de cholestase ou d\'hémolyse.', ref: { chien: '0–0,4 mg/dL', chat: '0–0,4 mg/dL' }, eleve: 'Ictère pré-hépatique, hépatique ou post-hépatique.', bas: 'Non significatif.' },
      { abrev: 'ALB', nom: 'Albumine', mesure: 'Protéine synthétisée par le foie, marqueur de fonction hépatique chronique.', ref: { chien: '2,5–4,0 g/dL', chat: '2,3–3,9 g/dL' }, eleve: 'Déshydratation.', bas: 'Insuffisance hépatique chronique, entéropathie, néphropathie.' },
    ],
  },
  {
    id: 'rein',
    nom: 'Rein',
    image: `${BASE_URL}/rein.png`,
    tests: [
      { abrev: 'BUN', nom: 'Azote uréique sanguin', mesure: 'Produit de dégradation des protéines, filtré par le rein.', ref: { chien: '7–27 mg/dL', chat: '14–36 mg/dL' }, eleve: 'Insuffisance rénale, déshydratation, alimentation riche en protéines, saignement GI.', bas: 'Insuffisance hépatique sévère, polyurie.' },
      { abrev: 'CREA', nom: 'Créatinine', mesure: 'Produit du métabolisme musculaire, filtré par le rein. Plus spécifique que BUN.', ref: { chien: '0,5–1,5 mg/dL', chat: '0,8–1,8 mg/dL' }, eleve: 'Insuffisance rénale (perte de plus de 75% des néphrons), déshydratation, masse musculaire élevée.', bas: 'Cachexie, faible masse musculaire.' },
      { abrev: 'SDMA', nom: 'Diméthylarginine symétrique', mesure: 'Biomarqueur rénal précoce, détecte la perte de fonction dès 25 à 40% des néphrons.', ref: { chien: '< 14 µg/dL', chat: '< 14 µg/dL' }, eleve: 'Insuffisance rénale précoce; perte de masse musculaire possible (faux négatif).', bas: 'Non significatif.' },
      { abrev: 'PHOS', nom: 'Phosphore', mesure: 'Électrolyte régulé par le rein et la parathyroïde.', ref: { chien: '2,5–6,0 mg/dL', chat: '3,0–7,0 mg/dL' }, eleve: 'Insuffisance rénale, hypoparathyroïdie, alimentation riche en phosphore.', bas: 'Hyperparathyroïdie, malnutrition.' },
      { abrev: 'K⁺', nom: 'Potassium', mesure: 'Électrolyte intracellulaire majeur, régulé par le rein.', ref: { chien: '3,5–5,5 mEq/L', chat: '3,5–5,5 mEq/L' }, eleve: 'Insuffisance rénale oligurique, hypoadrénocorticisme, acidose.', bas: 'Vomissements, diarrhée, polyurie chronique, alcalose.' },
    ],
  },
  {
    id: 'pancreas',
    nom: 'Pancréas',
    image: `${BASE_URL}/pancreas.png`,
    tests: [
      { abrev: 'LIPA', nom: 'Lipase pancréatique (cPLI / fPLI)', mesure: 'Test spécifique à la lipase pancréatique, marqueur de choix pour la pancréatite.', ref: { chien: '< 200 µg/L (cPLI)', chat: '< 3,5 µg/L (fPLI)' }, eleve: 'Pancréatite aiguë ou chronique.', bas: 'Non significatif.' },
      { abrev: 'AMYL', nom: 'Amylase', mesure: 'Enzyme digestive, peu spécifique au pancréas.', ref: { chien: '500–2500 U/L', chat: '500–1500 U/L' }, eleve: 'Pancréatite, insuffisance rénale (élimination réduite), entéropathie.', bas: 'Non significatif.' },
      { abrev: 'GLU', nom: 'Glucose', mesure: 'Sucre sanguin régulé par l\'insuline (pancréas endocrine).', ref: { chien: '70–120 mg/dL', chat: '70–150 mg/dL' }, eleve: 'Diabète sucré, stress (chat), hyperadrénocorticisme.', bas: 'Insulinome, sepsis, insuffisance hépatique, jeûne prolongé chez le chiot ou le chaton.' },
      { abrev: 'FRUC', nom: 'Fructosamine', mesure: 'Reflet de la glycémie moyenne des 2 à 3 dernières semaines, non affecté par le stress.', ref: { chien: '225–375 µmol/L', chat: '190–365 µmol/L' }, eleve: 'Diabète sucré mal contrôlé.', bas: 'Hypoglycémie chronique, hypoalbuminémie.' },
    ],
  },
  {
    id: 'muscle',
    nom: 'Muscle',
    image: `${BASE_URL}/muscle.png`,
    tests: [
      { abrev: 'CK', nom: 'Créatine kinase', mesure: 'Enzyme musculaire, très spécifique aux lésions musculaires.', ref: { chien: '10–200 U/L', chat: '50–300 U/L' }, eleve: 'Traumatisme musculaire, myosite, convulsions, injection IM, rhabdomyolyse.', bas: 'Non significatif.' },
      { abrev: 'AST', nom: 'Aspartate aminotransférase', mesure: 'Présente dans le muscle et le foie; interpréter avec CK pour différencier l\'origine.', ref: { chien: '15–55 U/L', chat: '15–55 U/L' }, eleve: 'Lésion musculaire (si CK élevée) ou hépatique (si CK normale).', bas: 'Non significatif.' },
    ],
  },
  {
    id: 'intestin',
    nom: 'Intestin',
    image: `${BASE_URL}/intestin.png`,
    tests: [
      { abrev: 'ALB', nom: 'Albumine', mesure: 'Protéine absorbée par l\'intestin, marqueur d\'entéropathie avec perte de protéines.', ref: { chien: '2,5–4,0 g/dL', chat: '2,3–3,9 g/dL' }, eleve: 'Déshydratation.', bas: 'Entéropathie exsudative (PLE), malabsorption, inflammation intestinale sévère.' },
      { abrev: 'GLOB', nom: 'Globulines', mesure: 'Protéines de l\'inflammation et de l\'immunité.', ref: { chien: '2,0–4,0 g/dL', chat: '2,6–5,1 g/dL' }, eleve: 'Inflammation chronique, infection, néoplasie (myélome).', bas: 'Immunodéficience, perte intestinale.' },
      { abrev: 'B12', nom: 'Cobalamine (B12)', mesure: 'Vitamine absorbée dans l\'iléon, marqueur de malabsorption intestinale distale.', ref: { chien: '250–900 ng/L', chat: '290–1500 ng/L' }, eleve: 'Non significatif.', bas: 'Malabsorption iléale, dysbiose, insuffisance pancréatique exocrine.' },
      { abrev: 'FOLATE', nom: 'Folate', mesure: 'Vitamine absorbée dans le jéjunum, marqueur de malabsorption intestinale proximale.', ref: { chien: '7–24 µg/L', chat: '13–38 µg/L' }, eleve: 'Dysbiose (surpopulation bactérienne).', bas: 'Malabsorption jéjunale.' },
    ],
  },
  {
    id: 'thyroid',
    nom: 'Thyroïde',
    image: `${BASE_URL}/thyroid.png`,
    tests: [
      { abrev: 'T4 tot.', nom: 'Thyroxine totale (T4)', mesure: 'Hormone thyroïdienne principale, test de dépistage de première intention.', ref: { chien: '1,0–4,0 µg/dL', chat: '0,8–4,7 µg/dL' }, eleve: 'Hyperthyroïdie (chat surtout); artefact possible en maladie non thyroïdienne.', bas: 'Hypothyroïdie (chien surtout); maladie non thyroïdienne (faux bas possible).' },
      { abrev: 'T4 lib.', nom: 'T4 libre (par dialyse)', mesure: 'Fraction active de T4, plus spécifique et moins affectée par les maladies concomitantes.', ref: { chien: '0,6–3,7 ng/dL', chat: '0,6–2,5 ng/dL' }, eleve: 'Hyperthyroïdie.', bas: 'Hypothyroïdie.' },
      { abrev: 'TSH', nom: 'Hormone thyréostimulante', mesure: 'Hormone hypophysaire stimulant la thyroïde, utilisée pour confirmer l\'hypothyroïdie.', ref: { chien: '< 0,68 ng/mL', chat: 'Non validé' }, eleve: 'Hypothyroïdie primaire (chien).', bas: 'Hyperthyroïdie ou suppression hypophysaire.' },
    ],
  },
  {
    id: 'surrenales',
    nom: 'Surrénales',
    image: null,
    tests: [
      { abrev: 'Cortisol', nom: 'Cortisol', mesure: 'Hormone glucocorticoïde évaluée par test de stimulation ACTH ou suppression à la dexaméthasone.', ref: { chien: 'Basal : 1–6 µg/dL', chat: 'Basal : 0,5–5 µg/dL' }, eleve: 'Hyperadrénocorticisme (Cushing); confirmer par test dynamique.', bas: 'Hypoadrénocorticisme (Addison); confirmer par stimulation ACTH.' },
      { abrev: 'Na⁺', nom: 'Sodium', mesure: 'Électrolyte extracellulaire régulé par l\'aldostérone (surrénales).', ref: { chien: '140–155 mEq/L', chat: '147–162 mEq/L' }, eleve: 'Déshydratation hypertonique, diabète insipide.', bas: 'Hypoadrénocorticisme, vomissements, diarrhée, SIADH.' },
      { abrev: 'Na/K', nom: 'Ratio Na/K', mesure: 'Rapport sodium sur potassium, indicateur d\'hypoadrénocorticisme.', ref: { chien: '> 27', chat: '> 27' }, eleve: 'Non significatif.', bas: 'Valeur inférieure à 27 : suspect d\'hypoadrénocorticisme; confirmer par stimulation ACTH.' },
    ],
  },
  {
    id: 'electrolytes',
    nom: 'Électrolytes',
    image: null,
    tests: [
      { abrev: 'Na⁺', nom: 'Sodium', mesure: 'Électrolyte extracellulaire principal, régule l\'osmolarité.', ref: { chien: '140–155 mEq/L', chat: '147–162 mEq/L' }, eleve: 'Déshydratation, diabète insipide.', bas: 'Hypoadrénocorticisme, vomissements, diarrhée, SIADH.' },
      { abrev: 'K⁺', nom: 'Potassium', mesure: 'Électrolyte intracellulaire majeur, régulé par le rein et les surrénales.', ref: { chien: '3,5–5,5 mEq/L', chat: '3,5–5,5 mEq/L' }, eleve: 'Insuffisance rénale, hypoadrénocorticisme, acidose.', bas: 'Vomissements, diarrhée, alcalose, polyurie.' },
      { abrev: 'Cl⁻', nom: 'Chlore', mesure: 'Électrolyte anionique qui suit généralement le sodium.', ref: { chien: '105–120 mEq/L', chat: '107–129 mEq/L' }, eleve: 'Déshydratation, acidose hyperchlorémique.', bas: 'Vomissements (perte d\'acide), alcalose métabolique.' },
      { abrev: 'Ca²⁺', nom: 'Calcium', mesure: 'Régulé par la PTH et la vitamine D; rôle dans la contraction musculaire et la coagulation.', ref: { chien: '9,0–11,5 mg/dL', chat: '8,5–11,0 mg/dL' }, eleve: 'Hyperparathyroïdie, néoplasie, hypervitaminose D, insuffisance rénale.', bas: 'Hypoparathyroïdie, éclampsie, pancréatite aiguë, hypoalbuminémie.' },
      { abrev: 'Mg²⁺', nom: 'Magnésium', mesure: 'Cofacteur enzymatique régulé par le rein et l\'intestin.', ref: { chien: '1,7–2,7 mg/dL', chat: '1,9–2,9 mg/dL' }, eleve: 'Insuffisance rénale, hypoadrénocorticisme.', bas: 'Malabsorption, vomissements ou diarrhée chroniques, diabète.' },
    ],
  },
]

export default function LaBiochimieOrganes() {
  const [testSelectionne, setTestSelectionne] = useState(null)

  return (
    <div className="labo-detail-page">

      {ORGANES.map(organe => (
        <div key={organe.id} className="labo-ref-section bio-organe-section">

          {organe.image ? (
  <div className="bio-organe-image-wrapper">
    <img src={organe.image} alt={organe.nom} className="bio-organe-image" />
  </div>
) : (
  <div className="bio-organe-placeholder">
    <i className="ti ti-flask"></i>
  </div>
)}

          <div className="bio-organe-droite">
          <h2 className="labo-ref-titre bio-organe-titre">{organe.nom}</h2>

          <div className="bio-tests-grid">
            {organe.tests.map(test => (
              <button
                key={test.abrev}
                className="bio-test-btn"
                onClick={() => setTestSelectionne(test)}
              >
                {test.abrev}
              </button>
            ))}
          </div>

       </div>
        </div>
      ))}

      {/* ─── POPUP DÉTAIL TEST ───────────────── */}
      {testSelectionne && (
        <div className="popup-overlay" onClick={() => setTestSelectionne(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>{testSelectionne.abrev} — {testSelectionne.nom}</span>
              <button className="popup-close" onClick={() => setTestSelectionne(null)}>✕</button>
            </div>

            <div className="bio-popup-section">

              <div>
                <p className="bio-popup-label bio-popup-label--primaire">Ce que ça mesure</p>
                <p className="bio-popup-texte">{testSelectionne.mesure}</p>
              </div>

              <div>
                <p className="bio-popup-label bio-popup-label--primaire">Valeurs de référence</p>
                <p className="bio-popup-ref">
                  <img src="/icone-chien.svg" alt="chien" />Chien {testSelectionne.ref.chien}
                </p>
                <p className="bio-popup-ref">
                  <img src="/icone-chat.svg" alt="chat" />Chat {testSelectionne.ref.chat}
                </p>
              </div>

              <div>
                <p className="bio-popup-label bio-popup-label--eleve">↑ Élevé</p>
                <p className="bio-popup-texte">{testSelectionne.eleve}</p>
              </div>

              <div>
                <p className="bio-popup-label bio-popup-label--bas">↓ Bas</p>
                <p className="bio-popup-texte">{testSelectionne.bas}</p>
              </div>

            </div>

            <button className="labo-btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => setTestSelectionne(null)}>
              Fermer
            </button>

          </div>
        </div>
      )}

    </div>
  )
}
