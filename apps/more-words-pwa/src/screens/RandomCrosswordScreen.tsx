import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { generateCrossword } from '../utils/crossword'
import CrosswordPlayer from '../components/CrosswordPlayer'

const DIFFICULTIES = [
  { key: 'beginner', label: 'Beginner', count: 6, size: 8 },
  { key: 'intermediate', label: 'Intermediate', count: 10, size: 11 },
  { key: 'advanced', label: 'Advanced', count: 14, size: 13 },
  { key: 'expert', label: 'Expert', count: 18, size: 15 },
]

export default function RandomCrosswordScreen() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)

  const puzzle = useMemo(() => {
    if (!difficulty) return null
    const diff = DIFFICULTIES.find((d) => d.key === difficulty)!
    const words = selectAll<Word>(
      'SELECT * FROM words ORDER BY RANDOM() LIMIT ?',
      [diff.count + 5]
    )
    const inputs = words.map((w) => ({ word: w.word, clue: w.definition }))
    return generateCrossword(inputs, diff.size)
  }, [difficulty])

  if (!difficulty) {
    return (
      <div className="pt-4 px-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/play/crossword')} className="text-gray-500 text-sm">&larr; Back</button>
          <h1 className="text-sm text-gray-500 uppercase tracking-widest text-center flex-1">Random Crossword</h1>
        </div>
        <div className="space-y-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className="w-full text-left bg-[#1a1a1a] rounded-xl px-4 py-3 text-white hover:bg-[#222]"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-4 px-2">
      <div className="flex items-center mb-4 px-2">
        <button onClick={() => setDifficulty(null)} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm text-center flex-1">Random — {difficulty}</span>
      </div>
      {complete ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-serif text-[#c9a84c] mb-4">Completed!</h2>
          <button onClick={() => setDifficulty(null)} className="px-6 py-2 bg-[#c9a84c] text-black rounded-full">
            New Puzzle
          </button>
        </div>
      ) : (
        puzzle && <CrosswordPlayer puzzle={puzzle} onComplete={() => setComplete(true)} />
      )}
    </div>
  )
}
