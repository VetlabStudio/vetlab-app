import { useMemo, useState } from 'react'
import { t } from '../lib/i18n'

const CATEGORIES = [
  {
    id: 'densite',
    label: t('Densité (noircissement)'),
    problemes: [
      { id: 'trop_pale', label: t('Image trop pâle') },
      { id: 'trop_sombre', label: t('Image trop sombre') },
    ],
  },
  {
    id: 'contraste',
    label: t('Contraste'),
    problemes: [
      { id: 'contraste_faible', label: t('Contraste insuffisant (tout gris)') },
      { id: 'contraste_excessif', label: t('Contraste excessif (noir ou blanc, sans nuances)') },
    ],
  },
  {
    id: 'nettete',
    label: t('Netteté'),
    problemes: [
      { id: 'flou_mouvement', label: t('Flou de mouvement') },
      { id: 'flou_geometrique', label: t('Flou géométrique') },
      { id: 'flou_contact', label: t('Flou par mauvais contact film-écran') },
    ],
  },
  {
    id: 'chambre_noire',
    label: t('Chambre noire / chimie'),
    problemes: [
      { id: 'voile', label: t('Voile uniforme sur le film') },
      { id: 'jaunissement', label: t('Film jaunâtre après séchage') },
      { id: 'taches', label: t('Taches ou artefacts') },
    ],
  },
  {
    id: 'positionnement',
    label: t('Positionnement'),
    problemes: [
      { id: 'image_coupee', label: t('Image coupée ou incomplète') },
      { id: 'superposition', label: t('Superposition non souhaitée de structures') },
      { id: 'mauvaise_incidence', label: t('Mauvaise incidence') },
    ],
  },
]

