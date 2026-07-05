import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

export default function useCharteRadio() {
  const [entrees, setEntrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const { estEquipe, teamId } = useProfil()

  const charger = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user.id)
    const query = estEquipe && teamId
      ? supabase.from('chartes_radio').select('*').or(`user_id.eq.${user.id},equipe_id.eq.${teamId}`).order('espece', { ascending: true })
      : supabase.from('chartes_radio').select('*').eq('user_id', user.id).order('espece', { ascending: true })
    const { data } = await query
    setEntrees(data || [])
    setLoading(false)
  }, [estEquipe, teamId])

  useEffect(() => {
    charger()
  }, [charger])

  async function obtenirEntree(id) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('chartes_radio')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    return { data, error }
  }

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

  return { entrees, loading, userId, charger, obtenirEntree, creerEntree, modifierEntree, supprimerEntree }
}
