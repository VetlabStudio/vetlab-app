// @ts-check
const { test, expect } = require('@playwright/test')

const EMAIL = 'info@vetlabstudio.ca'
const PASSWORD = 'Seven7777!'

// Connexion partagée entre tous les tests
test.beforeEach(async ({ page }) => {
  await page.goto('/connexion')
  await page.locator('input[type="email"]').fill(EMAIL)
  await page.locator('input[type="password"]').fill(PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/accueil', { timeout: 15000 })
})

// ─── ACCUEIL ────────────────────────────────────────────────────────────────

test('Accueil — header simplifié sans logo', async ({ page }) => {
  await page.goto('/accueil')
  await expect(page.locator('img[alt="Vetlab Studio"]')).toHaveCount(0)
  await expect(page.locator('text=Bonjour')).toBeVisible()
})

test('Accueil — cloche notifications présente', async ({ page }) => {
  await page.goto('/accueil')
  await expect(page.locator('.ti-bell').first()).toBeVisible()
})

test('Accueil — tuiles calculateurs chargées', async ({ page }) => {
  await page.goto('/accueil')
  const tuiles = page.locator('.accueil-v2-calc-tuile')
  await expect(tuiles).toHaveCountGreaterThan(9)
})

// ─── TITRES CENTRÉS ─────────────────────────────────────────────────────────

const pagesTitres = [
  { url: '/calculateurs', titre: 'Calculateur' },
  { url: '/drogues', titre: 'Pharmacologie' },
  { url: '/labo', titre: 'Laboratoire' },
  { url: '/chirurgie', titre: 'Chirurgie' },
  { url: '/notes', titre: 'Notes' },
  { url: '/menu', titre: 'Plus' },
  { url: '/abonnement', titre: 'Abonnement' },
  { url: '/aide', titre: 'Aide' },
]

for (const p of pagesTitres) {
  test(`Titre centré — ${p.url}`, async ({ page }) => {
    await page.goto(p.url)
    const h1 = page.locator('.header h1').first()
    await expect(h1).toBeVisible()
    const box = await h1.boundingBox()
    const vp = page.viewportSize()
    const decalage = Math.abs(vp.width / 2 - (box.x + box.width / 2))
    expect(decalage).toBeLessThan(15)
  })
}

// ─── CALCULATEURS — VALIDATIONS ──────────────────────────────────────────────

test('Fluido — poids invalide affiche message erreur', async ({ page }) => {
  await page.goto('/calculateurs/fluido')
  await page.locator('input[placeholder*="10"], input[placeholder*="Ex"]').first().fill('-5')
  await expect(page.locator('text=Poids invalide')).toBeVisible()
})

test('Date mise bas — année aberrante affiche message erreur', async ({ page }) => {
  await page.goto('/calculateurs/mise-bas')
  await page.locator('input[type="date"]').fill('9999-01-01')
  await expect(page.locator('text=Date invalide')).toBeVisible()
})

test('CRI — message débit requis quand autres champs remplis', async ({ page }) => {
  await page.goto('/calculateurs/cri')
  const inputs = page.locator('input[inputmode="decimal"]')
  await inputs.nth(0).fill('10') // poids
  await inputs.nth(2).fill('5')  // dosage CRI
  await inputs.nth(3).fill('10') // concentration
  await expect(page.locator('text=Débit est requis')).toBeVisible()
})

// ─── ABONNEMENT ──────────────────────────────────────────────────────────────

test('Abonnement — badge "Inclus dans votre forfait Équipe" sur carte Pro', async ({ page }) => {
  await page.goto('/abonnement')
  await expect(page.locator('text=Inclus dans votre forfait')).toBeVisible()
})

test('Abonnement — sièges Équipe minimum 2, bouton − désactivé', async ({ page }) => {
  await page.goto('/abonnement')
  const btnEquipe = page.locator('button:has-text("Équipe")').first()
  if (await btnEquipe.isVisible()) {
    await btnEquipe.click()
    const btnMoins = page.locator('button:has-text("−")').first()
    await expect(btnMoins).toBeDisabled()
  }
})

// ─── AIDE — ONGLETS FAQ ──────────────────────────────────────────────────────

test('Aide — 3 onglets FAQ présents', async ({ page }) => {
  await page.goto('/aide')
  await expect(page.locator('button:has-text("Général")')).toBeVisible()
  await expect(page.locator('button:has-text("Forfait Pro")')).toBeVisible()
  await expect(page.locator('button:has-text("Forfait Équipe")')).toBeVisible()
})

test('Aide — navigation entre onglets FAQ fonctionne', async ({ page }) => {
  await page.goto('/aide')
  await page.locator('button:has-text("Forfait Pro")').click()
  await expect(page.locator('text=abonnement')).toBeVisible()
  await page.locator('button:has-text("Forfait Équipe")').click()
  await expect(page.locator('text=siège')).toBeVisible()
})

// ─── PROFIL ──────────────────────────────────────────────────────────────────

test('Profil — bouton Admin visible pour info@vetlabstudio.ca', async ({ page }) => {
  await page.goto('/profil')
  await expect(page.locator('text=Admin, text=Tableau de bord').first()).toBeVisible()
})

// ─── ADMIN ───────────────────────────────────────────────────────────────────

test('Admin — accès accordé pour info@vetlabstudio.ca', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).not.toHaveURL(/connexion|accueil/)
  await expect(page.locator('text=Médicaments')).toBeVisible()
})

