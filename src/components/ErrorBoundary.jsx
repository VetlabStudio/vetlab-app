import { Component } from 'react'

// Après un déploiement, un vieux onglet peut demander des fichiers JS qui n'existent plus.
const ERREUR_CHARGEMENT = /dynamically imported module|Importing a module script failed|Loading chunk|Failed to fetch/i
const CLE_RECHARGE = 'erreur-chargement-recharge'

export default class ErrorBoundary extends Component {
  state = { erreur: null }

  static getDerivedStateFromError(erreur) {
    return { erreur }
  }

  componentDidCatch(erreur, info) {
    console.error('Erreur non gérée dans l\'application:', erreur, info?.componentStack)

    if (ERREUR_CHARGEMENT.test(erreur?.message || '')) {
      let dejaRecharge = false
      try { dejaRecharge = sessionStorage.getItem(CLE_RECHARGE) === '1' } catch { /* stockage bloqué */ }
      if (!dejaRecharge) {
        try { sessionStorage.setItem(CLE_RECHARGE, '1') } catch { /* stockage bloqué */ }
        window.location.reload()
      }
    }
  }

  render() {
    if (!this.state.erreur) return this.props.children

    return (
      <div className="auth2-page">
        <div className="auth2-contenu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 56, color: '#213058', marginBottom: 20 }}></i>
          <p className="auth2-section-titre" style={{ textAlign: 'center', fontSize: 22 }}>Oups, un problème est survenu</p>
          <p style={{ fontSize: 15, color: '#213058', textAlign: 'center', marginBottom: 12, lineHeight: 1.6 }}>
            L'application a rencontré une erreur. Rechargez pour continuer.
          </p>
          <p style={{ fontSize: 12, color: '#213058', opacity: 0.7, textAlign: 'center', marginBottom: 28, wordBreak: 'break-word' }}>
            Détail technique : {this.state.erreur?.message || String(this.state.erreur)}
          </p>
          <button
            type="button"
            className="auth2-btn"
            onClick={() => {
              try { sessionStorage.removeItem(CLE_RECHARGE) } catch { /* stockage bloqué */ }
              window.location.assign('/accueil')
            }}
          >
            Recharger l'application
          </button>
        </div>
      </div>
    )
  }
}
