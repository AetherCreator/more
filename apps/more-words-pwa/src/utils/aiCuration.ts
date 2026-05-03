import { selectAll } from '../db/db'
import type { Word } from '../db/types'

// Word IDs in the seed database. Used to (a) constrain the model so it
// stops hallucinating IDs and (b) filter out anything that slipped through.
const MIN_WORD_ID = 1
const MAX_WORD_ID = 285
const TARGET_COUNT = 20
const MIN_VALID = 10 // below this, treat the call as failed and fall back

export async function fetchCuratedWordIds(interests: string[]): Promise<number[]> {
  try {
    const response = await fetch('https://api.thechefos.app/ai/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-product': 'morewords' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Database has ${MAX_WORD_ID} vocabulary words (IDs ${MIN_WORD_ID}-${MAX_WORD_ID}) across categories: descriptive, time, nature, emotion, abstract, science, art, food, mythology, architecture, music, adventure, animals, technology, history. A child is interested in: ${interests.join(', ')}. Output ${TARGET_COUNT} IDs (each between ${MIN_WORD_ID} and ${MAX_WORD_ID}) that match these interests. Output format example: [3,17,42,88]. Output ONLY the array, no other text.`,
          },
        ],
      }),
    })

    if (!response.ok) throw new Error(`API returned ${response.status}`)

    const data = await response.json()
    const text: string = data.content?.[0]?.text ?? ''
    const ids = parseIds(text)
    if (ids.length < MIN_VALID) throw new Error(`Only ${ids.length} valid IDs in response`)
    return ids
  } catch {
    return fallbackCuration(interests)
  }
}

// Tolerant ID extraction. Workers AI primary (Llama-3.3-70b) reliably emits
// bare comma-separated IDs without brackets; NIM (Nemotron) and Anthropic
// emit proper JSON arrays. Both paths must work.
function parseIds(text: string): number[] {
  const cleaned = text.trim()

  // Preferred: a JSON array of numbers somewhere in the text.
  const arrayMatch = cleaned.match(/\[[\d,\s]+\]/)
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]) as unknown
      if (Array.isArray(parsed)) {
        return sanitize(parsed.map(Number))
      }
    } catch {
      // fall through to CSV path
    }
  }

  // Recovery: bare CSV — five or more comma-separated integers.
  const csvMatch = cleaned.match(/(?:\d+\s*,\s*){4,}\d+/)
  if (csvMatch) {
    return sanitize(csvMatch[0].split(',').map((s) => Number(s.trim())))
  }

  return []
}

function sanitize(nums: number[]): number[] {
  const seen = new Set<number>()
  const out: number[] = []
  for (const n of nums) {
    if (!Number.isInteger(n)) continue
    if (n < MIN_WORD_ID || n > MAX_WORD_ID) continue
    if (seen.has(n)) continue
    seen.add(n)
    out.push(n)
    if (out.length >= TARGET_COUNT) break
  }
  return out
}

function fallbackCuration(interests: string[]): number[] {
  const categoryMap: Record<string, string[]> = {
    Art: ['art', 'descriptive'],
    Nature: ['nature'],
    Science: ['science'],
    History: ['history'],
    Mythology: ['mythology'],
    Food: ['food'],
    Music: ['music'],
    Adventure: ['adventure'],
    Animals: ['animals'],
    Technology: ['technology'],
    Architecture: ['architecture'],
    Metaphysical: ['abstract', 'emotion'],
    Space: ['science'],
    Trains: ['technology'],
    Superheroes: ['adventure'],
  }

  const categories = interests.flatMap((i) => categoryMap[i] ?? [])
  if (categories.length === 0) {
    const words = selectAll<Word>('SELECT id FROM words ORDER BY RANDOM() LIMIT 20')
    return words.map((w) => w.id)
  }

  const placeholders = categories.map(() => '?').join(',')
  const words = selectAll<Word>(
    `SELECT id FROM words WHERE category IN (${placeholders}) ORDER BY RANDOM() LIMIT 20`,
    categories
  )

  if (words.length < 20) {
    const extra = selectAll<Word>(
      `SELECT id FROM words WHERE id NOT IN (${words.map((w) => w.id).join(',') || '0'}) ORDER BY RANDOM() LIMIT ?`,
      [20 - words.length]
    )
    words.push(...extra)
  }

  return words.map((w) => w.id)
}
