'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Grid = (number | 0)[][]

const tileColors: Record<number, { bg: string; text: string }> = {
  0: { bg: '#1a1a2e', text: 'transparent' },
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#fff' },
  16: { bg: '#f59563', text: '#fff' },
  32: { bg: '#f67c5f', text: '#fff' },
  64: { bg: '#f65e3b', text: '#fff' },
  128: { bg: '#edcf72', text: '#fff' },
  256: { bg: '#edcc61', text: '#fff' },
  512: { bg: '#edc850', text: '#fff' },
  1024: { bg: '#edc53f', text: '#fff' },
  2048: { bg: '#edc22e', text: '#fff' },
}

function newGrid(): Grid {
  const g: Grid = Array(4).fill(null).map(() => Array(4).fill(0))
  addRandom(g); addRandom(g)
  return g
}

function addRandom(g: Grid) {
  const empty: [number,number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!g[r][c]) empty.push([r,c])
  if (!empty.length) return
  const [r,c] = empty[Math.floor(Math.random() * empty.length)]
  g[r][c] = Math.random() < 0.9 ? 2 : 4
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const nums = row.filter(x => x !== 0)
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2)
      score += nums[i] * 2
      i += 2
    } else {
      merged.push(nums[i])
      i++
    }
  }
  while (merged.length < 4) merged.push(0)
  return { row: merged, score }
}

function move(grid: Grid, dir: 'left'|'right'|'up'|'down'): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map(r => [...r])
  let totalScore = 0
  let moved = false

  const applySlide = () => {
    for (let r = 0; r < 4; r++) {
      const { row, score } = slideRow(g[r])
      if (row.join() !== g[r].join()) moved = true
      g[r] = row
      totalScore += score
    }
  }

  const rotCW = (gr: Grid) => gr[0].map((_, c) => gr.map(row => row[c]).reverse())
  const rotCCW = (gr: Grid) => gr[0].map((_, c) => gr.map(row => row[row.length - 1 - c]))

  if (dir === 'left') { applySlide() }
  else if (dir === 'right') { g = g.map(r => [...r].reverse()); applySlide(); g = g.map(r => [...r].reverse()) }
  else if (dir === 'up') { g = rotCCW(g) as Grid; applySlide(); g = rotCW(g) as Grid }
  else { g = rotCW(g) as Grid; applySlide(); g = rotCCW(g) as Grid }

  if (moved) addRandom(g)
  return { grid: g, score: totalScore, moved }
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!grid[r][c]) return true
    if (c < 3 && grid[r][c] === grid[r][c+1]) return true
    if (r < 3 && grid[r][c] === grid[r+1][c]) return true
  }
  return false
}

function has2048(grid: Grid): boolean {
  return grid.some(row => row.includes(2048))
}

export default function Page2048() {
  const { t } = useLang()
  const [grid, setGrid] = useState<Grid>(newGrid)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [won, setWon] = useState(false)
  const [over, setOver] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('2048_best') || '0')
    setBest(saved)
  }, [])

  const doMove = useCallback((dir: 'left'|'right'|'up'|'down') => {
    if (over) return
    setGrid(prev => {
      const result = move(prev, dir)
      if (!result.moved) return prev
      setScore(s => {
        const ns = s + result.score
        setBest(b => {
          const nb = Math.max(b, ns)
          localStorage.setItem('2048_best', String(nb))
          return nb
        })
        return ns
      })
      if (has2048(result.grid)) setWon(true)
      if (!canMove(result.grid)) setOver(true)
      return result.grid
    })
  }, [over])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { doMove('left'); e.preventDefault() }
      else if (e.key === 'ArrowRight') { doMove('right'); e.preventDefault() }
      else if (e.key === 'ArrowUp') { doMove('up'); e.preventDefault() }
      else if (e.key === 'ArrowDown') { doMove('down'); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doMove])

  const restart = () => {
    setGrid(newGrid())
    setScore(0)
    setWon(false)
    setOver(false)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) doMove('right')
      else if (dx < -30) doMove('left')
    } else {
      if (dy > 30) doMove('down')
      else if (dy < -30) doMove('up')
    }
    touchStart.current = null
  }

  const getTileStyle = (val: number) => {
    const c = tileColors[Math.min(val, 2048)] || { bg: '#3c3a32', text: '#fff' }
    return {
      backgroundColor: c.bg,
      color: c.text,
      fontSize: val >= 1024 ? '1.2rem' : val >= 128 ? '1.5rem' : '1.8rem',
    }
  }

  return (
    <GameLayout
      gameKey="2048"
      stats={[
        { label: t.ui.score, value: score, color: '#f59e0b' },
        { label: t.ui.best, value: best, color: '#22c55e' },
      ]}
    >
      <div className="p-6 flex flex-col items-center gap-4">
        {(won || over) && (
          <div className={`text-xl font-bold px-6 py-3 rounded-xl ${won ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {won ? `${t.ui.youWin} 🎉` : t.ui.gameOver}
          </div>
        )}

        {/* Grid */}
        <div
          className="rounded-2xl p-3 select-none"
          style={{ backgroundColor: '#3c3a32', touchAction: 'none' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="grid grid-cols-4 gap-2" style={{ width: 'min(340px, 90vw)' }}>
            {grid.flat().map((val, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-black rounded-lg transition-all duration-100"
                style={{ ...getTileStyle(val), aspectRatio: '1', width: '100%' }}
              >
                {val !== 0 ? val : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile arrow buttons */}
        <div className="flex flex-col items-center gap-1 md:hidden">
          <button className="touch-btn" onPointerDown={() => doMove('up')}>▲</button>
          <div className="flex gap-1">
            <button className="touch-btn" onPointerDown={() => doMove('left')}>◄</button>
            <button className="touch-btn" onPointerDown={() => doMove('down')}>▼</button>
            <button className="touch-btn" onPointerDown={() => doMove('right')}>►</button>
          </div>
        </div>

        <button
          onClick={restart}
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          {t.ui.newGame}
        </button>

        <p className="text-text-muted text-xs hidden md:block">
          ← → ↑ ↓ {t.ui.mobileControls}
        </p>
      </div>
    </GameLayout>
  )
}
