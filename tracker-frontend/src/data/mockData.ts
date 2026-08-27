import type {
  Article,
  EventType,
  Paginated,
  ReadingSession,
  SessionEvent,
} from '../types'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(20260827)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatTimestamp(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

export function formatClockTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

const DOMAINS = [
  'vnexpress.net',
  'dantri.com.vn',
  'tuoitre.vn',
  'nhandan.vn',
  'zingnews.vn',
  'vietnamnet.vn',
  'baochinhphu.vn',
  'theverge.com',
  'techcrunch.com',
  'wired.com',
]

const SUBJECTS = [
  'OpenAI',
  'Vietnam',
  'Apple',
  'Google',
  'Hanoi',
  'Meta',
  'Samsung',
  'Ho Chi Minh City',
  'NVIDIA',
  'Microsoft',
]

const VERBS = [
  'introduces a new AI model',
  'faces supply chain pressure',
  'announces major expansion',
  'launches a flagship smartphone',
  'reports record quarterly revenue',
  'signs a strategic partnership',
  'rolls out an updated pricing plan',
  'hosts an international tech summit',
  'unveils ambitious 2030 roadmap',
  'strengthens regional cooperation',
]

const LEADINGS = [
  'Industry leaders welcome the move as competition heats up across the region.',
  'Experts say the decision could reshape the market within the next two years.',
  'Observers note the timing comes amid growing regulatory scrutiny.',
  'The announcement follows months of speculation and internal restructuring.',
]

function buildContent(): string {
  const para = () => {
    const sentences = 3 + Math.floor(rng() * 3)
    const words: string[] = []
    for (let i = 0; i < sentences * 9; i += 1) {
      words.push(pick([
        'the', 'market', 'company', 'report', 'official', 'government', 'sector',
        'region', 'technology', 'investment', 'policy', 'growth', 'consumer',
        'product', 'service', 'analyst', 'strategy', 'partnership', 'data',
        'infrastructure', 'says', 'confirmed', 'expected', 'revealed', 'remains',
        'strong', 'global', 'local', 'digital', 'national', 'project', 'city',
        'economy', 'business', 'research', 'development', 'launch', 'traffic',
      ]))
    }
    return words.join(' ')
  }
  // Deterministic-ish content without seeding per article for brevity.
  const before = LEADINGS.join(' ')
  const body = `${para()} ${para()} ${para()}`
  return `${before}\n\n${body}`
}

function buildSlug(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${id}.html`
}

function buildArticle(id: number): Article {
  const domain = pick(DOMAINS)
  const subject = pick(SUBJECTS)
  const verb = pick(VERBS)
  const suffix = id % 3 === 0 ? ' — analysis' : ''
  const title = `${subject} ${verb}${suffix}`
  return {
    id,
    url: `https://${domain}/${buildSlug(title, id)}`,
    domain,
    title,
    content: buildContent(),
  }
}

function buildEventsForSession(
  start: Date,
  end: Date,
): { events: SessionEvent[]; activeMs: number } {
  const totalSeconds = Math.max(10, Math.round((end.getTime() - start.getTime()) / 1000))

  const segments: Array<{ active: boolean; seconds: number }> = []
  // First active stretch mirrors the short PAGE_ACTIVE ping after entering.
  segments.push({ active: true, seconds: 4 + rng() * 16 })

  let covered = segments[0].seconds
  while (covered < totalSeconds) {
    const remaining = totalSeconds - covered
    if (remaining < 1) break
    const inactive = Math.min(remaining, 3 + rng() * 60)
    segments.push({ active: false, seconds: inactive })
    covered += inactive
    if (covered >= totalSeconds) break
    const active = Math.min(totalSeconds - covered, 4 + rng() * 40)
    segments.push({ active: true, seconds: active })
    covered += active
  }

  // Scale durations so the generated series lands exactly on `end`.
  const factor = totalSeconds / Math.max(1, covered)
  const scaled = segments.map((s) => ({ active: s.active, seconds: s.seconds * factor }))

  const events: SessionEvent[] = []
  let cursor = start.getTime()
  events.push({ id: 1, type: 'PAGE_ENTER', timestamp: formatTimestamp(new Date(cursor)) })

  let activeSeconds = 0
  let eventId = 2
  for (const seg of scaled) {
    cursor += seg.seconds * 1000
    // The final active segment is folded into the PAGE_LEAVE event to avoid a
    // zero-length transition at the very end.
    if (cursor >= end.getTime()) break
    const type: EventType = seg.active ? 'PAGE_ACTIVE' : 'PAGE_INACTIVE'
    events.push({ id: eventId, type, timestamp: formatTimestamp(new Date(cursor)) })
    eventId++
    if (seg.active) activeSeconds += seg.seconds
  }
  // Re-add the trailing active time (<= last inactive gap) to keep the total
  // reading time consistent with the printed start/end + event series.
  const last = scaled[scaled.length - 1]
  if (last?.active) activeSeconds += last.seconds

  events.push({
    id: eventId,
    type: 'PAGE_LEAVE',
    timestamp: formatTimestamp(end),
  })

  activeSeconds = Math.max(1, Math.round(activeSeconds))
  return { events, activeMs: activeSeconds * 1000 }
}

