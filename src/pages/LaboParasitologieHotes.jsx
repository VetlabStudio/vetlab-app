import { useState } from 'react'
import { t, tn, enAnglais } from '../lib/i18n'

const PARASITES = [
  {
    categorie: t('Nématodes (vers ronds)'),
    items: [
      { parasite: t('Toxocara canis'),            chien: 'oui',  chat: 'non',        transmission: t('Ingestion œufs, transplacentaire, lait'),            localisation: t('Intestin grêle') },
      { parasite: t('Toxocara cati'),             chien: 'non',  chat: 'oui',        transmission: t('Ingestion œufs, lait'),                              localisation: t('Intestin grêle') },
      { parasite: t('Toxascaris leonina'),        chien: 'oui',  chat: 'oui',        transmission: t('Ingestion œufs / hôte paraténique'),                 localisation: t('Intestin grêle') },
      { parasite: t('Ancylostoma caninum'),       chien: 'oui',  chat: 'partiel',    transmission: t('Peau, ingestion, lait'),                             localisation: t('Intestin grêle') },
      { parasite: t('Uncinaria stenocephala'),    chien: 'oui',  chat: 'partiel',    transmission: t('Peau, ingestion'),                                   localisation: t('Intestin grêle') },
      { parasite: t('Trichuris vulpis'),          chien: 'oui',  chat: 'non',        transmission: t('Ingestion œufs embryonnés'),                         localisation: t('Cæcum / côlon') },
      { parasite: t('Strongyloides stercoralis'), chien: 'oui',  chat: 'non',        transmission: t('Peau, ingestion, lait'),                             localisation: t('Intestin grêle') },
      { parasite: t('Dirofilaria immitis'),       chien: 'oui',  chat: 'oui',        transmission: t('Moustique (vecteur)'),                                localisation: t('Artère pulmonaire / cœur droit') },
    ],
  },
  {
    categorie: t('Cestodes (vers plats)'),
    items: [
      { parasite: t('Dipylidium caninum'),          chien: 'oui', chat: 'oui', transmission: t('Ingestion puce infestée (Ctenocephalides)'),       localisation: t('Intestin grêle') },
      { parasite: t('Taenia pisiformis'),           chien: 'oui', chat: 'non', transmission: t('Ingestion lapin / lièvre (hôte intermédiaire)'),   localisation: t('Intestin grêle') },
      { parasite: t('Taenia taeniaeformis'),        chien: 'non', chat: 'oui', transmission: t('Ingestion rongeur (hôte intermédiaire)'),          localisation: t('Intestin grêle') },
      { parasite: t('Echinococcus granulosus'),     chien: 'oui', chat: 'non', transmission: t('Ingestion viscères de ruminants'),                localisation: t('Intestin grêle') },
      { parasite: t('Echinococcus multilocularis'), chien: 'oui', chat: 'oui', transmission: t('Ingestion rongeur (hôte intermédiaire)'),          localisation: t('Intestin grêle') },
    ],
  },
  {
    categorie: t('Protozoaires'),
    items: [
      { parasite: t('Giardia duodenalis'),   chien: 'oui',     chat: 'oui',      transmission: t('Ingestion kystes (eau, fèces)'),            localisation: t('Intestin grêle') },
      { parasite: t('Cryptosporidium spp.'), chien: 'oui',     chat: 'oui',      transmission: t('Fécal-oral (oocystes)'),                    localisation: t('Intestin grêle / gros intestin') },
      { parasite: t('Isospora canis'),       chien: 'oui',     chat: 'non',      transmission: t('Ingestion oocystes sporulés'),             localisation: t('Intestin grêle') },
      { parasite: t('Isospora felis'),       chien: 'non',     chat: 'oui',      transmission: t('Ingestion oocystes sporulés'),             localisation: t('Intestin grêle') },
      { parasite: t('Toxoplasma gondii'),    chien: 'partiel', chat: 'definitif', transmission: t('Ingestion oocystes / kystes tissulaires'), localisation: t('Tissus / intestin (chat)') },
    ],
  },
  {
    categorie: t('Ectoparasites'),
    items: [
      { parasite: t('Demodex canis'),                 chien: 'oui', chat: 'non', transmission: t('Contact mère-chiot (post-natal)'), localisation: t('Follicules pileux / peau') },
      { parasite: t('Sarcoptes scabiei'),             chien: 'oui', chat: 'non', transmission: t('Contact direct'),                  localisation: t('Peau (croûtes)') },
      { parasite: t('Notoedres cati'),                chien: 'non', chat: 'oui', transmission: t('Contact direct'),                  localisation: t('Peau (tête / oreilles)') },
      { parasite: t('Cheyletiella spp.'),             chien: 'oui', chat: 'oui', transmission: t('Contact direct'),                  localisation: t('Surface cutanée') },
      { parasite: t('Ctenocephalides felis / canis'), chien: 'oui', chat: 'oui', transmission: t('Environnement infesté'),           localisation: t('Surface cutanée') },
    ],
  },
]

function Badge({ statut, espece }) {
  const styles = {
    oui:      { background: 'rgba(39,174,96,0.12)',  color: '#1a7a40',  label: '✓' },
    non:      { background: 'var(--bg)',              color: 'var(--text-hint)', label: '—' },
    partiel:  { background: 'rgba(243,156,18,0.12)', color: '#8f5d07',  label: '(✓)' },
    definitif:{ background: 'rgba(39,174,96,0.12)',  color: '#1a7a40',  label: t('hôte déf.') },
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
                  {tn(groupe.items.length, '{n} parasite', '{n} parasites')}
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
                          <Badge statut={item.chien} espece={t('Chien')} />
                          <Badge statut={item.chat} espece={t('Chat')} />
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
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', display: 'block', marginBottom: 2 }}>{t('Transmission')}</span>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.transmission}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <i className="ti ti-map-pin" style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}></i>
                              <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', display: 'block', marginBottom: 2 }}>{t('Localisation')}</span>
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
        {enAnglais
          ? <>✓ usual host &nbsp;·&nbsp; (✓) occasional / accidental &nbsp;·&nbsp; def. host = definitive host &nbsp;·&nbsp; — not affected</>
          : <>✓ hôte habituel &nbsp;·&nbsp; (✓) occasionnel / accidentel &nbsp;·&nbsp; hôte déf. = hôte définitif &nbsp;·&nbsp; — non concerné</>}
      </p>
    </div>
  )
}
