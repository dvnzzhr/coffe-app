import { PrismaClient } from '@prisma/client'
import { GoogleGenAI } from '@google/genai'

const prisma = new PrismaClient()
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    })
    return response.embeddings && response.embeddings.length > 0 
        ? response.embeddings[0].values || [] 
        : []
  } catch (err) {
    console.error('Error with gemini api', err)
    return []
  }
}

async function main() {
  console.log('Starting Vector Embeddings Backfill...')
  
  const cafes = await prisma.submission.findMany({
    where: { status: 'Disetujui' }
  })

  console.log(`Found ${cafes.length} approved cafes.`)

  for (const cafe of cafes) {
    // Skip if it already has embedding? Let's just overwrite for now to be safe and fresh
    const name = cafe.cafeName || ''
    const address = cafe.address || ''
    const facilities = cafe.facilities || ''
    const ambiance = cafe.ambiance || ''
    const desc = cafe.description || ''
    const menu = cafe.menuDescription || ''
    const kec = cafe.kecamatan || ''

    const corpus = `${name}. Berlokasi di ${address}, ${kec}. Fasilitas: ${facilities}. Suasana: ${ambiance}. Deskripsi: ${desc}. Menu: ${menu}.`
    console.log(`Generating vector for: ${name}`)
    
    const vector = await generateEmbedding(corpus)
    if (vector.length > 0) {
      await prisma.submission.update({
        where: { id: cafe.id },
        data: { embeddingData: JSON.stringify(vector) }
      })
      console.log(`✅ Saved embedding for ${name}`)
    } else {
      console.log(`❌ Failed embedding for ${name}`)
    }
  }

  console.log('Finished!')
  await prisma.$disconnect()
}

main().catch(console.error)
