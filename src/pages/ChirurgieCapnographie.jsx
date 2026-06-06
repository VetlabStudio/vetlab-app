const BASE_URL = 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/Illustrations/Capnographie'

const SECTIONS = [
  {
    titre: 'Courbe normale',
    image: `${BASE_URL}/capno-normale.png`,
    contenu: [
      {
        sous_titre: 'Phase I — Inspiration',
        texte: 'La ligne revient à zéro (ou presque) car l\'air inspiré contient très peu de CO₂ (air frais). Sur la courbe : segment horizontal bas, proche de 0 mmHg.',
      },
      {
        sous_titre: 'Phase II — Expiration initiale',
        texte: 'Mélange d\'air des voies aériennes supérieures (pauvre en CO₂) et d\'air alvéolaire (riche en CO₂). Sur la courbe : montée rapide (pente ascendante raide).',
      },
      {
        sous_titre: 'Phase III — Plateau expiratoire',
        texte: 'L\'air provient majoritairement des alvéoles, riche en CO₂. Sur la courbe : segment horizontal ou légèrement ascendant. Valeur clé : la fin de ce plateau correspond au CO₂ de fin d\'expiration (ETCO₂), normalement 35 à 45 mmHg chez le chien.',
      },
      {
        sous_titre: 'Phase 0 — Inspiration suivante',
        texte: 'Le patient inspire de nouveau de l\'air frais; le CO₂ chute brusquement. Sur la courbe : descente verticale rapide jusqu\'à la ligne de base.',
      },
    ],
  },
  {
    titre: 'Fuite',
    image: `${BASE_URL}/capno-fuite.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'En présence d\'une fuite (ex. ballonnet mal gonflé, raccord lâche), la courbe montre un plateau expiratoire mal défini ou absent, qui s\'incline vers le bas au lieu de rester horizontal. La descente vers la ligne de base se fait plus tôt et plus doucement qu\'en situation normale. Le résultat est une courbe "aplatie" et incomplète, car une partie du gaz expiré échappe à la mesure.',
      },
    ],
  },
  {
    titre: 'Obstruction',
    image: `${BASE_URL}/capno-obstruction.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'Lors d\'une obstruction partielle (ex. tube plié, sécrétions, bronchospasme), la pente expiratoire devient prolongée et arrondie, donnant à la courbe un aspect en "dôme" ou en pente douce. Le plateau expiratoire disparaît ou est mal défini. L\'expiration est donc allongée et incomplète, ce qui reflète la difficulté du patient à évacuer le CO₂.',
      },
    ],
  },
  {
    titre: 'Réinhalation de CO₂',
    image: `${BASE_URL}/capno-reinhalation.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'En cas de réinhalation, la ligne de base ne redescend pas à zéro et reste au-dessus de 0 mmHg, car du CO₂ est présent dans le gaz inspiré. Toute la courbe est surélevée, avec un plateau expiratoire encore visible mais décalé vers le haut. L\'ETCO₂ peut être faussement augmenté et la présence d\'une ligne de base élevée est le signe distinctif.',
      },
    ],
  },
  {
    titre: 'Oscillations cardiaques',
    image: `${BASE_URL}/capno-oscillations.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'Ce phénomène bénin se manifeste par de petites ondulations régulières visibles sur le plateau expiratoire (phase III), synchronisées avec la fréquence cardiaque. La ligne de base reste normale à zéro et l\'ETCO₂ n\'est pas faussé. Ces oscillations apparaissent surtout lors de respirations lentes et profondes, quand les battements cardiaques déplacent une petite quantité de gaz dans les voies respiratoires.',
      },
    ],
  },
  {
    titre: 'Patient qui respire contre le ventilateur',
    image: `${BASE_URL}/capno-asynchronie.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'La courbe devient instable et dentelée, avec des variations visibles à la fois à l\'inspiration et à l\'expiration. Le plateau expiratoire est irrégulier et l\'ETCO₂ fluctue en raison de l\'asynchronie patient-ventilateur. Cela survient lorsque l\'animal tente de respirer spontanément alors que le ventilateur impose son propre cycle.',
      },
    ],
  },
  {
    titre: 'Augmentation de l\'ETCO₂',
    image: `${BASE_URL}/capno-augmentation.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'La courbe garde une forme normale, mais elle est globalement décalée vers le haut, avec un plateau expiratoire qui dépasse les valeurs habituelles (au-delà de 45 mmHg). Ce phénomène reflète le plus souvent une hypoventilation, causée par une dépression respiratoire liée aux anesthésiques ou par une ventilation insuffisante. Il peut aussi être dû à une réinhalation de CO₂ ou encore à une production accrue de CO₂.',
      },
    ],
  },
  {
    titre: 'Diminution de l\'ETCO₂',
    image: `${BASE_URL}/capno-diminution.png`,
    contenu: [
      {
        sous_titre: null,
        texte: 'La courbe conserve sa morphologie générale, mais elle est abaissée sous la plage normale, avec un plateau expiratoire nettement plus bas. Cette situation reflète le plus souvent une hyperventilation volontaire (ventilation contrôlée excessive) ou spontanée. Elle peut aussi indiquer une diminution du débit cardiaque ou de la perfusion pulmonaire (hypotension, hypovolémie, arrêt cardiaque), réduisant la quantité de CO₂ transportée aux poumons. Dans ces cas, l\'ETCO₂ devient un signe d\'alerte de trouble ventilatoire ou circulatoire.',
      },
    ],
  },
]

