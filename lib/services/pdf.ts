import { PDFParse } from "pdf-parse"
import path from "node:path"
import { extractTextFromPageImages } from "./groq"

const pdfjsRoot = path.join(process.cwd(), "node_modules", "pdfjs-dist")
const cMapUrl = path.join(pdfjsRoot, "cmaps") + path.sep
const standardFontDataUrl = path.join(pdfjsRoot, "standard_fonts") + path.sep

const MIN_CHARS_PER_PAGE = 40

export interface PdfFileResult {
  name: string
  pages: number
  text: string
}

export async function extractTextFromPdf(file: File): Promise<PdfFileResult> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const parser = new PDFParse({
    data: buffer,
    cMapUrl,
    cMapPacked: true,
    standardFontDataUrl,
  })

  try {
    const { pages, text, total } = await parser.getText()

    const emptyPages = pages.filter(p => (p.text?.trim().length ?? 0) < MIN_CHARS_PER_PAGE)
    const needsOcr = emptyPages.length > pages.length / 2

    if (!needsOcr && text && text.trim().length >= 50) {
      return { name: file.name, pages: total, text: text.trim() }
    }

    console.log(`[pdf] ${file.name}: ${emptyPages.length}/${pages.length} páginas vacías, fallback a OCR vision`)

    const screenshot = await parser.getScreenshot({ scale: 1.5, imageBuffer: false })
    console.log(`[pdf] screenshot generado: ${screenshot.pages.length} páginas, primer dataUrl: ${screenshot.pages[0]?.dataUrl?.slice(0, 50)}...`)

    const ocrText = await extractTextFromPageImages(
      screenshot.pages.map(p => p.dataUrl)
    )
    console.log(`[pdf] OCR completado: ${ocrText.length} chars`)

    if (!ocrText || ocrText.trim().length < 50) {
      throw new Error("El PDF no contiene texto legible. Solo se aceptan PDFs digitales.")
    }

    return { name: file.name, pages: total, text: ocrText.trim() }
  } finally {
    await parser.destroy()
  }
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Solo se aceptan archivos PDF";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "El archivo excede el límite de 10 MB"
  }
  return null
}
