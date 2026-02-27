import { useState, useEffect } from 'react'
import { useLiveResults } from '../hooks/useLiveResults'
import { GameCard } from './GameCard'
import { MEN_SESSIONS, WOMEN_SESSIONS, formatSessionDate, formatSessionTime, type Session } from '../types/sessions'

const SESSION_MAP: Record<number, Session[]> = {
  1: MEN_SESSIONS,
  2: WOMEN_SESSIONS,
}

const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

interface Props {
  season: string
  competition: string
  eventId: number
  refreshTrigger: number
  onTeamClick?: (noc: string, name: string) => void
}

export function Scoreboard({ season, competition, eventId, refreshTrigger, onTeamClick }: Props) {
  const [sessionId, setSessionId] = useState(0)

  useEffect(() => {
    setSessionId(0)
  }, [eventId])

  const sessions: Session[] = SESSION_MAP[eventId] ?? MEN_SESSIONS
  const { games, loading, error } = useLiveResults({ season, competition, eventId, sessionId }, refreshTrigger)

  return (
    <div>
      {/* Session picker */}
      <div className="mb-1">
        <p className="text-xs text-gray-400 mb-2">
          Session times in your local time ({localTz})
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          <button
            onClick={() => setSessionId(0)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              sessionId === 0
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            Current
          </button>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setSessionId(s.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs border transition-colors text-left ${
                sessionId === s.id
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className={`text-xs ${sessionId === s.id ? 'text-blue-200' : 'text-gray-400'}`}>
                {formatSessionDate(s.startUtc)}
              </div>
              <div className={`text-xs ${sessionId === s.id ? 'text-blue-200' : 'text-gray-400'}`}>
                {formatSessionTime(s.startUtc)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-12 text-gray-400">Loading scores…</div>}
      {error && <div className="text-center py-12 text-red-500">Error: {error}</div>}
      {!loading && !error && games.length === 0 && (
        <div className="text-center py-12 text-gray-400">No games in this session.</div>
      )}

      {games.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">{games[0].gamesTitle}</p>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {games.map(game => (
              <GameCard key={game.sheet} game={game} onTeamClick={onTeamClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
