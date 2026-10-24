import FichesMicroorganismes from '../components/FichesMicroorganismes'

const LEVURES = [
  {
    levure: 'Candida spp.',
    urease: false,
    aspect: 'Colonies lisses, blanches à crème, opaques.',
    tests: ['Germ tube test (C. albicans)', 'Assimilation du glucose'],
    notes: 'Commensal des muqueuses; peut causer stomatite, candidurie, otite, vaginite.',
  },
  {
    levure: 'Geotrichum spp.',
    urease: false,
    aspect: 'Colonies blanches, mates, poudreuses. Aspect de "levure moisie".',
    tests: ['Pas de pseudohyphes ni blastospores', 'Pas de croissance à 37 °C chez certaines espèces'],
    notes: 'Rare; isolé en cas de contamination fongique, parfois pathogène opportuniste.',
  },
  {
    levure: 'Malassezia spp.',
    urease: true,
    aspect: 'Colonies crémeuses, beiges à brunes, croissance lente à 32 à 35 °C.',
    tests: ['Croissance uniquement sur milieux lipidiques (Dixon, Sabouraud + olive)'],
    notes: 'Très fréquente en dermatologie vétérinaire (otite, dermatite); lipophile obligatoire.',
  },
  {
    levure: 'Trichosporon spp.',
    urease: true,
    aspect: 'Colonies plissées, crème à beige, parfois ridées.',
    tests: ['Assimilation du glucose', 'Test nitrate positif selon espèce'],
    notes: 'Opportuniste rare; associé à des infections cutanées, urinaires ou disséminées (immunodépression).',
  },
]

// Le test de l'uréase, en pastille comme le Gram des bactéries, sépare les levures en deux groupes.
const FICHES = LEVURES.map(l => ({
  nom: l.levure,
  pastilles: [{ texte: `Uréase ${l.urease ? '+' : '-'}`, ton: l.urease ? 'rouge' : 'bleu' }],
  sections: [
    { titre: 'Aspect en culture', texte: l.aspect },
    { titre: 'Tests différenciateurs', liste: l.tests },
  ],
  note: l.notes,
}))

export default function LaMicrobiologieLevures() {
  return (
    <FichesMicroorganismes
      intro="Aspect en culture et tests pour distinguer les levures les plus souvent isolées."
      fiches={FICHES}
    />
  )
}
