export type GameCategory = 'Arcade' | 'Puzzle' | 'Action' | 'Educational' | 'Creative' | 'Sports'
export type GameAudience = 'everyone' | 'creative' | 'sports'
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'mixed'
export type GameKey = keyof typeof import('@/translations/en').en.games

export interface GameInfo {
  slug: string
  emoji: string
  nameKey: GameKey
  category: GameCategory
  audience: GameAudience
  difficulty: GameDifficulty
}

export const games: GameInfo[] = [
  { slug: 'snake', emoji: '🐍', nameKey: 'snake', category: 'Arcade', audience: 'everyone', difficulty: 'medium' },
  { slug: 'tictactoe', emoji: '⭕', nameKey: 'tictactoe', category: 'Puzzle', audience: 'everyone', difficulty: 'easy' },
  { slug: 'memory', emoji: '🧠', nameKey: 'memory', category: 'Puzzle', audience: 'everyone', difficulty: 'mixed' },
  { slug: '2048', emoji: '🔢', nameKey: '2048', category: 'Puzzle', audience: 'everyone', difficulty: 'medium' },
  { slug: 'flappy', emoji: '🪽', nameKey: 'flappy', category: 'Arcade', audience: 'everyone', difficulty: 'hard' },
  { slug: 'whackamole', emoji: '🎯', nameKey: 'whackamole', category: 'Action', audience: 'everyone', difficulty: 'easy' },
  { slug: 'tetris', emoji: '🧩', nameKey: 'tetris', category: 'Puzzle', audience: 'everyone', difficulty: 'hard' },
  { slug: 'breakout', emoji: '🧱', nameKey: 'breakout', category: 'Arcade', audience: 'everyone', difficulty: 'medium' },
  { slug: 'mathquiz', emoji: '🧮', nameKey: 'mathquiz', category: 'Educational', audience: 'everyone', difficulty: 'mixed' },
  { slug: 'wordscramble', emoji: '🔤', nameKey: 'wordscramble', category: 'Educational', audience: 'everyone', difficulty: 'medium' },
  { slug: 'coloring', emoji: '🎨', nameKey: 'coloring', category: 'Creative', audience: 'creative', difficulty: 'easy' },
  { slug: 'style-studio', emoji: '👗', nameKey: 'styleStudio', category: 'Creative', audience: 'creative', difficulty: 'mixed' },
  { slug: 'penalty', emoji: '⚽', nameKey: 'penalty', category: 'Sports', audience: 'sports', difficulty: 'mixed' },
  { slug: 'runner', emoji: '🏁', nameKey: 'runner', category: 'Arcade', audience: 'sports', difficulty: 'hard' },
  { slug: 'bubble-pop', emoji: '🫧', nameKey: 'bubblePop', category: 'Arcade', audience: 'everyone', difficulty: 'easy' },
  { slug: 'reaction', emoji: '⚡', nameKey: 'reaction', category: 'Action', audience: 'everyone', difficulty: 'mixed' },
  { slug: 'maze', emoji: '🧭', nameKey: 'maze', category: 'Puzzle', audience: 'everyone', difficulty: 'mixed' },
  { slug: 'pattern-sequence', emoji: '🔔', nameKey: 'patternSequence', category: 'Puzzle', audience: 'everyone', difficulty: 'hard' },
  { slug: 'typing-speed', emoji: '⌨️', nameKey: 'typingSpeed', category: 'Educational', audience: 'everyone', difficulty: 'medium' },
  { slug: 'cake-decorator', emoji: '🧁', nameKey: 'cakeDecorator', category: 'Creative', audience: 'creative', difficulty: 'easy' },
]
