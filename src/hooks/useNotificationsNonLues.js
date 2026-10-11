import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/* Nombre de notifications non lues, tenu à jour en direct.
   Écoute aussi les mises à jour : quand une notification est marquée
   comme lue ailleurs dans l'app, le compte baisse tout de suite.
   `actif` à false (forfait sans notifications) : aucun appel. */
export default function useNotificationsNonLues(actif) {
  const [compte, setCompte] = useState(0)

  useEffect(() => {
    if (!actif) return
    let vivant = true
    let canal = null

    async function charger(userId) {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('lu', false)
      if (vivant) setCompte(count || 0)
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!vivant || !user) return
      charger(user.id)
      canal = supabase
        .channel('notifs-nav-' + user.id + '-' + Date.now())
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => charger(user.id))
        .subscribe()
    })

    return () => { vivant = false; if (canal) supabase.removeChannel(canal) }
  }, [actif])

  return actif ? compte : 0
}
