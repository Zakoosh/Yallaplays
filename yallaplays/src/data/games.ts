import type { GameInfo } from '@/types/game'

export type GameCategory = 'Arcade' | 'Puzzle' | 'Action' | 'Educational' | 'Creative' | 'Sports' | 'Racing'
export type GameAudience = 'everyone' | 'creative' | 'sports'
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'mixed'
export type GameKey = keyof typeof import('@/translations/en').en.games

export interface GameInfoLegacy {
  slug: string
  emoji: string
  nameKey: GameKey
  category: GameCategory
  audience: GameAudience
  difficulty: GameDifficulty
  cover: string
  isPopular?: boolean
  isNew?: boolean
}

export const gamesLegacy: GameInfoLegacy[] = [
  { slug: 'snake', emoji: '🐍', nameKey: 'snake', category: 'Arcade', audience: 'everyone', difficulty: 'medium', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'tictactoe', emoji: '⭕', nameKey: 'tictactoe', category: 'Puzzle', audience: 'everyone', difficulty: 'easy', cover: '/game-covers/default.svg' },
  { slug: 'memory', emoji: '🧠', nameKey: 'memory', category: 'Puzzle', audience: 'everyone', difficulty: 'mixed', cover: '/game-covers/default.svg' },
  { slug: '2048', emoji: '🔢', nameKey: '2048', category: 'Puzzle', audience: 'everyone', difficulty: 'medium', cover: '/game-covers/default.svg' },
  { slug: 'flappy', emoji: '🪽', nameKey: 'flappy', category: 'Arcade', audience: 'everyone', difficulty: 'hard', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'whackamole', emoji: '🎯', nameKey: 'whackamole', category: 'Action', audience: 'everyone', difficulty: 'easy', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'tetris', emoji: '🧩', nameKey: 'tetris', category: 'Puzzle', audience: 'everyone', difficulty: 'hard', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'breakout', emoji: '🧱', nameKey: 'breakout', category: 'Arcade', audience: 'everyone', difficulty: 'medium', cover: '/game-covers/default.svg' },
  { slug: 'mathquiz', emoji: '🧮', nameKey: 'mathquiz', category: 'Educational', audience: 'everyone', difficulty: 'mixed', cover: '/game-covers/default.svg' },
  { slug: 'wordscramble', emoji: '🔤', nameKey: 'wordscramble', category: 'Educational', audience: 'everyone', difficulty: 'medium', cover: '/game-covers/default.svg' },
  { slug: 'coloring', emoji: '🎨', nameKey: 'coloring', category: 'Creative', audience: 'creative', difficulty: 'easy', cover: '/game-covers/default.svg', isNew: true },
  { slug: 'style-studio', emoji: '👗', nameKey: 'styleStudio', category: 'Creative', audience: 'creative', difficulty: 'mixed', cover: '/game-covers/default.svg', isNew: true },
  { slug: 'penalty', emoji: '⚽', nameKey: 'penalty', category: 'Sports', audience: 'sports', difficulty: 'mixed', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'runner', emoji: '🏁', nameKey: 'runner', category: 'Racing', audience: 'sports', difficulty: 'hard', cover: '/game-covers/default.svg', isPopular: true },
  { slug: 'bubble-pop', emoji: '🫧', nameKey: 'bubblePop', category: 'Arcade', audience: 'everyone', difficulty: 'easy', cover: '/game-covers/default.svg' },
  { slug: 'reaction', emoji: '⚡', nameKey: 'reaction', category: 'Action', audience: 'everyone', difficulty: 'mixed', cover: '/game-covers/default.svg', isNew: true },
  { slug: 'maze', emoji: '🧭', nameKey: 'maze', category: 'Puzzle', audience: 'everyone', difficulty: 'mixed', cover: '/game-covers/default.svg' },
  { slug: 'pattern-sequence', emoji: '🔔', nameKey: 'patternSequence', category: 'Puzzle', audience: 'everyone', difficulty: 'hard', cover: '/game-covers/default.svg', isNew: true },
  { slug: 'typing-speed', emoji: '⌨️', nameKey: 'typingSpeed', category: 'Educational', audience: 'everyone', difficulty: 'medium', cover: '/game-covers/default.svg', isNew: true },
  { slug: 'cake-decorator', emoji: '🧁', nameKey: 'cakeDecorator', category: 'Creative', audience: 'creative', difficulty: 'easy', cover: '/game-covers/default.svg', isNew: true },
]

