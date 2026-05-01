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

const NORMALIZE_PROMPT = `Eres un normalizador de nombres de comercios y conceptos en transacciones bancarias mexicanas.
Recibirás una lista de descripciones de transacciones (campo "concepts") y debes devolver ÚNICAMENTE un JSON válido con el mapeo de cada descripción a un nombre comercial limpio y reconocible.

Reglas:
- Elimina códigos internos, números de sucursal, referencias y ruido: "OXXO SUC 1234 MTY" → "OXXO"
- Identifica el comercio real detrás del texto: "COMPRA TARJETA 4512 SPOTIFY" → "Spotify"
- Agrupa variantes del mismo comercio bajo un solo nombre normalizado: "PAGO TELCEL MOVIL", "RECARGA TELCEL" → "Telcel"
- Para pagos de servicios bancarios sin comercio claro (SPEI, CoDi, transferencias) mantén una descripción corta y descriptiva: "Transferencia SPEI"
- Para gasolineras: "SER PEMEX EST 3421" → "Gasolinera PEMEX"
- Usa mayúsculas iniciales en el nombre normalizado
- No inventes categorías, solo normaliza el nombre del comercio/concepto
- Responde ÚNICAMENTE con este JSON, sin texto adicional:
{ "mapping": { "<descripcion_original>": "<nombre_normalizado>", ... } }`

export async function normalizeConceptNames(
  concepts: string[]
): Promise<Record<string, string>> {
  if (concepts.length === 0) return {}

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 2048,
    messages: [
      { role: "system", content: NORMALIZE_PROMPT },
      {
        role: "user",
        content: JSON.stringify({ concepts }),
      },
    ],
    response_format: { type: "json_object" },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error("Groq devolvió respuesta vacía")

  const parsed = JSON.parse(content) as { mapping: Record<string, string> }
  return parsed.mapping ?? {}
}

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