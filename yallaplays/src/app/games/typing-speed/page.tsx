'use client'

import { FormEvent, useEffect, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const totalTime = 45

const words = {
  en: ['game', 'speed', 'player', 'rocket', 'winner', 'puzzle', 'score', 'level', 'arcade', 'bonus', 'memory', 'button'],
  ar: ['لعبة', 'سرعة', 'لاعب', 'فوز', 'نقاط', 'لغز', 'مستوى', 'ذاكرة', 'زر', 'نجاح', 'تحدي', 'مرحلة'],
}

function pickWord(lang: 'ar' | 'en') {
  const list = words[lang]
  return list[Math.floor(Math.random() * list.length)]
}

export default function TypingSpeedPage() {
  const { t, lang } = useLang()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [currentWord, setCurrentWord] = useState(pickWord(lang))
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [typed, setTyped] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [score, setScore] = useState(0)

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

  const startGame = () => {
    setCurrentWord(pickWord(lang))
    setInput('')
    setTimeLeft(totalTime)
    setTyped(0)
    setCorrect(0)
    setScore(0)
    setPhase('playing')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (phase !== 'playing') return
    const clean = input.trim()
    if (!clean) return

    setTyped(value => value + 1)
    if (clean === currentWord) {
      setCorrect(value => value + 1)
      setScore(value => value + 10 + Math.max(0, Math.floor(timeLeft / 3)))
    } else {
      setScore(value => Math.max(0, value - 4))
    }
    setCurrentWord(pickWord(lang))
    setInput('')
  }

  const accuracy = typed === 0 ? 100 : Math.round((correct / typed) * 100)

  return (
    <GameLayout
      gameKey="typingSpeed"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 10 ? '#ef4444' : '#06b6d4' },
        { label: t.typingSpeed.accuracy, value: `${accuracy}%`, color: '#f59e0b' },
      ]}
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.typingSpeed.instructions}</p>
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
          <div className="mx-auto flex min-h-80 max-w-xl flex-col items-center justify-center gap-6 text-center">
            <p className="text-sm text-text-muted">{t.typingSpeed.current}</p>
            <div className="rounded-2xl border border-white/10 bg-bg-elevated px-10 py-7 text-5xl font-black text-white">
              {currentWord}
            </div>

            <form onSubmit={submit} className="flex w-full max-w-md gap-2">
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                disabled={phase !== 'playing'}
                autoFocus
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg text-white outline-none focus:border-accent-purple"
              />
              <button
                disabled={phase !== 'playing'}
                className="rounded-xl px-5 py-3 font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              >
                Enter
              </button>
            </form>

            <p className="text-sm text-text-muted">
              {correct} / {typed} {t.typingSpeed.words}
            </p>

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
