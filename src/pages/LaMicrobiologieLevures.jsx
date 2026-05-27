const LEVURES = [
  {
    levure: 'Candida spp.',
    aspect: 'Colonies lisses, blanches à crème, opaques.',
    tests: 'Germ tube test (C. albicans); Uréase négatif; Assimilation du glucose.',
    notes: 'Commensal des muqueuses; peut causer stomatite, candidurie, otite, vaginite.',
  },
  {
    levure: 'Geotrichum spp.',
    aspect: 'Colonies blanches, mates, poudreuses. Aspect de "levure moisie".',
    tests: 'Uréase négatif; pas de pseudohyphes ni blastospores; pas de croissance à 37 °C chez certaines espèces.',
    notes: 'Rare; isolé en cas de contamination fongique, parfois pathogène opportuniste.',
  },
  {
    levure: 'Malassezia spp.',
    aspect: 'Colonies crémeuses, beiges à brunes, croissance lente à 32 à 35 °C.',
    tests: 'Croissance uniquement sur milieux lipidiques (Dixon, Sabouraud + olive); Uréase positif.',
    notes: 'Très fréquente en dermatologie vétérinaire (otite, dermatite); lipophile obligatoire.',
  },
  {
    levure: 'Trichosporon spp.',
    aspect: 'Colonies plissées, crème à beige, parfois ridées.',
    tests: 'Uréase positif; Assimilation du glucose; Test nitrate positif selon espèce.',
    notes: 'Opportuniste rare; associé à des infections cutanées, urinaires ou disséminées (immunodépression).',
  },
]

export default function LaMicrobiologieLevures() {
  return (
    <div className="labo-detail-page">
      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--4col-levures">
            <span>Levure</span>
            <span>Aspect en culture</span>
            <span>Tests différenciateurs</span>
            <span>Notes</span>
          </div>
          {LEVURES.map((row, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--4col-levures">
              <span style={{ fontStyle: 'italic', fontWeight: 600 }}>{row.levure}</span>
              <span>{row.aspect}</span>
              <span>{row.tests}</span>
              <span>{row.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
