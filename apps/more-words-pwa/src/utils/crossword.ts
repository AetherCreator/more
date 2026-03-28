export interface CrosswordWord {
  word: string
  clue: string
  row: number
  col: number
  direction: 'across' | 'down'
  number: number
}

export interface CrosswordGrid {
  width: number
  height: number
  cells: (string | null)[][]
  words: CrosswordWord[]
}

interface WordInput {
  word: string
  clue: string
}

function tryPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: 'across' | 'down',
  width: number,
  height: number
): boolean {
  const dr = dir === 'down' ? 1 : 0
  const dc = dir === 'across' ? 1 : 0

  if (row + dr * (word.length - 1) >= height) return false
  if (col + dc * (word.length - 1) >= width) return false

  let hasIntersection = false
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i
    const c = col + dc * i
    const existing = grid[r][c]
    if (existing !== null) {
      if (existing !== word[i]) return false
      hasIntersection = true
    } else {
      // Check perpendicular neighbors don't create unwanted adjacency
      if (dir === 'across') {
        if (r > 0 && grid[r - 1][c] !== null) return false
        if (r < height - 1 && grid[r + 1][c] !== null) return false
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false
        if (c < width - 1 && grid[r][c + 1] !== null) return false
      }
    }
  }

  // Check cells before and after word are empty
  const beforeR = row - dr
  const beforeC = col - dc
  if (beforeR >= 0 && beforeC >= 0 && grid[beforeR][beforeC] !== null) return false
  const afterR = row + dr * word.length
  const afterC = col + dc * word.length
  if (afterR < height && afterC < width && grid[afterR][afterC] !== null) return false

  return grid[row][col] !== null || hasIntersection || grid.every((r) => r.every((c) => c === null))
}

function placeWord(grid: (string | null)[][], word: string, row: number, col: number, dir: 'across' | 'down') {
  const dr = dir === 'down' ? 1 : 0
  const dc = dir === 'across' ? 1 : 0
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i]
  }
}

export function generateCrossword(inputs: WordInput[], gridSize = 15): CrosswordGrid {
  const width = gridSize
  const height = gridSize
  const grid: (string | null)[][] = Array.from({ length: height }, () => Array(width).fill(null))
  const placed: CrosswordWord[] = []
  const sorted = [...inputs].sort((a, b) => b.word.length - a.word.length)

  let numberCounter = 1

  for (const input of sorted) {
    const upper = input.word.toUpperCase()
    let bestPos: { row: number; col: number; dir: 'across' | 'down'; intersections: number } | null = null

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        for (const dir of ['across', 'down'] as const) {
          if (tryPlace(grid, upper, r, c, dir, width, height)) {
            let intersections = 0
            const dr = dir === 'down' ? 1 : 0
            const dc = dir === 'across' ? 1 : 0
            for (let i = 0; i < upper.length; i++) {
              if (grid[r + dr * i][c + dc * i] !== null) intersections++
            }
            if (!bestPos || intersections > bestPos.intersections) {
              bestPos = { row: r, col: c, dir, intersections }
            }
          }
        }
      }
    }

    if (bestPos) {
      placeWord(grid, upper, bestPos.row, bestPos.col, bestPos.dir)
      placed.push({
        word: upper,
        clue: input.clue,
        row: bestPos.row,
        col: bestPos.col,
        direction: bestPos.dir,
        number: numberCounter++,
      })
    }

    if (placed.length >= 15) break
  }

  // Re-number based on position
  placed.sort((a, b) => a.row - b.row || a.col - b.col)
  const numberMap = new Map<string, number>()
  let num = 1
  for (const w of placed) {
    const key = `${w.row},${w.col}`
    if (!numberMap.has(key)) numberMap.set(key, num++)
    w.number = numberMap.get(key)!
  }

  return { width, height, cells: grid, words: placed }
}
