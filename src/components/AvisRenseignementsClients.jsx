// Rappel affiché en haut des notes et du babillard : ces champs libres
// ne doivent pas servir à conserver des renseignements sur les clients.
export default function AvisRenseignementsClients() {
  return (
    <p className="avis-renseignements">
      <i className="ti ti-shield-lock" aria-hidden="true"></i>
      <span>
        Par sécurité, n'inscrivez pas de renseignements personnels sur les clients (nom, téléphone, adresse).
        Utilisez plutôt le nom de l'animal ou un numéro de dossier.
      </span>
    </p>
  )
}
