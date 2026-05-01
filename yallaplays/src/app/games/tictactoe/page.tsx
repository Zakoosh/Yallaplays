'use client'
import { useState, useEffect } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Cell = 'X' | 'O' | null
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function checkWinner(board: Cell[]): { winner: Cell; line: number[] | null } {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] }
    }
  }
  return { winner: null, line: null }
}

function minimax(board: Cell[], isMax: boolean): number {
  const { winner } = checkWinner(board)
  if (winner === 'O') return 10
  if (winner === 'X') return -10
  if (!board.includes(null)) return 0
  if (isMax) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O'
        best = Math.max(best, minimax(board, false))
        board[i] = null
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X'
        best = Math.min(best, minimax(board, true))
        board[i] = null
      }
    }
    return best
  }
}

function bestMove(board: Cell[]): number {
  let best = -Infinity, idx = -1
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      const val = minimax(board, false)
      board[i] = null
      if (val > best) { best = val; idx = i }
    }
  }
  return idx
}

export default function TicTacToePage() {
  const { t } = useLang()
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [draws, setDraws] = useState(0)
  const [winLine, setWinLine] = useState<number[] | null>(null)
  const [message, setMessage] = useState('')
  const [thinking, setThinking] = useState(false)

  const { winner, line } = checkWinner(board)
  const isDraw = !winner && !board.includes(null)

  useEffect(() => {
    if (winner) {
      setWinLine(line)
      if (winner === 'X') { setMessage(t.ui.youWinExclaim); setWins(w => w + 1) }
      else { setMessage(t.ui.aiWins); setLosses(l => l + 1) }
    } else if (isDraw) {
      setMessage(t.ui.draw)
      setDraws(d => d + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board])

  useEffect(() => {
    if (!xTurn && !winner && !isDraw && !thinking) {
      setThinking(true)
      setTimeout(() => {
        setBoard(prev => {
          const copy = [...prev]
          const idx = bestMove(copy)
          if (idx !== -1) copy[idx] = 'O'
          return copy
        })
        setXTurn(true)
        setThinking(false)
      }, 400)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xTurn, board])

  const click = (i: number) => {
    if (board[i] || winner || isDraw || !xTurn || thinking) return
    const next = [...board]
    next[i] = 'X'
    setBoard(next)
    setXTurn(false)
  }

  const restart = () => {
    setBoard(Array(9).fill(null))
    setXTurn(true)
    setWinLine(null)
    setMessage('')
  }

  const cellStyle = (i: number) => {
    const isWin = winLine?.includes(i)
    const val = board[i]
    let base = 'w-full aspect-square flex items-center justify-center text-4xl md:text-5xl font-black rounded-xl border-2 cursor-pointer transition-all duration-200 select-none '
    if (isWin) base += 'border-accent-amber bg-amber-500/20 scale-105 '
    else if (val === 'X') base += 'border-blue-500/50 bg-blue-500/10 '
    else if (val === 'O') base += 'border-red-500/50 bg-red-500/10 '
    else base += 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 '
    return base
  }

  return (
    <GameLayout
      gameKey="tictactoe"
      stats={[
        { label: t.ui.wins, value: wins, color: '#22c55e' },
        { label: t.ui.draws, value: draws, color: '#f59e0b' },
        { label: t.ui.losses, value: losses, color: '#ef4444' },
      ]}
    >
      <div className="p-6 flex flex-col items-center gap-6">
        {/* Status */}
        {message ? (
          <div className={`text-2xl font-bold px-6 py-3 rounded-xl ${
            message.includes('🎉') ? 'text-green-400 bg-green-500/10' :
            message.includes('🤖') ? 'text-red-400 bg-red-500/10' :
            'text-amber-400 bg-amber-500/10'
          }`}>
            {message}
          </div>
        ) : (
          <div className="text-text-muted text-sm">
            {thinking ? '🤖 ...' : xTurn ? `${t.ui.score}: X` : `${t.ui.score}: O`}
          </div>
        )}

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs md:max-w-sm">
          {board.map((cell, i) => (
            <button key={i} className={cellStyle(i)} onClick={() => click(i)}>
              {cell === 'X' && <span className="text-blue-400">✕</span>}
              {cell === 'O' && <span className="text-red-400">○</span>}
            </button>
          ))}
        </div>

        {/* New game */}
        <button
          onClick={restart}
          className="px-6 py-3 rounded-xl font-bold text-white mt-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          {t.ui.newGame}
        </button>
      </div>
    </GameLayout>
  )
}
