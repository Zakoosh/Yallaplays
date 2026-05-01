import { notFound } from 'next/navigation'
import { importedGames } from '@/data/games'
import GameDetail from './GameDetail'
import type { Metadata } from 'next'
import type { GameInfo } from '@/types/game'

export const dynamicParams = false

export function generateStaticParams() {
  return importedGames.map(game => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const game = importedGames.find(item => item.slug === slug) as GameInfo | undefined
  if (!game) {
    return {
      title: 'Game not found | Yalla Plays',
      description: 'The requested game page is not available.',
      alternates: {
        canonical: 'https://yallaplays.com',
      },
    }
  }

  const canonical = `https://yallaplays.com/games/${game.slug}`
  const title = `Play ${game.title} Online Free | Yalla Plays`
  const description = game.description || `Play ${game.title} online for free on Yalla Plays.`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: game.thumbnail ? [{ url: game.thumbnail, alt: game.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: game.thumbnail ? [game.thumbnail] : undefined,
    },
  }
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = importedGames.find(item => item.slug === slug) as GameInfo | undefined

  if (!game) {
    notFound()
  }

  return <GameDetail game={game} allGames={importedGames} />
}
