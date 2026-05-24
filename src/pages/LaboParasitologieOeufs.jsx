const OEUFS = [
  {
    id: 1,
    nom: 'Toxocara canis',
    especes: 'Chien',
    description: 'Œuf sphérique à coque épaisse et bosselée, brun foncé. Contient une seule cellule (non embryonné à la ponte). Taille : 75–90 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/toxocara.jpg',
  },
  {
    id: 2,
    nom: 'Toxocara cati',
    especes: 'Chat',
    description: 'Similaire à T. canis mais légèrement plus petit. Coque épaisse ponctuée. Taille : 65–75 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/toxocara-cati.jpg',
  },
  {
    id: 3,
    nom: 'Toxascaris leonina',
    especes: 'Chien, Chat',
    description: 'Œuf ovale à coque lisse et transparente. Plus petit que Toxocara. Taille : 75–85 µm.',
    photo: null,
  },
  {
    id: 4,
    nom: 'Ancylostoma caninum',
    especes: 'Chien',
    description: 'Œuf ovale à paroi mince et lisse, contenant 4–8 cellules à la ponte. Taille : 56–75 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/ancylostoma.jpg',
  },
  {
    id: 5,
    nom: 'Uncinaria stenocephala',
    especes: 'Chien',
    description: 'Semblable à Ancylostoma, légèrement plus grand. Œuf à paroi mince, morula visible. Taille : 63–76 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/uncinaria.jpg',
  },
  {
    id: 6,
    nom: 'Trichuris vulpis',
    especes: 'Chien',
    description: 'Œuf en forme de barillet avec deux bouchons polaires translucides. Brun doré. Taille : 70–90 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/trichuris.jpg',
  },
  {
    id: 7,
    nom: 'Dipylidium caninum',
    especes: 'Chien, Chat',
    description: 'Paquets d\'œufs (capsules ovigères) contenant 8–15 œufs sphériques. Rarement vus isolément à la flottation. Taille du paquet : 120–200 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/dipylidium1.jpg',
  },
  {
    id: 8,
    nom: 'Taenia spp.',
    especes: 'Chien, Chat',
    description: 'Œuf sphérique à coque striée rayonnante (embryophore), contenant un oncosphère à 6 crochets. Taille : 25–40 µm.',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/taenia.jpg',
  },
  {
    id: 9,
    nom: 'Giardia duodenalis',
    especes: 'Chien, Chat',
    description: 'Kyste ovoïde à paroi lisse, contenant 2–4 noyaux visibles. Détecté par flottation au sulfate de zinc. Taille : 8–12 µm.',
    photo: null,
  },
  {
    id: 10,
    nom: 'Cryptosporidium spp.',
    especes: 'Chien, Chat',
    description: 'Oocyste sphérique très petit, paroi lisse. Détecté par coloration acido-alcoolo-résistante (Ziehl-Neelsen modifié). Taille : 4–6 µm.',
    photo: null,
  },
  {
    id: 11,
    nom: 'Isospora canis / I. felis',
    especes: 'Chien / Chat',
    description: 'Oocyste non sporulé à la ponte, paroi lisse, sporocystes visibles après sporulation. Taille : 30–45 µm (I. canis), 38–51 µm (I. felis).',
    photo: 'https://jbvjruunwdrbrzipgezs.supabase.co/storage/v1/object/public/labo-photos/Oeufs%20de%20parasites/isospora1.jpg',
  },
]

export default function LaboParasitologieOeufs() {
  return (
    <div className="labo-detail-page">
      <div className="labo-sediments-liste">
        {OEUFS.map(o => (
          <div key={o.id} className="labo-sediment-card">
            {o.photo ? (
              <img src={o.photo} alt={o.nom} className="labo-sediment-photo" />
            ) : (
              <div className="labo-sediment-placeholder">
                <i className="ti ti-egg"></i>
                <span>Photo à venir</span>
              </div>
            )}
            <div className="labo-sediment-info">
              <h3 className="labo-sediment-nom">{o.nom}</h3>
              <p style={{ fontSize: 11, color: 'var(--accent-gold)', fontStyle: 'italic', marginBottom: 4 }}>
                {o.especes}
              </p>
              <p className="labo-sediment-desc">{o.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