const RECOMMANDATIONS = [
  { id: 'r1', titre: t('Augmenter les mAs'), description: t('Une image trop pâle indique un manque d\'exposition. Augmenter les mAs (intensité x temps) pour augmenter la densité du cliché.'), tags: ['trop_pale'], contredit: ['r4'] },
  { id: 'r2', titre: t('Augmenter le kV'), description: t('Augmenter le kV améliore la pénétration du faisceau et augmente la densité, particulièrement utile pour les régions épaisses.'), tags: ['trop_pale'], contredit: ['r5', 'r7'] },
  { id: 'r3', titre: t('Vérifier le révélateur'), description: t('Un révélateur épuisé, trop froid (moins de 20 °C) ou trop dilué produit une image pâle malgré une exposition correcte. Vérifier la température et la fraîcheur de la solution.'), tags: ['trop_pale'], contredit: [] },
  { id: 'r4', titre: t('Réduire les mAs'), description: t('Une image trop sombre indique une surexposition. Réduire les mAs en diminuant l\'intensité ou le temps d\'exposition.'), tags: ['trop_sombre'], contredit: ['r1'] },
  { id: 'r5', titre: t('Réduire le kV'), description: t('Réduire le kV diminue la pénétration et réduit la densité globale du cliché.'), tags: ['trop_sombre'], contredit: ['r2', 'r9'] },
  { id: 'r6', titre: t('Réduire le temps de révélation'), description: t('Un temps de révélation trop long ou un révélateur trop chaud (plus de 20 °C) produit un surdéveloppement et noircit excessivement le film.'), tags: ['trop_sombre'], contredit: [] },
  { id: 'r7', titre: t('Réduire le kV'), description: t('Un kV trop élevé produit un rayonnement trop pénétrant qui réduit les différences d\'absorption entre les tissus, aplatissant le contraste.'), tags: ['contraste_faible'], contredit: ['r2', 'r9'] },
  { id: 'r8', titre: t('Utiliser une grille antidiffusante'), description: t('Pour les régions de plus de 10 cm d\'épaisseur, le rayonnement diffusé dégrade le contraste. Une grille antidiffusante est nécessaire.'), tags: ['contraste_faible'], contredit: [] },
  { id: 'r9', titre: t('Augmenter le kV'), description: t('Un kV trop bas produit un contraste trop élevé, réduisant la gamme de tons visibles. Augmenter le kV pour élargir l\'échelle de gris.'), tags: ['contraste_excessif'], contredit: ['r5', 'r7'] },
  { id: 'r10', titre: t('Immobiliser l\'animal'), description: t('Le flou de mouvement est causé par un déplacement de l\'animal pendant l\'exposition. Utiliser une contention adéquate, une sédation si nécessaire, ou synchroniser avec la respiration.'), tags: ['flou_mouvement'], contredit: [] },
  { id: 'r11', titre: t('Réduire le temps d\'exposition'), description: t('Un temps d\'exposition long augmente le risque de flou de mouvement. Augmenter le kV ou l\'intensité (mA) pour permettre de réduire le temps.'), tags: ['flou_mouvement'], contredit: [] },
  { id: 'r12', titre: t('Vérifier la distance foyer-film (DFF)'), description: t('Une DFF incorrecte augmente le flou géométrique (pénombre). La DFF standard est de 100 cm. Vérifier et standardiser la distance.'), tags: ['flou_geometrique'], contredit: [] },
  { id: 'r13', titre: t('Centrer le sujet dans le faisceau'), description: t('Les structures en périphérie du faisceau subissent une distorsion et un flou géométrique plus importants. Centrer la région d\'intérêt.'), tags: ['flou_geometrique'], contredit: [] },
  { id: 'r14', titre: t('Vérifier le contact film-écran'), description: t('Un mauvais contact entre le film et les écrans renforçateurs dans la cassette produit un flou localisé. Vérifier l\'état de la cassette et des écrans, fermer hermétiquement.'), tags: ['flou_contact'], contredit: [] },
  { id: 'r15', titre: t('Vérifier l\'étanchéité de la chambre noire'), description: t('Un voile uniforme indique une exposition à la lumière blanche pendant la manipulation du film. Vérifier toutes les sources de lumière parasite.'), tags: ['voile'], contredit: [] },
  { id: 'r16', titre: t('Vérifier la lampe inactinique'), description: t('Une lampe inactinique défectueuse ou avec un filtre inadapté peut voiler le film. Tester en couvrant le film 2 minutes sous la lampe pour vérifier.'), tags: ['voile'], contredit: [] },
  { id: 'r17', titre: t('Vérifier la date de péremption des films'), description: t('Un film périmé ou stocké dans de mauvaises conditions (chaleur, humidité, radiation ambiante) peut présenter un voile.'), tags: ['voile'], contredit: [] },
  { id: 'r18', titre: t('Prolonger le lavage final'), description: t('Un jaunissement après séchage indique des résidus de fixateur insuffisamment éliminés. Le lavage final doit durer 20 à 30 minutes sous eau courante.'), tags: ['jaunissement'], contredit: [] },
  { id: 'r19', titre: t('Vérifier la durée de fixation'), description: t('Une fixation insuffisante (moins de 10 minutes) laisse des sels d\'argent non éliminés qui jaunissent avec le temps.'), tags: ['jaunissement'], contredit: [] },
  { id: 'r20', titre: t('Vérifier la contamination des bains'), description: t('Des taches localisées sont souvent causées par des éclaboussures de fixateur sur le film avant la révélation, ou par des dépôts sur les pinces. Utiliser des pinces différentes pour chaque bain.'), tags: ['taches'], contredit: [] },
  { id: 'r21', titre: t('Nettoyer les écrans renforçateurs'), description: t('Des poussières ou débris sur les écrans laissent des artefacts clairs sur le film. Nettoyer les écrans régulièrement avec un chiffon antistatique.'), tags: ['taches', 'flou_contact'], contredit: [] },
  { id: 'r22', titre: t('Ajuster le positionnement et le centrage'), description: t('Une image coupée indique que la région d\'intérêt déborde du champ. Vérifier l\'alignement du tube, la taille de la cassette et le centrage du faisceau.'), tags: ['image_coupee'], contredit: [] },
  { id: 'r23', titre: t('Vérifier le protocole d\'incidence'), description: t('Consulter les protocoles standardisés d\'incidences radiographiques pour la région anatomique concernée.'), tags: ['mauvaise_incidence', 'superposition'], contredit: [] },
  { id: 'r24', titre: t('Utiliser des repères de positionnement'), description: t('Des coussins, sacs de sable ou gouttières de positionnement permettent de maintenir l\'animal dans la position correcte de façon reproductible.'), tags: ['mauvaise_incidence', 'superposition'], contredit: [] },
]

