import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { useProfil } from '../context/ProfilContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

async function messageErreur(error, data, defaut) {
  if (data?.error) return data.error
  const corps = await error?.context?.json?.().catch(() => null)
  return corps?.error || defaut
}

export default function TransfertPropriete() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { chargerProfil } = useProfil()

  // demande | refuse | finalisation | termine | attente
  const [etape, setEtape] = useState(searchParams.get('paiement') === 'succes' ? 'finalisation' : 'demande')
  const [chargement, setChargement] = useState(searchParams.get('paiement') !== 'succes')
  const [transfert, setTransfert] = useState(null)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [confirmerRefus, setConfirmerRefus] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)

  async function consulter() {
    const { data, error } = await supabase.functions.invoke('transferer-propriete', {
      body: { action: 'consulter' },
    })
    if (error) setErreur(await messageErreur(error, data, 'Impossible de charger la demande. Réessayez.'))
    setTransfert(data?.transfert || null)
    setChargement(false)
  }

  // Le webhook Stripe finalise le transfert quelques secondes après le paiement.
  async function attendreFinalisation() {
    const { data: { user } } = await supabase.auth.getUser()
    for (let i = 0; i < 15 && user; i++) {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (data?.role === 'proprietaire') {
        if (chargerProfil) await chargerProfil()
        setEtape('termine')
        return
      }
      await new Promise(r => setTimeout(r, 2000))
    }
    setEtape('attente')
  }

  async function accepter() {
    setEnvoi(true)
    setErreur('')
    const { data, error } = await supabase.functions.invoke('transferer-propriete', {
      body: { action: 'accepter' },
    })
    setEnvoi(false)
    if (error || !data?.clientSecret) {
      setErreur(await messageErreur(error, data, "Le formulaire de paiement n'a pas pu s'ouvrir. Réessayez."))
      return
    }
    setClientSecret(data.clientSecret)
  }

  async function refuser() {
    setEnvoi(true)
    setErreur('')
    const { data, error } = await supabase.functions.invoke('transferer-propriete', {
      body: { action: 'refuser' },
    })
    setEnvoi(false)
    if (error) {
      setErreur(await messageErreur(error, data, "Le refus n'a pas pu être enregistré. Réessayez."))
      return
    }
    setEtape('refuse')
  }

  useEffect(() => {
    if (etape === 'finalisation') {
      navigate('/equipe/transfert', { replace: true })
      attendreFinalisation()
    } else {
      consulter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchClientSecret = useCallback(() => Promise.resolve(clientSecret), [clientSecret])

  if (chargement) {
    return (
      <div className="equipe-page">
        <div className="equipe-carte equipe-squelette equipe-squelette--haute" />
      </div>
    )
  }

  if (etape === 'finalisation' || etape === 'termine' || etape === 'attente') {
    return (
      <div className="equipe-page">
        <div className="equipe-centre">
          <i className={`ti ${etape === 'termine' ? 'ti-circle-check' : 'ti-loader-2'} equipe-icone-grande`}></i>
          <p className="equipe-centre-titre">
            {etape === 'termine' ? 'Vous êtes maintenant propriétaire' : 'Paiement confirmé'}
          </p>
          <p className="equipe-aide">
            {etape === 'termine' && "L'abonnement de la clinique est à votre nom. Vous pouvez gérer les membres et la facturation."}
            {etape === 'finalisation' && 'Le transfert est en cours, ça peut prendre quelques secondes...'}
            {etape === 'attente' && 'Le transfert prend un peu plus de temps que prévu. Revenez dans quelques minutes : il se fera automatiquement.'}
          </p>
        </div>
        {etape !== 'finalisation' && (
          <button
            className="equipe-btn-primaire"
            onClick={() => navigate(etape === 'termine' ? '/equipe/gestion' : '/equipe')}
          >
            {etape === 'termine' ? 'Gérer la clinique' : "Retour à l'équipe"}
          </button>
        )}
      </div>
    )
  }

  if (etape === 'refuse' || !transfert) {
    return (
      <div className="equipe-page">
        <div className="equipe-centre">
          <i className="ti ti-arrows-exchange equipe-icone-grande"></i>
          <p className="equipe-centre-titre">
            {etape === 'refuse' ? 'Demande refusée' : 'Aucune demande de transfert'}
          </p>
          <p className="equipe-aide">
            {etape === 'refuse'
              ? 'La personne qui a fait la demande en sera avisée. Rien ne change pour vous.'
              : 'Cette demande a peut-être expiré, été annulée ou déjà été traitée.'}
          </p>
        </div>
        {erreur && (
          <div className="equipe-message erreur">
            <i className="ti ti-alert-circle"></i><span>{erreur}</span>
          </div>
        )}
        <button className="equipe-btn-secondaire" onClick={() => navigate('/equipe')}>
          Retour à l'équipe
        </button>
      </div>
    )
  }

  const { nomDemandeur, nomEquipe, expireLe, sieges, premierPrelevement } = transfert

  return (
    <div className="equipe-page">
      <div className="equipe-centre">
        <i className="ti ti-arrows-exchange equipe-icone-grande"></i>
        <p className="equipe-centre-titre">{nomDemandeur} veut vous transférer {nomEquipe}</p>
        <p className="equipe-aide">
          En acceptant, vous deviendrez propriétaire de la clinique. {nomDemandeur} restera dans
          l'équipe comme admin.
        </p>
      </div>

      <div className="equipe-avertissement">
        <span className="equipe-carte-titre">Facturation</span>
        <p>
          L'abonnement Équipe{sieges ? ` (${sieges} sièges)` : ''} passera à votre nom.{' '}
          {premierPrelevement
            ? `Votre carte ne sera prélevée qu'à partir du ${premierPrelevement}, à la fin de la période déjà payée.`
            : "Votre carte sera prélevée dès l'acceptation."}
        </p>
      </div>

      <p className="equipe-aide" style={{ textAlign: 'center' }}>Cette demande expire le {expireLe}.</p>

      {erreur && (
        <div className="equipe-message erreur">
          <i className="ti ti-alert-circle"></i><span>{erreur}</span>
        </div>
      )}

      <div className="popup-actions-centrees">
        {confirmerRefus ? (
          <button className="equipe-btn-danger" style={{ flex: 1 }} onClick={refuser} disabled={envoi}>
            {envoi ? 'Envoi...' : 'Confirmer le refus'}
          </button>
        ) : (
          <button className="equipe-btn-secondaire" style={{ flex: 1 }} onClick={() => setConfirmerRefus(true)} disabled={envoi}>
            Refuser
          </button>
        )}
        <button className="equipe-btn-primaire" style={{ flex: 1 }} onClick={accepter} disabled={envoi}>
          {envoi && !confirmerRefus ? 'Chargement...' : 'Accepter et entrer ma carte'}
        </button>
      </div>

      {clientSecret && (
        <div className="popup-overlay" onClick={() => setClientSecret(null)}>
          <div className="profil-checkout-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <span>Devenir propriétaire de {nomEquipe}</span>
              <button className="popup-close" onClick={() => setClientSecret(null)}>✕</button>
            </div>
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      )}
    </div>
  )
}