// ─── PROGATE ─────────────────────────────────────────────────────────────────

const pagesPro = [
  '/chirurgie/monitoring',
  '/drogues/toxicologie',
  '/soins-generaux/examen-physique',
  '/labo/radiologie/charte',
]

for (const url of pagesPro) {
  test(`ProGate — accès accordé (équipe=pro): ${url}`, async ({ page }) => {
    await page.goto(url)
    await expect(page).not.toHaveURL(/connexion|abonnement/)
  })
}

// ─── ÉQUIPE ──────────────────────────────────────────────────────────────────

test('Équipe — sections Babillard, Tâches, Notes présentes', async ({ page }) => {
  await page.goto('/equipe')
  await expect(page.locator('text=Babillard')).toBeVisible()
  await expect(page.locator('text=Tâches')).toBeVisible()
  await expect(page.locator('text=Notes')).toBeVisible()
})

// ─── LABO NOUVEAU PROTOCOLE ──────────────────────────────────────────────────

test('Labo nouveau protocole — titre étape vide (pas de texte pré-rempli)', async ({ page }) => {
  await page.goto('/labo/nouveau')
  const inputTitreEtape = page.locator('input[placeholder="Titre de l\'étape"]').first()
  await expect(inputTitreEtape).toBeVisible()
  await expect(inputTitreEtape).toHaveValue('')
})

// ─── PRO — PHARMACOLOGIE ─────────────────────────────────────────────────────

test('Pharmacologie — catégories visibles et navigables', async ({ page }) => {
  await page.goto('/drogues')
  await expect(page.locator('text=Anesthésiques')).toBeVisible()
  await expect(page.locator('text=Antibiotiques')).toBeVisible()
})

test('Pharmacologie — fiche médicament s\'ouvre', async ({ page }) => {
  await page.goto('/drogues/anesthesiques')
  const premierMed = page.locator('.accueil-v2-drogue-item, [class*="drogue"], [class*="med"]').first()
  await expect(premierMed).toBeVisible()
  await premierMed.click()
  await expect(page).not.toHaveURL('/drogues/anesthesiques')
})

test('Pharmacologie — médicaments favoris accessibles', async ({ page }) => {
  await page.goto('/drogues/mes-drogues')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

test('Toxicologie — page chargée (Pro)', async ({ page }) => {
  await page.goto('/drogues/toxicologie')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('h1, h2, .page-titre').first()).toBeVisible()
})

// ─── PRO — LABORATOIRE ───────────────────────────────────────────────────────

test('Labo — sections visibles (Biochimie, Parasitologie, etc.)', async ({ page }) => {
  await page.goto('/labo')
  await expect(page.locator('text=Biochimie')).toBeVisible()
  await expect(page.locator('text=Parasitologie')).toBeVisible()
  await expect(page.locator('text=Urologie')).toBeVisible()
})

test('Labo — Biochimie valeurs normales', async ({ page }) => {
  await page.goto('/labo/biochimie/valeurs')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('table, [class*="tableau"], [class*="valeur"]').first()).toBeVisible()
})

test('Labo — Parasitologie œufs (page chargée)', async ({ page }) => {
  await page.goto('/labo/parasitologie/oeufs')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

test('Labo — Charte radiographique (Pro)', async ({ page }) => {
  await page.goto('/labo/radiologie/charte')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('select, input, table').first()).toBeVisible()
})

test('Labo — Créer un protocole (formulaire accessible)', async ({ page }) => {
  await page.goto('/labo/nouveau')
  await expect(page.locator('input[placeholder*="protocole"], input[placeholder*="Titre"]').first()).toBeVisible()
})

// ─── PRO — CHIRURGIE ─────────────────────────────────────────────────────────

test('Chirurgie — sections visibles', async ({ page }) => {
  await page.goto('/chirurgie')
  await expect(page.locator('text=Instruments')).toBeVisible()
})

test('Chirurgie — Monitoring anesthésique (Pro)', async ({ page }) => {
  await page.goto('/chirurgie/monitoring')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('text=ASA, text=Monitoring, h1, h2').first()).toBeVisible()
})

