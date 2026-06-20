import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useCharteRadio() {
  const [entrees, setEntrees] = useState([])
  const [loading, setLoading] = useState(true)

  const charger = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('chartes_radio')
      .select('*')
      .eq('user_id', user.id)
      .order('espece', { ascending: true })
    setEntrees(data || [])
    setLoading(false)
  }, [])

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
    const { error } = await supabase
      .from('chartes_radio')
      .insert({ ...payload, user_id: user.id })
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

  return { entrees, loading, charger, obtenirEntree, creerEntree, modifierEntree, supprimerEntree }
}
