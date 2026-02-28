import { useLiveResults } from '../hooks/useLiveResults'
import type { TeamData } from '../types/api'

interface StandingRow {
  noc: string
  name: string
  w: number
  l: number
}

function deriveStandings(teams: TeamData[]): StandingRow[] {
  const map = new Map<string, StandingRow>()
  for (const t of teams) {
    map.set(t.noc, {
      noc: t.noc,
      name: t.teamShortName,
      w: t.w,
      l: t.l,
    })
  }
  return Array.from(map.values()).sort((a, b) => b.w - a.w || a.l - b.l)
}

interface Props {
  season: string
  competition: string
  eventId: number
  refreshTrigger: number
  onTeamClick?: (noc: string, name: string) => void
}

export function Standings({ season, competition, eventId, refreshTrigger, onTeamClick }: Props) {
  const { games, loading, error } = useLiveResults({ season, competition, eventId, sessionId: 0 }, refreshTrigger)

  const allTeams = games.flatMap(g => [g.homeTeam, g.awayTeam])
  const rows = deriveStandings(allTeams)

  return (
    <div>
      {loading && <div className="text-center py-12 text-gray-400">Loading…</div>}
      {error && <div className="text-center py-6 text-red-500 text-sm">Error: {error}</div>}
      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-gray-400">No data available.</div>
      )}

      {rows.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full lg:inline-block lg:min-w-45">
          <table className="text-sm w-full lg:w-auto">
            <thead>
              <tr className="bg-wcf-house-blue text-white text-xs uppercase tracking-wide">
                <th className="text-left px-3 py-3 w-6">#</th>
                <th className="text-left px-3 py-3">Team</th>
                <th className="text-center px-3 py-3">W</th>
                <th className="text-center px-3 py-3">L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.noc}
                  className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => onTeamClick?.(row.noc, row.name)}
                      className="font-semibold text-gray-900 hover:underline hover:text-wcf-house-blue transition-colors text-left"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center font-bold text-wcf-dark-green">{row.w}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
