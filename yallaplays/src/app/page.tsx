'use client'
import { useMemo, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import GameCard from '@/components/GameCard'
import CommunityPanel from '@/components/CommunityPanel'
import MonetizationSlot from '@/components/MonetizationSlot'
import { games, type GameCategory } from '@/data/games'

const filters: Array<GameCategory | 'All'> = ['All', 'Arcade', 'Puzzle', 'Action', 'Educational', 'Creative', 'Sports']

const gameIdeas = {
  ar: [
    'تلبيس شخصيات',
    'طبخ سريع',
    'سباق سيارات',
    'حارس المرمى',
    'صيد الكنز',
    'رسم حر',
    'بحث عن الكلمات',
    'ألعاب أطفال تعليمية',
    'تحديات يومية',
    'بطولات نقاط',
    'ألغاز صور',
    'تركيب مكعبات',
  ],
  en: [
    'Dress-up characters',
    'Quick cooking',
    'Car racing',
    'Goalkeeper saves',
    'Treasure hunt',
    'Free drawing',
    'Word search',
    'Kids learning games',
    'Daily challenges',
    'Score tournaments',
    'Picture puzzles',
    'Block building',
  ],
}

export default function Home() {
  const { t, lang } = useLang()
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
      Educational: t.ui.categories.educational,
      Creative: t.ui.categories.creative,
      Sports: t.ui.categories.sports,
    }[category]
  }

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-10 pt-16 text-center md:pt-20">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative container mx-auto max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-sm font-semibold mb-6">
            🎮 {t.hero.badge}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="gradient-text">{t.siteName}</span>
          </h1>

          {/* Taglines */}
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

          {/* CTA */}
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

      {/* Games Grid */}
      <section id="games" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-3 text-3xl font-black text-white">
              {t.home.featuredTitle}
            </h2>
            <p className="text-text-muted">
              {t.home.featuredCopy}
            </p>
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

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 max-w-3xl">
            <h2 className="mb-3 text-3xl font-black text-white">{t.home.ideasTitle}</h2>
            <p className="text-text-muted">{t.home.ideasCopy}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {gameIdeas[lang].map(idea => (
              <div key={idea} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
                {idea}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="mb-3 text-3xl font-black text-white">{t.home.communityTitle}</h2>
            <p className="max-w-2xl text-text-muted">{t.home.communityCopy}</p>
          </div>
          <CommunityPanel scope="home" mode="posts" />
        </div>
      </section>
    </div>
  )
}
