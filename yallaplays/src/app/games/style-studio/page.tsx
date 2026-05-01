'use client'

import { useEffect, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type ThemeKey = 'party' | 'sport' | 'school' | 'beach'
type ChoiceKey = 'hair' | 'outfit' | 'accessory' | 'background'

const themeOrder: ThemeKey[] = ['party', 'sport', 'school', 'beach']
const totalRounds = 5
const roundTime = 25

const choices: Record<ChoiceKey, string[]> = {
  hair: ['💇', '🧢', '🎀', '💫'],
  outfit: ['👕', '👗', '🎽', '🧥'],
  accessory: ['🎒', '🕶️', '🏅', '💎'],
  background: ['🎉', '🏟️', '🏫', '🏖️'],
}

const rules: Record<ThemeKey, Record<ChoiceKey, number>> = {
  party: { hair: 3, outfit: 1, accessory: 3, background: 0 },
  sport: { hair: 1, outfit: 2, accessory: 2, background: 1 },
  school: { hair: 0, outfit: 0, accessory: 0, background: 2 },
  beach: { hair: 2, outfit: 1, accessory: 1, background: 3 },
}

const initialSelection: Record<ChoiceKey, number> = {
  hair: 0,
  outfit: 0,
  accessory: 0,
  background: 0,
}

export default function StyleStudioPage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [theme, setTheme] = useState<ThemeKey>('party')
  const [selection, setSelection] = useState(initialSelection)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(roundTime)
  const [lastScore, setLastScore] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      scoreLook()
      return
    }
    const timer = setTimeout(() => setTimeLeft(value => value - 1), 1000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft])

  const startGame = () => {
    setTheme('party')
    setSelection(initialSelection)
    setScore(0)
    setRound(1)
    setTimeLeft(roundTime)
    setLastScore(null)
    setPhase('playing')
  }

  const choose = (group: ChoiceKey, index: number) => {
    setSelection(prev => ({ ...prev, [group]: index }))
  }

  const scoreLook = () => {
    if (phase !== 'playing') return
    const matchCount = (Object.keys(selection) as ChoiceKey[]).reduce((total, key) => {
      return total + (selection[key] === rules[theme][key] ? 1 : 0)
    }, 0)
    const earned = matchCount * 25 + Math.max(0, timeLeft)
    setScore(prev => prev + earned)
    setLastScore(earned)

    if (round >= totalRounds) {
      setPhase('over')
      return
    }

    const nextRound = round + 1
    setRound(nextRound)
    setTheme(themeOrder[(nextRound - 1) % themeOrder.length])
    setTimeLeft(roundTime)
  }

  const renderChoiceGroup = (key: ChoiceKey, label: string) => (
    <div>
      <p className="mb-2 text-sm font-bold text-white">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {choices[key].map((emoji, index) => (
          <button
            key={emoji}
            onClick={() => choose(key, index)}
            className={`aspect-square rounded-lg border text-2xl transition-all ${
              selection[key] === index
                ? 'border-accent-purple bg-accent-purple/20'
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
            aria-label={`${label} ${index + 1}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameLayout
      gameKey="styleStudio"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.level, value: `${round}/${totalRounds}`, color: '#7c3aed' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 8 ? '#ef4444' : '#06b6d4' },
      ]}
    >
      <div className="p-5">
        {phase === 'idle' && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-text-muted">{t.styleStudio.instructions}</p>
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
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-xl border border-white/10 bg-bg-elevated p-4 text-center">
              <p className="mb-2 text-sm text-text-muted">{t.styleStudio.theme}</p>
              <h2 className="mb-4 text-2xl font-black text-white">{t.styleStudio.themes[theme]}</h2>
              <div className="relative mx-auto flex h-56 max-w-56 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <span className="absolute inset-0 flex items-center justify-center text-8xl opacity-25">
                  {choices.background[selection.background]}
                </span>
                <span className="text-5xl">{choices.hair[selection.hair]}</span>
                <span className="text-6xl">{choices.outfit[selection.outfit]}</span>
                <span className="text-4xl">{choices.accessory[selection.accessory]}</span>
              </div>
              {lastScore !== null && (
                <p className="mt-4 text-sm font-bold text-accent-cyan">+{lastScore}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {renderChoiceGroup('hair', t.styleStudio.hair)}
              {renderChoiceGroup('outfit', t.styleStudio.outfit)}
              {renderChoiceGroup('accessory', t.styleStudio.accessory)}
              {renderChoiceGroup('background', t.styleStudio.background)}

              {phase === 'playing' ? (
                <button
                  onClick={scoreLook}
                  className="rounded-xl px-6 py-3 text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  {t.styleStudio.scoreLook}
                </button>
              ) : (
                <button
                  onClick={startGame}
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
