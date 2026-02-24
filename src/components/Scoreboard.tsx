import { useState } from 'react'
import { useLiveResults } from '../hooks/useLiveResults'
import { GameCard } from './GameCard'
import { RefreshButton } from './RefreshButton'
import { MEN_SESSIONS, WOMEN_SESSIONS, formatSessionDate, formatSessionTime, type Session } from '../types/sessions'

const EVENTS = [
  { label: 'Men',   eventId: 1, sessions: MEN_SESSIONS },
  { label: 'Women', eventId: 2, sessions: WOMEN_SESSIONS },
]

const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

interface Props {
  season: string
  competition: string
}

export function Scoreboard({ season, competition }: Props) {
  const [eventId, setEventId] = useState(1)
  const [sessionId, setSessionId] = useState(0)

  const currentEvent = EVENTS.find(e => e.eventId === eventId)!
  const sessions: Session[] = currentEvent.sessions

  const { games, loading, error, refresh, nextRefreshAt } = useLiveResults({ season, competition, eventId, sessionId })

  function handleEventChange(newEventId: number) {
    setEventId(newEventId)
    setSessionId(0)
  }

  return (
    <div>
      {/* Men / Women toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          {EVENTS.map(e => (
            <button
              key={e.eventId}
              onClick={() => handleEventChange(e.eventId)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                eventId === e.eventId
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <RefreshButton onRefresh={refresh} nextRefreshAt={nextRefreshAt} />
      </div>

      {/* Session picker */}
      <div className="mb-1">
        <p className="text-xs text-gray-400 mb-2">
          Session times shown in your local time ({localTz})
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

      {/* States */}
      {loading && (
        <div className="text-center py-12 text-gray-400">Loading scores…</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500">
          Error: {error}
          <button onClick={refresh} className="ml-2 underline">Retry</button>
        </div>
      )}
      {!loading && !error && games.length === 0 && (
        <div className="text-center py-12 text-gray-400">No games in this session.</div>
      )}

      {/* Game grid */}
      {games.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">{games[0].gamesTitle}</p>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {games.map(game => (
              <GameCard key={game.sheet} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
