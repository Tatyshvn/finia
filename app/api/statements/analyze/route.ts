import { NextRequest, NextResponse } from "next/server"
import { analyzeStatementText } from "@/lib/services/groq"

interface AnalyzeRequestBody {
  text: string
  filename?: string
}

export async function POST(request: NextRequest) {
  let body: AnalyzeRequestBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "El body debe ser JSON con el campo 'text'" },
      { status: 400 }
    )
  }

  const { text, filename } = body

  if (!text || typeof text !== "string" || text.trim().length < 50) {
    return NextResponse.json(
      { error: "El campo 'text' está vacío o es demasiado corto" },
      { status: 400 }
    )
  }

  try {
    const data = await analyzeStatementText(text)

    return NextResponse.json({
      success: true,
      metadata: {
        filename: filename ?? "sin_nombre",
        caracteres_analizados: text.length,
        transacciones_encontradas: data.transacciones.length,
      },
      data
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Límite de Groq alcanzado. Intenta en unos minutos." },
        { status: 429 }
      )
    }

    const message = error instanceof Error ? error.message : "Error interno"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}