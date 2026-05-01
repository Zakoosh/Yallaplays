'use client'

import { useEffect, useMemo, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Obstacle {
  id: string
  lane: number
  row: number
}

const rows = 6
const lanes = 3
const playerRow = rows - 1
const baseSpeed: Record<Difficulty, number> = {
  easy: 680,
  medium: 520,
  hard: 380,
}

const spawnChance: Record<Difficulty, number> = {
  easy: 0.45,
  medium: 0.58,
  hard: 0.72,
}

export default function RunnerPage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [playerLane, setPlayerLane] = useState(1)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [distance, setDistance] = useState(0)
  const [best, setBest] = useState(0)

  const speed = useMemo(() => Math.max(230, baseSpeed[difficulty] - distance * 3), [difficulty, distance])

  const startGame = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setPlayerLane(1)
    setObstacles([])
    setDistance(0)
    setPhase('playing')
  }

  const move = (direction: -1 | 1) => {
    if (phase !== 'playing') return
    setPlayerLane(lane => Math.max(0, Math.min(lanes - 1, lane + direction)))
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = setInterval(() => {
      setObstacles(prev => {
        const moved = prev
          .map(obstacle => ({ ...obstacle, row: obstacle.row + 1 }))
          .filter(obstacle => obstacle.row < rows)

        if (moved.some(obstacle => obstacle.row === playerRow && obstacle.lane === playerLane)) {
          setPhase('over')
          setBest(value => Math.max(value, distance))
          return moved
        }

        if (Math.random() < spawnChance[difficulty]) {
          moved.push({
            id: `${Date.now()}-${Math.random()}`,
            lane: Math.floor(Math.random() * lanes),
            row: 0,
          })
        }

        return moved
      })
      setDistance(value => value + 1)
    }, speed)

    return () => clearInterval(timer)
  }, [difficulty, distance, phase, playerLane, speed])

  const cellContent = (row: number, lane: number) => {
    const hasObstacle = obstacles.some(obstacle => obstacle.row === row && obstacle.lane === lane)
    const hasPlayer = row === playerRow && lane === playerLane
    if (hasPlayer) return '🏎️'
    if (hasObstacle) return '🚧'
    return ''
  }

  return (
    <GameLayout
      gameKey="runner"
      stats={[
        { label: t.runner.distance, value: distance, color: '#22c55e' },
        { label: t.ui.best, value: best, color: '#f59e0b' },
        { label: t.runner.speed, value: `${Math.round(1000 / speed)}x`, color: '#06b6d4' },
      ]}
      mobileControls={
        <div className="flex justify-center gap-4">
          <button onClick={() => move(-1)} className="touch-btn">{t.runner.left}</button>
          <button onClick={() => move(1)} className="touch-btn">{t.runner.right}</button>
        </div>
      }
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.runner.instructions}</p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    difficulty === level ? 'bg-accent-purple text-white' : 'border border-white/10 text-text-muted hover:text-white'
                  }`}
                >
                  {t.ui[level]}
                </button>
              ))}
            </div>
            <button
              onClick={() => startGame()}
              className="rounded-xl px-8 py-4 text-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.ui.start}
            </button>
          </div>
        )}

        {phase !== 'idle' && (
          <div className="mx-auto max-w-md">
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-slate-950/70 p-3">
              {Array.from({ length: rows }).flatMap((_, row) =>
                Array.from({ length: lanes }).map((__, lane) => (
                  <div
                    key={`${row}-${lane}`}
                    className="flex aspect-[1.25] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-3xl"
                  >
                    {cellContent(row, lane)}
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button onClick={() => move(-1)} className="hidden rounded-lg border border-white/10 px-5 py-3 font-bold text-text-muted hover:text-white md:block">
                {t.runner.left}
              </button>
              {phase === 'playing' ? (
                <button
                  onClick={() => setPhase('over')}
                  className="rounded-lg border border-white/10 px-5 py-3 font-bold text-text-muted hover:text-white"
                >
                  {t.ui.pause}
                </button>
              ) : (
                <button
                  onClick={() => startGame()}
                  className="rounded-lg px-5 py-3 font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {t.ui.playAgain}
                </button>
              )}
              <button onClick={() => move(1)} className="hidden rounded-lg border border-white/10 px-5 py-3 font-bold text-text-muted hover:text-white md:block">
                {t.runner.right}
              </button>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