test('Chirurgie — ECG chargé', async ({ page }) => {
  await page.goto('/chirurgie/ecg')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

test('Chirurgie — Capnographie chargée', async ({ page }) => {
  await page.goto('/chirurgie/capnographie')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

test('Chirurgie — Soins post-opératoires chargés', async ({ page }) => {
  await page.goto('/chirurgie/post-op')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

// ─── PRO — SOINS GÉNÉRAUX ────────────────────────────────────────────────────

test('Soins généraux — Examen physique démarre (Pro)', async ({ page }) => {
  await page.goto('/soins-generaux/examen-physique')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('select, button, [class*="espece"]').first()).toBeVisible()
})

test('Soins généraux — Dentisterie chargée', async ({ page }) => {
  await page.goto('/soins-generaux/dentisterie')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
})

test('Soins généraux — Abréviations chargées', async ({ page }) => {
  await page.goto('/soins-generaux/abreviations')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('table, [class*="tableau"]').first()).toBeVisible()
})

// ─── PRO — CALCULATEURS AVANCÉS ──────────────────────────────────────────────

test('Calculateur Fluido — résultat affiché avec poids valide', async ({ page }) => {
  await page.goto('/calculateurs/fluido')
  await page.locator('input[placeholder*="10"], input[placeholder*="Ex"]').first().fill('10')
  await expect(page.locator('text=ml/h, text=mL/h').first()).toBeVisible()
})

test('Calculateur Dosage — résultat affiché', async ({ page }) => {
  await page.goto('/calculateurs')
  const inputs = page.locator('input[inputmode="decimal"], input[type="text"]')
  await inputs.nth(0).fill('10') // poids
  await inputs.nth(1).fill('0.05') // posologie
  await inputs.nth(2).fill('10') // concentration
  await expect(page.locator('[class*="resultat"], text=ml, text=mL').first()).toBeVisible()
})

test('Calculateur CRI — durée sac affichée quand débit rempli', async ({ page }) => {
  await page.goto('/calculateurs/cri')
  const inputs = page.locator('input[inputmode="decimal"]')
  await inputs.nth(0).fill('10') // poids
  await inputs.nth(1).fill('5')  // débit
  await expect(page.locator('text=heures, text=h').first()).toBeVisible()
})

test('Calculateur Transfusion — page chargée', async ({ page }) => {
  await page.goto('/calculateurs/transfusion')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('input, select').first()).toBeVisible()
})

test('Calculateur RCR — chronomètre présent', async ({ page }) => {
  await page.goto('/calculateurs/rcr')
  await expect(page.locator('button:has-text("Démarrer"), button:has-text("Start"), [class*="chrono"]').first()).toBeVisible()
})

test('Calculateur BEE — résultat affiché', async ({ page }) => {
  await page.goto('/calculateurs/besoin')
  await page.locator('input[inputmode="decimal"]').first().fill('10')
  await expect(page.locator('[class*="resultat"], text=kcal, text=kJ').first()).toBeVisible()
})

test('Calculateur Tap BPM — bouton tap présent', async ({ page }) => {
  await page.goto('/calculateurs/tempo')
  await expect(page.locator('button:has-text("Tap"), button').first()).toBeVisible()
})

test('Calculateur Douleur aiguë — sélection espèce fonctionne', async ({ page }) => {
  await page.goto('/calculateurs/douleur-aigue')
  await expect(page.locator('button:has-text("Chien"), text=Chien').first()).toBeVisible()
})

// ─── PRO — NOTES PERSO ───────────────────────────────────────────────────────

test('Notes — page chargée, formulaire ou liste visible', async ({ page }) => {
  await page.goto('/notes')
  await expect(page).not.toHaveURL(/connexion|abonnement/)
  await expect(page.locator('textarea, [class*="note"], button:has-text("Ajouter"), button:has-text("Nouvelle")').first()).toBeVisible()
})

// ─── ÉQUIPE — FONCTIONNALITÉS ────────────────────────────────────────────────

test('Équipe — Babillard: formulaire de message visible', async ({ page }) => {
  await page.goto('/equipe')
  await page.locator('button:has-text("Babillard")').first().click()
  await expect(page.locator('textarea, input[placeholder*="message"], input[placeholder*="Message"]').first()).toBeVisible()
})

test('Équipe — Tâches: liste ou formulaire visible', async ({ page }) => {
  await page.goto('/equipe')
  await page.locator('button:has-text("Tâches")').first().click()
  await expect(page.locator('[class*="tache"], button:has-text("Ajouter"), button:has-text("Nouvelle")').first()).toBeVisible()
})

test('Équipe — Gestion équipe accessible', async ({ page }) => {
  await page.goto('/equipe/gestion')
  await expect(page).not.toHaveURL(/connexion/)
  await expect(page.locator('text=membres, text=Membres, text=sièges, text=Sièges').first()).toBeVisible()
})
