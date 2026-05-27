const TESTS = [
  { test: 'Acides biliaires', nom: 'Test ELISA pour évaluer la fonction hépatique via les acides biliaires sériques.', type: 'ELISA' },
  { test: 'Allergies', nom: 'Allercept, test sérologique d\'allergies courantes chez le chien et le chat.', type: 'ELISA' },
  { test: 'Arthrite rhumatoïde', nom: 'Synbiotics CRF, détection du facteur rhumatoïde canin.', type: 'Latex agglutination' },
  { test: 'Brucellose', nom: 'Test sérologique (Herdchek) pour le dépistage de Brucella abortus.', type: 'ELISA' },
  { test: 'Erlichiose, borréliose, dirofilariose', nom: 'SNAP 3Dx, test combiné pour Ehrlichia, Borrelia (Lyme) et ver du coeur.', type: 'ELISA' },
  { test: 'Gestation canine', nom: 'Relaxin, détection hormonale de la gestation chez la chienne.', type: 'RIM' },
  { test: 'Groupes sanguins canins', nom: 'Rapid Vet-H, détermination des groupes sanguins par agglutination.', type: 'Test d\'agglutination' },
  { test: 'Leucose et FIV félins', nom: 'SNAP Combo, détection simultanée de FeLV et du virus d\'immunodéficience féline (FIV).', type: 'ELISA' },
  { test: 'Leucose féline (FeLV)', nom: 'SNAP FeLV, Witness FeLV, Assure, Virachek; détection de l\'antigène FeLV.', type: 'ELISA' },
  { test: 'Mycoplasmes', nom: 'Détection antigénique par agglutination sur lame.', type: 'Test d\'agglutination sur lame' },
  { test: 'Ovulation', nom: 'ICG Status-LH, détection de l\'hormone lutéinisante (LH).', type: 'Immunochromatographie' },
  { test: 'Parvovirus canin', nom: 'SNAP Parvo, test rapide de détection d\'antigène viral dans les selles.', type: 'ELISA' },
  { test: 'Progesterone', nom: 'Ovuchek Premate, mesure hormonale pour déterminer le moment de l\'ovulation.', type: 'ELISA' },
  { test: 'Péritonite infectieuse féline (PIF)', nom: 'Virachek CV, test de détection indirecte (anticorps coronavirus félin).', type: 'ELISA' },
  { test: 'Tuberculose', nom: 'PPD tuberculinique, test d\'hypersensibilité différée.', type: 'Test intradermique' },
  { test: 'Ver du coeur', nom: 'SNAP Heartworm, Petchek, Dirochek, Witness HW; détection de l\'antigène de Dirofilaria immitis.', type: 'ELISA' },
  { test: 'Ver du coeur (test alternatif)', nom: 'Heska Solo Step FH & CH, test immunologique rapide (FH = adulte femelle, CH = microfilaires).', type: 'Immunomigration latérale' },
  { test: 'Von Willebrand (facteur)', nom: 'vWF ZYMTEC, dosage du facteur von Willebrand.', type: 'ELISA' },
]

export default function LaBiochimieImmuno() {
  return (
    <div className="labo-detail-page">
      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header" style={{ gridTemplateColumns: '1.2fr 2fr 1fr' }}>
            <span>Test</span>
            <span>Description</span>
            <span>Type</span>
          </div>
          {TESTS.map((t, i) => (
            <div key={i} className="labo-ref-ligne" style={{ gridTemplateColumns: '1.2fr 2fr 1fr' }}>
              <span style={{ fontWeight: 600 }}>{t.test}</span>
              <span>{t.nom}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
