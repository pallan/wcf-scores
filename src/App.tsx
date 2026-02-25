import { useState, useEffect, useRef, useCallback } from 'react'
import { Scoreboard } from './components/Scoreboard'
import { Standings } from './components/Standings'
import { RefreshButton } from './components/RefreshButton'
import { MEN_SESSIONS, WOMEN_SESSIONS, getActiveSession } from './types/sessions'

const INTERVAL_MS = 2 * 60 * 1000

const EVENTS = [
  { label: 'Men',   eventId: 1 },
  { label: 'Women', eventId: 2 },
]

function App() {
  const [eventId, setEventId] = useState(() => {
    const menActive   = getActiveSession(MEN_SESSIONS)   !== 0
    const womenActive = getActiveSession(WOMEN_SESSIONS) !== 0
    return !menActive && womenActive ? 2 : 1
  })

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [nextRefreshAt, setNextRefreshAt] = useState(() => Date.now() + INTERVAL_MS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setNextRefreshAt(Date.now() + INTERVAL_MS)
    intervalRef.current = setInterval(() => {
      setRefreshTrigger(n => n + 1)
      setNextRefreshAt(Date.now() + INTERVAL_MS)
    }, INTERVAL_MS)
  }, [])

  useEffect(() => {
    startInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startInterval])

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(n => n + 1)
    startInterval()
  }, [startInterval])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold tracking-tight">WCF Scores</h1>
        <p className="text-blue-300 text-sm">World Junior Curling Championship 2025–26</p>
      </header>

      {/* Controls bar */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto py-3 flex items-center gap-4">
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            {EVENTS.map(e => (
              <button
                key={e.eventId}
                onClick={() => setEventId(e.eventId)}
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
          <RefreshButton onRefresh={handleRefresh} nextRefreshAt={nextRefreshAt} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 items-start">
          <div className="w-4/5 min-w-0">
            <Scoreboard
              season="2526"
              competition="WJCC"
              eventId={eventId}
              refreshTrigger={refreshTrigger}
            />
          </div>
          <div className="w-1/5 min-w-0">
            <Standings
              season="2526"
              competition="WJCC"
              eventId={eventId}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 py-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Data provided by World Curling and CURLIT (
        <a
          href="https://livescores.worldcurling.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          livescores.worldcurling.org
        </a>
        ). This project is not sponsored or endorsed by World Curling or CURLIT.
      </footer>
    </div>
  )
}

export default App
