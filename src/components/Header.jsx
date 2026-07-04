import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { TitreContext, NavGuardContext } from '../App'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

const titres = {
  '/calculateurs': 'Calculateur de dosage',
  '/calculateurs/cri': 'CRI',
  '/calculateurs/fluido': 'Fluidothérapie',
  '/calculateurs/conversion': 'Conversion',
  '/calculateurs/besoin': 'Besoin énergétique',
  '/calculateurs/dilution': 'Dilution C1V1-C2V2',
  '/calculateurs/transfusion': 'Transfusion sanguine',
  '/calculateurs/mise-bas': 'Date de mise bas',
  '/calculateurs/toxicite': 'Toxicité chocolat',
  '/calculateurs/rcr': 'RCR Urgence',
  '/calculateurs/tempo': 'Tap BPM',
  '/calculateurs/douleur-aigue': 'Évaluation de la douleur aiguë',
  '/calculateurs/douleur-aigue/chien': 'Douleur aiguë — Chien',
  '/calculateurs/douleur-aigue/chat': 'Douleur aiguë — Chat',
  '/drogues/anesthesiques': 'Anesthésiques / Analgésiques',
  '/drogues/antagonistes': 'Antagonistes',
  '/drogues/antibiotiques': 'Antibiotiques',
  '/drogues/antidiarrheiques': 'Antidiarrhéiques',
  '/drogues/antiemetiques': 'Antiémétiques',
  '/drogues/antihistaminiques': 'Antihistaminiques',
  '/drogues/cardiovasculaires': 'Cardiovasculaires',
  '/drogues/gastroprotecteurs': 'Gastroprotecteurs',
  '/drogues/neurologiques': 'Neurologiques',
  '/drogues/respiratoires': 'Respiratoires',
  '/drogues/urgence': 'Urgence',
  '/admin/medicaments': 'Admin — Médicaments',
  '/profil': 'Profil',
  '/sources-references': 'Sources et références',
  '/disclaimer': 'Avertissement',
  '/politique-confidentialite': 'Politique de confidentialité',
  '/termes-services': 'Termes et services',
  '/aide': 'Aide',
  '/drogues/mes-drogues': 'Médicaments favoris',
  '/labo': 'Laboratoire',
  '/drogues': 'Pharmacologie',
  '/chirurgie': 'Chirurgie',
  '/soins-generaux': 'Soins généraux',
  '/labo/nouveau': 'Nouveau protocole',
  '/admin': 'Panneau admin',
  '/admin/labo': 'Admin — Laboratoire',
  '/labo/aeac9309-185f-4f2c-81b2-dfed3d4e55aa': 'Urologie',
  '/labo/urologie/valeurs': 'Valeurs de référence',
  '/labo/urologie/sediments': 'Sédiments urinaires',
  '/labo/2e0222f2-5733-4d01-bc99-8c380bec5abe': 'Parasitologie',
  '/labo/parasitologie/oeufs': 'Œufs de parasites',
  '/labo/parasitologie/hotes': 'Hôtes & espèces affectées',
  '/labo/4efe71ce-bfa9-4ea9-a8af-ecbd6dc97320': 'Biochimie',
  '/labo/biochimie/tubes': 'Choix du tube',
  '/labo/biochimie/valeurs': 'Valeurs normales',
  '/labo/173fb58a-988c-4202-8b14-bfcd15c4a16f': 'Cytologie',
  '/labo/cytologie/prelevement': 'Guide de prélèvement',
  '/labo/cytologie/cellules': 'Types cellulaires',
  '/labo/e216b2ee-59c8-4ea8-a06e-92c0f6f05ee5': 'Microbiologie',
  '/labo/microbiologie/prelevement': 'Guide de prélèvement',
  '/labo/microbiologie/cultures': 'Interprétation des cultures',
  '/labo/microbiologie/antibiogramme': 'Antibiogramme',
  '/labo/microbiologie/bacteries': 'Bactéries courantes',
  '/drogues/ajouter': 'Ajouter un médicament',
  '/labo/parasitologie/dipylidium': 'Dipylidium caninum',
  '/labo/parasitologie/puce': 'Cycle de vie de la puce',
  '/labo/biochimie/organes': 'Tests par organe',
  '/labo/biochimie/immuno': 'Tests immunologiques',
  '/labo/microbiologie/colonies': 'Colonies bactériennes',
  '/labo/microbiologie/levures': 'Caractéristiques des levures',
  '/drogues/toxicologie': 'Toxicologie',
  '/notes': 'Notes',
  '/chirurgie/instruments': 'Catalogue d\'instruments',
  '/chirurgie/tubes': 'Tubes endotrachéaux',
  '/chirurgie/monitoring': 'Monitoring anesthésique',
  '/chirurgie/capnographie': 'Interprétation de la capnographie',
  '/chirurgie/post-op': 'Soins post-opératoires',
  '/chirurgie/douleur': 'Évaluation de la douleur post-opératoire',
  '/chirurgie/ecg': 'ECG',
  '/chirurgie/ecg/electrodes': 'Positionnement des électrodes',
  '/chirurgie/ecg/interpretation': 'Interprétation',
  '/chirurgie/ecg/anomalies': 'Anomalies courantes',
  '/chirurgie/ecg/conduction': 'Conduction cardiaque',
  '/soins-generaux/examen-physique': 'Démarrer un examen',
  '/soins-generaux/dentisterie': 'Dentisterie',
  '/soins-generaux/dentisterie/charte-chien': 'Charte dentaire - Chien',
  '/soins-generaux/dentisterie/charte-chat': 'Charte dentaire - Chat',
  '/soins-generaux/dentisterie/termes-directionnels': 'Termes directionnels',
  '/soins-generaux/abreviations': 'Abréviations courantes',
  '/soins-generaux/termes-directionnels': 'Termes directionnels',
  '/labo/radiologie/notions-base': 'Notions de base : mA, kVp et distance',
  '/labo/radiologie/depannage': 'Dépannage',
  '/labo/radiologie/charte': 'Charte radiographique personnelle',
  '/equipe': 'Équipe',
  '/equipe/gestion': 'Gestion de l\'équipe',
  }