const ANOMALIES = [
  {
    titre: 'Dépression respiratoire',
    texte: 'Les anesthésiques volatils ou injectables peuvent entraîner une élévation de l\'ETCO₂ au-delà de 45 mmHg. Pour corriger la situation, il faut réduire la concentration d\'anesthésiques et instaurer une ventilation assistée ou contrôlée, afin de ramener l\'ETCO₂ dans la plage normale de 35 à 45 mmHg.',
  },
  {
    titre: 'Débit d\'oxygène insuffisant',
    texte: 'Dans un circuit sans réinhalation, un débit d\'oxygène trop bas empêche l\'élimination adéquate du CO₂, provoquant une réinhalation. L\'augmentation du débit d\'oxygène permet une évacuation correcte du CO₂.',
  },
  {
    titre: 'Valves défectueuses ou absentes',
    texte: 'Dans un circuit avec réinhalation, un problème au niveau des valves unidirectionnelles (surtout la valve expiratoire) peut créer un espace mort important et favoriser la réinhalation du CO₂. Un entretien régulier et une vérification systématique des valves sont essentiels.',
  },
  {
    titre: 'Tuyau d\'oxygène déconnecté',
    texte: 'Dans les circuits coaxiaux sans réinhalation, une déconnexion du tube d\'oxygène entraîne une augmentation du CO₂ inspiré et donc de l\'ETCO₂. Une inspection minutieuse du circuit respiratoire avant chaque usage est cruciale.',
  },
  {
    titre: 'Absorbant de CO₂ saturé',
    texte: 'Une chaux sodée ou baralyme épuisée (ou trop tassée) ne capte plus le CO₂ expiré, ce qui mène à sa réinhalation. Il faut remplacer l\'absorbant par du matériel neuf.',
  },
  {
    titre: 'ETCO₂ trop bas',
    texte: 'Souvent causé par une hyperventilation ou une ventilation contrôlée excessive (volume courant ou fréquence trop élevés). Dans ce cas, ajuster les paramètres ventilatoires corrige le problème. Cependant, une hyperventilation spontanée ne doit pas être modifiée, sauf si elle traduit un plan anesthésique trop léger.',
  },
  {
    titre: 'Débit cardiaque diminué',
    texte: 'Une perfusion pulmonaire insuffisante (hypovolémie, hypotension) réduit aussi l\'ETCO₂. La correction passe par une prise en charge appropriée de l\'hypotension.',
  },
]

export default function ChirurgieCapnographie() {
  return (
    <div className="labo-detail-page">

      {/* ─── COURBES ────────────────────────── */}
      {SECTIONS.map((s, i) => (
        <div key={i} className="labo-ref-section capno-bloc">
          <h2 className="labo-ref-titre">{s.titre}</h2>
          <div className="capno-image-wrapper">
            <img src={s.image} alt={s.titre} className="capno-image" />
          </div>
          <div className="capno-contenu">
            {s.contenu.map((c, j) => (
              <div key={j} className="capno-paragraphe">
                {c.sous_titre && <p className="capno-sous-titre">{c.sous_titre}</p>}
                <p className="capno-texte">{c.texte}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ─── GESTION DES ANOMALIES ──────────── */}
      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">Gestion des anomalies de l'ETCO₂</h2>
        <div className="capno-anomalies">
          {ANOMALIES.map((a, i) => (
            <div key={i} className="capno-anomalie-bloc">
              <p className="capno-anomalie-titre">{a.titre}</p>
              <p className="capno-texte">{a.texte}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
