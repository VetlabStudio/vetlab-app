import { useState } from 'react'
import { t, tn } from '../lib/i18n'

const SYSTEMES = [
  {
    nom: t('Voies respiratoires inférieures'),
    items: [
      { echantillon: t('Lavage transtrachéal'), transport: t('Tube stérile, transport à 4 °C'), notes: t('Échantillon semi-invasif, recueilli sous anesthésie.') },
      { echantillon: t('Aspirat ou biopsie des poumons'), transport: t('Contenant stérile'), notes: t('Indiqué en pathologie profonde; attention aux contaminations.') },
    ],
  },
  {
    nom: t('Voies respiratoires supérieures'),
    items: [
      { echantillon: t('Frottis nasopharyngien'), transport: t('Écouvillon synthétique avec transport viral ou bactérien'), notes: t('Manipulation douce pour ne pas irriter la muqueuse.') },
      { echantillon: t('Lavage des sinus'), transport: t('Tube stérile'), notes: t('Effectué sous anesthésie; échantillon stérile recommandé.') },
      { echantillon: t('Biopsie des voies respiratoires'), transport: t('Contenant stérile ou formol selon analyse'), notes: t('Pour culture ou histopathologie selon suspicion.') },
    ],
  },
  {
    nom: t('Voies urinaires'),
    items: [
      { echantillon: t('Urine'), transport: t('Contenant stérile; transport à 4 °C'), notes: t('Cystocentèse préférée; analyser dans les 4 à 6 h.') },
    ],
  },
  {
    nom: t('Appareil gastro-intestinal'),
    items: [
      { echantillon: t('Fèces'), transport: t('Contenant stérile ou milieu Cary-Blair'), notes: t('Ne pas congeler pour culture bactérienne; congélation possible pour virologie.') },
      { echantillon: t('Frottis rectal'), transport: t('Écouvillon en milieu de transport (Amies)'), notes: t('Prélever en douceur; utile si émission fécale impossible.') },
    ],
  },
  {
    nom: t('Appareils reproducteurs'),
    items: [
      { echantillon: t('Liquide prostatique'), transport: t('Tube stérile, transport rapide à 4 °C'), notes: t('Échantillon recueilli par massage prostatique transrectal ou urétral.') },
      { echantillon: t('Sperme'), transport: t('Tube stérile, transport rapide à 37 °C'), notes: t('Analyser rapidement; éviter les chocs thermiques.') },
      { echantillon: t('Utérus'), transport: t('Biopsie ou écouvillon stérile'), notes: t('Transport sur Amies ou Stuart; peut nécessiter anesthésie.') },
      { echantillon: t('Vagin'), transport: t('Écouvillon en milieu de transport'), notes: t('Prélever dans la profondeur du vagin avec spéculum stérile.') },
      { echantillon: t('Avortement'), transport: t('Foetus entier, placenta et liquide amniotique'), notes: t('Transport à 4 °C; idéalement complet pour diagnostic multiple.') },
    ],
  },
  {
    nom: t('Oeil'),
    items: [
      { echantillon: t('Frottis conjonctival'), transport: t('Écouvillon ou lame, transport rapide'), notes: t('Utiliser écouvillon synthétique; éviter anesthésie si possible.') },
      { echantillon: t('Grattage cornéen'), transport: t('Lame ou écouvillon synthétique sec'), notes: t('Sous anesthésie topique; éviter coton.') },
      { echantillon: t('Liquide oculaire'), transport: t('Tube stérile ou seringue scellée'), notes: t('Petite quantité; manipuler rapidement.') },
    ],
  },
  {
    nom: t('Os et articulations'),
    items: [
      { echantillon: t('Aspirat articulaire'), transport: t('Tube stérile sans additif'), notes: t('Transport rapide à température ambiante ou 4 °C; éviter anticoagulants.') },
      { echantillon: t('Aspirat de moelle osseuse'), transport: t('Tube EDTA ou stérile selon l\'analyse'), notes: t('Prélever en conditions stériles; quantité minimale suffisante (0,5 ml).') },
      { echantillon: 'Os', transport: t('Fragment dans contenant stérile'), notes: t('Transport à 4 °C; éviter contamination en chirurgie.') },
    ],
  },
  {
    nom: t('Peau'),
    items: [
      { echantillon: t('Frottis de peau'), transport: t('Lame propre, air sec, étui rigide'), notes: t('Fixer immédiatement si coloration prévue; utile en cytologie.') },
      { echantillon: t('Écouvillonnage de peau'), transport: t('Écouvillon stérile avec Amies ou Stuart'), notes: t('Prélever en profondeur ou sous croûte si possible.') },
      { echantillon: t('Biopsie de tissus'), transport: t('Formol 10% ou contenant stérile selon l\'analyse'), notes: t('Indiquer l\'objectif : histopatho ou culture.') },
      { echantillon: t('Pellicules, poils et grattages'), transport: t('Lame propre ou contenant sec'), notes: t('Utiliser pour recherche fongique ou parasitaire.') },
    ],
  },
  {
    nom: t('Sang'),
    items: [
      { echantillon: t('Sang entier'), transport: t('Tube EDTA ou héparine; 3 ml minimum'), notes: t('Ne pas congeler; conserver à 4 °C.') },
    ],
  },
  {
    nom: t('Système nerveux central'),
    items: [
      { echantillon: t('Liquide céphalorachidien'), transport: t('Tube stérile; transport rapide à 4 °C'), notes: t('Volume faible (0,5 à 1 ml); analyse rapide essentielle.') },
    ],
  },
  {
    nom: t('Tissus de nécropsie'),
    items: [
      { echantillon: t('Lésions de nécropsie'), transport: t('Contenant stérile ou formol selon objectif'), notes: t('Prélever rapidement post-mortem; séparer les organes pour analyse ciblée.') },
    ],
  },
]

