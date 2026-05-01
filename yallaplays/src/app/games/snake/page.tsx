'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const CELL = 20
const COLS = 20
const ROWS = 20
const W = CELL * COLS
const H = CELL * ROWS

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Pos = { x: number; y: number }

function randomFood(snake: Pos[]): Pos {
  let pos: Pos
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (snake.some(s => s.x === pos.x && s.y === pos.y))
  return pos
}

export default function SnakePage() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: 15, y: 10 },
    score: 0,
    alive: false,
    started: false,
  })
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('snake_best') || '0')
    setBest(saved)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { snake, food } = stateRef.current

    // Background
    ctx.fillStyle = '#0d0d1a'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke()
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(W, j * CELL); ctx.stroke()
    }

    // Food
    ctx.fillStyle = '#ef4444'
    ctx.shadowColor = '#ef4444'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Snake
    snake.forEach((seg, i) => {
      const ratio = i / snake.length
      const r = Math.round(34 + (6 - 34) * ratio)
      const g = Math.round(197 + (182 - 197) * ratio)
      const b = Math.round(94 + (212 - 94) * ratio)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.shadowColor = i === 0 ? '#22c55e' : 'transparent'
      ctx.shadowBlur = i === 0 ? 10 : 0
      const pad = i === 0 ? 1 : 2
      ctx.beginPath()
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, i === 0 ? 6 : 3)
      ctx.fill()
    })
    ctx.shadowBlur = 0

    // Overlay messages
    if (!stateRef.current.started) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.tapToStart, W / 2, H / 2)
    } else if (!stateRef.current.alive) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 32px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.gameOver, W / 2, H / 2 - 20)
      ctx.fillStyle = '#fff'
      ctx.font = '18px Inter, sans-serif'
      ctx.fillText(`${t.ui.score}: ${stateRef.current.score}`, W / 2, H / 2 + 20)
    }
  }, [t])

  const reset = useCallback(() => {
    const init = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    stateRef.current = {
      snake: init,
      dir: 'RIGHT',
      nextDir: 'RIGHT',
      food: randomFood(init),
      score: 0,
      alive: true,
      started: true,
    }
    setScore(0)
    setPhase('playing')
  }, [])

  const tick = useCallback(() => {
    const s = stateRef.current
    if (!s.alive) return
    s.dir = s.nextDir
    const head = { ...s.snake[0] }
    if (s.dir === 'UP') head.y -= 1
    else if (s.dir === 'DOWN') head.y += 1
    else if (s.dir === 'LEFT') head.x -= 1
    else head.x += 1

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.alive = false
      setPhase('over')
      const newBest = Math.max(s.score, parseInt(localStorage.getItem('snake_best') || '0'))
      localStorage.setItem('snake_best', String(newBest))
      setBest(newBest)
      draw()
      return
    }

    const ate = head.x === s.food.x && head.y === s.food.y
    s.snake = [head, ...s.snake]
    if (!ate) s.snake.pop()
    else {
      s.food = randomFood(s.snake)
      s.score += 10
      setScore(s.score)
    }
    draw()
  }, [draw])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (phase === 'playing') {
      const speed = Math.max(80, 200 - Math.floor(score / 50) * 20)
      timerRef.current = setInterval(tick, speed)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, score, tick])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (!s.started && (e.key === ' ' || e.key.startsWith('Arrow') || e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd')) {
        reset(); return
      }
      if (s.alive) {
        if ((e.key === 'ArrowUp' || e.key === 'w') && s.dir !== 'DOWN') s.nextDir = 'UP'
        else if ((e.key === 'ArrowDown' || e.key === 's') && s.dir !== 'UP') s.nextDir = 'DOWN'
        else if ((e.key === 'ArrowLeft' || e.key === 'a') && s.dir !== 'RIGHT') s.nextDir = 'LEFT'
        else if ((e.key === 'ArrowRight' || e.key === 'd') && s.dir !== 'LEFT') s.nextDir = 'RIGHT'
      }
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reset])

  // Touch / swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const s = stateRef.current
    if (!s.started) { reset(); return }
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && s.dir !== 'LEFT') s.nextDir = 'RIGHT'
      else if (dx < -30 && s.dir !== 'RIGHT') s.nextDir = 'LEFT'
    } else {
      if (dy > 30 && s.dir !== 'UP') s.nextDir = 'DOWN'
      else if (dy < -30 && s.dir !== 'DOWN') s.nextDir = 'UP'
    }
    touchStart.current = null
  }

  const move = (dir: Dir) => {
    const s = stateRef.current
    if (!s.started) { reset(); return }
    if (s.alive) {
      if (dir === 'UP' && s.dir !== 'DOWN') s.nextDir = 'UP'
      else if (dir === 'DOWN' && s.dir !== 'UP') s.nextDir = 'DOWN'
      else if (dir === 'LEFT' && s.dir !== 'RIGHT') s.nextDir = 'LEFT'
      else if (dir === 'RIGHT' && s.dir !== 'LEFT') s.nextDir = 'RIGHT'
    } else {
      reset()
    }
  }

  const mobileControls = (
    <div className="flex flex-col items-center gap-2">
      <button className="touch-btn" onPointerDown={() => move('UP')}>▲</button>
      <div className="flex gap-2">
        <button className="touch-btn" onPointerDown={() => move('LEFT')}>◄</button>
        <button className="touch-btn" onPointerDown={() => move('DOWN')}>▼</button>
        <button className="touch-btn" onPointerDown={() => move('RIGHT')}>►</button>
      </div>
    </div>
  )

  return (
    <GameLayout
      gameKey="snake"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.best, value: best, color: '#f59e0b' },
      ]}
      mobileControls={mobileControls}
    >
      <div className="p-4 flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-xl cursor-pointer"
          style={{ maxWidth: '100%', touchAction: 'none' }}
          onClick={() => {
            if (!stateRef.current.started || !stateRef.current.alive) reset()
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        {(phase === 'idle' || phase === 'over') && (
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            {phase === 'over' ? t.ui.restart : t.ui.start}
          </button>
        )}
      </div>
    </GameLayout>
  )
}
