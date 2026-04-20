import Groq from "groq-sdk";
import type { ParsedStatement } from "@/types/statements"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `Eres un analizador experto de estados de cuenta bancarios mexicanos.
Extrae TODAS las transacciones del texto y responde ÚNICAMENTE con un JSON válido.

El JSON debe tener exactamente esta estructura:
{
  "resumen": {
    "banco": string,
    "titular": string | null,
    "numero_cuenta": string | null,
    "periodo_inicio": "YYYY-MM-DD",
    "periodo_fin": "YYYY-MM-DD",
    "saldo_inicial": number | null,
    "saldo_final": number | null,
    "total_cargos": number,
    "total_abonos": number,
    "moneda": "MXN"
  },
  "transacciones": [
    {
      "fecha": "YYYY-MM-DD",
      "descripcion": string,
      "comercio": string | null,
      "monto": number,
      "tipo": "cargo" | "abono" | "transferencia_enviada" | "transferencia_recibida" | "retiro" | "deposito" | "comision" | "interes" | "desconocido",
      "categoria": "alimentacion" | "transporte" | "entretenimiento" | "salud" | "educacion" | "servicios" | "ropa_calzado" | "hogar" | "viajes" | "nomina_ingreso" | "transferencia" | "inversiones" | "impuestos" | "seguros" | "comisiones_bancarias" | "otros",
      "confianza": number
    }
  ],
  "advertencias": string[]
}

Reglas:
- Montos siempre positivos; usa el campo "tipo" para indicar si es cargo o abono.
- "confianza" entre 0 y 1 según qué tan seguro estás de la categoría.
- OXXO, WALMART, SORIANA → "alimentacion". UBER, DIDI, PEMEX → "transporte". NETFLIX, SPOTIFY, CINEPOLIS → "entretenimiento".
- No incluyas texto fuera del JSON.`;

export async function analyzeStatementText(
  pdfText: string
): Promise<ParsedStatement> {
  const truncated = pdfText.slice(0, 80_000)

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 8192,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analiza este estado de cuenta:\n\n${truncated}`,
      },
    ],
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("Groq devolvió respuesta vacía")

  return JSON.parse(content) as ParsedStatement
}