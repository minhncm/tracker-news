export interface Article {
  id: number
  url: string
  domain: string
  title: string
  content: string
}

export type EventType =
  | 'PAGE_ENTER'
  | 'PAGE_ACTIVE'
  | 'PAGE_INACTIVE'
  | 'PAGE_LEAVE'

export interface SessionEvent {
  id: number
  type: EventType
  timestamp: string
}

export interface ReadingSession {
  id: string
  startTime: string
  endTime: string
  totalReadingTimeMs: number
  events: SessionEvent[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}