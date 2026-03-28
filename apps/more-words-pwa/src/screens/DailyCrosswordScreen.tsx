import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { generateCrossword } from '../utils/crossword'
import { getDailySeed, seededShuffle } from '../utils/dailySeed'
import CrosswordPlayer from '../components/CrosswordPlayer'

export default function DailyCrosswordScreen() {
  const navigate = useNavigate()
  const [complete, setComplete] = useState(false)

  const puzzle = useMemo(() => {
    const allWords = selectAll<Word>('SELECT * FROM words ORDER BY id')
    const seed = getDailySeed()
    const shuffled = seededShuffle(allWords, seed).slice(0, 15)
    const inputs = shuffled.map((w) => ({ word: w.word, clue: w.definition }))
    return generateCrossword(inputs, 13)
  }, [])

  return (
    <div className="pt-4 px-2">
      <div className="flex items-center mb-4 px-2">
        <button onClick={() => navigate('/play/crossword')} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm text-center flex-1">Daily Crossword</span>
      </div>
      {complete ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-serif text-[#c9a84c] mb-4">Daily Complete!</h2>
          <button onClick={() => navigate('/play/crossword')} className="px-6 py-2 bg-[#c9a84c] text-black rounded-full">
            Back to Crossword
          </button>
        </div>
      ) : (
        <CrosswordPlayer puzzle={puzzle} onComplete={() => setComplete(true)} />
      )}
    </div>
  )
}
