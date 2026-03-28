import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { initDB } from './db/db'
import { importSeedWords } from './db/seed'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import OnboardingScreen from './screens/OnboardingScreen'
import FeedScreen from './screens/FeedScreen'
import DeckScreen from './screens/DeckScreen'
import PlayScreen from './screens/PlayScreen'
import SettingsScreen from './screens/SettingsScreen'
import FlashcardScreen from './screens/FlashcardScreen'
import MatchGameScreen from './screens/MatchGameScreen'
import FillBlankScreen from './screens/FillBlankScreen'
import CrosswordScreen from './screens/CrosswordScreen'
import RandomCrosswordScreen from './screens/RandomCrosswordScreen'
import DailyCrosswordScreen from './screens/DailyCrosswordScreen'
import MyWordsCrosswordScreen from './screens/MyWordsCrosswordScreen'

const tabs = [
  { path: '/', label: 'Feed', icon: '\u{1F4D6}' },
  { path: '/deck', label: 'Deck', icon: '\u{1F0CF}' },
  { path: '/play', label: 'Play', icon: '\u{1F3AE}' },
  { path: '/settings', label: 'Settings', icon: '\u2699\uFE0F' },
]

function AppContent() {
  const { currentProfile, profiles } = useProfile()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (profiles.length === 0) setShowOnboarding(true)
  }, [profiles])

  if (showOnboarding || !currentProfile) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      <main className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/" element={<FeedScreen />} />
          <Route path="/deck" element={<DeckScreen />} />
          <Route path="/play" element={<PlayScreen />} />
          <Route path="/play/flashcard" element={<FlashcardScreen />} />
          <Route path="/play/match" element={<MatchGameScreen />} />
          <Route path="/play/fill-blank" element={<FillBlankScreen />} />
          <Route path="/play/crossword" element={<CrosswordScreen />} />
          <Route path="/play/crossword/random" element={<RandomCrosswordScreen />} />
          <Route path="/play/crossword/daily" element={<DailyCrosswordScreen />} />
          <Route path="/play/crossword/mywords" element={<MyWordsCrosswordScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333] flex justify-around items-center h-16 safe-bottom">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
                isActive ? 'text-[#c9a84c]' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function boot() {
      try {
        await initDB()
        await importSeedWords()
        setReady(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to initialize database')
      }
    }
    boot()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] text-red-400 p-8">
        <p>{error}</p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <p className="text-[#c9a84c] text-xl font-serif animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  )
}
