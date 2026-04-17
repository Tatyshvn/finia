import { PDFParse } from 'pdf-parse'

export async function POST(request: Request) {
  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return Response.json({ error: 'No se recibieron archivos' }, { status: 400 })
  }

  const results = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const parser = new PDFParse({ data: buffer })
      const { text, total } = await parser.getText()
      await parser.destroy()
      return {
        name: file.name,
        pages: total,
        text: text.trim(),
      }
    })
  )

  return Response.json({ results })
}
