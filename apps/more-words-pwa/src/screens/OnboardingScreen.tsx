import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { fetchCuratedWordIds } from '../utils/aiCuration'

const INTERESTS = [
  'Art', 'Nature', 'Science', 'History', 'Mythology',
  'Food', 'Music', 'Adventure', 'Animals', 'Technology',
  'Architecture', 'Metaphysical',
]

const KID_INTERESTS = [
  'Animals', 'Space', 'Adventure', 'Science', 'Nature', 'Trains', 'Superheroes',
]

const THEMES = [
  { key: 'midnight', label: 'Midnight', bg: '#0d0d0d', accent: '#c9a84c', desc: 'Dark & elegant' },
  { key: 'paper', label: 'Paper', bg: '#f5f0e8', accent: '#4a4a4a', desc: 'Warm & analog' },
  { key: 'bloom', label: 'Bloom', bg: '#1a1025', accent: '#d4a0e8', desc: 'Soft & creative' },
]

interface Props {
  onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: Props) {
  const { createProfile } = useProfile()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [isKid, setIsKid] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [theme, setTheme] = useState('midnight')

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 10 ? [...prev, interest] : prev
    )
  }

  async function finish() {
    await createProfile(name || 'Player', isKid, theme, selectedInterests)
    onComplete()
    // Fire-and-forget AI curation — don't block UI
    fetchCuratedWordIds(selectedInterests).catch(() => {})
  }

  const interestList = isKid ? KID_INTERESTS : INTERESTS

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6">
      {step === 0 && (
        <div className="text-center w-full max-w-sm">
          <h1 className="text-3xl font-serif text-[#c9a84c] mb-2">MoreWords</h1>
          <p className="text-gray-400 mb-8">What should we call you?</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-[#c9a84c]"
            autoFocus
          />
          <button
            onClick={() => setStep(1)}
            className="mt-6 px-8 py-3 bg-[#c9a84c] text-black rounded-full font-medium"
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="text-center w-full max-w-sm">
          <h2 className="text-2xl font-serif text-white mb-2">Is this for a child?</h2>
          <p className="text-gray-400 mb-8">Kid profiles get age-appropriate words</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setIsKid(false); setStep(2) }}
              className="px-8 py-3 bg-[#1a1a1a] text-white rounded-full border border-[#333] hover:border-[#c9a84c]"
            >
              Adult
            </button>
            <button
              onClick={() => { setIsKid(true); setSelectedInterests([]); setStep(2) }}
              className="px-8 py-3 bg-[#1a1a1a] text-white rounded-full border border-[#333] hover:border-[#c9a84c]"
            >
              Kid
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-center w-full max-w-sm">
          <h2 className="text-2xl font-serif text-white mb-2">Pick your interests</h2>
          <p className="text-gray-400 mb-6">Choose 3-10 topics</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {interestList.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-[#c9a84c] text-black'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={selectedInterests.length < 3}
            className={`px-8 py-3 rounded-full font-medium ${
              selectedInterests.length >= 3 ? 'bg-[#c9a84c] text-black' : 'bg-[#333] text-gray-600'
            }`}
          >
            Next ({selectedInterests.length}/10)
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center w-full max-w-sm">
          <h2 className="text-2xl font-serif text-white mb-6">Choose your theme</h2>
          <div className="space-y-3 mb-6">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`w-full rounded-xl p-4 border-2 transition-colors ${
                  theme === t.key ? 'border-[#c9a84c]' : 'border-transparent'
                }`}
                style={{ backgroundColor: t.bg }}
              >
                <p className="font-medium" style={{ color: t.accent }}>{t.label}</p>
                <p className="text-sm opacity-60" style={{ color: t.accent }}>{t.desc}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="px-8 py-3 bg-[#c9a84c] text-black rounded-full font-medium"
          >
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center w-full max-w-sm">
          <h2 className="text-3xl font-serif text-[#c9a84c] mb-4">You're all set, {name || 'Player'}!</h2>
          <p className="text-gray-400 mb-8">Your first word is waiting.</p>
          <button
            onClick={finish}
            className="px-8 py-3 bg-[#c9a84c] text-black rounded-full font-medium text-lg"
          >
            Start Learning
          </button>
        </div>
      )}
    </div>
  )
}
