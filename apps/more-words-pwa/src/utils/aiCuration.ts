import { selectAll } from '../db/db'
import type { Word } from '../db/types'

export async function fetchCuratedWordIds(interests: string[]): Promise<number[]> {
  try {
    const response = await fetch('https://thechefos.com/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-product': 'morewords' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `You are a vocabulary curator for the MoreWords app. Given these user interests: ${interests.join(', ')}, select 20 word IDs from the available categories that best match these interests. Return ONLY a JSON array of numbers, no other text. Available categories in our database: descriptive, time, nature, emotion, abstract, science, art, food, mythology, architecture, music, adventure, animals, technology, history.`,
          },
        ],
      }),
    })

    if (!response.ok) throw new Error(`API returned ${response.status}`)

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''
    const match = text.match(/\[[\d,\s]+\]/)
    if (!match) throw new Error('No JSON array in response')

    return JSON.parse(match[0]) as number[]
  } catch {
    return fallbackCuration(interests)
  }
}

function fallbackCuration(interests: string[]): number[] {
  const categoryMap: Record<string, string[]> = {
    'Art': ['art', 'descriptive'],
    'Nature': ['nature'],
    'Science': ['science'],
    'History': ['history'],
    'Mythology': ['mythology'],
    'Food': ['food'],
    'Music': ['music'],
    'Adventure': ['adventure'],
    'Animals': ['animals'],
    'Technology': ['technology'],
    'Architecture': ['architecture'],
    'Metaphysical': ['abstract', 'emotion'],
    'Space': ['science'],
    'Trains': ['technology'],
    'Superheroes': ['adventure'],
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
