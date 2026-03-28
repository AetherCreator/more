interface Props {
  feature: string
  onClose: () => void
}

export default function PaywallScreen({ feature, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-2xl font-serif text-[#c9a84c] mb-2 text-center">More. Bundle</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Unlock {feature} and everything else
        </p>

        <ul className="space-y-2 mb-6">
          {[
            'AI interest-matched word curation',
            'Unlimited profiles',
            'Premium themes (Paper, Bloom)',
            'All More. apps (MoreMath, MoreFacts)',
            'Early access to new apps',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-green-400">&#x2713;</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-2 mb-6">
          <button className="w-full py-3 bg-[#c9a84c] text-black rounded-full font-medium">
            $4.99/month
          </button>
          <button className="w-full py-3 border border-[#c9a84c] text-[#c9a84c] rounded-full font-medium">
            $29.99/year (save 50%)
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mb-3">
          Free forever: word feed, all games, all crosswords, Midnight theme, 1 profile
        </p>

        <button
          onClick={onClose}
          className="w-full text-center text-gray-500 text-sm py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
