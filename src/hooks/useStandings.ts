import { useState, useEffect } from 'react'
import { fetchLiveResults } from '../utils/api'
import type { TeamData } from '../types/api'
import type { Session } from '../types/sessions'

interface Params {
  season: string
  competition: string
  eventId: number
  sessions: Session[]
}

/**
 * Fetches the last 3 started sessions and merges team records.
 * This ensures teams with a bye in the current session still appear,
 * since w/l totals are cumulative and any recent session carries them.
 */
export function useStandings(params: Params, refreshTrigger: number) {
  const [teams, setTeams] = useState<TeamData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const startedSessions = params.sessions.filter(
      s => new Date(s.startUtc).getTime() <= Date.now()
    )
    // Last 3 sessions is enough to catch all teams even on a bye day
    const toFetch = startedSessions.slice(-3)

    Promise.all(
      toFetch.map(s =>
        fetchLiveResults({
          season: params.season,
          competition: params.competition,
          eventId: params.eventId,
          sessionId: s.id,
        })
      )
    )
      .then(results => {
        const map = new Map<string, TeamData>()
        for (const games of results) {
          for (const game of games) {
            for (const team of [game.homeTeam, game.awayTeam]) {
              const existing = map.get(team.noc)
              // Keep the record with the most games played (most up-to-date)
              if (!existing || team.w + team.l > existing.w + existing.l) {
                map.set(team.noc, team)
              }
            }
          }
        }
        setTeams(Array.from(map.values()))
        setLoading(false)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load')
        setLoading(false)
      })
  }, [params.season, params.competition, params.eventId, refreshTrigger])

  return { teams, loading, error }
}
