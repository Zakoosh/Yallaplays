# Yalla Plays Game Import Script

This script imports games from GameDistribution and creates dynamic game pages.

## Usage

### Option 1: Automatic Scraping (Default)
```bash
node scripts/import-games.js
```

This will:
- Scrape game links from GameDistribution listing pages
- Extract game metadata from each game page
- Save results to `src/data/games.js`
- Create dynamic pages for each game

### Option 2: Manual Links File
If scraping is blocked, create `scripts/game-links.txt` with game URLs:

```
https://gamedistribution.com/games/bloom-sort-2:-bee-puzzle/
https://gamedistribution.com/games/fruit-block-tetra-puzzle/
https://gamedistribution.com/games/girly-puzzle/
```

Then run:
```bash
node scripts/import-games.js
```

The script will automatically detect and use the links file.

## Output Files

- `src/data/games.js` - Game data for the application
- `scripts/failed-games.txt` - URLs that failed to import

## Game Page Features

Each imported game gets:
- Dynamic route: `/games/:slug`
- SEO metadata (title, description, OpenGraph, Twitter)
- JSON-LD schema for VideoGame
- Game iframe with fullscreen button
- Similar games sidebar
- Breadcrumb navigation

## Requirements

- Node.js
- Playwright (installed via `npm install --save-dev playwright`)

## Configuration

Edit the constants at the top of `scripts/import-games.js`:
- `MAX_GAMES`: Maximum games to import (default: 500)
- `DELAY_MS`: Delay between requests (default: 500ms)
- `LISTING_PAGES`: GameDistribution pages to scrape from