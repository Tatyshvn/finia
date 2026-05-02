import { NextRequest, NextResponse } from "next/server"
import { extractTextFromPdf, validatePdfFile } from "@/lib/services/pdf"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const files = formData.getAll("files") as File[]

  if (!files.length) {
    return NextResponse.json(
      { error: "No se recibieron archivos" },
      { status: 400 }
    )
  }

  const validationError = validatePdfFile(files[0])
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 415 })
  }

  try {
    const results = await Promise.all(files.map(extractTextFromPdf))
    return NextResponse.json({ results })
  } catch (error: unknown) {
    console.error("[parse-pdf] error:", error)
    const message = error instanceof Error ? error.message : "Error al leer el PDF"
    return NextResponse.json({ error: message }, { status: 422 })
  }
}