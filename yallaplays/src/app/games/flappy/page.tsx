'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

const CW = 360, CH = 600
const BIRD_R = 16
const PIPE_W = 60
const GRAVITY = 0.5
const FLAP = -9
const PIPE_GAP = 150
const PIPE_SPEED = 3

interface Pipe { x: number; top: number }

export default function FlappyPage() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    bird: { y: CH / 2, vy: 0 },
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
    phase: 'idle' as 'idle' | 'playing' | 'over',
  })
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('flappy_best') || '0')
    setBest(saved)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { bird, pipes, score: sc, phase: ph } = stateRef.current

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CH)
    sky.addColorStop(0, '#0d1b2a')
    sky.addColorStop(1, '#1a3a5c')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, CW, CH)

    // Ground
    ctx.fillStyle = '#2d5a27'
    ctx.fillRect(0, CH - 40, CW, 40)
    ctx.fillStyle = '#5c8f1c'
    ctx.fillRect(0, CH - 40, CW, 8)

    // Pipes
    pipes.forEach(p => {
      // Top pipe
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(p.x, 0, PIPE_W, p.top)
      ctx.fillStyle = '#16a34a'
      ctx.fillRect(p.x - 5, p.top - 30, PIPE_W + 10, 30)
      // Bottom pipe
      const botY = p.top + PIPE_GAP
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(p.x, botY, PIPE_W, CH - botY - 40)
      ctx.fillStyle = '#16a34a'
      ctx.fillRect(p.x - 5, botY, PIPE_W + 10, 30)
    })

    // Bird
    const bx = 80
    const by = bird.y
    ctx.save()
    ctx.translate(bx, by)
    const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.vy * 0.05))
    ctx.rotate(angle)
    ctx.fillStyle = '#fbbf24'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    // Eye
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(6, -4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#1e40af'
    ctx.beginPath()
    ctx.arc(8, -4, 2.5, 0, Math.PI * 2)
    ctx.fill()
    // Wing
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.ellipse(-4, 5, 10, 5, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Score
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 36px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = '#000'
    ctx.shadowBlur = 4
    ctx.fillText(String(sc), CW / 2, 60)
    ctx.shadowBlur = 0

    // Overlays
    if (ph === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.pressSpaceToFlap, CW / 2, CH / 2)
    } else if (ph === 'over') {
      ctx.fillStyle = 'rgba(0,0,0,0.65)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 40px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.ui.gameOver, CW / 2, CH / 2 - 30)
      ctx.fillStyle = '#fff'
      ctx.font = '22px Inter, sans-serif'
      ctx.fillText(`${t.ui.score}: ${sc}`, CW / 2, CH / 2 + 10)
      ctx.fillText(`${t.ui.best}: ${Math.max(sc, best)}`, CW / 2, CH / 2 + 45)
    }
  }, [t, best])

  const flap = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'idle') {
      s.phase = 'playing'
      s.bird.vy = FLAP
      setPhase('playing')
    } else if (s.phase === 'playing') {
      s.bird.vy = FLAP
    } else if (s.phase === 'over') {
      // restart
      stateRef.current = {
        bird: { y: CH / 2, vy: 0 },
        pipes: [],
        score: 0,
        frame: 0,
        phase: 'playing',
      }
      stateRef.current.bird.vy = FLAP
      setScore(0)
      setPhase('playing')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') { flap(); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap])

  useEffect(() => {
    let running = true
    const loop = () => {
      if (!running) return
      const s = stateRef.current
      if (s.phase === 'playing') {
        s.frame++
        s.bird.vy += GRAVITY
        s.bird.y += s.bird.vy

        // Spawn pipes
        if (s.frame % 90 === 0) {
          const minTop = 60
          const maxTop = CH - PIPE_GAP - 80
          s.pipes.push({ x: CW, top: minTop + Math.random() * (maxTop - minTop) })
        }

        // Move pipes
        s.pipes = s.pipes.filter(p => p.x + PIPE_W > -10)
        s.pipes.forEach(p => {
          p.x -= PIPE_SPEED + Math.floor(s.score / 5) * 0.5

          // Score
          const prevX = p.x + PIPE_SPEED + Math.floor(s.score / 5) * 0.5
          if (prevX > 80 && p.x <= 80) {
            s.score++
            setScore(s.score)
            if (s.score > (parseInt(localStorage.getItem('flappy_best') || '0'))) {
              localStorage.setItem('flappy_best', String(s.score))
              setBest(s.score)
            }
          }
        })

        // Collision: ground/ceiling
        if (s.bird.y + BIRD_R >= CH - 40 || s.bird.y - BIRD_R <= 0) {
          s.phase = 'over'
          setPhase('over')
        }

        // Collision: pipes
        const bx = 80
        for (const p of s.pipes) {
          if (bx + BIRD_R > p.x && bx - BIRD_R < p.x + PIPE_W) {
            if (s.bird.y - BIRD_R < p.top || s.bird.y + BIRD_R > p.top + PIPE_GAP) {
              s.phase = 'over'
              setPhase('over')
              break
            }
          }
        }
      }
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <GameLayout
      gameKey="flappy"
      stats={[
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.best, value: best, color: '#f59e0b' },
      ]}
    >
      <div className="p-4 flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="rounded-xl cursor-pointer"
          style={{ maxWidth: '100%', maxHeight: '70vh', touchAction: 'none' }}
          onClick={flap}
          onTouchStart={e => { e.preventDefault(); flap() }}
        />
      </div>
    </GameLayout>
  )
}
