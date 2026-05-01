'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const COLS = 10, ROWS = 20, CELL = 30
const CW = COLS * CELL, CH = ROWS * CELL

type Board = (string | null)[][]
type Piece = { shape: number[][]; color: string; x: number; y: number }

const PIECES = [
  { shape: [[1,1,1,1]], color: '#06b6d4' },             // I
  { shape: [[1,1],[1,1]], color: '#f59e0b' },             // O
  { shape: [[0,1,0],[1,1,1]], color: '#7c3aed' },         // T
  { shape: [[0,1,1],[1,1,0]], color: '#22c55e' },         // S
  { shape: [[1,1,0],[0,1,1]], color: '#ef4444' },         // Z
  { shape: [[1,0,0],[1,1,1]], color: '#3b82f6' },         // J
  { shape: [[0,0,1],[1,1,1]], color: '#f97316' },         // L
]

function randomPiece(): Piece {
  const tmpl = PIECES[Math.floor(Math.random() * PIECES.length)]
  return { ...tmpl, shape: tmpl.shape.map(r => [...r]), x: Math.floor(COLS / 2) - Math.floor(tmpl.shape[0].length / 2), y: 0 }
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length, cols = shape[0].length
  const out: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = shape[r][c]
  return out
}

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function fits(board: Board, piece: Piece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const s = shape || piece.shape
  for (let r = 0; r < s.length; r++) for (let c = 0; c < s[0].length; c++) {
    if (!s[r][c]) continue
    const nx = piece.x + c + dx, ny = piece.y + r + dy
    if (nx < 0 || nx >= COLS || ny >= ROWS) return false
    if (ny >= 0 && board[ny][nx]) return false
  }
  return true
}

function place(board: Board, piece: Piece): Board {
  const nb = board.map(r => [...r])
  for (let r = 0; r < piece.shape.length; r++) for (let c = 0; c < piece.shape[0].length; c++) {
    if (piece.shape[r][c] && piece.y + r >= 0) nb[piece.y + r][piece.x + c] = piece.color
  }
  return nb
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const newBoard = board.filter(row => row.some(c => !c))
  const cleared = ROWS - newBoard.length
  while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(null))
  return { board: newBoard, cleared }
}

const LINE_SCORES = [0, 100, 300, 500, 800]

