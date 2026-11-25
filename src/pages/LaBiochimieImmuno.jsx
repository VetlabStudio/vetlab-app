import { t } from '../lib/i18n'
const TESTS = [
  { test: t('Acides biliaires'), nom: t('Test ELISA pour évaluer la fonction hépatique via les acides biliaires sériques.'), type: t('ELISA') },
  { test: t('Allergies'), nom: t('Allercept, test sérologique d\'allergies courantes chez le chien et le chat.'), type: t('ELISA') },
  { test: t('Arthrite rhumatoïde'), nom: t('Synbiotics CRF, détection du facteur rhumatoïde canin.'), type: t('Latex agglutination') },
  { test: t('Brucellose'), nom: t('Test sérologique (Herdchek) pour le dépistage de Brucella abortus.'), type: t('ELISA') },
  { test: t('Erlichiose, borréliose, dirofilariose'), nom: t('SNAP 3Dx, test combiné pour Ehrlichia, Borrelia (Lyme) et ver du coeur.'), type: t('ELISA') },
  { test: t('Gestation canine'), nom: t('Relaxin, détection hormonale de la gestation chez la chienne.'), type: t('RIM') },
  { test: t('Groupes sanguins canins'), nom: t('Rapid Vet-H, détermination des groupes sanguins par agglutination.'), type: t('Test d\'agglutination') },
  { test: t('Leucose et FIV félins'), nom: t('SNAP Combo, détection simultanée de FeLV et du virus d\'immunodéficience féline (FIV).'), type: t('ELISA') },
  { test: t('Leucose féline (FeLV)'), nom: t('SNAP FeLV, Witness FeLV, Assure, Virachek; détection de l\'antigène FeLV.'), type: t('ELISA') },
  { test: t('Mycoplasmes'), nom: t('Détection antigénique par agglutination sur lame.'), type: t('Test d\'agglutination sur lame') },
  { test: t('Ovulation'), nom: t('ICG Status-LH, détection de l\'hormone lutéinisante (LH).'), type: t('Immunochromatographie') },
  { test: t('Parvovirus canin'), nom: t('SNAP Parvo, test rapide de détection d\'antigène viral dans les selles.'), type: t('ELISA') },
  { test: t('Progesterone'), nom: t('Ovuchek Premate, mesure hormonale pour déterminer le moment de l\'ovulation.'), type: t('ELISA') },
  { test: t('Péritonite infectieuse féline (PIF)'), nom: t('Virachek CV, test de détection indirecte (anticorps coronavirus félin).'), type: t('ELISA') },
  { test: t('Tuberculose'), nom: t('PPD tuberculinique, test d\'hypersensibilité différée.'), type: t('Test intradermique') },
  { test: t('Ver du coeur'), nom: t('SNAP Heartworm, Petchek, Dirochek, Witness HW; détection de l\'antigène de Dirofilaria immitis.'), type: t('ELISA') },
  { test: t('Ver du coeur (test alternatif)'), nom: t('Heska Solo Step FH & CH, test immunologique rapide (FH = adulte femelle, CH = microfilaires).'), type: t('Immunomigration latérale') },
  { test: t('Von Willebrand (facteur)'), nom: t('vWF ZYMTEC, dosage du facteur von Willebrand.'), type: t('ELISA') },
]

export default function LaBiochimieImmuno() {
  return (
    <div className="labo-detail-page">
      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1.2fr 2fr 1fr' }}>
            <span>{t('Test')}</span>
            <span>{t('Description')}</span>
            <span>{t('Type')}</span>
          </div>
          {TESTS.map((ligne, i) => (
            <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1.2fr 2fr 1fr' }}>
              <span style={{ fontWeight: 600 }}>{ligne.test}</span>
              <span>{ligne.nom}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{ligne.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
