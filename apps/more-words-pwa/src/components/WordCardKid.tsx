import { useState } from 'react'
import type { Word } from '../db/types'
import { runAndPersist, selectOne } from '../db/db'

interface WordCardKidProps {
  word: Word
  profileId: number
  onSaved?: () => void
}

export default function WordCardKid({ word, profileId, onSaved }: WordCardKidProps) {
  const [saved, setSaved] = useState(() => {
    const row = selectOne<{ id: number }>(
      'SELECT id FROM saved_words WHERE profile_id = ? AND word_id = ?',
      [profileId, word.id]
    )
    return row !== null
  })

  async function handleSave() {
    if (saved) return
    await runAndPersist(
      'INSERT INTO saved_words (profile_id, word_id) VALUES (?, ?)',
      [profileId, word.id]
    )
    setSaved(true)
    onSaved?.()
  }

  return (
    <div className="bg-[#2a1f4e] rounded-2xl p-6 mx-4 my-3">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-3xl font-bold text-yellow-300">{word.word}</h2>
        <button
          onClick={handleSave}
          className={`text-2xl p-1 transition-colors ${saved ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          aria-label="Save to deck"
        >
          {saved ? '\u2764\uFE0F' : '\u{1F90D}'}
        </button>
      </div>

      <p className="text-lg text-white">{word.definition}</p>
    </div>
  )
}
