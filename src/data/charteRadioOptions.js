import { t } from '../lib/i18n'
// Valeurs enregistrées en français ; affichées avec t(region).
export const regions = [
  'Thorax',
  'Abdomen',
  'Épaule',
  'Humérus',
  'Coude',
  'Radius / ulna',
  'Carpe',
  'Main / doigts',
  'Bassin / hanche',
  'Fémur',
  'Genou / stifle',
  'Tibia / fibula',
  'Tarse',
  'Pied / doigts',
  'Colonne cervicale',
  'Colonne thoracique',
  'Colonne lombaire',
  'Colonne lombo-sacrée',
  'Crâne',
  'Mâchoire / dents',
  'Autre',
]

export const qualiteOptions = [
  { value: 'bon', label: t('Bon résultat') },
  { value: 'acceptable', label: t('Acceptable') },
  { value: 'a_ajuster', label: t('À ajuster') },
]
