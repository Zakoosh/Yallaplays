'use client'
import Link from 'next/link'
import type { GameInfo } from '@/types/game'

interface ImportedGameCardProps {
  game: GameInfo
}

export default function ImportedGameCard({ game }: ImportedGameCardProps) {
  const thumbnail = game.thumbnail || '/game-covers/default.svg'

  return (
    <Link href={`/games/${game.slug}/`} className="group block">
      <div className="rounded-[2rem] border border-white/10 bg-[#11101e] shadow-2xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5">
        <div className="relative overflow-hidden rounded-t-[2rem] bg-slate-950">
          <img
            src={thumbnail}
            alt={game.title}
            loading="lazy"
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
            <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              {game.genres?.[0] || 'Game'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-text-muted">
              {game.company || 'Yalla Plays'}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-white leading-tight">{game.title}</h3>
            <span className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Play
            </span>
          </div>

          <p className="max-h-16 overflow-hidden text-sm leading-relaxed text-text-muted">{game.description}</p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {game.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
