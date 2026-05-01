'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { ReactNode } from 'react'
import CommunityPanel from '@/components/CommunityPanel'
import MonetizationSlot from '@/components/MonetizationSlot'

interface StatItem {
  label: string
  value: string | number
  color?: string
}

interface GameLayoutProps {
  gameKey: keyof typeof import('@/translations/en').en.games
  children: ReactNode
  stats?: StatItem[]
  mobileControls?: ReactNode
}

export default function GameLayout({ gameKey, children, stats = [], mobileControls }: GameLayoutProps) {
  const { t } = useLang()
  const game = t.games[gameKey]

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back button + Title */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-text-muted hover:text-white hover:border-white/40 transition-all text-sm font-medium"
          >
            <span>←</span>
            <span>{t.ui.back}</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {game.name}
          </h1>
        </div>

        {/* Stats bar */}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center px-4 py-2 rounded-xl border border-white/10"
                style={{ backgroundColor: '#13131f', minWidth: '80px' }}
              >
                <span className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: stat.color || '#e2e8f0' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            {/* Game area */}
            <div className="rounded-2xl overflow-hidden border border-white/10" style={{ backgroundColor: '#13131f' }}>
              {children}
            </div>

            {/* Mobile Controls */}
            {mobileControls && (
              <div className="mt-6 md:hidden">
                <p className="text-text-muted text-xs uppercase tracking-wider mb-3 text-center">
                  {t.ui.mobileControls}
                </p>
                {mobileControls}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <MonetizationSlot placement={`game-${String(gameKey)}-side`} size="square" />
            <CommunityPanel scope={`game-${String(gameKey)}`} mode="comments" />
          </aside>
        </div>
      </div>
    </div>
  )
}
