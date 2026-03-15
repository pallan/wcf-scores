export interface Session {
  id: number
  label: string
  /** UTC ISO-8601 start time */
  startUtc: string
}

// BKT World Women's Curling Championship 2026
// Calgary, Canada (MDT = UTC-6), Mar 14–22 2026
export const WWCC_SESSIONS: Session[] = [
  { id: 1,  label: 'Session 1',  startUtc: '2026-03-14T14:30:00Z' }, // SAT 08:30 MDT
  { id: 2,  label: 'Session 2',  startUtc: '2026-03-14T20:00:00Z' }, // SAT 14:00 MDT
  { id: 3,  label: 'Session 3',  startUtc: '2026-03-15T14:30:00Z' }, // SUN 08:30 MDT
  { id: 4,  label: 'Session 4',  startUtc: '2026-03-15T19:30:00Z' }, // SUN 13:30 MDT
  { id: 5,  label: 'Session 5',  startUtc: '2026-03-16T00:30:00Z' }, // SUN 18:30 MDT
  { id: 6,  label: 'Session 6',  startUtc: '2026-03-16T15:00:00Z' }, // MON 09:00 MDT
  { id: 7,  label: 'Session 7',  startUtc: '2026-03-16T20:00:00Z' }, // MON 14:00 MDT
  { id: 8,  label: 'Session 8',  startUtc: '2026-03-17T01:00:00Z' }, // MON 19:00 MDT
  { id: 9,  label: 'Session 9',  startUtc: '2026-03-17T15:00:00Z' }, // TUE 09:00 MDT
  { id: 10, label: 'Session 10', startUtc: '2026-03-17T20:00:00Z' }, // TUE 14:00 MDT
  { id: 11, label: 'Session 11', startUtc: '2026-03-18T01:00:00Z' }, // TUE 19:00 MDT
  { id: 12, label: 'Session 12', startUtc: '2026-03-18T15:00:00Z' }, // WED 09:00 MDT
  { id: 13, label: 'Session 13', startUtc: '2026-03-18T20:00:00Z' }, // WED 14:00 MDT
  { id: 14, label: 'Session 14', startUtc: '2026-03-19T01:00:00Z' }, // WED 19:00 MDT
  { id: 15, label: 'Session 15', startUtc: '2026-03-19T15:00:00Z' }, // THU 09:00 MDT
  { id: 16, label: 'Session 16', startUtc: '2026-03-19T20:00:00Z' }, // THU 14:00 MDT
  { id: 17, label: 'Session 17', startUtc: '2026-03-20T01:00:00Z' }, // THU 19:00 MDT
  { id: 18, label: 'Session 18', startUtc: '2026-03-20T15:00:00Z' }, // FRI 09:00 MDT
  { id: 19, label: 'Session 19', startUtc: '2026-03-20T20:00:00Z' }, // FRI 14:00 MDT
  { id: 20, label: 'Session 20', startUtc: '2026-03-21T01:00:00Z' }, // FRI 19:00 MDT
  { id: 21, label: 'Playoffs',   startUtc: '2026-03-21T15:00:00Z' }, // SAT 09:00 MDT
  { id: 22, label: 'Finals',     startUtc: '2026-03-22T18:00:00Z' }, // SUN 12:00 MDT
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
