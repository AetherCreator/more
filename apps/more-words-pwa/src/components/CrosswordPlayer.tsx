import { useState, useCallback, useRef, useEffect } from 'react'
import type { CrosswordGrid, CrosswordWord } from '../utils/crossword'

interface Props {
  puzzle: CrosswordGrid
  onComplete?: () => void
}

export default function CrosswordPlayer({ puzzle, onComplete }: Props) {
  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: puzzle.height }, () => Array(puzzle.width).fill(''))
  )
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedWord, setSelectedWord] = useState<CrosswordWord | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isPartOfWord = useCallback(
    (row: number, col: number) => puzzle.cells[row][col] !== null,
    [puzzle]
  )

  function findWordAt(row: number, col: number): CrosswordWord | null {
    // Prefer the word that hasn't been selected yet, or toggle direction
    const words = puzzle.words.filter((w) => {
      const dr = w.direction === 'down' ? 1 : 0
      const dc = w.direction === 'across' ? 1 : 0
      for (let i = 0; i < w.word.length; i++) {
        if (w.row + dr * i === row && w.col + dc * i === col) return true
      }
      return false
    })
    if (words.length === 0) return null
    if (words.length === 1) return words[0]
    // Toggle: if current selected word is one of them, pick the other
    if (selectedWord && words.find((w) => w === selectedWord)) {
      return words.find((w) => w !== selectedWord) ?? words[0]
    }
    return words[0]
  }

  function getWordCells(word: CrosswordWord): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = []
    const dr = word.direction === 'down' ? 1 : 0
    const dc = word.direction === 'across' ? 1 : 0
    for (let i = 0; i < word.word.length; i++) {
      cells.push({ row: word.row + dr * i, col: word.col + dc * i })
    }
    return cells
  }

  function handleCellClick(row: number, col: number) {
    if (!isPartOfWord(row, col)) return
    const word = findWordAt(row, col)
    setSelectedCell({ row, col })
    setSelectedWord(word)
    inputRef.current?.focus()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!selectedCell || !selectedWord) return
    const key = e.key.toUpperCase()

    if (key === 'BACKSPACE') {
      const newGrid = userGrid.map((r) => [...r])
      newGrid[selectedCell.row][selectedCell.col] = ''
      setUserGrid(newGrid)
      // Move back
      const dr = selectedWord.direction === 'down' ? -1 : 0
      const dc = selectedWord.direction === 'across' ? -1 : 0
      const nr = selectedCell.row + dr
      const nc = selectedCell.col + dc
      if (nr >= 0 && nc >= 0 && isPartOfWord(nr, nc)) {
        setSelectedCell({ row: nr, col: nc })
      }
      return
    }

    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      const newGrid = userGrid.map((r) => [...r])
      newGrid[selectedCell.row][selectedCell.col] = key
      setUserGrid(newGrid)

      // Advance to next cell in word
      const dr = selectedWord.direction === 'down' ? 1 : 0
      const dc = selectedWord.direction === 'across' ? 1 : 0
      const nr = selectedCell.row + dr
      const nc = selectedCell.col + dc
      if (nr < puzzle.height && nc < puzzle.width && isPartOfWord(nr, nc)) {
        setSelectedCell({ row: nr, col: nc })
      }
    }
  }

  // Check completion
  useEffect(() => {
    let allCorrect = true
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.cells[r][c] !== null && userGrid[r][c] !== puzzle.cells[r][c]) {
          allCorrect = false
          break
        }
      }
      if (!allCorrect) break
    }
    if (allCorrect && puzzle.words.length > 0) onComplete?.()
  }, [userGrid, puzzle, onComplete])

  const highlightedCells = selectedWord ? new Set(getWordCells(selectedWord).map((c) => `${c.row},${c.col}`)) : new Set<string>()

  // Find the bounding box of placed words to trim the grid
  let minR = puzzle.height, maxR = 0, minC = puzzle.width, maxC = 0
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.cells[r][c] !== null) {
        minR = Math.min(minR, r)
        maxR = Math.max(maxR, r)
        minC = Math.min(minC, c)
        maxC = Math.max(maxC, c)
      }
    }
  }
  const displayRows = maxR - minR + 1
  const displayCols = maxC - minC + 1

  // Build number lookup
  const numberAt = new Map<string, number>()
  for (const w of puzzle.words) {
    const key = `${w.row},${w.col}`
    if (!numberAt.has(key)) numberAt.set(key, w.number)
  }

  const acrossClues = puzzle.words.filter((w) => w.direction === 'across').sort((a, b) => a.number - b.number)
  const downClues = puzzle.words.filter((w) => w.direction === 'down').sort((a, b) => a.number - b.number)

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        className="opacity-0 absolute -z-10 h-0 w-0"
        onKeyDown={handleKey}
        autoCapitalize="characters"
      />

      <div
        className="grid gap-px bg-[#333] border border-[#333] mb-4"
        style={{ gridTemplateColumns: `repeat(${displayCols}, minmax(0, 1fr))`, maxWidth: `${displayCols * 36}px` }}
      >
        {Array.from({ length: displayRows }, (_, ri) =>
          Array.from({ length: displayCols }, (_, ci) => {
            const r = ri + minR
            const c = ci + minC
            const cell = puzzle.cells[r][c]
            const isActive = cell !== null
            const key = `${r},${c}`
            const isSelected = selectedCell?.row === r && selectedCell?.col === c
            const isHighlighted = highlightedCells.has(key)
            const userVal = userGrid[r][c]
            const isCorrect = userVal !== '' && userVal === cell
            const num = numberAt.get(key)

            return (
              <div
                key={key}
                onClick={() => handleCellClick(r, c)}
                className={`relative w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer select-none ${
                  !isActive
                    ? 'bg-[#0d0d0d]'
                    : isSelected
                      ? 'bg-[#c9a84c]/40'
                      : isHighlighted
                        ? 'bg-[#c9a84c]/15'
                        : 'bg-[#1a1a1a]'
                } ${isCorrect ? 'text-green-400' : 'text-white'}`}
              >
                {num && (
                  <span className="absolute top-0 left-0.5 text-[7px] text-gray-500">{num}</span>
                )}
                {isActive && userVal}
              </div>
            )
          })
        )}
      </div>

      {selectedWord && (
        <div className="text-center mb-4 px-4">
          <span className="text-[#c9a84c] text-xs mr-2">
            {selectedWord.number} {selectedWord.direction.toUpperCase()}
          </span>
          <span className="text-gray-300 text-sm">{selectedWord.clue}</span>
        </div>
      )}

      <div className="w-full px-4 space-y-4 text-sm">
        {acrossClues.length > 0 && (
          <div>
            <h3 className="text-[#c9a84c] text-xs uppercase tracking-wide mb-1">Across</h3>
            {acrossClues.map((w) => (
              <p
                key={`a-${w.number}`}
                onClick={() => { setSelectedWord(w); setSelectedCell({ row: w.row, col: w.col }); inputRef.current?.focus() }}
                className={`py-0.5 cursor-pointer ${selectedWord === w ? 'text-white' : 'text-gray-500'}`}
              >
                <span className="text-gray-600 mr-1">{w.number}.</span> {w.clue}
              </p>
            ))}
          </div>
        )}
        {downClues.length > 0 && (
          <div>
            <h3 className="text-[#c9a84c] text-xs uppercase tracking-wide mb-1">Down</h3>
            {downClues.map((w) => (
              <p
                key={`d-${w.number}`}
                onClick={() => { setSelectedWord(w); setSelectedCell({ row: w.row, col: w.col }); inputRef.current?.focus() }}
                className={`py-0.5 cursor-pointer ${selectedWord === w ? 'text-white' : 'text-gray-500'}`}
              >
                <span className="text-gray-600 mr-1">{w.number}.</span> {w.clue}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
