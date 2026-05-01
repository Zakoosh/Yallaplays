'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import type { GameAudience, GameCategory, GameDifficulty, GameKey } from '@/data/games'

interface GameCardProps {
  slug: string
  emoji: string
  nameKey: GameKey
  category: GameCategory
  audience?: GameAudience
  difficulty?: GameDifficulty
}

const categoryStyles: Record<string, { card: string; badge: string; badgeText: string }> = {
  Arcade: {
    card: 'card-arcade',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    badgeText: 'Arcade',
  },
  Puzzle: {
    card: 'card-puzzle',
    badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    badgeText: 'Puzzle',
  },
  Action: {
    card: 'card-action',
    badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    badgeText: 'Action',
  },
  Educational: {
    card: 'card-educational',
    badge: 'bg-green-500/20 text-green-400 border border-green-500/30',
    badgeText: 'Educational',
  },
  Creative: {
    card: 'card-creative',
    badge: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    badgeText: 'Creative',
  },
  Sports: {
    card: 'card-sports',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    badgeText: 'Sports',
  },
}

export default function GameCard({ slug, emoji, nameKey, category, audience = 'everyone', difficulty = 'easy' }: GameCardProps) {
  const { t } = useLang()
  const styles = categoryStyles[category]
  const game = t.games[nameKey]

  // Category label from translations
  const catLabel = {
    Arcade: t.ui.categories.arcade,
    Puzzle: t.ui.categories.puzzle,
    Action: t.ui.categories.action,
    Educational: t.ui.categories.educational,
    Creative: t.ui.categories.creative,
    Sports: t.ui.categories.sports,
  }[category]

  return (
    <Link href={`/games/${slug}/`} className="block group">
      <div
        className={`${styles.card} rounded-2xl border p-6 h-full flex flex-col gap-4 transition-all duration-300 cursor-pointer`}
        style={{ transform: 'translateY(0)', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }}
      >
        {/* Emoji icon */}
        <div className="text-5xl group-hover:scale-110 transition-transform duration-300 select-none">
          {emoji}
        </div>

        {/* Category badge */}
        <div className="flex flex-wrap gap-2">
          <span className={`${styles.badge} text-xs font-semibold px-2.5 py-1 rounded-full w-fit`}>
            {catLabel}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit border border-white/10 text-text-muted bg-white/5">
            {t.ui.difficultyLabels[difficulty]}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white leading-tight">
          {game.name}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed flex-1">
          {game.desc}
        </p>

        <p className="text-xs font-semibold text-accent-cyan">
          {t.ui.audience[audience]}
        </p>

        {/* Play button */}
        <div className="mt-2">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            {t.ui.play} ▶
          </span>
        </div>
      </div>
    </Link>
  )
}
