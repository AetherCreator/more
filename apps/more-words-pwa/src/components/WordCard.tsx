import { useState } from 'react'
import type { Word } from '../db/types'
import { runAndPersist, selectOne } from '../db/db'

interface WordCardProps {
  word: Word
  profileId: number
  onSaved?: () => void
}

export default function WordCard({ word, profileId, onSaved }: WordCardProps) {
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

  function handleShare() {
    const text = `${word.word} — ${word.definition}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 mx-4 my-3">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-3xl font-serif text-white">{word.word}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="text-gray-500 hover:text-white text-xl p-1"
            aria-label="Share"
          >
            &#x1F4CB;
          </button>
          <button
            onClick={handleSave}
            className={`text-xl p-1 transition-colors ${saved ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
            aria-label="Save to deck"
          >
            {saved ? '\u2764\uFE0F' : '\u{1F90D}'}
          </button>
        </div>
      </div>

      {word.pronunciation && (
        <p className="text-sm text-gray-400 italic mb-1">{word.pronunciation}</p>
      )}

      {word.part_of_speech && (
        <span className="inline-block text-xs bg-[#333] text-[#c9a84c] px-2 py-0.5 rounded-full mb-3">
          {word.part_of_speech}
        </span>
      )}

      <p className="text-base text-gray-200 mb-3">{word.definition}</p>

      {word.etymology && (
        <p className="text-sm text-gray-500 mb-3">{word.etymology}</p>
      )}

      {word.example_1 && (
        <p className="text-sm text-gray-400 pl-3 border-l-2 border-[#333] mb-2">
          {word.example_1}
        </p>
      )}
      {word.example_2 && (
        <p className="text-sm text-gray-400 pl-3 border-l-2 border-[#333]">
          {word.example_2}
        </p>
      )}
    </div>
  )
}
