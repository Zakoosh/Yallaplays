import { importedGames } from '@/data/games'

export const dynamic = 'force-static'
export const revalidate = 86400

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yallaplays.com'

export default function sitemap() {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...importedGames.map(game => ({
      url: `${baseUrl}/games/${game.slug}`,
      lastModified: new Date(),
    })),
  ]
}
