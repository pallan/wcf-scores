import { useState, useEffect } from 'react'
import { fetchLiveResults } from '../utils/api'
import type { Game } from '../types/api'
import type { Session } from '../types/sessions'

export interface TeamGame {
  sessionLabel: string
  game: Game
  isHome: boolean
}

interface Params {
  season: string
  competition: string
  eventId: number
  sessions: Session[]
}

export function useTeamHistory(params: Params, noc: string) {
  const [games, setGames] = useState<TeamGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setGames([])

    const startedSessions = params.sessions.filter(
      s => new Date(s.startUtc).getTime() <= Date.now()
    )

    Promise.all(
      startedSessions.map(session =>
        fetchLiveResults({
          season: params.season,
          competition: params.competition,
          eventId: params.eventId,
          sessionId: session.id,
        }).then(sessionGames => ({ session, sessionGames }))
      )
    )
      .then(results => {
        const teamGames: TeamGame[] = []
        for (const { session, sessionGames } of results) {
          for (const game of sessionGames) {
            if (game.homeTeam.noc === noc) {
              teamGames.push({ sessionLabel: session.label, game, isHome: true })
            } else if (game.awayTeam.noc === noc) {
              teamGames.push({ sessionLabel: session.label, game, isHome: false })
            }
          }
        }
        setGames(teamGames)
        setLoading(false)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load')
        setLoading(false)
      })
  }, [noc, params.season, params.competition, params.eventId])

  return { games, loading, error }
}
