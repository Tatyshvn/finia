import { NextRequest, NextResponse } from "next/server"
import { normalizeConceptNames } from "@/lib/services/groq"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  let concepts: string[]
  try {
    const body = await request.json()
    concepts = body.concepts
    if (!Array.isArray(concepts) || concepts.length === 0) throw new Error()
  } catch {
    return NextResponse.json({ error: "Body inválido: se esperaba { concepts: string[] }" }, { status: 400 })
  }

  try {
    const mapping = await normalizeConceptNames(concepts)
    return NextResponse.json({ mapping })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