function randomId(prefix: number): string {
  const hex = () => Math.floor(rng() * 0x10000).toString(16).padStart(4, '0')
  return `${prefix.toString(16).padStart(4, '0')}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`
}

function buildSessions(articleId: number): ReadingSession[] {
  const countRoll = rng()
  let count: number
  if (countRoll < 0.08) {
    count = 0
  } else if (countRoll < 0.22) {
    count = 11 + Math.floor(rng() * 46) // 11..56 => exercises session pagination
  } else if (countRoll < 0.55) {
    count = 1 + Math.floor(rng() * 4)
  } else {
    count = 4 + Math.floor(rng() * 7)
  }

  if (count === 0) return []

  const sessions: ReadingSession[] = []
  const daysBack = 15 + Math.floor(rng() * 11) // anchor: between 5..15 Aug 2026
  const randomMinutes = 3 + Math.floor(rng() * 4) // sessions per article day window

  for (let i = 0; i < count; i += 1) {
    const dayBack = Math.max(0, daysBack - Math.floor(i / randomMinutes))
    const start = new Date(2026, 7, 27 - dayBack, 7 + Math.floor(rng() * 13), Math.floor(rng() * 60), Math.floor(rng() * 60))
    const durationMs = (90 + Math.floor(rng() * 900)) * 1000 // 1.5m..16.5m
    const end = new Date(start.getTime() + durationMs)

    // 40% of sessions keep no events to demonstrate the empty state.
    if (rng() < 0.4) {
      sessions.push({
        id: randomId(articleId),
        startTime: formatTimestamp(start),
        endTime: formatTimestamp(end),
        totalReadingTimeMs: durationMs,
        events: [],
      })
      continue
    }

    const { events, activeMs } = buildEventsForSession(start, end)

    sessions.push({
      id: randomId(articleId),
      startTime: formatTimestamp(start),
      endTime: formatTimestamp(end),
      totalReadingTimeMs: activeMs,
      events,
    })
  }

  // Sort by start time, most recent first.
  return sessions.sort((a, b) => (a.startTime < b.startTime ? 1 : -1))
}

const ARTICLE_COUNT = 128
const seedArticles: Article[] = Array.from({ length: ARTICLE_COUNT }, (_, i) => buildArticle(i + 1))

const sessionMap = new Map<number, ReadingSession[]>()
const articleById = new Map<number, Article>()

for (const article of seedArticles) {
  articleById.set(article.id, article)
  sessionMap.set(article.id, buildSessions(article.id))
}

/** Simulated network latency so loading skeletons are visible. */
function delay<T>(value: T, duration = 550, minDuration = 350): Promise<T> {
  const wait = duration + Math.random() * (duration - minDuration)
  return new Promise((resolve) => setTimeout(() => resolve(value), wait))
}

function slicePage<T>(items: T[], page: number, size: number): Paginated<T> {
  const safePage = Math.max(1, page)
  const totalPages = Math.max(1, Math.ceil(items.length / size))
  const start = (safePage - 1) * size
  return {
    items: items.slice(start, start + size),
    total: items.length,
    page: safePage,
    pageSize: size,
    totalPages,
  }
}

export const mockApi = {
  async fetchArticles(page: number, size = 10): Promise<Paginated<Article>> {
    return delay(slicePage(seedArticles, page, size))
  },

  async fetchArticle(id: number): Promise<Article | undefined> {
    return delay(articleById.get(id))
  },

  async fetchSessions(articleId: number, page: number, size = 10): Promise<Paginated<ReadingSession>> {
    const sessions = sessionMap.get(articleId) ?? []
    return delay(slicePage(sessions, page, size))
  },

  async fetchSession(articleId: number, sessionId: string): Promise<ReadingSession | undefined> {
    const sessions = sessionMap.get(articleId) ?? []
    return delay(sessions.find((s) => s.id === sessionId))
  },
}