import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { compterSignalementsEnAttente } from '../lib/signalementsAttente'
import { t, tn, locale } from '../lib/i18n'
import { texteActivite, ilYa } from '../lib/activiteEquipe'
import PastilleMembre from '../components/PastilleMembre'

export default function Notifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  // Administration : signalements d'erreurs encore à traiter.
  const [signalementsAttente, setSignalementsAttente] = useState(0)

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifs(data || [])
      setSignalementsAttente(await compterSignalementsEnAttente(user))
      setLoading(false)
      // Marquer toutes comme lues
      await supabase.from('notifications').update({ lu: true }).eq('user_id', user.id).eq('lu', false)
    }
    charger()
  }, [])

  async function supprimer(id) {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  async function supprimerToutes() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('notifications').delete().eq('user_id', user.id)
    setNotifs([])
  }

  // Activité de la clinique : le lien est gardé dans donnees (absent si l'élément a été retiré).
  const lienDe = n => (n.type === 'activite_equipe' ? n.donnees?.lien || null : n.reference_type)

  function naviguerNotif(notif) {
    if (notif.type === 'activite_equipe') { if (notif.donnees?.lien) navigate(notif.donnees.lien) }
    else if (notif.reference_type === 'babillard') navigate('/equipe?tab=babillard')
    else if (notif.reference_type === 'tache') navigate('/equipe?tab=taches')
    else if (notif.reference_type === 'transfert') navigate('/equipe/transfert')
    else if (notif.reference_type === 'signalements') navigate('/admin/signalements')
  }

  if (loading) return <div className="admin-loading">{t('Chargement...')}</div>

  return (
    <div className="notifs-page">
      {signalementsAttente > 0 && (
        <div className="notif-item non-lue">
          <div
            className="notif-item-contenu"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/signalements')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/admin/signalements') } }}
            style={{ cursor: 'pointer' }}
          >
            <div className="notif-item-icone" style={{ background: 'rgba(192, 57, 43, 0.12)', color: 'var(--accent-red)' }}>
              <i className="ti ti-flag" aria-hidden="true"></i>
            </div>
            <div className="notif-item-texte">
              <p className="notif-item-message" style={{ fontWeight: 600 }}>
                {tn(signalementsAttente, '{n} signalement d\'erreur en attente', '{n} signalements d\'erreurs en attente')}
              </p>
              <p className="notif-item-date">{t('Panneau admin, à traiter')}</p>
            </div>
          </div>
          <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--text-hint)', padding: '14px 16px' }}></i>
        </div>
      )}
      {notifs.length === 0 ? (
        signalementsAttente > 0 ? null : (
        <div className="notifs-vide">
          <i className="ti ti-bell notifs-vide-icone"></i>
          <p className="notifs-vide-titre">{t('Aucune notification')}</p>
          <p className="notifs-vide-sous">{t('Vous êtes à jour!')}</p>
        </div>
        )
      ) : (
        <>
          <div className="notifs-toolbar">
            <span className="notifs-count">{tn(notifs.length, '{n} notification', '{n} notifications')}</span>
            <button className="notifs-tout-supprimer" onClick={supprimerToutes}>
              {t('Tout effacer')}
            </button>
          </div>
          <div className="notifs-liste">
            {notifs.map(n => {
              const activite = n.type === 'activite_equipe' && n.donnees
              return (
              <div
                key={n.id}
                className={`notif-item ${n.lu ? '' : 'non-lue'}`}
              >
                <div
                  className="notif-item-contenu"
                  onClick={() => lienDe(n) && naviguerNotif(n)}
                  style={{ cursor: lienDe(n) ? 'pointer' : 'default' }}
                >
                  {activite ? (
                    <>
                      <PastilleMembre userId={n.donnees.auteur_id} nom={n.donnees.auteur} taille={36} />
                      <div className="notif-item-texte">
                        <p className="notif-item-auteur">
                          {t('{nom}, {quand}', { nom: n.donnees.auteur || t('Un membre'), quand: ilYa(n.created_at) })}
                        </p>
                        <p className="notif-item-message">{texteActivite(n.donnees)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="notif-item-icone">
                        <i className="ti ti-bell"></i>
                      </div>
                      <div className="notif-item-texte">
                        <p className="notif-item-message">{n.message}</p>
                        <p className="notif-item-date">
                          {new Date(n.created_at).toLocaleString(locale, {
                            day: 'numeric', month: 'long',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button className="notif-item-suppr" onClick={() => supprimer(n.id)} aria-label={t('Supprimer la notification')}>
                  <i className="ti ti-x"></i>
                </button>
              </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
