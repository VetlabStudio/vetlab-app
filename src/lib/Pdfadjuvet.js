import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/* ═══════════════════════════════════════════════════════════
   GABARIT PDF ADJUVET
   Mise en page commune à toutes les pages qui génèrent un PDF.
   À placer dans src/lib/pdfAdjuvet.js
   ═══════════════════════════════════════════════════════════ */

export const COULEUR_PRIMAIRE = [33, 48, 88]
export const COULEUR_TEXTE = [43, 43, 43]
export const COULEUR_LABEL = [124, 133, 152]
export const COULEUR_TRAIT = [216, 220, 228]
export const COULEUR_ZEBRE = [244, 246, 249]
export const COULEUR_ROUGE = [155, 44, 44]
export const MARGE = 14
export const MARGE_SUITE = 26

/* ─── POLICES ───────────────────────────────────────────────
   jsPDF ne lit pas le .woff : il faut Gilroy-Regular.ttf et
   Gilroy-SemiBold.ttf dans /public/fonts. Sans eux, Helvetica. */
function octetsEnBase64(buffer) {
  let binaire = ''
  const octets = new Uint8Array(buffer)
  const tranche = 0x8000
  for (let i = 0; i < octets.length; i += tranche) {
    binaire += String.fromCharCode.apply(null, octets.subarray(i, i + tranche))
  }
  return btoa(binaire)
}

async function chargerPolices(doc) {
  const fichiers = [
    { url: '/fonts/Gilroy-Regular.ttf', style: 'normal' },
    { url: '/fonts/Gilroy-SemiBold.ttf', style: 'bold' },
  ]
  try {
    for (const f of fichiers) {
      const res = await fetch(f.url)
      if (!res.ok) return 'helvetica'
      const nom = f.url.split('/').pop()
      doc.addFileToVFS(nom, octetsEnBase64(await res.arrayBuffer()))
      doc.addFont(nom, 'Gilroy', f.style)
    }
    return 'Gilroy'
  } catch {
    return 'helvetica'
  }
}

/* ─── LOGOS ─────────────────────────────────────────────────
   jsPDF ne place pas de SVG : on rastérise avant. */
export async function chargerSvgEnPng(url, largeurPx = 360) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    let texte = await res.text()
    if (!/<svg[^>]*\swidth\s*=/.test(texte)) {
      const vb = texte.match(/viewBox\s*=\s*"([-\d.\s,]+)"/)
      if (vb) {
        const bouts = vb[1].trim().split(/[\s,]+/).map(Number)
        if (bouts.length === 4) texte = texte.replace('<svg', `<svg width="${bouts[2]}" height="${bouts[3]}"`)
      }
    }
    const blob = new Blob([texte], { type: 'image/svg+xml;charset=utf-8' })
    const urlObjet = URL.createObjectURL(blob)
    try {
      const img = await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = urlObjet
      })
      const ratio = img.width ? img.height / img.width : 1
      const canvas = document.createElement('canvas')
      canvas.width = largeurPx
      canvas.height = Math.max(1, Math.round(largeurPx * ratio))
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      return { dataUrl: canvas.toDataURL('image/png'), ratio }
    } finally {
      URL.revokeObjectURL(urlObjet)
    }
  } catch {
    return null
  }
}

/* Charge n'importe quelle image (SVG, PNG, JPG) en dataURL.
   On passe par fetch plutôt que par une balise img distante,
   ce qui évite les problèmes de canvas contaminé. */
export async function chargerImage(url) {
  console.log('[logo] url reçue :', url)
  if (!url) return null
  if (/\.svg(\?|$)/i.test(url)) {
    const resultat = await chargerSvgEnPng(url, 600)
    console.log('[logo] branche SVG →', resultat ? 'ok' : 'échec')
    return resultat
  }
  try {
    const res = await fetch(url)
    console.log('[logo] fetch', res.status, res.headers.get('content-type'))
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = dataUrl
    })
    console.log('[logo] image chargée', img.width, 'x', img.height)
    return { dataUrl, ratio: img.width ? img.height / img.width : 1 }
  } catch (e) {
    console.warn('[logo] échec :', e)
    return null
  }
}

/* ─── TEXTE ─────────────────────────────────────────────────
   Gilroy n'a pas les chiffres en indice : O₂ deviendrait « O ». */
const INDICES = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
}

export function texteSansIndice(valeur) {
  if (valeur == null) return valeur
  if (typeof valeur === 'object') {
    return valeur.content != null ? { ...valeur, content: texteSansIndice(valeur.content) } : valeur
  }
  return String(valeur).replace(/[₀-₉]/g, c => INDICES[c] || c)
}

export function dureeEntre(debut, fin) {
  if (!debut || !fin) return null
  const [h1, m1] = String(debut).split(':').map(Number)
  const [h2, m2] = String(fin).split(':').map(Number)
  if ([h1, m1, h2, m2].some(n => isNaN(n))) return null
  let minutes = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (minutes < 0) minutes += 24 * 60
  return minutes
}

