'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const CW = 480, CH = 600
const PADDLE_W = 80, PADDLE_H = 12, PADDLE_Y = CH - 40
const BALL_R = 8
const BRICK_ROWS = 5, BRICK_COLS = 8
const BRICK_W = Math.floor((CW - 20) / BRICK_COLS) - 2
const BRICK_H = 22
const BRICK_PAD = 2
const BRICK_TOP = 60

const ROW_COLORS = ['#ef4444','#f97316','#f59e0b','#22c55e','#06b6d4']

interface Brick { x: number; y: number; alive: boolean; color: string }

function makeBricks(): Brick[] {
  const bricks: Brick[] = []
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: 10 + c * (BRICK_W + BRICK_PAD),
        y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
        alive: true,
        color: ROW_COLORS[r],
      })
    }
  }
  return bricks
}

export default function BreakoutPage() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    paddle: CW / 2 - PADDLE_W / 2,
    ball: { x: CW / 2, y: PADDLE_Y - BALL_R - 2, vx: 3, vy: -4 },
    bricks: makeBricks(),
    score: 0,
    lives: 3,
    phase: 'idle' as 'idle' | 'playing' | 'over' | 'won',
    level: 1,
  })
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over' | 'won'>('idle')
  const rafRef = useRef<number>(0)
  const mouseX = useRef(CW / 2)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { paddle, ball, bricks, score: sc, lives: lv, phase: ph, level: lv2 } = stateRef.current

    ctx.fillStyle = '#090914'
    ctx.fillRect(0, 0, CW, CH)

    // Bricks
    bricks.forEach(b => {
      if (!b.alive) return
      ctx.fillStyle = b.color
      ctx.beginPath()
      ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 4)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillRect(b.x + 2, b.y + 2, BRICK_W - 4, 5)
    })

    // Paddle
    const grad = ctx.createLinearGradient(paddle, 0, paddle + PADDLE_W, 0)
    grad.addColorStop(0, '#7c3aed')
    grad.addColorStop(1, '#06b6d4')
    ctx.fillStyle = grad
    ctx.shadowColor = '#7c3aed'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.roundRect(paddle, PADDLE_Y, PADDLE_W, PADDLE_H, 6)
    ctx.fill()
    ctx.shadowBlur = 0

    // Ball
    ctx.fillStyle = '#fff'
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // HUD
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = '14px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${t.ui.lives}: ${'❤️'.repeat(lv)}`, 10, 30)
    ctx.textAlign = 'right'
    ctx.fillText(`${t.ui.level}: ${lv2}`, CW - 10, 30)

    if (ph === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.tapToStart, CW / 2, CH / 2)
    } else if (ph === 'over') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 34px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.gameOver, CW / 2, CH / 2 - 20)
      ctx.fillStyle = '#fff'
      ctx.font = '18px Inter, sans-serif'
      ctx.fillText(`${t.ui.score}: ${sc}`, CW / 2, CH / 2 + 20)
    } else if (ph === 'won') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#22c55e'
      ctx.font = 'bold 34px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.youWin + ' 🎉', CW / 2, CH / 2 - 20)
      ctx.fillStyle = '#fff'
      ctx.font = '18px Inter, sans-serif'
      ctx.fillText(`${t.ui.score}: ${sc}`, CW / 2, CH / 2 + 20)
    }
  }, [t])

  const reset = useCallback((nextLevel?: number) => {
    const lv = nextLevel || 1
    const speed = 3 + (lv - 1) * 0.5
    stateRef.current = {
      paddle: CW / 2 - PADDLE_W / 2,
      ball: { x: CW / 2, y: PADDLE_Y - BALL_R - 2, vx: speed, vy: -(speed + 1) },
      bricks: makeBricks(),
      score: nextLevel ? stateRef.current.score : 0,
      lives: 3,
      phase: 'playing',
      level: lv,
    }
    setLives(3)
    setLevel(lv)
    if (!nextLevel) setScore(0)
    setPhase('playing')
  }, [])

  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      const s = stateRef.current
      if (s.phase === 'playing') {
        // Move paddle towards mouse
        const targetX = mouseX.current - PADDLE_W / 2
        s.paddle += (targetX - s.paddle) * 0.3
        s.paddle = Math.max(0, Math.min(CW - PADDLE_W, s.paddle))

        // Move ball
        s.ball.x += s.ball.vx
        s.ball.y += s.ball.vy

        // Wall bounces
        if (s.ball.x - BALL_R <= 0) { s.ball.x = BALL_R; s.ball.vx = Math.abs(s.ball.vx) }
        if (s.ball.x + BALL_R >= CW) { s.ball.x = CW - BALL_R; s.ball.vx = -Math.abs(s.ball.vx) }
        if (s.ball.y - BALL_R <= 0) { s.ball.y = BALL_R; s.ball.vy = Math.abs(s.ball.vy) }

        // Paddle bounce
        if (
          s.ball.y + BALL_R >= PADDLE_Y &&
          s.ball.y + BALL_R <= PADDLE_Y + PADDLE_H + Math.abs(s.ball.vy) &&
          s.ball.x >= s.paddle - BALL_R &&
          s.ball.x <= s.paddle + PADDLE_W + BALL_R &&
          s.ball.vy > 0
        ) {
          s.ball.vy = -Math.abs(s.ball.vy)
          const hitPos = (s.ball.x - s.paddle) / PADDLE_W
          s.ball.vx = (hitPos - 0.5) * 8
        }

        // Ball out
        if (s.ball.y + BALL_R > CH) {
          s.lives--
          setLives(s.lives)
          if (s.lives <= 0) {
            s.phase = 'over'
            setPhase('over')
          } else {
            s.ball = { x: CW / 2, y: PADDLE_Y - BALL_R - 2, vx: 3 + (s.level - 1) * 0.5, vy: -(4 + (s.level - 1) * 0.5) }
            s.paddle = CW / 2 - PADDLE_W / 2
          }
        }

        // Brick collisions
        for (const b of s.bricks) {
          if (!b.alive) continue
          if (
            s.ball.x + BALL_R > b.x && s.ball.x - BALL_R < b.x + BRICK_W &&
            s.ball.y + BALL_R > b.y && s.ball.y - BALL_R < b.y + BRICK_H
          ) {
            b.alive = false
            s.score += 10
            setScore(s.score)

            const fromLeft = s.ball.x < b.x || s.ball.x > b.x + BRICK_W
            if (fromLeft) s.ball.vx *= -1
            else s.ball.vy *= -1
            break
          }
        }

        // Level complete
        if (s.bricks.every(b => !b.alive)) {
          if (s.level >= 3) {
            s.phase = 'won'
            setPhase('won')
          } else {
            reset(s.level + 1)
          }
        }
      }
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [draw, reset])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.current = (e.clientX - rect.left) * (CW / rect.width)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.current = (e.touches[0].clientX - rect.left) * (CW / rect.width)
    e.preventDefault()
  }

  const handleClick = () => {
    if (phase === 'idle' || phase === 'over' || phase === 'won') reset()
  }

  return (
    <GameLayout
      gameKey="breakout"
      stats={[
        { label: t.ui.score, value: score, color: '#7c3aed' },
        { label: t.ui.lives, value: '❤️'.repeat(lives), color: '#ef4444' },
        { label: t.ui.level, value: level, color: '#f59e0b' },
      ]}
    >
      <div className="p-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="rounded-xl cursor-none"
          style={{ maxWidth: '100%', maxHeight: '75vh', touchAction: 'none' }}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
          onClick={handleClick}
          onTouchStart={e => { e.preventDefault(); handleClick() }}
        />
      </div>
    </GameLayout>
  )
}
