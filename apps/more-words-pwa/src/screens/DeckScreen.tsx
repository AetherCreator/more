import { useState, useEffect } from 'react'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'
import WordCard from '../components/WordCard'

interface DeckWord extends Word {
  deck_mastery: number
}

const CATEGORIES = ['all', 'descriptive', 'time', 'nature', 'emotion', 'abstract', 'science', 'art']

export default function DeckScreen() {
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const [words, setWords] = useState<DeckWord[]>([])
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const categoryFilter = filter === 'all' ? '' : 'AND w.category = ?'
    const params = filter === 'all' ? [profileId] : [profileId, filter]
    const rows = selectAll<DeckWord>(
      `SELECT w.*, sw.mastery as deck_mastery FROM words w
       JOIN saved_words sw ON sw.word_id = w.id
       WHERE sw.profile_id = ? ${categoryFilter}
       ORDER BY sw.saved_at DESC`,
      params
    )
    setWords(rows)
  }, [filter, profileId])

  function masteryDots(level: number) {
    return Array.from({ length: 3 }, (_, i) => (
      <span key={i} className={`inline-block w-2 h-2 rounded-full mx-0.5 ${i < level ? 'bg-[#c9a84c]' : 'bg-[#333]'}`} />
    ))
  }

  return (
    <div className="pt-4 pb-4">
      <h1 className="text-sm font-sans text-gray-500 uppercase tracking-widest text-center mb-4">
        My Deck ({words.length} words)
      </h1>

      <div className="flex gap-2 overflow-x-auto px-4 mb-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === cat ? 'bg-[#c9a84c] text-black' : 'bg-[#1a1a1a] text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {words.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No saved words yet. Heart words in the Feed to build your deck.
        </p>
      ) : (
        words.map((word) =>
          expandedId === word.id ? (
            <div key={word.id} onClick={() => setExpandedId(null)} className="cursor-pointer">
              <WordCard word={word} profileId={profileId} />
            </div>
          ) : (
            <div
              key={word.id}
              onClick={() => setExpandedId(word.id)}
              className="bg-[#1a1a1a] rounded-xl px-4 py-3 mx-4 my-1.5 flex items-center justify-between cursor-pointer hover:bg-[#222]"
            >
              <div>
                <span className="text-white font-serif text-lg">{word.word}</span>
                <span className="text-gray-500 text-xs ml-2">{word.part_of_speech}</span>
              </div>
              <div className="flex items-center">{masteryDots(word.deck_mastery)}</div>
            </div>
          )
        )
      )}
    </div>
  )
}
