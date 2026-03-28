import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'
import { generateCrossword } from '../utils/crossword'
import CrosswordPlayer from '../components/CrosswordPlayer'

export default function MyWordsCrosswordScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const [complete, setComplete] = useState(false)

  const puzzle = useMemo(() => {
    const words = selectAll<Word>(
      `SELECT w.* FROM words w JOIN saved_words sw ON sw.word_id = w.id
       WHERE sw.profile_id = ? ORDER BY RANDOM() LIMIT 15`,
      [profileId]
    )
    if (words.length < 15) return null
    const inputs = words.map((w) => ({ word: w.word, clue: w.definition }))
    return generateCrossword(inputs, 13)
  }, [])

  if (!puzzle) {
    return (
      <div className="pt-8 px-4 text-center">
        <p className="text-gray-500">Save 15 words to unlock this mode.</p>
        <button onClick={() => navigate('/play/crossword')} className="mt-4 text-[#c9a84c] text-sm">Back</button>
      </div>
    )
  }

  return (
    <div className="pt-4 px-2">
      <div className="flex items-center mb-4 px-2">
        <button onClick={() => navigate('/play/crossword')} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm text-center flex-1">My Words Crossword</span>
      </div>
      {complete ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-serif text-[#c9a84c] mb-4">You knew all your words!</h2>
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
