import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

/* Produit dist/sw.js à partir de src/sw.js avec la liste des fichiers
   que l'app enregistre sur l'appareil dès l'installation : le code, les
   styles, les polices et les petites images. Les grandes images sont
   enregistrées la première fois qu'elles s'affichent. */
const EXTENSIONS_APP = /\.(html|js|css|svg|json|ico|woff2?)$/
const EXTENSIONS_IMAGES = /\.(png|jpe?g|webp|gif)$/
const TAILLE_MAX_IMAGE = 60 * 1024
// Utilisées par l'export PDF (src/lib/pdfadjuvet.js).
const POLICES_PDF = ['/fonts/Gilroy-Regular.ttf', '/fonts/Gilroy-SemiBold.ttf']

function listerFichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom)
    return statSync(chemin).isDirectory() ? listerFichiers(chemin) : [chemin]
  })
}

function serviceWorker() {
  let racine
  let dossierSortie
  return {
    name: 'adjuvet-service-worker',
    apply: 'build',
    configResolved(config) {
      racine = config.root
      dossierSortie = resolve(config.root, config.build.outDir)
    },
    closeBundle(erreur) {
      /* Si la compilation a échoué, dist n'existe pas : on s'arrête pour
         laisser paraître la vraie cause (ex. un fichier introuvable). */
      if (erreur || !existsSync(join(dossierSortie, 'index.html'))) return
      const fichiers = listerFichiers(dossierSortie)
        .map((chemin) => ({ chemin, adresse: '/' + relative(dossierSortie, chemin).split(sep).join('/') }))
        .filter(({ chemin, adresse }) => adresse !== '/sw.js' && (
          EXTENSIONS_APP.test(adresse)
          || POLICES_PDF.includes(adresse)
          || (EXTENSIONS_IMAGES.test(adresse) && statSync(chemin).size <= TAILLE_MAX_IMAGE)
        ))
        .sort((a, b) => a.adresse.localeCompare(b.adresse))

      // La version change seulement si un fichier change : sinon, pas de nouveau téléchargement.
      const empreinte = createHash('sha256')
      for (const { chemin, adresse } of fichiers) empreinte.update(adresse).update(readFileSync(chemin))
      const version = empreinte.digest('hex').slice(0, 12)

      const source = readFileSync(resolve(racine, 'src/sw.js'), 'utf8')
      const remplacements = [
        ["const VERSION = 'dev'", `const VERSION = '${version}'`],
        ['const FICHIERS = []', `const FICHIERS = ${JSON.stringify(fichiers.map((f) => f.adresse))}`],
      ]
      let resultat = source
      for (const [avant, apres] of remplacements) {
        if (!resultat.includes(avant)) throw new Error(`src/sw.js : « ${avant} » introuvable`)
        resultat = resultat.replace(avant, apres)
      }
      writeFileSync(join(dossierSortie, 'sw.js'), resultat)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serviceWorker()],
})
