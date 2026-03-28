import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'

interface Tile {
  id: string
  wordId: number
  text: string
  type: 'word' | 'definition'
  matched: boolean
}

export default function MatchGameScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const [tiles, setTiles] = useState<Tile[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null)
  const [matchCount, setMatchCount] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const totalPairs = 8

  useEffect(() => {
    const rows = selectAll<Word>(
      `SELECT w.* FROM words w JOIN saved_words sw ON sw.word_id = w.id
       WHERE sw.profile_id = ? ORDER BY RANDOM() LIMIT 8`,
      [profileId]
    )
    const tilePairs: Tile[] = []
    for (const w of rows) {
      tilePairs.push({ id: `w-${w.id}`, wordId: w.id, text: w.word, type: 'word', matched: false })
      tilePairs.push({ id: `d-${w.id}`, wordId: w.id, text: w.definition, type: 'definition', matched: false })
    }
    setTiles(tilePairs.sort(() => Math.random() - 0.5))
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  function handleTap(tile: Tile) {
    if (tile.matched || wrongPair) return

    if (!selected) {
      setSelected(tile.id)
      return
    }

    const first = tiles.find((t) => t.id === selected)!
    if (first.id === tile.id) {
      setSelected(null)
      return
    }

    if (first.type === tile.type) {
      setSelected(tile.id)
      return
    }

    if (first.wordId === tile.wordId) {
      const newTiles = tiles.map((t) =>
        t.wordId === tile.wordId ? { ...t, matched: true } : t
      )
      setTiles(newTiles)
      setSelected(null)
      const newCount = matchCount + 1
      setMatchCount(newCount)
      if (newCount >= totalPairs) {
        setDone(true)
        clearInterval(timerRef.current)
      }
    } else {
      setWrongPair([selected, tile.id])
      setTimeout(() => {
        setWrongPair(null)
        setSelected(null)
      }, 600)
    }
  }

  const score = Math.max(0, 1000 - elapsed * 10)

  if (done) {
    return (
      <div className="pt-8 px-4 text-center">
        <h2 className="text-2xl font-serif text-[#c9a84c] mb-4">All Matched!</h2>
        <p className="text-gray-300 mb-2">Time: {elapsed}s</p>
        <p className="text-gray-300 mb-6">Score: {score}</p>
        <button onClick={() => navigate('/play')} className="px-6 py-2 bg-[#c9a84c] text-black rounded-full">
          Back to Play
        </button>
      </div>
    )
  }

  return (
    <div className="pt-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/play')} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm">{elapsed}s</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const isSelected = selected === tile.id
          const isWrong = wrongPair?.includes(tile.id)
          return (
            <button
              key={tile.id}
              onClick={() => handleTap(tile)}
              className={`p-3 rounded-xl text-sm text-left min-h-[60px] transition-all ${
                tile.matched
                  ? 'opacity-0 pointer-events-none'
                  : isWrong
                    ? 'bg-red-900/50 border border-red-500'
                    : isSelected
                      ? 'bg-[#c9a84c]/20 border border-[#c9a84c]'
                      : 'bg-[#1a1a1a] border border-transparent hover:border-[#333]'
              } ${tile.type === 'word' ? 'font-serif text-white' : 'text-gray-400'}`}
            >
              {tile.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
