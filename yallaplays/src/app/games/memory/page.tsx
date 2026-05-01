'use client'
import { useState, useEffect, useRef } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const EMOJIS = ['🎮','🎯','🎲','🃏','🎪','🎨','🎭','🎬','🚀','🏆','⚡','🌟','🔥','💎','🎵','🦋','🐉','🌈']

function buildDeck(pairs: number): string[] {
  const picked = EMOJIS.slice(0, pairs)
  const deck = [...picked, ...picked]
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

type Difficulty = 'easy' | 'medium' | 'hard'
const configs: Record<Difficulty, { cols: number; pairs: number }> = {
  easy: { cols: 4, pairs: 8 },
  medium: { cols: 6, pairs: 12 },
  hard: { cols: 6, pairs: 18 },
}

export default function MemoryPage() {
  const { t } = useLang()
  const [diff, setDiff] = useState<Difficulty>('easy')
  const [deck, setDeck] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const [won, setWon] = useState(false)
  const lockRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startGame = (d: Difficulty = diff) => {
    const cfg = configs[d]
    setDeck(buildDeck(cfg.pairs))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setStarted(true)
    setWon(false)
    lockRef.current = false
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTime(p => p + 1), 1000)
  }

  useEffect(() => {
    startGame()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (started && deck.length > 0 && matched.length === deck.length && !won) {
      setWon(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [matched, deck.length, started, won])

  const flip = (i: number) => {
    if (lockRef.current || flipped.includes(i) || matched.includes(i) || won) return
    const newFlipped = [...flipped, i]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      lockRef.current = true
      setTimeout(() => {
        if (deck[newFlipped[0]] === deck[newFlipped[1]]) {
          setMatched(m => [...m, newFlipped[0], newFlipped[1]])
        }
        setFlipped([])
        lockRef.current = false
      }, 800)
    }
  }

  const cfg = configs[diff]
  const isFlipped = (i: number) => flipped.includes(i) || matched.includes(i)
  const isMatched = (i: number) => matched.includes(i)

  return (
    <GameLayout
      gameKey="memory"
      stats={[
        { label: t.ui.moves, value: moves, color: '#7c3aed' },
        { label: t.ui.matched, value: matched.length / 2, color: '#22c55e' },
        { label: t.ui.time, value: `${time}${t.ui.seconds}`, color: '#06b6d4' },
      ]}
    >
      <div className="p-4 flex flex-col items-center gap-4">
        {/* Difficulty */}
        <div className="flex gap-2">
          {(['easy','medium','hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => { setDiff(d); startGame(d) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                diff === d
                  ? 'bg-accent-purple text-white'
                  : 'border border-white/20 text-text-muted hover:border-white/40 hover:text-white'
              }`}
            >
              {t.ui[d]}
            </button>
          ))}
        </div>

        {/* Win message */}
        {won && (
          <div className="text-2xl font-bold text-green-400 animate-bounce">
            {t.ui.youWin} 🎉 — {moves} {t.ui.moves}, {time}{t.ui.seconds}
          </div>
        )}

        {/* Grid */}
        <div
          className="grid gap-2 w-full"
          style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`, maxWidth: cfg.cols === 4 ? 320 : 420 }}
        >
          {deck.map((emoji, i) => (
            <div
              key={i}
              className="flip-card aspect-square cursor-pointer"
              style={{ fontSize: cfg.cols === 6 ? '1.5rem' : '2rem' }}
              onClick={() => flip(i)}
            >
              <div className={`flip-card-inner ${isFlipped(i) ? 'flipped' : ''}`} style={{ width: '100%', height: '100%' }}>
                {/* Front = hidden */}
                <div
                  className="flip-card-front"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)',
                    border: '2px solid rgba(124,58,237,0.3)',
                  }}
                >
                  <span className="text-accent-purple text-xl">?</span>
                </div>
                {/* Back = emoji */}
                <div
                  className="flip-card-back"
                  style={{
                    background: isMatched(i)
                      ? 'linear-gradient(135deg, #052e16, #14532d)'
                      : 'linear-gradient(135deg, #1e1b4b, #312e81)',
                    border: isMatched(i) ? '2px solid #22c55e' : '2px solid rgba(124,58,237,0.5)',
                  }}
                >
                  {emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => startGame()}
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          {t.ui.restart}
        </button>
      </div>
    </GameLayout>
  )
}
