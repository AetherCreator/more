import { useNavigate } from 'react-router-dom'
import { selectOne } from '../db/db'
import { useProfile } from '../context/ProfileContext'

export default function PlayScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id

  const count = selectOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM saved_words WHERE profile_id = ?',
    [profileId]
  )
  const savedCount = count?.count ?? 0

  const games = [
    { path: '/play/flashcard', label: 'Flashcards', icon: '\u{1F4DA}', min: 4, desc: 'Flip & learn your saved words' },
    { path: '/play/match', label: 'Match Game', icon: '\u{1F9E9}', min: 8, desc: 'Pair words with definitions' },
    { path: '/play/fill-blank', label: 'Fill in the Blank', icon: '\u270D\uFE0F', min: 4, desc: 'Choose the right word' },
    { path: '/play/crossword', label: 'Crossword', icon: '\u{1F9E9}', min: 0, desc: 'Daily, random, or from your deck' },
  ]

  return (
    <div className="pt-4 pb-4 px-4">
      <h1 className="text-sm font-sans text-gray-500 uppercase tracking-widest text-center mb-6">
        Play
      </h1>

      <div className="space-y-3">
        {games.map((game) => {
          const locked = savedCount < game.min
          return (
            <button
              key={game.path}
              onClick={() => !locked && navigate(game.path)}
              disabled={locked}
              className={`w-full text-left bg-[#1a1a1a] rounded-xl p-4 transition-colors ${
                locked ? 'opacity-50' : 'hover:bg-[#222]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <p className="text-white font-medium">{game.label}</p>
                  <p className="text-gray-500 text-sm">{game.desc}</p>
                  {locked && (
                    <p className="text-[#c9a84c] text-xs mt-1">
                      Save {game.min - savedCount} more word{game.min - savedCount !== 1 ? 's' : ''} to unlock
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
