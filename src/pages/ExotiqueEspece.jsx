import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useProfil } from '../context/ProfilContext'
import PopupPro from '../components/PopupPro'
import { ESPECES_CONFIG } from '../data/especes'
import { VALEURS_EXOTIQUES } from '../data/valeursExotiques'
import { NOMS_EXOTIQUES } from '../lib/especesExotiques'
import { useEspeceExotique } from '../lib/useEspeceExotique'
import BadgePro from '../components/BadgePro'
import { t, enAnglais } from '../lib/i18n'

// Version carrée et bleu marine du furet, assortie aux autres icônes.
const ICONES = { furet: '/icone-furet.svg' }

// Page d'une espèce exotique : ses outils, puis l'ajout d'un médicament.
export default function ExotiqueEspece() {
  const navigate = useNavigate()
  const { espece, connue, inconnue } = useEspeceExotique(e => ESPECES_CONFIG[e].label)
  const { estPro, estEquipe, roleEquipe, lectureSeule } = useProfil()
  const [showProMsg, setShowProMsg] = useState(false)

  if (inconnue) return <Navigate to="/exotiques" replace />
  if (!connue) return null

  const noms = NOMS_EXOTIQUES[espece]
  const valeurs = VALEURS_EXOTIQUES[espece]
  // Phrases : « du lapin », « pour le lapin » en français ; « for rabbits » en anglais.
  const du = enAnglais ? noms.en : noms.du
  const le = enAnglais ? noms.en : noms.le
  const outils = [
    {
      id: 'medicaments',
      titre: t('Médicaments'),
      detail: t('Doses {du} et calcul du volume', { du }),
      icone: '/icone-pharmaco.svg',
      route: `/exotiques/${espece}/medicaments`,
    },
    valeurs && {
      id: 'valeurs',
      titre: t('Valeurs de référence'),
      detail: [...new Set(valeurs.flatMap(s => s.sections.map(x => x.titre)))]
        .map((titre, i) => (i ? t(titre).toLowerCase() : t(titre))).join(', '),
      icone: '/icone-laboratoire.svg',
      route: `/exotiques/${espece}/valeurs`,
    },
  ].filter(Boolean)

  // Un membre de la clinique consulte les médicaments sans en ajouter.
  const peutAjouter = estEquipe ? (roleEquipe === 'admin' || roleEquipe === 'proprietaire') : estPro

  return (
    <div className="exotique-espece-page">
      <div className="exotique-espece-banniere">
        <span className="exotique-espece-pastille">
          <img src={ICONES[espece] || ESPECES_CONFIG[espece].icone} alt="" />
        </span>
        <span className="exotique-espece-noms">
          <span className="exotique-espece-nom">{ESPECES_CONFIG[espece].label}</span>
          {noms.latin && <span className="exotique-espece-latin">{noms.latin}</span>}
          {noms.precision && <span className="exotique-espece-precision">{noms.precision}</span>}
        </span>
        <button className="exotique-espece-changer" onClick={() => navigate('/exotiques')}>{t('Changer')}</button>
      </div>

      <nav className="exotique-outils" aria-label={t('Outils pour {le}', { le })}>
        {outils.map(o => (
          <button key={o.id} className="exotique-outil" onClick={() => navigate(o.route)}>
            <img src={o.icone} alt="" className="exotique-outil-icone" />
            <span className="exotique-outil-textes">
              <span className="exotique-outil-titre">{o.titre}</span>
              <span className="exotique-outil-detail">{o.detail}</span>
            </span>
            <i className="ti ti-chevron-right exotique-outil-chevron" aria-hidden="true"></i>
          </button>
        ))}
      </nav>

      {!lectureSeule && (
        <div className="exotique-ajout">
          <button
            className="exotique-ajout-btn"
            onClick={() => (peutAjouter ? navigate(`/drogues/ajouter?espece=${espece}`) : setShowProMsg(true))}
          >
            <i className="ti ti-plus" aria-hidden="true"></i>
            {t('Ajouter un médicament pour {le}', { le })}
            {!peutAjouter && !estEquipe && <BadgePro enLigne toujours />}
          </button>
          <p className="exotique-ajout-aide">
            {t('Il apparaîtra dans les médicaments {du}. En favori, vous le retrouvez avec tous vos autres médicaments.', { du })}
          </p>
        </div>
      )}

      {showProMsg && <PopupPro onClose={() => setShowProMsg(false)} />}
    </div>
  )
}
