import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchLiveResults, type FetchParams } from '../utils/api'
import type { Game } from '../types/api'

const INTERVAL_MS = 2 * 60 * 1000

export function useLiveResults(params: FetchParams) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextRefreshAt, setNextRefreshAt] = useState(() => Date.now() + INTERVAL_MS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchLiveResults(params)
      setGames(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch scores')
    } finally {
      setLoading(false)
    }
  }, [params.season, params.competition, params.eventId, params.sessionId])

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setNextRefreshAt(Date.now() + INTERVAL_MS)
    intervalRef.current = setInterval(() => {
      load()
      setNextRefreshAt(Date.now() + INTERVAL_MS)
    }, INTERVAL_MS)
  }, [load])

  useEffect(() => {
    load()
    startInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load, startInterval])

  const refresh = useCallback(async () => {
    await load()
    startInterval()
  }, [load, startInterval])

  return { games, loading, error, refresh, nextRefreshAt }
}
