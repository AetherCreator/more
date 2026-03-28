import seedWords from '../../../../hunts/more-words/assets/seed-words.json'
import { getDB, persist, selectOne } from './db'

interface SeedWord {
  id: number
  word: string
  pronunciation: string
  part_of_speech: string
  definition: string
  etymology: string
  example_1: string
  example_2: string
  category: string
  difficulty: string
  kid_safe: boolean
  mastery: number
}

export async function importSeedWords(): Promise<number> {
  const count = selectOne<{ count: number }>('SELECT COUNT(*) as count FROM words')
  if (count && count.count > 0) return count.count

  const db = getDB()
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO words (id, word, pronunciation, part_of_speech, definition, etymology, example_1, example_2, category, difficulty, kid_safe, mastery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  for (const w of seedWords as SeedWord[]) {
    stmt.run([
      w.id,
      w.word,
      w.pronunciation,
      w.part_of_speech,
      w.definition,
      w.etymology,
      w.example_1,
      w.example_2,
      w.category,
      w.difficulty,
      w.kid_safe ? 1 : 0,
      w.mastery,
    ])
  }
  stmt.free()

  await persist()

  const final = selectOne<{ count: number }>('SELECT COUNT(*) as count FROM words')
  return final?.count ?? 0
}
