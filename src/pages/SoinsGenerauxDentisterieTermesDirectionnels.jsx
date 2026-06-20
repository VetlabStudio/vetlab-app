const TERMES = [
  { terme: 'Apical', def: "Orienté vers l'apex ou la pointe de la racine de la dent." },
  { terme: 'Buccal', def: 'Surface externe de la dent du côté des joues (prémolaires, molaires).' },
  { terme: 'Caudal', def: "Vers l'arrière de la cavité buccale, après les prémolaires." },
  { terme: 'Coronal', def: 'En direction de la couronne de la dent, au-dessus de la gencive.' },
  { terme: 'Distal', def: "Surface de la dent éloignée de la ligne médiane de l'arcade, vers le fond." },
  { terme: 'Interproximal', def: 'Espace entre deux dents adjacentes, souvent difficile à nettoyer.' },
  { terme: 'Labial', def: 'Surface externe du côté des lèvres (incisives et canines).' },
  { terme: 'Lingual', def: 'Surface interne des dents du côté de la langue (mandibule).' },
  { terme: 'Mésial', def: "Surface de la dent proche de la ligne médiane, vers l'avant." },
  { terme: 'Occlusal', def: 'Surface masticatoire des prémolaires et molaires (face de contact).' },
  { terme: 'Palatin', def: 'Surface interne des dents du côté du palais (maxillaire).' },
  { terme: 'Rostral', def: 'En direction de la truffe (utilisé pour les structures antérieures à la bouche).' },
  { terme: 'Sous-gingival', def: 'Situé en dessous de la gencive, entre la racine et le sulcus.' },
  { terme: 'Supragingival', def: 'Situé au-dessus de la gencive, sur la partie visible de la dent.' },
]

export default function SoinsGenerauxDentisterieTermesDirectionnels() {
  return (
    <div className="labo-detail-page">

      <div className="labo-ref-section">
        <div className="labo-sediment-card">
          <img src="/terminologie-dentaire.png" alt="Terminologie dentaire" className="labo-charte-dentaire" />
        </div>
      </div>

      <div className="labo-ref-section">
        <div className="labo-ref-tableau">
          <div className="labo-ref-header labo-ref-header--2col-abrev">
            <span>Terme</span>
            <span>Définition</span>
          </div>
          {TERMES.map((item, i) => (
            <div key={i} className="labo-ref-ligne labo-ref-ligne--2col">
              <span className="labo-ref-normal">{item.terme}</span>
              <span>{item.def}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
