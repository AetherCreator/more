import { useState, useEffect, useCallback } from 'react'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'
import WordCard from '../components/WordCard'
import WordCardKid from '../components/WordCardKid'

const PAGE_SIZE = 10

export default function FeedScreen() {
  const { currentProfile } = useProfile()
  const [words, setWords] = useState<Word[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const profileId = currentProfile!.id
  const isKid = !!currentProfile!.is_kid

  const loadMore = useCallback(() => {
    const kidFilter = isKid ? 'WHERE kid_safe = 1' : ''
    const batch = selectAll<Word>(
      `SELECT * FROM words ${kidFilter} ORDER BY id LIMIT ? OFFSET ?`,
      [PAGE_SIZE, offset]
    )
    if (batch.length < PAGE_SIZE) setHasMore(false)
    setWords((prev) => [...prev, ...batch])
    setOffset((prev) => prev + batch.length)
  }, [offset, isKid])

  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Card = isKid ? WordCardKid : WordCard

  return (
    <div className="pt-4 pb-4">
      <h1 className="text-sm font-sans text-gray-500 uppercase tracking-widest text-center mb-4">
        Word Feed
      </h1>
      {words.map((word) => (
        <Card key={word.id} word={word} profileId={profileId} />
      ))}
      {hasMore && (
        <button
          onClick={loadMore}
          className="block mx-auto my-6 px-6 py-2 text-sm text-[#c9a84c] border border-[#c9a84c] rounded-full hover:bg-[#c9a84c] hover:text-black transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  )
}
