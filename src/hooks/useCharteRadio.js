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

  /* Une entrée de la clinique se modifie et se supprime par tous ses
     membres, pas seulement par la personne qui l'a ajoutée. Les règles
     d'accès de la base décident ; aucune ligne touchée veut dire refus. */
  const REFUS = { code: '42501' }

  // Stable d'un affichage à l'autre : le formulaire s'en sert dans un effet.
  const obtenirEntree = useCallback(async (id) => {
    const { data, error } = await supabase
      .from('chartes_radio')
      .select('*')
      .eq('id', id)
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
    const { data, error } = await supabase
      .from('chartes_radio')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
    return { error: error || (data?.length ? null : REFUS) }
  }

  async function supprimerEntree(id) {
    const { data, error } = await supabase
      .from('chartes_radio')
      .delete()
      .eq('id', id)
      .select('id')
    if (!error && data?.length) setEntrees(prev => prev.filter(e => e.id !== id))
    return { error: error || (data?.length ? null : REFUS) }
  }

  // Ses propres entrées, et toutes celles de sa clinique.
  const peutModifier = (entree) => entree.user_id === userId || Boolean(teamId && entree.equipe_id === teamId)

  return { entrees, loading, userId, peutModifier, obtenirEntree, creerEntree, modifierEntree, supprimerEntree }
}
