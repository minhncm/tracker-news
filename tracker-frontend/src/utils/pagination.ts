export type PageItem =
  | { kind: 'page'; value: number }
  | { kind: 'ellipsis'; key: string }

/**
 * Builds the list of pagination controls to render, surrounding the current
 * page and trimming long ranges with an ellipsis on either side.
 */
export function getPageWindow(
  currentPage: number,
  totalPages: number,
  windowSize = 5,
): PageItem[] {
  const total = Math.max(1, totalPages)
  const current = Math.min(Math.max(1, currentPage), total)

  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => ({
      kind: 'page' as const,
      value: i + 1,
    }))
  }

  const half = Math.floor(windowSize / 2)
  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = windowSize
  }
  if (end > total) {
    end = total
    start = total - windowSize + 1
  }

  const items: PageItem[] = []
  for (let i = start; i <= end; i += 1) {
    items.push({ kind: 'page', value: i })
  }

  if (start > 2) {
    items.unshift({ kind: 'ellipsis', key: 'ellipsis-left' })
    items.unshift({ kind: 'page', value: 1 })
  } else if (start === 2) {
    items.unshift({ kind: 'page', value: 1 })
  }

  if (end < total - 1) {
    items.push({ kind: 'ellipsis', key: 'ellipsis-right' })
    items.push({ kind: 'page', value: total })
  } else if (end === total - 1) {
    items.push({ kind: 'page', value: total })
  }

  return items
}

/**
 * Renders the visible range of items for a page, e.g. "1–10" or "10–10".
 * Returns just "0" when the collection is empty.
 */
export function formatRange(page: number, pageSize: number, total: number): string {
  if (total === 0) return '0'
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return start === end ? String(start) : `${start}\u2013${end}`
}