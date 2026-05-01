'use strict'
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const BASE_URL = 'https://gamedistribution.com'
const TARGET_DOMAIN = 'https://yallaplays.com'
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/games.js')
const FAILED_FILE = path.join(process.cwd(), 'scripts/failed-games.txt')
const LINKS_FILE = path.join(process.cwd(), 'scripts/game-links.txt')
const MAX_GAMES = 500
const DELAY_MS = 500
const LISTING_PAGES = [
  `${BASE_URL}/games/`,
  `${BASE_URL}/games/?collectionID=2`,
  `${BASE_URL}/games/?collectionID=3`,
  `${BASE_URL}/games/?collectionID=4`,
]

function normalizeGameUrl(url) {
  try {
    const parsed = new URL(url, BASE_URL)
    if (parsed.hostname !== 'gamedistribution.com') return null
    if (!parsed.pathname.startsWith('/games/')) return null
    if (parsed.pathname === '/games/' || parsed.pathname === '/games') return null
    if (parsed.search) return null
    return parsed.toString().replace(/\/+$/, '')
  } catch (error) {
    return null
  }
}

function slugFromUrl(url) {
  const parsed = new URL(url)
  return parsed.pathname.replace(/^\/games\//, '').replace(/\/+$/, '')
}

function cleanText(value) {
  return value ? value.replace(/\s+/g, ' ').trim() : ''
}

function splitList(value) {
  if (!value) return []
  return Array.from(new Set(value
    .replace(/\s*\/\s*/g, ',')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)))
}

async function loadGameLinksFromFile() {
  try {
    if (!fs.existsSync(LINKS_FILE)) {
      return null
    }
    const content = fs.readFileSync(LINKS_FILE, 'utf8')
    const links = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && (line.startsWith('https://gamedistribution.com/games/') || line.startsWith('https://html5.gamedistribution.com/')))
      .map(url => {
        if (url.startsWith('https://html5.gamedistribution.com/')) {
          // Extract gameId and referrer URL
          const gameIdMatch = url.match(/https:\/\/html5\.gamedistribution\.com\/([a-f0-9]+)\//)
          const referrerMatch = url.match(/gd_sdk_referrer_url=([^&]+)/)
          if (gameIdMatch && referrerMatch) {
            const gameId = gameIdMatch[1]
            const referrerUrl = decodeURIComponent(referrerMatch[1])
            const slugMatch = referrerUrl.match(/\/games\/([^\/]+)/)
            if (slugMatch) {
              return `https://gamedistribution.com/games/${slugMatch[1]}`
            }
          }
          return null
        } else {
          return normalizeGameUrl(url)
        }
      })
      .filter(Boolean)
    return [...new Set(links)].slice(0, MAX_GAMES)
  } catch (error) {
    console.warn('Failed to load game links from file:', error.message)
    return null
  }
}

async function scrolledLinks(page) {
  const uniqueLinks = new Set()
  let previousCount = 0

  for (let pass = 0; pass < 16; pass += 1) {
    const links = await page.$$eval('a[href]', anchors =>
      anchors.map(anchor => anchor.href)
    )

    links.forEach(href => {
      const normalized = normalizeGameUrl(href)
      if (normalized) uniqueLinks.add(normalized)
    })

    if (uniqueLinks.size >= MAX_GAMES || uniqueLinks.size === previousCount) break
    previousCount = uniqueLinks.size

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 1.5)
    })
    await page.waitForTimeout(2000)
  }

  return [...uniqueLinks].slice(0, MAX_GAMES)
}

