import type { Game } from '../types/api'

const END_KEYS = ['1','2','3','4','5','6','7','8','9','10','EE']

function endDisplay(val: string) {
  if (val === ' ' || val === '') return ''
  if (val === 'X') return 'X'
  return val
}

interface Props {
  game: Game
}

export function GameCard({ game }: Props) {
  const { homeTeam, awayTeam, ends, sheet, status, cEnd } = game

  const visibleEnds = END_KEYS.filter(k => ends[k] !== undefined)

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between bg-blue-900 text-white px-3 py-1.5 text-sm">
        <span className="font-semibold">Sheet {sheet}</span>
        <span className="text-xs">
          {status === 'running'
            ? cEnd !== null ? `End ${cEnd}` : 'In progress'
            : 'Final'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          status === 'running' ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {status === 'running' ? 'LIVE' : 'OFFICIAL'}
        </span>
      </div>

      {/* Score table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500 text-xs">
              <th className="text-left px-3 py-1 w-32">Team</th>
              {visibleEnds.map(k => (
                <th key={k} className="text-center px-1 py-1 w-8">{k}</th>
              ))}
              <th className="text-center px-3 py-1 w-10 font-bold text-gray-700">Tot</th>
            </tr>
          </thead>
          <tbody>
            {/* Home team */}
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium text-gray-900 flex items-center gap-1.5">
                {homeTeam.lsce && (
                  <span className="text-yellow-500 text-xs" title="Has hammer">●</span>
                )}
                <span>{homeTeam.teamShortName}</span>
                <span className="text-xs text-gray-400">({homeTeam.w}-{homeTeam.l})</span>
              </td>
              {visibleEnds.map(k => {
                const val = endDisplay(ends[k].h)
                const isScoring = val !== '' && val !== 'X' && Number(val) > 0
                return (
                  <td key={k} className={`text-center px-1 py-2 text-xs ${
                    isScoring ? 'font-bold text-blue-700' : 'text-gray-500'
                  }`}>
                    {val}
                  </td>
                )
              })}
              <td className={`text-center px-3 py-2 font-bold text-base ${
                homeTeam.winner === true ? 'text-green-600' : 'text-gray-800'
              }`}>
                {homeTeam.total}
              </td>
            </tr>

            {/* Away team */}
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium text-gray-900">
                <div className="flex items-center gap-1.5">
                  {awayTeam.lsce && (
                    <span className="text-yellow-500 text-xs" title="Has hammer">●</span>
                  )}
                  <span>{awayTeam.teamShortName}</span>
                  <span className="text-xs text-gray-400">({awayTeam.w}-{awayTeam.l})</span>
                </div>
              </td>
              {visibleEnds.map(k => {
                const val = endDisplay(ends[k].a)
                const isScoring = val !== '' && val !== 'X' && Number(val) > 0
                return (
                  <td key={k} className={`text-center px-1 py-2 text-xs ${
                    isScoring ? 'font-bold text-blue-700' : 'text-gray-500'
                  }`}>
                    {val}
                  </td>
                )
              })}
              <td className={`text-center px-3 py-2 font-bold text-base ${
                awayTeam.winner === true ? 'text-green-600' : 'text-gray-800'
              }`}>
                {awayTeam.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
