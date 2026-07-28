import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Notifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    charger()
  }, [])

  async function charger() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifs(data || [])
    setLoading(false)
    // Marquer toutes comme lues
    await supabase.from('notifications').update({ lu: true }).eq('user_id', user.id).eq('lu', false)
  }

  async function supprimer(id) {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  async function supprimerToutes() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('notifications').delete().eq('user_id', user.id)
    setNotifs([])
  }

  function naviguerNotif(notif) {
    if (notif.reference_type === 'babillard') navigate('/equipe?tab=babillard')
    else if (notif.reference_type === 'tache') navigate('/equipe?tab=taches')
  }

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="notifs-page">
      {notifs.length === 0 ? (
        <div className="notifs-vide">
          <i className="ti ti-bell notifs-vide-icone"></i>
          <p className="notifs-vide-titre">Aucune notification</p>
          <p className="notifs-vide-sous">Vous êtes à jour!</p>
        </div>
      ) : (
        <>
          <div className="notifs-toolbar">
            <span className="notifs-count">{notifs.length} notification{notifs.length > 1 ? 's' : ''}</span>
            <button className="notifs-tout-supprimer" onClick={supprimerToutes}>
              Tout effacer
            </button>
          </div>
          <div className="notifs-liste">
            {notifs.map(n => (
              <div
                key={n.id}
                className={`notif-item ${n.lu ? '' : 'non-lue'}`}
              >
                <div
                  className="notif-item-contenu"
                  onClick={() => n.reference_type && naviguerNotif(n)}
                  style={{ cursor: n.reference_type ? 'pointer' : 'default' }}
                >
                  <div className="notif-item-icone">
                    <i className="ti ti-bell"></i>
                  </div>
                  <div className="notif-item-texte">
                    <p className="notif-item-message">{n.message}</p>
                    <p className="notif-item-date">
                      {new Date(n.created_at).toLocaleString('fr-CA', {
                        day: 'numeric', month: 'long',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <button className="notif-item-suppr" onClick={() => supprimer(n.id)}>
                  <i className="ti ti-x"></i>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
