const PARASITES = [
  {
    categorie: 'Nématodes (vers ronds)',
    items: [
      { parasite: 'Toxocara canis',         chien: '✓',                  chat: '—',                   transmission: 'Ingestion œufs, transplacentaire, lait',              localisation: 'Intestin grêle' },
      { parasite: 'Toxocara cati',           chien: '—',                  chat: '✓',                   transmission: 'Ingestion œufs, lait',                                localisation: 'Intestin grêle' },
      { parasite: 'Toxascaris leonina',      chien: '✓',                  chat: '✓',                   transmission: 'Ingestion œufs / hôte paraténique',                   localisation: 'Intestin grêle' },
      { parasite: 'Ancylostoma caninum',     chien: '✓',                  chat: '(✓)',                  transmission: 'Peau, ingestion, lait',                               localisation: 'Intestin grêle' },
      { parasite: 'Uncinaria stenocephala',  chien: '✓',                  chat: '(✓)',                  transmission: 'Peau, ingestion',                                     localisation: 'Intestin grêle' },
      { parasite: 'Trichuris vulpis',        chien: '✓',                  chat: '—',                   transmission: 'Ingestion œufs embryonnés',                           localisation: 'Cæcum / côlon' },
      { parasite: 'Strongyloides stercoralis', chien: '✓',               chat: '—',                   transmission: 'Peau, ingestion, lait',                               localisation: 'Intestin grêle' },
      { parasite: 'Dirofilaria immitis',     chien: '✓',                  chat: '✓',                   transmission: 'Moustique (vecteur)',                                  localisation: 'Artère pulmonaire / cœur droit' },
    ],
  },
  {
    categorie: 'Cestodes (vers plats)',
    items: [
      { parasite: 'Dipylidium caninum',         chien: '✓', chat: '✓',              transmission: 'Ingestion puce infestée (Ctenocephalides)',         localisation: 'Intestin grêle' },
      { parasite: 'Taenia pisiformis',          chien: '✓', chat: '—',              transmission: 'Ingestion lapin / lièvre (hôte intermédiaire)',     localisation: 'Intestin grêle' },
      { parasite: 'Taenia taeniaeformis',       chien: '—', chat: '✓',              transmission: 'Ingestion rongeur (hôte intermédiaire)',            localisation: 'Intestin grêle' },
      { parasite: 'Echinococcus granulosus',    chien: '✓', chat: '—',              transmission: 'Ingestion viscères de ruminants',                  localisation: 'Intestin grêle' },
      { parasite: 'Echinococcus multilocularis', chien: '✓', chat: '✓',             transmission: 'Ingestion rongeur (hôte intermédiaire)',            localisation: 'Intestin grêle' },
    ],
  },
  {
    categorie: 'Protozoaires',
    items: [
      { parasite: 'Giardia duodenalis',    chien: '✓',                chat: '✓',                   transmission: 'Ingestion kystes (eau, fèces)',                  localisation: 'Intestin grêle' },
      { parasite: 'Cryptosporidium spp.',  chien: '✓',                chat: '✓',                   transmission: 'Fécal-oral (oocystes)',                          localisation: 'Intestin grêle / gros intestin' },
      { parasite: 'Isospora canis',        chien: '✓',                chat: '—',                   transmission: 'Ingestion oocystes sporulés',                   localisation: 'Intestin grêle' },
      { parasite: 'Isospora felis',        chien: '—',                chat: '✓',                   transmission: 'Ingestion oocystes sporulés',                   localisation: 'Intestin grêle' },
      { parasite: 'Toxoplasma gondii',     chien: '(✓)',              chat: '✓ (hôte définitif)',   transmission: 'Ingestion oocystes / kystes tissulaires',       localisation: 'Tissus / intestin (chat)' },
    ],
  },
  {
    categorie: 'Ectoparasites',
    items: [
      { parasite: 'Demodex canis',                  chien: '✓', chat: '—', transmission: 'Contact mère-chiot (post-natal)',  localisation: 'Follicules pileux / peau' },
      { parasite: 'Sarcoptes scabiei',              chien: '✓', chat: '—', transmission: 'Contact direct',                  localisation: 'Peau (croûtes)' },
      { parasite: 'Notoedres cati',                 chien: '—', chat: '✓', transmission: 'Contact direct',                  localisation: 'Peau (tête / oreilles)' },
      { parasite: 'Cheyletiella spp.',              chien: '✓', chat: '✓', transmission: 'Contact direct',                  localisation: 'Surface cutanée' },
      { parasite: 'Ctenocephalides felis / canis',  chien: '✓', chat: '✓', transmission: 'Environnement infesté',           localisation: 'Surface cutanée' },
    ],
  },
]

export default function LaboParasitologieHotes() {
  return (
    <div className="labo-detail-page">
      {PARASITES.map((groupe, gi) => (
        <div className="labo-ref-section" key={gi}>
          <h2 className="labo-ref-titre">{groupe.categorie}</h2>
          <div className="labo-ref-tableau">
            <div className="labo-ref-header labo-ref-header--5col">
              <span>Parasite</span>
              <span>Chien</span>
              <span>Chat</span>
              <span>Transmission</span>
              <span>Localisation</span>
            </div>
            {groupe.items.map((row, i) => (
              <div key={i} className="labo-ref-ligne labo-ref-ligne--5col">
                <span style={{ fontStyle: 'italic' }}>{row.parasite}</span>
                <span style={{ textAlign: 'center' }}>{row.chien}</span>
                <span style={{ textAlign: 'center' }}>{row.chat}</span>
                <span>{row.transmission}</span>
                <span>{row.localisation}</span>
              </div>
            ))}
          </div>
          <p className="labo-ref-note" style={{ marginTop: 4 }}>
            ✓ hôte habituel &nbsp;·&nbsp; (✓) occasionnel / accidentel &nbsp;·&nbsp; — non concerné
          </p>
        </div>
      ))}
    </div>
  )
}
