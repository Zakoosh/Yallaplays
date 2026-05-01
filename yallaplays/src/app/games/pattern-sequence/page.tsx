'use client'

import { useEffect, useRef, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const pads = [
  { color: '#ef4444', label: 'red' },
  { color: '#22c55e', label: 'green' },
  { color: '#06b6d4', label: 'blue' },
  { color: '#f59e0b', label: 'yellow' },
]

function nextStep() {
  return Math.floor(Math.random() * pads.length)
}

export default function PatternSequencePage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'watch' | 'repeat' | 'over'>('idle')
  const [sequence, setSequence] = useState<number[]>([])
  const [inputIndex, setInputIndex] = useState(0)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const clearTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer))
    timersRef.current = []
  }

  useEffect(() => clearTimers, [])

  const showSequence = (steps: number[]) => {
    clearTimers()
    setPhase('watch')
    setInputIndex(0)
    steps.forEach((pad, index) => {
      timersRef.current.push(setTimeout(() => setActivePad(pad), 650 * index + 250))
      timersRef.current.push(setTimeout(() => setActivePad(null), 650 * index + 560))
    })
    timersRef.current.push(setTimeout(() => setPhase('repeat'), 650 * steps.length + 300))
  }

  const startGame = () => {
    const first = [nextStep()]
    setSequence(first)
    setScore(0)
    setActivePad(null)
    showSequence(first)
  }

  const pressPad = (pad: number) => {
    if (phase !== 'repeat') return
    setActivePad(pad)
    setTimeout(() => setActivePad(null), 180)

    if (sequence[inputIndex] !== pad) {
      setPhase('over')
      setBest(value => Math.max(value, score))
      return
    }

    if (inputIndex === sequence.length - 1) {
      const nextScore = score + sequence.length * 10
      const nextSequence = [...sequence, nextStep()]
      setScore(nextScore)
      setBest(value => Math.max(value, nextScore))
      setSequence(nextSequence)
      setTimeout(() => showSequence(nextSequence), 500)
      return
    }

    setInputIndex(index => index + 1)
  }

  return (
    <GameLayout
      gameKey="patternSequence"
      stats={[
        { label: t.patternSequence.round, value: sequence.length || 0, color: '#7c3aed' },
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.best, value: best, color: '#f59e0b' },
      ]}
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.patternSequence.instructions}</p>
            <button
              onClick={startGame}
              className="rounded-xl px-8 py-4 text-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.ui.start}
            </button>
          </div>
        )}

        {phase !== 'idle' && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-5">
            <p className="text-xl font-black text-white">
              {phase === 'watch' ? t.patternSequence.watch : phase === 'repeat' ? t.patternSequence.repeat : t.ui.gameOver}
            </p>

            <div className="grid w-full grid-cols-2 gap-3">
              {pads.map((pad, index) => (
                <button
                  key={pad.label}
                  onClick={() => pressPad(index)}
                  className={`aspect-square rounded-2xl border-4 transition-all ${
                    activePad === index ? 'scale-105 border-white brightness-125' : 'border-white/10 brightness-75'
                  }`}
                  style={{ backgroundColor: pad.color }}
                  aria-label={pad.label}
                />
              ))}
            </div>

            {phase === 'over' && (
              <button
                onClick={startGame}
                className="rounded-xl px-7 py-3 font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                {t.ui.playAgain}
              </button>
            )}
          </div>
        )}
      </div>
    </GameLayout>
  )
}