const CONFLITS = [
  { id: 'cf1', ids: ['r1', 'r4'], titre: t('Conflit : densité'), message: t('Les problèmes sélectionnés suggèrent à la fois d\'augmenter et de réduire les mAs, ce qui est contradictoire. Vérifier si l\'image est réellement trop pâle ET trop sombre, ou réévaluer le problème principal.') },
  { id: 'cf2', ids: ['r2', 'r7'], titre: t('Conflit : kV (pâle + contraste insuffisant)'), message: t('Image pâle suggère d\'augmenter le kV, mais un contraste insuffisant causé par un kV déjà trop élevé suggère de le réduire. Ces deux problèmes peuvent avoir des causes indépendantes. Vérifier d\'abord la chimie de développement avant d\'ajuster le kV.') },
  { id: 'cf3', ids: ['r2', 'r5'], titre: t('Conflit : kV (pâle + trop sombre)'), message: t('Les problèmes sélectionnés suggèrent à la fois d\'augmenter et de réduire le kV. Réévaluer le cliché : un seul de ces deux problèmes de densité peut être présent à la fois.') },
  { id: 'cf4', ids: ['r9', 'r7'], titre: t('Conflit : kV (contraste excessif + contraste insuffisant)'), message: t('Les problèmes sélectionnés suggèrent à la fois d\'augmenter et de réduire le kV. Contraste excessif et contraste insuffisant sont des problèmes opposés qui ne peuvent pas coexister. Réévaluer le cliché.') },
  { id: 'cf5', ids: ['r9', 'r5'], titre: t('Conflit : kV (contraste excessif + trop sombre)'), message: t('Contraste excessif suggère d\'augmenter le kV, alors qu\'une image trop sombre seule suggérerait de le réduire. Ces deux corrections isolées sont opposées : ne pas les appliquer séparément. Augmenter le kV pour corriger le contraste et réduire les mAs pour corriger la densité, simultanément (voir la combinaison ci-dessous).'), masquePar: ['cs2'] },
]

const COMBINAISONS_SPECIALES = [
  {
    id: 'cs1',
    tags: ['trop_pale', 'flou_mouvement'],
    avertissement: t('Combinaison pâle + flou de mouvement'),
    message: t('Ne pas corriger la pâleur en augmentant les mAs via le temps d\'exposition, car cela aggraverait le flou de mouvement. Privilégier l\'augmentation du kV ou de l\'intensité (mA) en réduisant simultanément le temps d\'exposition.'),
  },
  {
    id: 'cs2',
    tags: ['trop_sombre', 'contraste_excessif'],
    avertissement: t('Combinaison trop sombre + contraste excessif'),
    message: t('Cette combinaison indique que le kV est trop bas et les mAs trop élevés simultanément. Il faut augmenter le kV et réduire les mAs en même temps, pas seulement ajuster l\'un des deux paramètres.'),
  },
  {
    id: 'cs3',
    tags: ['trop_pale', 'contraste_excessif'],
    avertissement: t('Combinaison pâle + contraste excessif'),
    message: t('Cette combinaison paradoxale suggère un kV trop bas avec des mAs insuffisants. Augmenter les deux paramètres : kV pour élargir l\'échelle de gris et mAs pour augmenter la densité globale.'),
  },
  {
    id: 'cs4',
    tags: ['voile', 'contraste_faible'],
    avertissement: t('Combinaison voile + contraste insuffisant'),
    message: t('Le voile, qu\'il soit lumineux ou chimique, augmente la densité de base du film et aplatit le contraste. Corriger la cause du voile (étanchéité, lampe inactinique, fraîcheur des films) avant d\'ajuster le kV, sinon la correction du contraste sera faussée.'),
  },
  {
    id: 'cs5',
    tags: ['image_coupee', 'superposition', 'mauvaise_incidence'],
    avertissement: t('Combinaison des trois problèmes de positionnement'),
    message: t('La coexistence de ces trois problèmes pointe le plus souvent vers une seule cause : un mauvais positionnement de l\'animal ou du faisceau. Revoir le protocole d\'incidence et utiliser des repères de positionnement règle généralement l\'ensemble simultanément.'),
  },
]

const RECOMMANDATION_PAR_ID = RECOMMANDATIONS.reduce((acc, r) => { acc[r.id] = r; return acc }, {})

