import { useState } from 'react'
import { useStandings } from '../hooks/useStandings'
import type { TeamData } from '../types/api'
import type { Session } from '../types/sessions'

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
  sessions: Session[]
  refreshTrigger: number
  onTeamClick?: (noc: string, name: string) => void
}

export function Standings({ season, competition, eventId, sessions, refreshTrigger, onTeamClick }: Props) {
  const { teams, loading, error } = useStandings({ season, competition, eventId, sessions }, refreshTrigger)
  const [mobileOpen, setMobileOpen] = useState(false)

  const rows = deriveStandings(teams)

  const table = (
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
  )

  return (
    <div>
      {loading && <div className="text-center py-12 text-gray-400">Loading…</div>}
      {error && <div className="text-center py-6 text-red-500 text-sm">Error: {error}</div>}

      {!loading && !error && rows.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full lg:inline-block lg:min-w-45">

          {/* Mobile toggle header */}
          <button
            className="lg:hidden w-full flex items-center justify-between px-3 py-2 bg-wcf-house-blue text-white text-sm font-semibold"
            onClick={() => setMobileOpen(o => !o)}
          >
            <span>Standings</span>
            <span className="text-xs">{mobileOpen ? '▲' : '▼'}</span>
          </button>

          {/* Mobile: collapsible */}
          {mobileOpen && <div className="lg:hidden">{table}</div>}

          {/* Desktop: always visible */}
          <div className="hidden lg:block">{table}</div>
        </div>
      )}
    </div>
  )
}
