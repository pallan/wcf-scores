import type { Game } from '../types/api'

const BASE_URL = 'https://livescores.worldcurling.org/curlitsse/Result/LiveResults'

export interface FetchParams {
  season: string
  competition: string
  eventId: number
  sessionId: number
}

export async function fetchLiveResults(params: FetchParams): Promise<Game[]> {
  const url = new URL(BASE_URL)
  url.searchParams.set('season', params.season)
  url.searchParams.set('competition', params.competition)
  url.searchParams.set('eventId', String(params.eventId))
  url.searchParams.set('sessionId', String(params.sessionId))
  url.searchParams.set('testMode', 'false')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<Game[]>
}
