/* Sous le champ « Confirmer le mot de passe » : signale que les deux
   mots de passe diffèrent, peu importe la force du premier (à l'envoi,
   la force est vérifiée en premier et son message prenait toute la
   place).

   Pendant la saisie, rien ne s'affiche tant que la confirmation est le
   début exact du mot de passe. Une fois le champ quitté ou le
   formulaire envoyé (termine), toute différence est signalée. */
export default function CorrespondanceMotDePasse({ motDePasse, confirmation, termine }) {
  const differe = confirmation !== motDePasse
    && (termine || (confirmation !== '' && !motDePasse.startsWith(confirmation)))
  if (!differe) return null
  return (
    <div className="mdp-force">
      <p className="mdp-force-texte" role="alert">
        <i className="ti ti-alert-circle" aria-hidden="true" style={{ color: 'var(--accent-red)', marginRight: 6 }}></i>
        Les mots de passe ne correspondent pas.
      </p>
    </div>
  )
}
