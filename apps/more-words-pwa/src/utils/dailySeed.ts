export function getDailySeed(): number {
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return Math.abs(hash)
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0
    const j = Math.abs(s) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
