export interface TeamData {
  noc: string
  teamShortName: string
  total: number
  w: number
  l: number
  winner: boolean | null
  lsfe: boolean
  lsce: boolean
}

export interface EndScore {
  h: string
  a: string
}

export interface Game {
  gamesTitle: string
  sheet: string
  status: 'running' | 'official'
  cEnd: number | null
  homeTeam: TeamData
  awayTeam: TeamData
  ends: Record<string, EndScore>
}