export function formaterMinutes(minutes) {
  if (minutes == null) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`
}

/* ─── DOCUMENT ──────────────────────────────────────────── */
export async function creerDocument({ titre, sousTitre, date, clinique, logoClinique }) {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' })
  const police = await chargerPolices(doc)
  const symbole = await chargerSvgEnPng('/logo-symbol.svg', 300)
  const logo = await chargerSvgEnPng('/logo-adjuvet.svg', 400)
  const logoDeLaClinique = await chargerImage(logoClinique)
  console.log('[logo] résultat final :', logoDeLaClinique ? 'logo de clinique utilisé' : 'null, on retombe sur le symbole Adjuvet')
  const largeurPage = doc.internal.pageSize.getWidth()
  const hauteurPage = doc.internal.pageSize.getHeight()

  const ctx = {
    doc, police, symbole, logo, titre, date,
    largeurPage, hauteurPage,
    largeurUtile: largeurPage - MARGE * 2,
    y: MARGE,
  }

  /* Le logo de la clinique remplace le symbole Adjuvet en haut
     de la première page. Contraint en hauteur, puis en largeur
     pour que les logos très allongés ne mangent pas le titre. */
  const taille = 14
  let largeurLogo = 0
  if (logoDeLaClinique) {
    const ratio = logoDeLaClinique.ratio || 1
    let h = taille
    let l = h / ratio
    if (l > 45) { l = 45; h = l * ratio }
    doc.addImage(logoDeLaClinique.dataUrl, 'PNG', MARGE, ctx.y + (taille - h) / 2, l, h)
    largeurLogo = l
  } else if (symbole) {
    doc.addImage(symbole.dataUrl, 'PNG', MARGE, ctx.y, taille, taille * symbole.ratio)
    largeurLogo = taille
  }
  const xTitre = largeurLogo ? MARGE + largeurLogo + 5 : MARGE

  doc.setFont(police, 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...COULEUR_PRIMAIRE)
  doc.text(titre, xTitre, ctx.y + 6)

  if (sousTitre) {
    doc.setFont(police, 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...COULEUR_LABEL)
    doc.text(sousTitre, xTitre, ctx.y + 10.5)
  }

  if (date) {
    doc.setFont(police, 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...COULEUR_TEXTE)
    doc.text(date, largeurPage - MARGE, ctx.y + 5, { align: 'right' })
  }
  if (clinique) {
    doc.setFont(police, 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...COULEUR_LABEL)
    doc.text(clinique, largeurPage - MARGE, ctx.y + 9.5, { align: 'right' })
  }

  ctx.y += 16
  doc.setDrawColor(...COULEUR_PRIMAIRE)
  doc.setLineWidth(0.5)
  doc.line(MARGE, ctx.y, largeurPage - MARGE, ctx.y)
  ctx.y += 5

  return ctx
}

export function bandeauPatient(ctx, nom, signalement) {
  const { doc, police, largeurPage } = ctx
  const hauteur = 13
  doc.setFillColor(238, 241, 246)
  doc.rect(MARGE, ctx.y, ctx.largeurUtile, hauteur, 'F')
  doc.setFillColor(...COULEUR_PRIMAIRE)
  doc.rect(MARGE, ctx.y, 1.2, hauteur, 'F')
  doc.setFont(police, 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...COULEUR_PRIMAIRE)
  doc.text(texteSansIndice(nom || '—'), MARGE + 4, ctx.y + 5.8)
  doc.setFont(police, 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COULEUR_TEXTE)
  doc.text(texteSansIndice(signalement || '—'), MARGE + 4, ctx.y + 10.5, { maxWidth: ctx.largeurUtile - 8 })
  ctx.y += hauteur + 5
  return largeurPage
}

export function espace(ctx, besoin) {
  if (ctx.y + besoin > ctx.hauteurPage - 24) {
    ctx.doc.addPage()
    ctx.y = MARGE_SUITE
  }
}

export function titreSection(ctx, texte, note, hauteurContenu = 0) {
  const { doc, police, largeurPage } = ctx
  espace(ctx, 14 + hauteurContenu)
  ctx.y += 2
  doc.setFont(police, 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COULEUR_PRIMAIRE)
  doc.text(texte.toUpperCase(), MARGE, ctx.y)
  if (note) {
    doc.setFont(police, 'normal')
    doc.setTextColor(...COULEUR_LABEL)
    doc.text(note, largeurPage - MARGE, ctx.y, { align: 'right' })
  }
  ctx.y += 1.6
  doc.setDrawColor(...COULEUR_TRAIT)
  doc.setLineWidth(0.3)
  doc.line(MARGE, ctx.y, largeurPage - MARGE, ctx.y)
  ctx.y += 4.5
}

export function hauteurGrille(paires) {
  return Math.ceil(paires.length / 2) * 5 + 4
}

export function grille(ctx, paires) {
  const { doc, police } = ctx
  const lignes = []
  for (let i = 0; i < paires.length; i += 2) {
    const a = paires[i]
    const b = paires[i + 1]
    lignes.push([
      texteSansIndice(a[0]),
      texteSansIndice(a[1] || '—'),
      b ? texteSansIndice(b[0]) : '',
      b ? texteSansIndice(b[1] || '—') : '',
    ])
  }
  autoTable(doc, {
    startY: ctx.y,
    body: lignes,
    theme: 'plain',
    pageBreak: 'avoid',
    rowPageBreak: 'avoid',
    margin: { left: MARGE, right: MARGE, top: MARGE_SUITE },
    styles: {
      font: police, fontSize: 9, valign: 'top', textColor: COULEUR_TEXTE,
      cellPadding: { top: 0.7, bottom: 0.7, left: 0, right: 2 },
    },
    columnStyles: {
      0: { cellWidth: 30, fontSize: 8, textColor: COULEUR_LABEL },
      1: { cellWidth: 62 },
      2: { cellWidth: 30, fontSize: 8, textColor: COULEUR_LABEL },
      3: { cellWidth: 'auto' },
    },
  })
  ctx.y = doc.lastAutoTable.finalY + 7
}

export function sectionGrille(ctx, titre, paires, note) {
  titreSection(ctx, titre, note, hauteurGrille(paires))
  grille(ctx, paires)
}

export function tableau(ctx, { head, body, columnStyles, hauteurEstimee }) {
  const { doc, police } = ctx
  if (hauteurEstimee) espace(ctx, hauteurEstimee)
  autoTable(doc, {
    startY: ctx.y,
    head: head ? [head.map(texteSansIndice)] : undefined,
    body: body.map(ligne => ligne.map(texteSansIndice)),
    margin: { left: MARGE, right: MARGE, top: MARGE_SUITE },
    styles: {
      font: police, fontSize: 8, cellPadding: 1.6,
      textColor: COULEUR_TEXTE, lineColor: COULEUR_TRAIT, lineWidth: 0.1,
    },
    headStyles: { fillColor: COULEUR_PRIMAIRE, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: COULEUR_ZEBRE },
    columnStyles: columnStyles || {},
  })
  ctx.y = doc.lastAutoTable.finalY + 6
}

export function sectionTableau(ctx, titre, options, note) {
  const lignes = Math.min(options.body.length, 6)
  titreSection(ctx, titre, note, lignes * 5.5 + 8)
  tableau(ctx, options)
}

/* ─── ENTÊTES DE SUITE ET PIEDS DE PAGE ─────────────────── */
export function finaliser(ctx, { sujet } = {}) {
  const { doc, police, symbole, logo, largeurPage, hauteurPage } = ctx
  const nbPages = doc.internal.getNumberOfPages()

  for (let p = 1; p <= nbPages; p++) {
    doc.setPage(p)

    if (p > 1) {
      if (symbole) doc.addImage(symbole.dataUrl, 'PNG', MARGE, MARGE - 1, 7, 7 * symbole.ratio)
      doc.setFont(police, 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(...COULEUR_PRIMAIRE)
      doc.text(
        [ctx.titre, sujet].filter(Boolean).join(' · '),
        symbole ? MARGE + 10 : MARGE,
        MARGE + 4
      )
      doc.setFont(police, 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...COULEUR_LABEL)
      doc.text('suite', largeurPage - MARGE, MARGE + 4, { align: 'right' })
      doc.setDrawColor(...COULEUR_TRAIT)
      doc.setLineWidth(0.3)
      doc.line(MARGE, MARGE + 7, largeurPage - MARGE, MARGE + 7)
    }

    const yPied = hauteurPage - 17
    doc.setDrawColor(...COULEUR_TRAIT)
    doc.setLineWidth(0.3)
    doc.line(MARGE, yPied, largeurPage - MARGE, yPied)
    if (logo) doc.addImage(logo.dataUrl, 'PNG', MARGE, yPied + 2.5, 16, 16 * logo.ratio)
    const xPied = logo ? MARGE + 19 : MARGE
    doc.setFont(police, 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...COULEUR_LABEL)
    doc.text("Ce PDF a été généré avec l'aide de l'application Adjuvet par Vetlab Studio, adjuvet.app", xPied, yPied + 5)
    doc.text("Document d'aide au travail clinique. Le jugement du vétérinaire responsable prime en tout temps.", xPied, yPied + 8.5)
    doc.text(`${p} / ${nbPages}`, largeurPage - MARGE, yPied + 5, { align: 'right' })
  }
}

export function ouvrir(ctx) {
  const url = ctx.doc.output('bloburl')
  window.open(url, '_blank')
}