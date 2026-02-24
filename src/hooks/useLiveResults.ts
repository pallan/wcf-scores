import { useState, useEffect, useCallback } from 'react'
import { fetchLiveResults, type FetchParams } from '../utils/api'
import type { Game } from '../types/api'


export function useLiveResults(params: FetchParams) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    load()
    const interval = setInterval(load, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [load])

  return { games, loading, error, refresh: load }
}
