'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import type { GameAudience, GameCategory, GameDifficulty, GameKey } from '@/data/games'

interface GameCardProps {
  slug: string
  emoji: string
  nameKey: GameKey
  category: GameCategory
  cover: string
  audience?: GameAudience
  difficulty?: GameDifficulty
}

const categoryStyles: Record<string, { card: string; badge: string }> = {
  Arcade: {
    card: 'card-arcade',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
  },
  Puzzle: {
    card: 'card-puzzle',
    badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  },
  Action: {
    card: 'card-action',
    badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  },
  Educational: {
    card: 'card-educational',
    badge: 'bg-green-500/20 text-green-400 border border-green-500/30',
  },
  Creative: {
    card: 'card-creative',
    badge: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  },
  Sports: {
    card: 'card-sports',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  Racing: {
    card: 'card-action',
    badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  },
}

export default function GameCard({ slug, emoji, nameKey, category, cover, audience = 'everyone', difficulty = 'easy' }: GameCardProps) {
  const { t } = useLang()
  const styles = categoryStyles[category]
  const game = t.games[nameKey]

  const catLabel = {
    Arcade: t.ui.categories.arcade,
    Puzzle: t.ui.categories.puzzle,
    Action: t.ui.categories.action,
    Racing: t.ui.categories.racing,
    Educational: t.ui.categories.educational,
    Creative: t.ui.categories.creative,
    Sports: t.ui.categories.sports,
  }[category]

  return (
    <Link href={`/games/${slug}/`} className="block group">
      <div className={`${styles.card} rounded-3xl border border-white/10 overflow-hidden bg-[#11101e] shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
        <div className="relative overflow-hidden">
          <img src={cover} alt={game.name} loading="lazy" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">{catLabel}</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-text-muted">{t.ui.difficultyLabels[difficulty]}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-4xl select-none">{emoji}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{t.ui.audience[audience]}</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white leading-tight">{game.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{game.desc}</p>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center justify-center w-full rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-gradient-to-l">
              {t.ui.play} ▶
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
