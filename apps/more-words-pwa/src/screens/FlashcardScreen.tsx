import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll, runAndPersist } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'

interface DeckWord extends Word {
  deck_mastery: number
  saved_word_id: number
}

function buildSession(words: DeckWord[], size: number): DeckWord[] {
  // Spaced repetition: lower mastery = higher weight
  const weighted = words.map((w) => ({
    word: w,
    weight: Math.max(1, 4 - w.deck_mastery),
  }))
  const pool: DeckWord[] = []
  for (const { word, weight } of weighted) {
    for (let i = 0; i < weight; i++) pool.push(word)
  }
  // Shuffle and pick unique
  const shuffled = pool.sort(() => Math.random() - 0.5)
  const seen = new Set<number>()
  const session: DeckWord[] = []
  for (const w of shuffled) {
    if (seen.has(w.id)) continue
    seen.add(w.id)
    session.push(w)
    if (session.length >= size) break
  }
  return session
}

export default function FlashcardScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const [cards, setCards] = useState<DeckWord[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [score, setScore] = useState({ know: 0, almost: 0, learning: 0 })
  const [done, setDone] = useState(false)

  useEffect(() => {
    const rows = selectAll<DeckWord>(
      `SELECT w.*, sw.mastery as deck_mastery, sw.id as saved_word_id
       FROM words w JOIN saved_words sw ON sw.word_id = w.id
       WHERE sw.profile_id = ?`,
      [profileId]
    )
    setCards(buildSession(rows, 10))
  }, [])

  if (cards.length === 0) return null

  async function respond(level: 'know' | 'almost' | 'learning') {
    const card = cards[index]
    const delta = level === 'know' ? 1 : level === 'almost' ? 0 : -1
    const newMastery = Math.max(0, Math.min(3, card.deck_mastery + delta))
    await runAndPersist(
      'UPDATE saved_words SET mastery = ?, last_reviewed = datetime("now") WHERE id = ?',
      [newMastery, card.saved_word_id]
    )
    setScore((s) => ({ ...s, [level]: s[level] + 1 }))

    if (index + 1 >= cards.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  if (done) {
    return (
      <div className="pt-8 px-4 text-center">
        <h2 className="text-2xl font-serif text-[#c9a84c] mb-6">Session Complete</h2>
        <div className="space-y-2 text-gray-300 mb-8">
          <p>Know it: {score.know}</p>
          <p>Almost: {score.almost}</p>
          <p>Still learning: {score.learning}</p>
        </div>
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-2 bg-[#c9a84c] text-black rounded-full"
        >
          Back to Play
        </button>
      </div>
    )
  }

  const card = cards[index]

  return (
    <div className="pt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/play')} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm">{index + 1} / {cards.length}</span>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="bg-[#1a1a1a] rounded-2xl p-8 min-h-[240px] flex items-center justify-center cursor-pointer"
      >
        {flipped ? (
          <div className="text-center">
            <p className="text-lg text-gray-200 mb-2">{card.definition}</p>
            {card.etymology && <p className="text-sm text-gray-500">{card.etymology}</p>}
          </div>
        ) : (
          <h2 className="text-4xl font-serif text-white">{card.word}</h2>
        )}
      </div>

      {flipped && (
        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={() => respond('learning')} className="px-4 py-2 bg-red-900/50 text-red-300 rounded-full text-sm">
            Still Learning
          </button>
          <button onClick={() => respond('almost')} className="px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded-full text-sm">
            Almost
          </button>
          <button onClick={() => respond('know')} className="px-4 py-2 bg-green-900/50 text-green-300 rounded-full text-sm">
            Know It
          </button>
        </div>
      )}
    </div>
  )
}
