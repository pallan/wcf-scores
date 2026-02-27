import { useEffect } from 'react'
import { useTeamHistory } from '../hooks/useTeamHistory'
import { flagForNoc } from '../utils/flags'
import type { Session } from '../types/sessions'

const END_KEYS = ['1','2','3','4','5','6','7','8','9','10','EE']

function endDisplay(val: string) {
  if (val === ' ' || val === '') return ''
  if (val === 'X') return 'X'
  return val
}

interface Props {
  noc: string
  teamName: string
  season: string
  competition: string
  eventId: number
  sessions: Session[]
  onClose: () => void
}

export function TeamHistoryModal({ noc, teamName, season, competition, eventId, sessions, onClose }: Props) {
  const { games, loading, error } = useTeamHistory({ season, competition, eventId, sessions }, noc)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const wins = games.filter(({ game, isHome }) =>
    isHome ? game.homeTeam.winner === true : game.awayTeam.winner === true
  ).length
  const losses = games.filter(({ game, isHome }) =>
    isHome ? game.homeTeam.winner === false : game.awayTeam.winner === false
  ).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span>{flagForNoc(noc)}</span>
              <span>{teamName}</span>
            </div>
            {!loading && !error && (
              <div className="text-sm text-gray-500 mt-0.5">
                <span className="font-semibold text-green-700">{wins}W</span>
                {' – '}
                <span className="font-semibold text-gray-500">{losses}L</span>
                {' across '}
                {games.length} game{games.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {loading && <div className="text-center py-12 text-gray-400">Loading results…</div>}
          {error && <div className="text-center py-6 text-red-500 text-sm">Error: {error}</div>}
          {!loading && !error && games.length === 0 && (
            <div className="text-center py-12 text-gray-400">No games found.</div>
          )}

          {games.map(({ sessionLabel, game, isHome }, i) => {
            const team = isHome ? game.homeTeam : game.awayTeam
            const opp  = isHome ? game.awayTeam : game.homeTeam
            const won  = team.winner === true
            const lost = team.winner === false
            const visibleEnds = END_KEYS.filter(k => game.ends[k] !== undefined)

            return (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Game header */}
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{sessionLabel}</span>
                  <span>Sheet {game.sheet}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium text-white text-[11px] ${
                    game.status === 'running' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {game.status === 'running' ? 'LIVE' : 'FINAL'}
                  </span>
                </div>

                {/* Opponent & result */}
                <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <span className="text-gray-400">vs</span>
                    <span>{flagForNoc(opp.noc)}</span>
                    <span className="font-medium">{opp.teamShortName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base">
                      <span className={won ? 'text-green-600' : 'text-gray-800'}>{team.total}</span>
                      <span className="text-gray-400 mx-1">–</span>
                      <span className={lost ? 'text-green-600' : 'text-gray-800'}>{opp.total}</span>
                    </span>
                    {(won || lost) && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        won ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {won ? 'W' : 'L'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini linescore */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="text-left px-3 py-1 font-normal w-24"></th>
                        {visibleEnds.map(k => (
                          <th key={k} className="text-center px-1 py-1 w-6">{k}</th>
                        ))}
                        <th className="text-center px-3 py-1 font-semibold text-gray-500">Tot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: teamName, teamData: team, side: isHome ? 'h' : 'a' as 'h' | 'a', highlight: true },
                        { label: opp.teamShortName, teamData: opp, side: isHome ? 'a' : 'h' as 'h' | 'a', highlight: false },
                      ].map(({ label, teamData, side, highlight }) => (
                        <tr key={side} className={`border-t border-gray-100 ${highlight ? 'bg-blue-50' : ''}`}>
                          <td className={`px-3 py-1.5 font-medium truncate max-w-[96px] ${highlight ? 'text-blue-900' : 'text-gray-600'}`}>
                            {label}
                          </td>
                          {visibleEnds.map(k => {
                            const val = endDisplay(game.ends[k][side])
                            const isScoring = val !== '' && val !== 'X' && Number(val) > 0
                            return (
                              <td key={k} className={`text-center px-1 py-1.5 ${
                                isScoring ? 'font-bold text-blue-700' : 'text-gray-400'
                              }`}>
                                {val}
                              </td>
                            )
                          })}
                          <td className={`text-center px-3 py-1.5 font-bold ${
                            teamData.winner === true ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {teamData.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
