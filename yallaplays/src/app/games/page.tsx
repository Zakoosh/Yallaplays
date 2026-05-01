import Link from 'next/link'
import { importedGames } from '@/data/games'
import ImportedGameCard from '@/components/ImportedGameCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Games | Yalla Plays',
  description: 'Browse and play imported GameDistribution games instantly on Yalla Plays.',
  alternates: {
    canonical: 'https://yallaplays.com/games',
  },
  openGraph: {
    title: 'Games | Yalla Plays',
    description: 'Browse and play imported GameDistribution games instantly on Yalla Plays.',
    url: 'https://yallaplays.com/games',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games | Yalla Plays',
    description: 'Browse and play imported GameDistribution games instantly on Yalla Plays.',
  },
}

export default function GamesPage() {
  return (
    <div className="relative z-10 px-4 py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#09090f] px-6 py-16 shadow-2xl shadow-black/30">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_35%)]"
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80">
            Imported Games
          </p>
          <h1 className="mb-4 text-5xl font-black text-white md:text-6xl">كل ألعابك هنا</h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-text-muted">
            استعرض الألعاب المضافة تلقائياً من GameDistribution، وشغّل أي لعبة مباشرةً من صفحتها الخاصة.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              العودة للرئيسية
            </Link>
            <a
              href="#imported-games"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              عرض الألعاب المضافة
            </a>
          </div>
        </div>
      </section>

      <section id="imported-games" className="mx-auto mt-12 max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">الألعاب المستوردة</h2>
            <p className="text-text-muted max-w-2xl">هذه هي الألعاب التي تم جلبها من GameDistribution، وقابلة للعب مباشرةً من الموقع.</p>
          </div>
          <p className="text-sm text-text-muted">{importedGames.length} لعبة</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {importedGames.map(game => (
            <ImportedGameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>
    </div>
  )
}
