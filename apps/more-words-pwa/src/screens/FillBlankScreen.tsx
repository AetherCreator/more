import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectAll, runAndPersist } from '../db/db'
import type { Word } from '../db/types'
import { useProfile } from '../context/ProfileContext'

interface Question {
  word: Word
  sentence: string
  options: string[]
  correctIndex: number
  savedWordId: number
}

function buildQuestions(words: { word: Word; savedWordId: number }[]): Question[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10)
  return shuffled.map(({ word, savedWordId }) => {
    const sentence = (word.example_1 || `The word _____ means ${word.definition}.`).replace(
      new RegExp(word.word, 'gi'),
      '_____'
    )
    const others = words
      .filter((w) => w.word.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.word.word)
    const options = [...others, word.word].sort(() => Math.random() - 0.5)
    return {
      word,
      sentence,
      options,
      correctIndex: options.indexOf(word.word),
      savedWordId,
    }
  })
}

export default function FillBlankScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const rows = selectAll<Word & { saved_word_id: number }>(
      `SELECT w.*, sw.id as saved_word_id FROM words w
       JOIN saved_words sw ON sw.word_id = w.id
       WHERE sw.profile_id = ?`,
      [profileId]
    )
    const mapped = rows.map((r) => ({
      word: r as Word,
      savedWordId: r.saved_word_id,
    }))
    setQuestions(buildQuestions(mapped))
  }, [])

  if (questions.length === 0) return null

  async function handleChoice(optionIndex: number) {
    if (chosen !== null) return
    setChosen(optionIndex)
    const q = questions[index]
    const isCorrect = optionIndex === q.correctIndex

    if (isCorrect) {
      setCorrect((c) => c + 1)
      await runAndPersist(
        'UPDATE saved_words SET mastery = MIN(3, mastery + 1), last_reviewed = datetime("now") WHERE id = ?',
        [q.savedWordId]
      )
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true)
      } else {
        setIndex((i) => i + 1)
        setChosen(null)
      }
    }, 1000)
  }

  if (done) {
    return (
      <div className="pt-8 px-4 text-center">
        <h2 className="text-2xl font-serif text-[#c9a84c] mb-4">Round Complete</h2>
        <p className="text-gray-300 mb-6">{correct} / {questions.length} correct</p>
        <button onClick={() => navigate('/play')} className="px-6 py-2 bg-[#c9a84c] text-black rounded-full">
          Back to Play
        </button>
      </div>
    )
  }

  const q = questions[index]

  return (
    <div className="pt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/play')} className="text-gray-500 text-sm">&larr; Back</button>
        <span className="text-gray-500 text-sm">{index + 1} / {questions.length}</span>
      </div>

      <p className="text-lg text-gray-200 mb-6 leading-relaxed">{q.sentence}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = 'bg-[#1a1a1a] text-white hover:bg-[#222]'
          if (chosen !== null) {
            if (i === q.correctIndex) style = 'bg-green-900/50 text-green-300'
            else if (i === chosen) style = 'bg-red-900/50 text-red-300'
          }
          return (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
