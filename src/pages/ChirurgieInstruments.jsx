import { useState } from 'react'
import { t } from '../lib/i18n'

const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Instruments'

const INSTRUMENTS = [
  { nom: t('Ciseaux à bouts mousse et pointus'), fichier: 'ciseaux-mousse-pointus.png', description: t('Utilisés pour couper les fils de suture, ils sont plus abordables que les ciseaux Mayo ou Metzenbaum, réservés aux tissus.') },
  { nom: t('Ciseaux Metzenbaum'), fichier: 'ciseaux-metzenbaum.png', description: t('Idéals pour les dissections délicates. Leur conception se distingue par un manche long par rapport à la lame, facilitant la manipulation précise.') },
  { nom: t('Ciseaux Mayo'), fichier: 'ciseaux-mayo.png', description: t('Utilisés pour sectionner les structures résistantes comme les muscles, le fascia ou d\'autres tissus conjonctifs.') },
  { nom: t('Ciseaux à bandage Lister'), fichier: 'ciseaux-lister.png', description: t('Leur embout spécial permet de découper les bandages sans risquer d\'endommager les tissus sous-jacents.') },
  { nom: t('Ciseaux de ténotomie Stevens'), fichier: 'ciseaux-stevens.png', description: t('Très fins et légers, ils sont conçus pour les interventions chirurgicales minutieuses.') },
  { nom: t('Ciseaux Iris'), fichier: 'ciseaux-iris.png', description: t('Initialement créés pour les interventions ophtalmiques, ils sont maintenant utilisés pour la coupe fine en général.') },
  { nom: t('Ciseaux à sutures'), fichier: 'ciseaux-sutures.png', description: t('Ils permettent de saisir et couper les boucles de fil de suture, facilitant le retrait des points.') },
  { nom: t('Porte-aiguille Olsen-Hegar'), fichier: 'porte-aiguille-olsen-hegar.png', description: t('Instrument 2-en-1 : il permet à la fois de tenir l\'aiguille et de couper le fil, sans changer d\'outil.') },
  { nom: t('Porte-aiguille Crile'), fichier: 'porte-aiguille-crile.png', description: t('Instrument classique servant à manipuler les aiguilles, mais sans lames intégrées pour couper.') },
  { nom: t('Clamp vasculaire de Debakey'), fichier: 'clamp-debakey.png', description: t('Utilisé en chirurgie vasculaire pour occlure délicatement un vaisseau sanguin et limiter un saignement sans l\'endommager.') },
  { nom: t('Clamp Alligator'), fichier: 'clamp-alligator.png', description: t('Conçu pour saisir des objets dans des zones étroites et profondes comme le canal auditif.') },
  { nom: t('Clamp intestinal de Doyen'), fichier: 'clampdoyen.png', description: t('Utilisé pour occlure temporairement l\'intestin sans traumatisme grâce à des mâchoires douces.') },
  { nom: t('Pince hémostatique de Halsted (mosquito)'), fichier: 'pince-mosquito.png', description: t('Destinée à comprimer de très petits vaisseaux sanguins.') },
  { nom: t('Pince Kelly'), fichier: 'pince-crile.png', description: t('Sert à comprimer les petits vaisseaux. Comparée à la mosquito, elle a des mâchoires plus longues. Contrairement à la Crile, les stries ne couvrent que la moitié distale.') },
  { nom: t('Pince Crile'), fichier: 'pincecrile.png', description: t('Semblable à la pince Kelly, elle est utilisée pour occlure de petits vaisseaux, mais présente une striation complète des mâchoires.') },
  { nom: t('Pince Rochester-Carmalt'), fichier: 'pince-rochester.png', description: t('Surnommée "Stars and Stripes" en raison de ses stries croisées à l\'extrémité et longitudinales à la base. Utilisée pour clamper les tissus ou ligaturer les pédicules.') },
  { nom: t('Pince à tissus Allis'), fichier: 'pince-allis.png', description: t('Conçue pour soulever et maintenir des tissus denses ou glissants. Dotée de rangées de dents acérées à chaque extrémité.') },
  { nom: t('Pince à tissus Babcock'), fichier: 'pice-babcock.png', description: t('Similaire à la pince Allis, mais moins traumatique, elle possède des extrémités plates et arrondies, idéales pour manipuler les tissus délicats comme l\'intestin.') },
  { nom: t('Pince Adson Brown'), fichier: 'pince-adson-brown.png', description: t('Modèle standard le plus couramment utilisé pour la chirurgie générale.') },
  { nom: t('Pince Adson à tissus'), fichier: 'pince-adson-tissus.png', description: t('Dotée d\'extrémités fines idéales pour manipuler les tissus délicats, avec une large surface de préhension.') },
  { nom: t('Pince Adson Debakey'), fichier: 'pince-adson-debakey.png', description: t('Le modèle le plus fin et précis pour les interventions délicates.') },
  { nom: t('Pince à tissus'), fichier: 'pince-tissus.png', description: t('Souvent utilisées pour saisir et maintenir fermement les tissus lors de chirurgies.') },
  { nom: t('Pince Potts Smith'), fichier: 'pince-potts-smith.png', description: t('Utilisée principalement en chirurgie ORL, reconnue pour sa forme fine et allongée.') },
  { nom: t('Pince russe'), fichier: 'pince-russe.png', description: t('Pince plus robuste, conçue pour une manipulation plus ferme des tissus.') },
  { nom: t('Pince Backhaus'), fichier: 'pince-backhaus.png', description: t('Conçue pour maintenir les champs stériles en place en les accrochant à la peau du patient à l\'aide de pointes perforantes.') },
  { nom: t('Pince Jones'), fichier: 'pince-jones.png', description: t('Modèle léger et délicat, recommandé pour les interventions nécessitant une fixation douce et précise des champs opératoires.') },
  { nom: t('Pinces Foerster'), fichier: 'pince-foerster.png', description: t('Utilisées pour tenir des compresses stériles lors de la préparation aseptique ou pour absorber des fluides pendant une intervention.') },
  { nom: t('Pinces de Kern'), fichier: 'pinces-kern.png', description: t('Utilisées pour maintenir en place des plaques ou fragments osseux pendant la fixation orthopédique.') },
  { nom: t('Pinces coupantes'), fichier: 'pinces-coupantes.png', description: t('Serre-fils utilisées pour sectionner des fils ou broches métalliques lors d\'interventions orthopédiques.') },
  { nom: t('Manche de bistouri #3'), fichier: 'manchebistouri.png', description: t('Support standard pour lames chirurgicales de petite taille (compatibles : #10, #11, #12, #15).') },
  { nom: t('Lame #10'), fichier: 'lame10.png', description: t('Lame de bistouri classique à large tranchant, idéale pour les incisions générales en chirurgie.') },
  { nom: t('Lame #11'), fichier: 'lame11.png', description: t('Présente une pointe fine conçue pour réaliser des incisions de type perforation. Fréquemment employée pour initier l\'ouverture de la ligne blanche.') },
  { nom: t('Lame #15'), fichier: 'lame15.png', description: t('Dotée d\'un tranchant court, elle permet une grande précision lors des sections délicates.') },
  { nom: t('Cystotome / Cuillère vésiculaire'), fichier: 'cystotome.png', description: t('Permet de retirer des calculs présents dans des organes creux comme la vessie ou la vésicule biliaire.') },
  { nom: t('Crochet de stérilisation (Snook)'), fichier: 'crochetsterilisation1.png', description: t('Employé en chirurgie ovarienne pour repérer l\'ovaire avec précision.') },
  { nom: t('Coupe-os'), fichier: 'coupe-os.png', description: t('Instrument dont les mâchoires sont conçues pour offrir un angle optimal permettant de sectionner efficacement l\'os lors de certaines procédures chirurgicales.') },
  { nom: t('Curette osseuse de Volkmann'), fichier: 'curette-osseuse.png', description: t('Utilisée fréquemment en chirurgie orthopédique pour nettoyer les débris et tissus fibreux présents sur les surfaces osseuses.') },
  { nom: t('Tréphine'), fichier: 'trephine.png', description: t('Instrument délicat conçu pour prélever de petits fragments circulaires d\'os, notamment au niveau des sinus.') },
  { nom: t('Rongeur crânien Adson'), fichier: 'rongeur-cranien-adson.png', description: t('Conçu pour saisir, découper ou retirer de petits fragments osseux lors de procédures neurochirurgicales.') },
  { nom: t('Tube d\'aspiration de Poole'), fichier: 'tube-poole.png', description: t('Canule perforée servant à aspirer efficacement des liquides tout en minimisant le risque d\'obstruction par les tissus, notamment en chirurgie abdominale.') },
  { nom: t('Écarteur Senn-Miller'), fichier: 'ecarteur-senn-miller1.png', description: t('Écarteur à double extrémité utilisé pour dégager les tissus pendant la chirurgie.') },
  { nom: t('Écarteur Gelpi'), fichier: 'ecarteur-gelpi.png', description: t('Écarteur auto-statique maintenant les tissus écartés sans assistance manuelle.') },
  { nom: t('Écarteur Army-Navy'), fichier: 'ecarteur-army-navy.png', description: t('Conçu pour écarter les tissus superficiels : peau, muscles, graisse.') },
  { nom: t('Rétracteur Beckman-Weitlaner'), fichier: 'retracteur-balfour.png', description: t('Maintient les petites incisions ouvertes, souvent utilisé en chirurgie de la colonne.') },
  { nom: t('Rétracteur abdominal Balfour'), fichier: 'retracteur-abdominal.png', description: t('Auto-statique, conçu pour l\'ouverture abdominale en chirurgie; ouverture de 7 à 10 po.') },
  { nom: t('Rétracteur ruban malléable'), fichier: 'retracteur-ruban.png', description: t('Fréquemment utilisé pour manipuler la graisse orbitaire; sa forme est ajustable.') },
  { nom: t('Spéculum oculaire à fil Barraquer'), fichier: 'speculum-oculaire.png', description: t('Sert à maintenir les paupières ouvertes durant les interventions ophtalmiques.') },
  { nom: t('Spéculum vaginal pour petits animaux'), fichier: 'speculum-vaginal.png', description: t('Sert à écarter les tissus pour visualiser l\'urètre chez les femelles lors de sondages.') },
].sort((a, b) => a.nom.localeCompare(b.nom))

export default function ChirurgieInstruments() {
  const [recherche, setRecherche] = useState('')

  const filtres = INSTRUMENTS.filter(i =>
    i.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="labo-detail-page">

      {/* ─── RECHERCHE ──────────────────────── */}
      <div className="champ" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10, paddingBottom: 8 }}>
        <div className="recherche-wrapper">
          <i className="ti ti-search recherche-icone"></i>
          <input
            type="text"
            className="recherche-input"
            placeholder={t('Rechercher un instrument...')}
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
          {recherche && (
            <button className="recherche-clear" onClick={() => setRecherche('')}>
              <i className="ti ti-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* ─── LISTE ──────────────────────────── */}
      {filtres.length === 0 ? (
        <p className="admin-vide">{t('Aucun instrument trouvé.')}</p>
      ) : (
        <div className="labo-sediments-liste">
          {filtres.map(inst => (
            <div key={inst.nom} className="labo-sediment-card">
              <img
                src={`${BASE_URL}/${inst.fichier}`}
                alt={inst.nom}
                className="labo-instrument-photo"
              />
              <div className="labo-sediment-info">
                <h3 className="labo-sediment-nom">{inst.nom}</h3>
                <p className="labo-sediment-desc">{inst.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
