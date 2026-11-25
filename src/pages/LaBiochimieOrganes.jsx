import { useState } from 'react'
import { t, tn, chiffres } from '../lib/i18n'

const ORGANES = [
  {
    id: 'foie',
    nom: t('Foie'),
    image: '/foie.png',
    tests: [
      { abrev: 'ALT', nom: t('Alanine aminotransférase'), mesure: t('Enzyme hépatique spécifique, indicateur de lésion des hépatocytes.'), ref: { chien: '10–100 U/L', chat: '10–100 U/L' }, eleve: t('Hépatite, nécrose hépatique, lipidose (chat), toxicité médicamenteuse.'), bas: t('Peu significatif cliniquement.') },
      { abrev: 'ALP', nom: t('Phosphatase alcaline'), mesure: t('Enzyme produite par le foie, les os et les corticosurrénales.'), ref: { chien: '20–150 U/L', chat: '10–90 U/L' }, eleve: t('Cholestase, hyperadrénocorticisme (chien), induction médicamenteuse (cortico, phénobarbital).'), bas: t('Peu significatif.') },
      { abrev: 'GGT', nom: t('Gamma-glutamyltransférase'), mesure: t('Enzyme de cholestase, plus spécifique que l\'ALP chez le chat.'), ref: { chien: '0–11 U/L', chat: '0–4 U/L' }, eleve: t('Cholestase, lipidose hépatique (chat), hyperadrénocorticisme.'), bas: t('Non significatif.') },
      { abrev: 'AST', nom: t('Aspartate aminotransférase'), mesure: t('Enzyme hépatique et musculaire, moins spécifique qu\'ALT.'), ref: { chien: '15–55 U/L', chat: '15–55 U/L' }, eleve: t('Lésion hépatique ou musculaire; toujours interpréter avec CK.'), bas: t('Non significatif.') },
      { abrev: 'TBIL', nom: t('Bilirubine totale'), mesure: t('Produit de dégradation de l\'hémoglobine, marqueur de cholestase ou d\'hémolyse.'), ref: { chien: '0–0,4 mg/dL', chat: '0–0,4 mg/dL' }, eleve: t('Ictère pré-hépatique, hépatique ou post-hépatique.'), bas: t('Non significatif.') },
      { abrev: 'ALB', nom: t('Albumine'), mesure: t('Protéine synthétisée par le foie, marqueur de fonction hépatique chronique.'), ref: { chien: '2,5–4,0 g/dL', chat: '2,3–3,9 g/dL' }, eleve: t('Déshydratation.'), bas: t('Insuffisance hépatique chronique, entéropathie, néphropathie.') },
    ],
  },
  {
    id: 'rein',
    nom: t('Rein'),
    image: '/rein.png',
    tests: [
      { abrev: 'BUN', nom: t('Azote uréique sanguin'), mesure: t('Produit de dégradation des protéines, filtré par le rein.'), ref: { chien: '7–27 mg/dL', chat: '14–36 mg/dL' }, eleve: t('Insuffisance rénale, déshydratation, alimentation riche en protéines, saignement GI.'), bas: t('Insuffisance hépatique sévère, polyurie.') },
      { abrev: 'CREA', nom: t('Créatinine'), mesure: t('Produit du métabolisme musculaire, filtré par le rein. Plus spécifique que BUN.'), ref: { chien: '0,5–1,5 mg/dL', chat: '0,8–1,8 mg/dL' }, eleve: t('Insuffisance rénale (perte de plus de 75% des néphrons), déshydratation, masse musculaire élevée.'), bas: t('Cachexie, faible masse musculaire.') },
      { abrev: 'SDMA', nom: t('Diméthylarginine symétrique'), mesure: t('Biomarqueur rénal précoce, détecte la perte de fonction dès 25 à 40% des néphrons.'), ref: { chien: '< 14 µg/dL', chat: '< 14 µg/dL' }, eleve: t('Insuffisance rénale précoce; perte de masse musculaire possible (faux négatif).'), bas: t('Non significatif.') },
      { abrev: 'PHOS', nom: t('Phosphore'), mesure: t('Électrolyte régulé par le rein et la parathyroïde.'), ref: { chien: '2,5–6,0 mg/dL', chat: '3,0–7,0 mg/dL' }, eleve: t('Insuffisance rénale, hypoparathyroïdie, alimentation riche en phosphore.'), bas: t('Hyperparathyroïdie, malnutrition.') },
      { abrev: 'K⁺', nom: t('Potassium'), mesure: t('Électrolyte intracellulaire majeur, régulé par le rein.'), ref: { chien: '3,5–5,5 mEq/L', chat: '3,5–5,5 mEq/L' }, eleve: t('Insuffisance rénale oligurique, hypoadrénocorticisme, acidose.'), bas: t('Vomissements, diarrhée, polyurie chronique, alcalose.') },
    ],
  },
  {
    id: 'pancreas',
    nom: t('Pancréas'),
    image: '/pancreas.png',
    tests: [
      { abrev: 'LIPA', nom: t('Lipase pancréatique (cPLI / fPLI)'), mesure: t('Test spécifique à la lipase pancréatique, marqueur de choix pour la pancréatite.'), ref: { chien: t('< 200 µg/L (cPLI)'), chat: t('< 3,5 µg/L (fPLI)') }, eleve: t('Pancréatite aiguë ou chronique.'), bas: t('Non significatif.') },
      { abrev: 'AMYL', nom: t('Amylase'), mesure: t('Enzyme digestive, peu spécifique au pancréas.'), ref: { chien: '500–2500 U/L', chat: '500–1500 U/L' }, eleve: t('Pancréatite, insuffisance rénale (élimination réduite), entéropathie.'), bas: t('Non significatif.') },
      { abrev: 'GLU', nom: t('Glucose'), mesure: t('Sucre sanguin régulé par l\'insuline (pancréas endocrine).'), ref: { chien: '70–120 mg/dL', chat: '70–150 mg/dL' }, eleve: t('Diabète sucré, stress (chat), hyperadrénocorticisme.'), bas: t('Insulinome, sepsis, insuffisance hépatique, jeûne prolongé chez le chiot ou le chaton.') },
      { abrev: 'FRUC', nom: t('Fructosamine'), mesure: t('Reflet de la glycémie moyenne des 2 à 3 dernières semaines, non affecté par le stress.'), ref: { chien: t('225–375 µmol/L'), chat: t('190–365 µmol/L') }, eleve: t('Diabète sucré mal contrôlé.'), bas: t('Hypoglycémie chronique, hypoalbuminémie.') },
    ],
  },
  {
    id: 'muscle',
    nom: t('Muscle'),
    image: '/muscle.png',
    tests: [
      { abrev: 'CK', nom: t('Créatine kinase'), mesure: t('Enzyme musculaire, très spécifique aux lésions musculaires.'), ref: { chien: '10–200 U/L', chat: '50–300 U/L' }, eleve: t('Traumatisme musculaire, myosite, convulsions, injection IM, rhabdomyolyse.'), bas: t('Non significatif.') },
      { abrev: 'AST', nom: t('Aspartate aminotransférase'), mesure: t('Présente dans le muscle et le foie; interpréter avec CK pour différencier l\'origine.'), ref: { chien: '15–55 U/L', chat: '15–55 U/L' }, eleve: t('Lésion musculaire (si CK élevée) ou hépatique (si CK normale).'), bas: t('Non significatif.') },
    ],
  },
  {
    id: 'intestin',
    nom: t('Intestin'),
    image: '/intestin.png',
    tests: [
      { abrev: 'ALB', nom: t('Albumine'), mesure: t('Protéine pouvant être perdue par l\'intestin, marqueur d\'entéropathie avec perte de protéines.'), ref: { chien: '2,5–4,0 g/dL', chat: '2,3–3,9 g/dL' }, eleve: t('Déshydratation.'), bas: t('Entéropathie exsudative (PLE), malabsorption, inflammation intestinale sévère.') },
      { abrev: 'GLOB', nom: t('Globulines'), mesure: t('Protéines de l\'inflammation et de l\'immunité.'), ref: { chien: '2,0–4,0 g/dL', chat: '2,6–5,1 g/dL' }, eleve: t('Inflammation chronique, infection, néoplasie (myélome).'), bas: t('Immunodéficience, perte intestinale.') },
      { abrev: 'B12', nom: t('Cobalamine (B12)'), mesure: t('Vitamine absorbée dans l\'iléon, marqueur de malabsorption intestinale distale.'), ref: { chien: t('250–900 ng/L'), chat: t('290–1500 ng/L') }, eleve: t('Non significatif.'), bas: t('Malabsorption iléale, dysbiose, insuffisance pancréatique exocrine.') },
      { abrev: 'FOLATE', nom: t('Folate'), mesure: t('Vitamine absorbée dans le jéjunum, marqueur de malabsorption intestinale proximale.'), ref: { chien: '7–24 µg/L', chat: '13–38 µg/L' }, eleve: t('Dysbiose (surpopulation bactérienne).'), bas: t('Malabsorption jéjunale.') },
    ],
  },
  {
    id: 'thyroid',
    nom: t('Thyroïde'),
    image: '/thyroid.png',
    tests: [
      { abrev: t('T4 tot.'), nom: t('Thyroxine totale (T4)'), mesure: t('Hormone thyroïdienne principale, test de dépistage de première intention.'), ref: { chien: '1,0–4,0 µg/dL', chat: '0,8–4,7 µg/dL' }, eleve: t('Hyperthyroïdie (chat surtout); artefact possible en maladie non thyroïdienne.'), bas: t('Hypothyroïdie (chien surtout); maladie non thyroïdienne (faux bas possible).') },
      { abrev: t('T4 lib.'), nom: t('T4 libre (par dialyse)'), mesure: t('Fraction active de T4, plus spécifique et moins affectée par les maladies concomitantes.'), ref: { chien: t('0,6–3,7 ng/dL'), chat: t('0,6–2,5 ng/dL') }, eleve: t('Hyperthyroïdie.'), bas: t('Hypothyroïdie.') },
      { abrev: 'TSH', nom: t('Hormone thyréostimulante'), mesure: t('Hormone hypophysaire stimulant la thyroïde, utilisée pour confirmer l\'hypothyroïdie.'), ref: { chien: t('< 0,68 ng/mL'), chat: t('Non validé') }, eleve: t('Hypothyroïdie primaire (chien).'), bas: t('Hyperthyroïdie ou suppression hypophysaire.') },
    ],
  },
  {
    id: 'surrenales',
    nom: t('Surrénales'),
    image: '/surrenal.png',
    tests: [
      { abrev: 'Cortisol', nom: t('Cortisol'), mesure: t('Hormone glucocorticoïde évaluée par test de stimulation ACTH ou suppression à la dexaméthasone.'), ref: { chien: t('Basal : 1–6 µg/dL'), chat: t('Basal : 0,5–5 µg/dL') }, eleve: t('Hyperadrénocorticisme (Cushing); confirmer par test dynamique.'), bas: t('Hypoadrénocorticisme (Addison); confirmer par stimulation ACTH.') },
      { abrev: 'Na⁺', nom: t('Sodium'), mesure: t('Électrolyte extracellulaire régulé par l\'aldostérone (surrénales).'), ref: { chien: '140–155 mEq/L', chat: '147–162 mEq/L' }, eleve: t('Déshydratation hypertonique, diabète insipide.'), bas: t('Hypoadrénocorticisme, vomissements, diarrhée, SIADH.') },
      { abrev: 'Na/K', nom: t('Ratio Na/K'), mesure: t('Rapport sodium sur potassium, indicateur d\'hypoadrénocorticisme.'), ref: { chien: '> 27', chat: '> 27' }, eleve: t('Non significatif.'), bas: t('Valeur inférieure à 27 : suspect d\'hypoadrénocorticisme; confirmer par stimulation ACTH.') },
    ],
  },
  {
    id: 'electrolytes',
    nom: t('Électrolytes'),
    image: '/electrolytes.png',
    tests: [
      { abrev: 'Na⁺', nom: t('Sodium'), mesure: t('Électrolyte extracellulaire principal, régule l\'osmolarité.'), ref: { chien: '140–155 mEq/L', chat: '147–162 mEq/L' }, eleve: t('Déshydratation, diabète insipide.'), bas: t('Hypoadrénocorticisme, vomissements, diarrhée, SIADH.') },
      { abrev: 'K⁺', nom: t('Potassium'), mesure: t('Électrolyte intracellulaire majeur, régulé par le rein et les surrénales.'), ref: { chien: '3,5–5,5 mEq/L', chat: '3,5–5,5 mEq/L' }, eleve: t('Insuffisance rénale, hypoadrénocorticisme, acidose.'), bas: t('Vomissements, diarrhée, alcalose, polyurie.') },
      { abrev: 'Cl⁻', nom: t('Chlore'), mesure: t('Électrolyte anionique qui suit généralement le sodium.'), ref: { chien: '105–120 mEq/L', chat: '107–129 mEq/L' }, eleve: t('Déshydratation, acidose hyperchlorémique.'), bas: t('Vomissements (perte d\'acide), alcalose métabolique.') },
      { abrev: 'Ca²⁺', nom: t('Calcium'), mesure: t('Régulé par la PTH et la vitamine D; rôle dans la contraction musculaire et la coagulation.'), ref: { chien: '9,0–11,5 mg/dL', chat: '8,5–11,0 mg/dL' }, eleve: t('Hyperparathyroïdie, néoplasie, hypervitaminose D, insuffisance rénale.'), bas: t('Hypoparathyroïdie, éclampsie, pancréatite aiguë, hypoalbuminémie.') },
      { abrev: 'Mg²⁺', nom: t('Magnésium'), mesure: t('Cofacteur enzymatique régulé par le rein et l\'intestin.'), ref: { chien: '1,7–2,7 mg/dL', chat: '1,9–2,9 mg/dL' }, eleve: t('Insuffisance rénale, hypoadrénocorticisme.'), bas: t('Malabsorption, vomissements ou diarrhée chroniques, diabète.') },
    ],
  },
]

