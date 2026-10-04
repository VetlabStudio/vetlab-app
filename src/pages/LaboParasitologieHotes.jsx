import { useState } from 'react'

const PARASITES = [
  {
    categorie: 'Nématodes (vers ronds)',
    items: [
      { parasite: 'Toxocara canis',            chien: 'oui',  chat: 'non',        transmission: 'Ingestion œufs, transplacentaire, lait',            localisation: 'Intestin grêle' },
      { parasite: 'Toxocara cati',             chien: 'non',  chat: 'oui',        transmission: 'Ingestion œufs, lait',                              localisation: 'Intestin grêle' },
      { parasite: 'Toxascaris leonina',        chien: 'oui',  chat: 'oui',        transmission: 'Ingestion œufs / hôte paraténique',                 localisation: 'Intestin grêle' },
      { parasite: 'Ancylostoma caninum',       chien: 'oui',  chat: 'partiel',    transmission: 'Peau, ingestion, lait',                             localisation: 'Intestin grêle' },
      { parasite: 'Uncinaria stenocephala',    chien: 'oui',  chat: 'partiel',    transmission: 'Peau, ingestion',                                   localisation: 'Intestin grêle' },
      { parasite: 'Trichuris vulpis',          chien: 'oui',  chat: 'non',        transmission: 'Ingestion œufs embryonnés',                         localisation: 'Cæcum / côlon' },
      { parasite: 'Strongyloides stercoralis', chien: 'oui',  chat: 'non',        transmission: 'Peau, ingestion, lait',                             localisation: 'Intestin grêle' },
      { parasite: 'Dirofilaria immitis',       chien: 'oui',  chat: 'oui',        transmission: 'Moustique (vecteur)',                                localisation: 'Artère pulmonaire / cœur droit' },
    ],
  },
  {
    categorie: 'Cestodes (vers plats)',
    items: [
      { parasite: 'Dipylidium caninum',          chien: 'oui', chat: 'oui', transmission: 'Ingestion puce infestée (Ctenocephalides)',       localisation: 'Intestin grêle' },
      { parasite: 'Taenia pisiformis',           chien: 'oui', chat: 'non', transmission: 'Ingestion lapin / lièvre (hôte intermédiaire)',   localisation: 'Intestin grêle' },
      { parasite: 'Taenia taeniaeformis',        chien: 'non', chat: 'oui', transmission: 'Ingestion rongeur (hôte intermédiaire)',          localisation: 'Intestin grêle' },
      { parasite: 'Echinococcus granulosus',     chien: 'oui', chat: 'non', transmission: 'Ingestion viscères de ruminants',                localisation: 'Intestin grêle' },
      { parasite: 'Echinococcus multilocularis', chien: 'oui', chat: 'oui', transmission: 'Ingestion rongeur (hôte intermédiaire)',          localisation: 'Intestin grêle' },
    ],
  },
  {
    categorie: 'Protozoaires',
    items: [
      { parasite: 'Giardia duodenalis',   chien: 'oui',     chat: 'oui',      transmission: 'Ingestion kystes (eau, fèces)',            localisation: 'Intestin grêle' },
      { parasite: 'Cryptosporidium spp.', chien: 'oui',     chat: 'oui',      transmission: 'Fécal-oral (oocystes)',                    localisation: 'Intestin grêle / gros intestin' },
      { parasite: 'Isospora canis',       chien: 'oui',     chat: 'non',      transmission: 'Ingestion oocystes sporulés',             localisation: 'Intestin grêle' },
      { parasite: 'Isospora felis',       chien: 'non',     chat: 'oui',      transmission: 'Ingestion oocystes sporulés',             localisation: 'Intestin grêle' },
      { parasite: 'Toxoplasma gondii',    chien: 'partiel', chat: 'definitif', transmission: 'Ingestion oocystes / kystes tissulaires', localisation: 'Tissus / intestin (chat)' },
    ],
  },
  {
    categorie: 'Ectoparasites',
    items: [
      { parasite: 'Demodex canis',                 chien: 'oui', chat: 'non', transmission: 'Contact mère-chiot (post-natal)', localisation: 'Follicules pileux / peau' },
      { parasite: 'Sarcoptes scabiei',             chien: 'oui', chat: 'non', transmission: 'Contact direct',                  localisation: 'Peau (croûtes)' },
      { parasite: 'Notoedres cati',                chien: 'non', chat: 'oui', transmission: 'Contact direct',                  localisation: 'Peau (tête / oreilles)' },
      { parasite: 'Cheyletiella spp.',             chien: 'oui', chat: 'oui', transmission: 'Contact direct',                  localisation: 'Surface cutanée' },
      { parasite: 'Ctenocephalides felis / canis', chien: 'oui', chat: 'oui', transmission: 'Environnement infesté',           localisation: 'Surface cutanée' },
    ],
  },
]

