import { t, enAnglais, locale } from './i18n'

/* Notifications « activité de la clinique » : un collègue a ajouté,
   modifié ou retiré un médicament ou un protocole de la clinique.
   La base enregistre les faits (donnees) ; le texte est composé ici,
   dans la langue de la personne qui lit. */

const CHAMPS = {
  nom: 'nom',
  voies: 'voies',
  especes: 'espèces',
  indication: 'indications',
  contre_indications: 'contre-indications',
  interactions: 'interactions',
  effets_secondaires: 'effets secondaires',
  notes: 'remarques',
  titre: 'titre',
  materiel: 'matériel',
  etapes: 'étapes',
}

function nombre(valeur) {
  const texte = String(valeur ?? '')
  return enAnglais ? texte : texte.replace(/\./g, ',')
}

function valeurAvecUnite(valeur, unite) {
  if (valeur === null || valeur === undefined || valeur === '') return t('aucune')
  return unite ? `${nombre(valeur)} ${unite}` : nombre(valeur)
}

function changement(libelle, avant, uniteAvant, apres, unite) {
  return t('{champ} {avant} → {apres}', {
    champ: t(libelle),
    avant: valeurAvecUnite(avant, uniteAvant),
    apres: valeurAvecUnite(apres, unite),
  })
}

export function texteActivite(d) {
  if (!d) return ''
  const nom = d.nom || ''

  if (d.objet === 'protocole') {
    if (d.action === 'ajout') return t('Protocole « {nom} » ajouté au labo de la clinique.', { nom })
    if (d.action === 'perso') return t('Protocole « {nom} » personnalisé pour la clinique.', { nom })
    if (d.action === 'retrait') return t('Protocole « {nom} » retiré du labo de la clinique.', { nom })
    const champs = (d.champs || []).map(c => t(CHAMPS[c] || c))
    return champs.length
      ? t('Protocole « {nom} » modifié : {changements}.', { nom, changements: champs.join(', ') })
      : t('Protocole « {nom} » modifié.', { nom })
  }

  if (d.action === 'ajout') return t('{nom} ajouté aux médicaments de la clinique.', { nom })
  if (d.action === 'perso') return t('{nom} personnalisé pour la clinique.', { nom })
  if (d.action === 'retrait') return t('{nom} retiré des médicaments de la clinique.', { nom })
  if (d.action === 'reinit') return t('{nom} : retour à la fiche de base.', { nom })

  const parties = []
  for (const c of d.champs || []) {
    if (c === 'dose') parties.push(changement('dose', d.dose_avant, d.unite_dose_avant, d.dose_apres, d.unite_dose))
    else if (c === 'concentration') parties.push(changement('concentration', d.conc_avant, d.unite_conc_avant, d.conc_apres, d.unite_conc))
    else parties.push(t(CHAMPS[c] || c))
  }
  return parties.length
    ? t('{nom} modifié : {changements}.', { nom, changements: parties.join(', ') })
    : t('{nom} modifié.', { nom })
}

/* « il y a 12 min », « hier », « 3 nov. » */
export function ilYa(date) {
  const ecart = (Date.now() - new Date(date).getTime()) / 1000
  if (!(ecart >= 0)) return ''
  if (ecart < 60) return t('à l\'instant')
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' })
  if (ecart < 3600) return rtf.format(-Math.floor(ecart / 60), 'minute')
  if (ecart < 86400) return rtf.format(-Math.floor(ecart / 3600), 'hour')
  if (ecart < 7 * 86400) return rtf.format(-Math.floor(ecart / 86400), 'day')
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}