const TOUS_LES_TESTS = ORGANES.flatMap(o => o.tests.map(t => ({ ...t, organe: o.nom })))

function TestAccordeon({ test, ouvert, onToggle }) {
  return (
    <div className="labo-tube-card">
      <button
        className={`labo-tube-header${ouvert ? ' ouvert' : ''}`}
        onClick={onToggle}
      >
        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: 52, fontSize: 13 }}>{test.abrev}</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, textAlign: 'left' }}>{test.nom}</span>
        {test.organe && <span style={{ fontSize: 11, color: 'var(--text-hint)', marginRight: 4 }}>{test.organe}</span>}
        <i className={`ti ti-chevron-down labo-tube-chevron${ouvert ? ' ouvert' : ''}`}></i>
      </button>
      {ouvert && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{test.mesure}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <img src="/icone-chien.svg" alt="chien" style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{t('Chien')}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{chiffres(test.ref.chien)}</span>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <img src="/icone-chat.svg" alt="chat" style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{t('Chat')}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{chiffres(test.ref.chat)}</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', display: 'block', marginBottom: 2 }}>{t('↑ Élevé')}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{test.eleve}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1F6FA8', display: 'block', marginBottom: 2 }}>{t('↓ Bas')}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{test.bas}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LaBiochimieOrganes() {
  const [recherche, setRecherche] = useState('')
  const [organeActif, setOrganeActif] = useState('foie')
  const [testOuvert, setTestOuvert] = useState(null)

  const termeNormalise = recherche.toLowerCase().trim()
  const enRecherche = termeNormalise.length > 0

  const resultatsRecherche = enRecherche
    ? TOUS_LES_TESTS.filter(t =>
        t.abrev.toLowerCase().includes(termeNormalise) ||
        t.nom.toLowerCase().includes(termeNormalise)
      )
    : []

  function selectionnerOrgane(id) {
    setOrganeActif(id === organeActif ? null : id)
    setTestOuvert(null)
  }

  const organe = ORGANES.find(o => o.id === organeActif)

  return (
    <div className="labo-detail-page">

      {/* ─── BARRE DE RECHERCHE ─────────────── */}
      <div className="labo-search-bar">
        <i className="ti ti-search labo-search-icone"></i>
        <input
          className="labo-search-input"
          type="text"
          placeholder={t('Rechercher un test (ex: ALT, créatinine...)')}
          value={recherche}
          onChange={e => { setRecherche(e.target.value); setOrganeActif(null); setTestOuvert(null) }}
        />
        {enRecherche && (
          <button className="labo-search-clear" onClick={() => setRecherche('')}>
            <i className="ti ti-x"></i>
          </button>
        )}
      </div>

      {enRecherche ? (
        /* ─── RÉSULTATS RECHERCHE ───────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {resultatsRecherche.length === 0
            ? <p style={{ fontSize: 14, color: 'var(--text-hint)', textAlign: 'center', marginTop: 24 }}>{t('Aucun résultat pour « {q} »', { q: recherche })}</p>
            : resultatsRecherche.map((test, i) => (
                <TestAccordeon
                  key={i}
                  test={test}
                  ouvert={testOuvert === `search-${i}`}
                  onToggle={() => setTestOuvert(testOuvert === `search-${i}` ? null : `search-${i}`)}
                />
              ))
          }
        </div>
      ) : (
        <>
          {/* ─── GRILLE ORGANES ─────────────── */}
          <div className="bio-organe-grille">
            {ORGANES.map(o => {
              const actif = organeActif === o.id
              return (
                <button
                  key={o.id}
                  className={`bio-organe-btn${actif ? ' actif' : ''}`}
                  onClick={() => selectionnerOrgane(o.id)}
                >
                  {o.image
                    ? <img src={o.image} alt={o.nom} className="bio-organe-btn-img" />
                    : <i className="ti ti-flask" style={{ fontSize: 28, color: actif ? 'var(--primary)' : 'var(--text-hint)' }}></i>
                  }
                  <span>{o.nom}</span>
                </button>
              )
            })}
          </div>

          {/* ─── TESTS EN ACCORDÉON ─────────── */}
          {organe && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                {organe.nom} - {tn(organe.tests.length, '{n} test', '{n} tests')}
              </p>
              {organe.tests.map((test, i) => (
                <TestAccordeon
                  key={test.abrev}
                  test={{ ...test, organe: null }}
                  ouvert={testOuvert === i}
                  onToggle={() => setTestOuvert(testOuvert === i ? null : i)}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  )
}
