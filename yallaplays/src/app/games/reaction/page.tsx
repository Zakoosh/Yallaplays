'use client'

import { useEffect, useRef, useState } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const rounds = 5

export default function ReactionPage() {
  const { t } = useLang()
  const [phase, setPhase] = useState<'idle' | 'waiting' | 'go' | 'done'>('idle')
  const [round, setRound] = useState(0)
  const [lastReaction, setLastReaction] = useState<number | null>(null)
  const [bestReaction, setBestReaction] = useState<number | null>(null)
  const [message, setMessage] = useState(t.reaction.instructions)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startRef = useRef(0)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const armRound = (nextRound: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setPhase('waiting')
    setRound(nextRound)
    setMessage(t.reaction.wait)
    const delay = Math.floor(Math.random() * 2400) + 1200
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('go')
      setMessage(t.reaction.now)
    }, delay)
  }

  const startGame = () => {
    setLastReaction(null)
    setBestReaction(null)
    armRound(1)
  }

  const clickPanel = () => {
    if (phase === 'idle' || phase === 'done') {
      startGame()
      return
    }

    if (phase === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setMessage(t.reaction.tooSoon)
      setLastReaction(null)
      setTimeout(() => armRound(round), 900)
      return
    }

    const reaction = Math.round(performance.now() - startRef.current)
    setLastReaction(reaction)
    setBestReaction(best => best === null ? reaction : Math.min(best, reaction))

    if (round >= rounds) {
      setPhase('done')
      setMessage(t.ui.finalScore)
      return
    }

    setMessage(`${reaction}ms`)
    setTimeout(() => armRound(round + 1), 900)
  }

  const panelStyle = {
    idle: 'from-slate-900 to-purple-950',
    waiting: 'from-amber-950 to-slate-950',
    go: 'from-green-700 to-emerald-950',
    done: 'from-purple-950 to-cyan-950',
  }[phase]

  return (
    <GameLayout
      gameKey="reaction"
      stats={[
        { label: t.patternSequence.round, value: `${round}/${rounds}`, color: '#7c3aed' },
        { label: t.reaction.reaction, value: lastReaction ? `${lastReaction}ms` : '-', color: '#06b6d4' },
        { label: t.ui.best, value: bestReaction ? `${bestReaction}ms` : '-', color: '#22c55e' },
      ]}
    >
      <div className="p-5">
        <button
          onClick={clickPanel}
          className={`flex min-h-[420px] w-full flex-col items-center justify-center gap-5 rounded-xl border border-white/10 bg-gradient-to-br ${panelStyle} p-6 text-center transition-colors`}
        >
          <span className="text-6xl">⚡</span>
          <span className="text-3xl font-black text-white">{message}</span>
          <span className="max-w-md text-sm text-text-primary">{t.reaction.instructions}</span>
        </button>
      </div>
    </GameLayout>
  )
}
