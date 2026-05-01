'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import GameLayout from '@/components/GameLayout'
import { useLang } from '@/contexts/LanguageContext'

type Op = '+' | '-' | '×' | '÷'
type Difficulty = 'easy' | 'medium' | 'hard'

const MAX_NUMS: Record<Difficulty, number> = { easy: 10, medium: 50, hard: 100 }
const QUESTION_TIME = 15
const TOTAL_QUESTIONS = 10

interface Question {
  text: string
  answer: number
  choices: number[]
}

function generateQuestion(diff: Difficulty): Question {
  const max = MAX_NUMS[diff]
  const ops: Op[] = ['+', '-', '×', '÷']
  const op = ops[Math.floor(Math.random() * ops.length)]

  let a: number, b: number, answer: number

  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * a) + 1
    answer = a - b
  } else if (op === '×') {
    a = Math.floor(Math.random() * Math.min(max, 12)) + 1
    b = Math.floor(Math.random() * Math.min(max, 12)) + 1
    answer = a * b
  } else {
    b = Math.floor(Math.random() * 10) + 1
    answer = Math.floor(Math.random() * 10) + 1
    a = b * answer
  }

  // Generate 3 wrong choices
  const wrong = new Set<number>()
  while (wrong.size < 3) {
    const offset = Math.floor(Math.random() * 10) + 1
    const w = answer + (Math.random() < 0.5 ? offset : -offset)
    if (w !== answer && w >= 0) wrong.add(w)
  }
  const choices = [...Array.from(wrong), answer].sort(() => Math.random() - 0.5)

  return { text: `${a} ${op} ${b} = ?`, answer, choices }
}

export default function MathQuizPage() {
  const { t } = useLang()
  const [diff, setDiff] = useState<Difficulty>('easy')
  const [phase, setPhase] = useState<'idle' | 'playing' | 'results'>('idle')
  const [question, setQuestion] = useState<Question | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeRef = useRef(QUESTION_TIME)
  const lockRef = useRef(false)

  const nextQuestion = useCallback((qi: number) => {
    lockRef.current = false
    setSelected(null)
    setFeedback(null)
    if (qi >= TOTAL_QUESTIONS) {
      setPhase('results')
      return
    }
    setQIndex(qi)
    setQuestion(generateQuestion(diff))
    timeRef.current = QUESTION_TIME
    setTimeLeft(QUESTION_TIME)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      timeRef.current--
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        clearInterval(timerRef.current!)
        if (!lockRef.current) {
          lockRef.current = true
          setFeedback('wrong')
          setTimeout(() => nextQuestion(qi + 1), 800)
        }
      }
    }, 1000)
  }, [diff])

  const startGame = (d: Difficulty = diff) => {
    setDiff(d)
    setScore(0)
    setCorrect(0)
    setPhase('playing')
    setTimeout(() => nextQuestion(0), 50)
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const answer = (choice: number) => {
    if (lockRef.current || !question) return
    lockRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(choice)

    if (choice === question.answer) {
      const bonus = Math.floor(timeRef.current * 5)
      setScore(s => s + 10 + bonus)
      setCorrect(c => c + 1)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }
    setTimeout(() => nextQuestion(qIndex + 1), 900)
  }

  const getBtnStyle = (choice: number) => {
    if (!feedback || selected === null) {
      return 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white cursor-pointer'
    }
    if (choice === question?.answer) return 'border-green-500 bg-green-500/20 text-green-300'
    if (choice === selected) return 'border-red-500 bg-red-500/20 text-red-300'
    return 'border-white/10 bg-white/5 text-text-muted'
  }

  return (
    <GameLayout
      gameKey="mathquiz"
      stats={phase === 'playing' ? [
        { label: t.ui.score, value: score, color: '#22c55e' },
        { label: t.ui.question, value: `${qIndex}/${TOTAL_QUESTIONS}`, color: '#7c3aed' },
        { label: t.ui.time, value: `${timeLeft}${t.ui.seconds}`, color: timeLeft <= 5 ? '#ef4444' : '#06b6d4' },
      ] : []}
    >
      <div className="p-6 flex flex-col items-center gap-6 min-h-96">
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-text-muted text-center max-w-sm">{t.mathquiz.instructions}</p>

            <div className="flex gap-2">
              {(['easy','medium','hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    diff === d ? 'bg-accent-purple text-white' : 'border border-white/20 text-text-muted hover:text-white'
                  }`}
                >
                  {t.ui[d]}
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame()}
              className="px-8 py-4 rounded-xl font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              {t.ui.start}
            </button>
          </div>
        )}

        {phase === 'playing' && question && (
          <>
            {/* Timer bar */}
            <div className="w-full max-w-md h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / QUESTION_TIME) * 100}%`,
                  background: timeLeft > 7 ? '#22c55e' : timeLeft > 4 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>

            {/* Question */}
            <div
              className="text-4xl md:text-5xl font-black text-white text-center py-6 px-8 rounded-2xl"
              style={{ backgroundColor: '#1a1a2e', minWidth: 280 }}
            >
              {question.text}
            </div>

            {/* Choices */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {question.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => answer(choice)}
                  className={`border-2 rounded-xl py-4 text-2xl font-bold transition-all duration-200 ${getBtnStyle(choice)}`}
                >
                  {choice}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`text-xl font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback === 'correct' ? t.ui.correct : t.ui.wrong} {feedback === 'correct' ? '' : `(${question.answer})`}
              </div>
            )}
          </>
        )}

        {phase === 'results' && (
          <div className="flex flex-col items-center gap-6 py-4">
            <h2 className="text-3xl font-black text-white">{t.mathquiz.finalResults}</h2>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1a1a2e' }}>
                <p className="text-text-muted text-sm">{t.ui.finalScore}</p>
                <p className="text-3xl font-black text-accent-purple">{score}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1a1a2e' }}>
                <p className="text-text-muted text-sm">{t.ui.accuracy}</p>
                <p className="text-3xl font-black text-accent-cyan">{Math.round((correct / TOTAL_QUESTIONS) * 100)}%</p>
              </div>
            </div>

            <p className="text-text-muted">
              {correct} / {TOTAL_QUESTIONS} {t.ui.correct}
            </p>

            <div className="flex gap-3">
              {(['easy','medium','hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    diff === d
                      ? 'bg-accent-purple text-white'
                      : 'border border-white/20 text-text-muted hover:text-white'
                  }`}
                >
                  {t.ui[d]}
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame()}
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
