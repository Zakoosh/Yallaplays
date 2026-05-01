'use client'

import { useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type ChoiceKey = 'layer' | 'icing' | 'topping' | 'plate'

const options: Record<ChoiceKey, string[]> = {
  layer: ['🍫', '🍓', '🍋', '🫐'],
  icing: ['🤍', '💗', '💜', '💛'],
  topping: ['🍒', '🍪', '🍬', '🥝'],
  plate: ['⚪', '🔵', '🟣', '🟡'],
}

const orders: Array<Record<ChoiceKey, number>> = [
  { layer: 1, icing: 1, topping: 0, plate: 0 },
  { layer: 0, icing: 2, topping: 1, plate: 2 },
  { layer: 2, icing: 3, topping: 2, plate: 3 },
  { layer: 3, icing: 0, topping: 3, plate: 1 },
]

const initialChoice: Record<ChoiceKey, number> = {
  layer: 0,
  icing: 0,
  topping: 0,
  plate: 0,
}

export default function CakeDecoratorPage() {
  const { t } = useLang()
  const [orderIndex, setOrderIndex] = useState(0)
  const [choice, setChoice] = useState(initialChoice)
  const [score, setScore] = useState(0)
  const [match, setMatch] = useState(0)
  const [round, setRound] = useState(1)

  const order = orders[orderIndex]

  const choose = (key: ChoiceKey, index: number) => {
    setChoice(prev => ({ ...prev, [key]: index }))
    setMatch(0)
  }

  const check = () => {
    const keys: ChoiceKey[] = ['layer', 'icing', 'topping', 'plate']
    const matches = keys.filter(key => choice[key] === order[key]).length
    const result = Math.round((matches / keys.length) * 100)
    setMatch(result)
    setScore(value => value + matches * 25)

    setTimeout(() => {
      setOrderIndex(index => (index + 1) % orders.length)
      setRound(value => value + 1)
      setChoice(initialChoice)
      setMatch(0)
    }, 800)
  }

  const renderGroup = (key: ChoiceKey, label: string) => (
    <div>
      <p className="mb-2 text-sm font-bold text-white">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {options[key].map((icon, index) => (
          <button
            key={`${key}-${index}`}
            onClick={() => choose(key, index)}
            className={`aspect-square rounded-lg border text-2xl transition-all ${
              choice[key] === index
                ? 'border-accent-purple bg-accent-purple/20'
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <GameLayout
      gameKey="cakeDecorator"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.patternSequence.round, value: round, color: '#7c3aed' },
        { label: t.coloring.match, value: `${match}%`, color: match >= 75 ? '#22c55e' : '#f59e0b' },
      ]}
    >
      <div className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-xl border border-white/10 bg-bg-elevated p-4 text-center">
          <p className="mb-2 text-sm text-text-muted">{t.cakeDecorator.order}</p>
          <div className="mb-5 grid grid-cols-4 gap-2 rounded-lg bg-white/5 p-2 text-2xl">
            <span>{options.layer[order.layer]}</span>
            <span>{options.icing[order.icing]}</span>
            <span>{options.topping[order.topping]}</span>
            <span>{options.plate[order.plate]}</span>
          </div>

          <div className="mx-auto flex h-56 max-w-56 flex-col items-center justify-end rounded-xl border border-white/10 bg-white/5 p-5">
            <span className="text-5xl">{options.topping[choice.topping]}</span>
            <span className="text-6xl">{options.icing[choice.icing]}</span>
            <span className="text-7xl">{options.layer[choice.layer]}</span>
            <span className="text-6xl">{options.plate[choice.plate]}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">{t.cakeDecorator.instructions}</p>
          {renderGroup('layer', t.cakeDecorator.layer)}
          {renderGroup('icing', t.cakeDecorator.icing)}
          {renderGroup('topping', t.cakeDecorator.topping)}
          {renderGroup('plate', t.cakeDecorator.plate)}
          <button
            onClick={check}
            className="rounded-xl px-6 py-3 text-base font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            {t.coloring.check}
          </button>
        </div>
      </div>
    </GameLayout>
  )
}