function Badge({ statut, espece }) {
  const styles = {
    oui:      { background: 'rgba(39,174,96,0.12)',  color: '#1a7a40',  label: '✓' },
    non:      { background: 'var(--bg)',              color: 'var(--text-hint)', label: '—' },
    partiel:  { background: 'rgba(243,156,18,0.12)', color: '#b8780a',  label: '(✓)' },
    definitif:{ background: 'rgba(39,174,96,0.12)',  color: '#1a7a40',  label: 'hôte déf.' },
  }
  const s = styles[statut] || styles.non
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 52 }}>
      <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{espece}</span>
      <span style={{
        fontSize: 12, fontWeight: 700, padding: '2px 8px',
        borderRadius: 20, background: s.background, color: s.color,
      }}>{s.label}</span>
    </div>
  )
}

export default function LaboParasitologieHotes() {
  const [categorieOuverte, setCategorieOuverte] = useState(null)
  const [parasiteOuvert, setParasiteOuvert] = useState(null)

  function toggleCategorie(i) {
    setCategorieOuverte(categorieOuverte === i ? null : i)
    setParasiteOuvert(null)
  }

  function toggleParasite(key) {
    setParasiteOuvert(parasiteOuvert === key ? null : key)
  }

  return (
    <div className="labo-detail-page">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PARASITES.map((groupe, gi) => {
          const catOuverte = categorieOuverte === gi
          return (
            <div key={gi} className="labo-tube-card">
              <button
                className={`labo-tube-header${catOuverte ? ' ouvert' : ''}`}
                onClick={() => toggleCategorie(gi)}
              >
                <span className="labo-tube-nom">{groupe.categorie}</span>
                <span style={{ fontSize: 12, color: 'var(--text-hint)', marginRight: 4 }}>
                  {groupe.items.length} parasites
                </span>
                <i className={`ti ti-chevron-down labo-tube-chevron${catOuverte ? ' ouvert' : ''}`}></i>
              </button>

              {catOuverte && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {groupe.items.map((item, ii) => {
                    const key = `${gi}-${ii}`
                    const ouvert = parasiteOuvert === key
                    return (
                      <div key={ii} style={{ borderTop: '1px solid var(--border)' }}>
                        <button
                          onClick={() => toggleParasite(key)}
                          style={{
                            width: '100%', background: 'transparent', border: 'none',
                            padding: '10px 16px', cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 10,
                          }}
                        >
                          <span style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>
                            {item.parasite}
                          </span>
                          <Badge statut={item.chien} espece="Chien" />
                          <Badge statut={item.chat} espece="Chat" />
                          <i className={`ti ti-chevron-down labo-tube-chevron${ouvert ? ' ouvert' : ''}`}
                            style={{ fontSize: 14, marginLeft: 4 }}></i>
                        </button>

                        {ouvert && (
                          <div style={{
                            padding: '0 16px 12px 16px',
                            display: 'flex', flexDirection: 'column', gap: 8,
                          }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <i className="ti ti-arrow-right" style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}></i>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', display: 'block', marginBottom: 2 }}>Transmission</span>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.transmission}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <i className="ti ti-map-pin" style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}></i>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', display: 'block', marginBottom: 2 }}>Localisation</span>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.localisation}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="labo-ref-note" style={{ marginTop: 12 }}>
        <i className="ti ti-info-circle"></i>
        ✓ hôte habituel &nbsp;·&nbsp; (✓) occasionnel / accidentel &nbsp;·&nbsp; hôte déf. = hôte définitif &nbsp;·&nbsp; — non concerné
      </p>
    </div>
  )
}
