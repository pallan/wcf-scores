import { useLiveResults } from '../hooks/useLiveResults'
import type { TeamData } from '../types/api'

interface StandingRow {
  noc: string
  name: string
  w: number
  l: number
  pct: number
}

function deriveStandings(teams: TeamData[]): StandingRow[] {
  const map = new Map<string, StandingRow>()
  for (const t of teams) {
    map.set(t.noc, {
      noc: t.noc,
      name: t.teamShortName,
      w: t.w,
      l: t.l,
      pct: t.w + t.l > 0 ? t.w / (t.w + t.l) : 0,
    })
  }
  return Array.from(map.values()).sort((a, b) => b.w - a.w || a.l - b.l)
}

interface Props {
  season: string
  competition: string
  eventId: number
  refreshTrigger: number
}

export function Standings({ season, competition, eventId, refreshTrigger }: Props) {
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
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-white text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 w-8">#</th>
                <th className="text-left px-4 py-3">Team</th>
                <th className="text-center px-4 py-3">W</th>
                <th className="text-center px-4 py-3">L</th>
                <th className="text-center px-4 py-3">Pct</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.noc}
                  className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-400">{row.noc}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-green-700">{row.w}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{row.l}</td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {row.pct.toFixed(3).replace(/^0/, '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
