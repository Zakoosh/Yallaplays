'use client'

import { useEffect, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Bubble {
  id: string
  x: number
  y: number
  size: number
  color: string
}

const colors = ['#06b6d4', '#7c3aed', '#22c55e', '#f59e0b', '#ec4899']
const spawnDelay: Record<Difficulty, number> = { easy: 850, medium: 620, hard: 430 }
const gameTime = 35

function createBubble(): Bubble {
  return {
    id: `${Date.now()}-${Math.random()}`,
    x: Math.floor(Math.random() * 78) + 6,
    y: Math.floor(Math.random() * 72) + 8,
    size: Math.floor(Math.random() * 38) + 42,
    color: colors[Math.floor(Math.random() * colors.length)],
  }
}

export default function BubblePopPage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(gameTime)

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = setInterval(() => {
      setTimeLeft(value => {
        if (value <= 1) {
          setPhase('over')
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    const spawner = setInterval(() => {
      setBubbles(prev => [...prev.slice(-9), createBubble()])
    }, spawnDelay[difficulty])
    return () => clearInterval(spawner)
  }, [difficulty, phase])

  const startGame = (nextDifficulty = difficulty) => {
    setDifficulty(nextDifficulty)
    setPhase('playing')
    setBubbles([createBubble(), createBubble()])
    setScore(0)
    setCombo(0)
    setBestCombo(0)
    setTimeLeft(gameTime)
  }

  const popBubble = (id: string) => {
    const nextCombo = combo + 1
    setBubbles(prev => prev.filter(bubble => bubble.id !== id))
    setCombo(nextCombo)
    setBestCombo(value => Math.max(value, nextCombo))
    setScore(value => value + 10 + nextCombo * 2)
  }

  return (
    <GameLayout
      gameKey="bubblePop"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 8 ? '#ef4444' : '#06b6d4' },
        { label: t.bubblePop.combo, value: bestCombo, color: '#f59e0b' },
      ]}
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.bubblePop.instructions}</p>
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
          <div className="relative h-[440px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-cyan-950/40 to-purple-950/30">
            {bubbles.map(bubble => (
              <button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className="absolute rounded-full border-2 border-white/40 shadow-lg transition-transform hover:scale-110"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: bubble.size,
                  height: bubble.size,
                  background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.75), ${bubble.color})`,
                }}
                aria-label={t.bubblePop.bubbles}
              />
            ))}

            {phase === 'over' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 text-center">
                <h2 className="text-3xl font-black text-white">{t.ui.gameOver}</h2>
                <button
                  onClick={() => startGame()}
                  className="rounded-xl px-7 py-3 font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {t.ui.playAgain}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameLayout>
  )
}