// id de problème -> catégorie parente, pour regrouper les recommandations affichées
const CATEGORIE_PAR_PROBLEME = CATEGORIES.reduce((acc, cat) => {
  cat.problemes.forEach(p => { acc[p.id] = cat })
  return acc
}, {})

function matche(reco, selection) {
  return reco.tags.some(tag => selection.includes(tag))
}

export default function LaRadiologieDepannage() {
  const [selection, setSelection] = useState([])

  function toggleProbleme(id) {
    setSelection(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const conflitsActifs = useMemo(() => {
    return CONFLITS.filter(cf => cf.ids.every(id => matche(RECOMMANDATION_PAR_ID[id], selection)))
  }, [selection])

  const idsBloques = useMemo(() => {
    const bloques = new Set()
    conflitsActifs.forEach(cf => cf.ids.forEach(id => bloques.add(id)))
    return bloques
  }, [conflitsActifs])

  const avertissements = useMemo(() => {
    return COMBINAISONS_SPECIALES.filter(cs => cs.tags.every(tag => selection.includes(tag)))
  }, [selection])

  const conflitsAffiches = useMemo(() => {
    const idsAvertissementsActifs = avertissements.map(a => a.id)
    return conflitsActifs.filter(cf => !cf.masquePar?.some(id => idsAvertissementsActifs.includes(id)))
  }, [conflitsActifs, avertissements])

  const groupes = useMemo(() => {
    if (selection.length === 0) return []

    const parCategorie = new Map()

    for (const probId of selection) {
      const cat = CATEGORIE_PAR_PROBLEME[probId]
      if (!cat || parCategorie.has(cat.id)) continue
      parCategorie.set(cat.id, { categorie: cat, recommandations: new Map() })
    }

    for (const probId of selection) {
      const cat = CATEGORIE_PAR_PROBLEME[probId]
      if (!cat) continue
      const groupe = parCategorie.get(cat.id)
      for (const reco of RECOMMANDATIONS) {
        if (idsBloques.has(reco.id)) continue
        if (!reco.tags.includes(probId)) continue
        const score = reco.tags.filter(t => selection.includes(t)).length
        if (!groupe.recommandations.has(reco.id)) {
          groupe.recommandations.set(reco.id, { ...reco, score })
        }
      }
    }

    return Array.from(parCategorie.values())
      .map(g => ({
        categorie: g.categorie,
        recommandations: Array.from(g.recommandations.values()).sort((a, b) => b.score - a.score),
      }))
      .filter(g => g.recommandations.length > 0)
  }, [selection, idsBloques])

  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Cocher les problèmes observés')}</h2>
        <div className="depannage-categories">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="depannage-categorie">
              <span className="depannage-categorie-titre">{cat.label}</span>
              {cat.problemes.map(p => (
                <label key={p.id} className="voie-item">
                  <span>{p.label}</span>
                  <input
                    type="checkbox"
                    checked={selection.includes(p.id)}
                    onChange={() => toggleProbleme(p.id)}
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {conflitsAffiches.map(cf => (
        <div key={cf.id} className="depannage-conflit">
          <div className="depannage-conflit-titre">
            <i className="ti ti-alert-octagon"></i>
            <span>{cf.titre}</span>
          </div>
          <p>{cf.message}</p>
        </div>
      ))}

      {avertissements.map(av => (
        <div key={av.id} className="depannage-avertissement">
          <div className="depannage-avertissement-titre">
            <i className="ti ti-alert-triangle"></i>
            <span>{av.avertissement}</span>
          </div>
          <p>{av.message}</p>
        </div>
      ))}

      {selection.length === 0 && (
        <div className="depannage-vide">
          <i className="ti ti-checklist"></i>
          <p>{t('Coche un ou plusieurs problèmes observés sur le cliché pour voir apparaître des recommandations.')}</p>
        </div>
      )}

      {groupes.map(g => (
        <div key={g.categorie.id} className="labo-ref-section">
          <h2 className="labo-ref-titre">{g.categorie.label}</h2>
          <div className="depannage-recommandations">
            {g.recommandations.map(r => (
              <div key={r.id} className="depannage-carte">
                <span className="depannage-carte-titre">{r.titre}</span>
                <p className="depannage-carte-desc">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}