// Export the new games as importedGames
export const importedGames: GameInfo[] = [
  {
    "slug": "magic-christmas-tree-match-3",
    "title": "Magic Christmas Tree Match-3",
    "gameId": "cd71a6d56b514239b279f07f7cb7694f",
    "embedUrl": "https://html5.gamedistribution.com/cd71a6d56b514239b279f07f7cb7694f/?gd_sdk_referrer_url=https://yallaplays.com/games/magic-christmas-tree-match-3",
    "thumbnail": null,
    "description": "Magic Christmas Tree Match-3 is a free New Year's match-3 game where you'll complete vibrant levels, create combinations of three or more, earn bonuses, and help the heroes decorate the festive town. Solve match-3 puzzles, combine elements, use power-ups, explosions, and super combos to complete tasks faster and advance the story.",
    "instructions": "How to play match-3 puzzle: ● Match 3 or more pieces in a line to explode them. ● Match 4 pieces to create the Rocket. The Rocket blows up the whole line! ● Match 4 pieces to form a square to create the Spinner. The Spinner destroys one of the targets! ● Make a T-shaped match of 5 pieces to create the Bomb. The Bomb makes a massive explosion on the board! ● Match 5 pieces in a line to create the Rainbow Flower. The Rainbow Flower explodes pieces of the same color!",
    "genres": [
      "Match-3"
    ],
    "tags": [
      "christmasmatch3matchingsliding-puzzle"
    ],
    "company": "Broccoli Games",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/magic-christmas-tree-match-3"
  },
  {
    "slug": "traffic-racing-1",
    "title": "Traffic Racing",
    "gameId": "f3ee6674b4ea4579aeefd54d7bf388f0",
    "embedUrl": "https://html5.gamedistribution.com/f3ee6674b4ea4579aeefd54d7bf388f0/?gd_sdk_referrer_url=https://yallaplays.com/games/traffic-racing-1",
    "thumbnail": "https://img.gamedistribution.com/f3ee6674b4ea4579aeefd54d7bf388f0-512x384.jpg",
    "description": "Traffic Racing is a fast-paced driving game that throws you into intense highway action where every second counts. Weave through heavy traffic at high speeds as you compete in Career Mode or test your skills against others in Racing League Online.",
    "instructions": "WASD/Arrow keys",
    "genres": [
      "Racing & Driving"
    ],
    "tags": [
      "carcitymotorcyclespeedtraffic"
    ],
    "company": "Royale Gamers",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/traffic-racing-1"
  },
  {
    "slug": "max-speed",
    "title": "Max Speed",
    "gameId": "48f3d14ced3646b781e256ca7f9bfa30",
    "embedUrl": "https://html5.gamedistribution.com/48f3d14ced3646b781e256ca7f9bfa30/?gd_sdk_referrer_url=https://yallaplays.com/games/max-speed",
    "thumbnail": "https://img.gamedistribution.com/48f3d14ced3646b781e256ca7f9bfa30-512x384.jpg",
    "description": "Race shiny sports cars on thrilling 3D tracks full of jumps, stunts, and intense battles. Explore exciting locations with unique challenges, perform daring tricks, upgrade and customize your cars, and test your skills in fast-paced arcade races. Enjoy high-speed action, stunning visuals, and nonstop adrenaline right in your browser.",
    "instructions": "Arrow Up/W - Front flip; Arrow Down/S - Back flip; Shift/Space - Nitro; Arrow Left/A - Turn left/Barrel Flip; Arrow Right/D - Turn right/Barrel flip",
    "genres": [
      "Racing & Driving"
    ],
    "tags": [
      "car3d"
    ],
    "company": "SMOKOKO LTD",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/max-speed"
  },
  {
    "slug": "i8-city-driver",
    "title": "i8 City Driver",
    "gameId": "f6acd919192c441c9aca2d20a18e04c6",
    "embedUrl": "https://html5.gamedistribution.com/f6acd919192c441c9aca2d20a18e04c6/?gd_sdk_referrer_url=https://yallaplays.com/games/i8-city-driver",
    "thumbnail": null,
    "description": "Get ready to skid the wheels of a stunning supercar through an expansive morning city map! Customize and upgrade your sports car with cool upgradables and become the best driver in the city. Take your dog with you in 3 driving challenges and conquer the missions together. Use nitro to beat slow traffic and beat all speed, stunt and drift triggers spread across the map. Are you ready to show your driving skills? Prove yourself!",
    "instructions": "Car: Arrow Keys/W, A, S, D: Drive/Steer/Brake C: Change Camera F: Nitro Character: Arrow Keys/W,A,S,D: Move Mouse Orbit: Look Around",
    "genres": [
      "Racing & Driving"
    ],
    "tags": [
      "1playercarcitydriftstunts"
    ],
    "company": "Fuego! Games",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/i8-city-driver"
  },
  {
    "slug": "island-expander",
    "title": "Island Expander",
    "gameId": "5ebb9c7f2dce42369c22d2eab7c0e417",
    "embedUrl": "https://html5.gamedistribution.com/5ebb9c7f2dce42369c22d2eab7c0e417/?gd_sdk_referrer_url=https://yallaplays.com/games/island-expander",
    "thumbnail": "https://img.gamedistribution.com/5ebb9c7f2dce42369c22d2eab7c0e417-512x384.jpg",
    "description": "Island Expander — relaxing crafting game. Collect resources, discover 30+ recipes, and grow your island step by step! It is a cozy crafting game where you transform a tiny island into a paradise. Collect resources, unlock recipes, craft items — from simple tools to complex machines — and watch your island grow with every step. Start building your dream island today! ?",
    "instructions": "Control your character using mouse and keyboard: Mouse — look around LMB — hit / use tool Keys 1–4 — switch tools Tab — open inventory E — interact with objects ESC — pause menu Left ALT / Right Alt - Unlock Mouse Gather resources, craft items, and expand your island step by step.",
    "genres": [
      "Adventure"
    ],
    "tags": [
      "1playercraftislandsurvival3d"
    ],
    "company": "Mirra Games",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/island-expander"
  },
  {
    "slug": "67-clicker",
    "title": "67 Clicker",
    "gameId": "f078134f39634ca78dcd4a8479a314a2",
    "embedUrl": "https://html5.gamedistribution.com/f078134f39634ca78dcd4a8479a314a2/?gd_sdk_referrer_url=https://yallaplays.com/games/67-clicker",
    "thumbnail": "https://img.gamedistribution.com/f078134f39634ca78dcd4a8479a314a2-512x384.jpg",
    "description": "Forget everything you know about gaming. Experience the absolute peak of interactive entertainment. It's not just a number; it's a lifestyle. Tap the 67 and watch your empire grow. FULLY AUTOMATED STONKS: Buy upgrades to make the 67 click itself. It's literally free real estate. PEAK BRAIN ROT: No thoughts, just 67. The perfect idle experience for fans of \"number go up\" simulators.",
    "instructions": "Click the 67 in the middle of the screen. Buy upgrades using the buttons at the bottom of the screen.",
    "genres": [
      "AgilityCasual"
    ],
    "tags": [
      "1playeridletimekillerclicker"
    ],
    "company": "Miomi Game Studio",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/67-clicker"
  },
  {
    "slug": "break-a-lucky-egg-brainrots",
    "title": "Break a Lucky Egg Brainrots",
    "gameId": "1faf8bbe8906404ea218e44440ef1ab9",
    "embedUrl": "https://html5.gamedistribution.com/1faf8bbe8906404ea218e44440ef1ab9/?gd_sdk_referrer_url=https://yallaplays.com/games/break-a-lucky-egg-brainrots",
    "thumbnail": "https://img.gamedistribution.com/1faf8bbe8906404ea218e44440ef1ab9-512x384.jpg",
    "description": "Break a Lucky Egg Brainrots is a fast and rewarding collection game where action, risk, and strategy come together. Your mission is to break brainrot eggs, collect rare Brainrot characters, and safely deliver them to your base before time runs out. Each run is a mix of decision making and reflex.",
    "instructions": "Move: W, A, S, D Run: Left Shift Hit: Left Mouse Click or F Jump: Space Pick Up or Sell: E Rebirth: T Egg Index: H",
    "genres": [
      "CasualSimulation"
    ],
    "tags": [
      "1playercollecteggs2players3d"
    ],
    "company": "gameVgames",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/break-a-lucky-egg-brainrots"
  },
  {
    "slug": "screw-masters-3d-puzzle",
    "title": "Screw Masters 3D Puzzle",
    "gameId": "3cb2c3b36dca4446b037be38ddc12379",
    "embedUrl": "https://html5.gamedistribution.com/3cb2c3b36dca4446b037be38ddc12379/?gd_sdk_referrer_url=https://yallaplays.com/games/screw-masters-3d-puzzle",
    "thumbnail": null,
    "description": "Collect screws, take apart complex objects piece by piece, and test your puzzle-solving skills! Work your way through exciting levels, dismantle items down to the tiniest parts, and earn amazing rewards along the way. Use powerful bonuses to advance faster, beat challenging stages, and reach new heights. Play, win, and share your best results with friends!",
    "instructions": "Collect screws, take apart complex objects piece by piece",
    "genres": [
      "Puzzle"
    ],
    "tags": [
      "3dcolorcolormatchmatchingpin"
    ],
    "company": "Caner",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/screw-masters-3d-puzzle"
  },
  {
    "slug": "magic-sort",
    "title": "Magic Sort",
    "gameId": "a3889875d26547899d96b0364d6473f5",
    "embedUrl": "https://html5.gamedistribution.com/a3889875d26547899d96b0364d6473f5/?gd_sdk_referrer_url=https://yallaplays.com/games/magic-sort",
    "thumbnail": null,
    "description": "Welcome to Magic Sort! — a relaxing and satisfying color-sorting puzzle with a cute cat café twist! Your job is to organize colorful water layers inside multiple bottles. Each bottle contains mixed colors, and you must pour them carefully to sort every color correctly. Remember: You can only pour when the top layers are the same color. Once a bottle is perfectly sorted and filled with a single color, it magically transforms into a finished drink for your adorable cat customers!",
    "instructions": "Use left mouse button to play the game.",
    "genres": [
      "CasualPuzzle"
    ],
    "tags": [
      "catcolormatchsortingwatercolor"
    ],
    "company": "QiGame",
    "type": "",
    "orientation": "",
    "dimensions": "",
    "sourceUrl": "https://gamedistribution.com/games/magic-sort"
  }
];

export const allGames: Array<GameInfo | GameInfoLegacy> = [...gamesLegacy, ...importedGames]

// Export legacy games as games for backward compatibility
export const games = gamesLegacy;
