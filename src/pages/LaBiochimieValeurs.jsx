import { useState } from 'react'
import { t, tn, chiffres } from '../lib/i18n'

const SECTIONS = [
  {
    titre: t('Fonction rénale'),
    parametres: [
      { nom: t('Créatinine'), unite: 'mg/L', chien: '5,5–12,5', chat: '5,5–14' },
      { nom: t('Urée'), unite: 'mmol/L', chien: '3,5–8,5', chat: '5–11' },
      { nom: t('Phosphore'), unite: 'mmol/L', chien: '0,9–1,8', chat: '0,9–2,0' },
    ],
  },
  {
    titre: t('Fonction hépatique'),
    parametres: [
      { nom: 'ALT (ALAT)', unite: 'UI/L', chien: '10–88', chat: '10–100' },
      { nom: t('PAL (phosphatases alcalines)'), unite: 'UI/L', chien: '20–150', chat: '10–90' },
      { nom: 'GGT', unite: 'UI/L', chien: '0–11', chat: '0–8' },
      { nom: t('Bilirubine totale'), unite: 'mg/L', chien: '1–6', chat: '1–3' },
      { nom: t('Acides biliaires (à jeun)'), unite: t('µmol/L'), chien: '< 10', chat: '< 10' },
      { nom: t('Albumine'), unite: 'g/L', chien: '23–32', chat: '21–33' },
      { nom: t('Protéines totales'), unite: 'g/L', chien: '55–75', chat: '60–80' },
    ],
  },
  {
    titre: t('Glycémie & Pancréas'),
    parametres: [
      { nom: t('Glucose'), unite: 'g/L', chien: '0,7–1,2', chat: '0,7–1,5' },
      { nom: t('Amylase'), unite: 'UI/L', chien: '250–1300', chat: '250–800' },
      { nom: t('Lipase'), unite: 'UI/L', chien: '< 200', chat: '< 200' },
    ],
  },
  {
    titre: t('Électrolytes'),
    parametres: [
      { nom: t('Sodium (Na⁺)'), unite: 'mEq/L', chien: '140–155', chat: '145–160' },
      { nom: t('Potassium (K⁺)'), unite: 'mEq/L', chien: '3,5–5,8', chat: '3,5–5,5' },
      { nom: t('Chlorures (Cl⁻)'), unite: 'mEq/L', chien: '105–120', chat: '115–130' },
      { nom: t('Calcium total'), unite: 'mg/L', chien: '94–122', chat: '62–102' },
      { nom: t('Bicarbonates'), unite: 'mEq/L', chien: '18–25', chat: '17–22' },
    ],
  },
  {
    titre: t('Lipides'),
    parametres: [
      { nom: t('Cholestérol total'), unite: 'g/L', chien: '1,2–3,5', chat: '0,7–2,5' },
      { nom: t('Triglycérides'), unite: 'g/L', chien: '< 1,5', chat: '< 1,0' },
    ],
  },
  {
    titre: t('Marqueurs musculaires'),
    parametres: [
      { nom: t('CK (créatine kinase)'), unite: 'UI/L', chien: '10–200', chat: '10–130' },
      { nom: 'AST (ASAT)', unite: 'UI/L', chien: '10–50', chat: '10–45' },
    ],
  },
]

export default function LaBiochimieValeurs() {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">
      <p style={{ fontSize: 14, color: 'var(--text-hint)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
        {t('Valeurs indicatives; toujours se référer aux intervalles de référence de votre laboratoire.')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SECTIONS.map((section, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={i} className="labo-tube-card">
              <button
                className={`labo-valeurs-accordeon-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <span className="labo-ref-titre">{section.titre}</span>
                <span style={{ fontSize: 12, color: 'var(--text-hint)', marginRight: 4 }}>
                  {tn(section.parametres.length, '{n} paramètre', '{n} paramètres')}
                </span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>
              {estOuvert && (
                <div className="labo-ref-tableau">
                  <div className="labo-ref-header">
                    <span>{t('Paramètre')}</span>
                    <span>{t('Chien')}</span>
                    <span>{t('Chat')}</span>
                  </div>
                  {section.parametres.map((p, j) => (
                    <div key={j} className="labo-ref-ligne">
                      <span>
                        {p.nom}
                        <br />
                        <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>{chiffres(p.unite)}</span>
                      </span>
                      <span className="labo-ref-normal">{chiffres(p.chien)}</span>
                      <span className="labo-ref-normal">{chiffres(p.chat)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
