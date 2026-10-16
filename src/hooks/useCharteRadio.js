import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

export default function useCharteRadio() {
  const [entrees, setEntrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const { estEquipe, teamId } = useProfil()

  /* Rechargé quand le profil arrive (clinique) ; « actif » écarte la
     réponse d'un chargement devenu périmé. */
  useEffect(() => {
    let actif = true
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser()
      const query = estEquipe && teamId
        ? supabase.from('chartes_radio').select('*').or(`user_id.eq.${user.id},equipe_id.eq.${teamId}`).order('espece', { ascending: true })
        : supabase.from('chartes_radio').select('*').eq('user_id', user.id).order('espece', { ascending: true })
      const { data } = await query
      if (!actif) return
      setUserId(user.id)
      setEntrees(data || [])
      setLoading(false)
    }
    charger()
    return () => { actif = false }
  }, [estEquipe, teamId])

  // Stable d'un affichage à l'autre : le formulaire s'en sert dans un effet.
  const obtenirEntree = useCallback(async (id) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('chartes_radio')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    return { data, error }
  }, [])

  async function creerEntree(payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profilFrais } = await supabase.from('profiles').select('nom').eq('id', user.id).single()
    const nomUtilisateur = profilFrais?.nom || user.user_metadata?.nom || user.email || ''
    const extra = { user_id: user.id, ajoutee_par: nomUtilisateur }
    if (estEquipe && teamId) extra.equipe_id = teamId
    const { error } = await supabase
      .from('chartes_radio')
      .insert({ ...payload, ...extra })
    return { error }
  }

  async function modifierEntree(id, payload) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('chartes_radio')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
    return { error }
  }

  async function supprimerEntree(id) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('chartes_radio')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) setEntrees(prev => prev.filter(e => e.id !== id))
    return { error }
  }

  return { entrees, loading, userId, obtenirEntree, creerEntree, modifierEntree, supprimerEntree }
}
