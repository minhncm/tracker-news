import type {
  Article,
  EventType,
  Paginated,
  ReadingSession,
} from '../types'

interface ListResponseDTO<T> {
  data: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

interface SessionDTO {
  sessionId: string
  startTime: string
  endTime: string
  totalReadingTime: number
  events: EventDTO[]
}

interface EventDTO {
  id: number
  eventType: EventType
  timestamp: string
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

function toPaginated<T>(raw: ListResponseDTO<T>): Paginated<T> {
  return {
    items: raw.data,
    total: raw.totalElements,
    page: raw.page,
    pageSize: raw.size,
    totalPages: raw.totalPages,
  }
}

function toSession(dto: SessionDTO): ReadingSession {
  return {
    id: dto.sessionId,
    startTime: dto.startTime,
    endTime: dto.endTime,
    totalReadingTimeMs: dto.totalReadingTime,
    events: dto.events.map((event) => ({
      id: event.id,
      type: event.eventType,
      timestamp: event.timestamp,
    })),
  }
}

export const api = {
  async fetchArticles(page: number, size = 10): Promise<Paginated<Article>> {
    const raw = await get<ListResponseDTO<Article>>(
      `/api/articles?page=${page}&size=${size}`,
    )
    return toPaginated(raw)
  },

  async fetchArticle(id: number): Promise<Article | undefined> {
    const raw = await get<ListResponseDTO<Article>>(
      `/api/articles?page=${Math.max(1, Math.ceil(id / 100))}&size=100`,
    )
    return raw.data.find((article) => article.id === id)
  },

  async fetchSessions(
    articleId: number,
    page: number,
    size = 10,
  ): Promise<Paginated<ReadingSession>> {
    const raw = await get<ListResponseDTO<SessionDTO>>(
      `/api/sessions?articleId=${articleId}&page=${page}&size=${size}`,
    )
    return toPaginated({
      ...raw,
      data: raw.data.map(toSession),
    })
  },
}