const BONNES_PRATIQUES = [
  t('Prélever avant tout traitement antibiotique si possible.'),
  t('Identifier clairement le prélèvement : animal, propriétaire, site anatomique, méthode.'),
  t('Respecter la chaîne de froid (4 °C) sauf pour les hémocultures.'),
  t('Acheminer rapidement au laboratoire, idéalement en moins de 24 h.'),
  t('Préciser les antibiotiques en cours dans la demande.'),
  t('Éviter la contamination avec une technique aseptique rigoureuse.'),
]

export default function LaMicrobiologiePrelevement() {
  const [ouvert, setOuvert] = useState(null)

  return (
    <div className="labo-detail-page">

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {SYSTEMES.map((sys, i) => {
          const estOuvert = ouvert === i
          return (
            <div key={i} className="labo-tube-card">
              <button
                className={`labo-tube-header${estOuvert ? ' ouvert' : ''}`}
                onClick={() => setOuvert(estOuvert ? null : i)}
              >
                <span className="labo-tube-nom">{sys.nom}</span>
                <span style={{ fontSize: 12, color: 'var(--text-hint)', marginRight: 4 }}>
                  {tn(sys.items.length, '{n} échantillon', '{n} échantillons')}
                </span>
                <i className={`ti ti-chevron-down labo-tube-chevron${estOuvert ? ' ouvert' : ''}`}></i>
              </button>

              {estOuvert && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {sys.items.map((row, j) => (
                    <div key={j} style={{
                      padding: '10px 16px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{row.echantillon}</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <i className="ti ti-truck" style={{ fontSize: 12, color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}></i>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.transport}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <i className="ti ti-info-circle" style={{ fontSize: 12, color: 'var(--text-hint)', marginTop: 2, flexShrink: 0 }}></i>
                        <span style={{ fontSize: 12, color: 'var(--text-hint)' }}>{row.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="labo-ref-section">
        <h2 className="labo-ref-titre">{t('Bonnes pratiques pré-analytiques')}</h2>
        <div className="labo-etape-card">
          {BONNES_PRATIQUES.map((p, i) => (
            <div key={i} className="labo-materiel-item" style={{ borderBottom: i < BONNES_PRATIQUES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <i className="ti ti-check" style={{ color: 'var(--primary)', flexShrink: 0 }}></i>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
