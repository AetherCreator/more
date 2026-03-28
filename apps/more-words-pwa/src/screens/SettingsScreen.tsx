import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import PaywallScreen from './PaywallScreen'

export default function SettingsScreen() {
  const { currentProfile, profiles, switchProfile, createProfile } = useProfile()
  const [showPaywall, setShowPaywall] = useState<string | null>(null)
  const [showNewProfile, setShowNewProfile] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIsKid, setNewIsKid] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    await createProfile(newName.trim(), newIsKid, 'midnight', ['Nature', 'Science', 'Art'])
    setShowNewProfile(false)
    setNewName('')
  }

  return (
    <div className="pt-4 pb-4 px-4">
      <h1 className="text-sm font-sans text-gray-500 uppercase tracking-widest text-center mb-6">
        Settings
      </h1>

      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
        <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Current Profile</h2>
        <p className="text-white text-lg">{currentProfile?.name}</p>
        <p className="text-gray-500 text-sm">
          {currentProfile?.is_kid ? 'Kid' : 'Adult'} &middot; {currentProfile?.theme} theme
        </p>
        {currentProfile?.interests && (
          <p className="text-gray-600 text-xs mt-1">{currentProfile.interests}</p>
        )}
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
        <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Profiles</h2>
        <div className="space-y-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                p.id === currentProfile?.id ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-gray-400 hover:bg-[#222]'
              }`}
            >
              {p.name} {p.is_kid ? '(kid)' : ''}
            </button>
          ))}
        </div>

        {profiles.length < 2 && !showNewProfile && (
          <button
            onClick={() => setShowPaywall('unlimited profiles')}
            className="mt-3 text-sm text-[#c9a84c] hover:underline"
          >
            + Add profile (More. Bundle)
          </button>
        )}

        {showNewProfile && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              autoFocus
            />
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={newIsKid}
                onChange={(e) => setNewIsKid(e.target.checked)}
                className="rounded"
              />
              Kid profile
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 bg-[#c9a84c] text-black rounded-full text-sm"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewProfile(false)}
                className="px-4 py-1.5 text-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-4">
        <p className="text-gray-600 text-xs text-center">MoreWords v0.1.0</p>
      </div>

      {showPaywall && (
        <PaywallScreen feature={showPaywall} onClose={() => setShowPaywall(null)} />
      )}
    </div>
  )
}
