import FichesMicroorganismes from '../components/FichesMicroorganismes'
import { t } from '../lib/i18n'

const LEVURES = [
  {
    levure: t('Candida spp.'),
    urease: false,
    aspect: t('Colonies lisses, blanches à crème, opaques.'),
    tests: [t('Germ tube test (C. albicans)'), t('Assimilation du glucose')],
    notes: t('Commensal des muqueuses; peut causer stomatite, candidurie, otite, vaginite.'),
  },
  {
    levure: t('Geotrichum spp.'),
    urease: false,
    aspect: t('Colonies blanches, mates, poudreuses. Aspect de "levure moisie".'),
    tests: [t('Pas de pseudohyphes ni blastospores'), t('Pas de croissance à 37 °C chez certaines espèces')],
    notes: t('Rare; isolé en cas de contamination fongique, parfois pathogène opportuniste.'),
  },
  {
    levure: t('Malassezia spp.'),
    urease: true,
    aspect: t('Colonies crémeuses, beiges à brunes, croissance lente à 32 à 35 °C.'),
    tests: [t('Croissance uniquement sur milieux lipidiques (Dixon, Sabouraud + olive)')],
    notes: t('Très fréquente en dermatologie vétérinaire (otite, dermatite); lipophile obligatoire.'),
  },
  {
    levure: t('Trichosporon spp.'),
    urease: true,
    aspect: t('Colonies plissées, crème à beige, parfois ridées.'),
    tests: [t('Assimilation du glucose'), t('Test nitrate positif selon espèce')],
    notes: t('Opportuniste rare; associé à des infections cutanées, urinaires ou disséminées (immunodépression).'),
  },
]

// Le test de l'uréase, en pastille comme le Gram des bactéries, sépare les levures en deux groupes.
const FICHES = LEVURES.map(l => ({
  nom: l.levure,
  pastilles: [{ texte: `${t('Uréase')} ${l.urease ? '+' : '-'}`, ton: l.urease ? 'rouge' : 'bleu' }],
  sections: [
    { titre: t('Aspect en culture'), texte: l.aspect },
    { titre: t('Tests différenciateurs'), liste: l.tests },
  ],
  note: l.notes,
}))

export default function LaMicrobiologieLevures() {
  return (
    <FichesMicroorganismes
      intro={t('Aspect en culture et tests pour distinguer les levures les plus souvent isolées.')}
      fiches={FICHES}
    />
  )
}
