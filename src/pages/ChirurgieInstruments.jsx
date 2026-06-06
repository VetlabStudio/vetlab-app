import { useState } from 'react'

const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Instruments'

const INSTRUMENTS = [
  { nom: 'Ciseaux à bouts mousse et pointus', fichier: 'ciseaux-mousse-pointus.png', description: 'Utilisés pour couper les fils de suture, ils sont plus abordables que les ciseaux Mayo ou Metzenbaum, réservés aux tissus.' },
  { nom: 'Ciseaux Metzenbaum', fichier: 'ciseaux-metzenbaum.png', description: 'Idéals pour les dissections délicates. Leur conception se distingue par un manche long par rapport à la lame, facilitant la manipulation précise.' },
  { nom: 'Ciseaux Mayo', fichier: 'ciseaux-mayo.png', description: 'Utilisés pour sectionner les structures résistantes comme les muscles, le fascia ou d\'autres tissus conjonctifs.' },
  { nom: 'Ciseaux à bandage Lister', fichier: 'ciseaux-lister.png', description: 'Leur embout spécial permet de découper les bandages sans risquer d\'endommager les tissus sous-jacents.' },
  { nom: 'Ciseaux de ténotomie Stevens', fichier: 'ciseaux-stevens.png', description: 'Très fins et légers, ils sont conçus pour les interventions chirurgicales minutieuses.' },
  { nom: 'Ciseaux Iris', fichier: 'ciseaux-iris.png', description: 'Initialement créés pour les interventions ophtalmiques, ils sont maintenant utilisés pour la coupe fine en général.' },
  { nom: 'Ciseaux à sutures', fichier: 'ciseaux-sutures.png', description: 'Ils permettent de saisir et couper les boucles de fil de suture, facilitant le retrait des points.' },
  { nom: 'Porte-aiguille Olsen-Hegar', fichier: 'porte-aiguille-olsen-hegar.png', description: 'Instrument 2-en-1 : il permet à la fois de tenir l\'aiguille et de couper le fil, sans changer d\'outil.' },
  { nom: 'Porte-aiguille Crile', fichier: 'porte-aiguille-crile.png', description: 'Instrument classique servant à manipuler les aiguilles, mais sans lames intégrées pour couper.' },
  { nom: 'Clamp vasculaire de Debakey', fichier: 'clamp-debakey.png', description: 'Utilisé en chirurgie vasculaire pour occlure délicatement un vaisseau sanguin et limiter un saignement sans l\'endommager.' },
  { nom: 'Clamp Alligator', fichier: 'clamp-alligator.png', description: 'Conçu pour saisir des objets dans des zones étroites et profondes comme le canal auditif.' },
  { nom: 'Clamp intestinal de Doyen', fichier: 'clamp-doyen.png', description: 'Utilisé pour occlure temporairement l\'intestin sans traumatisme grâce à des mâchoires douces.' },
  { nom: 'Pince hémostatique de Halsted (mosquito)', fichier: 'pince-mosquito.png', description: 'Destinée à comprimer de très petits vaisseaux sanguins.' },
  { nom: 'Pince Kelly', fichier: 'pince-crile.png', description: 'Sert à comprimer les petits vaisseaux. Comparée à la mosquito, elle a des mâchoires plus longues. Contrairement à la Crile, les stries ne couvrent que la moitié distale.' },
  { nom: 'Pince Crile', fichier: 'pince-crile.png', description: 'Semblable à la pince Kelly, elle est utilisée pour occlure de petits vaisseaux, mais présente une striation complète des mâchoires.' },
  { nom: 'Pince Rochester-Carmalt', fichier: 'pince-rochester.png', description: 'Surnommée "Stars and Stripes" en raison de ses stries croisées à l\'extrémité et longitudinales à la base. Utilisée pour clamper les tissus ou aligaturer les pédicules.' },
  { nom: 'Pince à tissus Allis', fichier: 'pince-allis.png', description: 'Conçue pour soulever et maintenir des tissus denses ou glissants. Dotée de rangées de dents acérées à chaque extrémité.' },
  { nom: 'Pince à tissus Babcock', fichier: 'pice-babcock.png', description: 'Similaire à la pince Allis, mais moins traumatique, elle possède des extrémités plates et arrondies, idéales pour manipuler les tissus délicats comme l\'intestin.' },
  { nom: 'Pince Adson Brown', fichier: 'pince-adson-brown.png', description: 'Modèle standard le plus couramment utilisé pour la chirurgie générale.' },
  { nom: 'Pince Adson à tissus', fichier: 'pince-adson-tissus.png', description: 'Dotée d\'extrémités fines idéales pour manipuler les tissus délicats, avec une large surface de préhension.' },
  { nom: 'Pince Adson Debakey', fichier: 'pince-adson-debakey.png', description: 'Le modèle le plus fin et précis pour les interventions délicates.' },
  { nom: 'Pince à tissus', fichier: 'pince-tissus.png', description: 'Souvent utilisées pour saisir et maintenir fermement les tissus lors de chirurgies.' },
  { nom: 'Pince Potts Smith', fichier: 'pince-potts-smith.png', description: 'Utilisée principalement en chirurgie ORL, reconnue pour sa forme fine et allongée.' },
  { nom: 'Pince russe', fichier: 'pince-russe.png', description: 'Pince plus robuste, conçue pour une manipulation plus ferme des tissus.' },
  { nom: 'Pince Backhaus', fichier: 'pince-backhaus.png', description: 'Conçue pour maintenir les champs stériles en place en les accrochant à la peau du patient à l\'aide de pointes perforantes.' },
  { nom: 'Pince Jones', fichier: 'pince-jones.png', description: 'Modèle léger et délicat, recommandé pour les interventions nécessitant une fixation douce et précise des champs opératoires.' },
  { nom: 'Pinces Foerster', fichier: 'pince-foerster.png', description: 'Utilisées pour tenir des compresses stériles lors de la préparation aseptique ou pour absorber des fluides pendant une intervention.' },
  { nom: 'Pinces de Kern', fichier: 'pinces-kern.png', description: 'Utilisées pour maintenir en place des plaques ou fragments osseux pendant la fixation orthopédique.' },
  { nom: 'Pinces coupantes', fichier: 'pinces-coupantes.png', description: 'Serre-fils utilisées pour sectionner des fils ou broches métalliques lors d\'interventions orthopédiques.' },
  { nom: 'Manche de bistouri #3', fichier: 'manche-bistouri.png', description: 'Support standard pour lames chirurgicales de petite taille (compatibles : #10, #11, #12, #15).' },
  { nom: 'Lame #10', fichier: 'lame10.png', description: 'Lame de bistouri classique à large tranchant, idéale pour les incisions générales en chirurgie.' },
  { nom: 'Lame #11', fichier: 'lame11.png', description: 'Présente une pointe fine conçue pour réaliser des incisions de type perforation. Fréquemment employée pour initier l\'ouverture de la ligne blanche.' },
  { nom: 'Lame #15', fichier: 'lame15.png', description: 'Dotée d\'un tranchant court, elle permet une grande précision lors des sections délicates.' },
  { nom: 'Cystotome / Cuillère vésiculaire', fichier: 'cystotome.png', description: 'Permet de retirer des calculs présents dans des organes creux comme la vessie ou la vésicule biliaire.' },
  { nom: 'Crochet de stérilisation (Snook)', fichier: 'crochet-sterilisation.png', description: 'Employé en chirurgie ovarienne pour repérer l\'ovaire avec précision.' },
  { nom: 'Coupe-os', fichier: 'coupe-os.png', description: 'Instrument dont les mâchoires sont conçues pour offrir un angle optimal permettant de sectionner efficacement l\'os lors de certaines procédures chirurgicales.' },
  { nom: 'Curette osseuse de Volkmann', fichier: 'curette-osseuse.png', description: 'Utilisée fréquemment en chirurgie orthopédique pour nettoyer les débris et tissus fibreux présents sur les surfaces osseuses.' },
  { nom: 'Tréphine', fichier: 'trephine.png', description: 'Instrument délicat conçu pour prélever de petits fragments circulaires d\'os, notamment au niveau des sinus.' },
  { nom: 'Rongeur crânien Adson', fichier: 'rongeur-cranien-adson.png', description: 'Conçu pour saisir, découper ou retirer de petits fragments osseux lors de procédures neurochirurgicales.' },
  { nom: 'Tube d\'aspiration de Poole', fichier: 'tube-poole.png', description: 'Canule perforée servant à aspirer efficacement des liquides tout en minimisant le risque d\'obstruction par les tissus, notamment en chirurgie abdominale.' },
  { nom: 'Écarteur Senn-Miller', fichier: 'ecarteur-senn-miller.png', description: 'Écarteur à double extrémité utilisé pour dégager les tissus pendant la chirurgie.' },
  { nom: 'Écarteur Gelpi', fichier: 'ecarteur-gelpi.png', description: 'Écarteur auto-statique maintenant les tissus écartés sans assistance manuelle.' },
  { nom: 'Écarteur Army-Navy', fichier: 'ecarteur-army-navy.png', description: 'Conçu pour écarter les tissus superficiels : peau, muscles, graisse.' },
  { nom: 'Rétracteur Beckman-Weitlaner', fichier: 'retracteur-balfour.png', description: 'Maintient les petites incisions ouvertes, souvent utilisé en chirurgie de la colonne.' },
  { nom: 'Rétracteur abdominal Balfour', fichier: 'retracteur-abdominal.png', description: 'Auto-statique, conçu pour l\'ouverture abdominale en chirurgie; ouverture de 7 à 10 po.' },
  { nom: 'Rétracteur ruban malléable', fichier: 'retracteur-ruban.png', description: 'Fréquemment utilisé pour manipuler la graisse orbitaire; sa forme est ajustable.' },
  { nom: 'Spéculum oculaire à fil Barraquer', fichier: 'speculum-oculaire.png', description: 'Sert à maintenir les paupières ouvertes durant les interventions ophtalmiques.' },
  { nom: 'Spéculum vaginal pour petits animaux', fichier: 'speculum-vaginal.png', description: 'Sert à écarter les tissus pour visualiser l\'urètre chez les femelles lors de sondages.' },
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
            placeholder="Rechercher un instrument..."
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
        <p className="admin-vide">Aucun instrument trouvé.</p>
      ) : (
        <div className="labo-sediments-liste">
          {filtres.map(inst => (
            <div key={inst.nom} className="labo-sediment-card">
              <img
                src={`${BASE_URL}/${inst.fichier}`}
                alt={inst.nom}
                className="labo-sediment-photo"
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
