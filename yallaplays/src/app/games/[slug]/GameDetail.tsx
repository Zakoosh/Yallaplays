'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import type { GameInfo } from '@/types/game'

interface GameDetailProps {
  game: GameInfo
  allGames: GameInfo[]
}

export default function GameDetail({ game, allGames }: GameDetailProps) {
  const { t } = useLang()
  const categoryLabel = game.genres?.[0] || 'Game'
  const similarGames = allGames.filter(item => item.slug !== game.slug && item.genres?.some(g => game.genres?.includes(g))).slice(0, 4)

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen()
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.description,
    "url": `https://yallaplays.com/games/${game.slug}`,
    "image": game.thumbnail,
    "genre": game.genres,
    "publisher": {
      "@type": "Organization",
      "name": game.company || "Yalla Plays"
    },
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Modern web browser with HTML5 support"
  }

  return (
    <div className="min-h-screen bg-[#08080f] py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">
            {t.siteName}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/games" className="hover:text-white transition-colors">
            Games
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{game.title}</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">{game.title}</h1>
            <p className="mt-3 max-w-3xl text-text-muted leading-relaxed">{game.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-text-muted">
            {game.genres?.map(genre => (
              <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {genre}
              </span>
            ))}
            {game.company && (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {game.company}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-[#11101e] overflow-hidden shadow-2xl shadow-black/20">
            {game.thumbnail && (
              <img src={game.thumbnail} alt={game.title} loading="lazy" className="h-72 w-full object-cover" />
            )}
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.25em] text-accent-cyan/80">{categoryLabel}</p>
                <button
                  onClick={handleFullscreen}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Fullscreen
                </button>
              </div>

              <h2 className="text-3xl font-black text-white mb-4">{game.title}</h2>
              <p className="text-text-muted leading-relaxed mb-8">{game.description}</p>

              {game.instructions && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-3">Instructions</h3>
                  <p className="text-text-muted leading-relaxed">{game.instructions}</p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 mb-8">
                {game.type && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-text-muted">Type</p>
                    <p className="mt-2 text-lg font-bold text-white">{game.type}</p>
                  </div>
                )}
                {game.orientation && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-text-muted">Orientation</p>
                    <p className="mt-2 text-lg font-bold text-white">{game.orientation}</p>
                  </div>
                )}
                {game.dimensions && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-text-muted">Dimensions</p>
                    <p className="mt-2 text-lg font-bold text-white">{game.dimensions}</p>
                  </div>
                )}
                {game.tags?.length > 0 && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-text-muted">Tags</p>
                    <p className="mt-2 text-sm font-bold text-white">{game.tags.join(', ')}</p>
                  </div>
                )}
              </div>

              {game.embedUrl && (
                <div className="mb-8">
                  <iframe
                    src={game.embedUrl}
                    width="100%"
                    height="600"
                    scrolling="none"
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-2xl border border-white/10"
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#11101e] p-6 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold text-white mb-3">Similar Games</h2>
              <p className="text-text-muted mb-6">Discover other titles in the same category.</p>
              <div className="space-y-3">
                {similarGames.map(similar => (
                  <Link
                    key={similar.slug}
                    href={`/games/${similar.slug}/`}
                    className="block rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <p className="text-base font-semibold text-white">{similar.title}</p>
                    <p className="mt-1 text-sm text-text-muted">{similar.description?.slice(0, 100)}...</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#11101e] p-6 shadow-xl shadow-black/20">
              <h2 className="text-2xl font-bold text-white mb-3">Performance Optimized</h2>
              <ul className="space-y-3 text-sm text-text-muted">
                <li>✔ Fast loading with optimized assets</li>
                <li>✔ Full RTL support</li>
                <li>✔ Mobile-friendly responsive design</li>
                <li>✔ SEO optimized pages</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
