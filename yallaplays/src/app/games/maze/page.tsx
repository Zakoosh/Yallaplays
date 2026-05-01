'use client'

import { useEffect, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

interface Position {
  row: number
  col: number
}

const levels = [
  [
    '########',
    '#S...#F#',
    '#.##.#.#',
    '#....#.#',
    '####...#',
    '#......#',
    '#.######',
    '########',
  ],
  [
    '########',
    '#S#....#',
    '#.#.##.#',
    '#.#..#.#',
    '#.##.#F#',
    '#....#.#',
    '####...#',
    '########',
  ],
  [
    '########',
    '#S.....#',
    '###.##.#',
    '#...#..#',
    '#.###.##',
    '#...#F.#',
    '#.#....#',
    '########',
  ],
]

function findTile(map: string[], tile: string): Position {
  for (let row = 0; row < map.length; row++) {
    const col = map[row].indexOf(tile)
    if (col >= 0) return { row, col }
  }
  return { row: 1, col: 1 }
}

export default function MazePage() {
  const { t } = useLang()
  const [level, setLevel] = useState(0)
  const [player, setPlayer] = useState(findTile(levels[0], 'S'))
  const [steps, setSteps] = useState(0)
  const [won, setWon] = useState(false)

  const resetLevel = (nextLevel = level) => {
    setLevel(nextLevel)
    setPlayer(findTile(levels[nextLevel], 'S'))
    setSteps(0)
    setWon(false)
  }

  const move = (dr: number, dc: number) => {
    if (won) return
    const map = levels[level]
    const next = { row: player.row + dr, col: player.col + dc }
    const tile = map[next.row]?.[next.col]
    if (!tile || tile === '#') return

    setPlayer(next)
    setSteps(value => value + 1)
    if (tile === 'F') {
      setWon(true)
      setTimeout(() => {
        if (level < levels.length - 1) resetLevel(level + 1)
      }, 900)
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') move(-1, 0)
      if (event.key === 'ArrowDown') move(1, 0)
      if (event.key === 'ArrowLeft') move(0, -1)
      if (event.key === 'ArrowRight') move(0, 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const controls = (
    <div className="mx-auto grid w-fit grid-cols-3 gap-2">
      <span />
      <button onClick={() => move(-1, 0)} className="touch-btn">↑</button>
      <span />
      <button onClick={() => move(0, -1)} className="touch-btn">←</button>
      <button onClick={() => resetLevel()} className="touch-btn">↻</button>
      <button onClick={() => move(0, 1)} className="touch-btn">→</button>
      <span />
      <button onClick={() => move(1, 0)} className="touch-btn">↓</button>
      <span />
    </div>
  )

  return (
    <GameLayout
      gameKey="maze"
      stats={[
        { label: t.ui.level, value: `${level + 1}/${levels.length}`, color: '#7c3aed' },
        { label: t.maze.steps, value: steps, color: '#06b6d4' },
        { label: t.maze.finish, value: won ? t.ui.youWin : '-', color: '#22c55e' },
      ]}
      mobileControls={controls}
    >
      <div className="p-5">
        <p className="mb-4 text-center text-sm text-text-muted">{t.maze.instructions}</p>
        <div className="mx-auto grid max-w-md grid-cols-8 gap-1 rounded-xl border border-white/10 bg-bg-elevated p-2">
          {levels[level].flatMap((line, row) =>
            line.split('').map((tile, col) => {
              const isPlayer = player.row === row && player.col === col
              const isWall = tile === '#'
              const isFinish = tile === 'F'
              return (
                <div
                  key={`${row}-${col}`}
                  className={`flex aspect-square items-center justify-center rounded-md text-2xl ${
                    isWall ? 'bg-slate-800' : isFinish ? 'bg-green-500/25' : 'bg-white/5'
                  }`}
                >
                  {isPlayer ? '🙂' : isFinish ? '🏁' : ''}
                </div>
              )
            })
          )}
        </div>
        <div className="mt-5 hidden justify-center md:flex">{controls}</div>
      </div>
    </GameLayout>
  )
}
