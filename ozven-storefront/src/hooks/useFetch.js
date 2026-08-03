import { useCallback, useEffect, useState } from 'react'

/**
 * Reusable data-fetching hook with loading / error / data states.
 * @param {() => Promise<any>} fetcher - async function that returns data
 * @param {Array} deps - dependency array (re-fetch when these change)
 * @param {{ immediate?: boolean }} options
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { immediate = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      return result
    } catch (err) {
      const message = err?.message || 'Failed to load data.'
      setError(message)
      setData(null)
      throw err
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (!immediate) return undefined

    let active = true

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetcher()
        if (active) setData(result)
      } catch (err) {
        if (active) {
          setError(err?.message || 'Failed to load data.')
          setData(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch: execute, setData }
}
