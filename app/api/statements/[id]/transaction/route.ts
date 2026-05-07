import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Category, Transaction } from "@/types/statements"

const VALID_CATEGORIES: Category[] = [
  "alimentacion", "transporte", "entretenimiento", "salud", "educacion",
  "servicios", "vestimenta", "hogar", "viajes", "nomina", "transferencia",
  "inversiones", "impuestos", "seguros", "comisiones", "otros",
]

interface PatchBody {
  index: number
  categoria: Category
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 })
  }

  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const { index, categoria } = body
  if (typeof index !== "number" || index < 0) {
    return NextResponse.json({ error: "Índice inválido" }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(categoria)) {
    return NextResponse.json({ error: "Categoría inválida" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: row, error: fetchError } = await supabase
    .from("analyses")
    .select("transacciones")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !row) {
    return NextResponse.json({ error: "Análisis no encontrado" }, { status: 404 })
  }

  const transacciones = (row.transacciones ?? []) as unknown as Transaction[]
  if (index >= transacciones.length) {
    return NextResponse.json({ error: "Índice fuera de rango" }, { status: 400 })
  }

  const updated = transacciones.map((tx, i) =>
    i === index ? { ...tx, categoria, confianza: 1 } : tx
  )

  const { error: updateError } = await supabase
    .from("analyses")
    .update({ transacciones: updated as unknown as Record<string, unknown>[] })
    .eq("id", id)
    .eq("user_id", user.id)

  if (updateError) {
    console.error("[analyses] update failed:", updateError.message)
    return NextResponse.json({ error: "No se pudo actualizar la categoría" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
