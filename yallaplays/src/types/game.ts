export interface GameInfo {
  slug: string
  title: string
  gameId: string
  embedUrl: string
  thumbnail: string | null
  description: string
  instructions: string
  genres: string[]
  tags: string[]
  company: string
  type: string
  orientation: string
  dimensions: string
  sourceUrl: string
}