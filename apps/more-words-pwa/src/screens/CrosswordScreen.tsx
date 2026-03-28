import { useNavigate } from 'react-router-dom'
import { selectOne } from '../db/db'
import { useProfile } from '../context/ProfileContext'

export default function CrosswordScreen() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const profileId = currentProfile!.id
  const savedCount = selectOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM saved_words WHERE profile_id = ?',
    [profileId]
  )?.count ?? 0

  const modes = [
    { path: '/play/crossword/random', label: 'Random', icon: '\u{1F3B2}', desc: 'Fresh puzzle any time', locked: false },
    { path: '/play/crossword/daily', label: 'Daily', icon: '\u{1F4C5}', desc: 'Same puzzle for everyone today', locked: false },
    { path: '/play/crossword/mywords', label: 'My Words', icon: '\u2764\uFE0F', desc: 'Crossword from your saved deck', locked: savedCount < 15 },
  ]

  return (
    <div className="pt-4 px-4">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/play')} className="text-gray-500 text-sm">&larr; Back</button>
        <h1 className="text-sm font-sans text-gray-500 uppercase tracking-widest text-center flex-1">Crossword</h1>
      </div>

      <div className="space-y-3">
        {modes.map((mode) => (
          <button
            key={mode.path}
            onClick={() => !mode.locked && navigate(mode.path)}
            disabled={mode.locked}
            className={`w-full text-left bg-[#1a1a1a] rounded-xl p-4 transition-colors ${
              mode.locked ? 'opacity-50' : 'hover:bg-[#222]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mode.icon}</span>
              <div>
                <p className="text-white font-medium">{mode.label}</p>
                <p className="text-gray-500 text-sm">{mode.desc}</p>
                {mode.locked && (
                  <p className="text-[#c9a84c] text-xs mt-1">Save {15 - savedCount} more words to unlock</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
