'use client'

import { useMemo, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type PatternKey = 'heart' | 'star' | 'rocket'

const palette = [
  { key: 'p', color: '#ec4899' },
  { key: 'c', color: '#06b6d4' },
  { key: 'y', color: '#f59e0b' },
  { key: 'g', color: '#22c55e' },
  { key: 'v', color: '#7c3aed' },
  { key: 'w', color: '#e2e8f0' },
]

const patterns: Record<PatternKey, string[]> = {
  heart: [
    '', 'p', 'p', '', 'p', 'p',
    'p', 'p', 'p', 'p', 'p', 'p',
    'p', 'p', 'p', 'p', 'p', 'p',
    '', 'p', 'p', 'p', 'p', '',
    '', '', 'p', 'p', '', '',
    '', '', '', '', '', '',
  ],
  star: [
    '', '', 'y', 'y', '', '',
    '', 'y', 'y', 'y', 'y', '',
    'y', 'y', 'w', 'w', 'y', 'y',
    '', 'y', 'y', 'y', 'y', '',
    'y', '', 'y', 'y', '', 'y',
    '', '', 'y', 'y', '', '',
  ],
  rocket: [
    '', '', 'c', 'c', '', '',
    '', 'c', 'w', 'w', 'c', '',
    '', 'c', 'v', 'v', 'c', '',
    '', 'c', 'c', 'c', 'c', '',
    'y', '', 'c', 'c', '', 'y',
    'p', 'y', '', '', 'y', 'p',
  ],
}

const patternOrder: PatternKey[] = ['heart', 'star', 'rocket']

function colorFor(key: string) {
  return palette.find(item => item.key === key)?.color || 'transparent'
}

export default function ColoringPage() {
  const { t } = useLang()
  const [patternKey, setPatternKey] = useState<PatternKey>('heart')
  const [selectedColor, setSelectedColor] = useState('p')
  const [board, setBoard] = useState<string[]>(Array(36).fill(''))
  const [match, setMatch] = useState(0)
  const [best, setBest] = useState(0)

  const target = patterns[patternKey]
  const requiredCells = useMemo(() => target.filter(Boolean).length, [target])

  const paint = (index: number) => {
    setBoard(prev => prev.map((cell, i) => i === index ? selectedColor : cell))
    setMatch(0)
  }

  const choosePattern = (key: PatternKey) => {
    setPatternKey(key)
    setBoard(Array(36).fill(''))
    setMatch(0)
  }

  const clear = () => {
    setBoard(Array(36).fill(''))
    setMatch(0)
  }

  const check = () => {
    let matches = 0
    let extra = 0
    board.forEach((cell, index) => {
      if (target[index] && cell === target[index]) matches++
      if (!target[index] && cell) extra++
    })
    const result = Math.max(0, Math.round(((matches - extra) / requiredCells) * 100))
    setMatch(result)
    setBest(prev => Math.max(prev, result))
  }

  const renderGrid = (cells: string[], interactive = false) => (
    <div className="grid grid-cols-6 gap-1 rounded-xl border border-white/10 bg-bg-elevated p-2">
      {cells.map((cell, index) => (
        <button
          key={index}
          type="button"
          onClick={() => interactive && paint(index)}
          className={`aspect-square rounded-md border border-white/10 ${interactive ? 'cursor-pointer hover:border-white/40' : 'cursor-default'}`}
          style={{ backgroundColor: colorFor(cell) }}
          aria-label={`${interactive ? t.coloring.canvas : t.coloring.target} ${index + 1}`}
        />
      ))}
    </div>
  )

  return (
    <GameLayout
      gameKey="coloring"
      stats={[
        { label: t.coloring.match, value: `${match}%`, color: match >= 90 ? '#22c55e' : '#06b6d4' },
        { label: t.ui.best, value: `${best}%`, color: '#f59e0b' },
        { label: t.ui.level, value: t.coloring.patterns[patternKey], color: '#ec4899' },
      ]}
    >
      <div className="p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-text-muted">{t.coloring.instructions}</p>
          <div className="flex flex-wrap gap-2">
            {patternOrder.map(key => (
              <button
                key={key}
                onClick={() => choosePattern(key)}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  patternKey === key
                    ? 'bg-accent-purple text-white'
                    : 'border border-white/10 text-text-muted hover:text-white'
                }`}
              >
                {t.coloring.patterns[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <p className="mb-2 text-sm font-bold text-white">{t.coloring.target}</p>
            {renderGrid(target)}
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-white">{t.coloring.canvas}</p>
            {renderGrid(board, true)}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {palette.map(item => (
              <button
                key={item.key}
                onClick={() => setSelectedColor(item.key)}
                className={`h-10 w-10 rounded-lg border-2 ${selectedColor === item.key ? 'border-white' : 'border-white/10'}`}
                style={{ backgroundColor: item.color }}
                aria-label={item.key}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={clear} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-text-muted hover:text-white">
              {t.coloring.clear}
            </button>
            <button
              onClick={check}
              className="rounded-lg px-5 py-2 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.coloring.check}
            </button>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
