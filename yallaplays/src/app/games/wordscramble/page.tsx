'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const TOTAL_TIME = 60
const MAX_LIVES = 5

function scramble(word: string): string {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Make sure it's actually scrambled
  if (arr.join('') === word && word.length > 1) return scramble(word)
  return arr.join('')
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface LetterTile { id: number; letter: string; used: boolean }

export default function WordScramblePage() {
  const { t } = useLang()
  const words: string[] = t.wordscramble.words
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [wordQueue, setWordQueue] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState('')
  const [tiles, setTiles] = useState<LetterTile[]>([])
  const [answer, setAnswer] = useState<LetterTile[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [wordCount, setWordCount] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'skip' | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lockRef = useRef(false)

  const loadWord = useCallback((queue: string[], sc: number, lv: number) => {
    lockRef.current = false
    setFeedback(null)
    setHintUsed(false)
    setAnswer([])

    if (queue.length === 0 || lv <= 0) {
      setPhase('over')
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const word = queue[0]
    const rest = queue.slice(1)
    setWordQueue(rest)
    setCurrentWord(word)
    setWordCount(c => c + 1)

    const scrambled = scramble(word)
    setTiles(scrambled.split('').map((letter, i) => ({ id: i, letter, used: false })))
    setScore(sc)
    setLives(lv)
  }, [])

  const startGame = () => {
    const shuffled = shuffle([...words])
    setScore(0)
    setLives(MAX_LIVES)
    setTimeLeft(TOTAL_TIME)
    setWordCount(0)
    setPhase('playing')
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setPhase('over')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    loadWord(shuffled, 0, MAX_LIVES)
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const selectTile = (tile: LetterTile) => {
    if (lockRef.current || tile.used) return
    const newTiles = tiles.map(t => t.id === tile.id ? { ...t, used: true } : t)
    const newAnswer = [...answer, tile]
    setTiles(newTiles)
    setAnswer(newAnswer)

    // Check if answer matches word
    if (newAnswer.length === currentWord.length) {
      const formed = newAnswer.map(t => t.letter).join('')
      if (formed === currentWord) {
        lockRef.current = true
        const bonus = Math.floor(timeLeft * 2)
        const newScore = score + 100 + bonus
        setFeedback('correct')
        setTimeout(() => loadWord(wordQueue, newScore, lives), 700)
      } else {
        setFeedback('wrong')
        setTimeout(() => {
          setFeedback(null)
          const resetTiles = tiles.map(t => ({ ...t, used: false }))
          setTiles(resetTiles)
          setAnswer([])
        }, 600)
      }
    }
  }

  const removeFromAnswer = (tile: LetterTile, idx: number) => {
    if (lockRef.current) return
    const newAnswer = answer.filter((_, i) => i !== idx)
    const newTiles = tiles.map(t => t.id === tile.id ? { ...t, used: false } : t)
    setAnswer(newAnswer)
    setTiles(newTiles)
  }

  const useHint = () => {
    if (hintUsed || lockRef.current) return
    setHintUsed(true)
    // Clear answer, show first letter placed
    const resetTiles = tiles.map(t => ({ ...t, used: false }))
    // Find first letter tile
    const firstLetter = currentWord[0]
    const firstTile = resetTiles.find(t => t.letter === firstLetter && !t.used)
    if (firstTile) {
      firstTile.used = true
      setTiles(resetTiles)
      setAnswer([firstTile])
    }
  }

  const skipWord = () => {
    if (lockRef.current) return
    lockRef.current = true
    setFeedback('skip')
    const newLives = lives - 1
    setTimeout(() => {
      if (newLives <= 0) {
        setPhase('over')
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        loadWord(wordQueue, score, newLives)
      }
    }, 600)
  }

  const scrambleTiles = () => {
    if (lockRef.current) return
    const unused = tiles.filter(t => !t.used)
    const used = tiles.filter(t => t.used)
    const newUnused = shuffle(unused)
    // Rebuild tile array preserving positions
    const allTiles: LetterTile[] = []
    let ui = 0, si = 0
    for (const orig of tiles) {
      if (orig.used) { allTiles.push(used[si++]); }
      else { allTiles.push(newUnused[ui++]); }
    }
    setTiles(allTiles)
  }

  return (
    <GameLayout
      gameKey="wordscramble"
      stats={phase === 'playing' ? [
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.lives, value: '❤️'.repeat(lives), color: '#ef4444' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 10 ? '#ef4444' : '#06b6d4' },
      ] : []}
    >
      <div className="p-6 flex flex-col items-center gap-5 min-h-96">
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-text-muted text-center max-w-sm">{t.wordscramble.instructions}</p>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.ui.start}
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <>
            {/* Timer bar */}
            <div className="w-full max-w-md h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / TOTAL_TIME) * 100}%`,
                  background: timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>

            {/* Word count */}
            <p className="text-text-muted text-sm">#{wordCount}</p>

            {/* Feedback */}
            {feedback && (
              <div className={`text-xl font-bold ${
                feedback === 'correct' ? 'text-green-400' :
                feedback === 'wrong' ? 'text-red-400' :
                'text-amber-400'
              }`}>
                {feedback === 'correct' ? t.wordscramble.solved + ' 🎉' :
                 feedback === 'wrong' ? t.ui.wrong :
                 `${t.ui.skip}: ${currentWord}`}
              </div>
            )}

            {/* Answer slots */}
            <div className="flex gap-2 flex-wrap justify-center min-h-14">
              {currentWord.split('').map((_, i) => {
                const tile = answer[i]
                return (
                  <button
                    key={i}
                    onClick={() => tile && removeFromAnswer(tile, i)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      tile
                        ? 'border-accent-purple bg-accent-purple/20 text-white cursor-pointer hover:bg-accent-purple/30'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {tile?.letter || ''}
                  </button>
                )
              })}
            </div>

            {/* Scrambled tiles */}
            <div className="flex gap-2 flex-wrap justify-center">
              {tiles.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => selectTile(tile)}
                  disabled={tile.used}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                    tile.used
                      ? 'border-white/10 bg-white/5 text-transparent cursor-not-allowed'
                      : 'border-accent-cyan/50 bg-accent-cyan/10 text-white cursor-pointer hover:bg-accent-cyan/20 hover:border-accent-cyan active:scale-95'
                  }`}
                >
                  {tile.used ? '' : tile.letter}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={useHint}
                disabled={hintUsed}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  hintUsed ? 'opacity-40 cursor-not-allowed border border-white/10 text-text-muted' :
                  'border border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                💡 {t.ui.hint}
              </button>
              <button
                onClick={scrambleTiles}
                className="px-4 py-2 rounded-lg font-semibold text-sm border border-white/20 text-text-muted hover:text-white"
              >
                🔀 Mix
              </button>
              <button
                onClick={skipWord}
                className="px-4 py-2 rounded-lg font-semibold text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                ⏭ {t.ui.skip}
              </button>
            </div>
          </>
        )}

        {phase === 'over' && (
          <div className="flex flex-col items-center gap-6 py-4">
            <h2 className="text-3xl font-black text-white">
              {timeLeft <= 0 ? t.wordscramble.timeUp : t.ui.gameOver}
            </h2>
            <div className="rounded-xl p-6 text-center w-full max-w-xs" style={{ backgroundColor: '#1a1a2e' }}>
              <p className="text-text-muted text-sm mb-1">{t.ui.finalScore}</p>
              <p className="text-4xl font-black text-accent-purple">{score}</p>
              <p className="text-text-muted text-sm mt-2">{wordCount - 1} {t.ui.correct}</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.ui.playAgain}
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
