'use client'
import { useMemo, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import GameCard from '@/components/GameCard'
import CommunityPanel from '@/components/CommunityPanel'
import MonetizationSlot from '@/components/MonetizationSlot'
import { games, importedGames, type GameCategory } from '@/data/games'
import Link from 'next/link'

const filters: Array<GameCategory | 'All'> = ['All', 'Action', 'Racing', 'Puzzle', 'Sports', 'Educational', 'Creative']

export default function Home() {
  const { t } = useLang()
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All')

  const visibleGames = useMemo(() => {
    if (activeCategory === 'All') return games
    return games.filter(game => game.category === activeCategory)
  }, [activeCategory])

  const categoryLabel = (category: GameCategory | 'All') => {
    if (category === 'All') return t.ui.categories.all
    return {
      Arcade: t.ui.categories.arcade,
      Puzzle: t.ui.categories.puzzle,
      Action: t.ui.categories.action,
      Racing: t.ui.categories.racing,
      Educational: t.ui.categories.educational,
      Creative: t.ui.categories.creative,
      Sports: t.ui.categories.sports,
    }[category]
  }

  return (
    <div className="relative z-10">
      <section className="relative overflow-hidden px-4 pb-10 pt-16 text-center md:pt-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-sm font-semibold mb-6">
            🎮 {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="gradient-text">{t.siteName}</span>
          </h1>

          <p className="text-xl md:text-2xl text-white font-semibold mb-2">
            {t.tagline}
          </p>
          <p className="text-text-muted text-base md:text-lg mb-8">
            {t.taglineSub}
          </p>

          <div className="mb-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <strong className="block text-2xl text-white">{games.length}</strong>
              <span className="text-xs text-text-muted">{t.home.stats.games}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <strong className="block text-2xl text-white">6</strong>
              <span className="text-xs text-text-muted">{t.home.stats.categories}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <strong className="block text-2xl text-white">✓</strong>
              <span className="text-xs text-text-muted">{t.home.stats.instant}</span>
            </div>
          </div>

          <a
            href="#games"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            }}
          >
            {t.hero.cta} 🚀
          </a>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-5xl">
          <MonetizationSlot placement="home-top" size="leaderboard" />
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[#11101e] p-8 shadow-2xl shadow-black/30 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">أحدث الألعاب المضافة</h2>
              <p className="mt-2 max-w-2xl text-text-muted">استعرض أحدث الألعاب المستوردة من GameDistribution، وكل لعبة لها صفحة خاصة قابلة للعب.</p>
            </div>
            <Link
              href="/games"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              عرض كل الألعاب
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {importedGames.slice(0, 6).map(game => (
              <div key={game.slug} className="rounded-[2rem] border border-white/10 bg-[#11101e] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/5">
                <Link href={`/games/${game.slug}/`} className="block overflow-hidden rounded-[2rem]">
                  <div className="relative h-52 overflow-hidden bg-slate-950">
                    <img
                      src={game.thumbnail || '/game-covers/default.svg'}
                      alt={game.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{game.genres?.[0] || 'Game'}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-text-muted">Play</span>
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <h3 className="text-xl font-black text-white leading-tight">{game.title}</h3>
                    <p className="max-h-16 overflow-hidden text-sm leading-relaxed text-text-muted">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{game.company}</span>
                      <span>{game.tags?.[0] ?? ''}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-5xl">
          <MonetizationSlot placement="home-mid" size="inline" />
        </div>
      </section>

      <section id="games" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-3 text-3xl font-black text-white">
              {t.home.featuredTitle}
            </h2>
            <p className="text-text-muted">{t.home.featuredCopy}</p>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-center text-sm font-semibold text-text-muted">{t.home.filtersTitle}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    activeCategory === category
                      ? 'bg-accent-purple text-white'
                      : 'border border-white/10 bg-white/5 text-text-muted hover:border-white/30 hover:text-white'
                  }`}
                >
                  {categoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {visibleGames.map(game => (
              <GameCard
                key={game.slug}
                slug={game.slug}
                emoji={game.emoji}
                nameKey={game.nameKey}
                category={game.category}
                cover={game.cover}
                audience={game.audience}
                difficulty={game.difficulty}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="container mx-auto max-w-5xl">
          <MonetizationSlot placement="home-mid" size="inline" />
        </div>
      </section>

      <section id="most-played" className="px-4 py-10">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 text-3xl font-black text-white">{t.home.sections.mostPlayed}</h2>
              <p className="text-text-muted max-w-2xl">{t.home.sections.mostPlayedCopy}</p>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-muted">
              {t.ui.categories.all}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {games.filter(game => game.isPopular).map(game => (
              <GameCard
                key={game.slug}
                slug={game.slug}
                emoji={game.emoji}
                nameKey={game.nameKey}
                category={game.category}
                cover={game.cover}
                audience={game.audience}
                difficulty={game.difficulty}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="new-games" className="px-4 py-10">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-3 text-3xl font-black text-white">{t.home.sections.newReleases}</h2>
              <p className="text-text-muted max-w-2xl">{t.home.sections.newReleasesCopy}</p>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-muted">
              {t.home.sections.newTag}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {games.filter(game => game.isNew).map(game => (
              <GameCard
                key={game.slug}
                slug={game.slug}
                emoji={game.emoji}
                nameKey={game.nameKey}
                category={game.category}
                cover={game.cover}
                audience={game.audience}
                difficulty={game.difficulty}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 max-w-3xl">
            <h2 className="mb-3 text-3xl font-black text-white">{t.home.sections.categoryTitle}</h2>
            <p className="text-text-muted">{t.home.sections.categoryCopy}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(['Action', 'Racing', 'Puzzle', 'Sports'] as GameCategory[]).map(category => (
              <div
                key={category}
                className="rounded-3xl border border-white/10 bg-[#11101e] p-6 shadow-xl shadow-black/30"
              >
                <h3 className="text-xl font-bold text-white mb-3">{categoryLabel(category)}</h3>
                <p className="text-text-muted mb-5">{t.home.sections.categoryCards[category.toLowerCase() as keyof typeof t.home.sections.categoryCards]}</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-text-muted border border-white/10">
                  {games.filter(game => game.category === category).length} {t.ui.categories[category.toLowerCase() as keyof typeof t.ui.categories] ?? ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 max-w-3xl">
            <h2 className="mb-3 text-3xl font-black text-white">{t.home.communityTitle}</h2>
            <p className="text-text-muted">{t.home.communityCopy}</p>
          </div>
          <CommunityPanel scope="home" mode="posts" />
        </div>
      </section>
    </div>
  )
}
