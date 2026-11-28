import { t } from '../lib/i18n'
const DENTS = [
  { type: t('Incisives'), lait: t('2 à 3 semaines'), permanentes: t('3 à 4 mois') },
  { type: t('Canines'), lait: t('3 à 4 semaines'), permanentes: t('4 à 5 mois') },
  { type: t('Prémolaires'), lait: t('3 à 6 semaines'), permanentes: t('4 à 6 mois') },
  { type: t('Molaires'), lait: '-', permanentes: t('4 à 6 mois') },
]

export default function SoinsGenerauxDentisterieCharteChat() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/charte-chat.png" alt={t("Âge d'apparition des dents chez le chat")} className="labo-charte-dentaire" />
        </div>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header">
            <span>{t('Type')}</span>
            <span>{t('Dents de lait')}</span>
            <span>{t('Permanentes')}</span>
          </div>
          {DENTS.map((item, i) => (
            <div key={i} className="labo-ref-ligne">
              <span className="labo-ref-normal">{item.type}</span>
              <span>{item.lait}</span>
              <span>{item.permanentes}</span>
            </div>
          ))}
          {/* Le total suit les colonnes du tableau : lait, puis permanentes. */}
          <div className="labo-ref-ligne" style={{ background: 'var(--bg-secondary)', fontWeight: 700 }}>
            <span className="labo-ref-normal">{t('Nombre de dents')}</span>
            <span>26</span>
            <span>30</span>
          </div>
        </div>
      </div>

    </div>
  )
}
