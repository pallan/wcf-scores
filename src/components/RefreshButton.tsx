import { useState, useEffect } from 'react'

interface Props {
  onRefresh: () => void
  nextRefreshAt: number
}

export function RefreshButton({ onRefresh, nextRefreshAt }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.round((nextRefreshAt - Date.now()) / 1000))
  )

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.round((nextRefreshAt - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(tick)
  }, [nextRefreshAt])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const countdown = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${secs}s`

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        className="text-sm text-blue-700 hover:underline"
      >
        Refresh
      </button>
      <span className="text-xs text-gray-400">
        next in {countdown}
      </span>
    </div>
  )
}
