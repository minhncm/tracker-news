import { useEffect, useState } from 'react'

interface AsyncResult<T> {
  data: T | undefined
  loading: boolean
}

/**
 * Runs an async (mock) fetch whenever `key` changes and reports a `loading`
 * flag derived from whether the resolved data matches the requested key.
 * This avoids resetting a loading flag synchronously inside an effect.
 */
export function useMockQuery<T>(key: unknown, fetcher: () => Promise<T>): AsyncResult<T> {
  const [resolved, setResolved] = useState<{ key: unknown; data: T } | null>(null)

  useEffect(() => {
    let active = true
    fetcher().then((data) => {
      if (active) setResolved({ key, data })
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const loading = resolved === null || resolved.key !== key
  return { data: loading ? undefined : resolved.data, loading }
}