export default function TetrisPage() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextCanvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    board: emptyBoard(),
    current: randomPiece(),
    next: randomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    phase: 'idle' as 'idle' | 'playing' | 'paused' | 'over',
  })
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'paused' | 'over'>('idle')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const drawNext = useCallback(() => {
    const canvas = nextCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { next } = stateRef.current
    ctx.fillStyle = '#0d0d1a'
    ctx.fillRect(0, 0, 120, 80)
    const offX = (120 - next.shape[0].length * 24) / 2
    const offY = (80 - next.shape.length * 24) / 2
    for (let r = 0; r < next.shape.length; r++) for (let c = 0; c < next.shape[0].length; c++) {
      if (!next.shape[r][c]) continue
      ctx.fillStyle = next.color
      ctx.fillRect(offX + c * 24 + 1, offY + r * 24 + 1, 22, 22)
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { board, current, phase: ph } = stateRef.current

    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, CW, CH)

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, CH); ctx.stroke() }
    for (let j = 0; j <= ROWS; j++) { ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(CW, j * CELL); ctx.stroke() }

    // Board
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = board[r][c]!
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4)
      }
    }

    // Ghost piece
    if (ph === 'playing') {
      let ghostY = current.y
      while (fits(board, current, 0, ghostY - current.y + 1)) ghostY++
      if (ghostY !== current.y) {
        for (let r = 0; r < current.shape.length; r++) for (let c = 0; c < current.shape[0].length; c++) {
          if (!current.shape[r][c]) continue
          ctx.fillStyle = 'rgba(255,255,255,0.1)'
          ctx.fillRect((current.x + c) * CELL + 1, (ghostY + r) * CELL + 1, CELL - 2, CELL - 2)
        }
      }
    }

    // Current piece
    for (let r = 0; r < current.shape.length; r++) for (let c = 0; c < current.shape[0].length; c++) {
      if (!current.shape[r][c]) continue
      ctx.fillStyle = current.color
      ctx.fillRect((current.x + c) * CELL + 1, (current.y + r) * CELL + 1, CELL - 2, CELL - 2)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect((current.x + c) * CELL + 1, (current.y + r) * CELL + 1, CELL - 2, 4)
    }

    // Overlays
    if (ph === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.tapToStart, CW / 2, CH / 2)
    } else if (ph === 'over') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 30px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.gameOver, CW / 2, CH / 2 - 20)
    } else if (ph === 'paused') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('⏸ ' + t.ui.pause, CW / 2, CH / 2)
    }

    drawNext()
  }, [t, drawNext])

  const lockPiece = useCallback(() => {
    const s = stateRef.current
    const newBoard = place(s.board, s.current)
    const { board: cleared, cleared: n } = clearLines(newBoard)
    s.board = cleared
    s.score += LINE_SCORES[n] * s.level
    s.lines += n
    s.level = Math.floor(s.lines / 10) + 1
    setScore(s.score)
    setLines(s.lines)
    setLevel(s.level)
    s.current = s.next
    s.next = randomPiece()
    if (!fits(s.board, s.current)) {
      s.phase = 'over'
      setPhase('over')
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const drop = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'playing') return
    if (fits(s.board, s.current, 0, 1)) {
      s.current = { ...s.current, y: s.current.y + 1 }
    } else {
      lockPiece()
    }
    draw()
  }, [draw, lockPiece])

  const startGame = () => {
    stateRef.current = {
      board: emptyBoard(),
      current: randomPiece(),
      next: randomPiece(),
      score: 0,
      lines: 0,
      level: 1,
      phase: 'playing',
    }
    setScore(0); setLines(0); setLevel(1); setPhase('playing')
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(drop, 500)
    draw()
  }

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (phase === 'playing') {
      const speed = Math.max(100, 500 - (level - 1) * 50)
      timerRef.current = setInterval(drop, speed)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, level, drop])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (s.phase !== 'playing') return
      if (e.key === 'ArrowLeft' && fits(s.board, s.current, -1, 0)) { s.current = { ...s.current, x: s.current.x - 1 }; draw() }
      else if (e.key === 'ArrowRight' && fits(s.board, s.current, 1, 0)) { s.current = { ...s.current, x: s.current.x + 1 }; draw() }
      else if (e.key === 'ArrowDown') { drop() }
      else if (e.key === 'ArrowUp') {
        const rotated = rotate(s.current.shape)
        if (fits(s.board, s.current, 0, 0, rotated)) { s.current = { ...s.current, shape: rotated }; draw() }
      } else if (e.key === ' ') {
        // Hard drop
        while (fits(s.board, s.current, 0, 1)) s.current = { ...s.current, y: s.current.y + 1 }
        lockPiece(); draw()
      } else if (e.key === 'p' || e.key === 'P') {
        if (s.phase === 'playing') { s.phase = 'paused'; setPhase('paused') }
        else if (s.phase === 'paused') { s.phase = 'playing'; setPhase('playing') }
        draw()
      }
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [draw, drop, lockPiece])

  const moveBtn = (action: string) => {
    const s = stateRef.current
    if (s.phase !== 'playing') return
    if (action === 'left' && fits(s.board, s.current, -1, 0)) s.current = { ...s.current, x: s.current.x - 1 }
    else if (action === 'right' && fits(s.board, s.current, 1, 0)) s.current = { ...s.current, x: s.current.x + 1 }
    else if (action === 'down') drop()
    else if (action === 'rotate') {
      const rotated = rotate(s.current.shape)
      if (fits(s.board, s.current, 0, 0, rotated)) s.current = { ...s.current, shape: rotated }
    } else if (action === 'drop') {
      while (fits(s.board, s.current, 0, 1)) s.current = { ...s.current, y: s.current.y + 1 }
      lockPiece()
    }
    draw()
  }

  const togglePause = () => {
    const s = stateRef.current
    if (s.phase === 'playing') { s.phase = 'paused'; setPhase('paused') }
    else if (s.phase === 'paused') { s.phase = 'playing'; setPhase('playing') }
    draw()
  }

  const mobileControls = (
    <div className="flex flex-col items-center gap-2">
      <button className="touch-btn text-sm px-4" onPointerDown={() => moveBtn('rotate')}>↺ {t.ui.next}</button>
      <div className="flex gap-2">
        <button className="touch-btn" onPointerDown={() => moveBtn('left')}>◄</button>
        <button className="touch-btn" onPointerDown={() => moveBtn('down')}>▼</button>
        <button className="touch-btn" onPointerDown={() => moveBtn('right')}>►</button>
      </div>
      <button className="touch-btn w-32 text-sm" onPointerDown={() => moveBtn('drop')}>⬇ Drop</button>
    </div>
  )

  return (
    <GameLayout
      gameKey="tetris"
      stats={[
        { label: t.ui.score, value: score, color: '#7c3aed' },
        { label: t.ui.lines, value: lines, color: '#06b6d4' },
        { label: t.ui.level, value: level, color: '#f59e0b' },
      ]}
      mobileControls={mobileControls}
    >
      <div className="p-4 flex flex-col md:flex-row items-center md:items-start gap-4 justify-center">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="rounded-xl"
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />

        {/* Side panel */}
        <div className="flex flex-col gap-4 min-w-[120px]">
          <div className="rounded-xl p-3" style={{ backgroundColor: '#1a1a2e' }}>
            <p className="text-text-muted text-xs mb-2 uppercase">{t.ui.next}</p>
            <canvas ref={nextCanvasRef} width={120} height={80} className="rounded" />
          </div>

          {(phase === 'idle' || phase === 'over') ? (
            <button
              onClick={startGame}
              className="px-4 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {phase === 'over' ? t.ui.restart : t.ui.start}
            </button>
          ) : (
            <button
              onClick={togglePause}
              className="px-4 py-3 rounded-xl font-bold text-white text-sm border border-white/20"
            >
              {phase === 'paused' ? t.ui.resume : t.ui.pause}
            </button>
          )}
        </div>
      </div>
    </GameLayout>
  )
}
