export interface Session {
  id: number
  label: string
  /** UTC ISO-8601 start time (source times are CET = UTC+1) */
  startUtc: string
}

// Times are Copenhagen local (CET = UTC+1). Subtract 1h to get UTC.
export const MEN_SESSIONS: Session[] = [
  { id: 1,  label: 'Session 1',   startUtc: '2026-02-24T13:00:00Z' },
  { id: 2,  label: 'Session 2',   startUtc: '2026-02-25T08:00:00Z' },
  { id: 3,  label: 'Session 3',   startUtc: '2026-02-25T18:00:00Z' },
  { id: 4,  label: 'Session 4',   startUtc: '2026-02-26T13:00:00Z' },
  { id: 5,  label: 'Session 5',   startUtc: '2026-02-27T08:00:00Z' },
  { id: 6,  label: 'Session 6',   startUtc: '2026-02-27T18:00:00Z' },
  { id: 7,  label: 'Session 7',   startUtc: '2026-02-28T13:00:00Z' },
  { id: 8,  label: 'Session 8',   startUtc: '2026-03-01T08:00:00Z' },
  { id: 9,  label: 'Session 9',   startUtc: '2026-03-01T18:00:00Z' },
  { id: 10, label: 'Semi-finals', startUtc: '2026-03-02T18:00:00Z' },
  { id: 11, label: 'Finals',      startUtc: '2026-03-03T13:00:00Z' },
]

export const WOMEN_SESSIONS: Session[] = [
  { id: 1,  label: 'Session 1',   startUtc: '2026-02-24T08:00:00Z' },
  { id: 2,  label: 'Session 2',   startUtc: '2026-02-24T18:30:00Z' },
  { id: 3,  label: 'Session 3',   startUtc: '2026-02-25T13:00:00Z' },
  { id: 4,  label: 'Session 4',   startUtc: '2026-02-26T08:00:00Z' },
  { id: 5,  label: 'Session 5',   startUtc: '2026-02-26T18:00:00Z' },
  { id: 6,  label: 'Session 6',   startUtc: '2026-02-27T13:00:00Z' },
  { id: 7,  label: 'Session 7',   startUtc: '2026-02-28T08:00:00Z' },
  { id: 8,  label: 'Session 8',   startUtc: '2026-02-28T18:00:00Z' },
  { id: 9,  label: 'Session 9',   startUtc: '2026-03-01T13:00:00Z' },
  { id: 10, label: 'Semi-finals', startUtc: '2026-03-02T13:00:00Z' },
  { id: 11, label: 'Finals',      startUtc: '2026-03-03T08:00:00Z' },
]

const SESSION_DURATION_MS = 3.5 * 60 * 60 * 1000 // sessions last ~3.5 hours
const PRE_START_WINDOW_MS = 15 * 60 * 1000       // show session if starting within 15 min

/** Returns the session ID that is currently active or about to start, or 0 (latest) if none. */
export function getActiveSession(sessions: Session[]): number {
  const now = Date.now()
  const active = sessions.find(s => {
    const start = new Date(s.startUtc).getTime()
    return now >= start - PRE_START_WINDOW_MS && now <= start + SESSION_DURATION_MS
  })
  return active?.id ?? 0
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short', month: 'short', day: 'numeric',
})
const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric', minute: '2-digit',
})

export function formatSessionDate(startUtc: string) {
  const d = new Date(startUtc)
  return dateFormat.format(d)
}

export function formatSessionTime(startUtc: string) {
  const d = new Date(startUtc)
  return timeFormat.format(d)
}
