/* Pastille d'un membre de la clinique : sa photo, sinon ses initiales
   sur une couleur pastel qui reste la même pour chaque personne. */
const COULEURS_MEMBRES = ['#BBE6D5', '#F8F6B8', '#D3DBF4', '#E3D9F5']

function initiales(nom) {
  const mots = (nom || '').trim().split(/\s+/).filter(Boolean)
  if (mots.length === 0) return '?'
  return ((mots[0][0] || '') + (mots.length > 1 ? mots[mots.length - 1][0] : '')).toUpperCase()
}

export default function PastilleMembre({ userId, nom, avatarUrl, taille = 32 }) {
  let somme = 0
  for (const c of String(userId || nom || '')) somme = (somme * 31 + c.charCodeAt(0)) % 1000003
  return (
    <span
      className="pastille-membre"
      title={nom || undefined}
      style={{
        background: COULEURS_MEMBRES[somme % COULEURS_MEMBRES.length],
        width: taille,
        height: taille,
        fontSize: Math.round(taille * 0.375),
      }}
    >
      {avatarUrl ? <img src={avatarUrl} alt="" /> : initiales(nom)}
    </span>
  )
}
