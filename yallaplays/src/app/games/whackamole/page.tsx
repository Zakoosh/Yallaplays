'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const GRID = 9
const GAME_TIME = 30

export default function WhackAMolePage() {
  const { t } = useLang()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [active, setActive] = useState<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [whacked, setWhacked] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const moleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scoreRef = useRef(0)
  const timeRef = useRef(GAME_TIME)

  const popMole = useCallback((elapsed: number) => {
    const speed = Math.max(600, 1400 - elapsed * 15)
    const hole = Math.floor(Math.random() * GRID)
    setActive(hole)
    if (moleRef.current) clearTimeout(moleRef.current)
    moleRef.current = setTimeout(() => {
      setActive(null)
    }, speed)
  }, [])

  const startGame = () => {
    scoreRef.current = 0
    timeRef.current = GAME_TIME
    setScore(0)
    setTimeLeft(GAME_TIME)
    setPhase('playing')
    setActive(null)

    let elapsed = 0
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      elapsed++
      timeRef.current--
      setTimeLeft(timeRef.current)

      // Pop mole at irregular intervals
      if (elapsed % Math.max(1, Math.floor((40 - elapsed) / 10)) === 0) {
        popMole(elapsed)
      }

      if (timeRef.current <= 0) {
        clearInterval(timerRef.current!)
        if (moleRef.current) clearTimeout(moleRef.current)
        setActive(null)
        setPhase('over')
      }
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (moleRef.current) clearTimeout(moleRef.current)
    }
  }, [])

  const whack = (i: number) => {
    if (phase !== 'playing') return
    if (active === i) {
      scoreRef.current += 1
      setScore(scoreRef.current)
      setWhacked(i)
      setActive(null)
      setTimeout(() => setWhacked(null), 300)
    }
  }

  return (
    <GameLayout
      gameKey="whackamole"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 10 ? '#ef4444' : '#06b6d4' },
      ]}
    >
      <div className="p-6 flex flex-col items-center gap-6">
        {phase === 'over' && (
          <div className="text-2xl font-bold text-amber-400 animate-bounce">
            {t.ui.gameOver} — {score} 🏆
          </div>
        )}

        {/* Timer bar */}
        {phase === 'playing' && (
          <div className="w-full max-w-sm h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(timeLeft / GAME_TIME) * 100}%`,
                background: timeLeft > 10 ? '#22c55e' : '#ef4444',
              }}
            />
          </div>
        )}

        {/* Mole grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {Array.from({ length: GRID }, (_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              className="relative aspect-square rounded-2xl overflow-hidden transition-all duration-100 select-none"
              style={{
                backgroundColor: '#0d1a0d',
                border: active === i ? '2px solid #22c55e' : '2px solid #1a2e1a',
                cursor: phase === 'playing' ? 'pointer' : 'default',
              }}
            >
              {/* Hole */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: '70%',
                  height: '35%',
                  backgroundColor: '#050f05',
                  boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8)',
                }}
              />
              {/* Mole */}
              {(active === i || whacked === i) && (
                <div
                  className={`absolute bottom-0 left-0 right-0 flex items-end justify-center pb-1 ${whacked === i ? 'scale-75' : 'mole-visible'}`}
                  style={{ height: '75%' }}
                >
                  <span className="text-4xl" style={{ lineHeight: 1 }}>
                    {whacked === i ? '⭐' : '🦔'}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {(phase === 'idle' || phase === 'over') && (
          <button
            onClick={startGame}
            className="px-8 py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            {phase === 'over' ? t.ui.restart : t.ui.start}
          </button>
        )}
      </div>
    </GameLayout>
  )
}