async function extractGameData(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.waitForTimeout(4000)

  const result = await page.evaluate(() => {
    const textForLabel = (label, nextLabels = []) => {
      const heading = Array.from(document.querySelectorAll('h2, h3, h4, strong')).find(el => {
        return el.textContent.trim().toUpperCase() === label.toUpperCase()
      })
      if (!heading) return null
      let next = heading.nextElementSibling
      while (next && next.textContent.trim() === '') next = next.nextElementSibling
      return next ? next.textContent.trim() : null
    }

    const rowText = Array.from(document.querySelectorAll('.row')).map(el => el.textContent.trim()).join(' ')

    const parseBetween = (label, nextLabels = []) => {
      const labels = [...nextLabels, '$'].map(lbl => lbl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')
      const regex = new RegExp(`${label}([\s\S]*?)(?=${labels})`, 'i')
      const match = rowText.match(regex)
      return match ? match[1].trim().replace(/\s+/g, ' ') : null
    }

    const titleRow = Array.from(document.querySelectorAll('.row span.flex.flex-1')).find(el => el.textContent.includes('Game Title:'))
    const title = titleRow ? titleRow.querySelector('strong')?.textContent.trim() : null

    const companyRow = Array.from(document.querySelectorAll('.row span.flex.flex-1')).find(el => el.textContent.includes('Published by:'))
    const company = companyRow ? companyRow.querySelector('a')?.textContent.trim() : null

    const iframeSrc = document.querySelector('iframe[src*="html5.gamedistribution.com"]')?.src || null
    const embedText = Array.from(document.querySelectorAll('strong')).find(el => el.textContent.includes('https://html5.gamedistribution.com/'))?.textContent.trim() || null

    const description = textForLabel('DESCRIPTION')
    const instructions = textForLabel('INSTRUCTIONS')

    const genres = Array.from(document.querySelectorAll('h4')).find(el => el.textContent.trim() === 'Genres')?.nextElementSibling?.textContent.trim() || parseBetween('Genres', ['Tags', 'Published', 'Last Updated', 'Type', 'Subtype', 'Screen Orientation', 'Dimensions', 'Company'])
    const tags = Array.from(document.querySelectorAll('h4')).find(el => el.textContent.trim() === 'Tags')?.nextElementSibling?.textContent.trim() || null

    const type = parseBetween('Type', ['Subtype', 'Screen Orientation', 'Dimensions', 'Company'])
    const orientation = parseBetween('Screen Orientation', ['Dimensions', 'Company'])
    const dimensions = parseBetween('Dimensions', ['Company'])

    const titleText = title || document.title || ''
    const thumbnail = Array.from(document.querySelectorAll('img')).find(img => img.alt.trim() === titleText && /-512x384\.|-1280x720\.|-512x512\./.test(img.src))?.src || Array.from(document.querySelectorAll('img')).find(img => img.alt.trim() === titleText)?.src || null

    return {
      title: titleText,
      iframeSrc,
      embedText,
      thumbnail,
      description,
      instructions,
      genres,
      tags,
      company,
      type,
      orientation,
      dimensions,
    }
  })

  const pageTitle = cleanText(result.title)
  const rawEmbedUrl = result.iframeSrc || result.embedText
  const gameIdMatch = rawEmbedUrl ? rawEmbedUrl.match(/html5\.gamedistribution\.com\/([a-f0-9]+)\//i) : null
  const gameId = gameIdMatch ? gameIdMatch[1] : null

  return {
    title: pageTitle || null,
    gameId,
    embedUrl: rawEmbedUrl || null,
    thumbnail: cleanText(result.thumbnail) || null,
    description: cleanText(result.description) || null,
    instructions: cleanText(result.instructions) || null,
    genres: splitList(result.genres),
    tags: splitList(result.tags),
    company: cleanText(result.company) || null,
    type: cleanText(result.type) || null,
    orientation: cleanText(result.orientation) || null,
    dimensions: cleanText(result.dimensions) || null,
  }
}

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  let allGameUrls = []

  // Try loading from file first
  const fileLinks = await loadGameLinksFromFile()
  if (fileLinks && fileLinks.length > 0) {
    console.log(`Loaded ${fileLinks.length} game links from ${LINKS_FILE}`)
    allGameUrls = fileLinks
  } else {
    console.log(`No game links file found at ${LINKS_FILE}, scraping from web...`)
    const gameUrls = new Set()

    for (const url of LISTING_PAGES) {
      console.log(`Collecting game links from: ${url}`)
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 })
        await page.waitForTimeout(4000)
        const pageLinks = await scrolledLinks(page)
        pageLinks.forEach(link => {
          if (gameUrls.size < MAX_GAMES) {
            gameUrls.add(link)
          }
        })
        console.log(`  found ${gameUrls.size} unique game links so far`)
      } catch (error) {
        console.error(`Failed to collect links from ${url}:`, error.message)
      }
    }

    allGameUrls = [...gameUrls].slice(0, MAX_GAMES)
  }
  const importedGames = []
  const failedGames = []
  const seenIds = new Set()
  const seenSlugs = new Set()

  for (let index = 0; index < allGameUrls.length; index += 1) {
    const url = allGameUrls[index]
    const slug = slugFromUrl(url)
    if (!slug) continue
    if (seenSlugs.has(slug)) continue

    console.log(`Scraping (${index + 1}/${allGameUrls.length}): ${url}`)
    try {
      const data = await extractGameData(page, url)
      if (!data.gameId) {
        throw new Error('Missing gameId')
      }
      if (seenIds.has(data.gameId) || seenSlugs.has(slug)) {
        console.log(`  skipping duplicate ${slug} / ${data.gameId}`)
        continue
      }
      seenIds.add(data.gameId)
      seenSlugs.add(slug)

      importedGames.push({
        slug,
        title: data.title || slug,
        gameId: data.gameId,
        embedUrl: `https://html5.gamedistribution.com/${data.gameId}/?gd_sdk_referrer_url=${TARGET_DOMAIN}/games/${slug}`,
        thumbnail: data.thumbnail || null,
        description: data.description || '',
        instructions: data.instructions || '',
        genres: data.genres,
        tags: data.tags,
        company: data.company || '',
        type: data.type || '',
        orientation: data.orientation || '',
        dimensions: data.dimensions || '',
        sourceUrl: url,
      })
      console.log(`  imported ${slug} (${data.gameId})`)
    } catch (error) {
      console.warn(`  failed ${url}: ${error.message}`)
      failedGames.push(url)
    }

    await page.waitForTimeout(DELAY_MS)
  }

  await browser.close()

  fs.mkdirSync(path.dirname(FAILED_FILE), { recursive: true })
  fs.writeFileSync(FAILED_FILE, failedGames.join('\n'), 'utf8')

  const output = `export const games = ${JSON.stringify(importedGames, null, 2)};\n`
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')

  console.log('\nSummary:')
  console.log(`  Found game URLs: ${allGameUrls.length}`)
  console.log(`  Imported games: ${importedGames.length}`)
  console.log(`  Failed games: ${failedGames.length}`)
  if (failedGames.length) {
    console.log(`  Failed links written to ${FAILED_FILE}`)
  }
}

run().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