function ClochNotifications() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const { estEquipe } = useProfil()

  useEffect(() => {
    if (!estEquipe) return
    charger()
    let uid
    supabase.auth.getUser().then(({ data: { user } }) => {
      uid = user.id
      const channel = supabase
        .channel('notifs-' + user.id)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => charger())
        .subscribe()
      return () => supabase.removeChannel(channel)
    })
  }, [estEquipe])

  async function charger() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setNotifs(data || [])
    setCount((data || []).filter(n => !n.lu).length)
  }

  async function marquerLues() {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('notifications').update({ lu: true }).eq('user_id', user.id).eq('lu', false)
    setCount(0)
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  }

  if (!estEquipe) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open && count > 0) marquerLues() }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px',
          color: 'var(--text-primary)', fontSize: 20, position: 'relative',
        }}
      >
        <i className="ti ti-bell"></i>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2, background: 'var(--accent-red)',
            color: '#fff', borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 40, right: 0, zIndex: 100, width: 280,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notifications</p>
            </div>
            {notifs.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-hint)' }}>Aucune notification</p>
              </div>
            ) : (
              <div style={{ maxHeight: 320, overflow: 'auto' }}>
                {notifs.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--border)',
                    background: n.lu ? 'transparent' : 'var(--bg-secondary)',
                  }}>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-hint)', margin: '4px 0 0' }}>
                      {new Date(n.created_at).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { titreCustom } = useContext(TitreContext)
  const { demanderConfirmation } = useContext(NavGuardContext)

  if (location.pathname === '/accueil') return null

  const titre = titreCustom ||
    titres[location.pathname] ||
    Object.entries(titres)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([key]) => location.pathname.startsWith(key))?.[1] ||
    null

  const pagesMenu = ['/sources-references', '/disclaimer', '/politique-confidentialite', '/termes-services', '/aide']
  const retour = () => {
    demanderConfirmation(() => {
      pagesMenu.includes(location.pathname) ? navigate('/accueil') : navigate(-1)
    })
  }

  return (
    <div className="header">
      <button className="header-back" onClick={retour}>
        <i className="ti ti-arrow-left"></i>
      </button>
      <span style={{ textAlign: 'center', maxWidth: 'calc(100% - 80px)', lineHeight: 1.3 }}>{titre}</span>
      <ClochNotifications />
    </div>
  )
}
