import { PDFParse } from "pdf-parse"

export interface PdfFileResult {
  name: string
  pages: number
  text: string
}

export async function extractTextFromPdf(file: File): Promise<PdfFileResult> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const parser = new PDFParse({ data: buffer })
  const { text, total } = await parser.getText()
  await parser.destroy()

  if (!text || text.trim().length < 50) {
    throw new Error(
      "El PDF no contiene texto legible. Solo se aceptan PDFs digitales."
    )
  }

  return {
    name: file.name,
    pages: total,
    text: text.trim()
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