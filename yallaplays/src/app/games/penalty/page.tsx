'use client'

import { useEffect, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Difficulty = 'easy' | 'medium' | 'hard'
type Result = 'goal' | 'saved' | 'miss' | null

const keeperSpeed: Record<Difficulty, number> = {
  easy: 950,
  medium: 700,
  hard: 480,
}

const maxShots = 5

function randomCell() {
  return Math.floor(Math.random() * 9)
}

export default function PenaltyPage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [target, setTarget] = useState(4)
  const [keeper, setKeeper] = useState(4)
  const [power, setPower] = useState(70)
  const [shots, setShots] = useState(0)
  const [goals, setGoals] = useState(0)
  const [result, setResult] = useState<Result>(null)

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = setInterval(() => setKeeper(randomCell()), keeperSpeed[difficulty])
    return () => clearInterval(timer)
  }, [difficulty, phase])

  const startGame = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setPhase('playing')
    setTarget(4)
    setKeeper(randomCell())
    setPower(70)
    setShots(0)
    setGoals(0)
    setResult(null)
  }

  const shoot = () => {
    if (phase !== 'playing') return
    const miss = power < 35 || power > 95
    const saved = target === keeper
    const scored = !miss && !saved
    const nextShots = shots + 1

    setResult(scored ? 'goal' : saved ? 'saved' : 'miss')
    if (scored) setGoals(value => value + 1)
    setShots(nextShots)

    if (nextShots >= maxShots) {
      setPhase('over')
    } else {
      setKeeper(randomCell())
    }
  }

  const resultText = () => {
    if (result === 'goal') return t.penalty.goals
    if (result === 'saved') return t.penalty.saved
    if (result === 'miss') return t.ui.wrong
    return t.penalty.aim
  }

  return (
    <GameLayout
      gameKey="penalty"
      stats={[
        { label: t.penalty.goals, value: goals, color: '#22c55e' },
        { label: t.penalty.shots, value: `${shots}/${maxShots}`, color: '#7c3aed' },
        { label: t.ui.difficulty, value: t.ui[difficulty], color: '#f59e0b' },
      ]}
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.penalty.instructions}</p>
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
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="rounded-xl border border-white/10 bg-green-950/30 p-4">
              <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-xl border-4 border-white/60 bg-gradient-to-b from-cyan-950/60 to-green-950/50 p-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTarget(index)}
                    className={`relative aspect-[1.35] rounded-lg border transition-all ${
                      target === index ? 'border-accent-amber bg-amber-400/20' : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    aria-label={`${t.penalty.aim} ${index + 1}`}
                  >
                    {keeper === index && <span className="absolute inset-0 flex items-center justify-center text-3xl">🧤</span>}
                    {target === index && <span className="absolute inset-0 flex items-center justify-center text-xl">⚽</span>}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-xl font-black text-white">{resultText()}</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-bg-elevated p-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-white">{t.penalty.power}</span>
                  <span className="text-accent-cyan">{power}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={power}
                  onChange={event => setPower(Number(event.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                  <button
                    key={level}
                    onClick={() => startGame(level)}
                    className={`rounded-lg px-2 py-2 text-xs font-bold ${
                      difficulty === level ? 'bg-accent-purple text-white' : 'border border-white/10 text-text-muted hover:text-white'
                    }`}
                  >
                    {t.ui[level]}
                  </button>
                ))}
              </div>

              {phase === 'playing' ? (
                <button
                  onClick={shoot}
                  className="rounded-xl px-6 py-3 text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {t.penalty.shoot}
                </button>
              ) : (
                <button
                  onClick={() => startGame()}
                  className="rounded-xl px-6 py-3 text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {t.ui.playAgain}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
